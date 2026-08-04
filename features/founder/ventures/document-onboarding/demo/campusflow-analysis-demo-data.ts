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
      "Pitch Deck và Business Plan đã sẵn sàng để Kizuna đọc.",
    durationMs: 500,
    completedProgress: 8,
  },
  {
    id: "documents_read",
    label: "Đọc nội dung chính",
    description:
      "Kizuna đang đọc cấu trúc, nội dung chính và các tín hiệu quan trọng trong tài liệu.",
    durationMs: 1_200,
    completedProgress: 25,
  },
  {
    id: "venture_context_detected",
    label: "Tạo Venture Brief",
    description:
      "Kizuna đang tổng hợp sản phẩm, nhóm người dùng, giai đoạn và bối cảnh hiện tại của venture.",
    durationMs: 1_200,
    completedProgress: 43,
  },
  {
    id: "evidence_mapped",
    label: "Xác định giai đoạn và bằng chứng",
    description:
      "Kizuna đang liên kết các kết luận với đúng tài liệu và trang nguồn.",
    durationMs: 1_400,
    completedProgress: 63,
  },
  {
    id: "readiness_created",
    label: "Xác định nhu cầu cần hỗ trợ",
    description:
      "Kizuna đang xác định vấn đề founder cần hỗ trợ và outcome cần hướng tới trong giai đoạn hiện tại.",
    durationMs: 1_400,
    completedProgress: 83,
  },
  {
    id: "workspace_prepared",
    label: "Chuẩn bị mentor matching",
    description:
      "Kizuna đang đối chiếu bối cảnh venture với chuyên môn và kinh nghiệm của mentor.",
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
    label: "12 cuộc phỏng vấn khách hàng",
    value: "8/12 xác nhận workflow onboarding bị phân tán.",
    sourceLabel: "Pitch Deck · trang 6",
    documentRole: "pitch_deck",
    appearsAfterStepId: "evidence_mapped",
  },
  {
    id: "signal-testers",
    label: "5 người thử prototype",
    value: "4 hoàn thành core flow · 3 quay lại test lần hai.",
    sourceLabel: "Pitch Deck · trang 8",
    documentRole: "pitch_deck",
    appearsAfterStepId: "evidence_mapped",
  },
  {
    id: "signal-pilots",
    label: "2 câu lạc bộ quan tâm tới pilot",
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
    id: "signal-support-need",
    label: "Nhu cầu hỗ trợ hiện tại",
    value:
      "Biến sự quan tâm của hai câu lạc bộ thành một pilot 14 ngày có phạm vi, success metric và evidence rõ ràng.",
    appearsAfterStepId: "readiness_created",
  },
  {
    id: "signal-mentor-topics",
    label: "Chủ đề cần mentor hỗ trợ",
    value: "Pilot design · Product validation · Customer discovery",
    sourceLabel:
      "Context matching được chuẩn bị từ Venture Brief và bằng chứng đã liên kết.",
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
    mentorFirstCompletion: {
      ventureName: detectedContext.name,
      ventureStage: stageLabel,
      ventureCategory: "Community SaaS",
      ventureSummary:
        "CampusFlow là nền tảng giúp các câu lạc bộ onboarding, theo dõi và hỗ trợ thành viên mới trong một quy trình thống nhất. Team hiện đã có prototype, 12 cuộc phỏng vấn và hai câu lạc bộ quan tâm tới pilot.",
      currentSupportNeed:
        "Biến sự quan tâm của hai câu lạc bộ thành một pilot 14 ngày có phạm vi, success metric và evidence rõ ràng.",
      expectedOutcome:
        "Chốt được một kế hoạch pilot đủ rõ để bắt đầu trong tuần tiếp theo.",
      mentorTopics: [
        "Pilot design",
        "Product validation",
        "Customer discovery",
      ],
      analyzedDocuments: documents.map(
        (document) => document.name,
      ),
      evidenceSummary: `Đã liên kết ${evidenceForDocuments(documents).length} bằng chứng chính với nguồn`,
    },
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
