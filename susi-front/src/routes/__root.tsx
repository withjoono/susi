import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { JungsiHeader } from "@/components/jungsi-header";
import { SusiHeader } from "@/components/susi-header";
import { MockAnalysisHeader } from "@/components/mock-analysis-header";
import { GradeAnalysisHeader } from "@/components/grade-analysis-header";
import ScrollToTop from "@/components/scroll-to-top";
import { Toaster } from "@/components/ui/sonner";
import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router";
import { useSSOReceiver } from "@/lib/sso-client";
import { useTokenStore } from "@/stores/atoms/tokens";
import { setTokens, clearTokens } from "@/lib/api/token-manager";
import { env } from "@/lib/config/env";

function isJungsiPath(pathname: string): boolean {
  return pathname.startsWith("/jungsi") || pathname.startsWith("/j");
}

function isSusiPath(pathname: string): boolean {
  return pathname.startsWith("/susi");
}

function isMockAnalysisPath(pathname: string): boolean {
  return pathname.startsWith("/mock-analysis");
}

function isGradeAnalysisPath(pathname: string): boolean {
  return pathname.startsWith("/grade-analysis");
}

function RootLayout() {
  const location = useLocation();
  const tokenStore = useTokenStore();

  // Hub SSO 토큰 수신 설정
  useSSOReceiver({
    hubUrl: env.hubUrl,
    allowedOrigins: [
      env.hubUrl,
      'https://geobukschool.kr',
      'https://www.geobukschool.kr',
      'http://localhost:3000',
    ],
    onTokensReceived: (tokens) => {
      console.log('[Susi] Hub에서 SSO 토큰 수신');
      // token-manager와 Zustand store 모두에 저장
      setTokens(tokens.accessToken, tokens.refreshToken);
      tokenStore.setTokens(tokens.accessToken, tokens.refreshToken);
    },
    onLogout: () => {
      console.log('[Susi] Hub에서 로그아웃 메시지 수신');
      clearTokens();
      tokenStore.clearTokens();
    },
    debug: env.isDevelopment,
  });

  const isTestPage = location.pathname === "/test/auth-me" || location.pathname === "/test/login-debug";
  const isAuthPage = location.pathname.startsWith("/auth/");
  const isHybridAppPage = location.pathname.startsWith("/mock-apply") ||
    location.pathname.startsWith("/score-analysis");

  const isJungsiMode = isJungsiPath(location.pathname);
  const isSusiMode = isSusiPath(location.pathname);
  const isMockAnalysisMode = isMockAnalysisPath(location.pathname);
  const isGradeAnalysisMode = isGradeAnalysisPath(location.pathname);

  const renderHeader = () => {
    if (isTestPage || isAuthPage || isHybridAppPage) return null;
    if (isJungsiMode) return <JungsiHeader />;
    if (isSusiMode) return <SusiHeader />;
    if (isMockAnalysisMode) return <MockAnalysisHeader />;
    if (isGradeAnalysisMode) return <GradeAnalysisHeader />;
    return <Header />;
  };

  return (
    <>
      {renderHeader()}
      <div className={isHybridAppPage ? "h-full min-h-screen" : "h-full min-h-screen py-4"}>
        <Outlet />
      </div>
      {!isTestPage && !isHybridAppPage && (
        <>
          <Toaster richColors position={"top-right"} duration={1200} />
          <Footer />
          <ScrollToTop />
        </>
      )}
      {isHybridAppPage && (
        <Toaster richColors position={"top-right"} duration={1200} />
      )}
    </>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
});


