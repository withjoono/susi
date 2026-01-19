import { makeApiCall } from "@/stores/server/common-utils";
import {
  IExploreSusiKyokwaDetailResponse,
  IExploreSusiKyokwaStep1Response,
  IExploreSusiKyokwaStep2Response,
  IExploreSusiKyokwaStep3Response,
  IExploreSusiKyokwaStep4Response,
  IExploreSusiKyokwaStep5Response,
} from "./interfaces";

const fetchExploreSusiKyokwaStep1API = async ({
  year,
  basicType,
}: {
  year: number;
  basicType: string;
}) => {
  const res = await makeApiCall<void, IExploreSusiKyokwaStep1Response>(
    "GET",
    `/explore/susi/kyokwa/step-1`,
    undefined,
    {
      params: { year, basic_type: basicType },
    },
  );
  if (res.success) {
    return res.data;
  }
  return { items: [] };
};

const fetchExploreSusiKyokwaStep2API = async ({ ids }: { ids: number[] }) => {
  const res = await makeApiCall<void, IExploreSusiKyokwaStep2Response>(
    "GET",
    `/explore/susi/kyokwa/step-2`,
    undefined,
    { params: { ids } },
  );

  if (res.success) {
    return res.data;
  }
  return { items: [] };
};

const fetchExploreSusiKyokwaStep3API = async ({ ids }: { ids: number[] }) => {
  const res = await makeApiCall<void, IExploreSusiKyokwaStep3Response>(
    "GET",
    `/explore/susi/kyokwa/step-3`,
    undefined,
    { params: { ids } },
  );

  if (res.success) {
    return res.data;
  }
  return { items: [] };
};

const fetchExploreSusiKyokwaStep4API = async ({ ids }: { ids: number[] }) => {
  const res = await makeApiCall<void, IExploreSusiKyokwaStep4Response>(
    "GET",
    `/explore/susi/kyokwa/step-4`,
    undefined,
    { params: { ids } },
  );

  if (res.success) {
    return res.data;
  }
  return { items: [] };
};

const fetchExploreSusiKyokwaStep5API = async ({ ids }: { ids: number[] }) => {
  const res = await makeApiCall<void, IExploreSusiKyokwaStep5Response>(
    "GET",
    `/explore/susi/kyokwa/step-5`,
    undefined,
    { params: { ids } },
  );

  if (res.success) {
    return res.data;
  }
  return { items: [] };
};

const fetchExploreSusiKyokwaDetailAPI = async ({ id }: { id: number }) => {
  const res = await makeApiCall<void, IExploreSusiKyokwaDetailResponse>(
    "GET",
    `/explore/susi/kyokwa/detail/${id}`,
    undefined,
  );

  if (res.success) {
    return res.data;
  }
  return null;
};

export const EXPLORE_SUSI_KYOKWA_APIS = {
  fetchExploreSusiKyokwaStep1API,
  fetchExploreSusiKyokwaStep2API,
  fetchExploreSusiKyokwaStep3API,
  fetchExploreSusiKyokwaStep4API,
  fetchExploreSusiKyokwaStep5API,
  fetchExploreSusiKyokwaDetailAPI,
};
