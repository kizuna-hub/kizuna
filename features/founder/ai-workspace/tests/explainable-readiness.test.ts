import assert from "node:assert/strict";
import test from "node:test";

import {
  novaLabsReadinessAssessment,
  novaLabsReadinessCriteria,
} from "../readiness/demo/readiness-demo-data";
import {
  calculateOverallReadiness,
  deriveCriterionConfidence,
  disputeContribution,
  getCountedContributions,
  getEffectiveCriterionScore,
  hasRubricVersionWarning,
} from "../readiness/services/readiness-calculator";
import type { ReadinessContribution } from "../readiness/types/readiness.types";
import {
  detectAiWorkspaceIntent,
} from "../demo/mock-ai-engine";
import { createAiWorkspaceScenarioState } from "../demo/demo-scenarios";
import { createLongRunDemoState } from "../demo/demo-long-run-data";
import { aiWorkspaceReducer } from "../state/ai-workspace-reducer";
import {
  restoreAiSession,
  toPersistedSession,
} from "../state/ai-workspace-persistence";

test("seven prototype-stage criteria calculate the canonical CampusFlow readiness score 65", () => {
  assert.equal(novaLabsReadinessCriteria.length, 7);
  assert.equal(
    novaLabsReadinessCriteria.reduce(
      (sum, criterion) => sum + criterion.weight,
      0,
    ),
    100,
  );
  assert.equal(
    calculateOverallReadiness(novaLabsReadinessCriteria),
    65,
  );
});

test("duplicate contributions with the same dedupe key count once", () => {
  const source =
    novaLabsReadinessCriteria[0].contributions[0];
  assert.equal(
    getCountedContributions([
      source,
      { ...source, id: "duplicate-source" },
    ]).length,
    1,
  );
});

test("disputed contributions are excluded and outdated evidence lowers confidence", () => {
  const disputed: ReadinessContribution = {
    ...novaLabsReadinessCriteria[1].contributions[0],
    status: "disputed",
  };
  assert.equal(getCountedContributions([disputed]).length, 0);

  const outdated: ReadinessContribution = {
    ...novaLabsReadinessCriteria[0].contributions[0],
    id: "outdated-contribution",
    status: "outdated",
    confidence: "medium",
    freshnessDays: 83,
    dedupeKey: "outdated-contribution",
  };
  assert.equal(deriveCriterionConfidence([outdated]), "low");
});

test("projected scores do not mutate the canonical readiness assessment", () => {
  const marketSignal = novaLabsReadinessCriteria.find(
    (criterion) =>
      criterion.id === "market_signal_and_commitment",
  );
  assert.ok(marketSignal);
  const projected = structuredClone(novaLabsReadinessAssessment);
  projected.projection = {
    label: "Dự kiến · Chưa cập nhật điểm hiện tại",
    overallRange: [65, 69],
    assumptions: ["Activation ≥25%", "Retention tuần 2 ≥15%"],
  };
  const canonicalBefore =
    novaLabsReadinessAssessment.overallScore;
  const score = getEffectiveCriterionScore({
    ...marketSignal,
    score: 88,
  });
  assert.equal(score, 88);
  assert.equal(
    novaLabsReadinessAssessment.overallScore,
    canonicalBefore,
  );
  assert.equal(projected.projection.overallRange[0], 65);
});

test("history supports increase, decrease and rubric comparison warnings", () => {
  assert.ok(
    novaLabsReadinessAssessment.history.some(
      (entry) => entry.type === "increase",
    ),
  );
  assert.equal(
    hasRubricVersionWarning(
      novaLabsReadinessAssessment.history,
    ),
    false,
  );
  const decreased = disputeContribution(
    structuredClone(novaLabsReadinessAssessment),
    "campusflow-problem-page-4",
    "2026-07-28T08:00:00.000Z",
  );
  assert.equal(decreased.history[0]?.type, "evidence_disputed");
  assert.ok(decreased.overallScore < 65);
  assert.ok(decreased.delta < 0);
});

test("primary founder prompts resolve to deterministic scenario intents", () => {
  assert.equal(
    detectAiWorkspaceIntent(
      "Phân tích pitch deck và cách cải thiện",
    ),
    "analyze-materials",
  );
  assert.equal(
    detectAiWorkspaceIntent("Tôi nên làm gì tiếp theo?"),
    "suggest-action",
  );
  assert.equal(
    detectAiWorkspaceIntent("Đánh giá tín hiệu thị trường"),
    "assess-traction",
  );
  assert.equal(
    detectAiWorkspaceIntent("Tìm mentor phù hợp"),
    "recommend-mentor",
  );
});

test("decision cycles are idempotent", () => {
  const initial = createAiWorkspaceScenarioState(
    "venture-nova-labs",
  );
  const active = aiWorkspaceReducer(initial, {
    type: "activate-decision-cycle",
  });
  const activeAgain = aiWorkspaceReducer(active, {
    type: "activate-decision-cycle",
  });
  assert.equal(activeAgain.decisionCycleLifecycle, "active");
  assert.equal(activeAgain.decisionCycle.id, active.decisionCycle.id);

});

test("verified pilot evidence updates the canonical criteria once", () => {
  const initial = createAiWorkspaceScenarioState(
    "venture-nova-labs",
  );
  const criterionIds = [
    "customer_discovery_and_evidence",
    "prototype_and_learning",
    "market_signal_and_commitment",
    "experiment_and_execution_discipline",
  ] as const;
  const verified = aiWorkspaceReducer(initial, {
    type: "verify-readiness-evidence",
    criterionIds: [...criterionIds],
  });
  assert.ok(verified.readiness.currentScore > 65);
  assert.equal(
    verified.readiness.assessment.history[0]?.type,
    "increase",
  );
  assert.equal(
    verified.readiness.assessment.criteria.find(
      (criterion) => criterion.id === "prototype_and_learning",
    )?.score,
    63,
  );
  assert.equal(
    verified.readiness.assessment.criteria.find(
      (criterion) =>
        criterion.id ===
        "experiment_and_execution_discipline",
    )?.score,
    75,
  );
  const duplicate = aiWorkspaceReducer(verified, {
    type: "verify-readiness-evidence",
    criterionIds: [...criterionIds],
  });
  assert.equal(
    duplicate.readiness.assessment.history.length,
    verified.readiness.assessment.history.length,
  );
});

test("the selected AI model survives venture-scoped persistence", () => {
  const ventureId = "venture-nova-labs";
  const initial = createAiWorkspaceScenarioState(ventureId);
  const selected = aiWorkspaceReducer(initial, {
    type: "set-ai-model",
    modelId: "kizuna-max",
  });
  const persisted = toPersistedSession(
    selected,
    createLongRunDemoState(ventureId),
  );
  const restored = restoreAiSession(ventureId, persisted);
  assert.equal(restored.selectedModel, "kizuna-max");
});
