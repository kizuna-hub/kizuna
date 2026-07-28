export type SecondaryPaneMode =
  | "closed"
  | "analysis"
  | "evidence"
  | "panel_chat";

export type AnalysisTab = "overview" | "readiness" | "mentor";

export type EvidenceView = "by_document" | "by_criterion";

export interface WorkspaceLayoutState {
  secondaryPaneMode: SecondaryPaneMode;
  secondaryPaneWidth: number;
  analysisTab: AnalysisTab;
  evidenceView: EvidenceView;
  selectedDocumentId?: string;
  selectedCriterionId?: string;
  panelConversationId?: string;
}

export type WorkspaceLayoutAction =
  | { type: "hydrate"; state: WorkspaceLayoutState }
  | { type: "open-analysis"; tab?: AnalysisTab }
  | { type: "open-evidence"; view?: EvidenceView }
  | {
      type: "open-panel-chat";
      conversationId: string;
    }
  | { type: "close-secondary-pane" }
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
