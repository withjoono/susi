# 배포 가이드

## 프론트엔드 배포 (Firebase Hosting)

### 1. Firebase 프로젝트 설정

```bash
cd susi-front
npm install -g firebase-tools
firebase login
firebase init hosting
```

### 2. 빌드 및 배포

```bash
npm run build
firebase deploy
```

### 배포 URL
- 스테이징: https://susi-staging.web.app
- 프로덕션: https://susi.geobukschool.com

## 백엔드 배포 (Google Cloud Run)

### 1. Dockerfile 생성

`susi-back/Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 8080
CMD ["npm", "run", "start:prod"]
```

### 2. Cloud Run 배포

```bash
cd susi-back

# Cloud Run에 배포
gcloud run deploy susi-backend \
  --source . \
  --region asia-northeast3 \
  --platform managed \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --port 8080
```

### 3. 환경 변수 설정

Cloud Run 콘솔에서 환경 변수를 설정하세요:
- DB_HOST
- DB_USER
- DB_PASSWORD
- JWT_SECRET
- 등...

## 데이터베이스 (Cloud SQL)

### Hubs와 동일한 Cloud SQL 인스턴스 사용

수시 프로젝트는 Hubs와 동일한 데이터베이스를 사용합니다.

연결 설정:
```env
DB_HOST=/cloudsql/project-id:region:instance-name
```

## CI/CD (GitHub Actions)

`.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches:
      - main

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Build and Deploy Frontend
        run: |
          cd susi-front
          npm ci
          npm run build
          firebase deploy --token ${{ secrets.FIREBASE_TOKEN }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Cloud Run
        uses: google-github-actions/deploy-cloudrun@v1
        with:
          service: susi-backend
          source: ./susi-back
          region: asia-northeast3
```

## 모니터링

- **프론트엔드**: Firebase Hosting 콘솔
- **백엔드**: Cloud Run 콘솔, Cloud Logging
- **에러 트래킹**: Sentry (선택사항)

---

**배포 전 체크리스트**:
- [ ] 환경 변수 설정 확인
- [ ] JWT_SECRET이 Hubs와 동일한지 확인
- [ ] 데이터베이스 연결 테스트
- [ ] API 엔드포인트 테스트
- [ ] CORS 설정 확인


















