import { Entity, Column, PrimaryColumn, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 수시 모집단위 통합 테이블 (단일 플랫 구조)
 * - 대학, 전형, 모집단위 정보를 하나의 테이블에 통합
 * - Excel 파일 ss_univ_recruit_id.xlsx 구조 기반
 */
@Entity('ss_recruitment_units', { comment: '수시 모집단위 통합 테이블' })
@Index('idx_ss_ru_university_code', ['universityCode'])
@Index('idx_ss_ru_admission_type', ['admissionType'])
@Index('idx_ss_ru_admission_type_code', ['admissionTypeCode'])
@Index('idx_ss_ru_region', ['region'])
export class SusiRecruitmentUnitEntity {
  /**
   * 복합 ID (예: U001211)
   */
  @PrimaryColumn({ type: 'varchar', length: 20, comment: '복합 ID (예: U001211)' })
  id: string;

  // ========== 대학 정보 ==========

  @Column({ name: 'university_name', type: 'varchar', length: 100, comment: '대학명' })
  universityName: string;

  @Column({ name: 'university_code', type: 'varchar', length: 20, comment: '대학코드 (예: U001)' })
  universityCode: string;

  // ========== 전형 정보 ==========

  @Column({ name: 'admission_type', type: 'varchar', length: 50, comment: '전형타입 (종합, 교과, 논술, 실기, 특기자)' })
  admissionType: string;

  @Column({ name: 'admission_type_code', type: 'int', comment: '전형타입코드' })
  admissionTypeCode: number;

  @Column({ name: 'admission_name', type: 'varchar', length: 100, comment: '전형명 (예: 고른기회전형)' })
  admissionName: string;

  // ========== 모집단위 정보 ==========

  @Column({ name: 'unit_name', type: 'varchar', length: 200, comment: '모집단위명 (예: 기초학부)' })
  unitName: string;

  // ========== 지역 정보 ==========

  @Column({ name: 'region', type: 'varchar', length: 50, nullable: true, comment: '지역(광역)' })
  region: string;

  // ========== 타임스탬프 ==========

  @CreateDateColumn({ name: 'created_at', comment: '생성일시' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '수정일시' })
  updatedAt: Date;
}
