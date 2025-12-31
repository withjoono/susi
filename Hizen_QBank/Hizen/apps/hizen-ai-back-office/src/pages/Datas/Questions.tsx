import React, { useContext, useEffect, useState, useCallback } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
// import { db, storage } from '../../services/firebase';
// import {
//   doc,
//   deleteDoc,
//   collection,
//   query,
//   where,
//   getDocs,
// } from 'firebase/firestore';
// import { ref, listAll, deleteObject } from 'firebase/storage';
// import * as Storage from 'firebase/storage';
//#region Graphics
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader as DialogHeaderM,
  IconButton,
  Input,
  Option,
  Select,
  Spinner,
  Tooltip,
  Typography,
} from '@material-tailwind/react';
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { Subjects, SubjectString } from '../../utils';
// import { getQuestions, getLabels } from '../../api/api';
// import { FirebaseContext } from '../../context/FirebaseContext';
import toast from 'react-hot-toast';
import QuestionDialog from '../../components/QuestionDialog';

// Sample data types
interface QuestionDto {
  id: string;
  content: string;
  solution: string;
  answer: string;
  subject: string;
  labels: string[];
}

interface LabelDto {
  id: string;
  content: string;
  subject: string;
}

type SubjectType = 'science' | 'math' | 'english' | 'korean' | 'society';

// Sample questions data
const SAMPLE_QUESTIONS: QuestionDto[] = [
  {
    id: '1',
    content: '다음 중 물의 끓는점은 몇 도인가?',
    solution: '물의 끓는점은 표준 대기압에서 100도씨입니다.',
    answer: '100도',
    subject: 'science',
    labels: ['물리', '온도', '기초과학'],
  },
  {
    id: '2',
    content: '2x + 3 = 7 일 때, x의 값은?',
    solution: '2x = 7 - 3 = 4, 따라서 x = 2',
    answer: '2',
    subject: 'math',
    labels: ['대수', '일차방정식'],
  },
  {
    id: '3',
    content: 'What is the past tense of "go"?',
    solution: 'The past tense of "go" is "went".',
    answer: 'went',
    subject: 'english',
    labels: ['문법', '과거형', '불규칙동사'],
  },
  {
    id: '4',
    content: '다음 중 한국의 수도는?',
    solution: '한국의 수도는 서울입니다.',
    answer: '서울',
    subject: 'korean',
    labels: ['지리', '수도', '한국사'],
  },
  {
    id: '5',
    content: '광합성의 주요 산물은 무엇인가?',
    solution: '광합성을 통해 포도당(글루코스)과 산소가 생성됩니다.',
    answer: '포도당과 산소',
    subject: 'science',
    labels: ['생물', '광합성', '식물'],
  },
  {
    id: '6',
    content: '조선왕조의 건국자는 누구인가?',
    solution: '조선왕조는 이성계(태조)에 의해 건국되었습니다.',
    answer: '이성계',
    subject: 'society',
    labels: ['한국사', '조선', '건국'],
  },
];

// Sample labels data
const SAMPLE_LABELS: Map<string, LabelDto> = new Map([
  ['물리', { id: '물리', content: '물리학', subject: 'science' }],
  ['온도', { id: '온도', content: '온도와 열', subject: 'science' }],
  ['기초과학', { id: '기초과학', content: '기초과학', subject: 'science' }],
  ['대수', { id: '대수', content: '대수학', subject: 'math' }],
  ['일차방정식', { id: '일차방정식', content: '일차방정식', subject: 'math' }],
  ['문법', { id: '문법', content: '영문법', subject: 'english' }],
  ['과거형', { id: '과거형', content: '과거형', subject: 'english' }],
  [
    '불규칙동사',
    { id: '불규칙동사', content: '불규칙동사', subject: 'english' },
  ],
  ['지리', { id: '지리', content: '지리', subject: 'korean' }],
  ['수도', { id: '수도', content: '수도', subject: 'korean' }],
  ['한국사', { id: '한국사', content: '한국사', subject: 'society' }],
  ['생물', { id: '생물', content: '생물학', subject: 'science' }],
  ['광합성', { id: '광합성', content: '광합성', subject: 'science' }],
  ['식물', { id: '식물', content: '식물', subject: 'science' }],
  ['조선', { id: '조선', content: '조선시대', subject: 'society' }],
  ['건국', { id: '건국', content: '건국사', subject: 'society' }],
]);

// Define options for items per page dropdown
const ITEMS_PER_PAGE_OPTIONS = [10, 30, 50];

const Questions = () => {
  // const { user } = useContext(FirebaseContext);

  const [subject, setSubject] = useState<SubjectType>('science');
  const [questions, setQuestions] = useState<QuestionDto[]>([]);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Rename 'limit' state to 'itemsPerPage' and initialize with the first option
  const [itemsPerPage, setItemsPerPage] = useState<number>(
    ITEMS_PER_PAGE_OPTIONS[0],
  );
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);

  // Re-add state for managing the Edit/Add Dialog
  const [editQuestionDialogOpen, setEditQuestionDialogOpen] = useState(false);
  const [questionIdToEdit, setQuestionIdToEdit] = useState<string | null>(null);
  const [questionDataForDialog, setQuestionDataForDialog] =
    useState<QuestionDto | null>(null);

  // --- Add back missing state and handlers ---
  const [keyword, setKeyword] = useState('');
  const [labelsMap, setLabelsMap] = useState<Map<string, LabelDto>>(new Map());
  const [isLabelsLoading, setIsLabelsLoading] = useState<boolean>(false);

  // Handler for items per page change
  const handleItemsPerPageChange = (value: string | undefined) => {
    if (value && !isLoading) {
      const newCount = parseInt(value, 10);
      if (newCount !== itemsPerPage) {
        setItemsPerPage(newCount);
      }
    }
  };

  // --- Pagination Navigation ---
  const goToNextPage = () => {
    if (isLastPage || isLoading || questions.length === 0) return;

    const lastQuestionId = questions[questions.length - 1]?.id;
    if (lastQuestionId) {
      fetchQuestionsForPage(
        currentPageNumber + 1,
        itemsPerPage,
        lastQuestionId,
        'next',
      );
    }
  };

  const goToPreviousPage = () => {
    if (currentPageNumber <= 1 || isLoading || questions.length === 0) return;

    const firstQuestionId = questions[0]?.id;
    if (firstQuestionId) {
      fetchQuestionsForPage(
        currentPageNumber - 1,
        itemsPerPage,
        firstQuestionId,
        'prev',
      );
    }
  };

  // --- Calculated Values ---
  const firstItemNumber =
    totalCount === 0 ? 0 : (currentPageNumber - 1) * itemsPerPage + 1;
  const lastItemNumber = firstItemNumber + questions.length - 1;

  // --- Dialog Handlers ---
  const openEditDialog = (id: string | null) => {
    if (id) {
      const questionToEdit = questions.find((q) => q.id === id);
      if (!questionToEdit) {
        toast.error('Cannot find question data to edit.');
        return;
      }
      setQuestionIdToEdit(id);
      setQuestionDataForDialog({ ...questionToEdit });
    } else {
      setQuestionIdToEdit(null);
      setQuestionDataForDialog({
        id: '',
        subject: subject,
        content: '',
        solution: '',
        answer: '',
        labels: [],
      }); // Default data for new
    }
    setEditQuestionDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditQuestionDialogOpen(false);
    setQuestionIdToEdit(null);
    setQuestionDataForDialog(null);
  };

  // Updated delete logic with sample data
  const handleDeleteQuestion = async () => {
    if (!deleteId || isLoading) return;
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Remove from sample data
      setQuestions((prev) => prev.filter((q) => q.id !== deleteId));
      setTotalCount((prev) => prev - 1);

      toast.success('삭제되었습니다');
      fetchQuestionsForPage(1, itemsPerPage, null, null);
    } catch (error: any) {
      toast.error('삭제 실패');
    } finally {
      setDeleteId(null);
      setIsLoading(false);
    }
  };

  // Fetch questions based on subject, itemsPerPage, and pageToken
  const fetchQuestionsForPage = useCallback(
    async (
      pageNumber: number,
      count: number,
      pageToken: string | null,
      direction: 'prev' | 'next' | null,
    ) => {
      // if (!user) return;
      setIsLoading(true);
      setIsLastPage(false);

      try {
        // Simulate API call with sample data
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Filter questions by subject
        const filteredQuestions = SAMPLE_QUESTIONS.filter(
          (q) => q.subject === subject,
        );

        // Simple pagination simulation
        const startIndex = (pageNumber - 1) * count;
        const endIndex = startIndex + count;
        const paginatedQuestions = filteredQuestions.slice(
          startIndex,
          endIndex,
        );

        setQuestions(paginatedQuestions);
        setTotalCount(filteredQuestions.length);
        setIsLastPage(endIndex >= filteredQuestions.length);
        setCurrentPageNumber(pageNumber);
      } catch (error: any) {
        console.error('Error fetching questions:', error);
        toast.error(`질문 로딩 실패: ${error.message || 'Unknown error'}`);
        setQuestions([]);
        setTotalCount(0);
        setIsLastPage(true);
      } finally {
        setIsLoading(false);
      }
    },
    [subject], // removed user dependency
  );

  // Fetch labels based on the current subject
  const fetchLabels = useCallback(async () => {
    // if (!user || !subject) return;
    setIsLabelsLoading(true);
    console.log(`Fetching labels for subject: ${subject}`);
    try {
      // Simulate API call with sample data
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Filter sample labels by subject
      const filteredLabels = new Map<string, LabelDto>();
      SAMPLE_LABELS.forEach((label, key) => {
        if (label.subject === subject) {
          filteredLabels.set(key, label);
        }
      });

      console.log(`Fetched ${filteredLabels.size} labels`);
      setLabelsMap(filteredLabels);
      console.log('Labels map updated:', filteredLabels);
    } catch (error: any) {
      console.error('Error fetching labels:', error);
      toast.error(`라벨 로딩 실패: ${error.message || 'Unknown error'}`);
      setLabelsMap(new Map()); // Clear map on error
    } finally {
      setIsLabelsLoading(false);
    }
  }, [subject]); // removed user dependency

  // Effect to fetch labels when subject changes
  useEffect(() => {
    fetchLabels();
  }, [fetchLabels]); // fetchLabels is stable due to useCallback

  // Effect to reset pageToken when subject or itemsPerPage changes
  useEffect(() => {
    fetchQuestionsForPage(1, itemsPerPage, null, null);
  }, [fetchQuestionsForPage, itemsPerPage]);

  // Function to get label content or ID
  const getLabelDisplay = (labelId: string): string => {
    const label = labelsMap.get(labelId);
    // Handle cases where label or label.content might be undefined
    return label?.content ?? labelId; // Return content if available, otherwise return the ID
  };

  return (
    <>
      <Breadcrumb pageName="Questions" />
      <Card className="w-full">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none p-4 overflow-visible"
        >
          <div className="mb-4 flex flex-wrap gap-2 md:flex-row md:items-center">
            {Subjects.map((e) => (
              <Button
                key={e}
                variant={subject === e ? 'gradient' : 'text'}
                color="blue-gray"
                size="sm"
                onClick={() => setSubject(e)}
                disabled={isLoading}
              >
                {SubjectString[e]}
              </Button>
            ))}
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex w-full shrink-0 gap-4 md:w-auto">
              <div className="w-full md:w-72">
                <Input
                  label="Search (not implemented)"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  disabled={isLoading}
                  size="md"
                />
              </div>
              <div className="w-full md:w-40">
                <Select
                  label="표시 개수"
                  value={itemsPerPage.toString()}
                  onChange={(value) =>
                    handleItemsPerPageChange(value as string | undefined)
                  }
                  disabled={isLoading}
                  size="md"
                >
                  {ITEMS_PER_PAGE_OPTIONS.map((num) => (
                    <Option key={num} value={num.toString()}>
                      {num} 개씩 보기
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardBody className="overflow-x-auto p-0 w-full">
          <table className="w-full min-w-[800px] text-left table-auto">
            <thead>
              <tr className="bg-blue-gray-50/50">
                <th className="border-b border-blue-gray-100 py-3 px-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-semibold opacity-70"
                  >
                    문제
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 py-3 px-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-semibold opacity-70"
                  >
                    풀이
                  </Typography>
                </th>
                <th className="w-24 border-b border-blue-gray-100 py-3 px-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-semibold opacity-70"
                  >
                    정답
                  </Typography>
                </th>
                <th className="w-40 border-b border-blue-gray-100 py-3 px-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-semibold opacity-70"
                  >
                    라벨
                  </Typography>
                </th>
                <th className="w-16 border-b border-blue-gray-100 py-3 px-4 text-center">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-semibold opacity-70"
                  >
                    수정
                  </Typography>
                </th>
                <th className="w-16 border-b border-blue-gray-100 py-3 px-4 text-center">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-semibold opacity-70"
                  >
                    삭제
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody className="w-full">
              {isLoading && (
                <tr>
                  <td colSpan={6} className="text-center py-10">
                    <Spinner className="h-8 w-8 mx-auto" />
                  </td>
                </tr>
              )}
              {!isLoading && questions.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10">
                    <Typography color="blue-gray">
                      데이터가 없습니다.
                    </Typography>
                  </td>
                </tr>
              )}
              {!isLoading &&
                questions.map((q) => (
                  <tr
                    key={q.id}
                    className="even:bg-blue-gray-50/50 hover:bg-blue-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 border-b border-blue-gray-50 max-w-[250px]">
                      <Typography
                        variant="small"
                        className="font-normal overflow-hidden text-ellipsis whitespace-nowrap"
                        title={q.content}
                        color="black"
                      >
                        {q.content || '-'}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 max-w-[250px]">
                      <Typography
                        variant="small"
                        className="font-normal overflow-hidden text-ellipsis whitespace-nowrap"
                        title={q.solution}
                      >
                        {q.solution || '-'}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-normal">
                        {q.answer || '-'}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 min-w-[160px]">
                      <div className="flex flex-wrap gap-1 items-center">
                        {/* Display spinner if labels are loading */}
                        {isLabelsLoading && <Spinner className="h-4 w-4" />}
                        {!isLabelsLoading &&
                          (q.labels ?? []).slice(0, 2).map((labelId) => (
                            <span
                              key={labelId}
                              className="inline-block bg-gray-200 rounded-full px-2 py-0.5 text-xs font-semibold text-gray-700"
                              title={getLabelDisplay(labelId)} // Tooltip with content or ID
                            >
                              {/* Truncate long label content if necessary */}
                              {getLabelDisplay(labelId).length > 15
                                ? getLabelDisplay(labelId).substring(0, 12) +
                                  '...'
                                : getLabelDisplay(labelId)}
                            </span>
                          ))}
                        {!isLabelsLoading && (q.labels?.length ?? 0) > 2 && (
                          <Tooltip
                            content={(q.labels ?? [])
                              .map(getLabelDisplay)
                              .join(', ')}
                          >
                            <Typography
                              variant="small"
                              className="ml-1 font-medium cursor-default"
                            >
                              +{(q.labels?.length ?? 0) - 2}
                            </Typography>
                          </Tooltip>
                        )}
                        {!isLabelsLoading && (q.labels ?? []).length === 0 && (
                          <Typography variant="small" className="font-normal">
                            No Labels
                          </Typography>
                        )}
                      </div>
                    </td>
                    <td className="py-1 px-4 border-b border-blue-gray-50 text-center">
                      <Tooltip content="Edit Question">
                        <IconButton
                          variant="text"
                          size="sm"
                          onClick={() => openEditDialog(q.id!)}
                        >
                          <PencilIcon className="w-4 h-4 text-gray-700" />
                        </IconButton>
                      </Tooltip>
                    </td>
                    <td className="py-1 px-4 border-b border-blue-gray-50 text-center">
                      <Tooltip content="Delete Question">
                        <IconButton
                          variant="text"
                          color="red"
                          size="sm"
                          onClick={() => setDeleteId(q.id!)}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </CardBody>

        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Showing <span className="font-semibold">{firstItemNumber}</span> -{' '}
            <span className="font-semibold">{lastItemNumber}</span> of{' '}
            <span className="font-semibold">{totalCount}</span> Questions
          </Typography>
          <div className="flex gap-2">
            <Button
              variant="outlined"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPageNumber === 1 || isLoading}
              className="flex items-center gap-1"
            >
              <ChevronLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
            </Button>
            <Button
              variant="outlined"
              size="sm"
              onClick={goToNextPage}
              disabled={isLastPage || isLoading}
              className="flex items-center gap-1"
            >
              Next <ChevronRightIcon strokeWidth={2} className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      {editQuestionDialogOpen && (
        <QuestionDialog
          open={editQuestionDialogOpen}
          questionId={questionIdToEdit}
          subject={subject}
          onClose={handleCloseEditDialog}
          mode="edit" // Or pass mode based on context if needed
        />
      )}

      <Dialog
        open={deleteId !== null}
        size={'sm'}
        handler={() => !isLoading && setDeleteId(null)}
      >
        <DialogHeaderM>문제 삭제 확인</DialogHeaderM>
        <DialogBody>
          <Typography color="blue-gray" className="mb-2">
            ID:{' '}
            <span className="font-mono bg-gray-100 px-1 rounded">
              {deleteId}
            </span>
          </Typography>
          <Typography color="red" className="mb-2">
            이 작업은 되돌릴 수 없습니다.
          </Typography>
          질문을 정말 삭제하시겠습니까? 연관된 이미지 파일도 함께 삭제됩니다.
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setDeleteId(null)}
            disabled={isLoading}
            className="mr-1"
          >
            <span>취소</span>
          </Button>
          <Button
            variant="gradient"
            color="red"
            onClick={handleDeleteQuestion}
            loading={isLoading}
            disabled={isLoading}
          >
            <span>삭제 확인</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default Questions;
