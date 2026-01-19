import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NonsulListEntity } from 'src/database/entities/nonsul/nonsul-list.entity';
import { NonsulService } from './nonsul.service';
import { NonsulLowestGradeListEntity } from 'src/database/entities/nonsul/nonsul-lowest-grade-list.entity';
import { EssayExcelParserService } from './parsers/excel-parser.service';
import { NonsulController } from './nonsul.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NonsulListEntity, NonsulLowestGradeListEntity])],
  controllers: [NonsulController],
  providers: [NonsulService, EssayExcelParserService],
  exports: [NonsulService, EssayExcelParserService],
})
export class NonsulModule {}
