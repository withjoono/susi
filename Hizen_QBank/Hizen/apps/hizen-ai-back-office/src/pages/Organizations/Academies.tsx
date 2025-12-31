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
  Spinner,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option,
} from '@material-tailwind/react';
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BuildingLibraryIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
// import { FirebaseContext } from '../../context/FirebaseContext';
// import {
//   getAcademies,
//   createAcademy,
//   getDistributors,
//   deleteAcademy,
// } from '../../api/api';
import toast from 'react-hot-toast';

// Sample data interfaces
interface AcademyDto {
  id?: string;
  name?: string;
  address?: string;
  phone?: string;
  distributorId?: string;
  distributorName?: string;
  createdAt?: number;
  approvedAt?: number;
  approvedBy?: string;
}

interface DistributorDto {
  id?: string;
  name?: string;
}

// Sample data
const SAMPLE_ACADEMIES: AcademyDto[] = [
  {
    id: '1',
    name: '스마트 아카데미',
    address: '서울특별시 강남구 역삼로 123',
    phone: '02-1234-5678',
    distributorId: '1',
    distributorName: '에듀에이전시',
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
    approvedAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    approvedBy: 'admin@example.com',
  },
  {
    id: '2',
    name: '미래교육센터',
    address: '부산광역시 해운대구 센텀로 456',
    phone: '051-9876-5432',
    distributorId: '2',
    distributorName: '스마트러닝',
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    approvedAt: undefined,
    approvedBy: undefined,
  },
];

const SAMPLE_DISTRIBUTORS: DistributorDto[] = [
  { id: '1', name: '에듀에이전시' },
  { id: '2', name: '스마트러닝' },
  { id: '3', name: '학습미래' },
];

// Define options for items per page dropdown
const ITEMS_PER_PAGE_OPTIONS = [10, 30, 50];

const Academies = () => {
  // const { user } = useContext(FirebaseContext);
  const [academies, setAcademies] = useState<AcademyDto[]>([]);
  const [distributors, setDistributors] = useState<DistributorDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(
    ITEMS_PER_PAGE_OPTIONS[0],
  );
  const [currentPageToken, setCurrentPageToken] = useState<string | null>(null);
  const [previousPageTokens, setPreviousPageTokens] = useState<string[]>([]);
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isLastPage, setIsLastPage] = useState<boolean>(false);

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    distributorId: '',
    distributorName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch academies data with sample data
  const fetchAcademies = useCallback(
    async (
      pageNumber: number,
      count: number,
      pageToken: string | null = null,
      direction: 'prev' | 'next' | null = null,
    ) => {
      // if (!user) return;
      setIsLoading(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const startIndex = (pageNumber - 1) * count;
        const endIndex = startIndex + count;
        const paginatedAcademies = SAMPLE_ACADEMIES.slice(startIndex, endIndex);

        setAcademies(paginatedAcademies);
        setCurrentPageToken(
          endIndex >= SAMPLE_ACADEMIES.length ? null : 'next',
        );
        setIsLastPage(endIndex >= SAMPLE_ACADEMIES.length);
        setCurrentPageNumber(pageNumber);
      } catch (error: any) {
        console.error('Error fetching academies:', error);
        toast.error(
          `학원 데이터 로딩 실패: ${error.message || 'Unknown error'}`,
        );
        setAcademies([]);
        setIsLastPage(true);
      } finally {
        setIsLoading(false);
      }
    },
    [], // removed user dependency
  );

  // Fetch distributors for dropdown with sample data
  const fetchDistributors = useCallback(async () => {
    // if (!user) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setDistributors(SAMPLE_DISTRIBUTORS);
    } catch (error: any) {
      console.error('Error fetching distributors:', error);
      toast.error(
        `영업 지사 데이터 로딩 실패: ${error.message || 'Unknown error'}`,
      );
    }
  }, []); // removed user dependency

  // Handle items per page change
  const handleItemsPerPageChange = (value: string | undefined) => {
    if (value && !isLoading) {
      const newCount = parseInt(value, 10);
      if (newCount !== itemsPerPage) {
        setItemsPerPage(newCount);
        fetchAcademies(1, newCount, null, null);
      }
    }
  };

  // --- Pagination Navigation ---
  const goToNextPage = () => {
    if (isLastPage || isLoading || academies.length === 0) return;

    const lastAcademyId = academies[academies.length - 1]?.id;
    if (lastAcademyId) {
      fetchAcademies(
        currentPageNumber + 1,
        itemsPerPage,
        lastAcademyId,
        'next',
      );
    }
  };

  const goToPreviousPage = () => {
    if (currentPageNumber <= 1 || isLoading || academies.length === 0) return;

    const firstAcademyId = academies[0]?.id;
    if (firstAcademyId) {
      fetchAcademies(
        currentPageNumber - 1,
        itemsPerPage,
        firstAcademyId,
        'prev',
      );
    }
  };

  // --- Calculated Values ---
  const totalCount = academies.length; // This would ideally come from the API response
  const firstItemNumber =
    totalCount === 0 ? 0 : (currentPageNumber - 1) * itemsPerPage + 1;
  const lastItemNumber = firstItemNumber + academies.length - 1;

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle distributor selection
  const handleDistributorChange = (value: string | undefined) => {
    if (!value) return;

    const selectedDistributor = distributors.find((d) => d.id === value);
    if (selectedDistributor) {
      setFormData((prev) => ({
        ...prev,
        distributorId: selectedDistributor.id || '',
        distributorName: selectedDistributor.name || '',
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // if (!user) return;

    // Validate form data
    if (!formData.name) {
      toast.error('학원명은 필수 항목입니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('학원이 성공적으로 등록되었습니다.');
      setOpenDialog(false);
      setFormData({
        name: '',
        address: '',
        phone: '',
        distributorId: '',
        distributorName: '',
      });
      // Refresh academies list
      fetchAcademies(1, itemsPerPage, null, null);
    } catch (error: any) {
      console.error('Error creating academy:', error);
      toast.error(`학원 등록 실패: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initial fetch on component mount and when itemsPerPage changes
  useEffect(() => {
    fetchAcademies(1, itemsPerPage, null, null);
    fetchDistributors();
  }, [fetchAcademies, fetchDistributors]);

  // 승인 처리 함수 - 실제 API가 구현되면 이 부분을 수정해야 함
  const handleApprove = (id: string) => {
    toast.error('승인 API가 아직 구현되지 않았습니다.');
  };

  // 학원 삭제 함수 - Sample data implementation
  const handleDelete = async (id: string, name: string) => {
    // if (!user || !id) return;
    if (!id) return;

    if (!window.confirm(`"${name}" 학원을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Remove from sample data
      setAcademies((prev) => prev.filter((academy) => academy.id !== id));

      toast.success('학원이 성공적으로 삭제되었습니다.');
      // 학원 목록 새로고침
      fetchAcademies(1, itemsPerPage, null, null);
    } catch (error: any) {
      console.error('학원 삭제 중 오류 발생:', error);
      toast.error(`삭제 실패: ${error.message || 'Unknown error'}`);
    }
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
      <Breadcrumb pageName="학원 관리" />
      <Card className="w-full">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none p-4 overflow-visible"
        >
          <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <Typography variant="h5" color="blue-gray">
                학원 목록
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                모든 학원 정보를 관리합니다
              </Typography>
            </div>
            <div>
              <Button
                className="flex items-center gap-2"
                size="sm"
                onClick={() => setOpenDialog(true)}
              >
                <PlusIcon className="h-4 w-4" color="black" />
                <Typography color="black">새 학원 추가</Typography>
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex w-full shrink-0 gap-4 md:w-auto">
              <div className="w-full md:w-72">
                <Input
                  label="검색어"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  disabled={isLoading}
                  size="md"
                />
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
                    학원명
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 py-3 px-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-semibold opacity-70"
                  >
                    영업 지사
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
                    주소
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
                <th className="w-24 border-b border-blue-gray-100 py-3 px-4 text-center">
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
                  <td colSpan={7} className="text-center py-10">
                    <Spinner className="h-8 w-8 mx-auto" />
                  </td>
                </tr>
              )}
              {!isLoading && academies.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10">
                    <Typography color="blue-gray">
                      데이터가 없습니다.
                    </Typography>
                  </td>
                </tr>
              )}
              {!isLoading &&
                academies.map((academy) => (
                  <tr
                    key={academy.id}
                    className="even:bg-blue-gray-50/50 hover:bg-blue-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 border-b border-blue-gray-50 max-w-[200px]">
                      <Typography
                        variant="small"
                        className="font-normal overflow-hidden text-ellipsis whitespace-nowrap"
                        title={academy.name}
                      >
                        {academy.name || '-'}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-normal">
                        {academy.distributorName || '-'}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-normal">
                        {academy.phone || '-'}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 max-w-[200px]">
                      <Typography
                        variant="small"
                        className="font-normal overflow-hidden text-ellipsis whitespace-nowrap"
                        title={academy.address}
                      >
                        {academy.address || '-'}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-normal">
                        {formatDate(academy.createdAt)}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50">
                      <div className="w-max">
                        <Chip
                          size="sm"
                          variant="ghost"
                          value={academy.approvedAt ? '승인됨' : '승인 대기중'}
                          color={academy.approvedAt ? 'green' : 'amber'}
                        />
                      </div>
                    </td>
                    <td className="py-1 px-4 border-b border-blue-gray-50 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        {!academy.approvedAt && (
                          <Tooltip content="승인하기">
                            <IconButton
                              variant="text"
                              size="sm"
                              onClick={() =>
                                academy.id && handleApprove(academy.id)
                              }
                            >
                              <CheckCircleIcon className="h-4 w-4 text-green-500" />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip content="편집">
                          <IconButton variant="text" size="sm">
                            <PencilIcon className="h-4 w-4 text-gray-700" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip content="삭제">
                          <IconButton
                            variant="text"
                            color="red"
                            size="sm"
                            onClick={() =>
                              academy.id &&
                              handleDelete(academy.id, academy.name || '학원')
                            }
                          >
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </div>
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
            <span className="font-semibold">{totalCount}</span> Academies
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

      {/* Add Academy Dialog */}
      <Dialog open={openDialog} handler={() => setOpenDialog(!openDialog)}>
        <DialogHeader>새 학원 추가</DialogHeader>
        <DialogBody divider>
          <div className="grid gap-6">
            <Input
              label="학원명"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <Select
              label="영업 지사 선택"
              value={formData.distributorId}
              onChange={handleDistributorChange}
            >
              {distributors.map((distributor) => (
                <Option key={distributor.id} value={distributor.id}>
                  {distributor.name}
                </Option>
              ))}
            </Select>
            <Input
              label="전화번호"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
            <Input
              label="주소"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setOpenDialog(false)}
            disabled={isSubmitting}
            className="mr-1"
          >
            <span>취소</span>
          </Button>
          <Button
            variant="gradient"
            color="blue"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            <span>등록하기</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default Academies;
