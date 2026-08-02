import assert from "node:assert/strict";
import test from "node:test";

import {
  getFounderHomeViewModel,
} from "../../../founder/home/lib/home-view-model";
import {
  getFilteredVentures,
  getSupportRelationshipsForVenture,
  getVentureOverviewData,
} from "../../../founder/venture-foundation/demo-repository";
import { createDemoWorkspaceSeed } from "../../../founder/venture-foundation/demo-seed";
import {
  getVentureSwitchPath,
  isValidDirectVenture,
} from "../../../founder/venture-foundation/route-resolver";
import {
  commitActionCycle,
  getActiveCycleSummary,
  getChangeMyMindCriteria,
  getCriticalReviewItems,
  getDecisionComparisonModel,
  getDecisionLoopWorkflowState,
  getDraftExperiment,
  getImportantReviewItems,
  getReviewItems,
  getReviewSummary,
  getSelectedCriticalDecision,
  getSourcesForVenture,
  getSupportingReviewItems,
  respondToChallengeItem,
  saveFounderDecisionRationale,
  selectCriticalDecision,
  startActionCycle,
  updateCycleTask,
  updateDecisionChangeCriteria,
  validateExperimentPlan,
} from "../application";
import { createDraftExperiment } from "../infrastructure/mock/composed-commands";
import { CALL_TO_CASH_VENTURE_ID } from "../infrastructure/mock/fixtures/call-to-cash.fixture";
import { assertOk } from "../application/__tests__/test-support";

test("Call-to-Cash is a deterministic, PII-safe fifth canonical venture", () => {
  const first = createDemoWorkspaceSeed();
  const second = createDemoWorkspaceSeed();
  assert.deepEqual(first, second);
  assert.equal(first.ventures.length, 5);

  const venture = first.ventures.find(
    (candidate) => candidate.id === CALL_TO_CASH_VENTURE_ID,
  );
  assert.ok(venture);
  assert.equal(venture.name, "Call-to-Cash Risk Copilot");
  assert.equal(venture.stage, "functional-demo");
  assert.equal(venture.displayStage, "Hackathon MVP");
  assert.equal(venture.currentPhase, "buyer-validation");

  const [source] = getSourcesForVenture(
    first,
    CALL_TO_CASH_VENTURE_ID,
  );
  assert.ok(source);
  assert.equal(source.title, "NPN_Call_to_Cash.pdf");
  assert.equal(source.visibility, "private");
  assert.equal(source.provenance?.pageCount, 22);
  assert.equal(source.provenance?.personalDataDetected, true);
  assert.equal(source.provenance?.productContext, "high");
  assert.equal(source.provenance?.technicalContext, "high");
  assert.equal(source.provenance?.marketEvidence, "low");
  assert.equal(source.provenance?.commercialEvidence, "none");

  const callToCashDisplayData = JSON.stringify({
    venture,
    sources: first.sources.filter(
      (item) => item.ventureId === CALL_TO_CASH_VENTURE_ID,
    ),
    baselines: first.baselines.filter(
      (item) => item.ventureId === CALL_TO_CASH_VENTURE_ID,
    ),
    challenges: first.challengeItems.filter(
      (item) => item.ventureId === CALL_TO_CASH_VENTURE_ID,
    ),
    decisions: first.decisions.filter(
      (item) => item.ventureId === CALL_TO_CASH_VENTURE_ID,
    ),
  });
  assert.equal(
    /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/.test(callToCashDisplayData),
    false,
  );
});

test("Call-to-Cash review hierarchy and comparison labels are human-readable", () => {
  const state = createDemoWorkspaceSeed();
  const summary = getReviewSummary(
    state,
    CALL_TO_CASH_VENTURE_ID,
  );

  assert.deepEqual(summary, {
    criticalCount: 2,
    reviewedCriticalCount: 0,
    importantCount: 4,
    supportingCount: 5,
    criticalReviewComplete: false,
  });
  assert.equal(
    getCriticalReviewItems(state, CALL_TO_CASH_VENTURE_ID).length,
    2,
  );
  assert.equal(
    getImportantReviewItems(state, CALL_TO_CASH_VENTURE_ID).length,
    4,
  );
  assert.equal(
    getSupportingReviewItems(state, CALL_TO_CASH_VENTURE_ID).length,
    5,
  );
  assert.deepEqual(
    getReviewItems(state, CALL_TO_CASH_VENTURE_ID).map(
      ({ priority }) => priority,
    ),
    [
      "critical",
      "critical",
      "important",
      "important",
      "important",
      "important",
      "supporting",
      "supporting",
      "supporting",
      "supporting",
      "supporting",
    ],
  );
  assert.deepEqual(
    getDecisionComparisonModel(
      state,
      CALL_TO_CASH_VENTURE_ID,
    ).map(({ label }) => label),
    ["Recommended now", "Useful next", "Can wait"],
  );
});

test("Call-to-Cash moves from critical review to a committed active cycle without readiness gain", () => {
  let state = createDemoWorkspaceSeed();
  for (const { item } of getCriticalReviewItems(
    state,
    CALL_TO_CASH_VENTURE_ID,
  )) {
    const reviewed = respondToChallengeItem(
      state,
      CALL_TO_CASH_VENTURE_ID,
      item.id,
      "needs-evidence",
    );
    assertOk(reviewed);
    state = reviewed.state;
  }
  assert.equal(
    getDecisionLoopWorkflowState(
      state,
      CALL_TO_CASH_VENTURE_ID,
    ),
    "decision-comparison",
  );

  const [recommended] = getDecisionComparisonModel(
    state,
    CALL_TO_CASH_VENTURE_ID,
  );
  assert.ok(recommended?.decision.isRecommended);
  const rationale = saveFounderDecisionRationale(
    state,
    CALL_TO_CASH_VENTURE_ID,
    recommended.decision.id,
    "Buyer uncertainty blocks pilot design, pricing discovery, and first-product scope.",
    "2026-07-25T03:05:00.000Z",
  );
  assertOk(rationale);
  const selected = selectCriticalDecision(
    rationale.state,
    CALL_TO_CASH_VENTURE_ID,
    recommended.decision.id,
    "2026-07-25T03:06:00.000Z",
  );
  assertOk(selected);
  state = selected.state;

  const chosen = getSelectedCriticalDecision(
    state,
    CALL_TO_CASH_VENTURE_ID,
  );
  assert.ok(chosen);
  assert.equal(chosen.alternativeHypotheses?.length, 4);
  assert.equal(
    chosen.alternativeHypotheses?.filter(
      (hypothesis) => hypothesis.isNull,
    ).length,
    1,
  );
  assert.ok((chosen.distinguishingEvidence?.length ?? 0) > 0);
  const criteria = getChangeMyMindCriteria(chosen);
  assert.ok(criteria.length > 0);
  const criteriaSaved = updateDecisionChangeCriteria(
    state,
    CALL_TO_CASH_VENTURE_ID,
    chosen.id,
    criteria,
    "2026-07-25T03:07:00.000Z",
  );
  assertOk(criteriaSaved);

  const drafted = createDraftExperiment(
    criteriaSaved.state,
    CALL_TO_CASH_VENTURE_ID,
    "2026-07-25T03:08:00.000Z",
  );
  assertOk(drafted);
  state = drafted.state;
  const experiment = getDraftExperiment(
    state,
    CALL_TO_CASH_VENTURE_ID,
  );
  assert.ok(experiment);
  assert.equal(experiment.title, "Beachhead Buyer Validation Sprint");
  assert.equal(experiment.timeboxDays, 14);
  assert.equal(
    state.evidenceRequirements.filter(
      (item) => item.experimentId === experiment.id,
    ).length,
    5,
  );
  assert.equal(
    state.cycleTasks.filter(
      (item) => item.experimentId === experiment.id,
    ).length,
    6,
  );
  assert.deepEqual(
    validateExperimentPlan(
      state,
      CALL_TO_CASH_VENTURE_ID,
      experiment,
    ),
    [],
  );

  const readinessBefore = state.readinessDeltas;
  const committed = commitActionCycle(
    state,
    CALL_TO_CASH_VENTURE_ID,
    "2026-07-25T03:10:00.000Z",
  );
  assertOk(committed);
  assert.equal(committed.state.readinessDeltas, readinessBefore);
  const active = getActiveCycleSummary(
    committed.state,
    CALL_TO_CASH_VENTURE_ID,
  );
  assert.ok(active);
  assert.equal(active.cycle.status, "committed");
  assert.equal(active.founderRationale, chosen.founderRationale);
  assert.equal(active.requirements.length, 5);
  assert.equal(active.tasks.length, 6);

  const started = startActionCycle(
    committed.state,
    CALL_TO_CASH_VENTURE_ID,
    "2026-07-25T03:11:00.000Z",
  );
  assertOk(started);
  const completedTask = updateCycleTask(
    started.state,
    CALL_TO_CASH_VENTURE_ID,
    active.tasks[0].id,
    { status: "done" },
  );
  assertOk(completedTask);
  const progressed = getActiveCycleSummary(
    completedTask.state,
    CALL_TO_CASH_VENTURE_ID,
  );
  assert.equal(progressed?.completedTaskCount, 1);
  assert.equal(progressed?.cycle.progress, 17);
  assert.equal(
    completedTask.state.readinessDeltas,
    readinessBefore,
  );
});

test("Call-to-Cash appears in Projects, Home, Overview, routes, and support context", () => {
  const state = createDemoWorkspaceSeed();
  assert.deepEqual(
    getFilteredVentures(state, { query: "Call-to-Cash" }).map(
      (venture) => venture.id,
    ),
    [CALL_TO_CASH_VENTURE_ID],
  );
  assert.ok(
    getFounderHomeViewModel(state).otherActiveProjects.some(
      (venture) => venture.id === CALL_TO_CASH_VENTURE_ID,
    ),
  );
  state.currentUser.activeVentureId = CALL_TO_CASH_VENTURE_ID;
  state.currentUser.lastVisitedVentureId =
    CALL_TO_CASH_VENTURE_ID;
  const home = getFounderHomeViewModel(state);
  assert.equal(home.continuation?.ventureId, CALL_TO_CASH_VENTURE_ID);
  assert.equal(home.continuation?.stageLabel, "Hackathon MVP");
  assert.equal(home.continuation?.primaryAction.label, "Review findings");
  assert.equal(
    home.continuation?.primaryAction.href,
    `/founder/projects/${CALL_TO_CASH_VENTURE_ID}/cycle`,
  );
  const overview = getVentureOverviewData(
    state,
    CALL_TO_CASH_VENTURE_ID,
  );
  assert.ok(overview);
  assert.equal(overview.reviewSummary.criticalCount, 2);
  assert.equal(
    overview.action.targetPath,
    `/founder/projects/${CALL_TO_CASH_VENTURE_ID}/cycle`,
  );
  assert.equal(
    isValidDirectVenture(state, CALL_TO_CASH_VENTURE_ID),
    true,
  );
  assert.equal(
    getVentureSwitchPath(
      `/founder/projects/venture-kizuna-hub/cycle`,
      CALL_TO_CASH_VENTURE_ID,
    ),
    `/founder/projects/${CALL_TO_CASH_VENTURE_ID}/cycle`,
  );
  assert.deepEqual(
    getSupportRelationshipsForVenture(
      state,
      CALL_TO_CASH_VENTURE_ID,
    ).map(({ personName, role, source }) => ({
      personName,
      role,
      source,
    })),
    [
      {
        personName: "Ryan Tran",
        role: "program-mentor",
        source: "program",
      },
    ],
  );
});
