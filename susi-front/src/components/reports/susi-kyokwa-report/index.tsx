import NotFoundError from "@/components/errors/not-found-error";
import UnknownErrorPage from "@/components/errors/unknown-error";
import LoadingSpinner from "@/components/loading-spinner";
import {
  useGetCurrentUser,
  useGetMyGrade,
} from "@/stores/server/features/me/queries";
import { SubjectRiskSection } from "./subject-risk-section";
import { RecentGradeAnalysisSection } from "./recent-grade-analysis-section";
import { useMemo } from "react";
import { useGetExploreSusiKyokwaDetail } from "@/stores/server/features/explore/susi-kyokwa/queries";
import { SusiReportHeader } from "../susi-report-header";
import { SusiKyokwaDetailSection } from "./susi-kyokwa-detail-section";
import { calculateSubjectRisk } from "@/lib/calculations/subject/risk";
import { useGetSusiPassRecord } from "@/stores/server/features/susi/pass-record/queries";
import { PassFailAnalysisSection } from "../pass-fail-analysis-section";

interface SusiKyokwaReportProps {
  susiKyokwaId: number;
}

export const SusiKyokwaReport = ({
  susiKyokwaId,
}: SusiKyokwaReportProps) => {
  // Queries
  const { data: currentUser } = useGetCurrentUser();
  const { data: susiKyokwa, status: susiKyokwaStatus } =
    useGetExploreSusiKyokwaDetail(susiKyokwaId);
  const { data: passRecords } = useGetSusiPassRecord({
    recruitmentUnitId: susiKyokwaId,
  });
  const { data: myGrade } = useGetMyGrade();

  // 교과 위험도
  const subjectRisk = useMemo(() => {
    if (!myGrade || !susiKyokwa?.scores) return null;
    return calculateSubjectRisk(myGrade, {
      risk_1: susiKyokwa.scores.risk_plus_5,
      risk_2: susiKyokwa.scores.risk_plus_4,
      risk_3: susiKyokwa.scores.risk_plus_3,
      risk_4: susiKyokwa.scores.risk_plus_2,
      risk_5: susiKyokwa.scores.risk_plus_1,
      risk_6: susiKyokwa.scores.risk_minus_1,
      risk_7: susiKyokwa.scores.risk_minus_2,
      risk_8: susiKyokwa.scores.risk_minus_3,
      risk_9: susiKyokwa.scores.risk_minus_4,
      risk_10: susiKyokwa.scores.risk_minus_5,
    });
  }, [susiKyokwa, myGrade]);

  if (susiKyokwaStatus === "pending") {
    return <LoadingSpinner />;
  }

  if (susiKyokwaStatus === "error") {
    return <UnknownErrorPage />;
  }

  if (susiKyokwa === null) {
    return <NotFoundError />;
  }

  return (
    <div className="pb-20">
      <div className="space-y-12">
        <SusiReportHeader
          title={`${susiKyokwa.university.name} (${susiKyokwa.university.region})`}
          subtitle={`${susiKyokwa.general_field.name} - ${susiKyokwa.admission.name}`}
          recruitmentUnitName={susiKyokwa.name || "-"}
          badges={
            susiKyokwa.admission.subtypes.map((n) => n.id).join(",") || ""
          }
          risk={subjectRisk || undefined}
        />

        <SubjectRiskSection
          myGrade={myGrade}
          susiKyokwa={susiKyokwa}
          userName={currentUser?.nickname || ""}
          subjectRisk={subjectRisk}
        />

        <RecentGradeAnalysisSection
          myGrade={myGrade}
          susiKyokwa={susiKyokwa}
        />

        <PassFailAnalysisSection passRecords={passRecords || []} />

        <SusiKyokwaDetailSection susiKyokwa={susiKyokwa} />
      </div>
    </div>
  );
};
