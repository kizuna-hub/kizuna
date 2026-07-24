import assert from "node:assert/strict";
import test from "node:test";

import {
  getFilteredVentures,
  getNextActionForVenture,
  getVentureOverviewData,
  restoreDemoState,
  serializeDemoWorkspaceState,
} from "../../../founder/venture-foundation/demo-repository";
import { createDemoWorkspaceSeed } from "../../../founder/venture-foundation/demo-seed";
import { getFounderHomeViewModel } from "../../../founder/home/lib/home-view-model";
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
  selectCriticalDecision,
  startActionCycle,
  updateBaselineField,
  updateExperimentPlan,
  updateSourceReviewStatus,
  validateExperimentPlan,
} from "../application";
import {
  createDraftExperiment,
  runChallengeScan,
} from "../infrastructure/mock/composed-commands";
import type {
  VentureWorkspaceState as DemoWorkspaceState,
} from "../application/model/venture-workspace-state";
import {
  assertOk,
  createSelectedDraft,
  scanVenture,
} from "../application/__tests__/test-support";

test("Overview integration reflects the committed experiment summary", () => {
  const committed = commitActionCycle(
    createSelectedDraft(),
    "venture-kizuna-hub",
  );
  assertOk(committed);
  const overview = getVentureOverviewData(
    committed.state,
    "venture-kizuna-hub",
  );

  assert.equal(overview?.cycle?.status, "committed");
  assert.equal(overview?.experiment?.status, "committed");
  assert.ok((overview?.cycleTasks.length ?? 0) > 0);
  assert.ok((overview?.evidenceRequirements.length ?? 0) > 0);
});

test("Home and Projects selectors reflect a committed critical decision and next action", () => {
  const committed = commitActionCycle(
    createSelectedDraft(),
    "venture-kizuna-hub",
    "2026-07-25T07:00:00.000Z",
  );
  assertOk(committed);
  const home = getFounderHomeViewModel(committed.state);
  const project = getFilteredVentures(committed.state).find(
    (venture) => venture.id === "venture-kizuna-hub",
  );
  const action = getNextActionForVenture(
    committed.state,
    "venture-kizuna-hub",
  );

  assert.match(home.continuation?.cycleLabel ?? "", /committed/i);
  assert.equal(
    home.continuation?.decisionTitle,
    getSelectedCriticalDecision(
      committed.state,
      "venture-kizuna-hub",
    )?.title,
  );
  assert.equal(home.continuation?.primaryAction.label, "Start tasks");
  assert.ok(project);
  assert.equal(
    project.lastUpdatedAt,
    "2026-07-25T07:00:00.000Z",
  );
  assert.equal(action.kind, "start-cycle");
});

test("SnapMoney surfaces a compliance unknown without inventing mentor coverage", () => {
  const state = scanVenture(
    createDemoWorkspaceSeed(),
    "venture-snapmoney",
  );
  const unknownText = getChallengeItemsByType(
    state,
    "venture-snapmoney",
    "unknown",
  )
    .map((item) => `${item.title} ${item.explanation}`)
    .join(" ");

  assert.match(unknownText, /compliance|regulated/i);
  assert.equal(
    state.supportRelationships.some(
      (relationship) =>
        relationship.ventureId === "venture-snapmoney",
    ),
    false,
  );
});

test("EduBridge converts conflicting advice into explicit assumptions", () => {
  const state = scanVenture(
    createDemoWorkspaceSeed(),
    "venture-edubridge",
  );
  const contradictions = getChallengeItemsByType(
    state,
    "venture-edubridge",
    "contradiction",
  );
  const model = getExploreModeViewModel(
    state,
    "venture-edubridge",
  );

  assert.ok(contradictions.length > 0);
  assert.ok(
    model?.hypotheses.some(
      (hypothesis) => hypothesis.assumptions.length > 0,
    ),
  );
});

test("CareMind preserves the missing family-side evidence gap", () => {
  const state = scanVenture(
    createDemoWorkspaceSeed(),
    "venture-caremind",
  );
  const challengeText = getChallengeItemsByType(
    state,
    "venture-caremind",
  )
    .map((item) => `${item.title} ${item.explanation}`)
    .join(" ");

  assert.match(challengeText, /family/i);
  assert.match(challengeText, /evidence|unknown|unvalidated/i);
});

test("archived ventures fail safely and venture mutations remain isolated", () => {
  const seed = createDemoWorkspaceSeed();
  const archived: DemoWorkspaceState = {
    ...seed,
    ventures: seed.ventures.map((venture) =>
      venture.id === "venture-caremind"
        ? { ...venture, status: "archived" as const }
        : venture,
    ),
  };
  assert.equal(
    runChallengeScan(archived, "venture-caremind").ok,
    false,
  );

  const added = addSource(seed, "venture-kizuna-hub", {
    title: "Isolated note",
    kind: "founder-note",
    origin: "founder-authored",
  });
  assertOk(added);
  assert.deepEqual(
    getSourcesForVenture(added.state, "venture-caremind"),
    getSourcesForVenture(seed, "venture-caremind"),
  );
});
