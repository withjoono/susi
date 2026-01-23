import { Button } from "./custom/button";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export function LoginFormSimple({ className }: Props) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Hub OAuth SSO 로그인 */}
      <Button
        type="button"
        className="w-full"
        onClick={() => {
          // Susi 백엔드의 OAuth 로그인 엔드포인트로 리다이렉트
          // 백엔드에서 Hub 인증 페이지로 다시 리다이렉트되어 SSO 인증 진행
          // 개발환경: localhost:4001 직접 호출 (Vite 프록시 우회)
          window.location.href = 'http://localhost:4001/auth/oauth/login';
        }}
      >
        <svg
          className="mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <polyline points="10 17 15 12 10 7" />
          <line x1="15" y1="12" x2="3" y2="12" />
        </svg>
        로그인
      </Button>

      <div className="flex justify-center pt-2">
        <Link
          to="/auth/register"
          className="text-sm text-blue-500 hover:underline"
        >
          회원가입
        </Link>
      </div>
    </div>
  );
}
