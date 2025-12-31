# Prisma + NestJS 설정 가이드

## 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

```bash
# .env 파일 생성
cp .env.example .env

# .env 파일 편집
DATABASE_URL="mysql://username:password@localhost:3306/qbank_db"
```

### 3. 데이터베이스 설정

```bash
# MySQL에서 데이터베이스 생성
mysql -u root -p
CREATE DATABASE qbank_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Prisma 설정

```bash
# Prisma Client 생성
npm run db:generate

# 스키마를 DB에 적용 (개발용)
npm run db:push

# 또는 마이그레이션 생성 (프로덕션용)
npm run db:migrate

# 초기 데이터 시딩
npm run db:seed
```

### 5. 서버 실행

```bash
npm run start:dev
```

---

## Prisma 명령어

| 명령어 | 설명 |
|-------|------|
| `npm run db:generate` | Prisma Client 생성 |
| `npm run db:push` | 스키마를 DB에 바로 적용 (개발용) |
| `npm run db:migrate` | 마이그레이션 생성 및 적용 |
| `npm run db:migrate:prod` | 프로덕션 마이그레이션 적용 |
| `npm run db:seed` | 초기 데이터 시딩 |
| `npm run db:studio` | Prisma Studio GUI 실행 |
| `npm run db:reset` | DB 초기화 및 재시딩 |

---

## 프로젝트 구조

```
Hizen_QBank/
├── prisma/
│   ├── schema.prisma      # Prisma 스키마 정의
│   └── seed.ts            # 초기 데이터 시딩
├── src/
│   ├── prisma/
│   │   ├── prisma.module.ts   # Prisma 모듈
│   │   ├── prisma.service.ts  # Prisma 서비스
│   │   └── index.ts
│   └── ...
├── .env.example           # 환경변수 예시
├── package.json
└── schema.sql             # 원본 MySQL 스키마 (참조용)
```

---

## NestJS에서 Prisma 사용하기

### 1. AppModule에 PrismaModule 추가

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma';

@Module({
  imports: [PrismaModule],
})
export class AppModule {}
```

### 2. Service에서 PrismaService 주입

```typescript
// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 사용자 목록 조회
  async findAll() {
    return this.prisma.user.findMany({
      include: {
        schoolGrade: true,
        userRoles: {
          include: { role: true },
        },
      },
    });
  }

  // 사용자 생성
  async create(data: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        userId: `ST${Date.now()}`,
        email: data.email,
        passwordHash: await hash(data.password, 10),
        name: data.name,
        userType: 'ST',
      },
    });
  }

  // 사용자 조회 (ID)
  async findOne(userId: string) {
    return this.prisma.user.findUnique({
      where: { userId },
      include: {
        schoolGrade: true,
        highschool: true,
      },
    });
  }
}
```

### 3. 복잡한 쿼리 예시

```typescript
// 문제 검색 (필터링 + 페이지네이션)
async searchProblems(filters: SearchProblemsDto) {
  const { page = 1, limit = 20, ...where } = filters;

  const [data, total] = await Promise.all([
    this.prisma.problemsReference.findMany({
      where: {
        testTypeId: where.testTypeId,
        subjectMajorId: where.subjectMajorId,
        difficulty: where.difficulty,
        year: where.year ? { gte: where.year } : undefined,
        status: 'approved',
      },
      include: {
        testType: true,
        subjectCodeMajor: true,
        subjectCodeMinor: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    this.prisma.problemsReference.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
```

### 4. 트랜잭션 사용

```typescript
// 시험 응시 제출 (트랜잭션)
async submitExam(attemptId: string, answers: SubmitAnswerDto[]) {
  return this.prisma.executeTransaction(async (tx) => {
    // 1. 답안 저장
    for (const answer of answers) {
      await tx.examAnswer.create({
        data: {
          attemptId,
          paperProblemId: answer.problemId,
          studentAnswer: answer.answer,
        },
      });
    }

    // 2. 채점
    const examAnswers = await tx.examAnswer.findMany({
      where: { attemptId },
      include: { paperProblem: true },
    });

    let totalScore = 0;
    for (const ea of examAnswers) {
      const isCorrect = ea.studentAnswer === ea.paperProblem.answer;
      const scoreEarned = isCorrect ? ea.paperProblem.score : 0;
      totalScore += scoreEarned;

      await tx.examAnswer.update({
        where: { id: ea.id },
        data: { isCorrect, scoreEarned },
      });
    }

    // 3. 응시 기록 업데이트
    return tx.examAttempt.update({
      where: { attemptId },
      data: {
        status: 'graded',
        submittedAt: new Date(),
        score: totalScore,
      },
    });
  });
}
```

---

## 스키마 통계

| 항목 | 수 |
|-----|---|
| Models (테이블) | 28개 |
| Enums | 35개 |
| Relations | 50+ |

### 주요 모델

| 모델 | 설명 |
|-----|------|
| `User` | 통합 사용자 (학생/교사/관리자 등) |
| `ProblemsReference` | 기출문제 |
| `ProblemsGenerated` | AI 생성 문제 |
| `Paper` | 시험지 |
| `ExamAttempt` | 시험 응시 |
| `Transaction` | 크레딧 거래 |

---

## 타입 안전성 예시

```typescript
// Prisma가 자동 생성한 타입 사용
import { User, ProblemsReference, Prisma } from '@prisma/client';

// 관계 포함한 타입
type UserWithRoles = Prisma.UserGetPayload<{
  include: { userRoles: { include: { role: true } } };
}>;

// 입력 타입
type CreateUserInput = Prisma.UserCreateInput;

// 쿼리 조건 타입
type UserWhereInput = Prisma.UserWhereInput;
```

---

## 문제 해결

### Prisma Client 생성 오류

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules
npm install
npm run db:generate
```

### 마이그레이션 충돌

```bash
# 마이그레이션 기록 초기화 (개발 환경에서만)
npm run db:reset
```

### 연결 오류

```bash
# .env 파일의 DATABASE_URL 확인
# MySQL 서버 실행 상태 확인
# 방화벽 설정 확인
```
