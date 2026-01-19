# 🎯 여기서 시작하세요!

## ✅ 완료된 작업

1. ✅ Hubs 프로젝트 복사 완료
2. ✅ 프론트엔드 포트 변경 (3001)
3. ✅ 백엔드 포트 변경 (4001)
4. ✅ 로그인 API를 Hubs 프로덕션으로 설정

---

## 🚀 다음 단계 (순서대로 진행)

### 1단계: 환경 변수 설정 ⭐ (필수!)

**[SETUP-GUIDE.md](./SETUP-GUIDE.md) 문서를 열어서 환경 변수를 설정하세요!**

중요한 것:
- `susi-front/.env.local` 파일 생성
- `susi-back/.env` 파일 생성
- **JWT_SECRET은 Hubs 프로덕션과 동일하게!**

### 2단계: 의존성 설치

```bash
# 프론트엔드
cd susi-front
npm install

# 백엔드
cd susi-back
npm install
```

### 3단계: 개발 서버 실행

```bash
# 터미널 1 - 프론트엔드
cd susi-front
npm run dev
# → http://localhost:3001

# 터미널 2 - 백엔드
cd susi-back
npm run start:dev
# → http://localhost:4001
```

### 4단계: 로그인 테스트

1. 브라우저에서 http://localhost:3001 접속
2. 로그인 페이지로 이동
3. Hubs 계정으로 로그인 (Hubs 프로덕션 API 사용)
4. 로그인 성공 확인!

---

## 💡 주요 정보

### 포트
- 수시 프론트엔드: **3001**
- 수시 백엔드: **4001**
- Hubs 프로덕션 API: **https://api.geobukschool.com**

### 로그인 동작
```
수시 프론트엔드 (3001)
    ↓ 로그인 요청
Hubs 프로덕션 API
(https://api.geobukschool.com/auth/login)
    ↓ JWT 토큰 발급
수시 프론트엔드로 토큰 전달
    ↓ 이후 API 요청
수시 백엔드 (4001)
```

### Hubs와의 관계
- ✅ 공유: 로그인, 회원 DB, JWT
- ❌ 독립: 수시 비즈니스 로직, UI, 배포

---

## 📚 문서

1. **[SETUP-GUIDE.md](./SETUP-GUIDE.md)** ⭐ - 환경 설정 (필수!)
2. [README.md](./README.md) - 프로젝트 개요
3. [ARCHITECTURE.md](./ARCHITECTURE.md) - 아키텍처 설명

---

## ⚠️ 주의사항

### 절대 건드리지 말 것!
- `E:\Dev\github\GB-Front` (Hubs 프론트)
- `E:\Dev\github\GB-Back-Nest` (Hubs 백엔드)

### 반드시 동일하게 유지!
- JWT_SECRET (Hubs 프로덕션과 동일)
- Firebase 설정 (Hubs 프로덕션과 동일)
- 데이터베이스 (Hubs 프로덕션과 공유)

---

## 🎉 준비 완료!

환경 변수만 설정하면 바로 개발 시작할 수 있습니다!

**지금 [SETUP-GUIDE.md](./SETUP-GUIDE.md)로 이동하세요!**

















