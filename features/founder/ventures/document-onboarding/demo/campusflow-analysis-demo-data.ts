import type { VentureStage } from "../../../../venture/core";

import type {
  DetectedVentureContext,
  StartupDocumentInput,
  VentureAnalysisResult,
  VentureAnalysisStepId,
  VentureEvidenceReference,
  VentureSignalPreview,
} from "../types/venture-analysis.types";

export const CAMPUSFLOW_ANALYSIS_STEP_DEFINITIONS: Array<{
  id: VentureAnalysisStepId;
  label: string;
  description: string;
  durationMs: number;
  completedProgress: number;
}> = [
  {
    id: "files_received",
    label: "Đã nhận tài liệu",
    description:
      "Pitch Deck và Business Plan đã sẵn sàng để phân tích.",
    durationMs: 500,
    completedProgress: 8,
  },
  {
    id: "documents_read",
    label: "Đọc cấu trúc và nội dung chính",
    description:
      "Đang nhận diện problem, solution, user và các claim quan trọng.",
    durationMs: 1_200,
    completedProgress: 25,
  },
  {
    id: "venture_context_detected",
    label: "Xác định venture context",
    description:
      "Đang nhận diện tên venture, giai đoạn và product summary.",
    durationMs: 1_200,
    completedProgress: 43,
  },
  {
    id: "evidence_mapped",
    label: "Liên kết bằng chứng với nguồn",
    description:
      "Đang xác định file, trang và đoạn nội dung hỗ trợ từng kết luận.",
    durationMs: 1_400,
    completedProgress: 63,
  },
  {
    id: "readiness_created",
    label: "Tạo readiness baseline",
    description:
      "Đang đánh giá mức độ sẵn sàng cho bước kiểm chứng tiếp theo.",
    durationMs: 1_400,
    completedProgress: 83,
  },
  {
    id: "workspace_prepared",
    label: "Chuẩn bị Founder Workspace",
    description:
      "Đang tạo cuộc trò chuyện đầu tiên và phần phân tích tổng quan.",
    durationMs: 1_100,
    completedProgress: 100,
  },
];

export const campusFlowDetectedContext: DetectedVentureContext = {
  name: "CampusFlow",
  stage: "prototype",
  stageLabel: "Prototype",
  stageConfidence: "high",
  team: "3 student founders",
  productSummary:
    "Nền tảng hỗ trợ câu lạc bộ onboarding và đồng hành cùng thành viên mới.",
  problem:
    "Quy trình onboarding thành viên mới đang phân tán giữa Google Forms và nhóm chat, khiến tiến độ khó theo dõi.",
  targetUser:
    "Trưởng câu lạc bộ và thành viên mới trong các câu lạc bộ sinh viên.",
};

export const campusFlowSignalPreviews: VentureSignalPreview[] = [
  {
    id: "signal-venture-name",
    label: "Tên venture",
    value: "CampusFlow",
    appearsAfterStepId: "venture_context_detected",
  },
  {
    id: "signal-stage",
    label: "Giai đoạn dự đoán",
    value: "Prototype",
    appearsAfterStepId: "venture_context_detected",
  },
  {
    id: "signal-product",
    label: "Sản phẩm",
    value:
      "Nền tảng hỗ trợ câu lạc bộ onboarding thành viên mới",
    appearsAfterStepId: "venture_context_detected",
  },
  {
    id: "signal-interviews",
    label: "12 customer interviews",
    value: "8/12 xác nhận workflow onboarding bị phân tán.",
    sourceLabel: "Pitch Deck · trang 6",
    documentRole: "pitch_deck",
    appearsAfterStepId: "evidence_mapped",
  },
  {
    id: "signal-testers",
    label: "5 prototype testers",
    value: "4 hoàn thành core flow · 3 quay lại test lần hai.",
    sourceLabel: "Pitch Deck · trang 8",
    documentRole: "pitch_deck",
    appearsAfterStepId: "evidence_mapped",
  },
  {
    id: "signal-pilots",
    label: "2 pilot interests",
    value: "Hai câu lạc bộ đồng ý trao đổi về pilot.",
    sourceLabel: "Business Plan · trang 11",
    documentRole: "business_plan",
    appearsAfterStepId: "evidence_mapped",
  },
  {
    id: "signal-mock-data",
    label: "1 câu lạc bộ sẵn sàng cung cấp mock data",
    value:
      "Có thể dùng dữ liệu mô phỏng để chốt phạm vi pilot an toàn.",
    sourceLabel: "Business Plan · trang 11",
    documentRole: "business_plan",
    appearsAfterStepId: "evidence_mapped",
  },
  {
    id: "signal-stage-calibration",
    label: "Doanh thu chưa phải điều kiện bắt buộc",
    value:
      "Ở giai đoạn Prototype, trọng tâm là học hỏi và tín hiệu commitment.",
    appearsAfterStepId: "readiness_created",
  },
  {
    id: "signal-gap",
    label: "Khoảng trống có thể lớn nhất",
    value: "Tín hiệu thị trường và commitment",
    sourceLabel:
      "Pilot interest chưa có phạm vi, lịch hoặc success metric được xác nhận.",
    appearsAfterStepId: "readiness_created",
  },
];

function evidenceForDocuments(
  documents: StartupDocumentInput[],
): VentureEvidenceReference[] {
  const pitch = documents.find(
    (document) => document.role === "pitch_deck",
  );
  const plan = documents.find(
    (document) => document.role === "business_plan",
  );
  const evidence: VentureEvidenceReference[] = [];
  if (pitch) {
    evidence.push(
      {
        id: "campusflow-problem-page-4",
        documentRole: "pitch_deck",
        fileName: pitch.name,
        page: 4,
        quote:
          "Các câu lạc bộ đang dùng Google Forms và nhóm chat để onboarding thành viên mới, khiến tiến độ khó theo dõi.",
        supports: ["Hiểu vấn đề và người dùng"],
      },
      {
        id: "campusflow-discovery-page-6",
        documentRole: "pitch_deck",
        fileName: pitch.name,
        page: 6,
        quote:
          "8/12 người được phỏng vấn xác nhận quy trình onboarding hiện tại bị phân tán.",
        supports: ["Customer discovery và bằng chứng"],
      },
      {
        id: "campusflow-prototype-page-8",
        documentRole: "pitch_deck",
        fileName: pitch.name,
        page: 8,
        quote:
          "5 người dùng thử prototype, 4 người hoàn thành core flow và 3 người quay lại test lần thứ hai.",
        supports: [
          "Prototype và học hỏi",
          "Tín hiệu thị trường và commitment",
        ],
      },
    );
  }
  if (plan) {
    evidence.push({
      id: "campusflow-pilot-page-11",
      documentRole: "business_plan",
      fileName: plan.name,
      page: 11,
      quote:
        "2 câu lạc bộ đồng ý trao đổi về pilot trong học kỳ tới.",
      supports: ["Tín hiệu thị trường và commitment"],
      limitation:
        "Đây mới là pilot interest, chưa phải pilot đã xác nhận phạm vi và lịch.",
    });
  }
  return evidence;
}

export function signalPreviewsForCompletedSteps(
  completedStepIds: VentureAnalysisStepId[],
  documents?: StartupDocumentInput[],
) {
  const selectedRoles = documents
    ? new Set(documents.map((document) => document.role))
    : undefined;
  return campusFlowSignalPreviews.filter((signal) =>
    completedStepIds.includes(signal.appearsAfterStepId) &&
    (!signal.documentRole ||
      selectedRoles?.has(signal.documentRole) !== false),
  );
}

export function createCampusFlowAnalysisResult({
  runId,
  documents,
  resolvedStage = "prototype",
}: {
  runId: string;
  documents: StartupDocumentInput[];
  resolvedStage?: VentureStage;
}): VentureAnalysisResult {
  const stageLabel =
    resolvedStage === "idea" ? "Idea" : "Prototype";
  const detectedContext = {
    ...campusFlowDetectedContext,
    stage: resolvedStage,
    stageLabel,
    stageConfidence: "high" as const,
  };

  return {
    runId,
    detectedContext,
    sourceDocuments: documents,
    documentOutcomes: documents.map((document) => ({
      document,
      status: "analyzed",
    })),
    signals: signalPreviewsForCompletedSteps(
      CAMPUSFLOW_ANALYSIS_STEP_DEFINITIONS.map(
        (step) => step.id,
      ),
      documents,
    ),
    evidence: evidenceForDocuments(documents),
    readiness: {
      score: 65,
      stageLabel,
      strongestCriterion: {
        label: "Hiểu vấn đề và người dùng",
        score: 78,
      },
      biggestGap: {
        label: "Tín hiệu thị trường và commitment",
        score: 45,
        explanation:
          "Pilot interest hiện chưa có phạm vi, lịch hoặc success metric được xác nhận.",
      },
      recommendedNextStep:
        "Chốt một pilot 14 ngày với 1 câu lạc bộ.",
    },
  };
}
