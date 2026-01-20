# 배포 전 체크리스트

## 🔧 사전 준비 (최초 1회)

### 1. GitHub Secrets 설정
- [ ] `FIREBASE_SERVICE_ACCOUNT` 추가
- [ ] `GCP_SA_KEY` 추가
- [ ] Secrets 목록에서 정상 등록 확인

👉 자세한 설정 방법: [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md)

### 2. GCP Artifact Registry 생성
```bash
gcloud artifacts repositories create susi \
  --repository-format=docker \
  --location=asia-northeast3 \
  --description="Susi backend Docker images" \
  --project=ts-back-nest-479305
```

### 3. VPC Connector 생성 (Cloud SQL 연결용)
```bash
gcloud compute networks vpc-access connectors create cloud-sql-connector \
  --region=asia-northeast3 \
  --network=default \
  --range=10.8.0.0/28 \
  --project=ts-back-nest-479305
```

### 4. Secret Manager 설정 (환경 변수)
```bash
# DB 관련
echo -n "YOUR_DB_HOST" | gcloud secrets create DB_HOST --data-file=- --project=ts-back-nest-479305
echo -n "YOUR_DB_USER" | gcloud secrets create DB_USER --data-file=- --project=ts-back-nest-479305
echo -n "YOUR_DB_PASSWORD" | gcloud secrets create DB_PASSWORD --data-file=- --project=ts-back-nest-479305
echo -n "YOUR_DB_NAME" | gcloud secrets create DB_NAME --data-file=- --project=ts-back-nest-479305

# JWT
echo -n "YOUR_JWT_SECRET" | gcloud secrets create JWT_SECRET --data-file=- --project=ts-back-nest-479305
echo -n "YOUR_JWT_REFRESH_SECRET" | gcloud secrets create JWT_REFRESH_SECRET --data-file=- --project=ts-back-nest-479305
```

### 5. 서비스 계정 권한 확인
백엔드 배포용 서비스 계정에 필요한 권한:
- [ ] Cloud Run Admin (`roles/run.admin`)
- [ ] Service Account User (`roles/iam.serviceAccountUser`)
- [ ] Artifact Registry Writer (`roles/artifactregistry.writer`)
- [ ] Cloud SQL Client (`roles/cloudsql.client`)
- [ ] Secret Manager Secret Accessor (`roles/secretmanager.secretAccessor`)

```bash
# 권한 확인
gcloud projects get-iam-policy ts-back-nest-479305 \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:YOUR_SERVICE_ACCOUNT"
```

## 📝 매 배포 전 체크

### 코드 품질
- [ ] 로컬에서 프론트엔드 빌드 성공 (`npm run build`)
- [ ] 로컬에서 백엔드 빌드 성공 (`npm run build`)
- [ ] Lint 오류 없음
- [ ] TypeScript 컴파일 오류 없음
- [ ] 중요 기능 테스트 완료

### 환경 변수
- [ ] `.env.example` 파일이 최신 상태인지 확인
- [ ] 프로덕션 환경 변수가 Secret Manager에 등록되어 있는지 확인
- [ ] API URL이 프로덕션 환경에 맞게 설정되었는지 확인

### 데이터베이스
- [ ] 데이터베이스 마이그레이션 확인
- [ ] Cloud SQL 연결 테스트
- [ ] 필요한 시드 데이터 확인

### 보안
- [ ] JWT_SECRET이 Hubs와 동일한지 확인 (로그인 공유)
- [ ] 민감한 정보가 코드에 하드코딩되지 않았는지 확인
- [ ] CORS 설정이 올바른지 확인

### Firebase 설정 (프론트엔드)
- [ ] `firebase.json` 설정 확인
- [ ] `.firebaserc` 타겟 설정 확인 (`susi`)
- [ ] 커스텀 도메인 연결 확인 (susi.turtleschool.com)

### Cloud Run 설정 (백엔드)
- [ ] `Dockerfile`이 올바르게 작성되었는지 확인
- [ ] 포트 8080으로 서버 시작하는지 확인
- [ ] 메모리/CPU 리소스 설정 확인
- [ ] Health check 엔드포인트 동작 확인

## 🚀 배포 실행

### 자동 배포 (권장)
```bash
# 1. 변경사항 커밋
git add .
git commit -m "feat: your feature description"

# 2. main 브랜치에 푸시
git push origin main

# 3. GitHub Actions에서 배포 진행 상황 확인
# https://github.com/withjoono/susi/actions
```

### 수동 배포 (필요시)

#### 프론트엔드
```bash
cd susi-front
npm run build
firebase deploy --only hosting:susi
```

#### 백엔드
```bash
cd susi-back
gcloud run deploy susi-backend \
  --source . \
  --region asia-northeast3 \
  --platform managed \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --port 8080 \
  --project ts-back-nest-479305
```

## ✅ 배포 후 확인

### 프론트엔드
- [ ] https://susi.turtleschool.com 접속 확인
- [ ] 로그인 기능 동작 확인 (Hubs 프로덕션 연동)
- [ ] 주요 페이지 로딩 확인
- [ ] 콘솔 에러 없는지 확인
- [ ] 모바일 반응형 확인

### 백엔드
- [ ] Cloud Run 서비스 URL 접속 확인
- [ ] `/health` 엔드포인트 200 응답 확인
- [ ] Swagger 문서 접근 가능한지 확인 (`/swagger`)
- [ ] API 호출 테스트
- [ ] Cloud Logging에서 에러 로그 확인
- [ ] Cloud SQL 연결 정상 동작 확인

### 통합 테스트
- [ ] 프론트엔드에서 백엔드 API 호출 정상 동작
- [ ] 로그인 후 인증이 필요한 API 호출 확인
- [ ] 수시 분석 기능 전체 플로우 테스트
- [ ] 에러 핸들링 확인

## 🔥 롤백 절차

### GitHub Actions 배포 롤백
1. GitHub Actions 탭에서 이전 성공한 워크플로우 확인
2. 이전 커밋으로 되돌리기:
```bash
git revert HEAD
git push origin main
```

### 수동 롤백

#### 프론트엔드 (Firebase)
```bash
# 이전 배포 버전 확인
firebase hosting:channel:list

# 특정 버전으로 롤백
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL_ID TARGET_SITE_ID:live
```

#### 백엔드 (Cloud Run)
```bash
# 이전 리비전 확인
gcloud run revisions list --service susi-backend --region asia-northeast3

# 특정 리비전으로 롤백
gcloud run services update-traffic susi-backend \
  --region asia-northeast3 \
  --to-revisions REVISION_NAME=100
```

## 📊 모니터링

### 로그 확인
```bash
# 프론트엔드 (Firebase Hosting)
# Firebase Console > Hosting > 사용량 탭

# 백엔드 (Cloud Run)
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=susi-backend" \
  --limit 50 \
  --format json
```

### 메트릭 확인
- Cloud Run 콘솔에서 요청 수, 응답 시간, 에러율 확인
- Firebase Console에서 호스팅 트래픽 확인

## 🆘 문제 해결

### GitHub Actions 실패
1. Actions 탭에서 실패한 워크플로우 로그 확인
2. Secrets가 올바르게 설정되었는지 확인
3. 필요한 GCP 리소스가 생성되었는지 확인

### Firebase 배포 실패
- `FIREBASE_SERVICE_ACCOUNT` secret이 올바른 JSON인지 확인
- 프로젝트 ID와 타겟 설정 확인

### Cloud Run 배포 실패
- Docker 이미지 빌드 로그 확인
- Artifact Registry 접근 권한 확인
- Cloud Run 서비스 계정 권한 확인

### 배포 후 500 에러
- Cloud Logging에서 에러 로그 확인
- 환경 변수 설정 확인
- Cloud SQL 연결 확인

## 📞 지원

문제가 지속되면:
1. Cloud Logging에서 자세한 에러 로그 확인
2. GitHub Issues에 문제 등록
3. GCP 지원팀 문의

---

**마지막 업데이트**: 2026-01-20
