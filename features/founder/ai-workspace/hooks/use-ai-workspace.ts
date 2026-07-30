"use client";

import React from "react";

import { createContextAssemblyService } from "../services/context-assembly-service";
import { isScopedRequestCurrent } from "../services/scoped-request";
import {
  AI_WORKSPACE_STORAGE_KEY,
  AI_WORKSPACE_STORAGE_VERSION,
  parseAiWorkspaceEnvelope,
  resolveInitialAnalysisPaneReveal,
  restoreAiSession,
  restoreLongRunSession,
  toPersistedSession,
} from "../state/ai-workspace-persistence";
import { aiWorkspaceReducer } from "../state/ai-workspace-reducer";
import {
  getVisibleConversationMessages,
  groupConversationSessions,
  longRunWorkspaceReducer,
} from "../state/long-run-workspace-reducer";
import {
  createWorkspaceLayoutState,
  workspaceLayoutReducer,
} from "../state/workspace-layout-reducer";
import {
  createAiWorkspaceScenarioState,
  getScenarioPrompts,
  sampleMaterials,
} from "../demo/demo-scenarios";
import { createCampusFlowMentorRecommendation } from "../mentor-recommendation/demo/campusflow-mentor-recommendations";
import { selectMentorMatch } from "../mentor-recommendation/state/mentor-recommendation-selectors";
import { createLongRunDemoState } from "../demo/demo-long-run-data";
import {
  createMockAiWorkspaceEngine,
  detectAiWorkspaceIntent,
  getCanonicalQuestionId,
  MockAiWorkspaceError,
} from "../demo/mock-ai-engine";
import { createMockVentureSearchService } from "../demo/mock-venture-search-service";
import {
  campusFlowMentorEvidence,
  campusFlowMentorVentureContext,
} from "../mentor-connection/demo/campusflow-mentor-connection-data";
import {
  createMentorContextFingerprint,
  createMockMentorConnectionBriefGenerator,
} from "../mentor-connection/services/mock-mentor-connection-brief-generator";
import { createMockMentorConnectionRepository } from "../mentor-connection/services/mock-mentor-connection-repository";
import {
  createSharedConnectionBriefSnapshot,
  toFounderConnectionRequest,
} from "../mentor-connection/services/shared-demo-mentor-connection";
import { createBrowserDemoDomainRepository } from "@/features/demo-domain/services/demo-domain-repository";
import type { DemoDomainRepository } from "@/features/demo-domain/types/demo-domain.types";
import { trackProductEvent } from "@/features/demo-domain/services/product-analytics";
import {
  refreshMentorConnectionBrief,
  toggleMentorBriefContext,
  toggleMentorBriefDocument,
  toggleMentorBriefEvidence,
  updateMentorBriefSection,
} from "../mentor-connection/state/mentor-connection-state";
import type {
  MentorConnectionBriefSectionId,
  MentorShareableContext,
} from "../mentor-connection/types/mentor-connection.types";
import type {
  AiWorkspaceMessage,
  AiWorkspaceScenarioId,
  AiWorkspaceState,
  DecisionCycleStepId,
  MentorDismissReason,
  MockAttachment,
} from "../types/ai-workspace.types";
import type {
  ConversationSession,
  LongRunWorkspaceState,
  MaterialVersionStatus,
  PinnedItemReference,
  ScopedAiRequest,
  VentureMemoryStatus,
  VentureSearchFilters,
  VentureSearchResult,
} from "../types/long-run-workspace.types";
import type { WorkspaceOnboardingState } from "../types/workspace-onboarding.types";

const legacyScenarioIds = new Set<AiWorkspaceScenarioId>([
  "onboarding-case-study",
  "bottleneck",
  "materials",
  "readiness",
  "decision-cycle",
  "mentor",
  "error",
  "readiness-decrease",
  "failed-response",
]);

function wait(durationMs: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new Error("aborted"));
      return;
    }
    const onAbort = () => {
      window.clearTimeout(timeout);
      reject(new Error("aborted"));
    };
    const timeout = window.setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, durationMs);
    signal?.addEventListener("abort", onAbort, {
      once: true,
    });
  });
}

const THINKING_DURATION_MS = 3_000;
const THINKING_DURATION_SECONDS = 3;

async function waitForMinimumThinking(
  startedAt: number,
  signal?: AbortSignal,
) {
  const elapsed = window.performance.now() - startedAt;
  const remaining = Math.max(
    0,
    THINKING_DURATION_MS - elapsed,
  );
  if (remaining > 0) {
    await wait(remaining, signal);
  }
}

function createScenarioLongRunState(
  ventureId: string,
  scenarioId: AiWorkspaceScenarioId,
  aiState: AiWorkspaceState,
) {
  const longRun = createLongRunDemoState(ventureId);
  if (!legacyScenarioIds.has(scenarioId)) return longRun;
  return {
    ...longRun,
    messagesByConversation: {
      ...longRun.messagesByConversation,
      [longRun.activeConversationId]: aiState.messages,
    },
  };
}

function readinessDecreaseState(
  longRun: LongRunWorkspaceState,
  scenarioId: AiWorkspaceScenarioId,
) {
  if (scenarioId !== "readiness-decrease") return longRun;
  return {
    ...longRun,
    timeline: [
      {
        id: "timeline-readiness-decrease",
        ventureId: longRun.ventureId,
        type: "readiness_changed" as const,
        title: "Mức độ sẵn sàng giảm từ 68 xuống 61",
        createdAt: "2026-07-27T08:00:00.000Z",
        actor: "Kizuna",
        reason:
          "Cohort thứ hai bị loại vì định nghĩa activation không nhất quán.",
        sourceIds: ["evidence-day-seven-retention"],
        readinessChangeId: "readiness-68-61",
      },
      ...longRun.timeline,
    ],
    readinessHistory: [
      {
        id: "readiness-68-61",
        ventureId: longRun.ventureId,
        previousScore: 68,
        nextScore: 61,
        dimensionChanges: [
          {
            id: "customer-evidence",
            label: "Bằng chứng khách hàng",
            previousScore: 66,
            nextScore: 52,
            reason:
              "Cohort thứ hai dùng định nghĩa activation không nhất quán.",
          },
        ],
        evidenceAddedIds: [],
        evidenceRemovedIds: ["evidence-day-seven-retention"],
        reason:
          "Một bằng chứng cohort bị vô hiệu hóa; lịch sử điểm vẫn được giữ để đối chiếu.",
        rubricVersion: "readiness-v1.2",
        createdAt: "2026-07-27T08:00:00.000Z",
      },
      ...longRun.readinessHistory,
    ],
  };
}

export function useAiWorkspace(ventureId: string) {
  const [state, dispatch] = React.useReducer(
    aiWorkspaceReducer,
    ventureId,
    (id) => createAiWorkspaceScenarioState(id),
  );
  const [longRun, dispatchLongRun] = React.useReducer(
    longRunWorkspaceReducer,
    ventureId,
    createLongRunDemoState,
  );
  const [layout, dispatchLayout] = React.useReducer(
    workspaceLayoutReducer,
    undefined,
    createWorkspaceLayoutState,
  );
  const [onboarding, setOnboarding] =
    React.useState<WorkspaceOnboardingState>({
      source: "conversation",
      initialAnalysisPaneShown: true,
    });
  const [panelGenerating, setPanelGenerating] =
    React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);
  const [selectedContextSourceIds, setSelectedContextSourceIds] =
    React.useState<string[]>([]);
  const stateRef = React.useRef(state);
  const longRunRef = React.useRef(longRun);
  const messageSequence = React.useRef(0);
  const requestSequence = React.useRef(0);
  const abortControllerRef =
    React.useRef<AbortController | null>(null);
  const panelAbortControllerRef =
    React.useRef<AbortController | null>(null);
  const mentorConnectionGenerationRef =
    React.useRef<Promise<void> | null>(null);
  const mentorConnectionSendRef =
    React.useRef<Promise<void> | null>(null);
  const sharedDemoRepositoryRef =
    React.useRef<DemoDomainRepository | null>(null);
  const mentorTimestampSequenceRef = React.useRef(0);
  const conversationCreationRef = React.useRef<
    Partial<Record<"main" | "panel", { id: string; at: number }>>
  >({});
  const activeRequestRef = React.useRef<ScopedAiRequest>({
    requestId: "idle",
    ventureId,
    conversationId: longRun.activeConversationId,
    stateVersion: longRun.stateVersion,
    surface: "main",
  });
  const engine = React.useMemo(
    () => createMockAiWorkspaceEngine(),
    [],
  );
  const searchService = React.useMemo(
    () =>
      createMockVentureSearchService(() => longRunRef.current),
    [],
  );
  const contextService = React.useMemo(
    () =>
      createContextAssemblyService(() => longRunRef.current),
    [],
  );
  const mentorConnectionGenerator = React.useMemo(
    () => createMockMentorConnectionBriefGenerator(),
    [],
  );
  const mentorConnectionRepository = React.useMemo(
    () =>
      createMockMentorConnectionRepository({
        getDraft: (_ventureId, mentorId) =>
          stateRef.current.mentorConnectionBriefs[mentorId],
        getRequest: (requestedVentureId, mentorId) => {
          const request =
            stateRef.current.mentorConnectionRequest;
          return request?.ventureId === requestedVentureId &&
            request.mentorId === mentorId
            ? request
            : undefined;
        },
      }),
    [],
  );

  React.useEffect(() => {
    stateRef.current = state;
  }, [state]);

  React.useEffect(() => {
    const repository = sharedDemoRepositoryRef.current;
    if (!repository) return;
    const local = state.mentorConnectionRequest;
    const shared = repository
      .getSnapshot()
      .connectionRequests.find(
        (request) => request.ventureId === ventureId,
      );
    if (!shared) return;
    const brief =
      local?.brief ??
      state.mentorConnectionBriefs[shared.mentorId];
    if (!brief) return;
    const next = toFounderConnectionRequest(
      shared,
      brief,
    );
    if (
      next.status === local?.status &&
      next.acceptance?.id === local?.acceptance?.id
    ) {
      return;
    }
    dispatch({
      type: "set-mentor-connection-request",
      request: next,
    });
  }, [
    state.mentorConnectionBriefs,
    state.mentorConnectionRequest,
    ventureId,
  ]);

  React.useEffect(() => {
    const repository = createBrowserDemoDomainRepository();
    sharedDemoRepositoryRef.current = repository;
    const syncRequest = () => {
      const local = stateRef.current.mentorConnectionRequest;
      const shared = repository
        .getSnapshot()
        .connectionRequests.find(
          (request) => request.ventureId === ventureId,
        );
      if (!shared) return;
      const brief =
        local?.brief ??
        stateRef.current.mentorConnectionBriefs[shared.mentorId];
      if (!brief) return;
      const next = toFounderConnectionRequest(
        shared,
        brief,
      );
      if (
        next.status === local?.status &&
        next.acceptance?.id === local?.acceptance?.id
      ) {
        return;
      }
      dispatch({
        type: "set-mentor-connection-request",
        request: next,
      });
    };
    syncRequest();
    const unsubscribe = repository.subscribe(syncRequest);
    return () => {
      unsubscribe();
      repository.destroy();
      if (sharedDemoRepositoryRef.current === repository) {
        sharedDemoRepositoryRef.current = null;
      }
    };
  }, [ventureId]);

  React.useEffect(() => {
    longRunRef.current = longRun;
  }, [longRun]);

  React.useEffect(() => {
    const active = activeRequestRef.current;
    if (
      !active.requestId.startsWith("request-") ||
      active.ventureId !== ventureId ||
      active.stateVersion === longRun.stateVersion
    ) {
      return;
    }
    requestSequence.current += 1;
    activeRequestRef.current = {
      ...active,
      requestId: `cancelled-${requestSequence.current}`,
      stateVersion: longRun.stateVersion,
    };
    dispatch({ type: "cancel-request" });
  }, [longRun.stateVersion, ventureId]);

  React.useEffect(() => {
    setHydrated(false);
    const envelope = parseAiWorkspaceEnvelope(
      window.localStorage.getItem(AI_WORKSPACE_STORAGE_KEY),
    );
    const persisted = envelope.sessions[ventureId];
    const restoredAi = restoreAiSession(ventureId, persisted);
    const restoredLongRun = persisted
      ? restoreLongRunSession(ventureId, persisted)
      : createScenarioLongRunState(
          ventureId,
          restoredAi.activeScenarioId,
          restoredAi,
        );
    const presentation =
      resolveInitialAnalysisPaneReveal(persisted);
    const activeMessages =
      restoredLongRun.messagesByConversation[
        restoredLongRun.activeConversationId
      ] ?? restoredAi.messages;
    dispatch({
      type: "hydrate",
      state: { ...restoredAi, messages: activeMessages },
    });
    dispatchLongRun({
      type: "hydrate",
      state: restoredLongRun,
    });
    dispatchLayout({
      type: "hydrate",
      state: presentation.layout,
    });
    setOnboarding(presentation.onboarding);
    activeRequestRef.current = {
      requestId: "idle",
      ventureId,
      conversationId: restoredLongRun.activeConversationId,
      stateVersion: restoredLongRun.stateVersion,
      surface: "main",
    };
    setSelectedContextSourceIds([]);
    setHydrated(true);
    trackProductEvent("workspace_opened", { ventureId });
  }, [ventureId]);

  React.useEffect(() => {
    if (!hydrated || state.ventureId !== ventureId) return;
    dispatchLongRun({
      type: "sync-messages",
      conversationId: longRun.activeConversationId,
      messages: state.messages,
    });
  }, [
    hydrated,
    longRun.activeConversationId,
    state.messages,
    state.ventureId,
    ventureId,
  ]);

  React.useEffect(() => {
    if (
      !hydrated ||
      state.ventureId !== ventureId ||
      longRun.ventureId !== ventureId
    ) {
      return;
    }
    const envelope = parseAiWorkspaceEnvelope(
      window.localStorage.getItem(AI_WORKSPACE_STORAGE_KEY),
    );
    const snapshot: LongRunWorkspaceState = {
      ...longRun,
      messagesByConversation: {
        ...longRun.messagesByConversation,
        [longRun.activeConversationId]: state.messages,
      },
    };
    envelope.sessions[ventureId] = toPersistedSession(
      state,
      snapshot,
      layout,
      onboarding,
    );
    window.localStorage.setItem(
      AI_WORKSPACE_STORAGE_KEY,
      JSON.stringify(envelope),
    );
  }, [
    hydrated,
    layout,
    longRun,
    onboarding,
    state,
    ventureId,
  ]);

  React.useEffect(
    () => () => {
      abortControllerRef.current?.abort();
      panelAbortControllerRef.current?.abort();
      requestSequence.current += 1;
      activeRequestRef.current = {
        ...activeRequestRef.current,
        requestId: `cancelled-${requestSequence.current}`,
      };
    },
    [],
  );

  const nextMessageId = React.useCallback((role: string) => {
    messageSequence.current += 1;
    return `${role}-${messageSequence.current}`;
  }, []);

  const invalidateActiveRequest = React.useCallback(() => {
    abortControllerRef.current?.abort();
    requestSequence.current += 1;
    activeRequestRef.current = {
      ...activeRequestRef.current,
      requestId: `cancelled-${requestSequence.current}`,
    };
    dispatch({ type: "cancel-request" });
  }, []);

  const nextMentorTimestamp = React.useCallback(() => {
    mentorTimestampSequenceRef.current += 1;
    const minute = 16 + mentorTimestampSequenceRef.current;
    return `2026-07-29T03:${String(minute).padStart(2, "0")}:00.000Z`;
  }, []);

  const buildMentorConnectionInput = React.useCallback(
    (clarification?: string, mentorId?: string) => {
      const current = stateRef.current;
      const mentor = selectMentorMatch(
        current.mentorRecommendation,
        mentorId ??
          current.mentorConnectionOperation.activeMentorId,
      );
      if (!mentor) return null;
      const currentSummary = longRunRef.current.summaries.find(
        (summary) =>
          summary.conversationId ===
          longRunRef.current.activeConversationId,
      );
      return {
        ventureId,
        mentor,
        canonicalVentureContext:
          campusFlowMentorVentureContext,
        currentFocus: current.currentFocus,
        readiness: current.readiness,
        activeDecisionCycle:
          current.decisionCycleLifecycle === "active"
            ? current.decisionCycle
            : undefined,
        verifiedEvidence: structuredClone(
          campusFlowMentorEvidence,
        ),
        relevantConversationSummary: currentSummary?.sections
          .flatMap((section) => section.items)
          .slice(0, 4)
          .join(" "),
        clarification,
      };
    },
    [ventureId],
  );

  const generateMentorConnectionBrief =
    React.useCallback(
      async ({
        clarification,
        preserveExisting,
        mentorId,
      }: {
        clarification?: string;
        preserveExisting?: boolean;
        mentorId?: string;
      } = {}) => {
        const input =
          buildMentorConnectionInput(
            clarification,
            mentorId,
          );
        if (!input) return;
        dispatch({
          type: "mentor-connection-operation",
          patch: {
            activeMentorId: input.mentor.mentorId,
            generationStatus: "working",
            errorMessage: undefined,
            clarification: undefined,
          },
        });
        try {
          const result =
            await mentorConnectionGenerator.generate(input);
          if (
            result.missingRequiredContext.includes(
              "connection_goal",
            ) &&
            !clarification
          ) {
            dispatch({
              type: "mentor-connection-operation",
              patch: {
                generationStatus: "idle",
                clarification: {
                  kind: "goal",
                  prompt:
                    "Sau phiên này, bạn muốn chốt điều gì nhất?",
                },
              },
            });
            return;
          }
          if (
            result.missingRequiredContext.includes(
              "venture_summary",
            ) &&
            !clarification
          ) {
            dispatch({
              type: "mentor-connection-operation",
              patch: {
                generationStatus: "idle",
                clarification: {
                  kind: "empty_venture",
                  prompt:
                    "Mentor cần giúp bạn về việc gì? Mô tả trong một hoặc hai câu.",
                },
              },
            });
            return;
          }
          const existing =
            stateRef.current.mentorConnectionBriefs[
              input.mentor.mentorId
            ];
          const brief =
            preserveExisting && existing
              ? refreshMentorConnectionBrief(
                  existing,
                  result.brief,
                )
              : result.brief;
          dispatch({
            type: "set-mentor-connection-brief",
            brief,
          });
          dispatch({
            type: "mentor-connection-operation",
            patch: {
              generationStatus: "success",
              clarification: undefined,
            },
          });
        } catch {
          dispatch({
            type: "mentor-connection-operation",
            patch: {
              generationStatus: "error",
              errorMessage:
                "Kizuna chưa thể chuẩn bị yêu cầu kết nối.",
            },
          });
        }
      },
      [buildMentorConnectionInput, mentorConnectionGenerator],
    );

  const openMentorConnection = React.useCallback(
    (mentorId?: string) => {
      const mentor = selectMentorMatch(
        stateRef.current.mentorRecommendation,
        mentorId,
      );
      if (!mentor) return;
      dispatch({
        type: "select-mentor",
        mentorId: mentor.mentorId,
      });
      dispatchLayout({
        type: "open-mentor-connection",
        mentorId: mentor.mentorId,
      });
      dispatch({
        type: "mentor-connection-operation",
        patch: {
          activeMentorId: mentor.mentorId,
          errorMessage: undefined,
        },
      });
      trackProductEvent("connection_brief_opened", {
        ventureId,
        mentorId: mentor.mentorId,
      });
      if (
        stateRef.current.mentorConnectionBriefs[
        mentor.mentorId
        ] ||
        stateRef.current.mentorConnectionRequest?.mentorId ===
          mentor.mentorId
      ) {
        return;
      }
      if (mentorConnectionGenerationRef.current) return;
      const operation = generateMentorConnectionBrief({
        mentorId: mentor.mentorId,
      });
      mentorConnectionGenerationRef.current = operation;
      void operation.finally(() => {
        mentorConnectionGenerationRef.current = null;
      });
    },
    [generateMentorConnectionBrief],
  );

  const executeResponse = React.useCallback(
    async (
      messageText: string,
      retryAttempt: number,
      appendFounderMessage: boolean,
    ) => {
      const currentLongRun = longRunRef.current;
      const currentAiState = stateRef.current;
      const conversationId =
        currentLongRun.activeConversationId;
      requestSequence.current += 1;
      const scope: ScopedAiRequest = {
        requestId: `request-${requestSequence.current}`,
        ventureId,
        conversationId,
        stateVersion: currentLongRun.stateVersion,
        surface: "main",
      };
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      activeRequestRef.current = scope;
      const createdAt = new Date().toISOString();
      const thinkingStartedAt = window.performance.now();
      const request = {
        message: messageText,
        retryAttempt,
      };
      const founderMessage: AiWorkspaceMessage = {
        id: nextMessageId("founder"),
        role: "founder",
        content: messageText,
        createdAt,
        status: "complete",
        scopedContextSourceIds:
          selectedContextSourceIds.length > 0
            ? [...selectedContextSourceIds]
            : undefined,
      };

      if (appendFounderMessage) {
        const intent = detectAiWorkspaceIntent(messageText);
        sharedDemoRepositoryRef.current?.recordCanonicalQuestion(
          ventureId,
          getCanonicalQuestionId(messageText),
        );
        trackProductEvent("founder_question_asked", {
          ventureId,
          intent,
        });
        if (
          intent === "explain-readiness" ||
          intent === "explain-readiness-dimension"
        ) {
          trackProductEvent("readiness_question_asked", {
            ventureId,
            intent,
          });
        }
        dispatch({
          type: "user-message",
          message: founderMessage,
          request,
        });
      } else {
        dispatch({ type: "retry-start", request });
      }

      const isCurrent = () =>
        isScopedRequestCurrent(
          scope,
          activeRequestRef.current,
        );

      try {
        const assembledContext = contextService.buildContext({
          ventureId,
          conversationId,
          query: messageText,
          selectedSourceIds: selectedContextSourceIds,
        });
        const response = await engine.respond({
          message: messageText,
          ventureId,
          conversationHistory: appendFounderMessage
            ? [...currentAiState.messages, founderMessage]
            : currentAiState.messages,
          activeScenarioId: currentAiState.activeScenarioId,
          currentState: currentAiState,
          attachedMaterialIds: currentAiState.attachments.map(
            (attachment) => attachment.id,
          ),
          retryAttempt,
          modelId: currentAiState.selectedModel,
          signal: abortController.signal,
          contextSummary: {
            confirmedMemory:
              assembledContext.confirmedMemory.map(
                (item) => `${item.title}: ${item.summary}`,
              ),
            excludedSourceIds:
              assembledContext.excludedItems.map(
                (item) => item.id,
              ),
          },
          requestScope: {
            requestId: scope.requestId,
            conversationId,
            stateVersion: scope.stateVersion,
            surface: "main",
          },
        });
        if (!isCurrent()) return;
        await waitForMinimumThinking(
          thinkingStartedAt,
          abortController.signal,
        );
        if (!isCurrent()) return;

        const assistantId = nextMessageId("assistant");
        dispatch({
          type: "stream-start",
          message: {
            id: assistantId,
            role: "assistant",
            content: "",
            createdAt: new Date().toISOString(),
            status: "streaming",
            responseKind: response.responseKind,
            responseLifecycle: response.lifecycle,
            thinkingDurationSeconds:
              THINKING_DURATION_SECONDS,
          },
        });

        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        for (const chunk of response.chunks) {
          if (!isCurrent()) return;
          dispatch({
            type: "stream-chunk",
            messageId: assistantId,
            chunk,
          });
          if (!reducedMotion) {
            await wait(150, abortController.signal);
          }
        }

        if (!isCurrent()) return;
        if (response.completionStatus === "incomplete") {
          dispatch({
            type: "response-incomplete",
            messageId: assistantId,
            message:
              "Kizuna chưa thể hoàn tất phần còn lại. Nội dung đã nhận vẫn được giữ nguyên và chưa có thay đổi nào được áp dụng vào venture.",
          });
          activeRequestRef.current = {
            ...scope,
            requestId: "idle",
          };
          return;
        }
        dispatch({
          type: "response-complete",
          messageId: assistantId,
          response,
        });
        if (response.intent === "recommend-mentor") {
          trackProductEvent("mentor_recommendations_viewed", {
            ventureId,
          });
        }
        activeRequestRef.current = {
          ...scope,
          requestId: "idle",
        };

        if (
          response.proposedPatches.readiness &&
          response.proposedPatches.readiness.currentScore !==
            currentAiState.readiness.currentScore
        ) {
          const readiness =
            response.proposedPatches.readiness;
          dispatchLongRun({
            type: "append-readiness-change",
            change: {
              id: `readiness-${scope.requestId}`,
              ventureId,
              previousScore: readiness.previousScore,
              nextScore: readiness.currentScore,
              dimensionChanges: readiness.breakdown.map(
                (dimension) => ({
                  id: dimension.id,
                  label: dimension.label,
                  previousScore:
                    currentAiState.readiness.breakdown.find(
                      (item) => item.id === dimension.id,
                    )?.score ?? dimension.score,
                  nextScore: dimension.score,
                  reason: dimension.explanation,
                }),
              ),
              evidenceAddedIds:
                response.proposedPatches.evidenceHealth
                  ?.filter((item) => item.status === "verified")
                  .map((item) => item.id) ?? [],
              evidenceRemovedIds: [],
              reason: readiness.explanation,
              rubricVersion: "readiness-v1.2",
              createdAt: new Date().toISOString(),
            },
          });
        }
        setSelectedContextSourceIds([]);
      } catch (error) {
        if (!isCurrent()) return;
        try {
          await waitForMinimumThinking(
            thinkingStartedAt,
            abortController.signal,
          );
        } catch {
          return;
        }
        if (!isCurrent()) return;
        activeRequestRef.current = {
          ...scope,
          requestId: "idle",
        };
        dispatch({
          type: "response-error",
          message:
            error instanceof MockAiWorkspaceError
              ? "Kizuna chưa thể hoàn tất phân tích. Các tài liệu và tin nhắn của bạn vẫn được giữ nguyên."
              : "Kizuna chưa thể phản hồi lúc này. Hãy thử lại.",
        });
      }
    },
    [
      engine,
      contextService,
      nextMessageId,
      selectedContextSourceIds,
      ventureId,
    ],
  );

  const sendMessage = React.useCallback(
    async (messageText: string) => {
      const current = stateRef.current;
      const trimmed = messageText.trim();
      if (
        !trimmed ||
        current.generationStatus === "typing" ||
        current.generationStatus === "streaming"
      ) {
        return;
      }
      dispatchLongRun({
        type: "set-draft",
        conversationId:
          longRunRef.current.activeConversationId,
        draft: "",
      });
      if (
        trimmed
          .toLocaleLowerCase("vi")
          .includes("lỗi gửi tin nhắn")
      ) {
        const founderMessage: AiWorkspaceMessage = {
          id: nextMessageId("founder"),
          role: "founder",
          content: trimmed,
          createdAt: new Date().toISOString(),
          status: "complete",
          scopedContextSourceIds:
            selectedContextSourceIds.length > 0
              ? [...selectedContextSourceIds]
              : undefined,
        };
        dispatch({
          type: "user-message",
          message: founderMessage,
          request: {
            message: trimmed,
            retryAttempt: 0,
          },
        });
        dispatch({
          type: "message-send-error",
          messageId: founderMessage.id,
        });
        return;
      }
      await executeResponse(trimmed, 0, true);
    },
    [
      executeResponse,
      nextMessageId,
      selectedContextSourceIds,
    ],
  );

  const retryLastRequest = React.useCallback(async () => {
    const lastRequest = stateRef.current.lastRequest;
    if (!lastRequest) return;
    await executeResponse(
      lastRequest.message,
      lastRequest.retryAttempt + 1,
      false,
    );
  }, [executeResponse]);

  const editFailedMessage = React.useCallback(
    (messageId: string) => {
      const message = stateRef.current.messages.find(
        (item) =>
          item.id === messageId && item.status === "failed",
      );
      if (!message) return;
      dispatch({ type: "remove-message", messageId });
      dispatchLongRun({
        type: "set-draft",
        conversationId:
          longRunRef.current.activeConversationId,
        draft: message.content,
      });
    },
    [],
  );

  const deleteFailedMessage = React.useCallback(
    (messageId: string) => {
      dispatch({ type: "remove-message", messageId });
    },
    [],
  );

  const setScenario = React.useCallback(
    (scenarioId: AiWorkspaceScenarioId) => {
      invalidateActiveRequest();
      const aiState = createAiWorkspaceScenarioState(
        ventureId,
        scenarioId,
      );
      const scenarioLongRun = readinessDecreaseState(
        createScenarioLongRunState(
          ventureId,
          scenarioId,
          aiState,
        ),
        scenarioId,
      );
      const messages =
        scenarioLongRun.messagesByConversation[
          scenarioLongRun.activeConversationId
        ] ?? aiState.messages;
      dispatch({
        type: "set-scenario",
        state: { ...aiState, messages },
      });
      dispatchLongRun({
        type: "hydrate",
        state: scenarioLongRun,
      });
      setSelectedContextSourceIds([]);
    },
    [invalidateActiveRequest, ventureId],
  );

  const addAttachment = React.useCallback(
    (attachment: MockAttachment) => {
      dispatch({ type: "add-attachment", attachment });
      window.setTimeout(
        () =>
          dispatch({
            type: "attachment-ready",
            attachmentId: attachment.id,
          }),
        550,
      );
    },
    [],
  );

  const addSampleAttachment = React.useCallback(
    (sampleId: string) => {
      const current = stateRef.current;
      if (
        current.attachments.length >= 3 ||
        current.attachments.some(
          (attachment) => attachment.id === sampleId,
        )
      ) {
        return;
      }
      const material = sampleMaterials.find(
        (sample) => sample.id === sampleId,
      );
      if (!material) return;
      addAttachment({
        ...material,
        origin: "sample",
        status: "processing",
      });
    },
    [addAttachment],
  );

  const addLocalFiles = React.useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const current = stateRef.current;
      const remainingSlots = Math.max(
        0,
        3 - current.attachments.length,
      );
      Array.from(files)
        .slice(0, remainingSlots)
        .forEach((file, index) => {
          addAttachment({
            id: `local-${Date.now()}-${index}`,
            name: file.name,
            size: file.size,
            type: file.type,
            origin: "local",
            status: "processing",
          });
        });
    },
    [addAttachment],
  );

  const switchConversation = React.useCallback(
    (conversationId: string) => {
      const current = longRunRef.current;
      if (
        conversationId === current.activeConversationId ||
        !current.sessions.some(
          (session) =>
            session.id === conversationId &&
            !session.isArchived,
        )
      ) {
        return;
      }
      invalidateActiveRequest();
      const messages =
        current.messagesByConversation[conversationId] ?? [];
      dispatchLongRun({
        type: "select-conversation",
        conversationId,
      });
      dispatch({ type: "replace-messages", messages });
      setSelectedContextSourceIds([]);
    },
    [invalidateActiveRequest],
  );

  const createConversation = React.useCallback(
    (
      title = "Cuộc trò chuyện mới",
      options: { activate?: boolean } = {},
    ) => {
      const surface =
        options.activate === false ? "panel" : "main";
      const now = Date.now();
      const recent = conversationCreationRef.current[surface];
      if (recent && now - recent.at < 350) {
        return recent.id;
      }
      if (options.activate !== false) {
        invalidateActiveRequest();
      }
      const id = `conversation-${now}-${messageSequence.current + 1}`;
      conversationCreationRef.current[surface] = { id, at: now };
      const session: ConversationSession = {
        id,
        ventureId,
        title,
        category: "general",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPinned: false,
        isArchived: false,
        summaryStatus: "none",
      };
      const messages: AiWorkspaceMessage[] = [
        {
          id: `assistant-${id}`,
          role: "assistant",
          content:
            "Cuộc trò chuyện mới đã sẵn sàng. Kizuna vẫn dùng context đã xác nhận của CampusFlow mà không sao chép toàn bộ lịch sử chat.",
          createdAt: new Date().toISOString(),
          status: "complete",
        },
      ];
      dispatchLongRun({
        type: "create-conversation",
        session,
        messages,
        activate: options.activate,
      });
      if (options.activate !== false) {
        dispatch({ type: "replace-messages", messages });
        dispatch({
          type: "set-suggested-prompts",
          prompts: getScenarioPrompts("onboarding-case-study"),
        });
        setSelectedContextSourceIds([]);
      }
      return id;
    },
    [invalidateActiveRequest, ventureId],
  );

  const openConversationInPanel = React.useCallback(
    (conversationId: string) => {
      const exists = longRunRef.current.sessions.some(
        (session) =>
          session.id === conversationId && !session.isArchived,
      );
      if (!exists) return;
      if (
        layout.panelConversationId &&
        layout.panelConversationId !== conversationId
      ) {
        panelAbortControllerRef.current?.abort();
        setPanelGenerating(false);
      }
      dispatchLayout({
        type: "open-panel-chat",
        conversationId,
      });
    },
    [layout.panelConversationId],
  );

  const openSplitChat = React.useCallback(() => {
    const currentPanelId =
      layout.panelConversationId &&
      longRunRef.current.sessions.some(
        (session) =>
          session.id === layout.panelConversationId &&
          !session.isArchived,
      )
        ? layout.panelConversationId
        : createConversation("Chat song song", {
            activate: false,
          });
    if (!currentPanelId) return;
    dispatchLayout({
      type: "open-panel-chat",
      conversationId: currentPanelId,
    });
  }, [createConversation, layout.panelConversationId]);

  const setSecondaryPaneWidth = React.useCallback(
    (width: number) => {
      dispatchLayout({
        type: "set-secondary-pane-width",
        width,
      });
    },
    [],
  );

  const sendPanelMessage = React.useCallback(
    async (messageText: string) => {
      const conversationId = layout.panelConversationId;
      const trimmed = messageText.trim();
      if (!conversationId || !trimmed || panelGenerating) return;

      const currentLongRun = longRunRef.current;
      const currentState = stateRef.current;
      const existingMessages =
        currentLongRun.messagesByConversation[conversationId] ?? [];
      const founderMessage: AiWorkspaceMessage = {
        id: nextMessageId("panel-founder"),
        role: "founder",
        content: trimmed,
        createdAt: new Date().toISOString(),
        status: "complete",
      };
      const controller = new AbortController();
      const thinkingStartedAt = window.performance.now();
      panelAbortControllerRef.current?.abort();
      panelAbortControllerRef.current = controller;
      setPanelGenerating(true);
      dispatchLongRun({
        type: "set-draft",
        conversationId,
        draft: "",
      });
      dispatchLongRun({
        type: "sync-messages",
        conversationId,
        messages: [...existingMessages, founderMessage],
      });

      try {
        const response = await engine.respond({
          message: trimmed,
          ventureId,
          conversationHistory: [
            ...existingMessages,
            founderMessage,
          ],
          activeScenarioId: currentState.activeScenarioId,
          currentState,
          attachedMaterialIds: (
            currentLongRun.attachmentsByConversation[
              conversationId
            ] ?? []
          ).map((attachment) => attachment.id),
          retryAttempt: 0,
          modelId: currentState.selectedModel,
          signal: controller.signal,
          requestScope: {
            requestId: `panel-${Date.now()}`,
            conversationId,
            stateVersion: currentLongRun.stateVersion,
            surface: "panel",
          },
        });
        await waitForMinimumThinking(
          thinkingStartedAt,
          controller.signal,
        );
        if (controller.signal.aborted) return;
        const assistantMessage: AiWorkspaceMessage = {
          id: nextMessageId("panel-assistant"),
          role: "assistant",
          content: response.assistantMessage,
          createdAt: new Date().toISOString(),
          status: "complete",
          responseKind: "conversation",
          responseLifecycle: response.lifecycle,
          sources: response.sourceReferences,
          thinkingDurationSeconds: THINKING_DURATION_SECONDS,
        };
        dispatchLongRun({
          type: "sync-messages",
          conversationId,
          messages: [
            ...existingMessages,
            founderMessage,
            assistantMessage,
          ],
        });
      } catch {
        if (!controller.signal.aborted) {
          dispatchLongRun({
            type: "sync-messages",
            conversationId,
            messages: [
              ...existingMessages,
              founderMessage,
              {
                id: nextMessageId("panel-assistant"),
                role: "assistant",
                content:
                  "Kizuna chưa thể hoàn tất phản hồi trong panel này. Bản nháp và cuộc trò chuyện chính vẫn được giữ nguyên.",
                createdAt: new Date().toISOString(),
                status: "failed",
              },
            ],
          });
        }
      } finally {
        if (!controller.signal.aborted) setPanelGenerating(false);
      }
    },
    [
      engine,
      layout.panelConversationId,
      nextMessageId,
      panelGenerating,
      ventureId,
    ],
  );

  const archiveConversation = React.useCallback(
    (conversationId: string) => {
      const current = longRunRef.current;
      const next = current.sessions.find(
        (session) =>
          session.id !== conversationId &&
          !session.isArchived,
      );
      invalidateActiveRequest();
      dispatchLongRun({
        type: "archive-conversation",
        conversationId,
      });
      if (
        current.activeConversationId === conversationId &&
        next
      ) {
        dispatch({
          type: "replace-messages",
          messages:
            current.messagesByConversation[next.id] ?? [],
        });
      }
    },
    [invalidateActiveRequest],
  );

  const deleteConversation = React.useCallback(
    (conversationId: string) => {
      const current = longRunRef.current;
      if (
        !current.sessions.some(
          (session) => session.id === conversationId,
        )
      ) {
        return;
      }

      const next = current.sessions.find(
        (session) =>
          session.id !== conversationId &&
          !session.isArchived,
      );

      invalidateActiveRequest();

      if (layout.panelConversationId === conversationId) {
        panelAbortControllerRef.current?.abort();
        setPanelGenerating(false);
        dispatchLayout({ type: "close-secondary-pane" });
      }

      if (!next) {
        createConversation();
      }

      dispatchLongRun({
        type: "delete-conversation",
        conversationId,
      });

      if (current.activeConversationId === conversationId && next) {
        dispatch({
          type: "replace-messages",
          messages:
            current.messagesByConversation[next.id] ?? [],
        });
        setSelectedContextSourceIds([]);
      }
    },
    [
      createConversation,
      invalidateActiveRequest,
      layout.panelConversationId,
    ],
  );

  const resetDemo = React.useCallback(() => {
    invalidateActiveRequest();
    const envelope = parseAiWorkspaceEnvelope(
      window.localStorage.getItem(AI_WORKSPACE_STORAGE_KEY),
    );
    delete envelope.sessions[ventureId];
    window.localStorage.setItem(
      AI_WORKSPACE_STORAGE_KEY,
      JSON.stringify(envelope),
    );
    const aiState = createAiWorkspaceScenarioState(ventureId);
    const longRunState = createScenarioLongRunState(
      ventureId,
      aiState.activeScenarioId,
      aiState,
    );
    dispatch({
      type: "hydrate",
      state: {
        ...aiState,
        messages:
          longRunState.messagesByConversation[
            longRunState.activeConversationId
          ],
      },
    });
    dispatchLongRun({
      type: "hydrate",
      state: longRunState,
    });
    setSelectedContextSourceIds([]);
  }, [invalidateActiveRequest, ventureId]);

  const togglePin = React.useCallback(
    (item: PinnedItemReference) =>
      dispatchLongRun({ type: "toggle-pin", item }),
    [],
  );

  const askKizunaAboutResult = React.useCallback(
    (result: VentureSearchResult) => {
      setSelectedContextSourceIds([result.sourceId]);
      dispatchLongRun({
        type: "set-draft",
        conversationId:
          longRunRef.current.activeConversationId,
        draft: `Dựa trên “${result.title}”, Kizuna đề xuất điều gì tiếp theo?`,
      });
    },
    [],
  );

  const attachSourceToDraft = React.useCallback(
    (sourceId: string, title: string) => {
      setSelectedContextSourceIds([sourceId]);
      dispatchLongRun({
        type: "set-draft",
        conversationId:
          longRunRef.current.activeConversationId,
        draft: `Dựa trên “${title}”, Kizuna đề xuất điều gì tiếp theo?`,
      });
    },
    [],
  );

  const searchVenture = React.useCallback(
    (query: string, filters: VentureSearchFilters) =>
      searchService.search({
        ventureId,
        query,
        filters,
      }),
    [searchService, ventureId],
  );

  const buildContext = React.useCallback(
    (query: string) =>
      contextService.buildContext({
        ventureId,
        conversationId: longRunRef.current.activeConversationId,
        query,
        selectedSourceIds: selectedContextSourceIds,
      }),
    [
      contextService,
      selectedContextSourceIds,
      ventureId,
    ],
  );

  const groupedSessions = React.useMemo(
    () => groupConversationSessions(longRun),
    [longRun],
  );
  const activeSession =
    longRun.sessions.find(
      (session) =>
        session.id === longRun.activeConversationId,
    ) ?? longRun.sessions[0];
  const panelConversation = layout.panelConversationId
    ? longRun.sessions.find(
        (session) =>
          session.id === layout.panelConversationId &&
          !session.isArchived,
      )
    : undefined;
  const activeSummary = longRun.summaries.find(
    (summary) =>
      summary.conversationId ===
    longRun.activeConversationId,
  );
  const revealMessage = React.useCallback(
    (messageId: string) =>
      dispatchLongRun({
        type: "reveal-message",
        conversationId:
          longRunRef.current.activeConversationId,
        messageId,
      }),
    [],
  );

  const activeMentorId =
    state.mentorConnectionOperation.activeMentorId ??
    state.mentorRecommendation?.selectedMentorId;
  const mentorConnectionBrief = activeMentorId
    ? state.mentorConnectionBriefs[activeMentorId]
    : undefined;

  const getActiveMentorBrief = () => {
    const mentorId =
      stateRef.current.mentorConnectionOperation.activeMentorId ??
      stateRef.current.mentorRecommendation?.selectedMentorId;
    return mentorId
      ? stateRef.current.mentorConnectionBriefs[mentorId]
      : undefined;
  };

  const updateMentorConnectionSection = (
    sectionId: MentorConnectionBriefSectionId,
    content: string,
    checklistItems?: string[],
  ) => {
    const brief = getActiveMentorBrief();
    if (!brief) return;
    dispatch({
      type: "set-mentor-connection-brief",
      brief: updateMentorBriefSection(
        brief,
        sectionId,
        { content, checklistItems },
        nextMentorTimestamp(),
      ),
    });
  };

  const toggleMentorConnectionContext = (
    context: MentorShareableContext,
  ) => {
    const brief = getActiveMentorBrief();
    if (!brief) return;
    dispatch({
      type: "set-mentor-connection-brief",
      brief: toggleMentorBriefContext(
        brief,
        context,
        nextMentorTimestamp(),
      ),
    });
  };

  const toggleMentorConnectionEvidence = (
    evidenceId: string,
  ) => {
    const brief = getActiveMentorBrief();
    if (!brief) return;
    dispatch({
      type: "set-mentor-connection-brief",
      brief: toggleMentorBriefEvidence(
        brief,
        evidenceId,
        nextMentorTimestamp(),
      ),
    });
  };

  const toggleMentorConnectionDocument = (
    documentId: string,
  ) => {
    const brief = getActiveMentorBrief();
    if (!brief) return;
    dispatch({
      type: "set-mentor-connection-brief",
      brief: toggleMentorBriefDocument(
        brief,
        documentId,
        nextMentorTimestamp(),
      ),
    });
  };

  const saveMentorConnectionDraft = async () => {
    const brief = getActiveMentorBrief();
    if (!brief) return;
    dispatch({
      type: "mentor-connection-operation",
      patch: {
        saveStatus: "working",
        errorMessage: undefined,
      },
    });
    try {
      const saved =
        await mentorConnectionRepository.saveDraft(brief);
      dispatch({
        type: "set-mentor-connection-brief",
        brief: saved,
      });
      dispatch({
        type: "mentor-connection-operation",
        patch: { saveStatus: "success" },
      });
    } catch {
      dispatch({
        type: "mentor-connection-operation",
        patch: {
          saveStatus: "error",
          errorMessage: "Chưa thể lưu nháp.",
        },
      });
    }
  };

  const sendMentorConnection = () => {
    if (mentorConnectionSendRef.current) {
      return mentorConnectionSendRef.current;
    }
    const operation = (async () => {
      const brief = getActiveMentorBrief();
      if (!brief) return;
      const existing =
        stateRef.current.mentorConnectionRequest;
      if (
        existing?.ventureId === brief.ventureId &&
        existing.mentorId === brief.mentorId
      ) {
        dispatch({
          type: "mentor-connection-operation",
          patch: {
            sendStatus: "success",
            errorMessage: undefined,
          },
        });
        return;
      }
      dispatch({
        type: "set-mentor-connection-brief",
        brief: {
          ...brief,
          status: "sending",
          errorMessage: undefined,
        },
      });
      dispatch({
        type: "mentor-connection-operation",
        patch: {
          sendStatus: "working",
          errorMessage: undefined,
        },
      });
      try {
        const sharedRepository =
          sharedDemoRepositoryRef.current ??
          createBrowserDemoDomainRepository();
        sharedDemoRepositoryRef.current = sharedRepository;
        const sharedRequest =
          sharedRepository
            .getSnapshot()
            .connectionRequests.find(
              (request) =>
                request.ventureId === brief.ventureId &&
                request.mentorId === brief.mentorId,
            ) ??
          sharedRepository.createConnectionRequest(
            createSharedConnectionBriefSnapshot(
              sharedRepository,
              brief,
            ),
          );
        const request = toFounderConnectionRequest(
          sharedRequest,
          brief,
        );
        dispatch({
          type: "set-mentor-connection-request",
          request,
        });
        trackProductEvent("connection_request_sent", {
          ventureId,
          mentorId: request.mentorId,
          requestId: request.id,
        });
        dispatch({
          type: "mentor-connection-operation",
          patch: { sendStatus: "success" },
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Chưa thể gửi yêu cầu lúc này.";
        dispatch({
          type: "set-mentor-connection-brief",
          brief: {
            ...brief,
            status: "failed",
            errorMessage: message,
          },
        });
        dispatch({
          type: "mentor-connection-operation",
          patch: {
            sendStatus: "error",
            errorMessage: message,
          },
        });
      }
    })();
    mentorConnectionSendRef.current = operation;
    void operation.finally(() => {
      mentorConnectionSendRef.current = null;
    });
    return operation;
  };

  const refreshMentorConnection = () => {
    if (mentorConnectionGenerationRef.current) return;
    const operation = generateMentorConnectionBrief({
      preserveExisting: true,
    });
    mentorConnectionGenerationRef.current = operation;
    void operation.finally(() => {
      mentorConnectionGenerationRef.current = null;
    });
  };

  const keepMentorConnectionDraft = () => {
    const brief = getActiveMentorBrief();
    const input = buildMentorConnectionInput();
    if (!brief || !input) return;
    dispatch({
      type: "set-mentor-connection-brief",
      brief: {
        ...brief,
        contextFingerprint:
          createMentorContextFingerprint(input),
        updatedAt: nextMentorTimestamp(),
      },
    });
  };

  const answerMentorConnectionClarification = (
    clarification: string,
  ) => {
    if (mentorConnectionGenerationRef.current) return;
    const operation = generateMentorConnectionBrief({
      clarification,
    });
    mentorConnectionGenerationRef.current = operation;
    void operation.finally(() => {
      mentorConnectionGenerationRef.current = null;
    });
  };

  const closeSecondaryPane = React.useCallback(() => {
    const mentorId = layout.selectedMentorId;
    dispatchLayout({ type: "close-secondary-pane" });
    if (!mentorId) return;
    window.requestAnimationFrame(() => {
      document
        .querySelector<HTMLElement>(
          `[data-mentor-fit-trigger="${mentorId}"]`,
        )
        ?.focus();
    });
  }, [layout.selectedMentorId]);

  React.useEffect(() => {
    if (layout.secondaryPaneMode !== "mentor_fit") return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) {
        return;
      }
      event.preventDefault();
      closeSecondaryPane();
    };
    document.addEventListener("keydown", handleEscape);
    return () =>
      document.removeEventListener("keydown", handleEscape);
  }, [closeSecondaryPane, layout.secondaryPaneMode]);

  return {
    state,
    longRun,
    layout,
    onboarding,
    hydrated,
    activeSession,
    activeSummary,
    panelConversation,
    panelMessages: panelConversation
      ? getVisibleConversationMessages(
          longRun,
          panelConversation.id,
        )
      : [],
    panelDraft: panelConversation
      ? (longRun.draftsByConversation[panelConversation.id] ?? "")
      : "",
    panelAttachments: panelConversation
      ? (longRun.attachmentsByConversation[
          panelConversation.id
        ] ?? [])
      : [],
    panelGenerating,
    mentorConnectionBrief,
    groupedSessions,
    visibleMessages: getVisibleConversationMessages(longRun),
    hasOlderMessages:
      (longRun.messagesByConversation[
        longRun.activeConversationId
      ]?.length ?? 0) >
      (longRun.visibleMessageCountByConversation[
        longRun.activeConversationId
      ] ?? 12),
    draft:
      longRun.draftsByConversation[
        longRun.activeConversationId
      ] ?? "",
    selectedContextSourceIds,
    contextPreview: buildContext(""),
    sendMessage,
    retryLastRequest,
    editFailedMessage,
    deleteFailedMessage,
    setScenario,
    resetDemo,
    addSampleAttachment,
    addLocalFiles,
    removeAttachment: (attachmentId: string) =>
      dispatch({ type: "remove-attachment", attachmentId }),
    confirmInterpretation: (
      status: "confirmed" | "disputed",
    ) => dispatch({ type: "confirm-interpretation", status }),
    setView: (view: AiWorkspaceState["view"]) =>
      dispatch({ type: "set-view", view }),
    setCycleStep: (step: DecisionCycleStepId) =>
      dispatch({ type: "set-cycle-step", step }),
    toggleCycleTask: (taskId: string) =>
      dispatch({ type: "toggle-cycle-task", taskId }),
    submitCycleEvidence: () =>
      dispatch({ type: "submit-cycle-evidence" }),
    completeCycleReview: () =>
      dispatch({
        type: "complete-cycle-review",
        mentor: createCampusFlowMentorRecommendation(
          ventureId,
          state.decisionCycle.id,
          state.currentFocus.id,
        ),
      }),
    confirmActionProposal: (messageId: string) =>
      dispatch({
        type: "confirm-action-proposal",
        messageId,
      }),
    deferMentor: (reason?: MentorDismissReason) =>
      dispatch({ type: "defer-mentor", reason }),
    saveMentor: () => {
      const mentorId =
        state.mentorRecommendation?.selectedMentorId;
      if (mentorId) {
        dispatch({
          type: "toggle-save-mentor",
          mentorId,
        });
      }
    },
    toggleSaveMentor: (mentorId: string) =>
      dispatch({
        type: "toggle-save-mentor",
        mentorId,
      }),
    bookMentor: () => dispatch({ type: "book-mentor" }),
    useOwnMentor: () =>
      dispatch({
        type: "set-mentor-status",
        status: "external",
      }),
    toggleMentorPreparation: (itemId: string) =>
      dispatch({
        type: "toggle-mentor-preparation",
        itemId,
      }),
    refreshMentor: () =>
      dispatch({
        type: "refresh-mentor",
        mentor: {
          ...createCampusFlowMentorRecommendation(
            ventureId,
            state.decisionCycle.id,
            state.currentFocus.id,
          ),
          savedMentorIds:
            state.mentorRecommendation?.savedMentorIds ?? [],
          recommendationVersion:
            (state.mentorRecommendation
              ?.recommendationVersion ?? 0) + 1,
        },
      }),
    setAiModel: (modelId: AiWorkspaceState["selectedModel"]) =>
      dispatch({ type: "set-ai-model", modelId }),
    openMentorFit: (mentorId: string) => {
      trackProductEvent("mentor_fit_opened", {
        ventureId,
        mentorId,
      });
      dispatch({ type: "select-mentor", mentorId });
      dispatchLayout({
        type: "open-mentor-fit",
        mentorId,
      });
    },
    openMentorConnection,
    updateMentorConnectionSection,
    toggleMentorConnectionContext,
    toggleMentorConnectionEvidence,
    toggleMentorConnectionDocument,
    saveMentorConnectionDraft,
    sendMentorConnection,
    refreshMentorConnection,
    keepMentorConnectionDraft,
    retryMentorConnectionGeneration:
      generateMentorConnectionBrief,
    answerMentorConnectionClarification,
    verifyReadinessEvidence: () =>
      dispatch({
        type: "verify-readiness-evidence",
        criterionIds: [
          "customer_discovery_and_evidence",
          "prototype_and_learning",
          "market_signal_and_commitment",
          "experiment_and_execution_discipline",
        ],
      }),
    disputeReadinessContribution: (contributionId: string) =>
      dispatch({
        type: "dispute-readiness-contribution",
        contributionId,
      }),
    activateDecisionCycle: () =>
      dispatch({ type: "activate-decision-cycle" }),
    confirmReadinessContribution: (contributionId: string) =>
      dispatch({
        type: "confirm-readiness-contribution",
        contributionId,
      }),
    switchConversation,
    createConversation,
    openConversationInPanel,
    openSplitChat,
    sendPanelMessage,
    closeSecondaryPane,
    openAnalysis: (
      tab?: "overview" | "readiness" | "mentor",
    ) => dispatchLayout({ type: "open-analysis", tab }),
    openEvidence: (
      view?: "by_document" | "by_criterion",
    ) => dispatchLayout({ type: "open-evidence", view }),
    setAnalysisTab: (
      tab: "overview" | "readiness" | "mentor",
    ) => dispatchLayout({ type: "set-analysis-tab", tab }),
    setEvidenceView: (
      view: "by_document" | "by_criterion",
    ) => dispatchLayout({ type: "set-evidence-view", view }),
    setSelectedDocument: (documentId?: string) =>
      dispatchLayout({ type: "select-document", documentId }),
    setSelectedCriterion: (criterionId?: string) =>
      dispatchLayout({ type: "select-criterion", criterionId }),
    setSecondaryPaneWidth,
    setPanelDraft: (draft: string) => {
      const conversationId = layout.panelConversationId;
      if (!conversationId) return;
      dispatchLongRun({
        type: "set-draft",
        conversationId,
        draft,
      });
    },
    addPanelLocalFiles: (files: FileList | null) => {
      const conversationId = layout.panelConversationId;
      if (!conversationId || !files) return;
      const current =
        longRunRef.current.attachmentsByConversation[
          conversationId
        ] ?? [];
      const additions: MockAttachment[] = Array.from(files)
        .slice(0, Math.max(0, 3 - current.length))
        .map((file, index) => ({
          id: `panel-local-${Date.now()}-${index}`,
          name: file.name,
          size: file.size,
          type: file.type,
          origin: "local",
          status: "ready",
        }));
      dispatchLongRun({
        type: "set-attachments",
        conversationId,
        attachments: [...current, ...additions],
      });
    },
    removePanelAttachment: (attachmentId: string) => {
      const conversationId = layout.panelConversationId;
      if (!conversationId) return;
      dispatchLongRun({
        type: "set-attachments",
        conversationId,
        attachments: (
          longRunRef.current.attachmentsByConversation[
            conversationId
          ] ?? []
        ).filter(
          (attachment) => attachment.id !== attachmentId,
        ),
      });
    },
    renameConversation: (
      conversationId: string,
      title: string,
    ) =>
      dispatchLongRun({
        type: "rename-conversation",
        conversationId,
        title,
      }),
    deleteConversation,
    toggleConversationPin: (conversationId: string) =>
      dispatchLongRun({
        type: "toggle-conversation-pin",
        conversationId,
      }),
    archiveConversation,
    setDraft: (draft: string) =>
      dispatchLongRun({
        type: "set-draft",
        conversationId: longRun.activeConversationId,
        draft,
      }),
    loadOlderMessages: () =>
      dispatchLongRun({
        type: "load-older",
        conversationId: longRun.activeConversationId,
      }),
    revealMessage,
    saveScrollPosition: (scrollTop: number) =>
      dispatchLongRun({
        type: "save-scroll",
        conversationId: longRun.activeConversationId,
        scrollTop,
      }),
    togglePin,
    setMemoryStatus: (
      memoryId: string,
      status: VentureMemoryStatus,
      reason = "",
    ) =>
      dispatchLongRun({
        type: "set-memory-status",
        memoryId,
        status,
        reason,
      }),
    resolveConflict: (
      conflictId: string,
      resolution:
        | "set_current"
        | "future_direction"
        | "parallel_hypotheses",
      valueId: string,
    ) =>
      dispatchLongRun({
        type: "resolve-conflict",
        conflictId,
        resolution,
        valueId,
      }),
    editSummaryItem: (
      summaryId: string,
      sectionId: string,
      itemIndex: number,
      value: string,
    ) =>
      dispatchLongRun({
        type: "edit-summary-item",
        summaryId,
        sectionId,
        itemIndex,
        value,
      }),
    setSummaryStatus: (
      summaryId: string,
      status: ConversationSession["summaryStatus"],
    ) =>
      dispatchLongRun({
        type: "set-summary-status",
        summaryId,
        status,
      }),
    setMaterialStatus: (
      materialId: string,
      status: MaterialVersionStatus,
    ) =>
      dispatchLongRun({
        type: "set-material-status",
        materialId,
        status,
      }),
    removeMaterial: (materialId: string) =>
      dispatchLongRun({
        type: "remove-material",
        materialId,
      }),
    searchVenture,
    askKizunaAboutResult,
    attachSourceToDraft,
    clearScopedContext: () =>
      setSelectedContextSourceIds([]),
  };
}

export {
  AI_WORKSPACE_STORAGE_KEY,
  AI_WORKSPACE_STORAGE_VERSION,
};
