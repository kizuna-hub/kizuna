import type {
  WorkspaceLayoutAction,
  WorkspaceLayoutState,
} from "../types/workspace-layout.types";

export const DEFAULT_SECONDARY_PANE_WIDTH = 38;
export const MIN_SECONDARY_PANE_WIDTH = 24;
export const MAX_SECONDARY_PANE_WIDTH = 55;

export function createWorkspaceLayoutState(): WorkspaceLayoutState {
  return {
    destination: "conversation_history",
    secondaryPaneMode: "closed",
    secondaryPaneWidth: DEFAULT_SECONDARY_PANE_WIDTH,
    analysisTab: "overview",
    evidenceView: "by_document",
    conversationHistoryView: "session_library",
    conversationHistorySearch: "",
    conversationHistoryFilter: "all",
    conversationHistoryScrollTop: 0,
  };
}

export function clampSecondaryPaneWidth(width: number) {
  if (!Number.isFinite(width)) return DEFAULT_SECONDARY_PANE_WIDTH;
  return Math.min(
    MAX_SECONDARY_PANE_WIDTH,
    Math.max(MIN_SECONDARY_PANE_WIDTH, width),
  );
}

export function restoreWorkspaceLayout(
  candidate?: Partial<WorkspaceLayoutState>,
): WorkspaceLayoutState {
  const initial = createWorkspaceLayoutState();
  if (!candidate) return initial;
  const mode = [
    "closed",
    "analysis",
    "evidence",
    "panel_chat",
    "mentor_fit",
    "mentor_connection",
    "mentor_sources",
    "mentor_comparison",
    "session_preparation",
    "mentor_questions",
    "checkpoint_capture",
    "checkpoint_update",
    "checkpoint_detail",
    "pre_read",
  ].includes(candidate.secondaryPaneMode ?? "")
    ? candidate.secondaryPaneMode!
    : initial.secondaryPaneMode;
  const destination = [
    "mentorship_continuity",
    "mentor_discovery",
    "connection_requests",
    "venture_brief",
    "documents",
    "conversation_history",
  ].includes(candidate.destination ?? "")
    ? candidate.destination!
    : initial.destination;
  return {
    ...initial,
    ...candidate,
    secondaryPaneMode: mode,
    destination,
    secondaryPaneWidth: clampSecondaryPaneWidth(
      candidate.secondaryPaneWidth ?? initial.secondaryPaneWidth,
    ),
    analysisTab: ["overview", "readiness", "mentor"].includes(
      candidate.analysisTab ?? "",
    )
      ? candidate.analysisTab!
      : initial.analysisTab,
    evidenceView: ["by_document", "by_criterion"].includes(
      candidate.evidenceView ?? "",
    )
      ? candidate.evidenceView!
      : initial.evidenceView,
    conversationHistoryView:
      candidate.conversationHistoryView === "session_detail" &&
      typeof candidate.selectedHistorySessionId === "string"
        ? "session_detail"
        : "session_library",
    selectedHistorySessionId:
      typeof candidate.selectedHistorySessionId === "string"
        ? candidate.selectedHistorySessionId
        : undefined,
    conversationHistoryFilter: [
      "all",
      "mentor_matching",
      "mentor_profile",
      "mentor_comparison",
      "session_preparation",
      "mentor_questions",
    ].includes(candidate.conversationHistoryFilter ?? "")
      ? candidate.conversationHistoryFilter!
      : initial.conversationHistoryFilter,
    conversationHistorySearch:
      typeof candidate.conversationHistorySearch === "string"
        ? candidate.conversationHistorySearch
        : initial.conversationHistorySearch,
    conversationHistoryScrollTop: Number.isFinite(
      candidate.conversationHistoryScrollTop,
    )
      ? Math.max(0, candidate.conversationHistoryScrollTop ?? 0)
      : initial.conversationHistoryScrollTop,
  };
}

export function workspaceLayoutReducer(
  state: WorkspaceLayoutState,
  action: WorkspaceLayoutAction,
): WorkspaceLayoutState {
  switch (action.type) {
    case "hydrate":
      return restoreWorkspaceLayout(action.state);
    case "set-destination":
      return state.destination === action.destination
        ? state
        : { ...state, destination: action.destination };
    case "open-analysis":
      return {
        ...state,
        secondaryPaneMode: "analysis",
        analysisTab: action.tab ?? state.analysisTab,
      };
    case "open-evidence":
      return {
        ...state,
        secondaryPaneMode: "evidence",
        evidenceView: action.view ?? state.evidenceView,
      };
    case "open-mentor-fit":
      return {
        ...state,
        secondaryPaneMode: "mentor_fit",
        secondaryPaneWidth: 42,
        selectedMentorId: action.mentorId,
      };
    case "open-mentor-connection":
      return {
        ...state,
        secondaryPaneMode: "mentor_connection",
        secondaryPaneWidth: 42,
        selectedMentorId: action.mentorId,
      };
    case "open-panel-chat":
      return {
        ...state,
        secondaryPaneMode: "panel_chat",
        secondaryPaneWidth: 50,
        panelConversationId: action.conversationId,
      };
    case "close-secondary-pane":
      return { ...state, secondaryPaneMode: "closed" };
    case "open-mentorship-panel":
      return {
        ...state,
        secondaryPaneMode: action.mode,
        secondaryPaneWidth: 42,
        selectedCheckpointId:
          action.checkpointId ?? state.selectedCheckpointId,
      };
    case "show-conversation-history-library":
      return state.conversationHistoryView === "session_library" &&
        state.secondaryPaneMode === "closed"
        ? state
        : {
            ...state,
            conversationHistoryView: "session_library",
            secondaryPaneMode: "closed",
          };
    case "open-conversation-history-session":
      return state.conversationHistoryView === "session_detail" &&
        state.selectedHistorySessionId === action.sessionId &&
        state.secondaryPaneMode === action.secondaryPaneMode &&
        state.selectedMentorId === action.mentorId
        ? state
        : {
            ...state,
            conversationHistoryView: "session_detail",
            selectedHistorySessionId: action.sessionId,
            secondaryPaneMode: action.secondaryPaneMode,
            secondaryPaneWidth: 42,
            selectedMentorId:
              action.mentorId ?? state.selectedMentorId,
          };
    case "set-conversation-history-search":
      return state.conversationHistorySearch === action.query
        ? state
        : {
            ...state,
            conversationHistorySearch: action.query,
          };
    case "set-conversation-history-filter":
      return state.conversationHistoryFilter === action.filter
        ? state
        : {
            ...state,
            conversationHistoryFilter: action.filter,
          };
    case "save-conversation-history-scroll":
      return Math.abs(
        state.conversationHistoryScrollTop - action.scrollTop,
      ) < 1
        ? state
        : {
            ...state,
            conversationHistoryScrollTop: Math.max(
              0,
              action.scrollTop,
            ),
          };
    case "set-secondary-pane-width": {
      const width = clampSecondaryPaneWidth(action.width);
      if (Math.abs(width - state.secondaryPaneWidth) < 0.1) {
        return state;
      }
      return {
        ...state,
        secondaryPaneWidth: width,
      };
    }
    case "set-analysis-tab":
      return { ...state, analysisTab: action.tab };
    case "set-evidence-view":
      return { ...state, evidenceView: action.view };
    case "select-document":
      return {
        ...state,
        selectedDocumentId: action.documentId,
      };
    case "select-criterion":
      return {
        ...state,
        selectedCriterionId: action.criterionId,
      };
  }
}
