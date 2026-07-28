import type {
  AiWorkspaceAction,
  AiWorkspaceState,
  DecisionCycleStepId,
} from "../types/ai-workspace.types";
import {
  calculateOverallReadiness,
  disputeContribution,
} from "../readiness/services/readiness-calculator";

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

function createMentorSession(
  state: AiWorkspaceState,
  status: "booked" | "external",
) {
  const mentor = state.mentorRecommendation;
  if (!mentor) return state.mentorSession;
  return {
    id: `session-${mentor.id}-${state.decisionCycle.id}`,
    mentorId: mentor.id,
    mentorName: mentor.name,
    mentorRole: mentor.role,
    goal: "Thiết kế pilot 14 ngày cho CampusFlow.",
    scheduledAt: "2026-07-30T03:00:00.000Z",
    displayTime: "10:00, Thứ Năm",
    status,
    preparation: mentor.preparation.map((item) => ({
      ...item,
    })),
  };
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
      const lifecycleKinds = new Set([
        "insight",
        "action_proposal",
        "mentor_intervention",
      ]);
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
                responseKind: action.response.responseKind,
                responseLifecycle: action.response.lifecycle,
                structuredResponse:
                  action.response.structuredResponse,
                sources: action.response.sourceReferences,
              }
            : message.role === "assistant" &&
                message.responseKind ===
                  action.response.responseKind &&
                message.responseLifecycle === "active" &&
                lifecycleKinds.has(action.response.responseKind)
              ? {
                  ...message,
                  responseLifecycle: "superseded" as const,
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
                responseLifecycle: "failed" as const,
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

    case "set-suggested-prompts":
      return {
        ...state,
        suggestedPrompts: action.prompts,
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
        currentScore: 68,
        previousScore: 65,
        delta: 3,
        label: "Đang tiến triển",
        explanation:
          "Evidence pilot đã xác nhận repeat usage trong workflow thật. Điểm tăng vì có tín hiệu hành vi, không phải chỉ vì thêm một file.",
        supportedBy: [
          ...state.readiness.supportedBy,
          "Ít nhất 3/5 thành viên quay lại dùng core flow",
        ],
        missingEvidence: [
          "Cần thêm một câu lạc bộ để kiểm tra tính lặp lại",
          "Cần review phần việc vẫn xử lý ngoài CampusFlow",
        ],
        unlockAction:
          "Review pilot learning trước khi mở rộng sang câu lạc bộ thứ hai.",
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
        decisionCycleLifecycle: "completed",
        mentorRecommendation: action.mentor,
        decisionCycle: {
          ...state.decisionCycle,
          currentStep: "review",
          completedSteps: [...orderedCycleSteps],
          reviewCompleted: true,
          reviewSummary:
            "Pilot đã tạo evidence về repeat usage; cần review trước khi mở rộng.",
        },
      };

    case "confirm-action-proposal": {
      if (state.decisionCycleLifecycle !== "not_created") {
        return state;
      }
      return {
        ...state,
        decisionCycleLifecycle: "active",
        view: "decision-cycle",
        messages: state.messages.map((message) =>
          message.id === action.messageId &&
          message.role === "assistant" &&
          message.responseKind === "action_proposal"
            ? {
                ...message,
                responseLifecycle: "completed" as const,
              }
            : message,
        ),
      };
    }

    case "defer-mentor":
      return state.mentorRecommendation
        ? {
            ...state,
            mentorRecommendation: {
              ...state.mentorRecommendation,
              status: "deferred",
              dismissReason: action.reason ?? "not_now",
            },
            messages: state.messages.map((message) =>
              message.role === "assistant" &&
              message.responseKind ===
                "mentor_intervention" &&
              message.responseLifecycle === "active"
                ? {
                    ...message,
                    responseLifecycle: "dismissed" as const,
                  }
                : message,
            ),
          }
        : state;

    case "book-mentor": {
      if (
        !state.mentorRecommendation ||
        state.mentorRecommendation.status === "booked"
      ) {
        return state;
      }
      return {
        ...state,
        mentorRecommendation: {
          ...state.mentorRecommendation,
          status: "booked",
          dismissReason: undefined,
        },
        mentorSession:
          state.mentorSession ??
          createMentorSession(state, "booked"),
        messages: state.messages.map((message) =>
          message.role === "assistant" &&
          message.responseKind === "mentor_intervention" &&
          message.responseLifecycle === "active"
            ? {
                ...message,
                responseLifecycle: "completed" as const,
              }
            : message,
        ),
      };
    }

    case "set-mentor-status":
      if (!state.mentorRecommendation) return state;
      if (action.status === "booked") {
        if (state.mentorRecommendation.status === "booked") {
          return state;
        }
        return {
          ...state,
          mentorRecommendation: {
            ...state.mentorRecommendation,
            status: "booked",
            dismissReason: undefined,
          },
          mentorSession:
            state.mentorSession ??
            createMentorSession(state, "booked"),
          messages: state.messages.map((message) =>
            message.role === "assistant" &&
            message.responseKind ===
              "mentor_intervention" &&
            message.responseLifecycle === "active"
              ? {
                  ...message,
                  responseLifecycle: "completed" as const,
                }
              : message,
          ),
        };
      }
      if (action.status === "external") {
        return {
          ...state,
          mentorRecommendation: {
            ...state.mentorRecommendation,
            status: "external",
            dismissReason: undefined,
          },
          mentorSession:
            state.mentorSession ??
            createMentorSession(state, "external"),
          messages: state.messages.map((message) =>
            message.role === "assistant" &&
            message.responseKind ===
              "mentor_intervention" &&
            message.responseLifecycle === "active"
              ? {
                  ...message,
                  responseLifecycle: "completed" as const,
                }
              : message,
          ),
        };
      }
      return {
        ...state,
        mentorRecommendation: {
          ...state.mentorRecommendation,
          status: action.status,
          dismissReason: undefined,
        },
      };

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

    case "set-ai-model":
      return {
        ...state,
        selectedModel: action.modelId,
      };

    case "create-mentor-connection":
      if (state.mentorConnectionRequest) return state;
      return {
        ...state,
        mentorConnectionRequest: action.request,
      };

    case "send-mentor-connection":
      if (
        !state.mentorConnectionRequest ||
        state.mentorConnectionRequest.status === "sent"
      ) {
        return state;
      }
      return {
        ...state,
        mentorConnectionRequest: {
          ...state.mentorConnectionRequest,
          status: "sent",
          sentAt: new Date().toISOString(),
        },
      };

    case "verify-readiness-evidence": {
      const currentAssessment = state.readiness.assessment;
      if (
        currentAssessment.criteria.some((criterion) =>
          criterion.contributions.some((contribution) =>
            contribution.id.startsWith(
              "analytics-treatment-",
            ),
          ),
        )
      ) {
        return state;
      }
      const scoreChanges: Partial<
        Record<
          (typeof currentAssessment.criteria)[number]["id"],
          number
        >
      > = {
        customer_discovery_and_evidence: 67,
        prototype_and_learning: 63,
        market_signal_and_commitment: 52,
        experiment_and_execution_discipline: 75,
      };
      const criteria = currentAssessment.criteria.map(
        (criterion) => {
          const nextScore = scoreChanges[criterion.id];
          if (
            nextScore === undefined ||
            !action.criterionIds.includes(criterion.id)
          ) {
            return criterion;
          }
          return {
            ...criterion,
            score: nextScore,
            delta: nextScore - criterion.score,
            confidence:
              criterion.id === "prototype_and_learning"
                ? ("high" as const)
                : criterion.confidence,
            contributions: [
              {
                id: `analytics-treatment-${criterion.id}`,
                criterionId: criterion.id,
                type: "positive" as const,
                status: "verified" as const,
                title: "Kết quả treatment đã được xác minh",
                interpretation:
                  "Treatment đạt activation 22% so với 18% ở control trên mẫu 186 người dùng.",
                confidence: "high" as const,
                contributionPoints: nextScore - criterion.score,
                source: {
                  fileName: "AnalyticsSnapshot-May.json",
                  section: "activation_experiment",
                  quote:
                    '"treatment": 0.22, "control": 0.18, "sample": 186',
                },
                observedAt: new Date().toISOString(),
                freshnessDays: 0,
                dedupeKey: `analytics-treatment-22-${criterion.id}`,
                canonical: true,
              },
              ...criterion.contributions,
            ],
          };
        },
      );
      const nextScore = calculateOverallReadiness(criteria);
      const nextAssessment = {
        ...currentAssessment,
        criteria,
        previousScore: currentAssessment.overallScore,
        overallScore: nextScore,
        delta: nextScore - currentAssessment.overallScore,
        updatedAt: new Date().toISOString(),
        history: [
          {
            id: "readiness-61-66-activation-verified",
            type: "increase" as const,
            previousScore: currentAssessment.overallScore,
            nextScore,
            delta: nextScore - currentAssessment.overallScore,
            reason:
              "Analytics xác minh treatment activation 22% so với 18% ở control trên mẫu 186 người dùng.",
            occurredAt: new Date().toISOString(),
            rubricVersion: currentAssessment.rubricVersion,
            evidenceIds: action.criterionIds.map(
              (criterionId) =>
                `analytics-treatment-${criterionId}`,
            ),
          },
          ...currentAssessment.history,
        ],
      };
      return {
        ...state,
        readiness: {
          ...state.readiness,
          currentScore: nextScore,
          previousScore: currentAssessment.overallScore,
          delta: nextScore - currentAssessment.overallScore,
          label: nextAssessment.label,
          explanation:
            "Kết quả thử nghiệm activation đã được analytics xác minh và cập nhật vào điểm canonical.",
          assessment: nextAssessment,
          breakdown: state.readiness.breakdown.map((dimension) => {
            const mappedId =
              dimension.id === "customer-evidence"
                ? "customer_discovery_and_evidence"
                : dimension.id === "execution"
                  ? "experiment_and_execution_discipline"
                  : undefined;
            const criterion = criteria.find(
              (item) => item.id === mappedId,
            );
            return criterion
              ? { ...dimension, score: criterion.score }
              : dimension;
          }),
        },
      };
    }

    case "dispute-readiness-contribution": {
      const assessment = disputeContribution(
        state.readiness.assessment,
        action.contributionId,
      );
      return {
        ...state,
        readiness: {
          ...state.readiness,
          currentScore: assessment.overallScore,
          previousScore: assessment.previousScore,
          delta: assessment.delta,
          assessment,
          explanation:
            "Một đóng góp đã bị loại vì founder đánh dấu cách diễn giải của AI không chính xác.",
        },
      };
    }

    case "activate-decision-cycle":
      if (state.decisionCycleLifecycle !== "not_created") {
        return {
          ...state,
          view: "decision-cycle",
        };
      }
      return {
        ...state,
        decisionCycleLifecycle: "active",
        view: "decision-cycle",
      };

    case "confirm-readiness-contribution": {
      const currentAssessment = state.readiness.assessment;
      const currentContribution =
        currentAssessment.criteria
          .flatMap((criterion) => criterion.contributions)
          .find(
            (contribution) =>
              contribution.id === action.contributionId,
          );
      if (
        !currentContribution ||
        currentContribution.status === "verified"
      ) {
        return state;
      }
      const criteria = currentAssessment.criteria.map(
        (criterion) => ({
          ...criterion,
          contributions: criterion.contributions.map(
            (contribution) =>
              contribution.id === action.contributionId
                ? {
                    ...contribution,
                    status: "verified" as const,
                    confidence: "high" as const,
                    excluded: false,
                  }
                : contribution,
          ),
        }),
      );
      return {
        ...state,
        readiness: {
          ...state.readiness,
          assessment: {
            ...currentAssessment,
            criteria,
            history: [
              {
                id: `history-confirmed-${action.contributionId}`,
                type: "no_change",
                previousScore: currentAssessment.overallScore,
                nextScore: currentAssessment.overallScore,
                delta: 0,
                reason:
                  "Founder xác nhận cách diễn giải của đóng góp; confidence được cập nhật nhưng điểm canonical không tự động thay đổi.",
                occurredAt: new Date().toISOString(),
                rubricVersion:
                  currentAssessment.rubricVersion,
                evidenceIds: [action.contributionId],
              },
              ...currentAssessment.history,
            ],
          },
        },
      };
    }
  }
}
