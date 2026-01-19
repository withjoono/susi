import { ApiProperty } from '@nestjs/swagger';
import { NonsulListEntity } from 'src/database/entities/nonsul/nonsul-list.entity';
import { NonsulLowestGradeListEntity } from 'src/database/entities/nonsul/nonsul-lowest-grade-list.entity';

export class AdminNonsulListResponse {
  @ApiProperty({
    description: '논술 통합 DB 목록',
  })
  list!: (NonsulListEntity & NonsulLowestGradeListEntity)[];

  @ApiProperty({
    description: '전체 Count',
  })
  totalCount!: number;
}
