# Git 설정

## .gitignore 설정 확인

각 프로젝트의 `.gitignore` 파일이 올바르게 설정되었는지 확인하세요.

### 프론트엔드 (susi-front/.gitignore)
- node_modules
- dist
- .env

### 백엔드 (susi-back/.gitignore)
- node_modules
- dist
- .env

## Git 초기화

```bash
# 루트 디렉토리에서
git init
git add .
git commit -m "feat: 수시 프로젝트 초기 구조 생성"
```

## GitHub 저장소 연결

```bash
git remote add origin https://github.com/your-username/Susi.git
git branch -M main
git push -u origin main
```

## 환경 변수 관리

**주의**: `.env` 파일은 절대 Git에 커밋하지 마세요!

대신 `.env.example` 파일을 커밋하여 팀원들이 참고할 수 있도록 합니다.

```bash
# .env.example은 커밋 가능
git add susi-front/.env.example
git add susi-back/.env.example
git commit -m "docs: 환경 변수 예제 파일 추가"
```


















