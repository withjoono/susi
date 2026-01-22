import { Module } from '@nestjs/common';
import { NonsulModule } from 'src/modules/nonsul/nonsul.module';
import { SusiModule } from 'src/modules/susi/susi.module';
import { CommonModule } from 'src/common/common.module';
import { MembersModule } from 'src/modules/members/members.module';
import { AdminSusiSubjectService } from './services/admin-susi-subject.service';
import { AdminSusiSubjectController } from './controllers/admin-susi-subject.controller';
import { AdminNonsulController } from './controllers/admin-nonsul.controller';
import { AdminNonsulService } from './services/admin-nonsul.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminSusiComprehensiveController } from './controllers/admin-susi-comprehensive.controller';
import { AdminSusiComprehensiveService } from './services/admin-susi-comprehensive.service';
import { SusiPassRecordEntity } from 'src/database/entities/susi/susi-pass-record.entity';
import { AdminSusiPassRecordController } from './controllers/admin-susi-pass-record.controller';
import { AdminSusiPassRecordService } from './services/admin-susi-pass-record.service';
import { MemberEntity } from 'src/database/entities/member/member.entity';
import { AdminStatisticController } from './controllers/admin-statistic.controller';
import { AdminStatisticService } from './services/admin-statistic.service';
import { MockexamRawToStandardEntity } from 'src/database/entities/mock-exam/mockexam-raw-to-standard.entity';
import { AdminMockExamController } from './controllers/admin-mock-exam.controller';
import { AdminMockExamService } from './services/admin-mock-exam.service';
import { PayOrderEntity } from 'src/database/entities/pay/pay-order.entity';
import { AdminPaymentController } from './controllers/admin-pay.controller';
import { AdminPaymentService } from './services/admin-pay.service';
import { PayContractEntity } from 'src/database/entities/pay/pay-contract.entity';
import { AdminMemberController } from './controllers/admin-member.controller';
import { AdminMemberService } from './services/admin-member.service';
import { PayProductEntity } from 'src/database/entities/pay/pay-product.entity';
import { PayServiceEntity } from 'src/database/entities/pay/pay-service.entity';
import { PayServiceProductEntity } from 'src/database/entities/pay/pay-service-product.entity';
import { PayCouponEntity } from 'src/database/entities/pay/pay-coupon.entity';
import { AdminProductManagementController } from './controllers/admin-product-management.controller';
import { AdminProductManagementService } from './services/admin-product-management.service';
import { AdminSusiFormulaController } from './controllers/admin-susi-formula.controller';
import { AdminSusiFormulaService } from './services/admin-susi-formula.service';
import { SusiCalculationFormulaEntity } from 'src/database/entities/susi/susi-calculation-formula.entity';

@Module({
  imports: [
    CommonModule,
    MembersModule,
    NonsulModule,
    SusiModule,
    TypeOrmModule.forFeature([
      SusiPassRecordEntity,
      MemberEntity,
      MockexamRawToStandardEntity,
      PayOrderEntity,
      PayContractEntity,
      PayProductEntity,
      PayServiceEntity,
      PayServiceProductEntity,
      PayCouponEntity,
      SusiCalculationFormulaEntity,
    ]),
  ],
  controllers: [
    AdminNonsulController,
    AdminSusiComprehensiveController,
    AdminSusiSubjectController,
    AdminSusiPassRecordController,
    AdminStatisticController,
    AdminMockExamController,
    AdminPaymentController,
    AdminMemberController,
    AdminProductManagementController,
    AdminSusiFormulaController,
  ],
  providers: [
    AdminNonsulService,
    AdminSusiComprehensiveService,
    AdminSusiSubjectService,
    AdminSusiPassRecordService,
    AdminStatisticService,
    AdminMockExamService,
    AdminPaymentService,
    AdminMemberService,
    AdminProductManagementService,
    AdminSusiFormulaService,
  ],
})
export class AdminModule {}
