import type { VentureStage } from "../../../../venture/core";

import {
  CAMPUSFLOW_ANALYSIS_STEP_DEFINITIONS,
  campusFlowDetectedContext,
  createCampusFlowAnalysisResult,
  signalPreviewsForCompletedSteps,
} from "../demo/campusflow-analysis-demo-data";
import type {
  StartupDocumentInput,
  VentureAnalysisResult,
  VentureAnalysisStepId,
} from "../types/venture-analysis.types";

function wait(durationMs: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Analysis cancelled", "AbortError"));
      return;
    }
    const onAbort = () => {
      globalThis.clearTimeout(timeout);
      reject(
        new DOMException("Analysis cancelled", "AbortError"),
      );
    };
    const timeout = globalThis.setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, durationMs);
    signal.addEventListener("abort", onAbort, {
      once: true,
    });
  });
}

export interface MockVentureAnalysisCallbacks {
  onStepActivated: (stepId: VentureAnalysisStepId) => void;
  onStepCompleted: (input: {
    stepId: VentureAnalysisStepId;
    progress: number;
    completedStepIds: VentureAnalysisStepId[];
  }) => void;
}

export async function runMockVentureDocumentAnalysis({
  runId,
  documents,
  signal,
  callbacks,
  startAtIndex = 0,
  stopAfterContext = false,
  resolvedStage = "prototype",
  durationScale = 1,
}: {
  runId: string;
  documents: StartupDocumentInput[];
  signal: AbortSignal;
  callbacks: MockVentureAnalysisCallbacks;
  startAtIndex?: number;
  stopAfterContext?: boolean;
  resolvedStage?: VentureStage;
  durationScale?: number;
}): Promise<
  | { status: "awaiting_stage_confirmation" }
  | { status: "completed"; result: VentureAnalysisResult }
> {
  const completedStepIds =
    CAMPUSFLOW_ANALYSIS_STEP_DEFINITIONS.slice(
      0,
      startAtIndex,
    ).map((step) => step.id);

  for (
    let index = startAtIndex;
    index < CAMPUSFLOW_ANALYSIS_STEP_DEFINITIONS.length;
    index += 1
  ) {
    const step = CAMPUSFLOW_ANALYSIS_STEP_DEFINITIONS[index];
    callbacks.onStepActivated(step.id);
    await wait(
      Math.max(0, step.durationMs * durationScale),
      signal,
    );
    completedStepIds.push(step.id);
    callbacks.onStepCompleted({
      stepId: step.id,
      progress: step.completedProgress,
      completedStepIds: [...completedStepIds],
    });

    if (
      stopAfterContext &&
      step.id === "venture_context_detected"
    ) {
      return { status: "awaiting_stage_confirmation" };
    }
  }

  return {
    status: "completed",
    result: createCampusFlowAnalysisResult({
      runId,
      documents,
      resolvedStage,
    }),
  };
}

export function detectedContextForStage(
  stage: VentureStage = "prototype",
) {
  return {
    ...campusFlowDetectedContext,
    stage,
    stageLabel: stage === "idea" ? "Idea" : "Prototype",
  };
}

export { signalPreviewsForCompletedSteps };
