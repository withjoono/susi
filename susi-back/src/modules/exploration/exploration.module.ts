import { Module } from '@nestjs/common';
import { ExploreSusiController } from './controllers/explore-susi.controller';
import { ExploreSusiKyokwaService } from './services/explore-susi-kyokwa.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdmissionEntity } from 'src/database/entities/core/admission.entity';
import { RecruitmentUnitEntity } from 'src/database/entities/core/recruitment-unit.entity';
import { ExploreSusiJonghapService } from './services/explore-susi-jonghap.service';
import { ExploreSearchController } from './controllers/explore-search.controller';
import { ExploreSearchService } from './services/explore-search.service';
import { UniversityEntity } from 'src/database/entities/core/university.entity';
import { RegularAdmissionEntity } from 'src/database/entities/core/regular-admission.entity';
import { ExploreRegularService } from './services/explore-regular-admission.service';
import { ExploreRegularController } from './controllers/explore-regular-admission.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdmissionEntity,
      RecruitmentUnitEntity,
      UniversityEntity,
      RegularAdmissionEntity,
    ]),
  ],
  controllers: [ExploreSusiController, ExploreSearchController, ExploreRegularController],
  providers: [
    ExploreSusiKyokwaService,
    ExploreSusiJonghapService,
    ExploreSearchService,
    ExploreRegularService,
  ],
})
export class ExplorationModule {}
