import type { VentureStage } from "../../../../venture/core";

export type StartupDocumentRole =
  | "pitch_deck"
  | "business_plan";

export type StartupDocumentExtension =
  | "pdf"
  | "pptx"
  | "docx";

export interface StartupDocumentInput {
  id: string;
  role: StartupDocumentRole;
  name: string;
  size: number;
  type: string;
  extension: StartupDocumentExtension;
}

export type StartupDocumentProcessingStatus =
  | "ready"
  | "analyzed"
  | "failed";

export interface StartupDocumentOutcome {
  document: StartupDocumentInput;
  status: StartupDocumentProcessingStatus;
  errorMessage?: string;
}

export type VentureAnalysisStepId =
  | "files_received"
  | "documents_read"
  | "venture_context_detected"
  | "evidence_mapped"
  | "readiness_created"
  | "workspace_prepared";

export type VentureAnalysisStatus =
  | "idle"
  | "validating"
  | "processing"
  | "awaiting_stage_confirmation"
  | "completed"
  | "failed"
  | "cancelled";

export interface DetectedVentureContext {
  name: string;
  stage: VentureStage;
  stageLabel: string;
  stageConfidence: "low" | "high";
  team: string;
  productSummary: string;
  problem: string;
  targetUser: string;
}

export interface VentureSignalPreview {
  id: string;
  label: string;
  value: string;
  sourceLabel?: string;
  documentRole?: StartupDocumentRole;
  appearsAfterStepId: VentureAnalysisStepId;
}

export interface VentureEvidenceReference {
  id: string;
  documentRole: StartupDocumentRole;
  fileName: string;
  page: number;
  quote: string;
  supports: string[];
  limitation?: string;
}

export interface VentureReadinessBaseline {
  score: number;
  stageLabel: string;
  strongestCriterion: {
    label: string;
    score: number;
  };
  biggestGap: {
    label: string;
    score: number;
    explanation: string;
  };
  recommendedNextStep: string;
}

export interface MentorFirstAnalysisCompletion {
  ventureName: string;
  ventureStage: string;
  ventureCategory: string;
  ventureSummary: string;
  currentSupportNeed: string;
  expectedOutcome: string;
  mentorTopics: string[];
  analyzedDocuments: string[];
  evidenceSummary: string;
}

export interface VentureAnalysisResult {
  runId: string;
  detectedContext: DetectedVentureContext;
  sourceDocuments: StartupDocumentInput[];
  documentOutcomes: StartupDocumentOutcome[];
  signals: VentureSignalPreview[];
  evidence: VentureEvidenceReference[];
  mentorFirstCompletion: MentorFirstAnalysisCompletion;
  readiness: VentureReadinessBaseline;
}

export type VentureAnalysisErrorCode =
  | "unsupported_file"
  | "file_analysis_failed"
  | "partial_file_failure"
  | "workspace_initialization_failed";

export interface VentureAnalysisError {
  code: VentureAnalysisErrorCode;
  message: string;
  failedDocumentIds?: string[];
}

export interface VentureAnalysisState {
  runId?: string;
  status: VentureAnalysisStatus;
  activeStepId?: VentureAnalysisStepId;
  completedStepIds: VentureAnalysisStepId[];
  progress: number;
  files: StartupDocumentInput[];
  detectedContext?: DetectedVentureContext;
  signalPreviews: VentureSignalPreview[];
  result?: VentureAnalysisResult;
  error?: VentureAnalysisError;
}

export type VentureAnalysisAction =
  | {
      type: "start";
      runId: string;
      files: StartupDocumentInput[];
    }
  | {
      type: "activate-step";
      runId: string;
      stepId: VentureAnalysisStepId;
    }
  | {
      type: "complete-step";
      runId: string;
      stepId: VentureAnalysisStepId;
      progress: number;
      detectedContext?: DetectedVentureContext;
      signalPreviews: VentureSignalPreview[];
    }
  | {
      type: "require-stage-confirmation";
      runId: string;
      detectedContext: DetectedVentureContext;
    }
  | {
      type: "confirm-stage";
      runId: string;
      stage: VentureStage;
      stageLabel: string;
    }
  | {
      type: "complete";
      runId: string;
      result: VentureAnalysisResult;
    }
  | {
      type: "fail";
      runId: string;
      error: VentureAnalysisError;
    }
  | { type: "cancel"; runId: string }
  | { type: "reset" };

export interface CompleteDocumentOnboardingInput {
  analysisRunId: string;
  ventureContext: DetectedVentureContext;
  analysisResult: VentureAnalysisResult;
  sourceDocuments: StartupDocumentInput[];
}

export interface CompleteDocumentOnboardingResult {
  ventureId: string;
  conversationId: string;
  workspacePath: string;
}
