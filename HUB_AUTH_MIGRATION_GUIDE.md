# Hub 중앙 인증 마이그레이션 가이드

## ✅ 완료된 작업

### 1. GB-Back-Nest (Hub 인증 서버)
- ✅ SSO 토큰 검증 API 추가: `POST /auth/verify-token`
- ✅ 기존 인증 시스템 확인 (이미 완벽하게 구축됨)
- ✅ HttpOnly 쿠키 기반 보안 적용

### 2. Susi-back
- ✅ HubAuthGuard 추가 (`src/guards/hub-auth.guard.ts`)
- ✅ 전역 Guard를 Hub 인증으로 교체
- ✅ HttpModule 추가 (Hub 통신용)
- ✅ 환경 변수 설정 (`HUB_AUTH_URL=http://localhost:4001`)

### 3. Susi-front
- ✅ Hub API 클라이언트 추가 (`hub-api-client.ts`)
- ✅ Auth API를 Hub 서버로 변경
- ✅ 환경 변수 설정 (`apiUrlHub`, `apiUrlNest` 분리)
- ✅ Vite 프록시 설정 업데이트

## 🚀 시작하기

### 1. 서버 포트 설정

현재 설정:
- **GB-Back-Nest (Hub)**: 4001번 포트
- **Susi-back**: 4002번 포트
- **Susi-front**: 3000번 포트

### 2. GB-Back-Nest (Hub) 서버 실행

```bash
cd GB-Back-Nest
yarn install
yarn start:dev
```

서버가 http://localhost:4001 에서 실행됩니다.

### 3. Susi-back 서버 실행

**중요**: `.env` 파일에서 포트를 4002로 변경해야 합니다!

```bash
cd susi-back

# .env 파일 수정
# SERVER_PORT=4001 → SERVER_PORT=4002

yarn install
yarn start:dev
```

서버가 http://localhost:4002 에서 실행됩니다.

### 4. Susi-front 실행

```bash
cd susi-front
npm install
npm run dev
```

프론트엔드가 http://localhost:3000 에서 실행됩니다.

## 🔐 인증 플로우

### 로그인 플로우
```
1. 사용자가 Susi-front에서 로그인 시도
2. Susi-front → Hub (GB-Back-Nest) POST /auth/login/email
3. Hub → JWT 토큰 발급 + HttpOnly 쿠키 설정
4. Susi-front → 토큰을 localStorage에 저장
5. 이후 모든 API 요청에 Authorization 헤더로 토큰 전송
```

### API 호출 플로우
```
1. Susi-front → Susi-back API 호출 (Authorization: Bearer {token})
2. Susi-back (HubAuthGuard) → Hub POST /auth/verify-token
3. Hub → 토큰 검증 및 사용자 정보 반환
4. Susi-back → request.user에 사용자 정보 추가
5. Susi-back → 비즈니스 로직 처리 후 응답
```

### 로그아웃 플로우
```
1. Susi-front → Hub POST /auth/logout
2. Hub → Refresh Token 블랙리스트 추가
3. Hub → HttpOnly 쿠키 삭제
4. Susi-front → localStorage 토큰 삭제
```

## 🧪 테스트 방법

### 1. Hub 서버 확인
```bash
# Swagger UI 접속
http://localhost:4001/swagger

# 헬스 체크
curl http://localhost:4001/health
```

### 2. 로그인 테스트
```bash
# 이메일 로그인
curl -X POST http://localhost:4001/auth/login/email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. 토큰 검증 테스트
```bash
# 토큰 검증 (발급받은 accessToken 사용)
curl -X POST http://localhost:4001/auth/verify-token \
  -H "Content-Type: application/json" \
  -d '{"accessToken":"YOUR_ACCESS_TOKEN"}'
```

### 4. Susi-back API 테스트
```bash
# Susi-back API 호출 (Hub 토큰 사용)
curl -X GET http://localhost:4002/some-endpoint \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📝 환경 변수 설정

### GB-Back-Nest (Hub) `.env`
```env
SERVER_PORT=4001
NODE_ENV=development
# ... 기타 설정
```

### Susi-back `.env`
```env
SERVER_PORT=4002  # ⚠️ 중요: 4001에서 4002로 변경!
NODE_ENV=development
HUB_AUTH_URL=http://localhost:4001  # Hub 인증 서버 URL
# ... 기타 설정
```

### Susi-front `.env.development`
```env
VITE_API_URL_HUB=http://localhost:4001  # Hub 인증 서버 (개발 시 프록시 사용)
VITE_API_URL_SUSI=http://localhost:4002  # Susi 백엔드 (개발 시 프록시 사용)
# ... 기타 설정
```

## 🔧 문제 해결

### 포트 충돌 에러
```
Error: Port 4001 is already in use
```

**해결 방법**:
1. GB-Back-Nest가 이미 실행 중인지 확인
2. Susi-back의 포트가 4002로 설정되었는지 확인

```bash
# 4001 포트 사용 중인 프로세스 확인 (Windows)
netstat -ano | findstr :4001

# 4002 포트 사용 중인 프로세스 확인
netstat -ano | findstr :4002
```

### CORS 에러
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**해결 방법**:
1. GB-Back-Nest의 CORS 설정 확인 (`src/main.ts`)
2. Vite 프록시가 제대로 설정되었는지 확인 (`vite.config.ts`)

### 토큰 검증 실패
```
UnauthorizedException: 유효하지 않은 토큰입니다
```

**해결 방법**:
1. Hub 서버가 실행 중인지 확인
2. `HUB_AUTH_URL` 환경 변수가 올바르게 설정되었는지 확인
3. 토큰이 만료되었는지 확인 (2시간 유효)

## 🎯 다음 단계

### 다른 앱 마이그레이션
동일한 패턴으로 다른 앱들도 Hub 인증으로 전환:
1. **StudyPlanner** - 학습 플래너 앱
2. **ExamHub** - 시험 관리 앱
3. 기타 앱들...

각 앱은 다음과 같이 설정:
- Hub에서 토큰 받기
- Hub에 토큰 검증 요청
- 비즈니스 로직만 처리

### 프로덕션 배포 시 고려사항
1. **도메인 설정**
   - Hub: `auth.yourdomain.com`
   - Susi: `susi.yourdomain.com`
   - 모든 앱이 같은 루트 도메인 사용

2. **HTTPS 필수**
   - HttpOnly 쿠키는 HTTPS에서만 안전

3. **환경 변수**
   - 프로덕션 환경 변수 별도 관리
   - 시크릿 키는 반드시 변경

4. **쿠키 도메인 설정**
   ```typescript
   res.cookie('accessToken', token, {
     domain: '.yourdomain.com',  // 모든 서브도메인에서 사용
     httpOnly: true,
     secure: true,  // HTTPS only
     sameSite: 'lax',
   });
   ```

## 📚 참고 자료

- 아키텍처 문서: `HUB_AUTH_ARCHITECTURE.md`
- GB-Back-Nest README: `../GB-Back-Nest/README.md`
- Susi-back CLAUDE.md: `susi-back/CLAUDE.md`
- Susi-front CLAUDE.md: `susi-front/CLAUDE.md`

## ✨ 장점 요약

1. **사용자 경험**: 한 번 로그인 → 모든 앱 이용 (SSO)
2. **보안**: 중앙화된 인증 관리, HttpOnly 쿠키
3. **유지보수**: 인증 로직 한 곳에서 관리
4. **확장성**: 새 앱 추가 시 Hub 연결만 하면 됨
5. **일관성**: 모든 앱에서 동일한 인증 경험

## 🙋‍♂️ 지원

문제가 발생하거나 질문이 있으면:
1. 이 가이드의 "문제 해결" 섹션 확인
2. 로그 확인 (GB-Back-Nest, Susi-back 콘솔)
3. Swagger UI에서 API 테스트
