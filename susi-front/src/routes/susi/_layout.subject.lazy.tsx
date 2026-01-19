import { SusiKyokwaSteps } from "@/components/services/explore/susi-kyokwa/components/susi-kyokwa-steps";
import { ExploreSusiKyokwaStepperProvider } from "@/components/services/explore/susi-kyokwa/context/explore-susi-kyokwa-provider";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/susi/_layout/subject")({
  component: SusiSubject,
});

function SusiSubject() {
  return (
    <div className="w-full pb-8">
      <ExploreSusiKyokwaStepperProvider>
        <SusiKyokwaSteps />
      </ExploreSusiKyokwaStepperProvider>
    </div>
  );
}
