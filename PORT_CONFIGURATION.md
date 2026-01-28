# 수시 앱 포트 설정 가이드

## ⚠️ 중요: 포트 고정 규칙

**수시 앱은 반드시 다음 포트에서만 실행됩니다:**

- **프론트엔드 (susi-front)**: `3001` 포트
- **백엔드 (susi-back)**: `4001` 포트

**절대 다른 포트로 변경하지 마세요!**

## 포트 설정 파일 위치

### 프론트엔드 (3001 포트 고정)

1. **package.json**
   ```json
   "scripts": {
     "dev": "vite --port 3001 --host"
   }
   ```

2. **vite.config.ts**
   ```typescript
   server: {
     port: 3001,
     // ...
   }
   ```

3. **.env.development**
   ```env
   VITE_FRONT_URL="http://localhost:3001"
   VITE_API_URL_NEST="http://localhost:4001"
   ```

4. **.env** (fallback)
   ```env
   VITE_FRONT_URL="http://localhost:3001"
   VITE_API_URL_NEST="http://localhost:4001"
   ```

### 백엔드 (4001 포트 고정)

1. **.env.development** (우선순위 높음)
   ```env
   PORT=4001
   FRONTEND_URL=http://localhost:3001
   ```

2. **src/config/app-config.ts**
   ```typescript
   port: process.env.PORT
     ? parseInt(process.env.PORT, 10)
     : process.env.SERVER_PORT
       ? parseInt(process.env.SERVER_PORT, 10)
       : 4001,  // 기본값
   ```

3. **src/main.ts**
   ```typescript
   const appPort = process.env.PORT || configService.getOrThrow('app', { infer: true }).port;
   await app.listen(appPort, '127.0.0.1');
   ```

4. **.env.local** (로컬 개발용)
   ```env
   SERVER_PORT=4001
   ```

## 서버 시작 방법

### 방법 1: start-servers.bat 사용 (권장)
```batch
start-servers.bat
```
- 백엔드 4001 포트로 자동 시작
- 프론트엔드 3001 포트로 자동 시작

### 방법 2: 수동 시작
```bash
# 백엔드 (4001)
cd susi-back
npm run start:dev

# 프론트엔드 (3001)
cd susi-front
npm run dev
```

## 외부 서비스 포트 (변경 가능)

다음 포트들은 외부 서비스이므로 수시 앱 포트와 무관합니다:

- **Hub Frontend**: 3000
- **Hub Backend**: 4000
- **ExamHub**: 3003
- **StudyPlanner**: 3004
- **PostgreSQL**: 5432, 5433, 5434
- **Redis**: 6379

## CORS 설정

백엔드 `src/main.ts`의 CORS 설정에서 허용된 origins:

```typescript
app.enableCors({
  origin: [
    // 프로덕션
    'https://ts-front-479305.web.app',
    'https://www.geobukschool.kr',
    'https://geobukschool.kr',
    // 로컬 개발
    'http://localhost:3000', // Hub 프론트
    'http://localhost:3001', // Susi 프론트 ✅
    'http://localhost:4000', // Hub 백엔드
  ],
  // ...
});
```

## 포트 충돌 해결

만약 포트 충돌이 발생하면:

### Windows
```powershell
# 포트 사용 프로세스 확인
netstat -ano | findstr ":3001"
netstat -ano | findstr ":4001"

# 프로세스 종료 (PID는 위 명령 결과에서 확인)
taskkill /F /PID [PID번호]
```

### 포트가 이미 사용 중일 때
1. 다른 앱을 먼저 종료
2. Docker 컨테이너 확인: `docker ps`
3. 백그라운드 프로세스 확인: `netstat -ano`

## 절대 하지 말아야 할 것

❌ 프론트엔드를 3001이 아닌 다른 포트로 실행
❌ 백엔드를 4001이 아닌 다른 포트로 실행
❌ .env 파일에서 포트 번호 변경
❌ vite.config.ts의 포트 변경
❌ package.json의 --port 플래그 변경

## 반드시 지켜야 할 것

✅ 항상 프론트엔드는 3001 포트
✅ 항상 백엔드는 4001 포트
✅ 환경 변수 파일 수정 시 반드시 3001/4001 유지
✅ start-servers.bat 사용 권장
✅ 포트 충돌 시 다른 앱 종료

---

**마지막 업데이트**: 2026-01-24
**작성자**: Claude Code
