import {
  baselineDecisionCycle,
  baselineFocus,
  baselineMaterialAnalysis,
  baselineMentorRecommendation,
  baselineReadiness,
  getScenarioPrompts,
} from "./demo-scenarios";
import type {
  AiWorkspaceEngine,
  AiWorkspaceInput,
  AiWorkspaceIntent,
  AiWorkspaceResponse,
  DecisionCycleState,
  EvidenceHealthItem,
  MaterialAnalysis,
  ReadinessState,
  SourceReference,
  StructuredResponse,
} from "../types/ai-workspace.types";

export class MockAiWorkspaceError extends Error {
  constructor() {
    super("Deterministic mock analysis failure");
    this.name = "MockAiWorkspaceError";
  }
}

function waitForMockResponse(
  durationMs: number,
  signal?: AbortSignal,
) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      const error = new Error("Mock AI request aborted");
      error.name = "AbortError";
      reject(error);
      return;
    }
    const onAbort = () => {
      clearTimeout(timeout);
      const error = new Error("Mock AI request aborted");
      error.name = "AbortError";
      reject(error);
    };
    const timeout = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, durationMs);
    signal?.addEventListener("abort", onAbort, {
      once: true,
    });
  });
}

function normalizeIntentText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/g, "d")
    .toLowerCase();
}

function includesAny(value: string, terms: string[]) {
  return terms.some((term) => value.includes(term));
}

export function detectAiWorkspaceIntent(
  message: string,
): AiWorkspaceIntent {
  const normalized = normalizeIntentText(message);

  if (
    includesAny(normalized, [
      "review ket qua",
      "review lai",
      "danh gia ket qua",
    ])
  ) {
    return "review-results";
  }
  if (
    includesAny(normalized, [
      "nop bang chung",
      "them bang chung",
      "submit evidence",
    ])
  ) {
    return "submit-evidence";
  }
  if (
    includesAny(normalized, [
      "phan bien",
      "khong dong y",
      "ai hieu sai",
    ])
  ) {
    return "challenge-interpretation";
  }
  if (
    includesAny(normalized, [
      "chu ky quyet dinh",
      "tao chu ky",
      "mo chu ky",
    ])
  ) {
    return "create-decision-cycle";
  }
  if (
    includesAny(normalized, [
      "co van",
      "mentor",
      "chuyen gia",
    ])
  ) {
    return "recommend-mentor";
  }
  if (
    includesAny(normalized, [
      "pitch deck",
      "pitchdeck",
      "tai lieu",
      "phan tich file",
    ])
  ) {
    return "analyze-materials";
  }
  if (
    includesAny(normalized, [
      "readiness",
      "san sang",
      "vi sao diem",
    ])
  ) {
    return "explain-readiness";
  }
  if (
    includesAny(normalized, [
      "de xuat hanh dong",
      "hanh dong tiep",
      "nen lam gi",
    ])
  ) {
    return "suggest-action";
  }
  if (
    includesAny(normalized, [
      "chung lai",
      "tang truong",
      "growth",
    ])
  ) {
    return "growth-stalled";
  }
  return "find-bottleneck";
}

function responseChunks(message: string) {
  const sentences = message
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);
  if (sentences.length <= 1) {
    const midpoint = Math.ceil(message.length / 2);
    return [
      message.slice(0, midpoint),
      message.slice(midpoint),
    ].filter(Boolean);
  }
  return sentences.map((sentence, index) =>
    index === 0 ? sentence : ` ${sentence}`,
  );
}

function sourceReferences(
  intent: AiWorkspaceIntent,
): SourceReference[] {
  const shared: SourceReference[] = [
    {
      id: "source-venture-context",
      label: "Bối cảnh venture đã xác nhận",
      status: "verified",
    },
  ];

  if (
    intent === "analyze-materials" ||
    intent === "challenge-interpretation"
  ) {
    return [
      ...shared,
      {
        id: "source-materials",
        label: "Metadata của tài liệu demo",
        status: "inferred",
      },
    ];
  }
  if (
    intent === "submit-evidence" ||
    intent === "review-results"
  ) {
    return [
      ...shared,
      {
        id: "source-cycle-analytics",
        label: "Analytics của chu kỳ onboarding",
        status: "verified",
      },
    ];
  }
  return [
    ...shared,
    {
      id: "source-activation-funnel",
      label: "Funnel activation hiện tại",
      status: "inferred",
    },
  ];
}

function materialAnalysis(input: AiWorkspaceInput): MaterialAnalysis {
  const selectedFiles = input.currentState.attachments
    .filter((attachment) => attachment.status === "ready")
    .map((attachment) => attachment.name);
  return {
    ...structuredClone(baselineMaterialAnalysis),
    fileNames:
      selectedFiles.length > 0
        ? selectedFiles
        : baselineMaterialAnalysis.fileNames,
  };
}

function readinessAfterEvidence(): ReadinessState {
  return {
    ...structuredClone(baselineReadiness),
    currentScore: 61,
    previousScore: 54,
    delta: 7,
    label: "Đang tiến triển",
    explanation:
      "Dữ liệu thử nghiệm đã xác nhận activation là một phần của điểm nghẽn. Điểm tăng vì đã có tín hiệu hành vi, không phải chỉ vì một file được thêm vào.",
    supportedBy: [
      ...baselineReadiness.supportedBy,
      "Cohort onboarding mới có activation cao hơn 11%",
    ],
    missingEvidence: [
      "Cần thêm một cohort để kiểm tra tính lặp lại",
      "Cần góc nhìn chuyên môn về ngưỡng rollout",
    ],
    unlockAction:
      "Review ngưỡng thành công với một chuyên gia product growth trước khi rollout rộng.",
    breakdown: baselineReadiness.breakdown.map((dimension) =>
      dimension.id === "customer-evidence"
        ? {
            ...dimension,
            score: 52,
            explanation:
              "Đã có dữ liệu cohort và ba phản hồi người dùng thử nghiệm.",
          }
        : dimension.id === "execution"
          ? {
              ...dimension,
              score: 65,
              explanation:
                "Một vòng thử nghiệm đã hoàn tất và có tiêu chí review.",
            }
          : dimension,
    ),
  };
}

function evidenceAfterSubmission(): EvidenceHealthItem[] {
  return [
    {
      id: "analytics",
      label: "Dữ liệu funnel",
      status: "verified",
      detail: "Baseline và cohort thử nghiệm đã được đối chiếu.",
    },
    {
      id: "day-three",
      label: "Activation ngày thứ ba",
      status: "verified",
      detail: "Cohort thử nghiệm tăng 11% so với baseline.",
    },
    {
      id: "user-feedback",
      label: "Phản hồi người dùng",
      status: "verified",
      detail: "Ba phản hồi đã được ghi nhận trong chu kỳ.",
    },
  ];
}

function cycleAfterEvidence(
  input: AiWorkspaceInput,
): DecisionCycleState {
  return {
    ...input.currentState.decisionCycle,
    currentStep: "review" as const,
    completedSteps: [
      "understand",
      "decide",
      "act",
      "evidence",
    ],
    evidenceSubmitted: true,
    evidence: input.currentState.decisionCycle.evidence.map(
      (item) => ({
        ...item,
        status: "verified" as const,
        detail:
          item.id === "cycle-day-three"
            ? "Activation tăng 11% trong cohort thử nghiệm."
            : item.id === "cycle-feedback"
              ? "Ba phản hồi người dùng đã được ghi nhận."
              : item.detail,
      }),
    ),
  };
}

function buildResponse(
  input: AiWorkspaceInput,
  intent: AiWorkspaceIntent,
): Omit<AiWorkspaceResponse, "chunks"> {
  const common = {
    intent,
    proposedPatches: {},
    suggestedPrompts: getScenarioPrompts(input.activeScenarioId),
    sourceReferences: sourceReferences(intent),
    simulatedLatencyMs: 650,
  };

  if (intent === "analyze-materials") {
    const analysis = materialAnalysis(input);
    return {
      ...common,
      assistantMessage:
        "Mình đã tách phần được tài liệu hỗ trợ khỏi phần vẫn chỉ là suy luận. Customer proof là khoảng trống cần xử lý trước.",
      structuredResponse: {
        type: "material-analysis",
        payload: analysis,
      },
      proposedPatches: { materialAnalysis: analysis },
      suggestedPrompts: [
        "Điều gì trong tài liệu vẫn chỉ là suy luận?",
        "Tôi muốn phản biện cách AI hiểu startup",
        "Tạo chu kỳ quyết định từ customer proof còn thiếu",
      ],
    };
  }

  if (intent === "challenge-interpretation") {
    const analysis: MaterialAnalysis = {
      ...materialAnalysis(input),
      interpretationStatus: "disputed",
      findings: materialAnalysis(input).findings.map((finding) =>
        finding.id === "traction"
          ? {
              ...finding,
              status: "disputed",
              detail:
                "Founder cho rằng tín hiệu traction đã mạnh hơn cách AI diễn giải; cần bổ sung cohort và khoảng thời gian.",
            }
          : finding,
      ),
    };
    return {
      ...common,
      assistantMessage:
        "Phản biện của bạn đã được giữ lại. Mình không nâng traction thành dữ kiện xác minh cho tới khi có cohort và khoảng thời gian rõ.",
      structuredResponse: {
        type: "material-analysis",
        payload: analysis,
      },
      proposedPatches: { materialAnalysis: analysis },
      suggestedPrompts: [
        "Tôi cần bổ sung dữ liệu nào?",
        "Đề xuất hành động nhỏ nhất tiếp theo",
        "Tạo chu kỳ quyết định",
      ],
    };
  }

  if (intent === "explain-readiness") {
    return {
      ...common,
      assistantMessage:
        "Điểm 54 không có nghĩa startup yếu. Nó cho biết phần vấn đề đã rõ hơn phần bằng chứng khách hàng và hành vi sử dụng lặp lại.",
      structuredResponse: {
        type: "readiness-change",
        payload: input.currentState.readiness,
      },
      proposedPatches: {},
      suggestedPrompts: [
        "Bằng chứng nào còn thiếu?",
        "Đề xuất hành động để tăng readiness",
        "Mở chu kỳ quyết định",
      ],
    };
  }

  if (intent === "suggest-action") {
    return {
      ...common,
      assistantMessage:
        "Hành động có giá trị nhất lúc này là một thử nghiệm onboarding nhỏ, đủ nhanh để cho biết activation có thực sự là điểm nghẽn hay không.",
      structuredResponse: {
        type: "suggested-action",
        payload: {
          title: "Thử nghiệm onboarding ba bước",
          rationale:
            "Tập trung vào đoạn funnel đang giảm thay vì tiếp tục tăng traffic.",
          action:
            "Rollout cho 20% người dùng mới và đo activation trong bảy ngày.",
        },
      },
      proposedPatches: { currentFocus: structuredClone(baselineFocus) },
      suggestedPrompts: [
        "Tạo chu kỳ quyết định",
        "Bằng chứng nào sẽ thay đổi quyết định?",
        "Giải thích mức độ sẵn sàng",
      ],
    };
  }

  if (intent === "create-decision-cycle") {
    return {
      ...common,
      assistantMessage:
        "Mình đã chuẩn bị một chu kỳ năm bước với một mục tiêu, một chỉ số chính và tiêu chí review rõ ràng.",
      structuredResponse: {
        type: "decision-cycle",
        payload: input.currentState.decisionCycle,
      },
      proposedPatches: {},
      suggestedPrompts: [
        "Mở chu kỳ quyết định",
        "Giải thích tiêu chí thành công",
        "Bằng chứng nào còn thiếu?",
      ],
    };
  }

  if (intent === "submit-evidence") {
    const readiness = readinessAfterEvidence();
    return {
      ...common,
      assistantMessage:
        "Bằng chứng mới đã được gắn với chu kỳ. Readiness tăng 7 điểm vì tín hiệu hành vi đã rõ hơn, không phải vì có thêm một tệp.",
      structuredResponse: {
        type: "evidence-review",
        payload: {
          title: "Activation tăng 11% trong cohort thử nghiệm",
          summary:
            "Kết quả chưa đạt ngưỡng 15%, nhưng đủ để xác nhận onboarding là một phần của điểm nghẽn.",
          readiness,
        },
      },
      proposedPatches: {
        readiness,
        evidenceHealth: evidenceAfterSubmission(),
        decisionCycle: cycleAfterEvidence(input),
      },
      suggestedPrompts: [
        "Review kết quả hiện tại",
        "Tôi có cần góc nhìn chuyên gia không?",
        "Bước tiếp theo nên là gì?",
      ],
    };
  }

  if (intent === "review-results") {
    const readiness = input.currentState.decisionCycle.evidenceSubmitted
      ? readinessAfterEvidence()
      : input.currentState.readiness;
    const reviewedCycle: DecisionCycleState | undefined =
      input.currentState.decisionCycle.evidenceSubmitted
        ? {
            ...input.currentState.decisionCycle,
            currentStep: "review" as const,
            completedSteps: [
              "understand",
              "decide",
              "act",
              "evidence",
              "review",
            ],
            reviewCompleted: true,
            reviewSummary:
              "Activation tăng 11%, thấp hơn ngưỡng 15% nhưng đủ để xác nhận onboarding là một phần của điểm nghẽn.",
          }
        : undefined;
    return {
      ...common,
      assistantMessage:
        input.currentState.decisionCycle.evidenceSubmitted
          ? "Kết quả đủ để học, nhưng chưa đủ để rollout rộng. Bước tiếp theo cần judgment về ngưỡng activation và rủi ro cohort."
          : "Chu kỳ chưa có đủ bằng chứng để review. Hãy nộp dữ liệu activation và phản hồi người dùng trước.",
      structuredResponse: {
        type: "evidence-review",
        payload: {
          title: input.currentState.decisionCycle.evidenceSubmitted
            ? "Kết quả có tín hiệu nhưng chưa đạt ngưỡng"
            : "Chưa đủ bằng chứng để review",
          summary: input.currentState.decisionCycle.evidenceSubmitted
            ? "Activation tăng 11% so với mục tiêu 15%. Cần thêm một cohort hoặc human judgment trước khi rollout."
            : "Activation ngày thứ ba và phản hồi người dùng vẫn đang thiếu.",
          readiness,
        },
      },
      proposedPatches: {
        readiness,
        decisionCycle: reviewedCycle,
        mentorRecommendation: reviewedCycle
          ? structuredClone(
              input.currentState.mentorRecommendation
                ?.decisionCycleId === reviewedCycle.id
                ? input.currentState.mentorRecommendation
                : baselineMentorRecommendation,
            )
          : undefined,
      },
      suggestedPrompts: input.currentState.decisionCycle.evidenceSubmitted
        ? [
            "Đề xuất cố vấn phù hợp",
            "Vì sao lúc này cần cố vấn?",
            "Tóm tắt điều đã học",
          ]
        : [
            "Nộp bằng chứng mẫu",
            "Bằng chứng nào còn thiếu?",
            "Mở chu kỳ quyết định",
          ],
    };
  }

  if (intent === "recommend-mentor") {
    const eligible =
      (input.currentState.decisionCycle.evidenceSubmitted &&
        input.currentState.decisionCycle.reviewCompleted) ||
      input.activeScenarioId === "mentor";
    const existingMentor =
      input.currentState.mentorRecommendation;
    const dismissedForCurrentCycle =
      existingMentor?.status === "deferred" &&
      existingMentor.decisionCycleId ===
        input.currentState.decisionCycle.id;
    const mentor =
      eligible && !dismissedForCurrentCycle
        ? structuredClone(
            existingMentor ?? baselineMentorRecommendation,
          )
        : null;
    return {
      ...common,
      assistantMessage: dismissedForCurrentCycle
        ? "Mình sẽ tiếp tục hỗ trợ bằng AI trong chu kỳ này và không lặp lại đề xuất cố vấn."
        : eligible
          ? "Phân tích thêm bằng AI sẽ không làm giảm nhiều bất định còn lại. Một cố vấn product growth phù hợp hơn ở thời điểm này."
          : "Chưa cần cố vấn ở thời điểm này. Bạn vẫn có thể thu hẹp vấn đề bằng một thử nghiệm nhỏ và dữ liệu activation.",
      structuredResponse: {
        type: "mentor-recommendation",
        payload: mentor,
      },
      proposedPatches: mentor
        ? { mentorRecommendation: mentor }
        : {},
      suggestedPrompts: mentor
        ? [
            "Vì sao cố vấn này phù hợp?",
            "Kết quả kỳ vọng của phiên trao đổi là gì?",
            "Để sau",
          ]
        : [
            "Đề xuất hành động nhỏ nhất tiếp theo",
            "Mở chu kỳ quyết định",
            "Bằng chứng nào còn thiếu?",
          ],
    };
  }

  const normalizedMessage = normalizeIntentText(input.message);
  const asksAboutTargetCustomer = includesAny(
    normalizedMessage,
    ["khach hang muc tieu", "phan khuc", "target customer"],
  );
  const resolvedCustomerContext =
    input.contextSummary?.confirmedMemory.find((item) =>
      normalizeIntentText(item).includes("founder ca nhan"),
    );
  const focus = asksAboutTargetCustomer && resolvedCustomerContext
    ? {
        id: "founder-personal-target-customer",
        bottleneck:
          "Context canonical hiện tại là founder cá nhân có sản phẩm sớm.",
        whyItMatters:
          "Pitch Deck mới mô tả chương trình ươm tạo như hướng tương lai, nhưng founder chưa chọn nó làm phân khúc hiện tại.",
        nextAction:
          "Giữ hai segment trong lịch sử và kiểm chứng chương trình ươm tạo bằng một cycle riêng.",
        sourceStatus: "verified" as const,
      }
    : structuredClone(baselineFocus);
  const growthMessage =
    resolvedCustomerContext && asksAboutTargetCustomer
      ? "Mình đang dùng xác nhận mới nhất của founder làm context hiện tại. Các nguồn pitch deck mâu thuẫn vẫn được giữ trong lịch sử nhưng không âm thầm ghi đè quyết định này."
      : intent === "growth-stalled"
      ? "Top-of-funnel vẫn ổn, nhưng activation giảm ngay sau onboarding. Đây là nơi nên tập trung trước khi tăng thêm traffic."
      : "Tín hiệu hiện tại cùng chỉ về một điểm: người dùng chưa chạm tới khoảnh khắc giá trị đủ sớm sau onboarding.";

  return {
    ...common,
    assistantMessage: growthMessage,
    structuredResponse: {
      type: "current-focus",
      payload: focus,
    },
    proposedPatches: { currentFocus: focus },
    suggestedPrompts: [
      "Vì sao đây là điểm nghẽn quan trọng nhất?",
      "Đề xuất hành động nhỏ nhất tiếp theo",
      "Tạo chu kỳ quyết định",
    ],
  };
}

export function createMockAiWorkspaceEngine(options?: {
  timing?: "simulated" | "instant";
}): AiWorkspaceEngine {
  const timing = options?.timing ?? "simulated";

  return {
    async respond(input) {
      if (
        (input.activeScenarioId === "error" ||
          input.activeScenarioId === "failed-response") &&
        input.retryAttempt === 0
      ) {
        if (timing === "simulated") {
          await waitForMockResponse(650, input.signal);
        }
        throw new MockAiWorkspaceError();
      }

      const intent = detectAiWorkspaceIntent(input.message);
      const response = buildResponse(input, intent);
      const partialResponse =
        input.retryAttempt === 0 &&
        input.message
          .toLocaleLowerCase("vi")
          .includes("phản hồi một phần");

      if (timing === "simulated") {
        await waitForMockResponse(
          response.simulatedLatencyMs,
          input.signal,
        );
      }

      if (partialResponse) {
        const breakpoint = Math.max(
          48,
          Math.floor(response.assistantMessage.length * 0.46),
        );
        const partialMessage = `${response.assistantMessage
          .slice(0, breakpoint)
          .trimEnd()}…`;
        return {
          ...response,
          assistantMessage: partialMessage,
          chunks: responseChunks(partialMessage),
          completionStatus: "incomplete",
          proposedPatches: {},
        };
      }

      return {
        ...response,
        chunks: responseChunks(response.assistantMessage),
        completionStatus: "complete",
      };
    },
  };
}

export const onboardingDecisionCycleResponse: StructuredResponse = {
  type: "decision-cycle",
  payload: structuredClone(baselineDecisionCycle),
};
