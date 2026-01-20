/**
 * ============================================
 * 생활기록부 업로드 훅 (NestJS 백엔드 사용)
 * 2024-12 NestJS로 완전 마이그레이션 완료
 * ============================================
 */

import { authClient } from "@/lib/api";
import { useAuthStore } from "@/stores/client/use-auth-store";
import {
  useGetCurrentUser,
  useGetSchoolRecords,
} from "@/stores/server/features/me/queries";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const useLifeRecordUpload = () => {
  const { data: currentUser } = useGetCurrentUser();
  const { data: schoolRecords, refetch: _refetchSchoolRecord } = useGetSchoolRecords();

  // 생기부 데이터가 없으면 업로드 가능 (isEmpty가 true면 canUpload도 true)
  const canUpload = schoolRecords?.isEmpty ?? true;

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Zustand
  const { clearTokens } = useAuthStore();

  const _handleLogout = () => {
    clearTokens();
    queryClient.clear();
    toast.success("토큰이 만료되어 로그아웃됩니다.");
    navigate({ to: "/auth/login" });
  };

  /**
   * 생기부 파일 업로드 (NestJS 백엔드)
   * - HTML: POST /schoolrecord/parse/html → PATCH /members/life-record (재학생용)
   * - PDF: POST /schoolrecord/parse/pdf (졸업생용 - AI 파싱 후 자동 저장)
   */
  const uploadFile = async (type: "html" | "pdf", file: File) => {
    if (!currentUser) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      if (type === "html") {
        // 1. HTML 파싱
        const parseRes = await authClient.post("/schoolrecord/parse/html", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (parseRes.data?.data) {
          const parsedData = parseRes.data.data;

          // 2. 파싱된 데이터 저장 (camelCase → snake_case 변환은 백엔드 DTO에서 처리)
          await authClient.patch("/members/life-record", {
            attendances: [], // HTML 파서에서 attendance는 아직 미지원
            subjects: parsedData.subjectLearnings || [],
            selectSubjects: parsedData.selectSubjects || [],
          });

          toast.success("생활기록부(HTML) 업로드에 성공하였습니다.");
          await _refetchSchoolRecord();
        }
      } else if (type === "pdf") {
        // PDF는 백엔드에서 AI 파싱 + 저장을 한 번에 처리
        // AI 파싱이 오래 걸릴 수 있으므로 타임아웃을 5분으로 설정
        toast.info("PDF 파싱 중입니다. 최대 5분 정도 걸릴 수 있습니다...");
        const res = await authClient.post("/schoolrecord/parse/pdf", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 300000, // 5분 타임아웃 (AI 파싱이 오래 걸릴 수 있음)
        });
        if (res.data) {
          toast.success("생활기록부(PDF) 업로드에 성공하였습니다.");
          await _refetchSchoolRecord();
        }
      }
    } catch (e: unknown) {
      console.error("[useLifeRecordUpload] 업로드 실패:", e);
      const error = e as { response?: { data?: { message?: string } }, code?: string };
      
      // 타임아웃 에러인 경우 특별한 메시지 표시
      if (error.code === "ECONNABORTED") {
        toast.error(
          "파일 처리 시간이 초과되었습니다. 파일 크기가 크거나 서버가 혼잡할 수 있습니다. 잠시 후 다시 시도해주세요.",
          { duration: 5000 }
        );
      } else {
        toast.error(error.response?.data?.message || "파일 업로드에 실패했습니다.");
      }
    }
  };

  return { canUpload, uploadFile };
};
