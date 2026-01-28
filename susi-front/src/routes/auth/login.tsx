import { GoogleLoginButton } from "@/components/login-google-button";
import { LoginWithEmailForm } from "@/components/login-with-email-form";
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/auth/login")({
  component: Login,
});

function Login() {
  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-screen-xl px-4">
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-full sm:max-w-[400px]">
            <Card className="border-gray-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">로그인</CardTitle>
                <p className="text-center text-sm text-gray-500">
                  이메일 또는 Google 계정으로 로그인하세요
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 이메일/비밀번호 로그인 */}
                <LoginWithEmailForm />

                {/* 구분선 */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      또는
                    </span>
                  </div>
                </div>

                {/* 구글 로그인 */}
                <GoogleLoginButton />

                <div className="text-center text-sm text-gray-500">
                  계정이 없으신가요?{" "}
                  <a href="/auth/register" className="text-olive-500 hover:text-olive-600 font-medium">
                    회원가입
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
