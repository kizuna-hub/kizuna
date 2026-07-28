export interface WorkspaceOnboardingState {
  source: "document_analysis" | "conversation" | "empty";
  analysisRunId?: string;
  initialAnalysisPaneShown: boolean;
}
