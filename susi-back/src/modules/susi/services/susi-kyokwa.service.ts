import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { SuSiSubjectEntity } from 'src/database/entities/susi/susi-subject.entity';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

/**
 * 수시 교과전형 서비스
 * - susi_subject_tb 테이블을 직접 조회하여 프론트엔드에서 필요한 형식으로 반환
 * - explore-susi-kyokwa API와 동일한 응답 형식 유지
 */
@Injectable()
export class SusiKyokwaService {
  constructor(
    @InjectRepository(SuSiSubjectEntity)
    private readonly susiSubjectRepository: Repository<SuSiSubjectEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Step 1: 연도, 전형으로 조회 (등급컷, 대학이름 등)
   * - 프론트엔드 차트에서 사용
   */
  async getStep1(year: number, basicType: '일반' | '특별') {
    const cacheKey = `susi-kyokwa:step1:${year}-${basicType}`;
    const cachedData = await this.cacheManager.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const data = await this.susiSubjectRepository.find({
      where: {
        basic_type: basicType === '일반' ? '일반' : '특별',
      },
      select: {
        id: true,
        unified_id: true,
        basic_type: true,
        type_name: true,
        university_name: true,
        university_code: true,
        national_or_private: true,
        detailed_type: true,
        region: true,
        department: true,
        grade_cut: true,
        grade_cut_70: true,
        recruitment_unit_name: true,
      },
    });

    const groupedData = this.groupDataForStep1(data);
    const result = { items: groupedData };

    await this.cacheManager.set(cacheKey, result, 120 * 60 * 1000); // 120분 캐시

    return result;
  }

  /**
   * Step 2: ID 목록으로 최저등급 관련 데이터 조회
   */
  async getStep2(ids: number[]) {
    const data = await this.susiSubjectRepository.find({
      where: { id: In(ids) },
      select: {
        id: true,
        university_name: true,
        university_code: true,
        national_or_private: true,
        region: true,
        type_name: true,
        department: true,
        basic_type: true,
        recruitment_unit_name: true,
        recruitment_number: true,
        minimum_academic_standards_applied: true,
        minimum_academic_standards_text: true,
      },
    });

    const items = data.map((item) => ({
      id: item.id,
      university: {
        id: 0, // susi_subject_tb에는 대학 ID가 없음
        name: item.university_name,
        region: item.region,
        code: item.university_code,
        establishment_type: item.national_or_private,
      },
      admission: {
        id: 0,
        name: item.type_name,
        year: 2025,
        basic_type: item.basic_type as '일반' | '특별',
      },
      general_field: {
        id: this.getDepartmentId(item.department),
        name: item.department,
      },
      name: item.recruitment_unit_name,
      recruitment_number: item.recruitment_number ? parseInt(item.recruitment_number) : null,
      minimum_grade: {
        is_applied: item.minimum_academic_standards_applied ? 'Y' : 'N',
        description: item.minimum_academic_standards_text,
      },
    }));

    return { items };
  }

  /**
   * Step 3: ID 목록으로 비교과 관련 데이터 조회
   */
  async getStep3(ids: number[]) {
    const data = await this.susiSubjectRepository.find({
      where: { id: In(ids) },
      select: {
        id: true,
        university_name: true,
        university_code: true,
        national_or_private: true,
        region: true,
        type_name: true,
        department: true,
        basic_type: true,
        recruitment_unit_name: true,
        selection_method: true,
        curriculum: true,
        attendance: true,
        volunteer: true,
        document_non_academic: true,
        interview: true,
        step1_score: true,
        step2_others: true,
        step2_other_details: true,
        application_eligibility_text: true,
      },
    });

    const items = data.map((item) => ({
      id: item.id,
      university: {
        id: 0,
        name: item.university_name,
        region: item.region,
        code: item.university_code,
        establishment_type: item.national_or_private,
      },
      admission: {
        id: 0,
        name: item.type_name,
        year: 2025,
        basic_type: item.basic_type as '일반' | '특별',
      },
      general_field: {
        id: this.getDepartmentId(item.department),
        name: item.department,
      },
      name: item.recruitment_unit_name,
      method: {
        method_description: item.selection_method,
        subject_ratio: item.curriculum,
        document_ratio: item.document_non_academic,
        interview_ratio: item.interview,
        practical_ratio: null,
        other_details: item.step2_other_details,
        second_stage_first_ratio: item.step1_score,
        second_stage_interview_ratio: null,
        second_stage_other_ratio: item.step2_others,
        second_stage_other_details: item.step2_other_details,
        eligibility: item.application_eligibility_text,
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
    const data = await this.susiSubjectRepository.find({
      where: { id: In(ids) },
      select: {
        id: true,
        university_name: true,
        university_code: true,
        national_or_private: true,
        region: true,
        type_name: true,
        department: true,
        basic_type: true,
        recruitment_unit_name: true,
        recruitment_number: true,
        grade_cut: true,
        grade_cut_70: true,
        converted_score_cut: true,
        converted_score_total: true,
        risk_level_plus5: true,
        risk_level_plus4: true,
        risk_level_plus3: true,
        risk_level_plus2: true,
        risk_level_plus1: true,
        risk_level_minus1: true,
        risk_level_minus2: true,
        risk_level_minus3: true,
        risk_level_minus4: true,
        risk_level_minus5: true,
      },
    });

    const items = data.map((item) => ({
      id: item.id,
      name: item.recruitment_unit_name,
      recruitment_number: item.recruitment_number ? parseInt(item.recruitment_number) : null,
      university: {
        id: 0,
        name: item.university_name,
        region: item.region,
        code: item.university_code,
        establishment_type: item.national_or_private,
      },
      admission: {
        id: 0,
        name: item.type_name,
        year: 2025,
        basic_type: item.basic_type as '일반' | '특별',
      },
      general_field: {
        id: this.getDepartmentId(item.department),
        name: item.department,
      },
      scores: {
        grade_50_cut: item.grade_cut ? parseFloat(item.grade_cut) : null,
        grade_70_cut: item.grade_cut_70 ? parseFloat(item.grade_cut_70) : null,
        convert_50_cut: item.converted_score_cut ? parseFloat(item.converted_score_cut) : null,
        convert_70_cut: null,
        risk_plus_5: item.risk_level_plus5,
        risk_plus_4: item.risk_level_plus4,
        risk_plus_3: item.risk_level_plus3,
        risk_plus_2: item.risk_level_plus2,
        risk_plus_1: item.risk_level_plus1,
        risk_minus_1: item.risk_level_minus1,
        risk_minus_2: item.risk_level_minus2,
        risk_minus_3: item.risk_level_minus3,
        risk_minus_4: item.risk_level_minus4,
        risk_minus_5: item.risk_level_minus5,
      },
    }));

    return { items };
  }

  /**
   * Step 5: ID 목록으로 전형일자(면접) 관련 데이터 조회
   */
  async getStep5(ids: number[]) {
    const data = await this.susiSubjectRepository.find({
      where: { id: In(ids) },
      select: {
        id: true,
        university_name: true,
        university_code: true,
        national_or_private: true,
        region: true,
        type_name: true,
        department: true,
        basic_type: true,
        recruitment_unit_name: true,
        recruitment_number: true,
        interview_score_applied: true,
        interview_type: true,
        interview_resources: true,
        interview_method: true,
        interview_evaluation_content: true,
        interview_date_text: true,
        interview_time: true,
      },
    });

    const items = data.map((item) => ({
      id: item.id,
      name: item.recruitment_unit_name,
      recruitment_number: item.recruitment_number ? parseInt(item.recruitment_number) : null,
      university: {
        id: 0,
        name: item.university_name,
        region: item.region,
        code: item.university_code,
        establishment_type: item.national_or_private,
      },
      admission: {
        id: 0,
        name: item.type_name,
        year: 2025,
        basic_type: item.basic_type as '일반' | '특별',
      },
      general_field: {
        id: this.getDepartmentId(item.department),
        name: item.department,
      },
      interview: item.interview_score_applied
        ? {
            is_reflected: 1,
            interview_type: item.interview_type,
            materials_used: item.interview_resources,
            interview_process: item.interview_method,
            evaluation_content: item.interview_evaluation_content,
            interview_date: item.interview_date_text,
            interview_time: item.interview_time,
          }
        : null,
    }));

    return { items };
  }

  /**
   * 상세 정보 조회
   */
  async getDetail(id: number) {
    const item = await this.susiSubjectRepository.findOne({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException(`ID ${id}에 해당하는 데이터를 찾을 수 없습니다.`);
    }

    return {
      id: item.id,
      name: item.recruitment_unit_name,
      recruitment_number: item.recruitment_number ? parseInt(item.recruitment_number) : null,
      university: {
        id: 0,
        name: item.university_name,
        region: item.region,
        code: item.university_code,
        establishment_type: item.national_or_private,
      },
      admission: {
        id: 0,
        name: item.type_name,
        year: 2025,
        basic_type: item.basic_type as '일반' | '특별',
        category: {
          id: 1,
          name: '교과',
        },
        subtypes: item.detailed_type
          ? item.detailed_type.split(',').map((n, idx) => ({
              id: parseInt(n) || idx,
              name: n,
            }))
          : [],
      },
      admission_method: {
        method_description: item.selection_method,
        subject_ratio: item.curriculum,
        document_ratio: item.document_non_academic,
        interview_ratio: item.interview,
        practical_ratio: null,
        other_details: item.step2_other_details,
        second_stage_first_ratio: item.step1_score,
        second_stage_interview_ratio: null,
        second_stage_other_ratio: item.step2_others,
        second_stage_other_details: item.step2_other_details,
        eligibility: item.application_eligibility_text,
        school_record_evaluation_score: null,
        school_record_evaluation_elements: null,
      },
      general_field: {
        id: this.getDepartmentId(item.department),
        name: item.department,
      },
      fields: {
        major: item.large_department ? { id: 0, name: item.large_department } : null,
        mid: item.medium_department ? { id: 0, name: item.medium_department } : null,
        minor: item.small_department ? { id: 0, name: item.small_department } : null,
      },
      minimum_grade: {
        is_applied: item.minimum_academic_standards_applied ? 'Y' : 'N',
        description: item.minimum_academic_standards_text,
      },
      interview: item.interview_score_applied
        ? {
            is_reflected: 1,
            interview_type: item.interview_type,
            materials_used: item.interview_resources,
            interview_process: item.interview_method,
            evaluation_content: item.interview_evaluation_content,
            interview_date: item.interview_date_text,
            interview_time: item.interview_time,
          }
        : null,
      scores: {
        grade_50_cut: item.grade_cut ? parseFloat(item.grade_cut) : null,
        grade_70_cut: item.grade_cut_70 ? parseFloat(item.grade_cut_70) : null,
        convert_50_cut: item.converted_score_cut ? parseFloat(item.converted_score_cut) : null,
        convert_70_cut: null,
        risk_plus_5: item.risk_level_plus5,
        risk_plus_4: item.risk_level_plus4,
        risk_plus_3: item.risk_level_plus3,
        risk_plus_2: item.risk_level_plus2,
        risk_plus_1: item.risk_level_plus1,
        risk_minus_1: item.risk_level_minus1,
        risk_minus_2: item.risk_level_minus2,
        risk_minus_3: item.risk_level_minus3,
        risk_minus_4: item.risk_level_minus4,
        risk_minus_5: item.risk_level_minus5,
      },
      previous_results: this.buildPreviousResults(item),
    };
  }

  /**
   * 데이터 그룹화 (Step 1용)
   * - 대학명-전형명-계열로 그룹화하여 min_cut, max_cut 계산
   */
  private groupDataForStep1(data: SuSiSubjectEntity[]) {
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

    data.forEach((item) => {
      if (!item.department) return;

      const key = `${item.university_name}-${item.type_name}-${item.department}`;
      const gradeCutNum = item.grade_cut ? parseFloat(item.grade_cut) : NaN;
      const gradeCut = !isNaN(gradeCutNum) && gradeCutNum >= 1 && gradeCutNum <= 9 ? gradeCutNum : null;

      const detailedTypeIds = item.detailed_type
        ? item.detailed_type
            .split(',')
            .filter((n) => n !== '' && !isNaN(Number(n)))
            .map((n) => Number(n))
        : [];

      if (!groupedMap.has(key)) {
        groupedMap.set(key, {
          id: item.id,
          university: {
            id: 0,
            name: item.university_name || '',
            region: item.region || '',
            code: item.university_code || '',
            establishment_type: item.national_or_private || '',
          },
          name: item.type_name || '',
          year: 2025,
          basic_type: (item.basic_type as '일반' | '특별') || '일반',
          category: { id: 1, name: '교과' },
          subtype_ids: detailedTypeIds,
          general_type: {
            id: this.getDepartmentId(item.department),
            name: item.department,
          },
          min_cut: gradeCut,
          max_cut: gradeCut ? gradeCut + 0.05 : null,
          recruitment_unit_ids: [item.id],
        });
      } else {
        const group = groupedMap.get(key)!;
        if (gradeCut !== null) {
          if (group.min_cut === null || gradeCut < group.min_cut) {
            group.min_cut = gradeCut;
          }
          if (group.max_cut === null || gradeCut > group.max_cut) {
            group.max_cut = gradeCut;
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
  private buildPreviousResults(item: SuSiSubjectEntity) {
    const results = [];

    if (item.admission_2024_grade || item.competition_rate_2024) {
      results.push({
        year: 2024,
        result_criteria: item.admission_criteria_2024,
        grade_cut: item.admission_2024_grade ? parseFloat(item.admission_2024_grade) : null,
        converted_score_cut: item.admission_2024_converted_score
          ? parseFloat(item.admission_2024_converted_score)
          : null,
        competition_ratio: item.competition_rate_2024 ? parseFloat(item.competition_rate_2024) : null,
        recruitment_number: null,
      });
    }

    if (item.admission_2023_grade || item.competition_rate_2023) {
      results.push({
        year: 2023,
        result_criteria: item.admission_criteria_2023,
        grade_cut: item.admission_2023_grade ? parseFloat(item.admission_2023_grade) : null,
        converted_score_cut: item.admission_2023_converted_score
          ? parseFloat(item.admission_2023_converted_score)
          : null,
        competition_ratio: item.competition_rate_2023 ? parseFloat(item.competition_rate_2023) : null,
        recruitment_number: null,
      });
    }

    if (item.admission_2022_grade || item.competition_rate_2022) {
      results.push({
        year: 2022,
        result_criteria: item.admission_criteria_2022,
        grade_cut: item.admission_2022_grade ? parseFloat(item.admission_2022_grade) : null,
        converted_score_cut: null,
        competition_ratio: item.competition_rate_2022 ? parseFloat(item.competition_rate_2022) : null,
        recruitment_number: null,
      });
    }

    return results;
  }
}
