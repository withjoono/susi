import { makeApiCall } from "@/stores/server/common-utils";
import {
  ISusiKyokwaStep1Response,
  ISusiKyokwaStep2Response,
  ISusiKyokwaStep3Response,
  ISusiKyokwaStep4Response,
  ISusiKyokwaStep5Response,
  ISusiKyokwaDetailResponse,
} from "./interfaces";

/**
 * [수시 교과] Step 1 조회 API - 차트용 데이터
 */
const fetchSusiKyokwaStep1API = async ({
  year,
  basicType,
}: {
  year: number;
  basicType: "일반" | "특별";
}) => {
  const res = await makeApiCall<void, ISusiKyokwaStep1Response>(
    "GET",
    `/susi/kyokwa/step-1`,
    undefined,
    {
      params: { year, basic_type: basicType },
    }
  );
  if (res.success) {
    return res.data;
  }
  return { items: [] };
};

/**
 * [수시 교과] Step 2 조회 API - 최저등급
 */
const fetchSusiKyokwaStep2API = async ({ ids }: { ids: number[] }) => {
  const res = await makeApiCall<void, ISusiKyokwaStep2Response>(
    "GET",
    `/susi/kyokwa/step-2`,
    undefined,
    {
      params: { ids: ids.join(",") },
    }
  );
  if (res.success) {
    return res.data;
  }
  return { items: [] };
};

/**
 * [수시 교과] Step 3 조회 API - 비교과
 */
const fetchSusiKyokwaStep3API = async ({ ids }: { ids: number[] }) => {
  const res = await makeApiCall<void, ISusiKyokwaStep3Response>(
    "GET",
    `/susi/kyokwa/step-3`,
    undefined,
    {
      params: { ids: ids.join(",") },
    }
  );
  if (res.success) {
    return res.data;
  }
  return { items: [] };
};

/**
 * [수시 교과] Step 4 조회 API - 모집단위
 */
const fetchSusiKyokwaStep4API = async ({ ids }: { ids: number[] }) => {
  const res = await makeApiCall<void, ISusiKyokwaStep4Response>(
    "GET",
    `/susi/kyokwa/step-4`,
    undefined,
    {
      params: { ids: ids.join(",") },
    }
  );
  if (res.success) {
    return res.data;
  }
  return { items: [] };
};

/**
 * [수시 교과] Step 5 조회 API - 면접
 */
const fetchSusiKyokwaStep5API = async ({ ids }: { ids: number[] }) => {
  const res = await makeApiCall<void, ISusiKyokwaStep5Response>(
    "GET",
    `/susi/kyokwa/step-5`,
    undefined,
    {
      params: { ids: ids.join(",") },
    }
  );
  if (res.success) {
    return res.data;
  }
  return { items: [] };
};

/**
 * [수시 교과] 상세 조회 API
 */
const fetchSusiKyokwaDetailAPI = async ({ id }: { id: number }) => {
  const res = await makeApiCall<void, ISusiKyokwaDetailResponse>(
    "GET",
    `/susi/kyokwa/detail/${id}`,
    undefined
  );
  if (res.success) {
    return res.data;
  }
  return null;
};

export const SUSI_KYOKWA_APIS = {
  fetchSusiKyokwaStep1API,
  fetchSusiKyokwaStep2API,
  fetchSusiKyokwaStep3API,
  fetchSusiKyokwaStep4API,
  fetchSusiKyokwaStep5API,
  fetchSusiKyokwaDetailAPI,
};
