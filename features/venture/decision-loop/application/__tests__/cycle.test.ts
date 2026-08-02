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
  getDecisionLoopWorkflowState,
  getDraftExperiment,
  getEvidenceRequirementsForExperiment,
  getExploreModeViewModel,
  getHighestPriorityChallengeItems,
  getReviewedSourcesForVenture,
  getSelectedCriticalDecision,
  getSourcesForVenture,
  rejectDecisionCandidate,
  respondToChallengeItem,
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

test("a selected decision derives one linked draft experiment", () => {
  const state = createSelectedDraft("venture-caremind");
  const selected = getSelectedCriticalDecision(
    state,
    "venture-caremind",
  );
  const draft = getDraftExperiment(state, "venture-caremind");

  assert.ok(selected);
  assert.ok(draft);
  assert.equal(draft.decisionId, selected.id);
  assert.ok(
    getEvidenceRequirementsForExperiment(state, draft.id).length >
      0,
  );
  assert.ok(
    getCycleTasksForExperiment(state, draft.id).length > 0,
  );
});

test("duplicate cycle tasks are rejected", () => {
  const state = createSelectedDraft();
  const draft = getDraftExperiment(
    state,
    "venture-kizuna-hub",
  )!;
  const existing = getCycleTasksForExperiment(
    state,
    draft.id,
  )[0];
  assert.ok(existing);

  const duplicate = addCycleTask(
    state,
    "venture-kizuna-hub",
    draft.id,
    {
      title: existing.title.toUpperCase(),
      ownerId: state.currentUser.id,
    },
  );
  assert.equal(duplicate.ok, false);
});

test("an incomplete experiment cannot commit", () => {
  let state = createSelectedDraft();
  const draft = getDraftExperiment(
    state,
    "venture-kizuna-hub",
  )!;
  const updated = updateExperimentPlan(
    state,
    "venture-kizuna-hub",
    draft.id,
    { title: "", method: "" },
  );
  assertOk(updated);
  state = updated.state;

  const committed = commitActionCycle(
    state,
    "venture-kizuna-hub",
  );
  assert.equal(committed.ok, false);
  assert.ok(
    committed.errors.some((error) =>
      error.includes("title"),
    ),
  );
});

test("missing owner, evidence requirement, or exit criteria prevents commitment", () => {
  const base = createSelectedDraft();
  const draft = getDraftExperiment(
    base,
    "venture-kizuna-hub",
  )!;

  const noOwner = updateExperimentPlan(
    base,
    "venture-kizuna-hub",
    draft.id,
    { ownerId: "" },
  );
  assertOk(noOwner);
  assert.ok(
    validateExperimentPlan(
      noOwner.state,
      "venture-kizuna-hub",
      getDraftExperiment(
        noOwner.state,
        "venture-kizuna-hub",
      ),
    ).some((error) => error.includes("Owner")),
  );

  const noEvidence: DemoWorkspaceState = {
    ...base,
    evidenceRequirements: base.evidenceRequirements.filter(
      (requirement) => requirement.experimentId !== draft.id,
    ),
  };
  assert.equal(
    commitActionCycle(noEvidence, "venture-kizuna-hub").ok,
    false,
  );

  const noExit = updateExperimentPlan(
    base,
    "venture-kizuna-hub",
    draft.id,
    { exitCriteria: [] },
  );
  assertOk(noExit);
  assert.equal(
    commitActionCycle(
      noExit.state,
      "venture-kizuna-hub",
    ).ok,
    false,
  );

  const invalidTimebox = updateExperimentPlan(
    base,
    "venture-kizuna-hub",
    draft.id,
    { timeboxDays: 0 },
  );
  assertOk(invalidTimebox);
  assert.equal(
    commitActionCycle(
      invalidTimebox.state,
      "venture-kizuna-hub",
    ).ok,
    false,
  );
});

test("committing links the decision, experiment, tasks, and evidence targets without readiness gain", () => {
  const state = createSelectedDraft();
  const readinessBefore = state.readinessDeltas;
  const committed = commitActionCycle(
    state,
    "venture-kizuna-hub",
    "2026-07-25T05:00:00.000Z",
  );
  assertOk(committed);

  const cycle = getActiveActionCycle(
    committed.state,
    "venture-kizuna-hub",
  );
  const decision = getSelectedCriticalDecision(
    committed.state,
    "venture-kizuna-hub",
  );
  assert.ok(cycle);
  assert.equal(cycle.status, "committed");
  assert.equal(decision?.status, "committed");
  assert.ok(cycle.experimentId);
  assert.ok((cycle.taskIds?.length ?? 0) > 0);
  assert.ok((cycle.evidenceRequirementIds?.length ?? 0) > 0);
  assert.equal(committed.state.readinessDeltas, readinessBefore);
});

test("a committed cycle becomes the active selector and blocks silent replacement", () => {
  let state = createSelectedDraft();
  const committed = commitActionCycle(
    state,
    "venture-kizuna-hub",
  );
  assertOk(committed);
  state = committed.state;
  const candidates = getDecisionCandidates(
    state,
    "venture-kizuna-hub",
  );
  const other = candidates.find(
    (candidate) =>
      candidate.id !==
      getSelectedCriticalDecision(
        state,
        "venture-kizuna-hub",
      )?.id,
  );
  assert.ok(other);

  const replacement = selectCriticalDecision(
    state,
    "venture-kizuna-hub",
    other.id,
  );
  assert.equal(replacement.ok, false);
  assert.equal(
    getActiveActionCycle(state, "venture-kizuna-hub")?.status,
    "committed",
  );
});

test("starting a committed cycle updates next action but not evidence readiness", () => {
  const committed = commitActionCycle(
    createSelectedDraft(),
    "venture-kizuna-hub",
  );
  assertOk(committed);
  const readinessBefore = committed.state.readinessDeltas;
  const started = startActionCycle(
    committed.state,
    "venture-kizuna-hub",
    "2026-07-25T06:00:00.000Z",
  );
  assertOk(started);

  assert.equal(
    getActiveActionCycle(
      started.state,
      "venture-kizuna-hub",
    )?.status,
    "in-progress",
  );
  assert.equal(
    getDecisionLoopWorkflowState(
      started.state,
      "venture-kizuna-hub",
    ),
    "cycle-in-progress",
  );
  assert.equal(
    getNextActionForVenture(
      started.state,
      "venture-kizuna-hub",
    ).label,
    "Continue the active action cycle",
  );
  assert.equal(started.state.readinessDeltas, readinessBefore);
});

test("a committed cycle survives serialization and refresh restore", () => {
  const committed = commitActionCycle(
    createSelectedDraft(),
    "venture-kizuna-hub",
    "2026-07-25T06:30:00.000Z",
  );
  assertOk(committed);
  const restored = restoreDemoState(
    serializeDemoWorkspaceState(committed.state),
  );

  assert.equal(
    getActiveActionCycle(restored, "venture-kizuna-hub")
      ?.status,
    "committed",
  );
  assert.equal(
    getSelectedCriticalDecision(
      restored,
      "venture-kizuna-hub",
    )?.status,
    "committed",
  );
});
