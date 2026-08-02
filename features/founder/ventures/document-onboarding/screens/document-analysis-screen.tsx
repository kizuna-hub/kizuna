"use client";

import React from "react";
import { Loader2, ScanSearch } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import type { VentureStage } from "@/features/venture/core";

import { AnalysisCompleteCard } from "../components/analysis-complete-card";
import { AnalysisErrorState } from "../components/analysis-error-state";
import { AnalysisSignalPreview } from "../components/analysis-signal-preview";
import { AnalysisStepRow } from "../components/analysis-step-row";
import { StageConfirmation } from "../components/stage-confirmation";
import {
  CAMPUSFLOW_ANALYSIS_STEP_DEFINITIONS,
  campusFlowDetectedContext,
} from "../demo/campusflow-analysis-demo-data";
import {
  getMockDocumentOutcomes,
  needsStageConfirmation,
} from "../services/document-validation";
import {
  detectedContextForStage,
  runMockVentureDocumentAnalysis,
  signalPreviewsForCompletedSteps,
} from "../services/mock-venture-document-analysis-service";
import {
  createInitialVentureAnalysisState,
  ventureAnalysisReducer,
} from "../state/venture-analysis-state";
import type {
  StartupDocumentInput,
  StartupDocumentOutcome,
  VentureAnalysisResult,
} from "../types/venture-analysis.types";

function customizeResult(
  result: VentureAnalysisResult,
  ventureName: string,
) {
  const name = ventureName.trim() || result.detectedContext.name;
  return {
    ...result,
    detectedContext: {
      ...result.detectedContext,
      name,
    },
    signals: result.signals.map((signal) =>
      signal.id === "signal-venture-name"
        ? { ...signal, value: name }
        : signal,
    ),
  };
}

export function DocumentAnalysisScreen({
  ventureName,
  documents,
  initialRunId,
  enteringWorkspace,
  workspaceError,
  onEnterWorkspace,
  onReviewFiles,
  onContinueConversation,
}: {
  ventureName: string;
  documents: StartupDocumentInput[];
  initialRunId: string;
  enteringWorkspace: boolean;
  workspaceError?: string;
  onEnterWorkspace: (result: VentureAnalysisResult) => void;
  onReviewFiles: () => void;
  onContinueConversation: () => void;
}) {
  const [state, dispatch] = React.useReducer(
    ventureAnalysisReducer,
    undefined,
    createInitialVentureAnalysisState,
  );
  const [analysisDocuments, setAnalysisDocuments] =
    React.useState(documents);
  const [outcomes, setOutcomes] = React.useState<
    StartupDocumentOutcome[]
  >([]);
  const retrySequenceRef = React.useRef(0);
  const controllerRef = React.useRef<AbortController | null>(
    null,
  );
  const headingRef = React.useRef<HTMLHeadingElement | null>(
    null,
  );

  const runAnalysis = React.useCallback(
    async ({
      runId,
      files,
      startAtIndex = 0,
      stopAfterContext = false,
      resolvedStage = "prototype",
      reset = true,
    }: {
      runId: string;
      files: StartupDocumentInput[];
      startAtIndex?: number;
      stopAfterContext?: boolean;
      resolvedStage?: VentureStage;
      reset?: boolean;
    }) => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      if (reset) {
        dispatch({ type: "start", runId, files });
      }

      try {
        const response = await runMockVentureDocumentAnalysis({
          runId,
          documents: files,
          signal: controller.signal,
          startAtIndex,
          stopAfterContext,
          resolvedStage,
          callbacks: {
            onStepActivated: (stepId) =>
              dispatch({
                type: "activate-step",
                runId,
                stepId,
              }),
            onStepCompleted: ({
              stepId,
              progress,
              completedStepIds,
            }) =>
              dispatch({
                type: "complete-step",
                runId,
                stepId,
                progress,
                detectedContext:
                  stepId === "venture_context_detected"
                    ? {
                        ...detectedContextForStage(
                          resolvedStage,
                        ),
                        name:
                          ventureName.trim() ||
                          campusFlowDetectedContext.name,
                      }
                    : undefined,
                signalPreviews:
                  signalPreviewsForCompletedSteps(
                    completedStepIds,
                    files,
                  ),
              }),
          },
        });

        if (
          response.status ===
          "awaiting_stage_confirmation"
        ) {
          dispatch({
            type: "require-stage-confirmation",
            runId,
            detectedContext: {
              ...campusFlowDetectedContext,
              name:
                ventureName.trim() ||
                campusFlowDetectedContext.name,
              stageConfidence: "low",
            },
          });
          return;
        }

        dispatch({
          type: "complete",
          runId,
          result: customizeResult(
            response.result,
            ventureName,
          ),
        });
      } catch (error) {
        if (
          controller.signal.aborted ||
          (error instanceof DOMException &&
            error.name === "AbortError")
        ) {
          return;
        }
        dispatch({
          type: "fail",
          runId,
          error: {
            code: "file_analysis_failed",
            message:
              "Kết quả mô phỏng chưa thể được tạo. Tài liệu đã chọn vẫn được giữ nguyên.",
          },
        });
      }
    },
    [ventureName],
  );

  React.useEffect(() => {
    headingRef.current?.focus();
    const nextOutcomes =
      getMockDocumentOutcomes(documents);
    setOutcomes(nextOutcomes);
    const successful = nextOutcomes.filter(
      (outcome) => outcome.status !== "failed",
    );
    const failed = nextOutcomes.filter(
      (outcome) => outcome.status === "failed",
    );

    if (failed.length > 0) {
      dispatch({
        type: "start",
        runId: initialRunId,
        files: documents,
      });
      dispatch({
        type: "fail",
        runId: initialRunId,
        error: {
          code:
            successful.length > 0
              ? "partial_file_failure"
              : "file_analysis_failed",
          message:
            successful.length > 0
              ? `${successful[0].document.name} đã sẵn sàng. ${failed[0].document.name} chưa đọc được. Bạn có thể tiếp tục với dữ liệu hiện có hoặc thay file.`
              : "Các tài liệu đã chọn chưa đọc được trong flow demo này.",
          failedDocumentIds: failed.map(
            (outcome) => outcome.document.id,
          ),
        },
      });
      return () => controllerRef.current?.abort();
    }

    void runAnalysis({
      runId: initialRunId,
      files: documents,
      stopAfterContext:
        needsStageConfirmation(documents),
    });
    return () => controllerRef.current?.abort();
  }, [documents, initialRunId, runAnalysis]);

  React.useEffect(() => {
    if (state.status === "completed") {
      document
        .getElementById("analysis-complete-heading")
        ?.focus();
    }
  }, [state.status]);

  const retry = () => {
    retrySequenceRef.current += 1;
    const runId = `${initialRunId}-retry-${retrySequenceRef.current}`;
    setAnalysisDocuments(documents);
    setOutcomes(
      documents.map((document) => ({
        document,
        status: "ready",
      })),
    );
    void runAnalysis({
      runId,
      files: documents,
      stopAfterContext:
        needsStageConfirmation(documents),
    });
  };

  const continuePartial = () => {
    const successful = outcomes
      .filter((outcome) => outcome.status !== "failed")
      .map((outcome) => outcome.document);
    retrySequenceRef.current += 1;
    const runId = `${initialRunId}-partial-${retrySequenceRef.current}`;
    setAnalysisDocuments(successful);
    setOutcomes(
      successful.map((document) => ({
        document,
        status: "ready",
      })),
    );
    void runAnalysis({
      runId,
      files: successful,
      stopAfterContext:
        needsStageConfirmation(successful),
    });
  };

  const confirmStage = (stage: VentureStage) => {
    if (!state.runId) return;
    const stageLabel = stage === "idea" ? "Idea" : "Prototype";
    dispatch({
      type: "confirm-stage",
      runId: state.runId,
      stage,
      stageLabel,
    });
    void runAnalysis({
      runId: state.runId,
      files: analysisDocuments,
      startAtIndex: 3,
      resolvedStage: stage,
      reset: false,
    });
  };

  const currentStep =
    CAMPUSFLOW_ANALYSIS_STEP_DEFINITIONS.find(
      (step) => step.id === state.activeStepId,
    );

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 border-b border-workspace-border pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="workspace-eyebrow text-primary">
            Venture mới · Phân tích tài liệu
          </p>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="mt-1.5 workspace-page-title text-ink focus:outline-none"
          >
            {state.status === "completed"
              ? "Phân tích CampusFlow đã hoàn tất"
              : "Đang phân tích tài liệu startup"}
          </h1>
          <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
            Kizuna đang mô phỏng cách đọc context, liên kết
            evidence và chuẩn bị workspace.
          </p>
        </div>
        {state.status === "processing" ? (
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-workspace-border bg-workspace-panel px-3 py-1.5 workspace-meta text-ink sm:self-auto">
            <Loader2 className="size-3.5 animate-spin text-primary motion-reduce:animate-none" />
            Phân tích cục bộ
          </span>
        ) : null}
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(260px,0.72fr)_minmax(0,1.28fr)]">
        <AnalysisSignalPreview
          ventureName={ventureName}
          documents={analysisDocuments}
          signals={state.signalPreviews}
          completed={state.status === "completed"}
        />

        <div className="min-w-0 rounded-xl border border-workspace-border bg-workspace-panel p-4 sm:p-5">
          {state.status === "completed" && state.result ? (
            <AnalysisCompleteCard
              result={state.result}
              enteringWorkspace={enteringWorkspace}
              workspaceError={workspaceError}
              onEnterWorkspace={() =>
                onEnterWorkspace(state.result!)
              }
              onReviewFiles={onReviewFiles}
              onReanalyze={retry}
            />
          ) : state.status === "failed" && state.error ? (
            <AnalysisErrorState
              error={state.error}
              outcomes={outcomes}
              onRetry={retry}
              onReplaceFiles={onReviewFiles}
              onContinuePartial={
                state.error.code === "partial_file_failure"
                  ? continuePartial
                  : undefined
              }
              onContinueConversation={
                onContinueConversation
              }
            />
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <ScanSearch className="size-4 text-primary" />
                    <h2 className="workspace-section-title text-ink">
                      {currentStep?.label ??
                        "Chuẩn bị phân tích"}
                    </h2>
                  </div>
                  <p className="mt-1 workspace-meta text-workspace-muted-text">
                    Mô phỏng phân tích đa nguồn · khoảng 7 giây
                  </p>
                </div>
                <span className="font-tabular workspace-meta text-workspace-muted-text">
                  {state.progress}%
                </span>
              </div>

              <Progress
                value={state.progress}
                aria-label="Tiến độ phân tích tài liệu"
                className="mt-4 h-1.5"
              />
              <p className="sr-only" aria-live="polite">
                {currentStep
                  ? `Bước hiện tại: ${currentStep.label}`
                  : "Đang chờ bước tiếp theo"}
              </p>

              <ol className="mt-4 space-y-1">
                {CAMPUSFLOW_ANALYSIS_STEP_DEFINITIONS.map(
                  (step) => (
                    <AnalysisStepRow
                      key={step.id}
                      step={step}
                      active={state.activeStepId === step.id}
                      completed={state.completedStepIds.includes(
                        step.id,
                      )}
                      analysisStatus={state.status}
                    />
                  ),
                )}
              </ol>

              {state.status ===
              "awaiting_stage_confirmation" ? (
                <div className="mt-4">
                  <StageConfirmation
                    onConfirm={confirmStage}
                    onUnclear={onContinueConversation}
                  />
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
