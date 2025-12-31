import React, { useEffect, useState, useCallback, useMemo } from 'react';
// import { db, storage } from '../services/firebase';
// import {
//   doc,
//   setDoc,
//   addDoc,
//   collection,
//   getDoc,
//   getDocs,
//   query,
//   where,
//   documentId,
// } from 'firebase/firestore';
// import { ref, getDownloadURL } from 'firebase/storage';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Input,
  Spinner,
  Tooltip,
  IconButton,
  Select,
  Option,
} from '@material-tailwind/react';
import { SubjectString, SubjectDetails } from '../utils';
import {
  TrashIcon,
  PlusIcon,
  ArrowUpTrayIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from '@heroicons/react/24/outline';
import short from 'short-uuid';
import toast from 'react-hot-toast';
import _isEqual from 'lodash-es/isEqual';
import LexicalEditor from './LexicalEditor';
import { useUndoRedoState } from '../hooks/useUndoRedoState';
import AddLabelDialog from './AddLabelDialog';

interface Label {
  id: string;
  content: string;
}

// Sample data interface
interface QuestionDto {
  id?: string;
  content?: string;
  solution?: string;
  answer?: string;
  subject?: string;
  subjectDetail?: string;
  labels?: string[];
  images?: string[];
}

type SubjectType = 'science' | 'math' | 'english' | 'korean' | 'society';

// Simplified function - no Firebase processing
const processHtmlWithImageUrls = async (
  htmlString: string | null | undefined,
  questionId: string,
): Promise<string> => {
  return htmlString || '';
};

interface QuestionDialogProps {
  open: boolean;
  questionId: string | null;
  subject: SubjectType;
  onClose: () => void;
  mode?: 'edit' | 'review';
}

const QuestionDialog: React.FC<QuestionDialogProps> = ({
  open,
  questionId,
  subject,
  onClose,
  mode = 'edit',
}) => {
  const [
    editedQuestion,
    setEditedQuestionWithHistory,
    undo,
    redo,
    canUndo,
    canRedo,
  ] = useUndoRedoState<QuestionDto | null>(null);
  const [originalQuestionData, setOriginalQuestionData] =
    useState<QuestionDto | null>(null);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [fetchedLabels, setFetchedLabels] = useState<Label[]>([]);
  const [isFetchingLabels, setIsFetchingLabels] = useState<boolean>(false);
  const [imageBlobs, setImageBlobs] = useState<{ [key: string]: Blob } | null>(
    null,
  );
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string } | null>(
    null,
  );
  const [isLoadingImages, setIsLoadingImages] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isAddLabelDialogOpen, setIsAddLabelDialogOpen] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!questionId || !open) return;

      setIsLoadingData(true);
      setEditedQuestionWithHistory(null);
      setOriginalQuestionData(null);
      setImageBlobs(null);
      setImageUrls(null);
      setIsLoadingImages(false);

      try {
        // Simulate data loading with sample data
        await new Promise((resolve) => setTimeout(resolve, 500));

        const sampleData: QuestionDto = {
          id: questionId,
          content: '샘플 문제 내용입니다.',
          solution: '샘플 풀이입니다.',
          answer: '샘플 답',
          subject: subject,
          subjectDetail: '',
          labels: [],
          images: [],
        };

        setOriginalQuestionData(sampleData);
        setEditedQuestionWithHistory(sampleData);

        // Sample labels
        setFetchedLabels([
          { id: '1', content: '샘플 라벨 1' },
          { id: '2', content: '샘플 라벨 2' },
        ]);
      } catch (error) {
        console.error('Error loading question data:', error);
        toast.error('문제 데이터 로딩 실패');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [questionId, open, subject, setEditedQuestionWithHistory]);

  useEffect(() => {
    if (open) {
      if (questionId && originalQuestionData) {
        setEditedQuestionWithHistory(originalQuestionData);
      } else if (!questionId) {
        const newQuestionBase: QuestionDto = {
          id: '',
          subject: subject,
          subjectDetail: undefined,
          content: '',
          solution: '',
          answer: '',
          labels: [],
          images: [],
        };
        setEditedQuestionWithHistory(newQuestionBase);
      }
    } else {
      setEditedQuestionWithHistory(null);
    }
  }, [open, questionId, originalQuestionData, subject]);

  const hasChanges = useMemo(() => {
    if (!open || !editedQuestion || !originalQuestionData) {
      return false;
    }

    const currentLabels = [...(editedQuestion.labels ?? [])].sort();
    const initialLabels = [...(originalQuestionData.labels ?? [])].sort();

    return (
      editedQuestion.content !== originalQuestionData.content ||
      editedQuestion.solution !== originalQuestionData.solution ||
      editedQuestion.answer !== originalQuestionData.answer ||
      editedQuestion.subject !== originalQuestionData.subject ||
      editedQuestion.subjectDetail !== originalQuestionData.subjectDetail ||
      !_isEqual(currentLabels, initialLabels)
    );
  }, [editedQuestion, originalQuestionData, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedQuestionWithHistory((prev) =>
      prev ? { ...prev, [name]: value } : null,
    );
  };

  const handleSelectChange = (
    name: keyof QuestionDto,
    value: string | undefined,
  ) => {
    setEditedQuestionWithHistory((prev) => {
      if (!prev) return null;
      const newState = { ...prev, [name]: value };
      if (name === 'subject' && value !== prev.subject) {
        newState.subjectDetail = undefined;
      }
      return newState;
    });
  };

  const handleLabelRemove = (labelIdToRemove: string) => {
    setEditedQuestionWithHistory((prev) =>
      prev
        ? {
            ...prev,
            labels: (prev.labels ?? []).filter((id) => id !== labelIdToRemove),
          }
        : null,
    );
    setFetchedLabels((prev) => prev.filter((l) => l.id !== labelIdToRemove));
  };

  const handleSaveClick = async () => {
    if (!editedQuestion || !hasChanges || isSaving) return;

    setIsSaving(true);
    try {
      const dataToSave = JSON.parse(JSON.stringify(editedQuestion));

      console.warn('Placeholder: Image saving logic not implemented yet!');

      let savedDocId: string | null = questionId;

      if (questionId) {
        if ('id' in dataToSave && dataToSave.id === questionId) {
          delete dataToSave.id;
        }
        // const questionRef = doc(db, 'questions', questionId);
        // await setDoc(questionRef, dataToSave, { merge: true });
        toast.success('문제 수정 완료!');
      } else {
        // const collectionRef = collection(db, 'questions');
        if ('id' in dataToSave) {
          delete dataToSave.id;
        }
        // const newDocRef = await addDoc(collectionRef, dataToSave);
        // savedDocId = newDocRef.id;
        console.log('New document added with ID:', savedDocId);
        toast.success('새 문제 추가 완료!');
      }

      onClose();
    } catch (error) {
      console.error('Save failed:', error);
      toast.error(
        `저장 실패: ${
          error instanceof Error ? error.message : 'Unknown Firestore error'
        }`,
      );
      setIsSaving(false);
    }
  };

  const handleCloseOrNextClick = () => {
    if (!isSaving) {
      onClose();
    }
  };

  const subjectDetails = useMemo(() => {
    const currentSubject = editedQuestion?.subject;
    return currentSubject ? SubjectDetails[currentSubject] ?? [] : [];
  }, [editedQuestion?.subject]);

  const dialogHandler = useCallback(
    (isOpen: boolean) => {
      if (!isOpen && !isSaving && !isLoadingData) {
        onClose();
      }
    },
    [isSaving, isLoadingData, onClose],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isSaving || isLoadingData || mode === 'review') return;

      const isModifier = event.ctrlKey || event.metaKey;

      if (isModifier && event.key === 'z') {
        event.preventDefault();
        if (canUndo) {
          console.log('Undo triggered');
          undo();
        }
      } else if (
        isModifier &&
        (event.key === 'y' || (event.shiftKey && event.key === 'Z'))
      ) {
        event.preventDefault();
        if (canRedo) {
          console.log('Redo triggered');
          redo();
        }
      }
    };

    if (open) {
      window.addEventListener('keydown', handleKeyDown);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, undo, redo, canUndo, canRedo, isSaving, isLoadingData, mode]);

  const handleOpenAddLabelDialog = () => {
    setIsAddLabelDialogOpen(true);
  };

  const handleCloseAddLabelDialog = () => {
    setIsAddLabelDialogOpen(false);
  };

  // Handler to update labels from the AddLabelDialog
  const handleLabelsUpdate = (updatedLabelIds: string[]) => {
    setEditedQuestionWithHistory((prev) =>
      prev
        ? {
            ...prev,
            labels: updatedLabelIds,
          }
        : null,
    );
    // Optionally, re-fetch label details if needed, or update fetchedLabels state directly
    // For simplicity, we assume the main dialog will refresh or handle displaying new label content
  };

  if (isLoadingData) {
    return (
      <Dialog
        open={open}
        handler={() => {}}
        size="xl"
        className="flex justify-center items-center min-h-[200px]"
      >
        <Spinner className="h-12 w-12" />
      </Dialog>
    );
  }

  if (!open || !editedQuestion || !originalQuestionData) {
    return null;
  }

  const handleContentChange = (html: string) => {
    setEditedQuestionWithHistory((prev) =>
      prev ? { ...prev, content: html } : null,
    );
  };

  const handleSolutionChange = (html: string) => {
    setEditedQuestionWithHistory((prev) =>
      prev ? { ...prev, solution: html } : null,
    );
  };

  return (
    <Dialog
      open={open}
      size={'xl'}
      handler={dialogHandler}
      className="flex flex-col max-h-[90vh]"
    >
      <DialogHeader className="flex-shrink-0 justify-between">
        {(mode === 'edit'
          ? questionId
            ? '문제 수정'
            : '새 문제 추가'
          : `질문 검토 `) +
          (editedQuestion.id ? ` (${editedQuestion.id})` : '')}
        {isSaving && <Spinner className="w-5 h-5 ml-2 inline-block" />}
      </DialogHeader>

      {/* Always show Undo/Redo controls */}
      <div className="flex-shrink-0 flex items-center gap-1 px-4 py-2 border-b border-t">
        <Tooltip content="Undo (Ctrl+Z)">
          <IconButton
            variant="text"
            size="sm"
            onClick={undo}
            disabled={!canUndo || isSaving || isLoadingData}
          >
            <ArrowUturnLeftIcon className="h-5 w-5" />
          </IconButton>
        </Tooltip>
        <Tooltip content="Redo (Ctrl+Y)">
          <IconButton
            variant="text"
            size="sm"
            onClick={redo}
            disabled={!canRedo || isSaving || isLoadingData}
          >
            <ArrowUturnRightIcon className="h-5 w-5" />
          </IconButton>
        </Tooltip>
      </div>

      <DialogBody
        divider
        className="flex-grow overflow-y-auto p-4 flex flex-col gap-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="과목 분류"
            value={editedQuestion.subject ?? ''}
            onChange={(val) => handleSelectChange('subject', val)}
            disabled={isSaving}
            name="subject"
          >
            {Object.keys(SubjectString).map((subjKey) => (
              <Option key={subjKey} value={subjKey}>
                {SubjectString[subjKey as SubjectType]}
              </Option>
            ))}
          </Select>
          <Select
            label="세부 과목"
            key={editedQuestion.subject}
            value={editedQuestion.subjectDetail ?? ''}
            onChange={(val) => handleSelectChange('subjectDetail', val)}
            disabled={isSaving || !editedQuestion.subject}
            name="subjectDetail"
          >
            {subjectDetails.map((detail) => (
              <Option value={detail} key={detail}>
                {detail}
              </Option>
            ))}
          </Select>
        </div>

        {/* Labels Section - Title and content grouped to manage spacing correctly */}
        <div>
          <Typography variant="h6" color="blue-gray" className="mb-1">
            Labels
          </Typography>
          <div className="border p-3 rounded-md shadow-sm">
            <div className="flex items-center gap-2 mb-3 flex-wrap min-h-[2rem]">
              {isFetchingLabels && <Spinner className="h-4 w-4" />}
              {!isFetchingLabels &&
                fetchedLabels.map((label) => (
                  <div
                    key={label.id}
                    className="flex items-center bg-gray-200 rounded-full px-2 py-0.5"
                  >
                    <span className="text-xs font-semibold text-gray-700 mr-1">
                      {label.content}
                    </span>
                    {/* Always show remove button if not saving */}
                    <IconButton
                      variant="text"
                      color="gray"
                      size="sm"
                      className="rounded-full w-4 h-4 p-0 ml-1"
                      onClick={() => handleLabelRemove(label.id)}
                      disabled={isSaving}
                    >
                      <span className="text-xs font-semibold">&times;</span>
                    </IconButton>
                  </div>
                ))}
              {!isFetchingLabels && fetchedLabels.length === 0 && (
                <Typography variant="small" color="gray">
                  No labels.
                </Typography>
              )}
            </div>
            {mode === 'edit' && (
              <Button
                variant="outlined"
                size="sm"
                onClick={handleOpenAddLabelDialog}
                disabled={isSaving || isLoadingData}
                className="mt-2 flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Add Label
              </Button>
            )}
          </div>
        </div>

        <div>
          <Typography variant="h6" color="blue-gray" className="mb-1">
            문제 내용 (Content)
          </Typography>
          <LexicalEditor
            initialHtml={editedQuestion.content}
            onChange={handleContentChange}
            stableKey={
              questionId ? `${questionId}-content` : 'new-question-content'
            }
          />
        </div>

        <div>
          <Typography variant="h6" color="blue-gray" className="mb-1">
            풀이 (Solution)
          </Typography>
          <LexicalEditor
            initialHtml={editedQuestion.solution}
            onChange={handleSolutionChange}
            stableKey={
              questionId ? `${questionId}-solution` : 'new-question-solution'
            }
          />
        </div>

        <div>
          <Input
            type="text"
            label="정답 (Answer)"
            name="answer"
            value={editedQuestion.answer ?? ''}
            onChange={handleInputChange}
            disabled={isSaving || isLoadingData}
            size="lg"
          />
        </div>
      </DialogBody>

      <DialogFooter className="flex-shrink-0 justify-end gap-2 border-t pt-4">
        {mode === 'edit' ? (
          <>
            <Button
              variant="text"
              color="red"
              onClick={handleCloseOrNextClick}
              disabled={isSaving || isLoadingData}
            >
              닫기 (Close)
            </Button>
            <Button
              variant="gradient"
              color="green"
              onClick={handleSaveClick}
              loading={isSaving}
              disabled={
                !hasChanges || isSaving || isLoadingImages || isLoadingData
              }
            >
              저장 (Save)
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="text"
              color="blue-gray"
              onClick={handleCloseOrNextClick}
              disabled={isSaving || isLoadingData}
            >
              다음 (Next)
            </Button>
            <Button
              variant="gradient"
              color="green"
              onClick={handleSaveClick}
              loading={isSaving}
              disabled={
                !hasChanges || isSaving || isLoadingImages || isLoadingData
              }
            >
              저장 후 다음 (Save & Next)
            </Button>
          </>
        )}
      </DialogFooter>

      {/* Render AddLabelDialog */}
      {editedQuestion?.subject && (
        <AddLabelDialog
          open={isAddLabelDialogOpen}
          subject={editedQuestion.subject}
          currentLabels={editedQuestion.labels ?? []}
          onClose={handleCloseAddLabelDialog}
          onLabelsUpdate={handleLabelsUpdate}
        />
      )}
    </Dialog>
  );
};

export default QuestionDialog;
