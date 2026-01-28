import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * 대학 레벨 정보
 * 계열 적합성 진단에서 대학별 권장 등급 산정에 사용
 */
@Entity({ name: 'university_level' })
export class UniversityLevelEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'university_name', type: 'varchar', length: 100, comment: '대학명' })
  universityName: string;

  @Column({ name: 'university_code', type: 'varchar', length: 10, comment: '대학 코드' })
  universityCode: string;

  @Column({ type: 'int', comment: '대학 레벨 (1-7)' })
  level: number;
}
