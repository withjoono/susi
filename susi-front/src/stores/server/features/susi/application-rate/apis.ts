import { makeApiCall } from "@/stores/server/common-utils";
import {
  IApplicationRateResponse,
  IApplicationRateChange,
  ICrawlSource,
  IApplicationRateQueryParams,
} from "./interfaces";

/**
 * [수시] 경쟁률 목록 조회 API
 */
const fetchApplicationRatesAPI = async (
  params?: IApplicationRateQueryParams,
) => {
  const res = await makeApiCall<void, IApplicationRateResponse[]>(
    "GET",
    `/application-rate`,
    undefined,
    { params },
  );
  if (res.success) {
    return res.data ?? [];
  }
  return [];
};

/**
 * [수시] 특정 대학 경쟁률 상세 조회 API
 */
const fetchUniversityDetailAPI = async (universityCode: string) => {
  const res = await makeApiCall<void, IApplicationRateResponse>(
    "GET",
    `/application-rate/university/${universityCode}`,
    undefined,
  );
  if (res.success) {
    return res.data ?? null;
  }
  return null;
};

/**
 * [수시] 최근 변동 내역 조회 API
 */
const fetchRecentChangesAPI = async (
  universityCode?: string,
  limit: number = 50,
) => {
  const res = await makeApiCall<void, IApplicationRateChange[]>(
    "GET",
    `/application-rate/changes`,
    undefined,
    { params: { universityCode, limit } },
  );
  if (res.success) {
    return res.data ?? [];
  }
  return [];
};

/**
 * [수시] 크롤링 소스 목록 조회 API
 */
const fetchCrawlSourcesAPI = async () => {
  const res = await makeApiCall<void, ICrawlSource[]>(
    "GET",
    `/application-rate/sources`,
    undefined,
  );
  if (res.success) {
    return res.data ?? [];
  }
  return [];
};

/**
 * [수시] 수동 크롤링 트리거 API
 */
const triggerManualCrawlAPI = async (universityCode?: string) => {
  const res = await makeApiCall<void, { message: string; crawledCount: number }>(
    "POST",
    `/application-rate/crawl`,
    undefined,
    { params: { universityCode } },
  );
  if (res.success) {
    return res.data ?? { message: "", crawledCount: 0 };
  }
  return { message: "Failed", crawledCount: 0 };
};

export const APPLICATION_RATE_APIS = {
  fetchApplicationRatesAPI,
  fetchUniversityDetailAPI,
  fetchRecentChangesAPI,
  fetchCrawlSourcesAPI,
  triggerManualCrawlAPI,
};
