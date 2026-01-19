import { SusiKyokwaSteps } from "@/components/services/explore/susi-kyokwa/components/susi-kyokwa-steps";
import { ExploreSusiKyokwaStepperProvider } from "@/components/services/explore/susi-kyokwa/context/explore-susi-kyokwa-provider";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/explore/susi-kyokwa")({
  component: ExploreSusiKyokwa,
});

function ExploreSusiKyokwa() {
  return (
    <div className="mx-auto w-full max-w-screen-xl py-20 pb-8">
      <ExploreSusiKyokwaStepperProvider>
        <SusiKyokwaSteps />
      </ExploreSusiKyokwaStepperProvider>
    </div>
  );
}
