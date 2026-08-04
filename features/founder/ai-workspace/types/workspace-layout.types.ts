import type {
  ConversationHistoryView,
  ConversationSessionFilter,
} from "../conversation-history/types/conversation-session.types";

export type SecondaryPaneMode =
  | "closed"
  | "analysis"
  | "evidence"
  | "panel_chat"
  | "mentor_fit"
  | "mentor_connection"
  | "mentor_sources"
  | "mentor_comparison"
  | "session_preparation"
  | "mentor_questions"
  | "checkpoint_capture"
  | "checkpoint_update"
  | "checkpoint_detail"
  | "pre_read";

export type WorkspaceDestination =
  | "mentorship_continuity"
  | "mentor_discovery"
  | "connection_requests"
  | "venture_brief"
  | "documents"
  | "conversation_history";

export type WorkspaceEntryPanel =
  | "closed"
  | "mentor_detail"
  | "copilot"
  | "connection_brief"
  | "connection_status";

export type AnalysisTab = "overview" | "readiness" | "mentor";

export type EvidenceView = "by_document" | "by_criterion";

export interface WorkspaceLayoutState {
  destination: WorkspaceDestination;
  secondaryPaneMode: SecondaryPaneMode;
  secondaryPaneWidth: number;
  analysisTab: AnalysisTab;
  evidenceView: EvidenceView;
  selectedDocumentId?: string;
  selectedCriterionId?: string;
  panelConversationId?: string;
  selectedMentorId?: string;
  selectedCheckpointId?: string;
  conversationHistoryView: ConversationHistoryView;
  selectedHistorySessionId?: string;
  conversationHistorySearch: string;
  conversationHistoryFilter: ConversationSessionFilter;
  conversationHistoryScrollTop: number;
}

export type WorkspaceLayoutAction =
  | { type: "hydrate"; state: WorkspaceLayoutState }
  | {
      type: "set-destination";
      destination: WorkspaceDestination;
    }
  | { type: "open-analysis"; tab?: AnalysisTab }
  | { type: "open-evidence"; view?: EvidenceView }
  | { type: "open-mentor-fit"; mentorId: string }
  | { type: "open-mentor-connection"; mentorId: string }
  | {
      type: "open-panel-chat";
      conversationId: string;
    }
  | { type: "close-secondary-pane" }
  | {
      type: "open-mentorship-panel";
      mode:
        | "checkpoint_capture"
        | "checkpoint_update"
        | "checkpoint_detail"
        | "pre_read";
      checkpointId?: string;
    }
  | { type: "show-conversation-history-library" }
  | {
      type: "open-conversation-history-session";
      sessionId: string;
      secondaryPaneMode: SecondaryPaneMode;
      mentorId?: string;
    }
  | {
      type: "set-conversation-history-search";
      query: string;
    }
  | {
      type: "set-conversation-history-filter";
      filter: ConversationSessionFilter;
    }
  | {
      type: "save-conversation-history-scroll";
      scrollTop: number;
    }
  | { type: "set-secondary-pane-width"; width: number }
  | { type: "set-analysis-tab"; tab: AnalysisTab }
  | { type: "set-evidence-view"; view: EvidenceView }
  | {
      type: "select-document";
      documentId?: string;
    }
  | {
      type: "select-criterion";
      criterionId?: string;
    };
