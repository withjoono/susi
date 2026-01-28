import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SusiSubjectService } from './services/susi-subject.service';
import { SusiSubjectController } from './controllers/susi-subject.controller';
import { SuSiSubjectEntity } from 'src/database/entities/susi/susi-subject.entity';
import { SusiComprehensiveService } from './services/susi-comprehensive.service';
import { SusiComprehensiveEntity } from 'src/database/entities/susi/susi-comprehensive.entity';
import { SusiPassRecordEntity } from 'src/database/entities/susi/susi-pass-record.entity';
import { RecruitmentUnitPassFailRecordsEntity } from 'src/database/entities/core/recruitment-unit-pass-fail-record.entity';
import { SusiPassRecordController } from './controllers/susi-pass-record.controller';
import { SusiPassRecordService } from './services/susi-pass-record-service';
import { SusiComprehensiveController } from './controllers/susi-comprehensive.controller';
import { SusiKyokwaController } from './controllers/susi-kyokwa.controller';
import { SusiKyokwaService } from './services/susi-kyokwa.service';
import { SusiRecruitmentUnitEntity } from 'src/database/entities/susi/susi-recruitment-unit.entity';
import { SusiRecruitmentUnitController } from './controllers/susi-recruitment-unit.controller';
import { SusiRecruitmentUnitService } from './services/susi-recruitment-unit.service';
import { SusiUnitCategoryEntity } from 'src/database/entities/susi/susi-unit-category.entity';
import { SusiUnitCategoryController } from './controllers/susi-unit-category.controller';
import { SusiUnitCategoryService } from './services/susi-unit-category.service';
import { SusiCategorySubjectNecessityEntity } from 'src/database/entities/susi/susi-category-subject-necessity.entity';
import { SusiCategorySubjectNecessityController } from './controllers/susi-category-subject-necessity.controller';
import { SusiCategorySubjectNecessityService } from './services/susi-category-subject-necessity.service';
import { SusiSubjectCodeEntity } from 'src/database/entities/susi/susi-subject-code.entity';
import { SusiSubjectCodeController } from './controllers/susi-subject-code.controller';
import { SusiSubjectCodeService } from './services/susi-subject-code.service';
import { SusiCalculationModule } from './calculation/susi-calculation.module';

// 2027학년도 새 테이블 Entity
import { SusiKyokwaCutEntity } from 'src/database/entities/susi/susi-kyokwa-cut.entity';
import { SusiKyokwaRecruitmentEntity } from 'src/database/entities/susi/susi-kyokwa-recruitment.entity';
import { SusiKyokwaIpkyulEntity } from 'src/database/entities/susi/susi-kyokwa-ipkyul.entity';
import { SusiKyokwaSpecialEntity } from 'src/database/entities/susi/susi-kyokwa-special.entity';
import { SusiJonghapIpkyulEntity } from 'src/database/entities/susi/susi-jonghap-ipkyul.entity';
import { SusiJonghapRecruitmentEntity } from 'src/database/entities/susi/susi-jonghap-recruitment.entity';
import { SusiJonghapSpecialEntity } from 'src/database/entities/susi/susi-jonghap-special.entity';

// 2027학년도 새 Service/Controller
import { SusiKyokwa2027Service } from './services/susi-kyokwa-2027.service';
import { SusiKyokwa2027Controller } from './controllers/susi-kyokwa-2027.controller';
import { SusiJonghap2027Service } from './services/susi-jonghap-2027.service';
import { SusiJonghap2027Controller } from './controllers/susi-jonghap-2027.controller';

// 계열 적합성 진단
import { UniversityLevelEntity } from 'src/database/entities/susi/university-level.entity';
import { SeriesEvaluationCriteriaHumanitiesEntity } from 'src/database/entities/susi/series-evaluation-criteria-humanities.entity';
import { SeriesEvaluationCriteriaScienceEntity } from 'src/database/entities/susi/series-evaluation-criteria-science.entity';
import { SeriesEvaluationController } from './controllers/series-evaluation.controller';
import { SeriesEvaluationService } from './services/series-evaluation.service';

@Module({
  imports: [
    SusiCalculationModule, // 수시 교과전형 환산점수 계산 모듈
    TypeOrmModule.forFeature([
      SuSiSubjectEntity, // 교과
      SusiComprehensiveEntity, // 학종
      SusiPassRecordEntity, // 합불사례
      SusiRecruitmentUnitEntity, // 수시 모집단위 통합
      SusiUnitCategoryEntity, // 수시 모집단위 계열 분류
      SusiCategorySubjectNecessityEntity, // 계열별 필수과목/권장과목
      SusiSubjectCodeEntity, // 2015 개정 교과/과목 코드

      // 2027학년도 새 테이블
      SusiKyokwaCutEntity, // 교과전형 입시결과
      SusiKyokwaRecruitmentEntity, // 교과전형 세부내역
      SusiKyokwaIpkyulEntity, // 교과전형 입결(입시결과)
      SusiKyokwaSpecialEntity, // 교과 일반/특별전형
      SusiJonghapIpkyulEntity, // 종합전형 입시결과
      SusiJonghapRecruitmentEntity, // 종합전형 세부내역
      SusiJonghapSpecialEntity, // 종합 일반/특별전형

      RecruitmentUnitPassFailRecordsEntity,

      // 계열 적합성 진단
      UniversityLevelEntity, // 대학별 레벨
      SeriesEvaluationCriteriaHumanitiesEntity, // 문과 계열 평가 기준
      SeriesEvaluationCriteriaScienceEntity, // 이과 계열 평가 기준
    ]),
  ],
  controllers: [
    SusiSubjectController,
    SusiComprehensiveController,
    SusiPassRecordController,
    SusiKyokwaController, // 새 교과전형 API
    SusiRecruitmentUnitController, // 수시 모집단위 통합 API
    SusiUnitCategoryController, // 수시 모집단위 계열 분류 API
    SusiCategorySubjectNecessityController, // 계열별 필수/권장 과목 API
    SusiSubjectCodeController, // 2015 개정 교과/과목 코드 API

    // 2027학년도 새 API
    SusiKyokwa2027Controller, // 2027 교과전형 API
    SusiJonghap2027Controller, // 2027 종합전형 API

    // 계열 적합성 진단 API
    SeriesEvaluationController,
  ],
  providers: [
    SusiSubjectService,
    SusiComprehensiveService,
    SusiPassRecordService,
    SusiKyokwaService, // 새 교과전형 서비스
    SusiRecruitmentUnitService, // 수시 모집단위 통합 서비스
    SusiUnitCategoryService, // 수시 모집단위 계열 분류 서비스
    SusiCategorySubjectNecessityService, // 계열별 필수/권장 과목 서비스
    SusiSubjectCodeService, // 2015 개정 교과/과목 코드 서비스

    // 2027학년도 새 서비스
    SusiKyokwa2027Service, // 2027 교과전형 서비스
    SusiJonghap2027Service, // 2027 종합전형 서비스

    // 계열 적합성 진단 서비스
    SeriesEvaluationService,
  ],
  exports: [
    SusiSubjectService,
    SusiComprehensiveService,
    SusiKyokwaService,
    SusiRecruitmentUnitService,
    SusiUnitCategoryService,
    SusiCategorySubjectNecessityService, // 계열별 필수/권장 과목 서비스
    SusiSubjectCodeService, // 2015 개정 교과/과목 코드 서비스
    SusiCalculationModule, // 수시 교과전형 환산점수 계산 모듈

    // 2027학년도 새 서비스
    SusiKyokwa2027Service, // 2027 교과전형 서비스
    SusiJonghap2027Service, // 2027 종합전형 서비스
  ],
})
export class SusiModule {}











