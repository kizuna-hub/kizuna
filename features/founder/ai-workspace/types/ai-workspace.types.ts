import type { VentureId } from "../../../venture/core";
import type {
  ExplainableReadinessAssessment,
  ReadinessCriterionId,
} from "../readiness/types/readiness.types";
import type {
  MentorConnectionBrief,
  MentorConnectionOperationState,
  MentorConnectionRequest,
} from "../mentor-connection/types/mentor-connection.types";
import type {
  MentorRecommendationGridPayload,
  MentorRecommendationState,
} from "../mentor-recommendation/types/mentor-recommendation.types";

export type {
  MentorConnectionBrief,
  MentorConnectionRequest,
} from "../mentor-connection/types/mentor-connection.types";
export type {
  MentorAvailabilityStatus,
  MentorMatch,
  MentorPricing,
  MentorRecommendationGridPayload,
  MentorRecommendationState,
} from "../mentor-recommendation/types/mentor-recommendation.types";

export type AiWorkspaceScenarioId =
  | "onboarding-case-study"
  | "bottleneck"
  | "materials"
  | "readiness"
  | "decision-cycle"
  | "mentor"
  | "error"
  | "long-running"
  | "search-pricing"
  | "context-conflict"
  | "stale-traction"
  | "readiness-decrease"
  | "safe-switch"
  | "search-ask"
  | "session-summary"
  | "failed-response";

export type EvidenceSignalStatus =
  | "verified"
  | "inferred"
  | "assumed"
  | "missing"
  | "disputed"
  | "outdated"
  | "waiting";

export type AiWorkspaceIntent =
  | "growth-stalled"
  | "find-bottleneck"
  | "compare-experiments"
  | "experiment-risk"
  | "experiment-metrics"
  | "explain-readiness"
  | "analyze-materials"
  | "assess-traction"
  | "suggest-action"
  | "create-decision-cycle"
  | "recommend-mentor"
  | "challenge-interpretation"
  | "submit-evidence"
  | "review-results";

export type AiModelId =
  | "kizuna-lite"
  | "kizuna-max"
  | "kizuna-wild";

export type AiGenerationStatus =
  | "idle"
  | "typing"
  | "streaming"
  | "error";

export type AiWorkspaceView = "conversation" | "decision-cycle";

export type AssistantResponseKind =
  | "conversation"
  | "insight"
  | "action_proposal"
  | "state_confirmation"
  | "artifact_preview"
  | "mentor_recommendation_grid"
  | "mentor_intervention"
  | "warning"
  | "error";

export type AssistantResponseLifecycle =
  | "active"
  | "completed"
  | "dismissed"
  | "superseded"
  | "failed";

export type DecisionCycleLifecycle =
  | "not_created"
  | "active"
  | "completed";

export type DecisionCycleStepId =
  | "understand"
  | "decide"
  | "act"
  | "evidence"
  | "review";

export interface SourceReference {
  id: string;
  label: string;
  status: EvidenceSignalStatus;
}

export interface CurrentFocus {
  id: string;
  label?: string;
  bottleneck: string;
  whyItMatters: string;
  nextAction: string;
  sourceStatus: EvidenceSignalStatus;
}

export interface ReadinessDimension {
  id: string;
  label: string;
  score: number;
  explanation: string;
}

export interface ReadinessState {
  currentScore: number;
  previousScore: number;
  delta: number;
  label: string;
  explanation: string;
  supportedBy: string[];
  missingEvidence: string[];
  unlockAction: string;
  breakdown: ReadinessDimension[];
  assessment: ExplainableReadinessAssessment;
}

export interface EvidenceHealthItem {
  id: string;
  label: string;
  status: EvidenceSignalStatus;
  detail: string;
}

export interface MaterialFinding {
  id: "problem" | "solution" | "traction" | "risk" | "customer-proof";
  label: string;
  status: EvidenceSignalStatus;
  detail: string;
}

export interface MaterialAnalysis {
  fileNames: string[];
  summary: string;
  findings: MaterialFinding[];
  interpretationStatus: "pending" | "confirmed" | "disputed";
}

export type MentorDismissReason =
  | "not_now"
  | "not_fit"
  | "already_supported"
  | "try_first";

export interface MentorPreparationItem {
  id: string;
  label: string;
  completed: boolean;
}

export type MentorRecommendation = MentorRecommendationState;

export interface PitchDeckReviewPayload {
  title: string;
  summary: string;
  weaknesses: Array<{
    id: string;
    title: string;
    detail: string;
    sourceLabel: string;
  }>;
  projectedReadiness: {
    presentationOnly: number;
    verifiedEvidenceRange: [number, number];
    label: "Dự kiến · Chưa cập nhật điểm hiện tại";
  };
  actions: string[];
}

export interface NextActionPayload {
  title: string;
  priority: string;
  durationDays: number;
  participantCount: number;
  primaryMetric: string;
  successThreshold: string;
  projectedDelta: [number, number];
}

export interface TractionDiagnosisPayload {
  title: string;
  metrics: Array<{
    id: string;
    label: string;
    value: string;
    assessment: "good" | "weak" | "very_weak";
  }>;
  diagnosis: string;
  capScore: number;
  scaleThresholds: string[];
  projectedTraction: [number, number];
  projectedReadiness: [number, number];
}

export interface ReadinessEvidencePayload {
  title: string;
  treatmentActivation: number;
  controlActivation: number;
  sampleSize: number;
  status: "waiting" | "verified";
  projectedDelta: [number, number];
}

export interface DocumentOnboardingAnalysisPayload {
  readinessScore: number;
  stageLabel: string;
  strongestCriterion: {
    label: string;
    score: number;
  };
  biggestGap: {
    label: string;
    score: number;
  };
  documentCount: number;
  evidenceCount: number;
}

export interface MentorSessionState {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorRole: string;
  goal: string;
  scheduledAt: string;
  displayTime: string;
  status: "booked" | "external";
  preparation: MentorPreparationItem[];
}

export interface DecisionCycleChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface DecisionCycleEvidenceItem {
  id: string;
  label: string;
  status: EvidenceSignalStatus;
  detail: string;
}

export interface DecisionCycleState {
  id: string;
  title: string;
  currentStep: DecisionCycleStepId;
  completedSteps: DecisionCycleStepId[];
  goal: string;
  chosenAction: string;
  expectedOutcome: string;
  primaryMetric: string;
  checklist: DecisionCycleChecklistItem[];
  evidence: DecisionCycleEvidenceItem[];
  evidenceSubmitted: boolean;
  reviewCompleted: boolean;
  reviewSummary?: string;
}

export interface MockAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  origin: "sample" | "local";
  status: "processing" | "ready";
}

export type StructuredResponse =
  | {
      type: "current-focus";
      payload: CurrentFocus;
    }
  | {
      type: "material-analysis";
      payload: MaterialAnalysis;
    }
  | {
      type: "readiness-change";
      payload: ReadinessState;
    }
  | {
      type: "suggested-action";
      payload: {
        id: string;
        title: string;
        rationale: string;
        action: string;
        goal: string;
        expectedOutcome: string;
      };
    }
  | {
      type: "decision-cycle";
      payload: DecisionCycleState;
    }
  | {
      type: "evidence-review";
      payload: {
        title: string;
        summary: string;
        readiness: ReadinessState;
      };
    }
  | {
      type: "mentor-recommendation";
      payload: MentorRecommendationGridPayload | null;
    }
  | {
      type: "mentor-recommendation-grid";
      payload: MentorRecommendationGridPayload;
    }
  | {
      type: "pitch-deck-review";
      payload: PitchDeckReviewPayload;
    }
  | {
      type: "next-action";
      payload: NextActionPayload;
    }
  | {
      type: "traction-diagnosis";
      payload: TractionDiagnosisPayload;
    }
  | {
      type: "readiness-evidence";
      payload: ReadinessEvidencePayload;
    }
  | {
      type: "document-onboarding-analysis";
      payload: DocumentOnboardingAnalysisPayload;
    };

export interface AiWorkspaceMessage {
  id: string;
  role: "founder" | "assistant";
  content: string;
  createdAt: string;
  status: "complete" | "streaming" | "incomplete" | "failed";
  responseKind?: AssistantResponseKind;
  responseLifecycle?: AssistantResponseLifecycle;
  thinkingDurationSeconds?: number;
  structuredResponse?: StructuredResponse;
  sources?: SourceReference[];
  scopedContextSourceIds?: string[];
}

export interface AiWorkspaceState {
  ventureId: VentureId;
  activeScenarioId: AiWorkspaceScenarioId;
  messages: AiWorkspaceMessage[];
  generationStatus: AiGenerationStatus;
  suggestedPrompts: string[];
  attachments: MockAttachment[];
  readiness: ReadinessState;
  currentFocus: CurrentFocus;
  evidenceHealth: EvidenceHealthItem[];
  materialAnalysis?: MaterialAnalysis;
  decisionCycle: DecisionCycleState;
  decisionCycleLifecycle: DecisionCycleLifecycle;
  mentorRecommendation?: MentorRecommendation;
  mentorSession?: MentorSessionState;
  mentorConnectionBriefs: Record<
    string,
    MentorConnectionBrief
  >;
  mentorConnectionOperation: MentorConnectionOperationState;
  mentorConnectionRequest?: MentorConnectionRequest;
  selectedModel: AiModelId;
  view: AiWorkspaceView;
  errorMessage?: string;
  lastRequest?: {
    message: string;
    retryAttempt: number;
  };
}

export interface AiWorkspaceInput {
  message: string;
  ventureId: VentureId;
  conversationHistory: AiWorkspaceMessage[];
  activeScenarioId: AiWorkspaceScenarioId;
  currentState: AiWorkspaceState;
  attachedMaterialIds: string[];
  retryAttempt: number;
  modelId?: AiModelId;
  signal?: AbortSignal;
  contextSummary?: {
    confirmedMemory: string[];
    excludedSourceIds: string[];
  };
  requestScope?: {
    requestId: string;
    conversationId: string;
    stateVersion: number;
    surface: "main" | "panel";
  };
}

export interface AiWorkspaceStatePatch {
  currentFocus?: CurrentFocus;
  readiness?: ReadinessState;
  evidenceHealth?: EvidenceHealthItem[];
  materialAnalysis?: MaterialAnalysis;
  decisionCycle?: DecisionCycleState;
  decisionCycleLifecycle?: DecisionCycleLifecycle;
  mentorRecommendation?: MentorRecommendation;
  mentorSession?: MentorSessionState;
  mentorConnectionRequest?: MentorConnectionRequest;
}

export interface AiWorkspaceResponse {
  intent: AiWorkspaceIntent;
  assistantMessage: string;
  chunks: string[];
  completionStatus?: "complete" | "incomplete";
  structuredResponse?: StructuredResponse;
  responseKind: AssistantResponseKind;
  lifecycle: AssistantResponseLifecycle;
  proposedPatches: AiWorkspaceStatePatch;
  suggestedPrompts: string[];
  sourceReferences: SourceReference[];
  simulatedLatencyMs: number;
}

export interface AiWorkspaceEngine {
  respond(input: AiWorkspaceInput): Promise<AiWorkspaceResponse>;
}

export type AiWorkspaceAction =
  | {
      type: "hydrate";
      state: AiWorkspaceState;
    }
  | {
      type: "user-message";
      message: AiWorkspaceMessage;
      request: AiWorkspaceState["lastRequest"];
    }
  | {
      type: "stream-start";
      message: AiWorkspaceMessage;
    }
  | {
      type: "stream-chunk";
      messageId: string;
      chunk: string;
    }
  | {
      type: "response-complete";
      messageId: string;
      response: AiWorkspaceResponse;
    }
  | {
      type: "response-incomplete";
      messageId: string;
      message: string;
    }
  | {
      type: "response-error";
      message: string;
    }
  | {
      type: "message-send-error";
      messageId: string;
    }
  | {
      type: "retry-start";
      request: NonNullable<AiWorkspaceState["lastRequest"]>;
    }
  | {
      type: "replace-messages";
      messages: AiWorkspaceMessage[];
    }
  | {
      type: "set-suggested-prompts";
      prompts: string[];
    }
  | {
      type: "cancel-request";
    }
  | {
      type: "remove-message";
      messageId: string;
    }
  | {
      type: "set-scenario";
      state: AiWorkspaceState;
    }
  | {
      type: "set-view";
      view: AiWorkspaceView;
    }
  | {
      type: "add-attachment";
      attachment: MockAttachment;
    }
  | {
      type: "attachment-ready";
      attachmentId: string;
    }
  | {
      type: "remove-attachment";
      attachmentId: string;
    }
  | {
      type: "confirm-interpretation";
      status: "confirmed" | "disputed";
    }
  | {
      type: "set-cycle-step";
      step: DecisionCycleStepId;
    }
  | {
      type: "toggle-cycle-task";
      taskId: string;
    }
  | {
      type: "submit-cycle-evidence";
    }
  | {
      type: "complete-cycle-review";
      mentor: MentorRecommendation;
    }
  | {
      type: "confirm-action-proposal";
      messageId: string;
    }
  | {
      type: "book-mentor";
    }
  | {
      type: "defer-mentor";
      reason?: MentorDismissReason;
    }
  | {
      type: "set-mentor-status";
      status: Extract<
        MentorRecommendationState["status"],
        "recommended" | "booked" | "external"
      >;
    }
  | {
      type: "toggle-mentor-preparation";
      itemId: string;
    }
  | {
      type: "refresh-mentor";
      mentor: MentorRecommendation;
    }
  | {
      type: "select-mentor";
      mentorId: string;
    }
  | {
      type: "toggle-save-mentor";
      mentorId: string;
    }
  | {
      type: "set-ai-model";
      modelId: AiModelId;
    }
  | {
      type: "mentor-connection-operation";
      patch: Partial<MentorConnectionOperationState>;
    }
  | {
      type: "set-mentor-connection-brief";
      brief: MentorConnectionBrief;
    }
  | {
      type: "set-mentor-connection-request";
      request: MentorConnectionRequest;
    }
  | {
      type: "verify-readiness-evidence";
      criterionIds: ReadinessCriterionId[];
    }
  | {
      type: "dispute-readiness-contribution";
      contributionId: string;
    }
  | {
      type: "activate-decision-cycle";
    }
  | {
      type: "confirm-readiness-contribution";
      contributionId: string;
    };
