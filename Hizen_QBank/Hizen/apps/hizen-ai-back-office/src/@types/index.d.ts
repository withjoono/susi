interface QuestionDto {
  id?: string;

  content?: string;
  images?: string[];

  solution?: string;
  answer?: string;

  labels?: string[];
  subject?: SubjectType;
  subjectDetail?: string;

  difficulty?: DifficultyType;
}

interface LabelDto {
  id?: string;
  grade?: GradeType;
  subject?: SubjectType;
  content?: string;
  color?: string;
}

interface TeacherDto {
  email?: string;
  name?: string;
  phone?: string;
  createdAt?: number;
  approvedAt?: number;
  approvedBy?: string;
}

interface DistributorDto {
  id?: string;
  email?: string;
  name?: string;
  company?: string;
  address?: string;
  phone?: string;
  createdAt?: number;
  approvedAt?: number;
  approvedBy?: string;
}

interface DistributorMemberDto {
  email?: string;
  name?: string;
  phone?: string;
  distributorId?: string;
  position?: string;
  createdAt?: number;
  approvedAt?: number;
  approvedBy?: string;
}

interface AcademyDto {
  id?: string;
  name?: string;
  address?: string;
  phone?: string;
  distributorId?: string;
  distributorName?: string;
  createdAt?: number;
  approvedAt?: number;
  approvedBy?: string;
}

type SubjectType = 'math' | 'science' | 'society' | 'english' | 'korean';

type DifficultyType = 'easy' | 'normal' | 'hard';

interface ExtractQuestionPromptDto {
  imageIndex?: number;
  messages?: PromptMessageDto[];
}

interface PromptMessageDto {
  role?: string;
  content?: string;
}

declare module 'pdfjs-dist/build/pdf.worker.min.js?url' {
  const workerSrc: string;
  export default workerSrc;
}

interface ParsedQuestion {
  /** base64 (data URL) 포맷 이미지 */
  question: string;
  /** base64 (data URL) 포맷 이미지들 */
  images: string[];
}

interface QuestionPayload {
  /** Storage 경로 (예: questions/abc-123/question.png) */
  question: string;
  /** Storage 경로 배열 */
  images: string[];
}

interface GetQuestionsParams {
  subject: SubjectType;
  limit: number;
  pageToken: string | null;
  direction: 'next' | 'prev' | null;
}

interface GetQuestionsResponse {
  questions: QuestionDto[];
  totalCount: number;
}

interface StudentDto {
  username: string;
  createdAt: number;
  email: string;
  school: string;
  grade: number;
  credit: number;
  address: string;
  membership: {
    startAt: number;
    endAt: number;
  };
}
