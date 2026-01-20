# 🔧 GitHub Secrets 설정 지침서

## ⚠️ 중요: 다음 2개의 Secret을 GitHub에 추가해야 합니다

### 📍 GitHub Secrets 추가 위치
1. https://github.com/withjoono/susi 접속
2. **Settings** 클릭
3. 왼쪽 메뉴에서 **Secrets and variables** → **Actions** 클릭
4. **New repository secret** 버튼 클릭

---

## Secret 1: FIREBASE_SERVICE_ACCOUNT

### 이름 (Name)
```
FIREBASE_SERVICE_ACCOUNT
```

### 값 (Secret) - Firebase 프론트엔드 배포용

**프로젝트 ID**: `ts-front-479305`

#### 방법 A: Firebase Console에서 새로 생성 (권장)

1. https://console.firebase.google.com/ 접속
2. **ts-front-479305** 프로젝트 선택
3. ⚙️ **프로젝트 설정** → **서비스 계정** 탭
4. **새 비공개 키 생성** 버튼 클릭
5. 다운로드된 JSON 파일을 메모장으로 열기
6. **JSON 파일 전체 내용을 복사**하여 Secret 값에 붙여넣기

#### 방법 B: Firebase CLI 사용

```bash
# Firebase에 로그인
firebase login

# 서비스 계정 키 생성
# Firebase Console > 프로젝트 설정 > 서비스 계정에서 생성 필요
```

---

## Secret 2: GCP_SA_KEY

### 이름 (Name)
```
GCP_SA_KEY
```

### 값 (Secret) - Cloud Run 백엔드 배포용

**프로젝트 ID**: `ts-back-nest-479305`

#### 방법 A: 기존 키 파일 사용 (가장 빠름)

로컬에 이미 서비스 계정 키가 있습니다:

```bash
# PowerShell에서 실행
Get-Content E:\Dev\github\Susi\susi-back\gcs-service-account-key.json
```

또는 메모장으로 파일 열기:
```
E:\Dev\github\Susi\susi-back\gcs-service-account-key.json
```

**전체 JSON 내용을 복사**하여 Secret 값에 붙여넣기

#### 방법 B: gcloud CLI로 새로 생성

```bash
# 1. 서비스 계정 생성 (이미 있다면 스킵)
gcloud iam service-accounts create github-actions-deploy ^
  --display-name="GitHub Actions Deployment" ^
  --project=ts-back-nest-479305

# 2. 필요한 권한 부여
gcloud projects add-iam-policy-binding ts-back-nest-479305 ^
  --member="serviceAccount:github-actions-deploy@ts-back-nest-479305.iam.gserviceaccount.com" ^
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding ts-back-nest-479305 ^
  --member="serviceAccount:github-actions-deploy@ts-back-nest-479305.iam.gserviceaccount.com" ^
  --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding ts-back-nest-479305 ^
  --member="serviceAccount:github-actions-deploy@ts-back-nest-479305.iam.gserviceaccount.com" ^
  --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding ts-back-nest-479305 ^
  --member="serviceAccount:github-actions-deploy@ts-back-nest-479305.iam.gserviceaccount.com" ^
  --role="roles/cloudsql.client"

# 3. 서비스 계정 키 생성
gcloud iam service-accounts keys create gcp-deploy-key.json ^
  --iam-account=github-actions-deploy@ts-back-nest-479305.iam.gserviceaccount.com ^
  --project=ts-back-nest-479305

# 4. 생성된 키 내용 복사
type gcp-deploy-key.json
```

---

## ✅ Secret 설정 확인

### GitHub CLI로 확인 (선택사항)
```bash
gh secret list
```

예상 출력:
```
FIREBASE_SERVICE_ACCOUNT  Updated 2026-01-20
GCP_SA_KEY                Updated 2026-01-20
```

### 웹에서 확인
https://github.com/withjoono/susi/settings/secrets/actions

두 개의 Secret이 보여야 합니다:
- ✅ FIREBASE_SERVICE_ACCOUNT
- ✅ GCP_SA_KEY

---

## 🎯 다음 단계

Secret 설정이 완료되면, 터미널에서 다음 명령어를 실행하세요:

```bash
# GCP Artifact Registry 생성
gcloud artifacts repositories create susi ^
  --repository-format=docker ^
  --location=asia-northeast3 ^
  --description="Susi backend Docker images" ^
  --project=ts-back-nest-479305
```

---

## ⚠️ 주의사항

1. **Secret 값은 JSON 전체를 복사**해야 합니다 (첫 `{`부터 마지막 `}`까지)
2. **줄바꿈과 공백 포함** 그대로 복사하세요
3. **절대 Git에 커밋하지 마세요** (이미 .gitignore에 추가되어 있음)
4. **Secret은 암호화되어 저장**되며, 한번 저장하면 값을 다시 볼 수 없습니다
5. **정기적으로 키를 갱신**하세요 (보안을 위해 3-6개월마다)

---

## 🐛 문제 해결

### "Invalid JSON" 오류
- JSON 전체가 복사되었는지 확인 (`{`로 시작, `}`로 끝)
- 불필요한 공백이나 특수문자가 추가되지 않았는지 확인

### "Permission denied" 오류
- 저장소 Settings에 접근 권한이 있는지 확인
- Admin 또는 Write 권한이 필요합니다

---

**설정 완료 후**: 이 문서를 닫고 다음 단계를 진행하세요! 🚀
