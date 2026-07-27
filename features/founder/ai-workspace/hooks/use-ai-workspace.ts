"use client";

import React from "react";

import { createContextAssemblyService } from "../services/context-assembly-service";
import { isScopedRequestCurrent } from "../services/scoped-request";
import {
  AI_WORKSPACE_STORAGE_KEY,
  AI_WORKSPACE_STORAGE_VERSION,
  parseAiWorkspaceEnvelope,
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
  baselineMentorRecommendation,
  createAiWorkspaceScenarioState,
  sampleMaterials,
} from "../demo/demo-scenarios";
import { createLongRunDemoState } from "../demo/demo-long-run-data";
import {
  createMockAiWorkspaceEngine,
  MockAiWorkspaceError,
} from "../demo/mock-ai-engine";
import { createMockVentureSearchService } from "../demo/mock-venture-search-service";
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

const legacyScenarioIds = new Set<AiWorkspaceScenarioId>([
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
  const [hydrated, setHydrated] = React.useState(false);
  const [selectedContextSourceIds, setSelectedContextSourceIds] =
    React.useState<string[]>([]);
  const stateRef = React.useRef(state);
  const longRunRef = React.useRef(longRun);
  const messageSequence = React.useRef(0);
  const requestSequence = React.useRef(0);
  const abortControllerRef =
    React.useRef<AbortController | null>(null);
  const activeRequestRef = React.useRef<ScopedAiRequest>({
    requestId: "idle",
    ventureId,
    conversationId: longRun.activeConversationId,
    stateVersion: longRun.stateVersion,
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

  React.useEffect(() => {
    stateRef.current = state;
  }, [state]);

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
    const restoredLongRun = restoreLongRunSession(
      ventureId,
      persisted,
    );
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
    activeRequestRef.current = {
      requestId: "idle",
      ventureId,
      conversationId: restoredLongRun.activeConversationId,
      stateVersion: restoredLongRun.stateVersion,
    };
    setSelectedContextSourceIds([]);
    setHydrated(true);
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
    );
    window.localStorage.setItem(
      AI_WORKSPACE_STORAGE_KEY,
      JSON.stringify(envelope),
    );
  }, [hydrated, longRun, state, ventureId]);

  React.useEffect(
    () => () => {
      abortControllerRef.current?.abort();
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
    (title = "Cuộc trò chuyện mới") => {
      invalidateActiveRequest();
      const current = longRunRef.current;
      const id = `conversation-${current.stateVersion + 1}`;
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
            "Cuộc trò chuyện mới đã sẵn sàng. Context quan trọng vẫn được lấy từ Venture Memory thay vì sao chép toàn bộ lịch sử chat.",
          createdAt: new Date().toISOString(),
          status: "complete",
        },
      ];
      dispatchLongRun({
        type: "create-conversation",
        session,
        messages,
      });
      dispatch({ type: "replace-messages", messages });
      setSelectedContextSourceIds([]);
    },
    [invalidateActiveRequest, ventureId],
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
    const longRunState = createLongRunDemoState(ventureId);
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

  return {
    state,
    longRun,
    hydrated,
    activeSession,
    activeSummary,
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
        mentor: structuredClone(baselineMentorRecommendation),
      }),
    deferMentor: (reason?: MentorDismissReason) =>
      dispatch({ type: "defer-mentor", reason }),
    saveMentor: () =>
      dispatch({
        type: "set-mentor-status",
        status: "saved",
      }),
    bookMentor: () =>
      dispatch({
        type: "set-mentor-status",
        status: "booked",
      }),
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
          ...structuredClone(baselineMentorRecommendation),
          decisionCycleId: state.decisionCycle.id,
          blockerId: state.currentFocus.id,
          scopeLabel: `${state.currentFocus.bottleneck} · ${state.decisionCycle.title}`,
          recommendationVersion:
            (state.mentorRecommendation
              ?.recommendationVersion ?? 0) + 1,
        },
      }),
    switchConversation,
    createConversation,
    renameConversation: (
      conversationId: string,
      title: string,
    ) =>
      dispatchLongRun({
        type: "rename-conversation",
        conversationId,
        title,
      }),
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
