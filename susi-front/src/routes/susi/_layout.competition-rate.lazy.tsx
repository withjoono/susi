import { createLazyFileRoute } from "@tanstack/react-router";
import { CompetitionRate } from "@/components/services/competition-rate";
import { Separator } from "@/components/ui/separator";

export const Route = createLazyFileRoute("/susi/_layout/competition-rate")({
  component: CompetitionRatePage,
});

function CompetitionRatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">실시간 경쟁률</h3>
        <p className="text-sm text-muted-foreground">
          2026 수시 실시간 경쟁률 분석 서비스입니다. (누구나 무료로 이용 가능)
        </p>
      </div>
      <Separator />
      <CompetitionRate />
    </div>
  );
}
