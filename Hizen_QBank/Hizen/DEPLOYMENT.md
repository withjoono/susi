# Deployment Guide

## GitHub Actions를 통한 자동 배포

### 1. GitHub Secrets 설정

GitHub repository의 Settings > Secrets and variables > Actions에서 다음 secrets를 추가하세요:

#### 필수 Secrets
- `AWS_ACCESS_KEY_ID`: AWS IAM Access Key
- `AWS_SECRET_ACCESS_KEY`: AWS IAM Secret Key
- `DATABASE_URL`: PostgreSQL 데이터베이스 연결 문자열
- `DATABASE_ENCRYPTION_KEY`: 데이터베이스 암호화 키

#### 선택적 Secrets (개발 환경용)
- `TEST_ADMIN_EMAIL`: 테스트 관리자 이메일
- `TEST_ADMIN_USERNAME`: 테스트 관리자 사용자명
- `TEST_ADMIN_PASSWORD`: 테스트 관리자 비밀번호

### 2. 배포 트리거

- `main` 브랜치에 push: 프로덕션 배포 + 마이그레이션 실행
- `develop` 브랜치에 push: 개발 환경 배포
- Pull Request: 배포 없이 빌드만 실행

### 3. 배포 프로세스

1. **Docker 이미지 빌드**: GitHub Actions에서 Docker 이미지를 빌드
2. **ECR 푸시**: 빌드된 이미지를 Amazon ECR에 푸시
3. **ECS 배포**: ECS 서비스를 업데이트하여 새 이미지 배포
4. **마이그레이션 실행**: main 브랜치의 경우 데이터베이스 마이그레이션 실행

### 4. 로컬 개발 환경 설정

1. `env.example` 파일을 `.env`로 복사
2. 필요한 환경변수들을 설정
3. 스크립트 실행 권한 부여:
   ```bash
   chmod +x publish-development.sh
   chmod +x publish-development-migration.sh
   ```

### 5. 보안 주의사항

- AWS 인증정보는 절대 코드에 하드코딩하지 마세요
- `.env` 파일은 `.gitignore`에 포함되어 있는지 확인하세요
- 프로덕션 환경에서는 강력한 비밀번호를 사용하세요

### 6. 문제 해결

#### 배포 실패 시 확인사항
1. GitHub Secrets가 올바르게 설정되었는지 확인
2. AWS IAM 권한이 충분한지 확인
3. ECS 클러스터와 서비스가 존재하는지 확인
4. ECR 리포지토리가 존재하는지 확인

#### 로그 확인
- GitHub Actions 로그: Actions 탭에서 확인
- ECS 로그: AWS 콘솔에서 확인
- 마이그레이션 로그: ECS Task 로그에서 확인 