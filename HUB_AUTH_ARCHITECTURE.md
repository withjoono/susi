# Hub 중앙 인증 아키텍처

## 📐 전체 구조

```
┌─────────────────────────────────────────────────┐
│         GB-Back-Nest (Hub - 중앙 인증)          │
│                                                 │
│  ✅ 회원가입 (이메일/소셜)                       │
│  ✅ 로그인/로그아웃                             │
│  ✅ JWT 토큰 발급 (Access + Refresh)            │
│  ✅ 토큰 검증 및 갱신                           │
│  ✅ 사용자 정보 관리                            │
│  ✅ HttpOnly 쿠키 기반 보안                     │
│                                                 │
└──────────────┬──────────────────────────────────┘
               │
               │ JWT 토큰 발급
               │
    ┌──────────┴─────────┬──────────────┬──────────────┐
    │                    │              │              │
    ▼                    ▼              ▼              ▼
┌─────────┐      ┌──────────────┐  ┌─────────┐  ┌──────────────┐
│  Susi   │      │ StudyPlanner │  │ ExamHub │  │ 기타 앱들... │
│         │      │              │  │         │  │              │
│ 🔒 토큰  │      │ 🔒 토큰 검증  │  │ 🔒 토큰  │  │ 🔒 토큰 검증  │
│   검증만 │      │   만 수행    │  │   검증만 │  │   만 수행    │
└─────────┘      └──────────────┘  └─────────┘  └──────────────┘
```

## 🔑 Hub의 역할

### 1. 회원 관리
- **회원가입**: 이메일, 네이버, 구글 소셜 로그인
- **프로필 관리**: 사용자 정보 수정
- **비밀번호 관리**: 비밀번호 찾기/재설정

### 2. 인증 처리
- **로그인**: `POST /auth/login/email`, `POST /auth/login/social`
- **로그아웃**: `POST /auth/logout`
- **토큰 갱신**: `POST /auth/refresh`

### 3. 사용자 정보 제공
- **내 정보 조회**: `GET /auth/me`
- **활성 서비스 조회**: `GET /auth/me/active`

### 4. 토큰 관리
- JWT 토큰 발급 (Access Token + Refresh Token)
- HttpOnly 쿠키로 토큰 저장 (XSS 방지)
- 토큰 블랙리스트 관리 (로그아웃 처리)

## 🔐 각 앱(Susi 등)의 역할

### 1. 토큰 검증만 수행
- Hub에서 발급한 JWT 토큰 검증
- 유효한 토큰이면 API 요청 처리
- 만료되었으면 Hub에 갱신 요청

### 2. 비즈니스 로직에 집중
- 자체 인증 로직 제거
- 도메인 특화 기능 개발에 집중

## 🌊 SSO 플로우

### 1️⃣ 로그인 플로우
```
1. 사용자 → Hub 로그인 페이지
2. Hub → JWT 토큰 발급 (HttpOnly 쿠키)
3. 사용자 → Susi 앱 접속 (자동으로 쿠키 포함)
4. Susi → Hub에 토큰 검증 요청
5. Hub → 토큰 유효성 확인 응답
6. Susi → 사용자에게 서비스 제공
```

### 2️⃣ 앱 간 이동 플로우
```
1. 사용자가 Susi에서 StudyPlanner로 이동
2. 같은 도메인(*.yourdomain.com)이면 쿠키 자동 공유
3. StudyPlanner → Hub에 토큰 검증
4. Hub → 유효성 확인 응답
5. StudyPlanner → 로그인 없이 바로 서비스 이용
```

### 3️⃣ 로그아웃 플로우
```
1. 사용자 → Susi에서 로그아웃 클릭
2. Susi → Hub의 /auth/logout 호출
3. Hub → Refresh Token을 블랙리스트에 추가
4. Hub → HttpOnly 쿠키 삭제
5. 모든 앱에서 자동 로그아웃
```

## 🛠 구현 방법

### Hub (GB-Back-Nest)에 추가할 것

#### 1. SSO 토큰 검증 API
```typescript
// src/auth/auth.controller.ts
@Public()
@Post('verify-token')
@ApiOperation({
  summary: 'SSO 토큰 검증',
  description: '다른 앱에서 Hub 토큰을 검증하기 위한 API'
})
async verifyToken(
  @Body() body: { accessToken: string }
): Promise<{ valid: boolean; memberId?: number; email?: string }> {
  try {
    const memberId = this.jwtService.getMemberIdFromToken(
      body.accessToken,
      this.configService.getOrThrow('auth', { infer: true }).secret,
    );

    const member = await this.membersService.findOneById(Number(memberId));

    if (!member) {
      return { valid: false };
    }

    return {
      valid: true,
      memberId: member.id,
      email: member.email,
    };
  } catch (error) {
    return { valid: false };
  }
}
```

### Susi-back에서 변경할 것

#### 1. 자체 인증 모듈 제거
- `src/auth/` 디렉토리 삭제 또는 사용 중지

#### 2. Hub 토큰 검증 Guard 추가
```typescript
// src/guards/hub-auth.guard.ts
@Injectable()
export class HubAuthGuard implements CanActivate {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request) ||
                  this.extractTokenFromCookie(request);

    if (!token) {
      throw new UnauthorizedException('토큰이 없습니다');
    }

    try {
      // Hub에 토큰 검증 요청
      const hubUrl = this.configService.get('HUB_URL');
      const response = await firstValueFrom(
        this.httpService.post(`${hubUrl}/auth/verify-token`, {
          accessToken: token,
        })
      );

      if (!response.data.valid) {
        throw new UnauthorizedException('유효하지 않은 토큰');
      }

      // 검증 성공 시 사용자 정보를 request에 추가
      request.user = {
        memberId: response.data.memberId,
        email: response.data.email,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('토큰 검증 실패');
    }
  }
}
```

### Susi-front에서 변경할 것

#### 1. API 엔드포인트 변경
```typescript
// src/lib/config/env.ts
export const env = {
  // Hub 인증 서버 URL
  authUrl: import.meta.env.VITE_HUB_AUTH_URL || 'http://localhost:4001',

  // Susi 백엔드 URL
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:4002',
};
```

#### 2. 로그인 API 호출 변경
```typescript
// src/stores/server/features/auth/apis.ts
export const emailLoginFetch = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<ILoginResponse> => {
  // Hub 인증 서버로 요청
  const res = await axios.post(`${env.authUrl}/auth/login/email`, {
    email,
    password,
  }, {
    withCredentials: true, // HttpOnly 쿠키 수신
  });

  return res.data;
};
```

## 🎯 장점

### 1. 사용자 경험
- ✅ 한 번 로그인하면 모든 앱 이용 가능
- ✅ 앱 간 이동 시 재로그인 불필요
- ✅ 일관된 로그인 UI/UX

### 2. 보안
- ✅ 인증 로직이 Hub에 집중 → 보안 관리 용이
- ✅ HttpOnly 쿠키 → XSS 공격 방지
- ✅ 비밀번호가 Hub에만 저장 → 분산 리스크 감소

### 3. 개발 및 유지보수
- ✅ 인증 정책 변경 시 Hub만 수정
- ✅ 각 앱은 비즈니스 로직에 집중
- ✅ 중복 코드 제거

### 4. 확장성
- ✅ 새 앱 추가 시 Hub 인증만 연결하면 됨
- ✅ 통합 사용자 관리
- ✅ 통합 권한 관리 가능

## 📝 마이그레이션 순서

1. **GB-Back-Nest** (Hub)
   - ✅ 이미 완전한 인증 시스템 구축됨
   - ⬜ SSO 토큰 검증 API 추가

2. **Susi-back**
   - ⬜ 자체 인증 제거
   - ⬜ Hub 토큰 검증 Guard 추가
   - ⬜ 환경 변수 설정 (HUB_URL)

3. **Susi-front**
   - ⬜ Auth API 호출을 Hub로 변경
   - ⬜ 쿠키 기반 인증으로 전환
   - ⬜ 환경 변수 설정 (VITE_HUB_AUTH_URL)

4. **테스트**
   - ⬜ 로그인/로그아웃 플로우
   - ⬜ 토큰 갱신
   - ⬜ 앱 간 SSO 동작

5. **다른 앱들** (StudyPlanner, ExamHub 등)
   - ⬜ 동일한 패턴으로 마이그레이션

## 🔍 참고 사항

### 도메인 설정
SSO가 제대로 작동하려면 모든 앱이 같은 도메인을 사용해야 합니다:
- Hub: `auth.yourdomain.com`
- Susi: `susi.yourdomain.com`
- StudyPlanner: `planner.yourdomain.com`

### CORS 설정
Hub에서 모든 서브도메인 허용:
```typescript
// GB-Back-Nest src/main.ts
app.enableCors({
  origin: [
    'https://susi.yourdomain.com',
    'https://planner.yourdomain.com',
    'http://localhost:3000', // 개발환경
  ],
  credentials: true, // HttpOnly 쿠키 허용
});
```

### 쿠키 설정
Hub에서 쿠키 발급 시:
```typescript
res.cookie('accessToken', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  domain: '.yourdomain.com', // 모든 서브도메인에서 사용 가능
  maxAge: 7200000, // 2시간
});
```
