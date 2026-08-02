import assert from "node:assert/strict";
import test from "node:test";

import {
  getFilteredVentures,
  getNextActionForVenture,
  getVentureOverviewData,
  restoreDemoState,
  serializeDemoWorkspaceState,
} from "../../../../founder/venture-foundation/demo-repository";
import { createDemoWorkspaceSeed } from "../../../../founder/venture-foundation/demo-seed";
import { getFounderHomeViewModel } from "../../../../founder/home/lib/home-view-model";
import {
  addCycleTask,
  addSource,
  calculateChallengePriority,
  commitActionCycle,
  confirmBaseline,
  deferDecisionCandidate,
  excludeSource,
  getActiveActionCycle,
  getBaselineCompleteness,
  getChallengeItemsByType,
  getCurrentBaseline,
  getCurrentChallengeScan,
  getCycleTasksForExperiment,
  getDecisionCandidates,
  getDraftExperiment,
  getEvidenceRequirementsForExperiment,
  getExploreModeViewModel,
  getHighestPriorityChallengeItems,
  getReviewedSourcesForVenture,
  getSelectedCriticalDecision,
  getSourcesForVenture,
  rejectDecisionCandidate,
  respondToChallengeItem,
  saveFounderDecisionRationale,
  selectCriticalDecision,
  startActionCycle,
  updateBaselineField,
  updateExperimentPlan,
  updateSourceReviewStatus,
  validateExperimentPlan,
} from "..";
import {
  createDraftExperiment,
  runChallengeScan,
} from "../../infrastructure/mock/composed-commands";
import type {
  VentureWorkspaceState as DemoWorkspaceState,
} from "../model/venture-workspace-state";
import {
  assertOk,
  createSelectedDraft,
  scanVenture,
} from "./test-support";

test("selecting another candidate leaves exactly one active decision", () => {
  let state = scanVenture(
    createDemoWorkspaceSeed(),
    "venture-edubridge",
  );
  const candidates = getDecisionCandidates(
    state,
    "venture-edubridge",
  );
  assert.ok(candidates.length >= 2);

  let result = selectCriticalDecision(
    state,
    "venture-edubridge",
    candidates[0].id,
  );
  assertOk(result);
  state = result.state;
  const rationale = saveFounderDecisionRationale(
    state,
    "venture-edubridge",
    candidates[1].id,
    "This option tests the more consequential assumption first.",
  );
  assertOk(rationale);
  state = rationale.state;
  result = selectCriticalDecision(
    state,
    "venture-edubridge",
    candidates[1].id,
  );
  assertOk(result);

  assert.equal(
    result.state.decisions.filter(
      (decision) =>
        decision.ventureId === "venture-edubridge" &&
        decision.status === "selected",
    ).length,
    1,
  );
  assert.equal(
    getSelectedCriticalDecision(
      result.state,
      "venture-edubridge",
    )?.id,
    candidates[1].id,
  );
});

test("selecting a non-recommended decision requires a persisted founder rationale", () => {
  const state = scanVenture(
    createDemoWorkspaceSeed(),
    "venture-edubridge",
  );
  const candidate = getDecisionCandidates(
    state,
    "venture-edubridge",
  ).find((decision) => !decision.isRecommended);
  assert.ok(candidate);

  const blocked = selectCriticalDecision(
    state,
    "venture-edubridge",
    candidate.id,
  );
  assert.equal(blocked.ok, false);
  assert.equal(blocked.state, state);

  const rationale = saveFounderDecisionRationale(
    state,
    "venture-edubridge",
    candidate.id,
    "This candidate creates the fastest path to decision-quality evidence.",
  );
  assertOk(rationale);
  const selected = selectCriticalDecision(
    rationale.state,
    "venture-edubridge",
    candidate.id,
  );
  assertOk(selected);
  assert.equal(
    getSelectedCriticalDecision(
      selected.state,
      "venture-edubridge",
    )?.founderRationale,
    "This candidate creates the fastest path to decision-quality evidence.",
  );
});

test("the founder may reject the recommendation and defer another candidate", () => {
  let state = scanVenture(
    createDemoWorkspaceSeed(),
    "venture-edubridge",
  );
  const candidates = getDecisionCandidates(
    state,
    "venture-edubridge",
  );
  assert.ok(candidates.length >= 2);
  const rejected = rejectDecisionCandidate(
    state,
    "venture-edubridge",
    candidates[0].id,
  );
  assertOk(rejected);
  state = rejected.state;
  const deferred = deferDecisionCandidate(
    state,
    "venture-edubridge",
    candidates[1].id,
  );
  assertOk(deferred);

  assert.equal(
    deferred.state.decisions.find(
      (decision) => decision.id === candidates[0].id,
    )?.status,
    "rejected",
  );
  assert.equal(
    deferred.state.decisions.find(
      (decision) => decision.id === candidates[1].id,
    )?.status,
    "deferred",
  );
});

test("Explore mode exposes alternatives, trade-offs, unknowns, and decision-changing evidence", () => {
  const state = scanVenture(
    createDemoWorkspaceSeed(),
    "venture-edubridge",
  );
  const model = getExploreModeViewModel(
    state,
    "venture-edubridge",
  );

  assert.ok(model);
  assert.ok(model.hypotheses.length >= 2);
  assert.ok(
    model.hypotheses.every(
      (hypothesis) =>
        hypothesis.assumptions.length > 0 &&
        hypothesis.tradeOffs.length > 0,
    ),
  );
  assert.ok(model.decisionChangingEvidence.length > 0);
});
