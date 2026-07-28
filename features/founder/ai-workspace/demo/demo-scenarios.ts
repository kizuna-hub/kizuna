import { aiWorkspaceVi } from "../copy/vi";
import { novaLabsReadinessAssessment } from "../readiness/demo/readiness-demo-data";
import type {
  AssistantResponseKind,
  AiWorkspaceMessage,
  AiWorkspaceScenarioId,
  AiWorkspaceState,
  CurrentFocus,
  DecisionCycleState,
  EvidenceHealthItem,
  MaterialAnalysis,
  MentorRecommendation,
  ReadinessState,
} from "../types/ai-workspace.types";

const BASE_TIME = "2026-07-27T02:00:00.000Z";

export const sampleMaterials = [
  {
    id: "sample-pitch-deck",
    name: "CampusFlow-PitchDeck-v2.pdf",
    size: 2_840_000,
    type: "application/pdf",
  },
  {
    id: "sample-product-description",
    name: "CampusFlow-BusinessPlan-v1.pdf",
    size: 1_486_000,
    type: "application/pdf",
  },
] as const;

export const baselineFocus: CurrentFocus = {
  id: "campusflow-pilot-commitment",
  label: "Chuyển pilot interest thành pilot thật",
  bottleneck:
    "CampusFlow chưa được dùng trong workflow thật của một câu lạc bộ.",
  whyItMatters:
    "Interview và prototype test đã đủ cho vòng đầu, nhưng chưa xác nhận repeat usage và commitment.",
  nextAction:
    "Chạy pilot 14 ngày với 1 câu lạc bộ và 5–8 thành viên mới.",
  sourceStatus: "inferred",
};

export const onboardingInitialFocus: CurrentFocus = {
  id: "focus-not-established",
  label: "Chưa xác định",
  bottleneck: "Chưa xác định",
  whyItMatters:
    "Kizuna cần đối chiếu câu hỏi mới với funnel và bằng chứng hiện có trước khi đặt trọng tâm.",
  nextAction: "Đặt câu hỏi về vấn đề tăng trưởng hiện tại.",
  sourceStatus: "missing",
};

export const onboardingInitialEvidenceHealth: EvidenceHealthItem[] = [
  {
    id: "funnel-data",
    label: "Dữ liệu funnel",
    status: "verified",
    detail: "Signup ổn định, đoạn rơi lớn nhất nằm trong onboarding.",
  },
  {
    id: "day-three-activation",
    label: "Activation ngày thứ ba",
    status: "verified",
    detail: "Cohort ngày thứ ba đã được đối chiếu với baseline.",
  },
  {
    id: "interview-batch-03",
    label: "Nhóm phỏng vấn người dùng số 03",
    status: "verified",
    detail: "Ba cuộc phỏng vấn gần nhất đã được tổng hợp.",
  },
  {
    id: "week-two-retention",
    label: "Retention tuần thứ hai",
    status: "missing",
    detail: "Chưa đủ thời gian để xác nhận hành vi lặp lại.",
  },
  {
    id: "qualitative-onboarding",
    label: "Phản hồi định tính về onboarding",
    status: "missing",
    detail: "Chưa có phản hồi đủ sâu về nguyên nhân bỏ dở.",
  },
];

export const baselineReadiness: ReadinessState = {
  currentScore: novaLabsReadinessAssessment.overallScore,
  previousScore: 61,
  delta: novaLabsReadinessAssessment.delta,
  label: novaLabsReadinessAssessment.label,
  explanation:
    "CampusFlow sẵn sàng cho một pilot nhỏ; tín hiệu thị trường và commitment vẫn là khoảng trống lớn nhất.",
  supportedBy: [
    "12 cuộc phỏng vấn với hai nhóm người dùng",
    "5 prototype testers, 4 hoàn thành core flow và 3 quay lại",
  ],
  missingEvidence: [
    "Usage trong workflow thật của một câu lạc bộ",
    "Pilot có lịch, phạm vi và owner xác nhận",
  ],
  unlockAction:
    "Chạy pilot 14 ngày và xác minh ít nhất 3/5 thành viên quay lại.",
  breakdown: [
    {
      id: "problem-clarity",
      label: "Hiểu vấn đề và người dùng",
      score: 78,
      explanation: "Vấn đề và tác động đã được mô tả nhất quán.",
    },
    {
      id: "customer-evidence",
      label: "Customer discovery và bằng chứng",
      score: 62,
      explanation: "Đã có 12 interviews, chưa có pilot evidence.",
    },
    {
      id: "execution",
      label: "Kỷ luật thử nghiệm",
      score: 72,
      explanation: "Đã hoàn thành hai cycle và sửa prototype theo feedback.",
    },
    {
      id: "repeat-usage",
      label: "Tín hiệu thị trường",
      score: 45,
      explanation: "Hai câu lạc bộ quan tâm nhưng chưa có pilot xác nhận.",
    },
  ],
  assessment: structuredClone(novaLabsReadinessAssessment),
};

export const onboardingInitialReadiness: ReadinessState = {
  ...structuredClone(baselineReadiness),
  currentScore: 65,
  previousScore: 61,
  delta: 4,
  label: "Đang tiến triển",
  explanation:
    "CampusFlow đã có customer discovery và prototype test, nhưng chưa có pilot trong workflow thật.",
  supportedBy: [
    "12 cuộc phỏng vấn",
    "5 người test prototype",
    "2 câu lạc bộ quan tâm tới pilot",
  ],
  missingEvidence: [
    "Repeat usage trong workflow thật",
    "Pilot scope được xác nhận",
  ],
  unlockAction:
    "Chạy pilot 14 ngày với một câu lạc bộ.",
};

export const baselineEvidenceHealth: EvidenceHealthItem[] = [
  {
    id: "analytics",
    label: "Dữ liệu funnel",
    status: "verified",
    detail: "Nguồn analytics nội bộ, cập nhật ngày 25/07/2026.",
  },
  {
    id: "day-three",
    label: "Activation ngày thứ ba",
    status: "waiting",
    detail: "Đang chờ cohort mới hoàn tất cửa sổ đo.",
  },
  {
    id: "user-feedback",
    label: "Phản hồi người dùng",
    status: "missing",
    detail: "Chưa có phỏng vấn người dùng bỏ dở onboarding.",
  },
];

export const baselineMaterialAnalysis: MaterialAnalysis = {
  fileNames: sampleMaterials.map((material) => material.name),
  summary:
    "Bộ tài liệu mô tả vấn đề và giải pháp nhất quán. Traction và customer proof chưa đủ mạnh để xem là dữ kiện đã xác minh.",
  interpretationStatus: "pending",
  findings: [
    {
      id: "problem",
      label: "Vấn đề",
      status: "verified",
      detail: "Được mô tả nhất quán trong Pitch Deck và mô tả sản phẩm.",
    },
    {
      id: "solution",
      label: "Giải pháp",
      status: "verified",
      detail: "Luồng sản phẩm và giá trị cốt lõi đã rõ.",
    },
    {
      id: "traction",
      label: "Traction",
      status: "inferred",
      detail: "Có số liệu sử dụng, nhưng thiếu cohort và khoảng thời gian.",
    },
    {
      id: "risk",
      label: "Rủi ro",
      status: "inferred",
      detail: "Activation sau onboarding là giả thuyết rủi ro chính.",
    },
    {
      id: "customer-proof",
      label: "Customer proof",
      status: "missing",
      detail: "Chưa có trích dẫn hoặc biên bản phỏng vấn trực tiếp.",
    },
  ],
};

export const baselineDecisionCycle: DecisionCycleState = {
  id: "cycle-campusflow-pilot",
  title: "Pilot CampusFlow trong 14 ngày",
  currentStep: "understand",
  completedSteps: [],
  goal:
    "Kiểm tra CampusFlow có hoạt động trong workflow thật của một câu lạc bộ hay không.",
  chosenAction:
    "Mời 5–8 thành viên mới dùng CampusFlow trong 14 ngày.",
  expectedOutcome:
    "Ít nhất 3/5 thành viên quay lại dùng core flow.",
  primaryMetric: "Tỷ lệ quay lại core flow lần thứ hai",
  checklist: [
    {
      id: "define-metric",
      label: "Xác định success metric",
      completed: true,
    },
    {
      id: "create-variant",
      label: "Xác nhận câu lạc bộ và nhóm 5–8 thành viên",
      completed: false,
    },
    {
      id: "rollout",
      label: "Bắt đầu pilot 14 ngày",
      completed: false,
    },
    {
      id: "monitor",
      label: "Theo dõi repeat usage và phần việc ngoài CampusFlow",
      completed: false,
    },
  ],
  evidence: [
    {
      id: "cycle-analytics",
      label: "Analytics",
      status: "verified",
      detail: "Baseline activation đã được ghi nhận.",
    },
    {
      id: "cycle-day-three",
      label: "Activation ngày thứ ba",
      status: "waiting",
      detail: "Cohort thử nghiệm chưa đủ thời gian.",
    },
    {
      id: "cycle-feedback",
      label: "Phản hồi người dùng",
      status: "missing",
      detail: "Cần ít nhất ba phản hồi từ người dùng thử nghiệm.",
    },
  ],
  evidenceSubmitted: false,
  reviewCompleted: false,
};

export const baselineMentorRecommendation: MentorRecommendation = {
  id: "mentor-tran-minh-quan",
  name: "Trần Minh Quân",
  role: "Product & Growth Mentor",
  expertise:
    "Product validation · Pilot design · Community products · Student startups",
  matchScore: 92,
  matchConfidence: "high",
  whyHumanNow:
    "CampusFlow cần chuyển pilot interest thành một thử nghiệm có phạm vi, metric và owner rõ.",
  whyThisMentor:
    "Anh Quân có 10+ năm xây dựng sản phẩm số và đã hỗ trợ 28 early-stage teams chuyển prototype thành pilot đo được.",
  expectedOutcome:
    "Chốt phạm vi pilot 14 ngày, success metric và evidence cần thu thập.",
  matchRationale: [
    "Đúng stage: student venture ở Prototype",
    "Mạnh về product validation và pilot design",
    "Có kinh nghiệm với community products",
    "Đã hỗ trợ 28 early-stage teams",
  ],
  expectedOutcomes: [
    "Chốt variant thử nghiệm",
    "Chốt success metric",
    "Xác định thời lượng chạy và bằng chứng cần thu thập",
  ],
  preparation: [
    {
      id: "mentor-prep-assumptions",
      label: "Phạm vi pilot 14 ngày dự kiến",
      completed: true,
    },
    {
      id: "mentor-prep-funnel",
      label: "Kết quả 12 interviews và 5 prototype tests",
      completed: true,
    },
    {
      id: "mentor-prep-interviews",
      label: "Bằng chứng phỏng vấn người dùng",
      completed: true,
    },
    {
      id: "mentor-prep-cohort",
      label: "Success metric ít nhất 3/5 quay lại",
      completed: false,
    },
    {
      id: "mentor-prep-questions",
      label: "Ba câu hỏi cần cố vấn phản biện",
      completed: false,
    },
  ],
  availability: "10:00, Thứ Năm",
  alternatives: [
    {
      id: "mentor-nguyen-hoang-long",
      name: "Nguyễn Hoàng Long",
      role: "Community Growth Mentor",
      expertise: "Community operations · University programs",
      matchScore: 84,
      strength: "Community operations và university programs",
      tradeOff: "Ít chuyên sâu hơn về product experiments",
    },
    {
      id: "mentor-pham-thu-ha",
      name: "Phạm Thu Hà",
      role: "Product Research Mentor",
      expertise: "User research · Prototype validation",
      matchScore: 79,
      strength: "User research và prototype validation",
      tradeOff: "Ít kinh nghiệm hơn trong tổ chức pilot",
    },
  ],
  decisionCycleId: baselineDecisionCycle.id,
  blockerId: baselineFocus.id,
  scopeLabel:
    "Pilot CampusFlow · Tín hiệu thị trường và commitment",
  recommendationVersion: 1,
  status: "recommended",
};

const scenarioPrompts: Record<AiWorkspaceScenarioId, string[]> = {
  "onboarding-case-study": [
    "Phân tích pitch deck",
    "Tôi nên làm gì tiếp theo?",
    "Đánh giá tín hiệu thị trường",
    "Tìm mentor phù hợp",
  ],
  bottleneck: [
    "Vì sao đây là điểm nghẽn quan trọng nhất?",
    "Đề xuất hành động nhỏ nhất tiếp theo",
    "Tạo chu kỳ quyết định",
  ],
  materials: [
    "Phân tích PitchDeck.pdf",
    "Điều gì trong tài liệu vẫn chỉ là suy luận?",
    "Tạo chu kỳ quyết định từ phần còn thiếu",
  ],
  readiness: [
    "Vì sao mức độ sẵn sàng đang thấp?",
    "Bằng chứng nào còn thiếu?",
    "Đề xuất hành động để tăng readiness",
  ],
  "decision-cycle": [
    "Mở chu kỳ quyết định",
    "Bằng chứng nào sẽ thay đổi quyết định?",
    "Review kết quả hiện tại",
  ],
  mentor: [
    "Vì sao lúc này cần cố vấn?",
    "Đề xuất cố vấn phù hợp",
    "Kết quả kỳ vọng của phiên trao đổi là gì?",
  ],
  error: [
    "Phân tích điểm nghẽn của startup",
    "Thử phân tích lại",
    "Giữ nguyên tin nhắn và thử lại",
  ],
  "long-running": [
    "Tóm tắt phiên làm việc này",
    "Quyết định nào đang còn hiệu lực?",
    "Bằng chứng nào đã cũ?",
  ],
  "search-pricing": [
    "Tìm lại quyết định pricing",
    "Bằng chứng willingness to pay gần nhất là gì?",
    "Mentor đã khuyên gì về định giá?",
  ],
  "context-conflict": [
    "Context khách hàng mục tiêu đang mâu thuẫn thế nào?",
    "Nguồn nào nên là canonical?",
    "Mở Venture Memory",
  ],
  "stale-traction": [
    "MRR hiện tại còn đủ mới không?",
    "Thông tin traction nào đã cũ?",
    "Tôi muốn cập nhật số liệu",
  ],
  "readiness-decrease": [
    "Vì sao readiness giảm?",
    "Bằng chứng nào đã bị loại?",
    "So sánh trước và sau",
  ],
  "safe-switch": [
    "Mô phỏng phản hồi dài để thử đổi venture",
    "Context đang được sử dụng gồm những gì?",
    "Giữ bản nháp khi đổi venture",
  ],
  "search-ask": [
    "Tìm lời khuyên cũ của mentor",
    "Hỏi Kizuna từ kết quả tìm kiếm",
    "Mở nguồn gốc",
  ],
  "session-summary": [
    "Tóm tắt phiên làm việc này",
    "Đề xuất cập nhật Venture Memory",
    "Điểm nào chưa thống nhất?",
  ],
  "failed-response": [
    "Phân tích lại điểm nghẽn hiện tại",
    "Thử lại nhưng không tạo bản ghi trùng",
    "Context nào vẫn được giữ nguyên?",
  ],
};

function assistantMessage(
  id: string,
  content: string,
  structuredResponse: AiWorkspaceMessage["structuredResponse"],
): AiWorkspaceMessage {
  const responseKind: AssistantResponseKind =
    structuredResponse?.type === "current-focus"
      ? "insight"
      : structuredResponse?.type === "mentor-recommendation"
        ? "mentor_intervention"
        : structuredResponse?.type === "suggested-action"
          ? "action_proposal"
          : structuredResponse?.type === "decision-cycle"
            ? "state_confirmation"
            : "artifact_preview";
  return {
    id,
    role: "assistant",
    content,
    createdAt: BASE_TIME,
    status: "complete",
    responseKind,
    responseLifecycle: "active",
    structuredResponse,
    sources: [
      {
        id: "source-initial-context",
        label: "Bối cảnh venture và dữ liệu demo",
        status: "inferred",
      },
    ],
  };
}

export function createAiWorkspaceScenarioState(
  ventureId: string,
  scenarioId: AiWorkspaceScenarioId = "onboarding-case-study",
): AiWorkspaceState {
  const base: AiWorkspaceState = {
    ventureId,
    activeScenarioId: scenarioId,
    messages: [],
    generationStatus: "idle",
    suggestedPrompts: scenarioPrompts[scenarioId],
    attachments: [],
    readiness: structuredClone(baselineReadiness),
    currentFocus: structuredClone(baselineFocus),
    evidenceHealth: structuredClone(baselineEvidenceHealth),
    decisionCycle: structuredClone(baselineDecisionCycle),
    decisionCycleLifecycle: "not_created",
    selectedModel: "kizuna-lite",
    view: "conversation",
  };

  if (scenarioId === "onboarding-case-study") {
    return {
      ...base,
      readiness: structuredClone(onboardingInitialReadiness),
      currentFocus: structuredClone(onboardingInitialFocus),
      evidenceHealth: structuredClone(
        onboardingInitialEvidenceHealth,
      ),
      messages: [],
    };
  }

  if (scenarioId === "materials") {
    const materialAnalysis = structuredClone(baselineMaterialAnalysis);
    return {
      ...base,
      attachments: sampleMaterials.map((material) => ({
        ...material,
        origin: "sample" as const,
        status: "ready" as const,
      })),
      materialAnalysis,
      messages: [
        assistantMessage(
          "assistant-materials-initial",
          "Mình đã mô phỏng việc đọc ba tài liệu mẫu và tách phần đã được hỗ trợ khỏi phần còn suy luận.",
          { type: "material-analysis", payload: materialAnalysis },
        ),
      ],
    };
  }

  if (scenarioId === "readiness") {
    return {
      ...base,
      messages: [
        assistantMessage(
          "assistant-readiness-initial",
          "Mức sẵn sàng hiện tại chưa bị kéo xuống bởi độ rõ của ý tưởng, mà bởi chất lượng bằng chứng khách hàng.",
          { type: "readiness-change", payload: base.readiness },
        ),
      ],
    };
  }

  if (scenarioId === "decision-cycle") {
    return {
      ...base,
      decisionCycleLifecycle: "active",
      messages: [
        assistantMessage(
          "assistant-cycle-initial",
          "Điểm nghẽn đã đủ rõ để chuyển sang một chu kỳ kiểm chứng ngắn, có tiêu chí thành công cụ thể.",
          { type: "decision-cycle", payload: base.decisionCycle },
        ),
      ],
    };
  }

  if (scenarioId === "mentor") {
    const readiness: ReadinessState = {
      ...structuredClone(baselineReadiness),
      currentScore: 65,
      previousScore: 61,
      delta: 4,
      label: "Đủ bối cảnh để xin góc nhìn chuyên môn",
      explanation:
        "Customer discovery và prototype test đã thu hẹp vấn đề. Quyết định còn lại cần kinh nghiệm thiết kế pilot có phạm vi.",
    };
    const decisionCycle: DecisionCycleState = {
      ...structuredClone(baselineDecisionCycle),
      currentStep: "review",
      completedSteps: ["understand", "decide", "act", "evidence"],
      evidenceSubmitted: true,
      reviewCompleted: true,
      reviewSummary:
        "CampusFlow đã sẵn sàng thiết kế pilot 14 ngày với một câu lạc bộ.",
    };
    return {
      ...base,
      readiness,
      decisionCycle,
      decisionCycleLifecycle: "completed",
      mentorRecommendation: structuredClone(
        baselineMentorRecommendation,
      ),
      messages: [
        assistantMessage(
          "assistant-mentor-initial",
          "Phân tích thêm bằng AI sẽ không làm giảm nhiều bất định còn lại. Đây là lúc một góc nhìn chuyên môn có giá trị.",
          {
            type: "mentor-recommendation",
            payload: structuredClone(baselineMentorRecommendation),
          },
        ),
      ],
    };
  }

  if (scenarioId === "readiness-decrease") {
    return {
      ...base,
      readiness: {
        ...base.readiness,
        previousScore: 68,
        currentScore: 61,
        delta: -7,
        label: "Cần bổ sung bằng chứng",
        explanation:
          "Cohort thứ hai bị loại vì cấu hình analytics không nhất quán. Lịch sử điểm 68 vẫn được giữ lại để đối chiếu.",
        supportedBy: [
          "Ba phản hồi người dùng đã xác minh",
          "Baseline activation còn hợp lệ",
        ],
        missingEvidence: [
          "Cần chạy lại cohort với cùng định nghĩa activation",
        ],
      },
      messages: [
        assistantMessage(
          "assistant-readiness-decrease",
          "Readiness giảm từ 68 xuống 61 vì một bằng chứng cohort đã bị vô hiệu hóa. Đây không phải là xóa lịch sử; thay đổi vẫn được giữ trong timeline.",
          {
            type: "readiness-change",
            payload: {
              ...base.readiness,
              previousScore: 68,
              currentScore: 61,
              delta: -7,
            },
          },
        ),
      ],
    };
  }

  const content =
    scenarioId === "error" || scenarioId === "failed-response"
      ? "Tin nhắn của bạn sẽ được giữ nguyên nếu phân tích mô phỏng gặp lỗi. Hãy gửi một yêu cầu để thử luồng khôi phục."
      : "Mình đã tổng hợp tín hiệu hiện có. Điểm nghẽn đáng kiểm tra trước nằm ngay sau onboarding.";

  return {
    ...base,
    messages: [
      assistantMessage(
        `assistant-${scenarioId}-initial`,
        content,
        { type: "current-focus", payload: base.currentFocus },
      ),
    ],
  };
}

export function getScenarioPrompts(
  scenarioId: AiWorkspaceScenarioId,
) {
  return [...scenarioPrompts[scenarioId]];
}

export const demoLabel = aiWorkspaceVi.workspace.demoLabel;
