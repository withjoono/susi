import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  // Susi 앱의 루트는 수시 메인 페이지로 리다이렉트
  // ServiceCardsPage는 Hub 프론트엔드로 이동 예정
  return <Navigate to="/susi" />;
}


