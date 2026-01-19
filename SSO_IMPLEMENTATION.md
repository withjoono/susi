# SSO (Single Sign-On) 구현 문서

**작성일**: 2025-01-13
**목적**: Hub와 독립 앱(Susi, MyExam, StudyPlanner) 간 SSO 토큰 전달 방식 문서화

## 개요

Hub 프론트엔드(GB-Front)에서 독립 앱으로 이동할 때, 사용자가 다시 로그인하지 않도록 SSO 토큰을 URL 파라미터로 전달하여 자동 로그인을 구현합니다.

## 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                     Hub (GB-Front)                          │
│                  localhost:5000                             │
│                                                             │
│  1. 사용자가 서비스 카드 클릭                                 │
│  2. generateSSOUrl() 호출                                   │
│  3. URL에 토큰 추가:                                         │
│     ?sso_access_token=xxx&sso_refresh_token=yyy            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ SSO URL 전달
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              독립 앱 (Susi, MyExam, etc.)                    │
│                  localhost:3000, 3001, 3002                 │
│                                                             │
│  1. main.tsx에서 processSSOLogin() 호출                     │
│  2. URL 파라미터에서 토큰 추출                               │
│  3. token-manager와 Zustand에 토큰 저장                     │
│  4. URL에서 토큰 파라미터 제거 (보안)                        │
│  5. 자동 로그인 완료                                         │
└─────────────────────────────────────────────────────────────┘
```

## 구현 세부사항

### 1. Hub (GB-Front) - SSO 토큰 전송

#### 파일: `src/lib/utils/sso-helper.ts`

**SSO URL 생성 함수**:
```typescript
export function generateSSOUrl(baseUrl: string): string {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (!accessToken || !refreshToken) {
    return baseUrl;
  }

  const url = new URL(baseUrl);
  url.searchParams.set('sso_access_token', accessToken);
  url.searchParams.set('sso_refresh_token', refreshToken);

  return url.toString();
}
```

**SSO 서비스 확인 함수**:
```typescript
export function isSSOService(href: string): boolean {
  const ssoServices = [
    import.meta.env.VITE_SUSI_URL,
    import.meta.env.VITE_MYEXAM_URL,
    import.meta.env.VITE_STUDYPLANNER_URL,
  ].filter(Boolean);

  return ssoServices.some((service) => href.startsWith(service));
}
```

#### 파일: `src/components/service-cards-page.tsx`

**서비스 카드 클릭 처리**:
```typescript
const handleExternalClick = (e: React.MouseEvent) => {
  if (isSSOService(service.href) && accessToken) {
    e.preventDefault();
    const ssoUrl = generateSSOUrl(service.href);
    window.open(ssoUrl, '_blank', 'noopener,noreferrer');
  }
};

// 외부 서비스 카드
<a
  href={service.href}
  target="_blank"
  rel="noopener noreferrer"
  onClick={handleExternalClick}
>
  {cardContent}
</a>
```

### 2. 독립 앱 (Susi-Front) - SSO 토큰 수신

#### 파일: `src/lib/utils/sso-helper.ts`

**SSO 토큰 처리 함수**:
```typescript
export function processSSOLogin(): boolean {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const ssoAccessToken = urlParams.get('sso_access_token');
    const ssoRefreshToken = urlParams.get('sso_refresh_token');

    if (!ssoAccessToken || !ssoRefreshToken) {
      return false;
    }

    console.log('🔐 SSO 토큰 발견 - 자동 로그인 처리 중...');

    // 1. token-manager에 토큰 저장
    setTokens(ssoAccessToken, ssoRefreshToken);

    // 2. Zustand 스토어에도 토큰 저장
    useTokenStore.getState().setTokens(ssoAccessToken, ssoRefreshToken);
    useAuthStore.getState().setTokens(ssoAccessToken, ssoRefreshToken);

    // 3. URL에서 SSO 파라미터 제거 (보안상 중요)
    urlParams.delete('sso_access_token');
    urlParams.delete('sso_refresh_token');

    const newUrl = urlParams.toString()
      ? `${window.location.pathname}?${urlParams.toString()}`
      : window.location.pathname;

    window.history.replaceState({}, '', newUrl);

    console.log('✅ SSO 자동 로그인 성공');
    return true;
  } catch (error) {
    console.error('❌ SSO 로그인 처리 실패:', error);
    return false;
  }
}
```

#### 파일: `src/main.tsx`

**앱 시작 시 SSO 처리**:
```typescript
import { processSSOLogin } from "./lib/utils/sso-helper";

// Setup API interceptors (인증, 토큰 갱신 등)
setupInterceptors();

// SSO 토큰 처리 (Hub에서 넘어온 경우 자동 로그인)
processSSOLogin();

// Render the app
const rootElement = document.getElementById("root")!;
// ...
```

## 환경 변수 설정

### Hub (GB-Front)

#### `.env.development`
```bash
VITE_SUSI_URL="http://localhost:3000"
VITE_MYEXAM_URL="http://localhost:3001"
VITE_STUDYPLANNER_URL="http://localhost:3002"
```

#### `.env.production`
```bash
VITE_SUSI_URL="https://susi.your-domain.com"
VITE_MYEXAM_URL="https://myexam.your-domain.com"
VITE_STUDYPLANNER_URL="https://studyplanner.kr"
```

### Susi (Susi-Front)

#### `.env.development`
```bash
VITE_HUB_URL="http://localhost:5000"
VITE_MYEXAM_URL="http://localhost:3001"
VITE_STUDYPLANNER_URL="http://localhost:3002"
```

#### `.env.production`
```bash
VITE_HUB_URL="https://hub.your-domain.com"
VITE_MYEXAM_URL="https://myexam.your-domain.com"
VITE_STUDYPLANNER_URL="https://studyplanner.kr"
```

## 보안 고려사항

### 1. ✅ URL 파라미터 자동 제거
- SSO 토큰을 URL에서 읽은 후 즉시 `window.history.replaceState()`로 제거
- 브라우저 히스토리에 토큰이 남지 않도록 함

### 2. ✅ HTTPS 필수
- 프로덕션에서는 반드시 HTTPS 사용
- URL 파라미터가 암호화된 통신으로 전송됨

### 3. ✅ 토큰 유효기간
- accessToken: 15분 (짧은 유효기간)
- refreshToken: 7일
- 토큰 만료 시 자동 갱신 로직 (interceptor)

### 4. ✅ 새 탭으로 열기
```typescript
window.open(ssoUrl, '_blank', 'noopener,noreferrer');
```
- `noopener`: 새 창에서 `window.opener` 접근 차단
- `noreferrer`: HTTP Referer 헤더 제거

### 5. ⚠️ 추가 고려사항

#### 현재 구현의 제한사항:
- URL 파라미터로 토큰 전달 → 브라우저 개발자 도구에서 보일 수 있음
- 네트워크 탭에서 요청 URL 확인 가능

#### 개선 방안 (선택사항):
1. **토큰 교환 방식**:
   - Hub에서 임시 코드 발급 → 독립 앱에서 코드로 토큰 교환
   - OAuth 2.0 Authorization Code Flow 방식

2. **postMessage API 사용**:
   - iframe이나 popup 간 안전한 메시지 전달
   - 더 복잡하지만 URL 노출 없음

3. **서버사이드 세션 공유**:
   - Redis 등에 세션 저장
   - 모든 앱이 같은 세션 스토어 참조

**현재 구현 선택 이유**:
- 구현이 간단하고 빠름
- 토큰이 짧은 시간만 URL에 노출되고 즉시 제거됨
- HTTPS + 짧은 토큰 유효기간으로 충분한 보안 제공
- 대부분의 SSO 서비스가 사용하는 방식

## 동작 흐름 (예시)

### 1. 사용자가 Hub에서 Susi 카드 클릭

**Hub URL**:
```
http://localhost:5000
```

**사용자 상태**: 로그인됨
- accessToken: "eyJhbGciOiJIUzI1NiIs..."
- refreshToken: "eyJhbGciOiJIUzI1NiIs..."

### 2. Hub가 SSO URL 생성

```typescript
generateSSOUrl("http://localhost:3000")
↓
"http://localhost:3000?sso_access_token=eyJhbGciOiJIUzI1NiIs...&sso_refresh_token=eyJhbGciOiJIUzI1NiIs..."
```

### 3. 새 탭에서 Susi 앱 열림

**초기 URL** (브라우저 주소창):
```
http://localhost:3000?sso_access_token=eyJhbGciOiJIUzI1NiIs...&sso_refresh_token=eyJhbGciOiJIUzI1NiIs...
```

### 4. Susi main.tsx에서 processSSOLogin() 실행

```typescript
// URL 파라미터 읽기
sso_access_token: "eyJhbGciOiJIUzI1NiIs..."
sso_refresh_token: "eyJhbGciOiJIUzI1NiIs..."

// 토큰 저장
setTokens(accessToken, refreshToken);
useTokenStore.getState().setTokens(accessToken, refreshToken);
useAuthStore.getState().setTokens(accessToken, refreshToken);

// URL에서 토큰 제거
window.history.replaceState({}, '', '/');
```

### 5. 최종 URL (브라우저 주소창)

```
http://localhost:3000/
```

**토큰 파라미터가 사라짐** ✅

### 6. 자동 로그인 완료

- Header에서 `/auth/me` API 호출
- 저장된 accessToken이 자동으로 포함됨 (interceptor)
- 사용자 정보 반환 → 로그인 상태 유지

## 테스트 방법

### 1. 로컬 테스트

**준비**:
```bash
# Hub 실행 (포트 5000)
cd E:\Dev\github\GB-Front
npm run dev

# Susi 실행 (포트 3000)
cd E:\Dev\github\Susi\susi-front
npm run dev

# Hub Backend 실행 (포트 4001)
cd E:\Dev\github\GB-Back-Nest
npm run start:dev
```

**테스트 순서**:
1. Hub(`http://localhost:5000`)에서 로그인
2. "2027 수시 예측 분석" 카드 클릭
3. 새 탭에서 Susi 열림
4. 개발자 도구 콘솔 확인:
   ```
   🔐 SSO 토큰 발견 - 자동 로그인 처리 중...
   ✅ SSO 자동 로그인 성공
   ```
5. 브라우저 주소창 확인: URL에 토큰 파라미터 없음 ✅
6. Susi에서 로그인 상태 확인 (Header에 사용자 이름 표시)

### 2. 네트워크 탭 확인

**Chrome DevTools → Network 탭**:
1. Susi 카드 클릭 전 Network 탭 열기
2. 카드 클릭
3. 첫 요청 URL 확인:
   ```
   http://localhost:3000?sso_access_token=...&sso_refresh_token=...
   ```
4. `/auth/me` API 요청 확인:
   ```
   GET /auth/me
   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
   ```

### 3. 토큰 검증

**localStorage 확인 (DevTools → Application → Local Storage)**:
```
accessToken: "eyJhbGciOiJIUzI1NiIs..."
refreshToken: "eyJhbGciOiJIUzI1NiIs..."
```

**Zustand 스토어 확인 (React DevTools)**:
```javascript
useTokenStore: {
  accessToken: "eyJhbGciOiJIUzI1NiIs...",
  refreshToken: "eyJhbGciOiJIUzI1NiIs..."
}
```

## 트러블슈팅

### 문제 1: SSO 로그인이 작동하지 않음

**증상**: Hub에서 Susi로 이동했는데 로그인 상태가 아님

**원인 확인**:
1. 콘솔에 "🔐 SSO 토큰 발견" 로그가 있는지 확인
2. localStorage에 토큰이 저장되었는지 확인
3. `/auth/me` API 호출에 Authorization 헤더가 포함되었는지 확인

**해결 방법**:
```typescript
// main.tsx 확인
processSSOLogin(); // 이 줄이 있는지 확인

// sso-helper.ts의 import 확인
import { setTokens } from '@/lib/api/token-manager';
```

### 문제 2: 토큰이 URL에 계속 남아있음

**증상**: 브라우저 주소창에 `?sso_access_token=...` 계속 표시

**원인**: `window.history.replaceState()` 실패

**해결 방법**:
```typescript
// 브라우저 호환성 확인
if (window.history && window.history.replaceState) {
  window.history.replaceState({}, '', newUrl);
} else {
  // 폴백: 페이지 리로드
  window.location.href = window.location.pathname;
}
```

### 문제 3: CORS 에러

**증상**: Hub에서 Susi로 이동 시 API 호출 실패

**원인**: Susi 앱이 Hub Backend(4001)를 호출하는데 CORS 설정 누락

**해결 방법**:
```typescript
// GB-Back-Nest의 main.ts
app.enableCors({
  origin: [
    'http://localhost:5000',  // Hub
    'http://localhost:3000',  // Susi
    'http://localhost:3001',  // MyExam
    'http://localhost:3002',  // StudyPlanner
  ],
  credentials: true,
});
```

## 다음 단계

### 1. MyExam 앱에 SSO 적용
- `MyExam/src/lib/utils/sso-helper.ts` 추가
- `MyExam/src/main.tsx`에 `processSSOLogin()` 호출 추가

### 2. StudyPlanner 앱에 SSO 적용
- 동일한 방식으로 구현

### 3. 프로덕션 배포
- `.env.production`의 도메인을 실제 프로덕션 URL로 교체
- HTTPS 인증서 설정
- CORS 설정에 프로덕션 도메인 추가

---

**문서 작성자**: Claude Code
**마지막 업데이트**: 2025-01-13
