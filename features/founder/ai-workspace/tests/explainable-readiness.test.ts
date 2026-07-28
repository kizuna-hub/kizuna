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
import {
  baselineMentorRecommendation,
  createAiWorkspaceScenarioState,
} from "../demo/demo-scenarios";
import { createLongRunDemoState } from "../demo/demo-long-run-data";
import { aiWorkspaceReducer } from "../state/ai-workspace-reducer";
import {
  restoreAiSession,
  toPersistedSession,
} from "../state/ai-workspace-persistence";

test("seven weighted criteria calculate the canonical readiness score 61", () => {
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
    61,
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
  const disputed =
    novaLabsReadinessAssessment.criteria
      .find((criterion) => criterion.id === "customer_evidence")
      ?.contributions.find(
        (contribution) => contribution.status === "disputed",
      );
  assert.ok(disputed);
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

test("criterion caps are enforced without mutating the source assessment or projection", () => {
  const traction = novaLabsReadinessCriteria.find(
    (criterion) =>
      criterion.id === "traction_and_business_model",
  );
  assert.ok(traction);
  const projected = structuredClone(novaLabsReadinessAssessment);
  projected.projection = {
    label: "Dự kiến · Chưa cập nhật điểm hiện tại",
    overallRange: [65, 69],
    assumptions: ["Activation ≥25%", "Retention tuần 2 ≥15%"],
  };
  const canonicalBefore =
    novaLabsReadinessAssessment.overallScore;
  const score = getEffectiveCriterionScore({
    ...traction,
    score: 88,
  });
  assert.equal(score, 60);
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
  assert.ok(
    novaLabsReadinessAssessment.history.some(
      (entry) => entry.type === "rubric_version",
    ),
  );
  assert.equal(
    hasRubricVersionWarning(
      novaLabsReadinessAssessment.history,
    ),
    true,
  );
  const decreased = disputeContribution(
    structuredClone(novaLabsReadinessAssessment),
    "pitch-target-customer",
    "2026-07-28T08:00:00.000Z",
  );
  assert.equal(decreased.history[0]?.type, "evidence_disputed");
  assert.ok(decreased.overallScore < 61);
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
    detectAiWorkspaceIntent("Đánh giá traction hiện tại"),
    "assess-traction",
  );
  assert.equal(
    detectAiWorkspaceIntent("Tìm mentor phù hợp"),
    "recommend-mentor",
  );
});

test("decision cycles and mentor connection requests are idempotent", () => {
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

  const withMentor = {
    ...activeAgain,
    mentorRecommendation: structuredClone(
      baselineMentorRecommendation,
    ),
  };
  const request = {
    id: "connection-mentor-jessica-lin",
    mentorId: "mentor-jessica-lin",
    mentorName: "Jessica Lin",
    goal: "Review activation pilot",
    context: "Nova Labs",
    message: "Xin chào Jessica",
    status: "draft" as const,
  };
  const created = aiWorkspaceReducer(withMentor, {
    type: "create-mentor-connection",
    request,
  });
  const duplicate = aiWorkspaceReducer(created, {
    type: "create-mentor-connection",
    request: { ...request, id: "duplicate-request" },
  });
  assert.equal(
    duplicate.mentorConnectionRequest?.id,
    request.id,
  );
  const sent = aiWorkspaceReducer(duplicate, {
    type: "send-mentor-connection",
  });
  const sentAgain = aiWorkspaceReducer(sent, {
    type: "send-mentor-connection",
  });
  assert.equal(sentAgain.mentorConnectionRequest?.status, "sent");
  assert.equal(
    sentAgain.mentorConnectionRequest?.id,
    request.id,
  );
});

test("verified activation evidence updates canonical readiness from 61 to 66 once", () => {
  const initial = createAiWorkspaceScenarioState(
    "venture-nova-labs",
  );
  const criterionIds = [
    "customer_evidence",
    "solution_validation",
    "traction_and_business_model",
    "decision_and_execution",
  ] as const;
  const verified = aiWorkspaceReducer(initial, {
    type: "verify-readiness-evidence",
    criterionIds: [...criterionIds],
  });
  assert.equal(verified.readiness.currentScore, 66);
  assert.equal(
    verified.readiness.assessment.history[0]?.type,
    "increase",
  );
  assert.equal(
    verified.readiness.assessment.criteria.find(
      (criterion) => criterion.id === "solution_validation",
    )?.score,
    61,
  );
  assert.equal(
    verified.readiness.assessment.criteria.find(
      (criterion) => criterion.id === "decision_and_execution",
    )?.score,
    74,
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
