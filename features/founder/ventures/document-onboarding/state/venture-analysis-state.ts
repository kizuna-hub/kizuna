import {
  campusFlowDetectedContext,
  signalPreviewsForCompletedSteps,
} from "../demo/campusflow-analysis-demo-data";
import type {
  VentureAnalysisAction,
  VentureAnalysisState,
} from "../types/venture-analysis.types";

export function createInitialVentureAnalysisState(): VentureAnalysisState {
  return {
    status: "idle",
    completedStepIds: [],
    progress: 0,
    files: [],
    signalPreviews: [],
  };
}

export function ventureAnalysisReducer(
  state: VentureAnalysisState,
  action: VentureAnalysisAction,
): VentureAnalysisState {
  if (
    action.type !== "start" &&
    action.type !== "reset" &&
    action.runId !== state.runId
  ) {
    return state;
  }

  switch (action.type) {
    case "start":
      return {
        status: "processing",
        runId: action.runId,
        activeStepId: "files_received",
        completedStepIds: [],
        progress: 0,
        files: action.files,
        signalPreviews: [],
      };

    case "activate-step":
      return {
        ...state,
        status: "processing",
        activeStepId: action.stepId,
        error: undefined,
      };

    case "complete-step": {
      const completedStepIds = state.completedStepIds.includes(
        action.stepId,
      )
        ? state.completedStepIds
        : [...state.completedStepIds, action.stepId];
      return {
        ...state,
        completedStepIds,
        progress: Math.max(state.progress, action.progress),
        detectedContext:
          action.detectedContext ?? state.detectedContext,
        signalPreviews: action.signalPreviews,
      };
    }

    case "require-stage-confirmation":
      return {
        ...state,
        status: "awaiting_stage_confirmation",
        activeStepId: undefined,
        detectedContext: {
          ...action.detectedContext,
          stageConfidence: "low",
        },
      };

    case "confirm-stage":
      return {
        ...state,
        status: "processing",
        detectedContext: {
          ...(state.detectedContext ??
            campusFlowDetectedContext),
          stage: action.stage,
          stageLabel: action.stageLabel,
          stageConfidence: "high",
        },
      };

    case "complete":
      return {
        ...state,
        status: "completed",
        activeStepId: undefined,
        completedStepIds: [
          "files_received",
          "documents_read",
          "venture_context_detected",
          "evidence_mapped",
          "readiness_created",
          "workspace_prepared",
        ],
        progress: 100,
        detectedContext: action.result.detectedContext,
        signalPreviews: action.result.signals,
        result: action.result,
        error: undefined,
      };

    case "fail":
      return {
        ...state,
        status: "failed",
        activeStepId: undefined,
        error: action.error,
      };

    case "cancel":
      return {
        ...state,
        status: "cancelled",
        activeStepId: undefined,
      };

    case "reset":
      return createInitialVentureAnalysisState();
  }
}

export function previewsAfterStep(
  state: VentureAnalysisState,
  completedStepId: VentureAnalysisState["completedStepIds"][number],
) {
  const completed = state.completedStepIds.includes(completedStepId)
    ? state.completedStepIds
    : [...state.completedStepIds, completedStepId];
  return signalPreviewsForCompletedSteps(
    completed,
    state.files,
  );
}
