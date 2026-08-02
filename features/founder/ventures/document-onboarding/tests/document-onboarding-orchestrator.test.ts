import assert from "node:assert/strict";
import test from "node:test";

import {
  parseAiWorkspaceEnvelope,
  resolveInitialAnalysisPaneReveal,
  restoreWorkspaceOnboardingSession,
} from "../../../ai-workspace/state/ai-workspace-persistence";
import { createCampusFlowAnalysisResult } from "../demo/campusflow-analysis-demo-data";
import {
  completeDocumentOnboarding,
  persistDocumentOnboardingTransaction,
} from "../services/document-onboarding-orchestrator";
import { createDemoWorkspaceSeed } from "../../../venture-foundation/demo-seed";
import type { StartupDocumentInput } from "../types/venture-analysis.types";
import { campusFlowDetectedContext } from "../demo/campusflow-analysis-demo-data";
import { serializeAiWorkspaceBootstrap } from "../../../ai-workspace/onboarding/document-analysis-workspace-bootstrap";

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

function input() {
  const analysisResult = createCampusFlowAnalysisResult({
    runId: "analysis-campusflow",
    documents,
  });
  return {
    analysisRunId: analysisResult.runId,
    ventureContext: campusFlowDetectedContext,
    analysisResult,
    sourceDocuments: documents,
  };
}

test("onboarding atomically creates venture context, evidence, readiness, and first conversation", () => {
  const result = completeDocumentOnboarding(
    createDemoWorkspaceSeed(),
    input(),
  );
  const venture = result.state.ventures.find(
    (item) => item.id === result.ventureId,
  );
  const firstMessages =
    result.aiWorkspaceBootstrap.session.longRun
      ?.messagesByConversation[result.conversationId];

  assert.equal(venture?.status, "active");
  assert.equal(venture?.stage, "prototype");
  assert.equal(venture?.setup?.status, "completed");
  assert.equal(
    result.state.sources.filter(
      (source) => source.ventureId === result.ventureId,
    ).length,
    2,
  );
  assert.equal(
    result.state.evidence.filter(
      (evidence) =>
        evidence.ventureId === result.ventureId,
    ).length,
    4,
  );
  assert.equal(
    result.state.readinessDeltas.some(
      (delta) =>
        delta.ventureId === result.ventureId &&
        delta.change === 4,
    ),
    true,
  );
  assert.equal(firstMessages?.length, 1);
  assert.match(
    firstMessages?.[0]?.content ?? "",
    /Mình đã phân tích Pitch Deck và Business Plan/,
  );
  assert.equal(
    result.aiWorkspaceBootstrap.session.onboarding
      ?.initialAnalysisPaneShown,
    false,
  );
});

test("replaying the same analysis run does not duplicate venture, evidence, or conversation", () => {
  const first = completeDocumentOnboarding(
    createDemoWorkspaceSeed(),
    input(),
  );
  const second = completeDocumentOnboarding(
    first.state,
    input(),
  );

  assert.equal(second.ventureId, first.ventureId);
  assert.equal(
    second.state.ventures.filter(
      (venture) => venture.id === first.ventureId,
    ).length,
    1,
  );
  assert.equal(
    second.state.evidence.filter(
      (evidence) =>
        evidence.ventureId === first.ventureId,
    ).length,
    4,
  );
  assert.equal(
    second.aiWorkspaceBootstrap.session.longRun?.sessions
      .length,
    1,
  );
});

test("workspace bootstrap persists the one-time analysis marker", () => {
  const result = completeDocumentOnboarding(
    createDemoWorkspaceSeed(),
    input(),
  );
  const raw = serializeAiWorkspaceBootstrap(
    null,
    result.aiWorkspaceBootstrap,
  );
  const envelope = parseAiWorkspaceEnvelope(raw);
  const persisted = envelope.sessions[result.ventureId];
  const onboarding =
    restoreWorkspaceOnboardingSession(persisted);

  assert.equal(onboarding.source, "document_analysis");
  assert.equal(onboarding.initialAnalysisPaneShown, false);

  const firstHydration =
    resolveInitialAnalysisPaneReveal(persisted);
  assert.equal(firstHydration.shouldReveal, true);
  assert.equal(
    firstHydration.layout.secondaryPaneMode,
    "analysis",
  );
  assert.equal(firstHydration.layout.analysisTab, "overview");
  assert.equal(
    firstHydration.onboarding.initialAnalysisPaneShown,
    true,
  );

  const consumed = {
    ...persisted,
    layout: firstHydration.layout,
    onboarding: firstHydration.onboarding,
  };
  const secondHydration =
    resolveInitialAnalysisPaneReveal(consumed);
  assert.equal(secondHydration.shouldReveal, false);
  assert.equal(
    secondHydration.onboarding.initialAnalysisPaneShown,
    true,
  );
});

test("workspace persistence rolls both stores back when the second write fails", () => {
  const result = completeDocumentOnboarding(
    createDemoWorkspaceSeed(),
    input(),
  );
  const values = new Map<string, string>([
    ["kizuna-founder-demo-workspace-v2", "workspace-before"],
    ["kizuna-founder-ai-workspace-demo-v1", "ai-before"],
  ]);
  let failAiWrite = true;
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      if (
        key === "kizuna-founder-ai-workspace-demo-v1" &&
        failAiWrite
      ) {
        failAiWrite = false;
        throw new Error("quota");
      }
      values.set(key, value);
    },
    removeItem: (key: string) => {
      values.delete(key);
    },
  };

  assert.throws(
    () =>
      persistDocumentOnboardingTransaction(storage, result),
    /quota/,
  );
  assert.equal(
    values.get("kizuna-founder-demo-workspace-v2"),
    "workspace-before",
  );
  assert.equal(
    values.get("kizuna-founder-ai-workspace-demo-v1"),
    "ai-before",
  );
});
