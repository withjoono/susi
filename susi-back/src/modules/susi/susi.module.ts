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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SuSiSubjectEntity, // 교과
      SusiComprehensiveEntity, // 학종
      SusiPassRecordEntity, // 합불사례
      SusiRecruitmentUnitEntity, // 수시 모집단위 통합
      SusiUnitCategoryEntity, // 수시 모집단위 계열 분류
      SusiCategorySubjectNecessityEntity, // 계열별 필수과목/권장과목
      SusiSubjectCodeEntity, // 2015 개정 교과/과목 코드

      RecruitmentUnitPassFailRecordsEntity,
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
  ],
  exports: [
    SusiSubjectService,
    SusiComprehensiveService,
    SusiKyokwaService,
    SusiRecruitmentUnitService,
    SusiUnitCategoryService,
    SusiCategorySubjectNecessityService, // 계열별 필수/권장 과목 서비스
    SusiSubjectCodeService, // 2015 개정 교과/과목 코드 서비스
  ],
})
export class SusiModule {}











