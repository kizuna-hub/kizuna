import { createLongRunDemoState } from "../demo/demo-long-run-data";
import {
  baselineMentorRecommendation,
  createAiWorkspaceScenarioState,
} from "../demo/demo-scenarios";
import type {
  AiWorkspaceMessage,
  AiWorkspaceScenarioId,
  AiWorkspaceState,
} from "../types/ai-workspace.types";
import type { LongRunWorkspaceState } from "../types/long-run-workspace.types";
import type { WorkspaceLayoutState } from "../types/workspace-layout.types";
import type { WorkspaceOnboardingState } from "../types/workspace-onboarding.types";
import {
  createWorkspaceLayoutState,
  restoreWorkspaceLayout,
} from "./workspace-layout-reducer";

export const AI_WORKSPACE_STORAGE_KEY =
  "kizuna-founder-ai-workspace-demo-v1";
export const AI_WORKSPACE_STORAGE_VERSION = 7;

export type PersistedAiWorkspaceSession = Pick<
  AiWorkspaceState,
  | "activeScenarioId"
  | "readiness"
  | "currentFocus"
  | "evidenceHealth"
  | "materialAnalysis"
  | "decisionCycle"
  | "decisionCycleLifecycle"
  | "mentorRecommendation"
  | "mentorSession"
  | "mentorConnectionRequest"
  | "selectedModel"
> & {
  longRun?: LongRunWorkspaceState;
  layout?: WorkspaceLayoutState;
  onboarding?: WorkspaceOnboardingState;
};

export type PersistedAiWorkspaceEnvelope = {
  version: number;
  sessions: Record<string, PersistedAiWorkspaceSession>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export const scenarioIds = new Set<AiWorkspaceScenarioId>([
  "onboarding-case-study",
  "bottleneck",
  "materials",
  "readiness",
  "decision-cycle",
  "mentor",
  "error",
  "long-running",
  "search-pricing",
  "context-conflict",
  "stale-traction",
  "readiness-decrease",
  "safe-switch",
  "search-ask",
  "session-summary",
  "failed-response",
]);

export function parseAiWorkspaceEnvelope(
  rawValue: string | null,
): PersistedAiWorkspaceEnvelope {
  const empty: PersistedAiWorkspaceEnvelope = {
    version: AI_WORKSPACE_STORAGE_VERSION,
    sessions: {},
  };
  if (!rawValue) return empty;

  try {
    const parsed: unknown = JSON.parse(rawValue);
    if (
      !isRecord(parsed) ||
      !isRecord(parsed.sessions) ||
      ![1, 2, 3, 4, 5, 6, AI_WORKSPACE_STORAGE_VERSION].includes(
        parsed.version as number,
      )
    ) {
      return empty;
    }
    return {
      version: AI_WORKSPACE_STORAGE_VERSION,
      sessions: parsed.sessions as Record<
        string,
        PersistedAiWorkspaceSession
      >,
    } satisfies PersistedAiWorkspaceEnvelope;
  } catch {
    return empty;
  }
}

export function toPersistedSession(
  state: AiWorkspaceState,
  longRun: LongRunWorkspaceState,
  layout: WorkspaceLayoutState = createWorkspaceLayoutState(),
  onboarding: WorkspaceOnboardingState = {
    source: "conversation",
    initialAnalysisPaneShown: true,
  },
): PersistedAiWorkspaceSession {
  return {
    activeScenarioId: state.activeScenarioId,
    readiness: state.readiness,
    currentFocus: state.currentFocus,
    evidenceHealth: state.evidenceHealth,
    materialAnalysis: state.materialAnalysis,
    decisionCycle: state.decisionCycle,
    decisionCycleLifecycle: state.decisionCycleLifecycle,
    mentorRecommendation: state.mentorRecommendation,
    mentorSession: state.mentorSession,
    mentorConnectionRequest: state.mentorConnectionRequest,
    selectedModel: state.selectedModel,
    longRun,
    layout,
    onboarding,
  };
}

export function restoreAiSession(
  ventureId: string,
  persisted?: PersistedAiWorkspaceSession,
) {
  if (!persisted || !scenarioIds.has(persisted.activeScenarioId)) {
    return createAiWorkspaceScenarioState(ventureId);
  }
  const initial = createAiWorkspaceScenarioState(
    ventureId,
    persisted.activeScenarioId,
  );
  if (
    !isRecord(persisted.readiness) ||
    !isRecord(persisted.currentFocus) ||
    !Array.isArray(persisted.evidenceHealth) ||
    !isRecord(persisted.decisionCycle)
  ) {
    return initial;
  }
  if (
    persisted.readiness.assessment?.ventureName !==
    "CampusFlow"
  ) {
    return {
      ...initial,
      selectedModel:
        persisted.selectedModel ?? initial.selectedModel,
    };
  }
  return {
    ...initial,
    readiness: {
      ...initial.readiness,
      ...persisted.readiness,
      assessment:
        persisted.readiness.assessment ??
        initial.readiness.assessment,
    },
    currentFocus: {
      ...initial.currentFocus,
      ...persisted.currentFocus,
      id: persisted.currentFocus.id ?? initial.currentFocus.id,
    },
    evidenceHealth: persisted.evidenceHealth,
    materialAnalysis: persisted.materialAnalysis,
    decisionCycle: persisted.decisionCycle,
    decisionCycleLifecycle:
      persisted.decisionCycleLifecycle ??
      initial.decisionCycleLifecycle,
    mentorRecommendation: persisted.mentorRecommendation
      ? {
          ...structuredClone(baselineMentorRecommendation),
          ...persisted.mentorRecommendation,
          preparation:
            persisted.mentorRecommendation.preparation ??
            structuredClone(
              baselineMentorRecommendation.preparation,
            ),
          matchRationale:
            persisted.mentorRecommendation.matchRationale ??
            structuredClone(
              baselineMentorRecommendation.matchRationale,
            ),
          expectedOutcomes:
            persisted.mentorRecommendation.expectedOutcomes ??
            structuredClone(
              baselineMentorRecommendation.expectedOutcomes,
            ),
          alternatives:
            persisted.mentorRecommendation.alternatives ??
            structuredClone(
              baselineMentorRecommendation.alternatives,
            ),
        }
      : undefined,
    mentorSession: persisted.mentorSession,
    mentorConnectionRequest: persisted.mentorConnectionRequest,
    selectedModel:
      persisted.selectedModel ?? initial.selectedModel,
  };
}

function migrateAssistantMessage(
  message: AiWorkspaceMessage,
): AiWorkspaceMessage {
  if (message.role === "founder") return message;
  const responseKind =
    message.responseKind ??
    (message.structuredResponse?.type === "current-focus"
      ? "insight"
      : message.structuredResponse?.type ===
          "mentor-recommendation"
        ? "mentor_intervention"
        : message.structuredResponse?.type ===
            "suggested-action"
          ? "action_proposal"
          : message.structuredResponse
            ? "artifact_preview"
            : "conversation");
  return {
    ...message,
    responseKind,
    responseLifecycle:
      message.responseLifecycle ??
      (message.status === "failed" ||
      message.status === "incomplete"
        ? "failed"
        : "completed"),
  };
}

export function restoreLongRunSession(
  ventureId: string,
  persisted?: PersistedAiWorkspaceSession,
) {
  if (
    persisted &&
    persisted.readiness.assessment?.ventureName !==
    "CampusFlow"
  ) {
    const fresh = createLongRunDemoState(ventureId);
    return {
      ...fresh,
      messagesByConversation: {
        ...fresh.messagesByConversation,
        [fresh.activeConversationId]: [],
      },
    };
  }
  const candidate = persisted?.longRun;
  if (
    !candidate ||
    candidate.ventureId !== ventureId ||
    !Array.isArray(candidate.sessions) ||
    !candidate.activeConversationId ||
    !candidate.messagesByConversation ||
    !Array.isArray(candidate.memory) ||
    !Array.isArray(candidate.timeline) ||
    !Array.isArray(candidate.readinessHistory) ||
    !Array.isArray(candidate.materialVersions)
  ) {
    return createLongRunDemoState(ventureId);
  }
  const activeExists = candidate.sessions.some(
    (session) =>
      session.id === candidate.activeConversationId &&
      !session.isArchived,
  );
  const restored = activeExists
    ? candidate
    : {
        ...candidate,
        activeConversationId:
          candidate.sessions.find(
            (session) => !session.isArchived,
          )?.id ?? candidate.lastConversationId,
      };
  return {
    ...restored,
    attachmentsByConversation:
      restored.attachmentsByConversation ?? {},
    messagesByConversation: Object.fromEntries(
      Object.entries(restored.messagesByConversation).map(
        ([conversationId, messages]) => [
          conversationId,
          messages.map(migrateAssistantMessage),
        ],
      ),
    ),
  };
}

export function restoreWorkspaceLayoutSession(
  persisted?: PersistedAiWorkspaceSession,
) {
  return restoreWorkspaceLayout(persisted?.layout);
}

export function restoreWorkspaceOnboardingSession(
  persisted?: PersistedAiWorkspaceSession,
): WorkspaceOnboardingState {
  const candidate = persisted?.onboarding;
  if (
    !candidate ||
    !["document_analysis", "conversation", "empty"].includes(
      candidate.source,
    )
  ) {
    return {
      source: "conversation",
      initialAnalysisPaneShown: true,
    };
  }
  return {
    source: candidate.source,
    analysisRunId:
      typeof candidate.analysisRunId === "string"
        ? candidate.analysisRunId
        : undefined,
    initialAnalysisPaneShown:
      candidate.initialAnalysisPaneShown === true,
  };
}

export function resolveInitialAnalysisPaneReveal(
  persisted?: PersistedAiWorkspaceSession,
) {
  const onboarding =
    restoreWorkspaceOnboardingSession(persisted);
  const layout = restoreWorkspaceLayoutSession(persisted);
  const shouldReveal =
    onboarding.source === "document_analysis" &&
    !onboarding.initialAnalysisPaneShown;

  return {
    shouldReveal,
    onboarding: shouldReveal
      ? {
          ...onboarding,
          initialAnalysisPaneShown: true,
        }
      : onboarding,
    layout: shouldReveal
      ? {
          ...layout,
          secondaryPaneMode: "analysis" as const,
          analysisTab: "overview" as const,
        }
      : layout,
  };
}
