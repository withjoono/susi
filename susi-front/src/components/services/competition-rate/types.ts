/**
 * 실시간 경쟁률 관련 타입 정의
 */

// 크롤러 데이터 항목
export interface CrawlerDataEntry {
  대학명: string;
  캠퍼스: string;
  전형명: string;
  모집단위: string;
  모집인원: string | number;
  지원인원: string | number;
  경쟁률: string;
  지역?: string;
  // 추합 관련 필드
  정원?: number;
  현재경쟁률?: string;
  작년추합?: number;
  예상최종경쟁?: string;
  예상실질경쟁?: string;
  예상실질경쟁값?: number;
  _matchType?: "exact" | "group" | "univ" | null;
  _chuhapMatchType?: "exact" | "group" | "univ" | null;
  // 예측 관련 필드
  예상최종경쟁값?: number;
  증가율?: string;
  _predictionType?: "exact" | "group" | "univ" | "overall";
  // 전형유형 관련 필드
  전형유형?: "일반" | "특별";
  특별전형카테고리?: string | null;
}

// 크롤러 데이터 (군별 분류)
export interface CrawlerData {
  가군: CrawlerDataEntry[];
  나군: CrawlerDataEntry[];
  다군: CrawlerDataEntry[];
}

// 군 타입
export type AdmissionGroup = "가군" | "나군" | "다군";

// 전형유형
export type AdmissionType = "전체" | "일반" | "특별";

// 특별전형 카테고리
export type SpecialAdmissionCategory =
  | "기회균등"
  | "농어촌"
  | "특성화고"
  | "지역인재"
  | "장애/특수"
  | "재외국민"
  | "성인학습"
  | "기타특별";

export const SPECIAL_ADMISSION_CATEGORIES: SpecialAdmissionCategory[] = [
  "기회균등",
  "농어촌",
  "특성화고",
  "지역인재",
  "장애/특수",
  "재외국민",
  "성인학습",
  "기타특별",
];

// 지역 목록
export const REGIONS = [
  { id: "all", name: "전국" },
  { id: "seoul", name: "서울" },
  { id: "gyeonggi", name: "경기" },
  { id: "incheon", name: "인천" },
  { id: "daejeon", name: "대전" },
  { id: "sejong", name: "세종" },
  { id: "chungnam", name: "충남" },
  { id: "chungbuk", name: "충북" },
  { id: "gwangju", name: "광주" },
  { id: "jeonnam", name: "전남" },
  { id: "jeonbuk", name: "전북" },
  { id: "daegu", name: "대구" },
  { id: "gyeongbuk", name: "경북" },
  { id: "gyeongnam", name: "경남" },
  { id: "busan", name: "부산" },
  { id: "ulsan", name: "울산" },
  { id: "gangwon", name: "강원" },
  { id: "jeju", name: "제주" },
] as const;

export type RegionId = (typeof REGIONS)[number]["id"];

// 지역 ID를 이름으로 변환
export function getRegionName(id: RegionId): string {
  const region = REGIONS.find((r) => r.id === id);
  return region ? region.name : "전국";
}

// 군별 색상
export const GROUP_COLORS = {
  가군: {
    bg: "bg-rose-100",
    text: "text-rose-600",
    border: "border-rose-400",
    gradient: "from-rose-500 to-pink-500",
  },
  나군: {
    bg: "bg-violet-100",
    text: "text-violet-600",
    border: "border-violet-400",
    gradient: "from-violet-500 to-purple-500",
  },
  다군: {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
    border: "border-emerald-400",
    gradient: "from-emerald-500 to-teal-500",
  },
};

// 예상실질경쟁 계산 함수
export function calcRealRate(item: CrawlerDataEntry): number {
  const 정원 = item.정원 ?? (parseInt(String(item.모집인원)) || 0);
  const 예상최종 = item.예상최종경쟁값 ?? 0;
  const 작년추합 = item.작년추합 ?? 0;
  const 분모 = 정원 + 작년추합;
  return 분모 > 0 ? (정원 * 예상최종) / 분모 : 0;
}

// 예상실질경쟁 색상
export function getRateColor(value: number): string {
  if (value <= 1) return "text-red-600 bg-red-50";
  if (value < 3) return "text-green-600 bg-green-50";
  if (value < 5) return "text-amber-600 bg-amber-50";
  return "text-rose-600 bg-rose-50";
}

// 대학명 -> 지역 매핑 (주요 대학)
const UNIVERSITY_REGION_MAP: Record<string, string> = {
  // 서울
  "서울대학교": "서울", "연세대학교": "서울", "고려대학교": "서울",
  "서강대학교": "서울", "성균관대학교": "서울", "한양대학교": "서울",
  "중앙대학교": "서울", "경희대학교": "서울", "한국외국어대학교": "서울",
  "서울시립대학교": "서울", "건국대학교(서울)": "서울", "동국대학교": "서울",
  "홍익대학교": "서울", "국민대학교": "서울", "숭실대학교": "서울",
  "세종대학교": "서울", "단국대학교": "서울", "광운대학교": "서울",
  "명지대학교": "서울", "상명대학교": "서울", "가톨릭대학교": "서울",
  "덕성여자대학교": "서울", "동덕여자대학교": "서울", "삼육대학교": "서울",
  "서울여자대학교": "서울", "성신여자대학교": "서울", "숙명여자대학교": "서울",
  "이화여자대학교": "서울",
  // 경기
  "아주대학교": "경기", "인하대학교": "경기", "가천대학교": "경기",
  "경기대학교": "경기", "수원대학교": "경기", "한신대학교": "경기",
  "한국항공대학교": "경기", "경희대학교(국제)": "경기",
  // 인천
  "인천대학교": "인천",
  // 대전
  "충남대학교": "대전", "한남대학교": "대전", "배재대학교": "대전",
  // 충남
  "단국대학교(천안)": "충남", "호서대학교": "충남", "순천향대학교": "충남",
  // 충북
  "충북대학교": "충북", "청주대학교": "충북",
  // 광주
  "전남대학교": "광주", "조선대학교": "광주", "광주대학교": "광주",
  // 전남
  "목포대학교": "전남",
  // 전북
  "전북대학교": "전북", "원광대학교": "전북", "전주대학교": "전북",
  // 대구
  "경북대학교": "대구", "계명대학교": "대구", "대구대학교": "대구",
  // 경북
  "영남대학교": "경북", "금오공과대학교": "경북",
  // 경남
  "경상국립대학교": "경남", "인제대학교": "경남", "창원대학교": "경남",
  // 부산
  "부산대학교": "부산", "부경대학교": "부산", "동아대학교": "부산",
  "동의대학교": "부산", "신라대학교": "부산",
  // 울산
  "울산대학교": "울산",
  // 강원
  "강원대학교": "강원", "한림대학교": "강원", "강릉원주대학교": "강원",
  // 제주
  "제주대학교": "제주",
};

// 대학명으로 지역 추론
export function inferRegionFromUniversity(universityName: string): string {
  // 직접 매핑 확인
  if (UNIVERSITY_REGION_MAP[universityName]) {
    return UNIVERSITY_REGION_MAP[universityName];
  }
  // 부분 매칭 시도
  for (const [univ, region] of Object.entries(UNIVERSITY_REGION_MAP)) {
    if (universityName.includes(univ.replace(/\(.*\)/, "")) || univ.includes(universityName)) {
      return region;
    }
  }
  return "기타";
}

// 지역 ID -> 이름 매핑
export function regionIdToName(regionId: RegionId): string {
  const map: Record<RegionId, string> = {
    all: "전국", seoul: "서울", gyeonggi: "경기", incheon: "인천",
    daejeon: "대전", sejong: "세종", chungnam: "충남", chungbuk: "충북",
    gwangju: "광주", jeonnam: "전남", jeonbuk: "전북", daegu: "대구",
    gyeongbuk: "경북", gyeongnam: "경남", busan: "부산", ulsan: "울산",
    gangwon: "강원", jeju: "제주",
  };
  return map[regionId] || "전국";
}
