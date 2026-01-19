import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolRecordService } from './schoolrecord.service';
import { SchoolRecordAttendanceDetailEntity } from 'src/database/entities/schoolrecord/schoolrecord-attendance-detail.entity';
import { SchoolRecordSelectSubjectEntity } from 'src/database/entities/schoolrecord/schoolrecord-select-subject.entity';
import { SchoolRecordSubjectLearningEntity } from 'src/database/entities/schoolrecord/schoolrecord-subject-learning.entity';
import { SchoolRecordVolunteerEntity } from 'src/database/entities/schoolrecord/schoolrecord-volunteer.entity';
import { SchoolRecordController } from './schoolrecord.controller';
import { SchoolrecordSportsArtEntity } from 'src/database/entities/schoolrecord/schoolrecord-sport-art.entity';
import { MemberEntity } from 'src/database/entities/member/member.entity';
import { MemberUploadFileListEntity } from 'src/database/entities/member/member-file';
import { SchoolRecordHtmlParserService } from './parsers/html-parser.service';
import { AiPdfParserService } from './parsers/ai-pdf-parser.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SchoolRecordAttendanceDetailEntity,
      SchoolRecordSelectSubjectEntity,
      SchoolRecordSubjectLearningEntity,
      SchoolRecordVolunteerEntity,
      SchoolrecordSportsArtEntity,
      MemberEntity,
      MemberUploadFileListEntity,
    ]),
  ],
  controllers: [SchoolRecordController],
  providers: [
    SchoolRecordService,
    SchoolRecordHtmlParserService,
    AiPdfParserService,
  ],
  exports: [
    SchoolRecordService,
    SchoolRecordHtmlParserService,
    AiPdfParserService,
  ],
})
export class SchoolRecordModule {}
