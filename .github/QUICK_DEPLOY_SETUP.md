# 🚀 GitHub 자동 배포 빠른 설정 가이드

이 가이드는 GitHub Actions를 통한 자동 배포를 5분 안에 설정하는 방법을 안내합니다.

## 📋 준비물

1. GitHub 저장소 (https://github.com/withjoono/susi)
2. Firebase 프로젝트 (ts-front-479305)
3. GCP 프로젝트 (ts-back-nest-479305)
4. 관리자 권한

## ⚡ 빠른 설정 (3단계)

### 1️⃣ Firebase 서비스 계정 키 생성

```bash
# 이미 키 파일이 있다면:
cat susi-front/firebase-service-account-key.json

# 새로 생성하려면:
# 1. https://console.firebase.google.com/ 접속
# 2. ts-front-479305 프로젝트 선택
# 3. 프로젝트 설정 → 서비스 계정
# 4. "새 비공개 키 생성" 클릭
# 5. 다운로드된 JSON 파일 내용 복사
```

### 2️⃣ GCP 서비스 계정 키 생성

```bash
# 방법 A: 기존 키 사용 (추천)
cat susi-back/gcs-service-account-key.json

# 방법 B: gcloud CLI로 새로 생성
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions Deployment" \
  --project=ts-back-nest-479305

# 필요한 권한 부여
for role in run.admin iam.serviceAccountUser artifactregistry.writer cloudsql.client secretmanager.secretAccessor; do
  gcloud projects add-iam-policy-binding ts-back-nest-479305 \
    --member="serviceAccount:github-actions@ts-back-nest-479305.iam.gserviceaccount.com" \
    --role="roles/$role"
done

# 키 생성
gcloud iam service-accounts keys create gcp-sa-key.json \
  --iam-account=github-actions@ts-back-nest-479305.iam.gserviceaccount.com

# 키 내용 복사
cat gcp-sa-key.json
```

### 3️⃣ GitHub Secrets 추가

1. **GitHub 저장소 접속**: https://github.com/withjoono/susi
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret** 클릭하여 아래 2개 추가:

#### Secret 1: `FIREBASE_SERVICE_ACCOUNT`
```
이름: FIREBASE_SERVICE_ACCOUNT
값: (1단계에서 복사한 Firebase 서비스 계정 JSON 전체 내용)
```

#### Secret 2: `GCP_SA_KEY`
```
이름: GCP_SA_KEY
값: (2단계에서 복사한 GCP 서비스 계정 JSON 전체 내용)
```

## ✅ 설정 확인

```bash
# GitHub CLI로 확인 (선택사항)
gh secret list
# 출력 예시:
# FIREBASE_SERVICE_ACCOUNT  Updated 2026-01-20
# GCP_SA_KEY                Updated 2026-01-20
```

## 🎉 첫 배포 테스트

```bash
# 간단한 변경 후 푸시
git add .
git commit -m "feat: test GitHub Actions deployment"
git push origin main

# GitHub Actions 탭에서 배포 진행 상황 확인
# https://github.com/withjoono/susi/actions
```

## 🔍 필수 GCP 리소스 생성

배포가 실패한다면 다음 리소스들이 생성되어 있는지 확인하세요:

### Artifact Registry (Docker 이미지 저장소)

```bash
gcloud artifacts repositories create susi \
  --repository-format=docker \
  --location=asia-northeast3 \
  --description="Susi backend Docker images" \
  --project=ts-back-nest-479305
```

### VPC Connector (Cloud SQL 연결용)

```bash
gcloud compute networks vpc-access connectors create cloud-sql-connector \
  --region=asia-northeast3 \
  --network=default \
  --range=10.8.0.0/28 \
  --project=ts-back-nest-479305
```

### Secret Manager (환경 변수)

```bash
# 예시: DB 호스트 저장
echo -n "/cloudsql/ts-back-nest-479305:asia-northeast3:geobuk-db" | \
  gcloud secrets create DB_HOST --data-file=- --project=ts-back-nest-479305

# 필요한 secrets:
# - DB_HOST
# - DB_USER
# - DB_PASSWORD
# - DB_NAME
# - JWT_SECRET
# - JWT_REFRESH_SECRET
```

## 🌐 배포 URL

배포가 완료되면 다음 URL에서 서비스를 확인할 수 있습니다:

- **프론트엔드**: https://susi.turtleschool.com
- **백엔드**: https://susi-backend-[RANDOM-ID]-an.a.run.app

백엔드 URL은 Cloud Run 콘솔에서 확인할 수 있습니다:
```bash
gcloud run services describe susi-backend \
  --region asia-northeast3 \
  --format 'value(status.url)'
```

## 🐛 문제 해결

### Firebase 배포 실패
```bash
# Secret이 올바른 JSON 형식인지 확인
# GitHub Secrets에서 복사한 JSON 전체를 붙여넣었는지 확인
```

### Cloud Run 배포 실패: Permission Denied
```bash
# 서비스 계정 권한 확인
gcloud projects get-iam-policy ts-back-nest-479305 \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:github-actions@"
```

### Cloud Run 배포 실패: Artifact Registry Not Found
```bash
# Artifact Registry 저장소 생성 (위 '필수 GCP 리소스 생성' 참조)
gcloud artifacts repositories list --project=ts-back-nest-479305
```

### Cloud Run 서비스 시작 실패
```bash
# Cloud Logging에서 에러 확인
gcloud logging read "resource.type=cloud_run_revision" \
  --limit 20 \
  --format json \
  --project=ts-back-nest-479305
```

## 📚 추가 문서

- 자세한 설정: [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md)
- 배포 체크리스트: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- 전체 배포 가이드: [../DEPLOYMENT-GUIDE.md](../DEPLOYMENT-GUIDE.md)

## 💡 팁

1. **Secret 값은 절대 공유하지 마세요**: JSON 키는 매우 민감한 정보입니다
2. **정기적으로 키 갱신**: 보안을 위해 3-6개월마다 서비스 계정 키를 갱신하세요
3. **배포 실패 알림**: GitHub Actions 설정에서 이메일 알림을 활성화하세요
4. **롤백 준비**: 문제 발생 시 빠르게 롤백할 수 있도록 준비하세요

---

**설정 완료 시간**: ~5분  
**최초 배포 시간**: ~10-15분  
**이후 배포 시간**: ~5-8분
