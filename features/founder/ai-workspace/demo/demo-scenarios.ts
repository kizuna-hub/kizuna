import { aiWorkspaceVi } from "../copy/vi";
import type {
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
    name: "PitchDeck.pdf",
    size: 2_840_000,
    type: "application/pdf",
  },
  {
    id: "sample-product-description",
    name: "MoTaSanPham.docx",
    size: 486_000,
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
  {
    id: "sample-market-research",
    name: "NghienCuuThiTruong.pptx",
    size: 3_240_000,
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  },
] as const;

export const baselineFocus: CurrentFocus = {
  id: "activation-after-onboarding",
  bottleneck:
    "Người dùng mới chưa chạm tới khoảnh khắc giá trị sau onboarding.",
  whyItMatters:
    "Top-of-funnel vẫn ổn, nhưng activation giảm khiến mọi nỗ lực tăng trưởng phía trên bị thất thoát.",
  nextAction:
    "Kiểm tra một onboarding ba bước với 20% người dùng mới.",
  sourceStatus: "inferred",
};

export const baselineReadiness: ReadinessState = {
  currentScore: 54,
  previousScore: 54,
  delta: 0,
  label: "Đang hình thành",
  explanation:
    "Vấn đề đã rõ, nhưng bằng chứng khách hàng và tín hiệu sử dụng lặp lại vẫn còn mỏng.",
  supportedBy: [
    "Mô tả vấn đề nhất quán trong ba tài liệu",
    "Dữ liệu funnel cho thấy activation giảm sau onboarding",
  ],
  missingEvidence: [
    "Phản hồi của người dùng bỏ dở onboarding",
    "Tín hiệu sử dụng lặp lại sau ngày thứ ba",
  ],
  unlockAction:
    "Nộp kết quả thử nghiệm onboarding và ít nhất ba phản hồi người dùng.",
  breakdown: [
    {
      id: "problem-clarity",
      label: "Độ rõ của vấn đề",
      score: 78,
      explanation: "Vấn đề và tác động đã được mô tả nhất quán.",
    },
    {
      id: "customer-evidence",
      label: "Bằng chứng khách hàng",
      score: 38,
      explanation: "Chưa có đủ phản hồi trực tiếp từ người dùng bỏ dở.",
    },
    {
      id: "execution",
      label: "Tính nhất quán thực thi",
      score: 52,
      explanation: "Đã có kế hoạch, nhưng chưa hoàn tất một vòng đo lường.",
    },
    {
      id: "repeat-usage",
      label: "Sử dụng lặp lại",
      score: 30,
      explanation: "Chưa có cohort đủ dài để xác nhận hành vi lặp lại.",
    },
  ],
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
  id: "cycle-onboarding-activation",
  title: "Kiểm chứng onboarding ngắn hơn",
  currentStep: "understand",
  completedSteps: [],
  goal:
    "Kiểm tra liệu onboarding ngắn hơn có cải thiện activation hay không.",
  chosenAction:
    "Triển khai onboarding ba bước cho 20% người dùng mới.",
  expectedOutcome: "Activation tăng ít nhất 15% trong 14 ngày.",
  primaryMetric: "Activation rate trong 7 ngày",
  checklist: [
    {
      id: "define-metric",
      label: "Xác định success metric",
      completed: true,
    },
    {
      id: "create-variant",
      label: "Tạo onboarding variant",
      completed: false,
    },
    {
      id: "rollout",
      label: "Rollout cho 20% người dùng mới",
      completed: false,
    },
    {
      id: "monitor",
      label: "Theo dõi trong bảy ngày",
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
  id: "mentor-lan-nguyen",
  name: "Lan Nguyen",
  role: "Product Growth Advisor",
  expertise: "Product growth · Activation · B2B SaaS",
  whyHumanNow:
    "Bối cảnh và dữ liệu funnel đã đủ rõ. Blocker còn lại là chọn ngưỡng activation hợp lý và đọc trade-off của rollout.",
  whyThisMentor:
    "Lan đã trực tiếp thiết kế onboarding và activation experiments cho sản phẩm SaaS giai đoạn đầu.",
  expectedOutcome:
    "Chốt tiêu chí dừng, ngưỡng thành công và cách đọc cohort trong một phiên 30 phút.",
  matchRationale: [
    "Đúng blocker: activation sau onboarding",
    "Đúng stage: Pilot / Người dùng sớm",
    "Đã xử lý các rollout SaaS có dữ liệu cohort tương tự",
    "Có lịch trao đổi trong 7 ngày tới",
  ],
  expectedOutcomes: [
    "Chọn ngưỡng activation đủ tin cậy",
    "Xác định success metric cho cohort tiếp theo",
    "Chốt hành động rollout trong 14 ngày",
  ],
  preparation: [
    {
      id: "mentor-prep-assumptions",
      label: "Giả định về ngưỡng activation",
      completed: true,
    },
    {
      id: "mentor-prep-funnel",
      label: "Dữ liệu funnel onboarding hiện tại",
      completed: true,
    },
    {
      id: "mentor-prep-interviews",
      label: "Bằng chứng phỏng vấn người dùng",
      completed: true,
    },
    {
      id: "mentor-prep-cohort",
      label: "So sánh cohort thử nghiệm và baseline",
      completed: false,
    },
    {
      id: "mentor-prep-questions",
      label: "Ba câu hỏi cần cố vấn phản biện",
      completed: false,
    },
  ],
  availability: "Có lịch trong 7 ngày tới",
  alternatives: [
    {
      id: "mentor-minh-tran",
      name: "Minh Tran",
      strength: "B2B SaaS onboarding",
      tradeOff: "Ít kinh nghiệm về PLG",
    },
    {
      id: "mentor-maya-chen",
      name: "Maya Chen",
      strength: "Product onboarding",
      tradeOff: "Không chuyên activation pricing",
    },
  ],
  decisionCycleId: baselineDecisionCycle.id,
  blockerId: baselineFocus.id,
  scopeLabel:
    "Activation sau onboarding · Chu kỳ Onboarding Activation",
  recommendationVersion: 1,
  status: "recommended",
};

const scenarioPrompts: Record<AiWorkspaceScenarioId, string[]> = {
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
  return {
    id,
    role: "assistant",
    content,
    createdAt: BASE_TIME,
    status: "complete",
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
  scenarioId: AiWorkspaceScenarioId = "long-running",
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
    view: "conversation",
  };

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
      currentScore: 61,
      previousScore: 54,
      delta: 7,
      label: "Đủ bối cảnh để xin góc nhìn chuyên môn",
      explanation:
        "Bằng chứng mới đã thu hẹp vấn đề. Quyết định còn lại cần kinh nghiệm đọc cohort và trade-off rollout.",
    };
    const decisionCycle: DecisionCycleState = {
      ...structuredClone(baselineDecisionCycle),
      currentStep: "review",
      completedSteps: ["understand", "decide", "act", "evidence"],
      evidenceSubmitted: true,
      reviewCompleted: true,
      reviewSummary:
        "Activation tăng 11%, thấp hơn ngưỡng 15% nhưng đủ để xác nhận onboarding là một phần của điểm nghẽn.",
    };
    return {
      ...base,
      readiness,
      decisionCycle,
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
