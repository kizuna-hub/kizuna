import type {
  WorkspaceLayoutAction,
  WorkspaceLayoutState,
} from "../types/workspace-layout.types";

export const DEFAULT_SECONDARY_PANE_WIDTH = 38;
export const MIN_SECONDARY_PANE_WIDTH = 24;
export const MAX_SECONDARY_PANE_WIDTH = 55;

export function createWorkspaceLayoutState(): WorkspaceLayoutState {
  return {
    secondaryPaneMode: "closed",
    secondaryPaneWidth: DEFAULT_SECONDARY_PANE_WIDTH,
    analysisTab: "overview",
    evidenceView: "by_document",
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
  ].includes(candidate.secondaryPaneMode ?? "")
    ? candidate.secondaryPaneMode!
    : initial.secondaryPaneMode;
  return {
    ...initial,
    ...candidate,
    secondaryPaneMode: mode,
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
  };
}

export function workspaceLayoutReducer(
  state: WorkspaceLayoutState,
  action: WorkspaceLayoutAction,
): WorkspaceLayoutState {
  switch (action.type) {
    case "hydrate":
      return restoreWorkspaceLayout(action.state);
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
