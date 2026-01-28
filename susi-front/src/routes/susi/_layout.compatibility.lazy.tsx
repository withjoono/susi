import { RequireLoginMessage } from "@/components/require-login-message";
import { RequireSchoolRecordMessage } from "@/components/require-schoolrecord-message";
import { RowSeriesSearch } from "@/components/row-series-search";
import { SeriesEvaluationResult } from "@/components/services/evaluation/series-evaluation-result";
import { SeriesSelector } from "@/components/services/evaluation/series-selector";
import { UniversityAutocomplete } from "@/components/services/evaluation/university-autocomplete";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ICompatibilityData } from "@/constants/compatibility-series";
import {
  useGetCurrentUser,
  useGetSchoolRecords,
} from "@/stores/server/features/me/queries";
import { useCalculateSeriesEvaluation } from "@/stores/server/features/series-evaluation/queries";
import { SeriesType } from "@/types/series-evaluation.type";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createLazyFileRoute("/susi/_layout/compatibility")({
  component: SusiCompatibility,
});

// 대계열에 따른 문과/이과 자동 결정
function getSeriesTypeByGrandSeries(grandSeries: string): SeriesType {
  const scienceSeries = ["공학계열", "자연계열", "의약계열"];
  return scienceSeries.includes(grandSeries)
    ? SeriesType.SCIENCE
    : SeriesType.HUMANITIES;
}

function SusiCompatibility() {
  const { data: currentUser } = useGetCurrentUser();
  const { data: schoolRecords } = useGetSchoolRecords();

  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedSeries, setSelectedSeries] = useState({
    grandSeries: "",
    middleSeries: "",
    rowSeries: "",
  });
  const [searchSeries, setSearchSeries] = useState<ICompatibilityData | null>(
    null,
  );

  const calculateMutation = useCalculateSeriesEvaluation();

  // 검색으로 선택한 경우 계열 업데이트
  useEffect(() => {
    if (searchSeries) {
      setSelectedSeries({
        grandSeries: searchSeries.grandSeries,
        middleSeries: searchSeries.middleSeries,
        rowSeries: searchSeries.rowSeries,
      });
    }
  }, [searchSeries]);

  // 대계열 기반 자동 문과/이과 결정
  const seriesType = useMemo(() => {
    if (!selectedSeries.grandSeries) return SeriesType.HUMANITIES;
    return getSeriesTypeByGrandSeries(selectedSeries.grandSeries);
  }, [selectedSeries.grandSeries]);

  // 학생 성적 데이터 추출
  const studentGrades = useMemo(() => {
    if (!schoolRecords?.subjects || schoolRecords.subjects.length === 0) return [];

    // 과목별 평균 등급 계산
    const subjectGradeMap = new Map<string, number[]>();

    schoolRecords.subjects.forEach((subject) => {
      const subjectName = subject.subjectName || "";
      const grade = parseFloat(subject.ranking || "0");

      if (grade > 0 && subjectName) {
        if (!subjectGradeMap.has(subjectName)) {
          subjectGradeMap.set(subjectName, []);
        }
        subjectGradeMap.get(subjectName)!.push(grade);
      }
    });

    // 평균 등급 계산
    return Array.from(subjectGradeMap.entries()).map(([subjectName, grades]) => ({
      subjectName,
      grade: grades.reduce((sum, g) => sum + g, 0) / grades.length,
    }));
  }, [schoolRecords]);

  const handleCalculate = () => {
    if (!selectedSeries.rowSeries) {
      toast.error("계열을 선택해주세요");
      return;
    }

    if (!selectedUniversity) {
      toast.error("대학을 선택해주세요");
      return;
    }

    if (studentGrades.length === 0) {
      toast.error("성적 데이터가 없습니다");
      return;
    }

    calculateMutation.mutate({
      universityName: selectedUniversity,
      seriesType,
      middleSeries: selectedSeries.middleSeries,
      studentGrades,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">계열 적합성 진단</h3>
        <p className="text-sm text-muted-foreground">
          내 생기부의 데이터를 분석하여 계열별 적합도를 진단하는 서비스입니다.
        </p>
      </div>
      <Separator />
      {!currentUser ? (
        <RequireLoginMessage />
      ) : !schoolRecords || schoolRecords.isEmpty ? (
        <RequireSchoolRecordMessage />
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>진단 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 학과 검색 */}
              <div className="space-y-2">
                <Label>학과 검색</Label>
                <RowSeriesSearch
                  selectedSeries={searchSeries}
                  setSelectedSeries={setSearchSeries}
                  className="max-w-md"
                />
              </div>

              {/* 계열 선택 */}
              <div className="space-y-2">
                <Label>또는 계열 직접 선택</Label>
                <SeriesSelector
                  selectedSeries={selectedSeries}
                  setSelectedSeries={setSelectedSeries}
                />
              </div>

              {/* 선택된 계열 정보 */}
              {selectedSeries.rowSeries && (
                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">선택한 계열:</span>
                      <span className="font-semibold">
                        {selectedSeries.grandSeries} &gt; {selectedSeries.middleSeries}{" "}
                        &gt; {selectedSeries.rowSeries}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">산정 방식:</span>
                      <span className="font-semibold text-primary">
                        {seriesType === SeriesType.SCIENCE ? "이과" : "문과"} 계열
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 대학 선택 */}
              <div className="space-y-2">
                <Label>대학 선택</Label>
                <UniversityAutocomplete
                  selectedUniversity={selectedUniversity}
                  onSelectUniversity={setSelectedUniversity}
                  className="max-w-md"
                />
              </div>

              {/* 진단 버튼 */}
              <Button
                onClick={handleCalculate}
                disabled={
                  !selectedSeries.rowSeries ||
                  !selectedUniversity ||
                  calculateMutation.isPending
                }
                className="w-full"
              >
                {calculateMutation.isPending ? "진단 중..." : "계열 적합성 진단하기"}
              </Button>
            </CardContent>
          </Card>

          {/* 에러 표시 */}
          {calculateMutation.isError && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-sm text-red-800">
                  {calculateMutation.error.message || "진단 중 오류가 발생했습니다"}
                </p>
              </CardContent>
            </Card>
          )}

          {/* 결과 표시 */}
          {calculateMutation.isSuccess && calculateMutation.data && (
            <SeriesEvaluationResult result={calculateMutation.data} />
          )}
        </div>
      )}
    </div>
  );
}
