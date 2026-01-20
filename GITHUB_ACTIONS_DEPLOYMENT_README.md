# 🚀 GitHub Actions 자동 배포 설정 완료!

GitHub에서 자동 배포가 가능하도록 모든 설정이 완료되었습니다.

## 📁 생성된 파일들

### GitHub Actions 워크플로우
```
.github/
├── workflows/
│   ├── deploy-frontend.yml     # 프론트엔드 자동 배포
│   ├── deploy-backend.yml      # 백엔드 자동 배포
│   └── deploy-all.yml          # 전체 자동 배포 (변경 감지)
├── GITHUB_SECRETS_SETUP.md     # GitHub Secrets 설정 가이드 (상세)
├── QUICK_DEPLOY_SETUP.md       # 빠른 설정 가이드 (5분)
├── DEPLOYMENT_CHECKLIST.md     # 배포 전 체크리스트
└── ENV_SETUP_GUIDE.md          # 환경 변수 설정 가이드
```

## ⚡ 빠른 시작 (3단계)

### 1️⃣ GitHub Secrets 설정

GitHub 저장소에 다음 2개의 Secrets를 추가하세요:

1. **FIREBASE_SERVICE_ACCOUNT**: Firebase 배포용
2. **GCP_SA_KEY**: Cloud Run 배포용

👉 **자세한 방법**: [.github/QUICK_DEPLOY_SETUP.md](.github/QUICK_DEPLOY_SETUP.md)

### 2️⃣ GCP 리소스 생성 (최초 1회)

```bash
# Artifact Registry (Docker 이미지 저장소)
gcloud artifacts repositories create susi \
  --repository-format=docker \
  --location=asia-northeast3 \
  --project=ts-back-nest-479305

# VPC Connector (Cloud SQL 연결용) - 선택사항
gcloud compute networks vpc-access connectors create cloud-sql-connector \
  --region=asia-northeast3 \
  --network=default \
  --range=10.8.0.0/28 \
  --project=ts-back-nest-479305
```

### 3️⃣ 배포 테스트

```bash
# main 브랜치에 푸시하면 자동 배포됩니다
git add .
git commit -m "feat: test deployment"
git push origin main

# GitHub Actions 탭에서 진행 상황 확인
# https://github.com/withjoono/susi/actions
```

## 🎯 배포 방식

### 자동 배포 (main 브랜치)
- **프론트엔드**: `susi-front/**` 파일 변경 시 Firebase Hosting 자동 배포
- **백엔드**: `susi-back/**` 파일 변경 시 Cloud Run 자동 배포
- **전체**: main 브랜치 푸시 시 변경된 부분만 자동 배포

### 수동 배포
- GitHub Actions 탭에서 "Run workflow" 클릭하여 수동 실행 가능

## 🌐 배포 환경

### 프론트엔드 (Firebase Hosting)
- **프로젝트**: ts-front-479305
- **도메인**: https://susi.turtleschool.com
- **빌드 시간**: ~3-5분

### 백엔드 (Cloud Run)
- **프로젝트**: ts-back-nest-479305
- **서비스**: susi-backend
- **리전**: asia-northeast3
- **빌드 시간**: ~5-8분
- **URL**: Cloud Run에서 자동 생성

## 📚 문서 가이드

1. **처음 설정하는 경우**: [.github/QUICK_DEPLOY_SETUP.md](.github/QUICK_DEPLOY_SETUP.md) (5분)
2. **자세한 설정 방법**: [.github/GITHUB_SECRETS_SETUP.md](.github/GITHUB_SECRETS_SETUP.md)
3. **배포 전 확인사항**: [.github/DEPLOYMENT_CHECKLIST.md](.github/DEPLOYMENT_CHECKLIST.md)
4. **환경 변수 설정**: [.github/ENV_SETUP_GUIDE.md](.github/ENV_SETUP_GUIDE.md)
5. **전체 배포 가이드**: [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)

## 🔍 배포 확인

배포 완료 후:

```bash
# 프론트엔드 접속
https://susi.turtleschool.com

# 백엔드 URL 확인
gcloud run services describe susi-backend \
  --region asia-northeast3 \
  --format 'value(status.url)'

# 백엔드 Health Check
curl https://YOUR-BACKEND-URL/health
```

## 🐛 문제 해결

### Firebase 배포 실패
- [ ] `FIREBASE_SERVICE_ACCOUNT` Secret이 올바른 JSON인지 확인
- [ ] Firebase 프로젝트 ID가 `ts-front-479305`인지 확인

### Cloud Run 배포 실패
- [ ] `GCP_SA_KEY` Secret이 올바른 JSON인지 확인
- [ ] Artifact Registry가 생성되었는지 확인
- [ ] 서비스 계정 권한 확인

### 자세한 문제 해결
- GitHub Actions 로그 확인
- [.github/DEPLOYMENT_CHECKLIST.md](.github/DEPLOYMENT_CHECKLIST.md) 참조

## 🎉 다음 단계

1. ✅ GitHub Secrets 설정
2. ✅ GCP 리소스 생성
3. ✅ 첫 배포 테스트
4. ✅ 환경 변수 설정 (필요시)
5. ✅ 커스텀 도메인 연결 (완료)
6. ✅ 모니터링 설정

## 💡 유용한 명령어

```bash
# GitHub CLI로 Secrets 확인
gh secret list

# Firebase 배포 (수동)
cd susi-front && npm run build && firebase deploy

# Cloud Run 배포 (수동)
cd susi-back && gcloud run deploy susi-backend --source .

# 배포 로그 확인
gcloud logging read "resource.type=cloud_run_revision" --limit 20

# 현재 배포된 버전 확인
gcloud run services describe susi-backend --region asia-northeast3
```

## 📞 지원

- **문서 확인**: [.github/](.github/) 폴더의 가이드 문서들
- **GitHub Issues**: 문제 발생 시 이슈 등록
- **Cloud Logging**: GCP 콘솔에서 자세한 로그 확인

---

**설정 완료일**: 2026-01-20  
**버전**: 1.0.0  
**상태**: ✅ 자동 배포 준비 완료
