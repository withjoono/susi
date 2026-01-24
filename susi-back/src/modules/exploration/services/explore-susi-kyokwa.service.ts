import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { SusiKyokwaRecruitmentEntity } from 'src/database/entities/susi/susi-kyokwa-recruitment.entity';
import { SusiKyokwaCutEntity } from 'src/database/entities/susi/susi-kyokwa-cut.entity';

/**
 * 수시 교과전형 탐색 서비스
 * - susi_kyokwa_recruitment 및 susi_kyokwa_cut 테이블을 직접 조회
 * - 복잡한 관계 탐색 로직 제거, ida_id로 조인
 * - 프론트엔드 탐색 페이지의 요구사항에 맞춰 데이터 반환
 */
@Injectable()
export class ExploreSusiKyokwaService {
  private readonly logger = new Logger(ExploreSusiKyokwaService.name);

  constructor(
    @InjectRepository(SusiKyokwaRecruitmentEntity)
    private readonly susiKyokwaRecruitmentRepository: Repository<SusiKyokwaRecruitmentEntity>,
    @InjectRepository(SusiKyokwaCutEntity)
    private readonly susiKyokwaCutRepository: Repository<SusiKyokwaCutEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Step 1: 연도, 전형으로 조회 (등급컷, 대학이름 등)
   * - 프론트엔드 차트에서 사용
   */
  async getStep1(year: string, basicType: '일반' | '특별') {
    const cacheKey = `explore-susi-kyokwa:step1:${year}-${basicType}`;
    const cachedData = await this.cacheManager.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    // 전체 데이터 수 확인
    const totalCount = await this.susiKyokwaRecruitmentRepository.count();
    this.logger.log(`[getStep1] Total recruitment records: ${totalCount}`);

    // 일반/특별 전형 데이터 수 확인
    const targetCount = await this.susiKyokwaRecruitmentRepository.count({
      where: { admissionCategory: basicType },
    });
    this.logger.log(`[getStep1] Filtered by admissionCategory="${basicType}": ${targetCount}`);

    // susi_kyokwa_recruitment 테이블에서 데이터 조회
    const recruitmentData = await this.susiKyokwaRecruitmentRepository.find({
      where: {
        admissionCategory: basicType,
      },
      select: {
        id: true,
        idaId: true,
        universityName: true,
        universityCode: true,
        universityType: true,
        admissionType: true,
        admissionName: true,
        category: true,
        recruitmentUnit: true,
        regionMajor: true,
        regionDetail: true,
        majorField: true,
        recruitmentCount: true,
      },
    });

    // ida_id 목록 추출
    const idaIds = recruitmentData.map((r) => r.idaId).filter(Boolean);

    // susi_kyokwa_cut 테이블에서 등급컷 정보 조회
    const cutData = await this.susiKyokwaCutRepository.find({
      where: {
        idaId: In(idaIds),
      },
    });

    // ida_id를 키로 하는 Map 생성
    const cutMap = new Map(cutData.map((cut) => [cut.idaId, cut]));

    // 데이터 그룹화 (대학명-전형명-계열로 그룹화)
    const groupedData = this.groupDataForStep1(recruitmentData, cutMap);
    const result = { items: groupedData };

    await this.cacheManager.set(cacheKey, result, 120 * 60 * 1000); // 120분 캐시

    return result;
  }

  /**
   * Step 2: ID 목록으로 최저등급 관련 데이터 조회
   */
  async getStep2(ids: number[]) {
    const data = await this.susiKyokwaRecruitmentRepository.find({
      where: { id: In(ids) },
      select: {
        id: true,
        idaId: true,
        universityName: true,
        universityCode: true,
        universityType: true,
        regionMajor: true,
        admissionType: true,
        admissionName: true,
        category: true,
        recruitmentUnit: true,
        majorField: true,
        recruitmentCount: true,
        minimumStandard: true,
      },
    });

    const items = data.map((item) => ({
      id: item.id,
      university: {
        id: 0,
        name: item.universityName || '',
        region: item.regionMajor || '',
        code: item.universityCode || '',
        establishment_type: item.universityType || '',
      },
      admission: {
        id: 0,
        name: item.admissionName || '',
        year: 2025,
        basic_type: '일반' as '일반' | '특별',
      },
      general_field: {
        id: this.getDepartmentId(item.majorField),
        name: item.majorField || '',
      },
      name: item.recruitmentUnit || '',
      recruitment_number: item.recruitmentCount || null,
      minimum_grade: {
        is_applied: item.minimumStandard ? 'Y' : 'N',
        description: item.minimumStandard || null,
      },
    }));

    return { items };
  }

  /**
   * Step 3: ID 목록으로 비교과 관련 데이터 조회
   */
  async getStep3(ids: number[]) {
    const data = await this.susiKyokwaRecruitmentRepository.find({
      where: { id: In(ids) },
      select: {
        id: true,
        idaId: true,
        universityName: true,
        universityCode: true,
        universityType: true,
        regionMajor: true,
        admissionType: true,
        admissionName: true,
        category: true,
        recruitmentUnit: true,
        majorField: true,
        admissionMethod: true,
        qualification: true,
        studentRecordQuantitative: true,
        documentRatio: true,
        interviewRatio: true,
      },
    });

    const items = data.map((item) => ({
      id: item.id,
      university: {
        id: 0,
        name: item.universityName || '',
        region: item.regionMajor || '',
        code: item.universityCode || '',
        establishment_type: item.universityType || '',
      },
      admission: {
        id: 0,
        name: item.admissionName || '',
        year: 2025,
        basic_type: '일반' as '일반' | '특별',
      },
      general_field: {
        id: this.getDepartmentId(item.majorField),
        name: item.majorField || '',
      },
      name: item.recruitmentUnit || '',
      method: {
        method_description: item.admissionMethod,
        subject_ratio: item.studentRecordQuantitative,
        document_ratio: item.documentRatio,
        interview_ratio: item.interviewRatio,
        practical_ratio: null,
        other_details: null,
        second_stage_first_ratio: null,
        second_stage_interview_ratio: null,
        second_stage_other_ratio: null,
        second_stage_other_details: null,
        eligibility: item.qualification,
        school_record_evaluation_score: null,
        school_record_evaluation_elements: null,
      },
    }));

    return { items };
  }

  /**
   * Step 4: ID 목록으로 모집단위 관련 데이터 조회
   */
  async getStep4(ids: number[]) {
    const recruitmentData = await this.susiKyokwaRecruitmentRepository.find({
      where: { id: In(ids) },
      select: {
        id: true,
        idaId: true,
        universityName: true,
        universityCode: true,
        universityType: true,
        regionMajor: true,
        admissionType: true,
        admissionName: true,
        category: true,
        recruitmentUnit: true,
        majorField: true,
        recruitmentCount: true,
      },
    });

    // ida_id 목록 추출
    const idaIds = recruitmentData.map((r) => r.idaId).filter(Boolean);

    // susi_kyokwa_cut 테이블에서 등급컷 정보 조회
    const cutData = await this.susiKyokwaCutRepository.find({
      where: {
        idaId: In(idaIds),
      },
    });

    // ida_id를 키로 하는 Map 생성
    const cutMap = new Map(cutData.map((cut) => [cut.idaId, cut]));

    const items = recruitmentData.map((item) => {
      const cut = cutMap.get(item.idaId);

      return {
        id: item.id,
        name: item.recruitmentUnit || '',
        recruitment_number: item.recruitmentCount || null,
        university: {
          id: 0,
          name: item.universityName || '',
          region: item.regionMajor || '',
          code: item.universityCode || '',
          establishment_type: item.universityType || '',
        },
        admission: {
          id: 0,
          name: item.admissionName || '',
          year: 2025,
          basic_type: '일반' as '일반' | '특별',
        },
        general_field: {
          id: this.getDepartmentId(item.majorField),
          name: item.majorField || '',
        },
        scores: {
          grade_50_cut: cut?.gradeInitialCut || null,
          grade_70_cut: cut?.gradeAdditionalCut || null,
          convert_50_cut: cut?.convertedScoreInitialCut || null,
          convert_70_cut: null,
          risk_plus_5: null,
          risk_plus_4: null,
          risk_plus_3: null,
          risk_plus_2: null,
          risk_plus_1: null,
          risk_minus_1: null,
          risk_minus_2: null,
          risk_minus_3: null,
          risk_minus_4: null,
          risk_minus_5: null,
        },
      };
    });

    return { items };
  }

  /**
   * Step 5: ID 목록으로 전형일자(면접) 관련 데이터 조회
   */
  async getStep5(ids: number[]) {
    const data = await this.susiKyokwaRecruitmentRepository.find({
      where: { id: In(ids) },
      select: {
        id: true,
        idaId: true,
        universityName: true,
        universityCode: true,
        universityType: true,
        regionMajor: true,
        admissionType: true,
        admissionName: true,
        category: true,
        recruitmentUnit: true,
        majorField: true,
        recruitmentCount: true,
        interviewRatio: true,
      },
    });

    const items = data.map((item) => ({
      id: item.id,
      name: item.recruitmentUnit || '',
      recruitment_number: item.recruitmentCount || null,
      university: {
        id: 0,
        name: item.universityName || '',
        region: item.regionMajor || '',
        code: item.universityCode || '',
        establishment_type: item.universityType || '',
      },
      admission: {
        id: 0,
        name: item.admissionName || '',
        year: 2025,
        basic_type: '일반' as '일반' | '특별',
      },
      general_field: {
        id: this.getDepartmentId(item.majorField),
        name: item.majorField || '',
      },
      interview: item.interviewRatio
        ? {
            is_reflected: 1,
            interview_type: null,
            materials_used: null,
            interview_process: null,
            evaluation_content: null,
            interview_date: null,
            interview_time: null,
          }
        : null,
    }));

    return { items };
  }

  /**
   * 상세 정보 조회
   */
  async getDetail(id: number) {
    const item = await this.susiKyokwaRecruitmentRepository.findOne({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException(`ID ${id}에 해당하는 데이터를 찾을 수 없습니다.`);
    }

    // 등급컷 정보 조회
    const cut = await this.susiKyokwaCutRepository.findOne({
      where: { idaId: item.idaId },
    });

    return {
      id: item.id,
      name: item.recruitmentUnit || '',
      recruitment_number: item.recruitmentCount || null,
      university: {
        id: 0,
        name: item.universityName || '',
        region: item.regionMajor || '',
        code: item.universityCode || '',
        establishment_type: item.universityType || '',
      },
      admission: {
        id: 0,
        name: item.admissionName || '',
        year: 2025,
        basic_type: '일반' as '일반' | '특별',
        category: {
          id: 1,
          name: '교과',
        },
        subtypes: [],
      },
      admission_method: {
        method_description: item.admissionMethod,
        subject_ratio: item.studentRecordQuantitative,
        document_ratio: item.documentRatio,
        interview_ratio: item.interviewRatio,
        practical_ratio: item.practicalRatio,
        other_details: null,
        second_stage_first_ratio: null,
        second_stage_interview_ratio: null,
        second_stage_other_ratio: null,
        second_stage_other_details: null,
        eligibility: item.qualification,
        school_record_evaluation_score: null,
        school_record_evaluation_elements: null,
      },
      general_field: {
        id: this.getDepartmentId(item.majorField),
        name: item.majorField || '',
      },
      fields: {
        major: item.majorField ? { id: 0, name: item.majorField } : null,
        mid: item.midField ? { id: 0, name: item.midField } : null,
        minor: item.minorField ? { id: 0, name: item.minorField } : null,
      },
      minimum_grade: {
        is_applied: item.minimumStandard ? 'Y' : 'N',
        description: item.minimumStandard,
      },
      interview: item.interviewRatio
        ? {
            is_reflected: 1,
            interview_type: null,
            materials_used: null,
            interview_process: null,
            evaluation_content: null,
            interview_date: null,
            interview_time: null,
          }
        : null,
      scores: {
        grade_50_cut: cut?.gradeInitialCut || null,
        grade_70_cut: cut?.gradeAdditionalCut || null,
        convert_50_cut: cut?.convertedScoreInitialCut || null,
        convert_70_cut: null,
        risk_plus_5: null,
        risk_plus_4: null,
        risk_plus_3: null,
        risk_plus_2: null,
        risk_plus_1: null,
        risk_minus_1: null,
        risk_minus_2: null,
        risk_minus_3: null,
        risk_minus_4: null,
        risk_minus_5: null,
      },
      previous_results: this.buildPreviousResults(cut),
    };
  }

  /**
   * 데이터 그룹화 (Step 1용)
   * - 대학명-전형명-계열로 그룹화하여 min_cut, max_cut 계산
   */
  private groupDataForStep1(
    recruitmentData: SusiKyokwaRecruitmentEntity[],
    cutMap: Map<string, SusiKyokwaCutEntity>,
  ) {
    const groupedMap = new Map<
      string,
      {
        id: number;
        university: {
          id: number;
          name: string;
          region: string;
          code: string;
          establishment_type: string;
        };
        name: string;
        year: number;
        basic_type: '일반' | '특별';
        category: { id: number; name: string };
        subtype_ids: number[];
        general_type: { id: number; name: string };
        min_cut: number | null;
        max_cut: number | null;
        recruitment_unit_ids: number[];
      }
    >();

    recruitmentData.forEach((item) => {
      if (!item.majorField) return;

      const key = `${item.universityName}-${item.admissionName}-${item.majorField}`;
      const cut = cutMap.get(item.idaId);
      const gradeCut = cut?.gradeInitialCut;
      const gradeCutNum = gradeCut ? parseFloat(String(gradeCut)) : NaN;
      const validGradeCut = !isNaN(gradeCutNum) && gradeCutNum >= 1 && gradeCutNum <= 9 ? gradeCutNum : null;

      if (!groupedMap.has(key)) {
        groupedMap.set(key, {
          id: item.id,
          university: {
            id: 0,
            name: item.universityName || '',
            region: item.regionMajor || '',
            code: item.universityCode || '',
            establishment_type: item.universityType || '',
          },
          name: item.admissionName || '',
          year: 2025,
          basic_type: '일반',
          category: { id: 1, name: '교과' },
          subtype_ids: [],
          general_type: {
            id: this.getDepartmentId(item.majorField),
            name: item.majorField,
          },
          min_cut: validGradeCut,
          max_cut: validGradeCut ? validGradeCut + 0.05 : null,
          recruitment_unit_ids: [item.id],
        });
      } else {
        const group = groupedMap.get(key)!;
        if (validGradeCut !== null) {
          if (group.min_cut === null || validGradeCut < group.min_cut) {
            group.min_cut = validGradeCut;
          }
          if (group.max_cut === null || validGradeCut > group.max_cut) {
            group.max_cut = validGradeCut;
          }
        }
        group.recruitment_unit_ids.push(item.id);
      }
    });

    return Array.from(groupedMap.values()).map((group) => {
      if (group.min_cut !== null && group.max_cut !== null) {
        if (group.min_cut === group.max_cut) {
          group.max_cut = Math.min(group.max_cut + 0.05, 9);
        }
        return {
          ...group,
          min_cut: parseFloat(group.min_cut.toFixed(2)),
          max_cut: parseFloat(group.max_cut.toFixed(2)),
        };
      }
      return group;
    });
  }

  /**
   * 계열(department) 문자열을 ID로 변환
   */
  private getDepartmentId(department: string | null): number {
    const departmentMap: Record<string, number> = {
      인문: 1,
      사회: 2,
      자연: 3,
      공학: 4,
      의약: 5,
      예체능: 6,
      교육: 7,
    };
    return departmentMap[department || ''] || 0;
  }

  /**
   * 과거 입결 데이터 구성
   */
  private buildPreviousResults(cut: SusiKyokwaCutEntity | undefined) {
    if (!cut) return [];

    const results = [];

    if (cut.grade50p2024 || cut.competitionRate2024) {
      results.push({
        year: 2024,
        result_criteria: '50%',
        grade_cut: cut.grade50p2024 || null,
        converted_score_cut: cut.convertedScore50p2024 || null,
        competition_ratio: cut.competitionRate2024 || null,
        recruitment_number: cut.recruitment2024 || null,
      });
    }

    if (cut.grade50p2023 || cut.competitionRate2023) {
      results.push({
        year: 2023,
        result_criteria: '50%',
        grade_cut: cut.grade50p2023 || null,
        converted_score_cut: cut.convertedScore50p2023 || null,
        competition_ratio: cut.competitionRate2023 || null,
        recruitment_number: cut.recruitment2023 || null,
      });
    }

    return results;
  }
}
