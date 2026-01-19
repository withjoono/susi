import { useState, useMemo, useEffect } from "react";
import { Clock, RefreshCw } from "lucide-react";
import { useGetApplicationRates } from "@/stores/server/features/susi/application-rate";
import type { IApplicationRateResponse } from "@/stores/server/features/susi/application-rate";
import {
  type CrawlerDataEntry,
  type RegionId,
  inferRegionFromUniversity,
  regionIdToName
} from "./types";
import { RegionSelector } from "./region-selector";
import { LowestRateSection } from "./lowest-rate-section";
import { UniversitySection } from "./university-section";
import { DepartmentSection } from "./department-section";

// API 데이터를 CrawlerDataEntry 형식으로 변환
function convertApiToCrawlerData(apiData: IApplicationRateResponse[]): CrawlerDataEntry[] {
  const result: CrawlerDataEntry[] = [];

  for (const univ of apiData) {
    const region = inferRegionFromUniversity(univ.universityName);

    for (const item of univ.items) {
      result.push({
        대학명: item.universityName,
        캠퍼스: "",
        전형명: item.admissionType || "",
        모집단위: item.departmentName,
        모집인원: item.recruitmentCount,
        지원인원: item.applicationCount,
        경쟁률: item.competitionRate.toFixed(2),
        지역: region,
        // 수시는 추합 관련 필드가 없으므로 현재 경쟁률로 대체
        정원: item.recruitmentCount,
        현재경쟁률: item.competitionRate.toFixed(2),
        작년추합: 0,
        예상최종경쟁: item.competitionRate.toFixed(2),
        예상최종경쟁값: item.competitionRate,
        예상실질경쟁: item.competitionRate.toFixed(2),
        예상실질경쟁값: item.competitionRate,
      });
    }
  }

  return result;
}

// 수시용 색상 (파란색 계열)
const SUSI_COLOR = {
  bg: "bg-blue-100",
  text: "text-blue-600",
  border: "border-blue-400",
  gradient: "from-blue-500 to-indigo-500",
};

export function CompetitionRate() {
  const [selectedRegion, setSelectedRegion] = useState<RegionId>("all");
  const [currentTime, setCurrentTime] = useState(new Date());

  // API 데이터 조회
  const { data: ratesData, isLoading, error, refetch } = useGetApplicationRates();

  // 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // API 데이터를 CrawlerDataEntry 형식으로 변환
  const allData = useMemo(() => {
    if (!ratesData) return [];
    return convertApiToCrawlerData(ratesData);
  }, [ratesData]);

  // 선택된 지역으로 필터링
  const filteredData = useMemo(() => {
    if (selectedRegion === "all") return allData;
    const regionName = regionIdToName(selectedRegion);
    return allData.filter(item => item.지역 === regionName);
  }, [allData, selectedRegion]);

  // 통계
  const stats = useMemo(() => {
    if (!ratesData) return { universities: 0, total: 0 };
    const totalItems = ratesData.reduce((sum, u) => sum + u.items.length, 0);
    return {
      universities: ratesData.length,
      total: totalItems,
    };
  }, [ratesData]);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <RefreshCw className="mx-auto mb-4 h-10 w-10 animate-spin text-primary" />
          <p className="font-medium text-muted-foreground">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="mb-2 font-medium text-red-500">오류 발생</p>
          <p className="text-sm text-muted-foreground">
            데이터를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-lg">
        <h1 className="mb-2 text-2xl font-bold">2026 수시 실시간 경쟁률</h1>
        <p className="text-blue-100">
          전국 {stats.universities}개 대학 · {stats.total.toLocaleString()}개 모집단위
        </p>
      </div>

      {/* 상단 컨트롤 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm">
              {currentTime.toLocaleTimeString("ko-KR")}
            </span>
            <span className="ml-1 h-2 w-2 animate-pulse rounded-full bg-green-400" />
          </div>
          {ratesData && ratesData[0]?.summary?.lastCrawledAt && (
            <span className="text-xs">
              마지막 업데이트:{" "}
              {new Date(ratesData[0].summary.lastCrawledAt).toLocaleString("ko-KR")}
            </span>
          )}
        </div>
        <button
          onClick={() => refetch()}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-sm transition-colors hover:bg-primary/20 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          새로고침
        </button>
      </div>

      {/* 지역 선택 */}
      <RegionSelector
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
      />

      {/* 선택된 지역 정보 */}
      {selectedRegion !== "all" && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-blue-700">
            <span className="font-semibold">{regionIdToName(selectedRegion)}</span> 지역
            {" "}총 <span className="font-semibold">{filteredData.length.toLocaleString()}</span>개 모집단위
          </p>
        </div>
      )}

      {/* 섹션 1: 지역별 경쟁률 리스트 */}
      <LowestRateSection
        data={filteredData}
        groupName="수시"
        groupColor={SUSI_COLOR}
      />

      {/* 섹션 2: 대학별 경쟁률 */}
      <UniversitySection
        data={filteredData}
        groupName="수시"
        groupColor={SUSI_COLOR}
      />

      {/* 섹션 3: 학과별 경쟁률 */}
      <DepartmentSection
        data={filteredData}
        groupName="수시"
        groupColor={SUSI_COLOR}
      />

      {/* 범례 */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded bg-green-500" />
              <span className="text-muted-foreground">경쟁률 3:1 미만</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded bg-amber-500" />
              <span className="text-muted-foreground">경쟁률 3~5:1</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded bg-rose-500" />
              <span className="text-muted-foreground">경쟁률 5:1 이상</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                미달
              </span>
              <span className="text-muted-foreground">경쟁률 1:1 미만</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            5분마다 자동 업데이트 · 데이터 출처: UWAY
          </div>
        </div>
      </div>
    </div>
  );
}
