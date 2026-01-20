# GitHub Secrets 설정 가이드

GitHub Actions를 통한 자동 배포를 위해 다음 Secrets를 설정해야 합니다.

## 설정 방법

1. GitHub 저장소 페이지로 이동
2. **Settings** → **Secrets and variables** → **Actions** 클릭
3. **New repository secret** 버튼을 클릭하여 아래 secrets를 추가

## 필요한 Secrets

### 1. FIREBASE_SERVICE_ACCOUNT

**설명**: Firebase Hosting 배포를 위한 서비스 계정 키

**가져오는 방법**:
```bash
# Firebase Console에서
1. https://console.firebase.google.com/ 접속
2. ts-front-479305 프로젝트 선택
3. 프로젝트 설정 → 서비스 계정
4. "새 비공개 키 생성" 클릭
5. 생성된 JSON 파일의 내용을 그대로 복사
```

**또는 기존 키 사용**:
```bash
cat susi-front/firebase-service-account-key.json
```

### 2. GCP_SA_KEY

**설명**: Cloud Run 배포를 위한 GCP 서비스 계정 키

**가져오는 방법**:
```bash
# GCP Console에서
1. https://console.cloud.google.com/ 접속
2. ts-back-nest-479305 프로젝트 선택
3. IAM 및 관리자 → 서비스 계정
4. "서비스 계정 만들기" 또는 기존 계정 선택
5. 필요한 역할 부여:
   - Cloud Run Admin
   - Service Account User
   - Artifact Registry Writer
   - Cloud SQL Client
6. 키 탭 → "키 추가" → "새 키 만들기" → JSON
7. 생성된 JSON 파일의 내용을 그대로 복사
```

**또는 기존 키 사용**:
```bash
cat susi-back/gcs-service-account-key.json
```

**또는 gcloud CLI 사용**:
```bash
# 1. 서비스 계정 생성 (이미 있다면 스킵)
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions" \
  --project=ts-back-nest-479305

# 2. 필요한 역할 부여
gcloud projects add-iam-policy-binding ts-back-nest-479305 \
  --member="serviceAccount:github-actions@ts-back-nest-479305.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding ts-back-nest-479305 \
  --member="serviceAccount:github-actions@ts-back-nest-479305.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding ts-back-nest-479305 \
  --member="serviceAccount:github-actions@ts-back-nest-479305.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

# 3. 서비스 계정 키 생성
gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions@ts-back-nest-479305.iam.gserviceaccount.com \
  --project=ts-back-nest-479305

# 4. 생성된 key.json 파일의 내용을 복사
cat key.json
```

## Secret 값 확인

추가한 Secret이 올바른지 확인:
```bash
# GitHub CLI 사용
gh secret list

# 웹에서 확인
# Settings → Secrets and variables → Actions에서 목록 확인
```

## 추가 설정 (선택사항)

### Cloud SQL 연결을 위한 VPC Connector 생성

```bash
gcloud compute networks vpc-access connectors create cloud-sql-connector \
  --region=asia-northeast3 \
  --network=default \
  --range=10.8.0.0/28 \
  --project=ts-back-nest-479305
```

### Secret Manager에 환경 변수 저장

```bash
# DB 관련 secrets
echo -n "YOUR_DB_HOST" | gcloud secrets create DB_HOST --data-file=- --project=ts-back-nest-479305
echo -n "YOUR_DB_USER" | gcloud secrets create DB_USER --data-file=- --project=ts-back-nest-479305
echo -n "YOUR_DB_PASSWORD" | gcloud secrets create DB_PASSWORD --data-file=- --project=ts-back-nest-479305
echo -n "YOUR_DB_NAME" | gcloud secrets create DB_NAME --data-file=- --project=ts-back-nest-479305

# JWT secrets
echo -n "YOUR_JWT_SECRET" | gcloud secrets create JWT_SECRET --data-file=- --project=ts-back-nest-479305
echo -n "YOUR_JWT_REFRESH_SECRET" | gcloud secrets create JWT_REFRESH_SECRET --data-file=- --project=ts-back-nest-479305
```

### Artifact Registry 저장소 생성

```bash
gcloud artifacts repositories create susi \
  --repository-format=docker \
  --location=asia-northeast3 \
  --description="Susi backend Docker images" \
  --project=ts-back-nest-479305
```

## 배포 테스트

Secrets 설정 후 배포 테스트:

```bash
# main 브랜치에 푸시하여 자동 배포 트리거
git add .
git commit -m "test: GitHub Actions 배포 테스트"
git push origin main

# 또는 수동으로 워크플로우 실행
# GitHub Actions 탭에서 "Deploy All Services" 워크플로우의 "Run workflow" 클릭
```

## 문제 해결

### Firebase 배포 실패
- `FIREBASE_SERVICE_ACCOUNT` secret이 올바른 JSON 형식인지 확인
- Firebase 프로젝트 ID가 `ts-front-479305`인지 확인

### Cloud Run 배포 실패
- `GCP_SA_KEY` secret이 올바른 JSON 형식인지 확인
- 서비스 계정에 필요한 권한이 모두 부여되었는지 확인
- Artifact Registry 저장소가 생성되었는지 확인

### 권한 오류
```bash
# 서비스 계정 권한 확인
gcloud projects get-iam-policy ts-back-nest-479305 \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:github-actions@ts-back-nest-479305.iam.gserviceaccount.com"
```

## 참고 링크

- [Firebase Service Account 생성](https://firebase.google.com/docs/admin/setup#initialize-sdk)
- [GCP Service Account 관리](https://cloud.google.com/iam/docs/creating-managing-service-accounts)
- [Cloud Run 배포](https://cloud.google.com/run/docs/deploying)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
