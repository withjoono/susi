import React, { useState, useEffect, useCallback, useContext } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  IconButton,
  Button,
  Tooltip,
  Chip,
  Select,
  Option,
  Spinner,
} from '@material-tailwind/react';
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
// import { FirebaseContext } from '../../context/FirebaseContext';
// import { getTeachers } from '../../api/api';
import toast from 'react-hot-toast';

// Sample data interface
interface TeacherDto {
  email?: string;
  name?: string;
  phone?: string;
  createdAt?: number;
  approvedAt?: number;
  approvedBy?: string;
}

// Sample teachers data
const SAMPLE_TEACHERS: TeacherDto[] = [
  {
    email: 'teacher1@example.com',
    name: '김선생',
    phone: '010-1111-2222',
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    approvedAt: Date.now() - 25 * 24 * 60 * 60 * 1000,
    approvedBy: 'admin@example.com',
  },
  {
    email: 'teacher2@example.com',
    name: '이교사',
    phone: '010-3333-4444',
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    approvedAt: undefined,
    approvedBy: undefined,
  },
  {
    email: 'teacher3@example.com',
    name: '박강사',
    phone: '010-5555-6666',
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    approvedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    approvedBy: 'admin@example.com',
  },
];

// Define options for items per page dropdown
const ITEMS_PER_PAGE_OPTIONS = [10, 30, 50];

const Teachers = () => {
  // const { user } = useContext(FirebaseContext);
  const [teachers, setTeachers] = useState<TeacherDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(
    ITEMS_PER_PAGE_OPTIONS[0],
  );
  const [currentPageToken, setCurrentPageToken] = useState<string | null>(null);
  const [previousPageTokens, setPreviousPageTokens] = useState<string[]>([]);
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
  const [searchKeyword, setSearchKeyword] = useState('');

  // Fetch teachers data with sample data
  const fetchTeachers = useCallback(
    async (limit: number, pageToken: string | null = null) => {
      // if (!user) return;
      setIsLoading(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setTeachers(SAMPLE_TEACHERS);
        setCurrentPageToken(null);
      } catch (error: any) {
        console.error('Error fetching teachers:', error);
        toast.error(
          `선생님 데이터 로딩 실패: ${error.message || 'Unknown error'}`,
        );
        setTeachers([]);
      } finally {
        setIsLoading(false);
      }
    },
    [], // removed user dependency
  );

  // Handle items per page change
  const handleItemsPerPageChange = (value: string | undefined) => {
    if (value && !isLoading) {
      const newCount = parseInt(value, 10);
      if (newCount !== itemsPerPage) {
        setItemsPerPage(newCount);
        setCurrentPageToken(null);
        setPreviousPageTokens([]);
        setCurrentPageNumber(1);
      }
    }
  };

  // Go to next page
  const goToNextPage = () => {
    if (!currentPageToken || isLoading) return;

    // Save the current token for "previous page" navigation
    setPreviousPageTokens((prev) => [...prev, currentPageToken]);
    setCurrentPageNumber((prev) => prev + 1);
    fetchTeachers(itemsPerPage, currentPageToken);
  };

  // Go to previous page
  const goToPreviousPage = () => {
    if (currentPageNumber <= 1 || isLoading) return;

    // Get the token for the previous page
    const newPreviousTokens = [...previousPageTokens];
    const previousToken =
      newPreviousTokens.length > 0
        ? newPreviousTokens[newPreviousTokens.length - 2]
        : null;

    newPreviousTokens.pop(); // Remove the last token
    setPreviousPageTokens(newPreviousTokens);
    setCurrentPageNumber((prev) => prev - 1);

    fetchTeachers(itemsPerPage, previousToken);
  };

  // Initial fetch on component mount and when itemsPerPage changes
  useEffect(() => {
    fetchTeachers(itemsPerPage);
  }, [fetchTeachers, itemsPerPage]);

  // 승인 처리 함수 - 실제 API가 구현되면 이 부분을 수정해야 함
  const handleApprove = (email: string) => {
    toast.error('승인 API가 아직 구현되지 않았습니다.');
  };

  // 날짜 포맷 함수
  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Breadcrumb pageName="선생님 회원 관리" />
      <Card className="w-full">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none p-4 overflow-visible"
        >
          <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <Typography variant="h5" color="blue-gray">
                선생님 회원 목록
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                모든 선생님 회원 정보를 관리합니다
              </Typography>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex w-full shrink-0 gap-4 md:w-auto">
              <div className="w-full md:w-72">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="검색어 입력..."
                    className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-10 pr-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    disabled={isLoading}
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">
                    <MagnifyingGlassIcon className="h-4 w-4" />
                  </span>
                </div>
              </div>
              <div className="w-full md:w-40">
                <Select
                  label="표시 개수"
                  value={itemsPerPage.toString()}
                  onChange={(value) => handleItemsPerPageChange(value)}
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
                    이름
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 py-3 px-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-semibold opacity-70"
                  >
                    이메일
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 py-3 px-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-semibold opacity-70"
                  >
                    전화번호
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 py-3 px-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-semibold opacity-70"
                  >
                    가입일
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 py-3 px-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-semibold opacity-70"
                  >
                    상태
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 py-3 px-4 text-center">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-semibold opacity-70"
                  >
                    작업
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
              {!isLoading && teachers.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10">
                    <Typography color="blue-gray">데이터가 없습니다</Typography>
                  </td>
                </tr>
              )}
              {!isLoading &&
                teachers.length > 0 &&
                teachers.map((teacher, index) => (
                  <tr
                    key={index}
                    className="even:bg-blue-gray-50/50 hover:bg-blue-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-medium">
                        {teacher.name}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-normal">
                        {teacher.email}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-normal">
                        {teacher.phone}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-normal">
                        {formatDate(teacher.createdAt)}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50">
                      <div className="w-max">
                        <Chip
                          size="sm"
                          variant="ghost"
                          value={teacher.approvedAt ? '승인됨' : '승인 대기중'}
                          color={teacher.approvedAt ? 'green' : 'amber'}
                        />
                      </div>
                    </td>
                    <td className="py-1 px-4 border-b border-blue-gray-50 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        {!teacher.approvedAt && (
                          <Button
                            size="sm"
                            color="green"
                            variant="gradient"
                            className="flex items-center gap-2 py-1"
                            onClick={() =>
                              teacher.email && handleApprove(teacher.email)
                            }
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                            승인
                          </Button>
                        )}

                        <IconButton variant="text" size="sm">
                          <PencilIcon className="h-4 w-4 text-gray-700" />
                        </IconButton>

                        <IconButton variant="text" size="sm" color="red">
                          <TrashIcon className="h-4 w-4" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </CardBody>

        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            {teachers.length > 0 ? `Showing ${teachers.length} Items` : ''}
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
              disabled={!currentPageToken || isLoading}
              className="flex items-center gap-1"
            >
              Next <ChevronRightIcon strokeWidth={2} className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default Teachers;
