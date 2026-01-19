import { useQuery } from "@tanstack/react-query";
import {
  IApplicationRateResponse,
  IApplicationRateChange,
  ICrawlSource,
  IApplicationRateQueryParams,
} from "./interfaces";
import { APPLICATION_RATE_APIS } from "./apis";

export const applicationRateQueryKeys = {
  all: ["application-rate"] as const,
  list: (params?: IApplicationRateQueryParams) =>
    [...applicationRateQueryKeys.all, "list", params] as const,
  detail: (universityCode: string) =>
    [...applicationRateQueryKeys.all, "detail", universityCode] as const,
  changes: (universityCode?: string) =>
    [...applicationRateQueryKeys.all, "changes", universityCode] as const,
  sources: () => [...applicationRateQueryKeys.all, "sources"] as const,
};

/**
 * 수시 경쟁률 목록 조회 훅
 */
export const useGetApplicationRates = (params?: IApplicationRateQueryParams) => {
  return useQuery<IApplicationRateResponse[]>({
    queryKey: applicationRateQueryKeys.list(params),
    queryFn: () => APPLICATION_RATE_APIS.fetchApplicationRatesAPI(params),
    staleTime: 1 * 60 * 1000, // 1분 (실시간 경쟁률이므로 짧게 설정)
    refetchInterval: 5 * 60 * 1000, // 5분마다 자동 갱신
  });
};

/**
 * 특정 대학 경쟁률 상세 조회 훅
 */
export const useGetUniversityDetail = (universityCode: string) => {
  return useQuery<IApplicationRateResponse | null>({
    queryKey: applicationRateQueryKeys.detail(universityCode),
    queryFn: () => APPLICATION_RATE_APIS.fetchUniversityDetailAPI(universityCode),
    enabled: !!universityCode,
    staleTime: 1 * 60 * 1000,
  });
};

/**
 * 최근 변동 내역 조회 훅
 */
export const useGetRecentChanges = (universityCode?: string, limit?: number) => {
  return useQuery<IApplicationRateChange[]>({
    queryKey: applicationRateQueryKeys.changes(universityCode),
    queryFn: () =>
      APPLICATION_RATE_APIS.fetchRecentChangesAPI(universityCode, limit),
    staleTime: 1 * 60 * 1000,
  });
};

/**
 * 크롤링 소스 목록 조회 훅
 */
export const useGetCrawlSources = () => {
  return useQuery<ICrawlSource[]>({
    queryKey: applicationRateQueryKeys.sources(),
    queryFn: () => APPLICATION_RATE_APIS.fetchCrawlSourcesAPI(),
    staleTime: 30 * 60 * 1000, // 30분
  });
};
