import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  IconButton,
  Button,
  Tooltip,
  Chip,
} from '@material-tailwind/react';
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

const DistributorMembers = () => {
  // 더미 데이터 추가
  const [members, setMembers] = useState<DistributorMemberDto[]>([
    {
      name: '김총판',
      email: 'dist1@example.com',
      phone: '010-1111-2222',
      distributorId: '1', // 에듀에이전시 소속
      position: '대표',
      createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10일 전
      approvedAt: undefined,
      approvedBy: undefined,
    },
    {
      name: '이대표',
      email: 'dist2@example.com',
      phone: '010-2222-3333',
      distributorId: '2', // 스마트러닝 소속
      position: '영업부장',
      createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000, // 20일 전
      approvedAt: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15일 전
      approvedBy: 'admin@example.com',
    },
    {
      name: '박매니저',
      email: 'dist3@example.com',
      phone: '010-3333-4444',
      distributorId: '3', // 학습미래 소속
      position: '매니저',
      createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5일 전
      approvedAt: undefined,
      approvedBy: undefined,
    },
  ]);

  // 승인 처리 함수
  const handleApprove = (email: string) => {
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.email === email
          ? {
              ...member,
              approvedAt: Date.now(),
              approvedBy: 'current-admin@example.com',
            }
          : member,
      ),
    );
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
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <Breadcrumb pageName="총판 회원 관리" />

      <div className="flex flex-col gap-5">
        <Card className="h-full w-full">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
              <div>
                <Typography variant="h5" color="blue-gray">
                  총판 회원 목록
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  총판 소속 직원 정보를 관리합니다
                </Typography>
              </div>
              <div className="flex w-full shrink-0 gap-2 md:w-max">
                <div className="w-full md:w-72">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="검색어 입력..."
                      className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-10 pr-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    <span className="absolute left-3 top-3 z-10">
                      <MagnifyingGlassIcon className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardBody className="overflow-x-auto px-0">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-bold leading-none opacity-70"
                    >
                      이름
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-bold leading-none opacity-70"
                    >
                      직책
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-bold leading-none opacity-70"
                    >
                      이메일
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-bold leading-none opacity-70"
                    >
                      전화번호
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-bold leading-none opacity-70"
                    >
                      가입일
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-bold leading-none opacity-70"
                    >
                      상태
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-bold leading-none opacity-70"
                    >
                      작업
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {members.length > 0 ? (
                  members.map((member, index) => (
                    <tr key={index} className="even:bg-blue-gray-50/50">
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-medium"
                        >
                          {member.name}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {member.position}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {member.email}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {member.phone}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {formatDate(member.createdAt)}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <div className="w-max">
                          <Chip
                            size="sm"
                            variant="ghost"
                            value={member.approvedAt ? '승인됨' : '승인 대기중'}
                            color={member.approvedAt ? 'green' : 'amber'}
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {!member.approvedAt && (
                            <Tooltip content="승인하기">
                              <Button
                                size="sm"
                                color="green"
                                variant="gradient"
                                className="flex items-center gap-2"
                                onClick={() =>
                                  member.email && handleApprove(member.email)
                                }
                              >
                                <CheckCircleIcon className="h-4 w-4" />
                                승인
                              </Button>
                            </Tooltip>
                          )}

                          <Tooltip content="편집">
                            <IconButton variant="text" color="blue-gray">
                              <PencilIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip content="삭제">
                            <IconButton variant="text" color="blue-gray">
                              <TrashIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-4 text-center">
                      <Typography color="blue-gray" className="font-normal">
                        데이터가 없습니다
                      </Typography>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* 페이지네이션 */}
            <div className="flex items-center justify-between border-t border-blue-gray-50 p-4">
              <div className="flex items-center gap-2">
                <IconButton variant="outlined" size="sm">
                  <ChevronLeftIcon strokeWidth={2} className="h-4 w-4" />
                </IconButton>
                <Typography color="gray" className="font-normal">
                  1 / 1 페이지
                </Typography>
                <IconButton variant="outlined" size="sm">
                  <ChevronRightIcon strokeWidth={2} className="h-4 w-4" />
                </IconButton>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default DistributorMembers;
