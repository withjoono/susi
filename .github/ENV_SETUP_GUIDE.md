# 환경 변수 설정 가이드

Cloud Run에서 실행되는 백엔드 애플리케이션의 환경 변수를 설정하는 방법입니다.

## 🎯 환경 변수 설정 방법

Cloud Run의 환경 변수는 여러 방법으로 설정할 수 있습니다:

1. **GitHub Actions 워크플로우에서 직접 설정** (권장하지 않음 - 보안 위험)
2. **GCP Secret Manager 사용** (권장 - 보안)
3. **Cloud Run 콘솔에서 직접 설정** (간단함)
4. **gcloud CLI 사용** (자동화 가능)

## 방법 1: GCP Secret Manager 사용 (권장) 🔒

### 1단계: Secret Manager에 값 저장

```bash
# 데이터베이스 설정
echo -n "/cloudsql/ts-back-nest-479305:asia-northeast3:geobuk-db" | \
  gcloud secrets create DB_HOST --data-file=- --project=ts-back-nest-479305

echo -n "your_db_user" | \
  gcloud secrets create DB_USER --data-file=- --project=ts-back-nest-479305

echo -n "your_db_password" | \
  gcloud secrets create DB_PASSWORD --data-file=- --project=ts-back-nest-479305

echo -n "geobukschool" | \
  gcloud secrets create DB_NAME --data-file=- --project=ts-back-nest-479305

# JWT 설정
echo -n "your-jwt-secret-key-min-32-chars" | \
  gcloud secrets create JWT_SECRET --data-file=- --project=ts-back-nest-479305

echo -n "your-jwt-refresh-secret-key-min-32-chars" | \
  gcloud secrets create JWT_REFRESH_SECRET --data-file=- --project=ts-back-nest-479305

# Redis 설정 (선택사항)
echo -n "redis-host" | \
  gcloud secrets create REDIS_HOST --data-file=- --project=ts-back-nest-479305

echo -n "6379" | \
  gcloud secrets create REDIS_PORT --data-file=- --project=ts-back-nest-479305
```

### 2단계: Cloud Run 서비스 계정에 Secret 접근 권한 부여

```bash
# Cloud Run의 기본 서비스 계정 확인
gcloud run services describe susi-backend \
  --region asia-northeast3 \
  --format 'value(spec.template.spec.serviceAccountName)'

# Secret Manager Secret Accessor 역할 부여
gcloud projects add-iam-policy-binding ts-back-nest-479305 \
  --member="serviceAccount:YOUR_SERVICE_ACCOUNT@ts-back-nest-479305.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### 3단계: GitHub Actions 워크플로우 수정

`.github/workflows/deploy-backend.yml` 파일의 배포 단계에 다음 추가:

```yaml
--set-secrets=DB_HOST=DB_HOST:latest,DB_USER=DB_USER:latest,DB_PASSWORD=DB_PASSWORD:latest,DB_NAME=DB_NAME:latest,JWT_SECRET=JWT_SECRET:latest,JWT_REFRESH_SECRET=JWT_REFRESH_SECRET:latest
```

전체 예시:
```yaml
- name: Deploy to Cloud Run
  run: |
    gcloud run deploy susi-backend \
      --image asia-northeast3-docker.pkg.dev/ts-back-nest-479305/susi/backend:${{ github.sha }} \
      --region asia-northeast3 \
      --platform managed \
      --allow-unauthenticated \
      --memory 1Gi \
      --cpu 1 \
      --port 8080 \
      --set-env-vars NODE_ENV=production,PORT=8080 \
      --set-secrets=DB_HOST=DB_HOST:latest,DB_USER=DB_USER:latest,DB_PASSWORD=DB_PASSWORD:latest,DB_NAME=DB_NAME:latest,JWT_SECRET=JWT_SECRET:latest,JWT_REFRESH_SECRET=JWT_REFRESH_SECRET:latest
```

## 방법 2: Cloud Run 콘솔에서 직접 설정 (간단함) 🖱️

1. **Cloud Run 콘솔 접속**: https://console.cloud.google.com/run
2. **susi-backend 서비스 선택**
3. **"새 버전 수정 및 배포" 클릭**
4. **"변수 및 보안 비밀" 탭**
5. **환경 변수 추가**:

```
NODE_ENV=production
PORT=8080
DB_HOST=/cloudsql/ts-back-nest-479305:asia-northeast3:geobuk-db
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=geobukschool
JWT_SECRET=your-jwt-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-jwt-refresh-secret-key-min-32-chars
REDIS_HOST=your-redis-host (선택)
REDIS_PORT=6379 (선택)
```

6. **"배포" 클릭**

## 방법 3: gcloud CLI 사용 (자동화) 💻

```bash
gcloud run services update susi-backend \
  --region asia-northeast3 \
  --update-env-vars NODE_ENV=production,PORT=8080,DB_HOST=/cloudsql/ts-back-nest-479305:asia-northeast3:geobuk-db,DB_USER=your_db_user,DB_PASSWORD=your_db_password,DB_NAME=geobukschool,JWT_SECRET=your-jwt-secret,JWT_REFRESH_SECRET=your-jwt-refresh-secret
```

## 🗄️ Cloud SQL 연결 설정

### VPC Connector 생성 (Cloud SQL 연결용)

```bash
gcloud compute networks vpc-access connectors create cloud-sql-connector \
  --region=asia-northeast3 \
  --network=default \
  --range=10.8.0.0/28 \
  --project=ts-back-nest-479305
```

### Cloud Run에 VPC Connector 연결

```bash
gcloud run services update susi-backend \
  --region asia-northeast3 \
  --vpc-connector projects/ts-back-nest-479305/locations/asia-northeast3/connectors/cloud-sql-connector \
  --vpc-egress all-traffic
```

또는 GitHub Actions 워크플로우에 추가:
```yaml
--vpc-connector projects/ts-back-nest-479305/locations/asia-northeast3/connectors/cloud-sql-connector
```

## 📋 필수 환경 변수 목록

### 데이터베이스
| 변수명 | 예시 값 | 설명 |
|--------|---------|------|
| `DB_HOST` | `/cloudsql/PROJECT:REGION:INSTANCE` | Cloud SQL 연결 문자열 |
| `DB_USER` | `susi_user` | 데이터베이스 사용자 |
| `DB_PASSWORD` | `your_password` | 데이터베이스 비밀번호 |
| `DB_NAME` | `geobukschool` | 데이터베이스 이름 |

### JWT 인증
| 변수명 | 예시 값 | 설명 |
|--------|---------|------|
| `JWT_SECRET` | `your-32-char-secret` | JWT 토큰 서명 키 (Hubs와 동일해야 함) |
| `JWT_REFRESH_SECRET` | `your-refresh-secret` | JWT 리프레시 토큰 서명 키 |

### 서버 설정
| 변수명 | 예시 값 | 설명 |
|--------|---------|------|
| `NODE_ENV` | `production` | 환경 모드 |
| `PORT` | `8080` | 서버 포트 (Cloud Run 기본값) |

### Redis (선택사항)
| 변수명 | 예시 값 | 설명 |
|--------|---------|------|
| `REDIS_HOST` | `10.0.0.1` | Redis 호스트 |
| `REDIS_PORT` | `6379` | Redis 포트 |

## 🔍 환경 변수 확인

### Cloud Run 서비스의 현재 환경 변수 확인

```bash
gcloud run services describe susi-backend \
  --region asia-northeast3 \
  --format 'value(spec.template.spec.containers[0].env)'
```

### Secret Manager에 저장된 값 확인

```bash
# Secret 목록 확인
gcloud secrets list --project=ts-back-nest-479305

# 특정 Secret 값 확인 (주의: 민감 정보 노출)
gcloud secrets versions access latest --secret="DB_HOST" --project=ts-back-nest-479305
```

## 🔄 환경 변수 업데이트

### Secret Manager 값 업데이트

```bash
echo -n "new_value" | gcloud secrets versions add SECRET_NAME --data-file=-
```

### Cloud Run 환경 변수 업데이트

```bash
gcloud run services update susi-backend \
  --region asia-northeast3 \
  --update-env-vars KEY=VALUE
```

### 환경 변수 제거

```bash
gcloud run services update susi-backend \
  --region asia-northeast3 \
  --remove-env-vars KEY1,KEY2
```

## 🆘 문제 해결

### Cloud SQL 연결 실패

**증상**: `Error: connect ECONNREFUSED`

**해결**:
1. VPC Connector가 생성되었는지 확인
2. Cloud Run에 VPC Connector가 연결되었는지 확인
3. Cloud SQL 인스턴스가 실행 중인지 확인
4. DB_HOST 형식이 올바른지 확인: `/cloudsql/PROJECT:REGION:INSTANCE`

```bash
# VPC Connector 확인
gcloud compute networks vpc-access connectors list --region asia-northeast3

# Cloud SQL 인스턴스 확인
gcloud sql instances list --project=ts-back-nest-479305
```

### JWT 인증 실패

**증상**: `Error: Invalid token`

**해결**:
- JWT_SECRET이 Hubs 프로덕션과 동일한지 확인
- Secret이 올바르게 설정되었는지 확인

### Secret Manager 접근 거부

**증상**: `Error: Permission denied on Secret Manager`

**해결**:
```bash
# Cloud Run 서비스 계정 확인
gcloud run services describe susi-backend \
  --region asia-northeast3 \
  --format 'value(spec.template.spec.serviceAccountName)'

# Secret Manager 권한 부여
gcloud projects add-iam-policy-binding ts-back-nest-479305 \
  --member="serviceAccount:SERVICE_ACCOUNT" \
  --role="roles/secretmanager.secretAccessor"
```

## 📚 추가 참고 자료

- [Cloud Run 환경 변수 공식 문서](https://cloud.google.com/run/docs/configuring/environment-variables)
- [Secret Manager 공식 문서](https://cloud.google.com/secret-manager/docs)
- [Cloud SQL 연결 가이드](https://cloud.google.com/sql/docs/mysql/connect-run)

---

**보안 권장사항**:
- ✅ Secret Manager 사용 (민감 정보 보호)
- ✅ 정기적인 Secret 갱신
- ✅ 최소 권한 원칙 적용
- ❌ 환경 변수에 민감 정보 직접 입력 금지
- ❌ Git에 환경 변수 파일 커밋 금지
