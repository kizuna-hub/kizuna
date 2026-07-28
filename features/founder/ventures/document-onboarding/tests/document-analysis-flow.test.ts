import assert from "node:assert/strict";
import test from "node:test";

import { createCampusFlowAnalysisResult } from "../demo/campusflow-analysis-demo-data";
import { runMockVentureDocumentAnalysis } from "../services/mock-venture-document-analysis-service";
import {
  createInitialVentureAnalysisState,
  ventureAnalysisReducer,
} from "../state/venture-analysis-state";
import type {
  StartupDocumentInput,
  VentureAnalysisStepId,
} from "../types/venture-analysis.types";

const documents: StartupDocumentInput[] = [
  {
    id: "document-pitch",
    role: "pitch_deck",
    name: "CampusFlow-PitchDeck-v2.pdf",
    size: 2_840_000,
    type: "application/pdf",
    extension: "pdf",
  },
  {
    id: "document-plan",
    role: "business_plan",
    name: "CampusFlow-BusinessPlan-v1.pdf",
    size: 1_486_000,
    type: "application/pdf",
    extension: "pdf",
  },
];

test("analysis reducer keeps progress monotonic and ignores stale runs", () => {
  const started = ventureAnalysisReducer(
    createInitialVentureAnalysisState(),
    {
      type: "start",
      runId: "run-current",
      files: documents,
    },
  );
  const advanced = ventureAnalysisReducer(started, {
    type: "complete-step",
    runId: "run-current",
    stepId: "files_received",
    progress: 8,
    signalPreviews: [],
  });
  const stale = ventureAnalysisReducer(advanced, {
    type: "complete-step",
    runId: "run-stale",
    stepId: "documents_read",
    progress: 99,
    signalPreviews: [],
  });
  const lowerProgress = ventureAnalysisReducer(stale, {
    type: "complete-step",
    runId: "run-current",
    stepId: "documents_read",
    progress: 4,
    signalPreviews: [],
  });

  assert.equal(stale, advanced);
  assert.equal(lowerProgress.progress, 8);
  assert.deepEqual(lowerProgress.completedStepIds, [
    "files_received",
    "documents_read",
  ]);
});

test("mock service advances all six stages in deterministic order", async () => {
  const activated: VentureAnalysisStepId[] = [];
  const completed: VentureAnalysisStepId[] = [];
  const response = await runMockVentureDocumentAnalysis({
    runId: "run-service",
    documents,
    signal: new AbortController().signal,
    durationScale: 0,
    callbacks: {
      onStepActivated: (stepId) => activated.push(stepId),
      onStepCompleted: ({ stepId }) =>
        completed.push(stepId),
    },
  });

  assert.equal(response.status, "completed");
  assert.equal(activated.length, 6);
  assert.deepEqual(completed, activated);
  if (response.status === "completed") {
    assert.equal(response.result.readiness.score, 65);
    assert.equal(response.result.evidence.length, 4);
  }
});

test("stage uncertainty pauses before readiness is created", async () => {
  const completed: VentureAnalysisStepId[] = [];
  const response = await runMockVentureDocumentAnalysis({
    runId: "run-stage",
    documents,
    signal: new AbortController().signal,
    durationScale: 0,
    stopAfterContext: true,
    callbacks: {
      onStepActivated: () => undefined,
      onStepCompleted: ({ stepId }) =>
        completed.push(stepId),
    },
  });

  assert.equal(
    response.status,
    "awaiting_stage_confirmation",
  );
  assert.deepEqual(completed, [
    "files_received",
    "documents_read",
    "venture_context_detected",
  ]);
  assert.equal(completed.includes("readiness_created"), false);
});

test("aborting a run prevents late completion", async () => {
  const controller = new AbortController();
  let completed = false;
  const run = runMockVentureDocumentAnalysis({
    runId: "run-abort",
    documents,
    signal: controller.signal,
    callbacks: {
      onStepActivated: () => undefined,
      onStepCompleted: () => {
        completed = true;
      },
    },
  });
  controller.abort();
  await assert.rejects(run, /cancelled/i);
  assert.equal(completed, false);
});

test("CampusFlow result supports one-file analysis", () => {
  const result = createCampusFlowAnalysisResult({
    runId: "run-one-file",
    documents: [documents[0]],
  });
  assert.equal(result.sourceDocuments.length, 1);
  assert.equal(result.evidence.length, 3);
  assert.equal(result.readiness.score, 65);
  assert.equal(
    result.signals.some(
      (signal) =>
        signal.documentRole === "business_plan",
    ),
    false,
  );
});
