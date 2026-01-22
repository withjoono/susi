import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 교과전형 세부내역 엔티티
 * 테이블: susi_kyokwa_recruitment
 * 전형 방법, 반영 비율, 등급 환산표 등 상세 정보
 */
@Entity('susi_kyokwa_recruitment')
@Index('idx_susi_kyokwa_recruitment_ida_id', ['idaId'], { unique: true })
@Index('idx_susi_kyokwa_recruitment_university_code', ['universityCode'])
@Index('idx_susi_kyokwa_recruitment_admission_type', ['admissionType'])
export class SusiKyokwaRecruitmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * IDA 고유 ID (예: 26-U001211)
   */
  @Column({ name: 'ida_id', type: 'varchar', length: 50, unique: true })
  idaId: string;

  // ========== 대학 정보 ==========

  @Column({ name: 'university_name', type: 'varchar', length: 200, nullable: true })
  universityName: string;

  @Column({ name: 'university_code', type: 'varchar', length: 20, nullable: true })
  universityCode: string;

  @Column({ name: 'university_type', type: 'varchar', length: 50, nullable: true })
  universityType: string;

  // ========== 전형 정보 ==========

  @Column({ name: 'admission_type', type: 'varchar', length: 50, nullable: true })
  admissionType: string;

  @Column({ name: 'admission_name', type: 'varchar', length: 200, nullable: true })
  admissionName: string;

  @Column({ name: 'category', type: 'varchar', length: 100, nullable: true })
  category: string;

  @Column({ name: 'recruitment_unit', type: 'varchar', length: 200, nullable: true })
  recruitmentUnit: string;

  // ========== 지역 정보 ==========

  @Column({ name: 'region_major', type: 'varchar', length: 100, nullable: true })
  regionMajor: string;

  @Column({ name: 'region_detail', type: 'varchar', length: 100, nullable: true })
  regionDetail: string;

  // ========== 전형 구분 ==========

  @Column({ name: 'admission_category', type: 'varchar', length: 20, nullable: true })
  admissionCategory: string;

  @Column({ name: 'qualification', type: 'text', nullable: true })
  qualification: string;

  // ========== 전형 방법 ==========

  @Column({ name: 'admission_method', type: 'text', nullable: true })
  admissionMethod: string;

  @Column({ name: 'minimum_standard', type: 'text', nullable: true })
  minimumStandard: string;

  @Column({ name: 'career_subject_evaluation', type: 'text', nullable: true })
  careerSubjectEvaluation: string;

  @Column({ name: 'subject_reflection_by_grade', type: 'text', nullable: true })
  subjectReflectionByGrade: string;

  @Column({ name: 'recruitment_count', type: 'int', nullable: true })
  recruitmentCount: number;

  // ========== 계열 분류 ==========

  @Column({ name: 'major_field', type: 'varchar', length: 100, nullable: true })
  majorField: string;

  @Column({ name: 'mid_field', type: 'varchar', length: 100, nullable: true })
  midField: string;

  @Column({ name: 'minor_field', type: 'varchar', length: 200, nullable: true })
  minorField: string;

  // ========== 기타 정보 ==========

  @Column({ name: 'multiple_application', type: 'varchar', length: 20, nullable: true })
  multipleApplication: string;

  @Column({ name: 'required_documents', type: 'text', nullable: true })
  requiredDocuments: string;

  @Column({ name: 'grade_reflection_ratio', type: 'text', nullable: true })
  gradeReflectionRatio: string;

  @Column({ name: 'reflected_subjects', type: 'text', nullable: true })
  reflectedSubjects: string;

  @Column({ name: 'career_selection_subjects', type: 'text', nullable: true })
  careerSelectionSubjects: string;

  // ========== 선발 방식 ==========

  @Column({ name: 'selection_model', type: 'varchar', length: 100, nullable: true })
  selectionModel: string;

  @Column({ name: 'selection_ratio', type: 'int', nullable: true })
  selectionRatio: number;

  @Column({ name: 'stage1_method', type: 'text', nullable: true })
  stage1Method: string;

  @Column({ name: 'stage2_method', type: 'text', nullable: true })
  stage2Method: string;

  // ========== 전형 요소별 비율 ==========

  @Column({ name: 'student_record_quantitative', type: 'int', nullable: true })
  studentRecordQuantitative: number;

  @Column({ name: 'student_record_qualitative', type: 'int', nullable: true })
  studentRecordQualitative: number;

  @Column({ name: 'interview_ratio', type: 'int', nullable: true })
  interviewRatio: number;

  @Column({ name: 'essay_ratio', type: 'int', nullable: true })
  essayRatio: number;

  @Column({ name: 'practical_ratio', type: 'int', nullable: true })
  practicalRatio: number;

  @Column({ name: 'document_ratio', type: 'int', nullable: true })
  documentRatio: number;

  @Column({ name: 'etc_ratio', type: 'int', nullable: true })
  etcRatio: number;

  @Column({ name: 'etc_details', type: 'text', nullable: true })
  etcDetails: string;

  // ========== 학생부 활용 ==========

  @Column({ name: 'student_record_indicator', type: 'varchar', length: 100, nullable: true })
  studentRecordIndicator: string;

  @Column({ name: 'reflected_semester', type: 'int', nullable: true })
  reflectedSemester: number;

  @Column({ name: 'grade1_ratio', type: 'int', nullable: true })
  grade1Ratio: number;

  @Column({ name: 'grade2_ratio', type: 'int', nullable: true })
  grade2Ratio: number;

  @Column({ name: 'grade3_ratio', type: 'int', nullable: true })
  grade3Ratio: number;

  @Column({ name: 'grade12_ratio', type: 'int', nullable: true })
  grade12Ratio: number;

  @Column({ name: 'grade23_ratio', type: 'int', nullable: true })
  grade23Ratio: number;

  @Column({ name: 'grade123_ratio', type: 'int', nullable: true })
  grade123Ratio: number;

  @Column({ name: 'grade13_ratio', type: 'int', nullable: true })
  grade13Ratio: number;

  // ========== 교과/비교과 ==========

  @Column({ name: 'subject_ratio', type: 'int', nullable: true })
  subjectRatio: number;

  @Column({ name: 'non_subject_ratio', type: 'int', nullable: true })
  nonSubjectRatio: number;

  @Column({ name: 'non_subject_items', type: 'text', nullable: true })
  nonSubjectItems: string;

  // ========== 등급별 환산점수 ==========

  @Column({ name: 'grade1_score', type: 'int', nullable: true })
  grade1Score: number;

  @Column({ name: 'grade2_score', type: 'int', nullable: true })
  grade2Score: number;

  @Column({ name: 'grade3_score', type: 'int', nullable: true })
  grade3Score: number;

  @Column({ name: 'grade4_score', type: 'int', nullable: true })
  grade4Score: number;

  @Column({ name: 'grade5_score', type: 'int', nullable: true })
  grade5Score: number;

  @Column({ name: 'grade6_score', type: 'int', nullable: true })
  grade6Score: number;

  @Column({ name: 'grade7_score', type: 'int', nullable: true })
  grade7Score: number;

  @Column({ name: 'grade8_score', type: 'int', nullable: true })
  grade8Score: number;

  @Column({ name: 'grade9_score', type: 'int', nullable: true })
  grade9Score: number;

  // ========== 반영 교과 및 기타 ==========

  @Column({ name: 'reflected_subjects_detail', type: 'text', nullable: true })
  reflectedSubjectsDetail: string;

  @Column({ name: 'career_subject_method', type: 'text', nullable: true })
  careerSubjectMethod: string;

  @Column({ name: 'reflection_yn', type: 'varchar', length: 5, nullable: true })
  reflectionYn: string;

  @Column({ name: 'all_areas_required', type: 'varchar', length: 20, nullable: true })
  allAreasRequired: string;

  @Column({ name: 'required_subjects', type: 'text', nullable: true })
  requiredSubjects: string;

  @Column({ name: 'inquiry_reflection_method', type: 'text', nullable: true })
  inquiryReflectionMethod: string;

  // ========== 타임스탬프 ==========

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
