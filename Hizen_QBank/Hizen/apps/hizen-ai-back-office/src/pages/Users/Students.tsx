import React, { useContext, useEffect, useState, useCallback } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  IconButton,
  Button,
  Select,
  Option,
  Spinner,
} from '@material-tailwind/react';
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
// import { FirebaseContext } from '../../context/FirebaseContext';
// import { getStudents } from '../../api/api';
import toast from 'react-hot-toast';

// Sample data interface
interface StudentDto {
  username: string;
  createdAt: number;
  email: string;
  school: string;
  grade: number;
  credit: number;
  address: string;
  membership: {
    startAt: number;
    endAt: number;
  };
}

// Sample students data
const SAMPLE_STUDENTS: StudentDto[] = [
  {
    username: '김학생',
    email: 'student1@example.com',
    school: '서울고등학교',
    grade: 2,
    credit: 100,
    address: '서울특별시 강남구',
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
    membership: {
      startAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
      endAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    },
  },
  {
    username: '이학생',
    email: 'student2@example.com',
    school: '부산중학교',
    grade: 3,
    credit: 85,
    address: '부산광역시 해운대구',
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    membership: {
      startAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
      endAt: Date.now() + 10 * 24 * 60 * 60 * 1000,
    },
  },
];

// Define options for items per page dropdown
const ITEMS_PER_PAGE_OPTIONS = [10, 30, 50];

const Students = () => {
  // const { user } = useContext(FirebaseContext);
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(
    ITEMS_PER_PAGE_OPTIONS[0],
  );
  const [currentPageToken, setCurrentPageToken] = useState<string | null>(null);
  const [previousPageTokens, setPreviousPageTokens] = useState<string[]>([]);
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
  const [searchKeyword, setSearchKeyword] = useState('');

  // Fetch students data with sample data
  const fetchStudents = useCallback(
    async (limit: number, pageToken: string | null = null) => {
      // if (!user) return;
      setIsLoading(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setStudents(SAMPLE_STUDENTS);
        setCurrentPageToken(null);
      } catch (error: any) {
        console.error('Error fetching students:', error);
        toast.error(
          `학생 데이터 로딩 실패: ${error.message || 'Unknown error'}`,
        );
        setStudents([]);
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
    fetchStudents(itemsPerPage, currentPageToken);
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

    fetchStudents(itemsPerPage, previousToken);
  };

  // Initial fetch on component mount and when itemsPerPage changes
  useEffect(() => {
    fetchStudents(itemsPerPage);
  }, [fetchStudents, itemsPerPage]);

  // Format date for display
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <>
      <Breadcrumb pageName="학생 회원 관리" />
      <Card className="w-full">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none p-4 overflow-visible"
        >
          <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <Typography variant="h5" color="blue-gray">
                학생 회원 목록
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                모든 학생 회원 정보를 관리합니다
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
                    학교
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 py-3 px-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-semibold opacity-70"
                  >
                    학년
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 py-3 px-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-semibold opacity-70"
                  >
                    크레딧
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
                    멤버십 기간
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
                  <td colSpan={8} className="text-center py-10">
                    <Spinner className="h-8 w-8 mx-auto" />
                  </td>
                </tr>
              )}
              {!isLoading && students.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10">
                    <Typography color="blue-gray">데이터가 없습니다</Typography>
                  </td>
                </tr>
              )}
              {!isLoading &&
                students.map((student, index) => (
                  <tr
                    key={index}
                    className="even:bg-blue-gray-50/50 hover:bg-blue-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-normal">
                        {student.username}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-normal">
                        {student.email}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-normal">
                        {student.school}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-normal">
                        {student.grade}학년
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-normal">
                        {student.credit}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-normal">
                        {formatDate(student.createdAt)}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-normal">
                        {formatDate(student.membership.startAt)} ~{' '}
                        {formatDate(student.membership.endAt)}
                      </Typography>
                    </td>
                    <td className="py-1 px-4 border-b border-blue-gray-50 text-center">
                      <div className="flex gap-2 justify-center">
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
            {students.length > 0 ? `Showing ${students.length} Items` : ''}
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

export default Students;
