/**
 * 로그인 폼 컴포넌트
 *
 * Hub OAuth SSO 로그인만 지원합니다.
 * 이 컴포넌트가 렌더링되면 즉시 Hub OAuth 로그인으로 리다이렉트합니다.
 */

import { useEffect } from "react";
import { redirectToHubLogin } from "@/lib/auth/redirect-to-login";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export function LoginFormSimple({ className }: Props) {
  useEffect(() => {
    // 컴포넌트 마운트 시 바로 Hub OAuth 로그인으로 리다이렉트
    redirectToHubLogin();
  }, []);

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4 py-8", className)}>
      {/* Hub OAuth로 리다이렉트 중 표시 */}
      <div className="flex items-center space-x-2">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-muted-foreground">로그인 페이지로 이동 중...</span>
      </div>
    </div>
  );
}
