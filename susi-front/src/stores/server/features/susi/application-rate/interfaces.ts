/**
 * 수시 경쟁률 관련 인터페이스
 */

/**
 * 경쟁률 아이템 (모집단위별)
 */
export interface IApplicationRateItem {
  universityName: string;
  departmentName: string;
  admissionType: string;
  recruitmentCount: number;
  applicationCount: number;
  competitionRate: number;
}

/**
 * 대학별 경쟁률 요약
 */
export interface IApplicationRateSummary {
  totalRecruitment: number;
  totalApplication: number;
  overallRate: number;
  lastCrawledAt: string;
}

/**
 * 대학별 경쟁률 응답
 */
export interface IApplicationRateResponse {
  universityCode: string;
  universityName: string;
  summary: IApplicationRateSummary;
  items: IApplicationRateItem[];
}

/**
 * 경쟁률 변동 내역
 */
export interface IApplicationRateChange {
  universityName: string;
  departmentName: string;
  previousCount: number;
  currentCount: number;
  changeAmount: number;
  previousRate: number;
  currentRate: number;
  recordedAt: string;
}

/**
 * 크롤링 소스 정보
 */
export interface ICrawlSource {
  universityCode: string;
  universityName: string;
  sourceUrl: string;
  isActive: boolean;
}

/**
 * 경쟁률 조회 파라미터
 */
export interface IApplicationRateQueryParams {
  universityCode?: string;
  departmentName?: string;
  admissionType?: string;
}
