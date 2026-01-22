import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MemberEntity } from '../member/member.entity';
import { SuSiSubjectEntity } from './susi-subject.entity';

/**
 * 수시 교과전형 모집단위별 환산점수 저장 테이블
 * - 사용자별, 모집단위별 환산점수 저장
 * - 위험도(risk_score), 등급컷 정보 포함
 */
@Entity('susi_user_recruitment_scores', { comment: '수시 교과전형 모집단위별 환산점수' })
@Index(['member_id', 'susi_subject_id'], { unique: true })
@Index(['member_id'])
@Index(['member_id', 'university_name'])
@Index(['susi_subject_id'])
export class SusiUserRecruitmentScoreEntity {
  @PrimaryGeneratedColumn({ comment: '고유 ID' })
  id: number;

  @Column({ type: 'int', comment: '회원 ID' })
  member_id: number;

  @Column({ type: 'int', comment: '수시 모집단위 ID (susi_subject_tb.id)' })
  susi_subject_id: number;

  // ========== 모집단위 정보 (캐싱) ==========
  @Column({ type: 'varchar', length: 100, comment: '대학명' })
  university_name: string;

  @Column({ type: 'varchar', length: 200, comment: '모집단위명' })
  recruitment_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '전형명' })
  type_name: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '전형 기본 유형 (교과, 학종)' })
  basic_type: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '전형 세부 유형' })
  detailed_type: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '계열 (인문/자연)' })
  department: string;

  @Column({ type: 'int', nullable: true, comment: '적용 연도' })
  year: number;

  // ========== 환산점수 ==========
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 5,
    default: 0,
    comment: '환산점수',
  })
  converted_score: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 5,
    nullable: true,
    comment: '환산점수 만점',
  })
  max_score: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    comment: '환산점수 비율 (%)',
  })
  score_percentage: number;

  // ========== 평균 등급 ==========
  @Column({
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
    comment: '반영 평균 등급',
  })
  average_grade: number;

  // ========== 위험도 및 등급컷 ==========
  @Column({
    type: 'int',
    nullable: true,
    comment: '위험도 점수 (-15 ~ 10)',
  })
  risk_score: number;

  @Column({
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
    comment: '50% 등급컷 (작년 합격자 평균등급)',
  })
  grade_cut_50: number;

  @Column({
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
    comment: '70% 등급컷 (작년 합격자 상위등급)',
  })
  grade_cut_70: number;

  @Column({
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
    comment: '등급 차이 (average_grade - grade_cut_50)',
  })
  grade_difference: number;

  // ========== 작년 입시결과 (캐싱) ==========
  @Column({
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
    comment: '작년 합격자 평균 등급',
  })
  last_year_avg_grade: number;

  @Column({
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
    comment: '작년 합격자 최저 등급',
  })
  last_year_min_grade: number;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2,
    nullable: true,
    comment: '작년 경쟁률',
  })
  last_year_competition_rate: number;

  // ========== 계산 성공 여부 ==========
  @Column({ type: 'boolean', default: true, comment: '계산 성공 여부' })
  success: boolean;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '실패 사유' })
  failure_reason: string;

  // ========== 메타 정보 ==========
  @Column({
    type: 'timestamp',
    nullable: true,
    comment: '계산 일시',
  })
  calculated_at: Date;

  @CreateDateColumn({ comment: '생성일시' })
  created_at: Date;

  @UpdateDateColumn({ comment: '수정일시' })
  updated_at: Date;

  // ========== Relations ==========
  @ManyToOne(() => MemberEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member: MemberEntity;

  @ManyToOne(() => SuSiSubjectEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'susi_subject_id' })
  susi_subject: SuSiSubjectEntity;
}
