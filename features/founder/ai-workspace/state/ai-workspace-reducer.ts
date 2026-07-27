import type {
  AiWorkspaceAction,
  AiWorkspaceState,
  DecisionCycleStepId,
} from "../types/ai-workspace.types";

const orderedCycleSteps: DecisionCycleStepId[] = [
  "understand",
  "decide",
  "act",
  "evidence",
  "review",
];

function completeBefore(
  current: DecisionCycleStepId[],
  nextStep: DecisionCycleStepId,
) {
  const nextIndex = orderedCycleSteps.indexOf(nextStep);
  return orderedCycleSteps
    .slice(0, nextIndex)
    .filter((step) => current.includes(step) || step === orderedCycleSteps[nextIndex - 1]);
}

export function aiWorkspaceReducer(
  state: AiWorkspaceState,
  action: AiWorkspaceAction,
): AiWorkspaceState {
  switch (action.type) {
    case "hydrate":
    case "set-scenario":
      return action.state;

    case "user-message":
      return {
        ...state,
        messages: [...state.messages, action.message],
        generationStatus: "typing",
        errorMessage: undefined,
        lastRequest: action.request,
      };

    case "stream-start":
      return {
        ...state,
        generationStatus: "streaming",
        messages: [...state.messages, action.message],
      };

    case "stream-chunk":
      return {
        ...state,
        messages: state.messages.map((message) =>
          message.id === action.messageId
            ? {
                ...message,
                content: `${message.content}${action.chunk}`,
              }
            : message,
        ),
      };

    case "response-complete": {
      const nextDecisionCycle =
        action.response.proposedPatches.decisionCycle ??
        state.decisionCycle;
      const nextFocus =
        action.response.proposedPatches.currentFocus ??
        state.currentFocus;
      const proposedMentor =
        action.response.proposedPatches.mentorRecommendation;
      const currentMentor =
        proposedMentor ?? state.mentorRecommendation;
      const mentorRecommendation =
        currentMentor &&
        !proposedMentor &&
        currentMentor.status !== "deferred" &&
        currentMentor.status !== "external" &&
        currentMentor.status !== "booked" &&
        (currentMentor.decisionCycleId !==
          nextDecisionCycle.id ||
          currentMentor.blockerId !== nextFocus.id)
          ? {
              ...currentMentor,
              status: "stale" as const,
            }
          : currentMentor;
      return {
        ...state,
        ...action.response.proposedPatches,
        mentorRecommendation,
        messages: state.messages.map((message) =>
          message.id === action.messageId
            ? {
                ...message,
                content:
                  message.content ||
                  action.response.assistantMessage,
                status: "complete" as const,
                structuredResponse:
                  action.response.structuredResponse,
                sources: action.response.sourceReferences,
              }
            : message,
        ),
        generationStatus: "idle",
        errorMessage: undefined,
        suggestedPrompts: action.response.suggestedPrompts,
      };
    }

    case "response-incomplete":
      return {
        ...state,
        messages: state.messages.map((message) =>
          message.id === action.messageId
            ? {
                ...message,
                status: "incomplete" as const,
              }
            : message,
        ),
        generationStatus: "error",
        errorMessage: action.message,
      };

    case "response-error":
      return {
        ...state,
        generationStatus: "error",
        errorMessage: action.message,
      };

    case "message-send-error":
      return {
        ...state,
        messages: state.messages.map((message) =>
          message.id === action.messageId
            ? { ...message, status: "failed" as const }
            : message,
        ),
        generationStatus: "idle",
        errorMessage: undefined,
      };

    case "retry-start":
      return {
        ...state,
        messages: state.messages.map((message) =>
          message.role === "founder" &&
          message.status === "failed" &&
          message.content === action.request.message
            ? { ...message, status: "complete" as const }
            : message,
        ),
        generationStatus: "typing",
        errorMessage: undefined,
        lastRequest: action.request,
      };

    case "replace-messages":
      return {
        ...state,
        messages: action.messages,
        generationStatus: "idle",
        errorMessage: undefined,
        lastRequest: undefined,
      };

    case "cancel-request":
      return {
        ...state,
        generationStatus: "idle",
        errorMessage: undefined,
        lastRequest: undefined,
        messages: state.messages.filter(
          (message) => message.status !== "streaming",
        ),
      };

    case "remove-message":
      return {
        ...state,
        messages: state.messages.filter(
          (message) => message.id !== action.messageId,
        ),
        generationStatus: "idle",
        errorMessage: undefined,
        lastRequest: undefined,
      };

    case "set-view":
      return {
        ...state,
        view: action.view,
      };

    case "add-attachment":
      return {
        ...state,
        attachments: state.attachments.some(
          (attachment) => attachment.id === action.attachment.id,
        )
          ? state.attachments
          : [...state.attachments, action.attachment],
      };

    case "attachment-ready":
      return {
        ...state,
        attachments: state.attachments.map((attachment) =>
          attachment.id === action.attachmentId
            ? { ...attachment, status: "ready" as const }
            : attachment,
        ),
      };

    case "remove-attachment":
      return {
        ...state,
        attachments: state.attachments.filter(
          (attachment) =>
            attachment.id !== action.attachmentId,
        ),
      };

    case "confirm-interpretation":
      return state.materialAnalysis
        ? {
            ...state,
            materialAnalysis: {
              ...state.materialAnalysis,
              interpretationStatus: action.status,
            },
          }
        : state;

    case "set-cycle-step": {
      const currentIndex = orderedCycleSteps.indexOf(
        state.decisionCycle.currentStep,
      );
      const nextIndex = orderedCycleSteps.indexOf(action.step);
      return {
        ...state,
        decisionCycle: {
          ...state.decisionCycle,
          currentStep: action.step,
          completedSteps:
            nextIndex > currentIndex
              ? completeBefore(
                  state.decisionCycle.completedSteps,
                  action.step,
                )
              : state.decisionCycle.completedSteps,
        },
      };
    }

    case "toggle-cycle-task":
      return {
        ...state,
        decisionCycle: {
          ...state.decisionCycle,
          checklist: state.decisionCycle.checklist.map((item) =>
            item.id === action.taskId
              ? { ...item, completed: !item.completed }
              : item,
          ),
        },
      };

    case "submit-cycle-evidence": {
      if (state.decisionCycle.evidenceSubmitted) {
        return state;
      }
      const readiness = {
        ...state.readiness,
        currentScore: 61,
        previousScore: 54,
        delta: 7,
        label: "Đang tiến triển",
        explanation:
          "Dữ liệu thử nghiệm đã xác nhận activation là một phần của điểm nghẽn. Điểm tăng vì đã có tín hiệu hành vi, không phải chỉ vì một file được thêm vào.",
        supportedBy: [
          ...state.readiness.supportedBy,
          "Cohort onboarding mới có activation cao hơn 11%",
        ],
        missingEvidence: [
          "Cần thêm một cohort để kiểm tra tính lặp lại",
          "Cần góc nhìn chuyên môn về ngưỡng rollout",
        ],
        unlockAction:
          "Review ngưỡng thành công với một chuyên gia product growth trước khi rollout rộng.",
        breakdown: state.readiness.breakdown.map((dimension) =>
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
      return {
        ...state,
        readiness,
        evidenceHealth: state.evidenceHealth.map((item) => ({
          ...item,
          status: "verified" as const,
          detail:
            item.id === "day-three"
              ? "Cohort thử nghiệm tăng 11% so với baseline."
              : item.id === "user-feedback"
                ? "Ba phản hồi người dùng đã được ghi nhận."
                : item.detail,
        })),
        decisionCycle: {
          ...state.decisionCycle,
          currentStep: "review",
          completedSteps: [
            "understand",
            "decide",
            "act",
            "evidence",
          ],
          evidenceSubmitted: true,
          evidence: state.decisionCycle.evidence.map((item) => ({
            ...item,
            status: "verified" as const,
            detail:
              item.id === "cycle-day-three"
                ? "Activation tăng 11% trong cohort thử nghiệm."
                : item.id === "cycle-feedback"
                  ? "Ba phản hồi người dùng đã được ghi nhận."
                  : item.detail,
          })),
        },
      };
    }

    case "complete-cycle-review":
      return {
        ...state,
        mentorRecommendation: action.mentor,
        decisionCycle: {
          ...state.decisionCycle,
          currentStep: "review",
          completedSteps: [...orderedCycleSteps],
          reviewCompleted: true,
          reviewSummary:
            "Activation tăng 11%, thấp hơn ngưỡng 15% nhưng đủ để xác nhận onboarding là một phần của điểm nghẽn.",
        },
      };

    case "defer-mentor":
      return state.mentorRecommendation
        ? {
            ...state,
            mentorRecommendation: {
              ...state.mentorRecommendation,
              status: "deferred",
              dismissReason: action.reason ?? "not_now",
            },
          }
        : state;

    case "set-mentor-status":
      return state.mentorRecommendation
        ? {
            ...state,
            mentorRecommendation: {
              ...state.mentorRecommendation,
              status: action.status,
              dismissReason: undefined,
            },
          }
        : state;

    case "toggle-mentor-preparation":
      return state.mentorRecommendation
        ? {
            ...state,
            mentorRecommendation: {
              ...state.mentorRecommendation,
              preparation:
                (state.mentorRecommendation.preparation ?? []).map(
                  (item) =>
                    item.id === action.itemId
                      ? {
                          ...item,
                          completed: !item.completed,
                        }
                      : item,
                ),
            },
          }
        : state;

    case "refresh-mentor":
      return {
        ...state,
        mentorRecommendation: action.mentor,
      };
  }
}
