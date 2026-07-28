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
    .toLowerCase()
    .replace(/đ/g, "d");
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
      "treatment activation",
      "control activation",
      "mau 186",
      "sample 186",
    ])
  ) {
    return "submit-evidence";
  }

  if (
    includesAny(normalized, [
      "huong thu nghiem nao khac",
      "thu nghiem nao khac",
      "phuong an thu nghiem",
    ])
  ) {
    return "compare-experiments";
  }
  if (
    includesAny(normalized, [
      "diem yeu lon nhat",
      "rui ro lon nhat",
      "diem yeu cua thu nghiem",
    ])
  ) {
    return "experiment-risk";
  }
  if (
    includesAny(normalized, [
      "metric nao",
      "chi so nao",
      "nhom control",
      "control the nao",
    ])
  ) {
    return "experiment-metrics";
  }
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
      "danh gia traction",
      "traction hien tai",
      "phan tich traction",
    ])
  ) {
    return "assess-traction";
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
      label: "Dữ liệu funnel",
      status: "verified",
    },
    {
      id: "source-day-three-activation",
      label: "Activation ngày thứ ba",
      status: "verified",
    },
    {
      id: "source-interview-batch-03",
      label: "Nhóm phỏng vấn người dùng số 03",
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
    responseKind: "conversation" as const,
    lifecycle: "active" as const,
    proposedPatches: {},
    suggestedPrompts: getScenarioPrompts(input.activeScenarioId),
    sourceReferences: sourceReferences(intent),
    simulatedLatencyMs:
      !input.modelId
        ? 650
        : input.modelId === "kizuna-max"
        ? 900
        : input.modelId === "kizuna-wild"
          ? 720
          : 520,
  };

  if (intent === "analyze-materials") {
    const normalized = normalizeIntentText(input.message);
    if (
      includesAny(normalized, [
        "pitch deck",
        "pitchdeck",
        "cach cai thien",
      ])
    ) {
      return {
        ...common,
        responseKind: "artifact_preview",
        assistantMessage:
          "Pitch deck hiện kể câu chuyện khá rõ về vấn đề và người dùng, nhưng ba tuyên bố quan trọng vẫn chưa đủ sức thuyết phục.\n\nĐiểm yếu lớn nhất không nằm ở cách trình bày mà ở khoảng cách giữa acquisition và bằng chứng giá trị lặp lại. Tôi sẽ giữ mọi mức tăng điểm dưới dạng dự kiến cho tới khi có dữ liệu được xác minh.",
        structuredResponse: {
          type: "pitch-deck-review",
          payload: {
            title: "Ba điểm cần cải thiện trong PitchDeck-v5",
            summary:
              "Ưu tiên thay các tuyên bố đẹp bằng bằng chứng có thể truy xuất và kiểm chứng.",
            weaknesses: [
              {
                id: "traction-vanity",
                title: "Traction đang là vanity metric",
                detail:
                  "1.243 lượt đăng ký là tín hiệu acquisition, chưa chứng minh activation hoặc retention.",
                sourceLabel: "PitchDeck-v5.pdf · Trang 8",
              },
              {
                id: "customer-proof-opinion",
                title: "Customer proof mới là ý kiến",
                detail:
                  "8/10 người thấy hữu ích chưa chứng minh họ quay lại hoặc trả tiền.",
                sourceLabel: "PitchDeck-v5.pdf · Trang 6",
              },
              {
                id: "pricing-unvalidated",
                title: "Pricing chưa được xác minh",
                detail:
                  "299 USD/tháng đang là giả định nội bộ, chưa có willingness to pay.",
                sourceLabel: "PitchDeck-v5.pdf · Trang 11",
              },
            ],
            projectedReadiness: {
              presentationOnly: 62,
              verifiedEvidenceRange: [66, 68],
              label: "Dự kiến · Chưa cập nhật điểm hiện tại",
            },
            actions: [
              "Thay số đăng ký bằng activation và retention theo cohort.",
              "Bổ sung một case study trước–sau có nguồn.",
              "Gắn pricing với pilot trả phí hoặc cam kết mua.",
            ],
          },
        },
        proposedPatches: {
          materialAnalysis: materialAnalysis(input),
        },
        suggestedPrompts: [
          "Tôi nên làm gì tiếp theo?",
          "Đánh giá traction hiện tại",
          "Mở bằng chứng khách hàng",
        ],
      };
    }
    const analysis = materialAnalysis(input);
    return {
      ...common,
      responseKind: "artifact_preview",
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
      responseKind: "artifact_preview",
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
        "Mức độ sẵn sàng hiện tại không phải là một phán quyết về startup. Điểm 61 cho thấy phần funnel và activation ngày thứ ba đã có cơ sở, trong khi retention tuần hai và phản hồi định tính vẫn chưa đủ để kết luận dài hạn.\n\nĐiểm số chỉ nên được dùng để xác định bằng chứng tiếp theo cần thu thập, không thay thế quyết định của founder.",
      proposedPatches: {},
      suggestedPrompts: [
        "Bằng chứng nào còn thiếu?",
        "Đề xuất hành động để tăng readiness",
        "Điều gì còn chưa chắc chắn?",
      ],
    };
  }

  if (
    intent === "suggest-action" ||
    intent === "compare-experiments" ||
    intent === "create-decision-cycle"
  ) {
    if (intent === "suggest-action") {
      return {
        ...common,
        responseKind: "action_proposal",
        assistantMessage:
          "Ưu tiên duy nhất lúc này là kiểm tra sử dụng lặp lại, không phải tăng thêm acquisition.\n\nHãy chạy pilot 14 ngày với 20 người đã hoàn tất onboarding. Metric chính là tỷ lệ tạo báo cáo lần thứ hai; ngưỡng thành công tối thiểu 25%. Nếu đạt, readiness dự kiến tăng 3–7 điểm, nhưng điểm canonical chỉ thay đổi sau khi dữ liệu được xác minh.",
        structuredResponse: {
          type: "next-action",
          payload: {
            title: "Pilot sử dụng lặp lại trong 14 ngày",
            priority:
              "Kiểm tra liệu người dùng có quay lại tạo báo cáo lần thứ hai.",
            durationDays: 14,
            participantCount: 20,
            primaryMetric: "Tỷ lệ tạo báo cáo lần thứ hai",
            successThreshold: "≥25%",
            projectedDelta: [3, 7],
          },
        },
        proposedPatches: {},
        suggestedPrompts: [
          "Điểm yếu lớn nhất của pilot này là gì?",
          "Thiết kế nhóm control thế nào?",
          "Tôi cần thu thập nguồn nào?",
        ],
      };
    }
    return {
      ...common,
      responseKind: "action_proposal",
      assistantMessage:
        intent === "compare-experiments"
          ? "Có ba hướng hợp lý:\n\n1. Rút onboarding còn ba bước.\n2. Cho người dùng thấy kết quả mẫu trước khi hoàn tất setup.\n3. Cá nhân hóa onboarding theo mục tiêu sử dụng.\n\nVới dữ liệu hiện tại, hướng đầu tiên có chi phí thấp nhất và dễ đo tác động nhất."
          : "Hành động có giá trị nhất lúc này là một thử nghiệm onboarding nhỏ, đủ nhanh để cho biết activation có thực sự là điểm nghẽn hay không.",
      structuredResponse: {
        type: "suggested-action",
        payload: {
          id: "proposal-onboarding-three-steps",
          title:
            "Thử onboarding ba bước trên 20% người dùng mới.",
          rationale:
            "Tập trung vào đoạn funnel đang giảm thay vì tiếp tục tăng traffic.",
          action:
            "Rollout cho 20% người dùng mới và đo activation trong bảy ngày.",
          goal:
            "Kiểm tra liệu luồng ngắn hơn có tăng activation trong 7 ngày hay không.",
          expectedOutcome:
            "Activation tăng ít nhất 15% trong 14 ngày.",
        },
      },
      proposedPatches: {},
      suggestedPrompts: [
        "Bằng chứng nào sẽ thay đổi quyết định?",
        "Điểm yếu lớn nhất của thử nghiệm này là gì?",
        "Thiết kế nhóm control thế nào?",
      ],
    };
  }

  if (intent === "experiment-risk") {
    return {
      ...common,
      assistantMessage:
        "Rủi ro lớn nhất là bạn có thể thấy activation tăng nhưng không biết chính xác bước nào tạo ra tác động.\n\nNếu thay quá nhiều nội dung cùng lúc, kết quả sẽ khó diễn giải.\n\nTôi khuyên bạn chỉ thay cấu trúc luồng, giữ nguyên nội dung và thông điệp trong phiên bản đầu tiên.",
      proposedPatches: {},
      suggestedPrompts: [
        "Cần theo dõi metric nào?",
        "Thiết kế nhóm control thế nào?",
        "Có cần mentor review thử nghiệm này không?",
      ],
    };
  }

  if (intent === "experiment-metrics") {
    return {
      ...common,
      assistantMessage:
        "Theo dõi một metric chính là tỷ lệ người dùng chạm tới khoảnh khắc giá trị trong 7 ngày. Giữ thêm hai guardrail: tỷ lệ hoàn tất onboarding và retention ngày thứ 14.\n\nNhóm control nên giữ nguyên flow hiện tại; nhóm thử nghiệm chỉ thay cấu trúc còn ba bước để kết quả có thể diễn giải.",
      proposedPatches: {},
      suggestedPrompts: [
        "Ngưỡng thành công nên đặt bao nhiêu?",
        "Điều gì có thể làm sai lệch kết quả?",
        "Có cần mentor review thử nghiệm này không?",
      ],
    };
  }

  if (intent === "submit-evidence") {
    const normalized = normalizeIntentText(input.message);
    if (
      includesAny(normalized, [
        "treatment activation",
        "control activation",
        "mau 186",
        "sample 186",
      ])
    ) {
      return {
        ...common,
        responseKind: "artifact_preview",
        assistantMessage:
          "Tôi đã ghi nhận treatment activation 22%, control 18% trên mẫu 186 người dùng. Đây là bằng chứng mới đang chờ xác minh từ AnalyticsSnapshot-May.json.\n\nNếu nguồn khớp, readiness dự kiến tăng 3–6 điểm. Điểm canonical hiện vẫn là 61.",
        structuredResponse: {
          type: "readiness-evidence",
          payload: {
            title: "Kết quả activation đang chờ xác minh",
            treatmentActivation: 22,
            controlActivation: 18,
            sampleSize: 186,
            status: "waiting",
            projectedDelta: [3, 6],
          },
        },
        proposedPatches: {},
        suggestedPrompts: [
          "Nguồn nào sẽ được dùng để xác minh?",
          "Điều gì có thể làm sai lệch kết quả?",
          "Xem mức độ sẵn sàng",
        ],
      };
    }
    const readiness = readinessAfterEvidence();
    return {
      ...common,
      responseKind: "artifact_preview",
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
      responseKind: "artifact_preview",
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
    const existingMentor =
      input.currentState.mentorRecommendation;
    const mentor = structuredClone({
      ...(existingMentor ?? baselineMentorRecommendation),
      status: "recommended" as const,
      dismissReason: undefined,
    });
    return {
      ...common,
      responseKind: "mentor_intervention",
      assistantMessage:
        "Jessica Lin là lựa chọn phù hợp nhất với mức độ phù hợp 92% và độ tin cậy cao. Cô ấy có kinh nghiệm trực tiếp về onboarding, activation và retention cho B2B SaaS.\n\nBạn có thể kết nối ngay mà không cần tạo Decision Cycle. Hai lựa chọn thay thế vẫn được giữ để bạn so sánh trade-off.",
      structuredResponse: {
        type: "mentor-recommendation",
        payload: mentor,
      },
      proposedPatches: { mentorRecommendation: mentor },
      suggestedPrompts: [
        "Điểm nào cần mentor phản biện nhất?",
        "Tôi cần chuẩn bị bằng chứng gì?",
        "Câu hỏi quan trọng nhất cho cố vấn là gì?",
      ],
    };
  }

  if (intent === "assess-traction") {
    return {
      ...common,
      responseKind: "artifact_preview",
      assistantMessage:
        "Traction hiện chưa đủ khỏe để scale. Acquisition 1.243 là tín hiệu tốt, nhưng activation 18% và retention tuần 2 chỉ 7% cho thấy giá trị chưa lặp lại.\n\nTôi áp dụng cap 60/100 cho tiêu chí traction cho tới khi có bằng chứng sử dụng lặp lại. Chỉ nên cân nhắc scale khi activation đạt ít nhất 25% và retention tuần 2 đạt ít nhất 15%.",
      structuredResponse: {
        type: "traction-diagnosis",
        payload: {
          title: "Traction chưa đủ điều kiện để scale",
          metrics: [
            {
              id: "acquisition",
              label: "Acquisition",
              value: "1.243 đăng ký",
              assessment: "good",
            },
            {
              id: "onboarding",
              label: "Hoàn tất onboarding",
              value: "76%",
              assessment: "good",
            },
            {
              id: "activation",
              label: "Activation",
              value: "18%",
              assessment: "weak",
            },
            {
              id: "retention",
              label: "Retention tuần 2",
              value: "7%",
              assessment: "very_weak",
            },
          ],
          diagnosis:
            "Đầu phễu có nhu cầu nhưng người dùng chưa quay lại đủ thường xuyên để chứng minh giá trị.",
          capScore: 60,
          scaleThresholds: [
            "Activation ≥25%",
            "Retention tuần 2 ≥15%",
          ],
          projectedTraction: [60, 66],
          projectedReadiness: [65, 69],
        },
      },
      proposedPatches: {},
      suggestedPrompts: [
        "Tôi nên làm gì tiếp theo?",
        "Nguồn nào tạo ra cap 60?",
        "Thiết kế pilot 14 ngày",
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
      ? "Dữ liệu hiện tại cho thấy vấn đề không nằm ở lượng người dùng mới.\n\nTop-of-funnel vẫn ổn, nhưng nhiều người rời đi trước khi hoàn tất onboarding. Điều này khiến việc tăng acquisition lúc này có thể chỉ làm tăng số người rơi khỏi funnel.\n\nTôi nghĩ bạn nên ưu tiên activation trước khi tiếp tục mở rộng acquisition."
      : "Tín hiệu hiện tại cùng chỉ về một điểm: người dùng chưa chạm tới khoảnh khắc giá trị đủ sớm sau onboarding.";

  return {
    ...common,
    responseKind: "insight",
    assistantMessage: growthMessage,
    structuredResponse: {
      type: "current-focus",
      payload: focus,
    },
    proposedPatches: { currentFocus: focus },
    suggestedPrompts: [
      "Vì sao đây là điểm nghẽn quan trọng nhất?",
      "Điều gì còn chưa chắc chắn?",
      "Có hướng thử nghiệm nào khác?",
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
