import type {
  LongRunWorkspaceAction,
  LongRunWorkspaceState,
  TimelineEvent,
  VentureMemoryStatus,
} from "../types/long-run-workspace.types";

function bump(state: LongRunWorkspaceState) {
  return state.stateVersion + 1;
}

function omitConversationValue<T>(
  values: Record<string, T>,
  conversationId: string,
) {
  const next = { ...values };
  delete next[conversationId];
  return next;
}

function statusHistoryReason(status: VentureMemoryStatus) {
  if (status === "verified") return "Founder xác nhận là context hiện tại.";
  if (status === "disputed") return "Founder đánh dấu cần tiếp tục làm rõ.";
  if (status === "outdated") return "Thông tin không còn đủ mới cho quyết định.";
  return "Trạng thái được cập nhật trong workspace.";
}

export function groupConversationSessions(
  state: LongRunWorkspaceState,
) {
  const active = state.sessions.filter((session) => !session.isArchived);
  return {
    today: active.filter((session) =>
      session.updatedAt.startsWith("2026-07-27"),
    ),
    recent: active.filter(
      (session) =>
        session.updatedAt >= "2026-07-20" &&
        !session.updatedAt.startsWith("2026-07-27"),
    ),
    older: active.filter(
      (session) => session.updatedAt < "2026-07-20",
    ),
    decisionCycles: active.filter(
      (session) => session.category === "decision_cycle",
    ),
    materialAnalysis: active.filter(
      (session) => session.category === "material_analysis",
    ),
    mentorSessions: active.filter(
      (session) => session.category === "mentor_preparation",
    ),
  };
}

export function getVisibleConversationMessages(
  state: LongRunWorkspaceState,
  conversationId = state.activeConversationId,
) {
  const messages = state.messagesByConversation[conversationId] ?? [];
  const visibleCount =
    state.visibleMessageCountByConversation[conversationId] ?? 12;
  return messages.slice(Math.max(0, messages.length - visibleCount));
}

export function getStaleMemoryItems(
  state: LongRunWorkspaceState,
) {
  return state.memory.filter(
    (item) =>
      item.status === "outdated" ||
      item.status === "superseded" ||
      (item.validUntil
        ? item.validUntil < "2026-07-27T09:45:00.000Z"
        : false),
  );
}

function conflictTimelineEvent(
  state: LongRunWorkspaceState,
  title: string,
  sourceIds: string[],
): TimelineEvent {
  return {
    id: `timeline-conflict-${state.stateVersion + 1}`,
    ventureId: state.ventureId,
    type: "context_superseded",
    title,
    createdAt: "2026-07-27T09:46:00.000Z",
    actor: "Trần Minh",
    reason:
      "Founder đã giải quyết mâu thuẫn mà không xóa lịch sử của các nguồn cũ.",
    sourceIds,
  };
}

export function longRunWorkspaceReducer(
  state: LongRunWorkspaceState,
  action: LongRunWorkspaceAction,
): LongRunWorkspaceState {
  switch (action.type) {
    case "hydrate":
      return action.state;

    case "select-conversation":
      return state.sessions.some(
        (session) =>
          session.id === action.conversationId &&
          !session.isArchived,
      )
        ? {
            ...state,
            activeConversationId: action.conversationId,
            lastConversationId: action.conversationId,
          }
        : state;

    case "create-conversation":
      if (
        action.session.ventureId !== state.ventureId ||
        state.sessions.some(
          (session) => session.id === action.session.id,
        )
      ) {
        return state;
      }
      return {
        ...state,
        stateVersion: bump(state),
        sessions: [action.session, ...state.sessions],
        activeConversationId: action.session.id,
        lastConversationId: action.session.id,
        messagesByConversation: {
          ...state.messagesByConversation,
          [action.session.id]: action.messages,
        },
        draftsByConversation: {
          ...state.draftsByConversation,
          [action.session.id]: "",
        },
        visibleMessageCountByConversation: {
          ...state.visibleMessageCountByConversation,
          [action.session.id]: 12,
        },
      };

    case "rename-conversation": {
      const title = action.title.trim();
      if (!title) return state;
      return {
        ...state,
        stateVersion: bump(state),
        sessions: state.sessions.map((session) =>
          session.id === action.conversationId
            ? {
                ...session,
                title,
                updatedAt: "2026-07-27T09:47:00.000Z",
              }
            : session,
        ),
      };
    }

    case "delete-conversation": {
      if (
        !state.sessions.some(
          (session) => session.id === action.conversationId,
        )
      ) {
        return state;
      }

      const sessions = state.sessions.filter(
        (session) => session.id !== action.conversationId,
      );
      const nextActiveSession = sessions.find(
        (session) => !session.isArchived,
      );
      const deletingActive =
        state.activeConversationId === action.conversationId;

      return {
        ...state,
        stateVersion: bump(state),
        sessions,
        activeConversationId: deletingActive
          ? (nextActiveSession?.id ?? "")
          : state.activeConversationId,
        lastConversationId:
          state.lastConversationId === action.conversationId
            ? (nextActiveSession?.id ?? "")
            : state.lastConversationId,
        messagesByConversation: omitConversationValue(
          state.messagesByConversation,
          action.conversationId,
        ),
        draftsByConversation: omitConversationValue(
          state.draftsByConversation,
          action.conversationId,
        ),
        visibleMessageCountByConversation: omitConversationValue(
          state.visibleMessageCountByConversation,
          action.conversationId,
        ),
        scrollTopByConversation: omitConversationValue(
          state.scrollTopByConversation,
          action.conversationId,
        ),
      };
    }

    case "toggle-conversation-pin":
      return {
        ...state,
        stateVersion: bump(state),
        sessions: state.sessions.map((session) =>
          session.id === action.conversationId
            ? { ...session, isPinned: !session.isPinned }
            : session,
        ),
      };

    case "archive-conversation": {
      const remaining = state.sessions.filter(
        (session) =>
          session.id !== action.conversationId &&
          !session.isArchived,
      );
      return {
        ...state,
        stateVersion: bump(state),
        sessions: state.sessions.map((session) =>
          session.id === action.conversationId
            ? { ...session, isArchived: true }
            : session,
        ),
        activeConversationId:
          state.activeConversationId === action.conversationId
            ? (remaining[0]?.id ?? state.activeConversationId)
            : state.activeConversationId,
      };
    }

    case "set-draft":
      return {
        ...state,
        draftsByConversation: {
          ...state.draftsByConversation,
          [action.conversationId]: action.draft,
        },
      };

    case "sync-messages": {
      const current =
        state.messagesByConversation[action.conversationId] ?? [];
      const incomingIds = new Set(
        action.messages.map((message) => message.id),
      );
      if (
        current.length === action.messages.length &&
        current.every(
          (message, index) =>
            message.id === action.messages[index]?.id &&
            message.content === action.messages[index]?.content &&
            message.status === action.messages[index]?.status,
        )
      ) {
        return state;
      }
      return {
        ...state,
        messagesByConversation: {
          ...state.messagesByConversation,
          [action.conversationId]: action.messages.filter(
            (message, index) =>
              action.messages.findIndex(
                (candidate) => candidate.id === message.id,
              ) === index && incomingIds.has(message.id),
          ),
        },
        sessions: state.sessions.map((session) =>
          session.id === action.conversationId
            ? {
                ...session,
                updatedAt:
                  action.messages.at(-1)?.createdAt ??
                  session.updatedAt,
              }
            : session,
        ),
      };
    }

    case "load-older":
      return {
        ...state,
        visibleMessageCountByConversation: {
          ...state.visibleMessageCountByConversation,
          [action.conversationId]:
            (state.visibleMessageCountByConversation[
              action.conversationId
            ] ?? 12) + 10,
        },
      };

    case "reveal-message": {
      const messages =
        state.messagesByConversation[action.conversationId] ?? [];
      const messageIndex = messages.findIndex(
        (message) => message.id === action.messageId,
      );
      if (messageIndex < 0) return state;
      const requiredCount = messages.length - messageIndex;
      const currentCount =
        state.visibleMessageCountByConversation[
          action.conversationId
        ] ?? 12;
      if (requiredCount <= currentCount) return state;
      return {
        ...state,
        visibleMessageCountByConversation: {
          ...state.visibleMessageCountByConversation,
          [action.conversationId]: requiredCount,
        },
      };
    }

    case "save-scroll":
      return {
        ...state,
        scrollTopByConversation: {
          ...state.scrollTopByConversation,
          [action.conversationId]: action.scrollTop,
        },
      };

    case "toggle-pin": {
      const exists = state.pinnedItems.some(
        (item) =>
          item.itemType === action.item.itemType &&
          item.sourceId === action.item.sourceId,
      );
      return {
        ...state,
        stateVersion: bump(state),
        pinnedItems: exists
          ? state.pinnedItems.filter(
              (item) =>
                !(
                  item.itemType === action.item.itemType &&
                  item.sourceId === action.item.sourceId
                ),
            )
          : [...state.pinnedItems, action.item],
      };
    }

    case "set-memory-status":
      return {
        ...state,
        stateVersion: bump(state),
        memory: state.memory.map((item) =>
          item.id === action.memoryId
            ? {
                ...item,
                status: action.status,
                updatedAt: "2026-07-27T09:48:00.000Z",
                history: [
                  ...item.history,
                  {
                    id: `history-${item.id}-${state.stateVersion + 1}`,
                    status: action.status,
                    value: item.summary,
                    actor: "Trần Minh",
                    createdAt: "2026-07-27T09:48:00.000Z",
                    reason:
                      action.reason ||
                      statusHistoryReason(action.status),
                  },
                ],
              }
            : item,
        ),
      };

    case "resolve-conflict": {
      const conflict = state.conflicts.find(
        (item) => item.id === action.conflictId,
      );
      if (!conflict || conflict.status === "resolved") return state;
      const selected = conflict.values.find(
        (value) => value.id === action.valueId,
      );
      if (!selected) return state;
      const selectedSourceIds = conflict.values.map(
        (value) => value.sourceId,
      );
      const memory = state.memory.map((item) => {
        if (!item.sourceIds.some((id) => selectedSourceIds.includes(id))) {
          return item;
        }
        if (item.sourceIds.includes(selected.sourceId)) {
          return {
            ...item,
            status:
              action.resolution === "parallel_hypotheses" ||
              action.resolution === "future_direction"
                ? ("assumed" as const)
                : ("verified" as const),
            updatedAt: "2026-07-27T09:49:00.000Z",
          };
        }
        if (
          action.resolution === "future_direction" &&
          item.status === "verified"
        ) {
          return item;
        }
        return {
          ...item,
          status:
            action.resolution === "parallel_hypotheses"
              ? ("assumed" as const)
              : action.resolution === "future_direction"
                ? ("outdated" as const)
                : ("superseded" as const),
          supersededById:
            action.resolution === "set_current"
              ? selected.sourceId
              : item.supersededById,
          updatedAt: "2026-07-27T09:49:00.000Z",
        };
      });
      return {
        ...state,
        stateVersion: bump(state),
        memory,
        conflicts: state.conflicts.map((item) =>
          item.id === conflict.id
            ? {
                ...item,
                status: "resolved",
                resolvedValueId: selected.id,
              }
            : item,
        ),
        timeline: [
          conflictTimelineEvent(
            state,
            `Đã giải quyết mâu thuẫn: ${selected.value}`,
            selectedSourceIds,
          ),
          ...state.timeline,
        ],
      };
    }

    case "edit-summary-item":
      return {
        ...state,
        stateVersion: bump(state),
        summaries: state.summaries.map((summary) =>
          summary.id === action.summaryId
            ? {
                ...summary,
                updatedAt: "2026-07-27T09:50:00.000Z",
                sections: summary.sections.map((section) =>
                  section.id === action.sectionId
                    ? {
                        ...section,
                        items: section.items.map((item, index) =>
                          index === action.itemIndex
                            ? action.value
                            : item,
                        ),
                      }
                    : section,
                ),
              }
            : summary,
        ),
      };

    case "set-summary-status": {
      const selectedSummary = state.summaries.find(
        (summary) => summary.id === action.summaryId,
      );
      return {
        ...state,
        stateVersion: bump(state),
        summaries: state.summaries.map((summary) =>
          summary.id === action.summaryId
            ? {
                ...summary,
                status: action.status,
                updatedAt: "2026-07-27T09:51:00.000Z",
              }
            : summary,
        ),
        sessions: state.sessions.map((session) => {
          return selectedSummary &&
            session.id === selectedSummary.conversationId
            ? { ...session, summaryStatus: action.status }
            : session;
        }),
        memory:
          action.status === "memory_updated" &&
          selectedSummary
            ? state.memory.map((item) =>
                selectedSummary.proposedMemoryItemIds.includes(
                  item.id,
                )
                  ? {
                      ...item,
                      status: "verified",
                      updatedAt:
                        "2026-07-27T09:51:00.000Z",
                      history: [
                        ...item.history,
                        {
                          id: `history-summary-${item.id}-${state.stateVersion + 1}`,
                          status: "verified",
                          value: item.summary,
                          actor: "Trần Minh",
                          createdAt:
                            "2026-07-27T09:51:00.000Z",
                          reason:
                            "Founder xác nhận cập nhật từ tóm tắt phiên làm việc.",
                        },
                      ],
                    }
                  : item,
              )
            : state.memory,
      };
    }

    case "set-material-status": {
      const target = state.materialVersions.find(
        (material) => material.id === action.materialId,
      );
      if (!target) return state;
      return {
        ...state,
        stateVersion: bump(state),
        materialVersions: state.materialVersions.map((material) => {
          if (material.id === target.id) {
            return { ...material, status: action.status };
          }
          if (
            action.status === "canonical" &&
            material.familyId === target.familyId &&
            material.status === "canonical"
          ) {
            return { ...material, status: "superseded" };
          }
          return material;
        }),
      };
    }

    case "remove-material": {
      const target = state.materialVersions.find(
        (material) => material.id === action.materialId,
      );
      if (!target) return state;
      return {
        ...state,
        stateVersion: bump(state),
        materialVersions: state.materialVersions.filter(
          (material) => material.id !== target.id,
        ),
        memory: state.memory.map((item) =>
          item.sourceIds.includes(target.id)
            ? {
                ...item,
                status: "missing",
                updatedAt: "2026-07-27T09:52:00.000Z",
              }
            : item,
        ),
      };
    }

    case "append-readiness-change":
      if (
        action.change.ventureId !== state.ventureId ||
        state.readinessHistory.some(
          (change) => change.id === action.change.id,
        )
      ) {
        return state;
      }
      return {
        ...state,
        stateVersion: bump(state),
        readinessHistory: [
          action.change,
          ...state.readinessHistory,
        ],
      };
  }
}
