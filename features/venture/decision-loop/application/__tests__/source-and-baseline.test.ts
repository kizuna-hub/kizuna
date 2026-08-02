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

test("source selectors isolate ventures and select only confirmed sources", () => {
  const seed = createDemoWorkspaceSeed();
  const kizuna = getSourcesForVenture(
    seed,
    "venture-kizuna-hub",
  );
  const reviewed = getReviewedSourcesForVenture(
    seed,
    "venture-kizuna-hub",
  );

  assert.ok(kizuna.length > 0);
  assert.ok(
    kizuna.every(
      (source) => source.ventureId === "venture-kizuna-hub",
    ),
  );
  assert.ok(
    reviewed.every(
      (source) => source.reviewStatus === "confirmed",
    ),
  );
  assert.equal(
    reviewed.some(
      (source) => source.ventureId === "venture-caremind",
    ),
    false,
  );
});

test("source commands add, review, and exclude canonical records", () => {
  const seed = createDemoWorkspaceSeed();
  const added = addSource(seed, "venture-snapmoney", {
    title: "Compliance interview brief",
    kind: "founder-note",
    origin: "founder-authored",
    summary: "Questions for a regulated-finance specialist.",
    importedAt: "2026-07-25T03:00:00.000Z",
  });
  assertOk(added);
  assert.ok(added.sourceId);

  const reviewed = updateSourceReviewStatus(
    added.state,
    "venture-snapmoney",
    added.sourceId!,
    "confirmed",
  );
  assertOk(reviewed);
  assert.equal(
    reviewed.state.sources.find(
      (source) => source.id === added.sourceId,
    )?.reviewStatus,
    "confirmed",
  );

  const excluded = excludeSource(
    reviewed.state,
    "venture-snapmoney",
    added.sourceId!,
  );
  assertOk(excluded);
  assert.equal(
    excluded.state.sources.find(
      (source) => source.id === added.sourceId,
    )?.reviewStatus,
    "excluded",
  );
});

test("duplicate source titles are rejected within the same venture", () => {
  const seed = createDemoWorkspaceSeed();
  const duplicate = addSource(
    seed,
    "venture-kizuna-hub",
    {
      title: "  founder venture context  ",
      kind: "founder-note",
      origin: "founder-authored",
    },
  );

  assert.equal(duplicate.ok, false);
  assert.match(duplicate.errors.join(" "), /already exists/i);
});

test("baseline completeness enforces the minimum source-backed rule", () => {
  const seed = createDemoWorkspaceSeed();
  const kizuna = getBaselineCompleteness(
    seed,
    "venture-kizuna-hub",
  );
  assert.equal(kizuna.canRunChallengeScan, true);

  const withoutReviewedSources: DemoWorkspaceState = {
    ...seed,
    sources: seed.sources.map((source) =>
      source.ventureId === "venture-kizuna-hub"
        ? { ...source, reviewStatus: "unreviewed" as const }
        : source,
    ),
  };
  const incomplete = getBaselineCompleteness(
    withoutReviewedSources,
    "venture-kizuna-hub",
  );
  assert.equal(incomplete.canConfirm, false);
  assert.equal(incomplete.reviewedSourceCount, 0);
});

test("baseline edits invalidate a prior scan and confirmation creates a new version", () => {
  let state = scanVenture(
    createDemoWorkspaceSeed(),
    "venture-edubridge",
  );
  const oldScan = getCurrentChallengeScan(
    state,
    "venture-edubridge",
  );
  assert.ok(oldScan);

  const updated = updateBaselineField(
    state,
    "venture-edubridge",
    "currentGoal",
    { value: "Choose one buyer to test in the next 14 days." },
    "2026-07-25T04:00:00.000Z",
  );
  assertOk(updated);
  state = updated.state;
  assert.equal(
    state.challengeScans.find((scan) => scan.id === oldScan.id)
      ?.status,
    "superseded",
  );
  assert.equal(
    getCurrentBaseline(state, "venture-edubridge")?.status,
    "needs-update",
  );

  const confirmed = confirmBaseline(
    state,
    "venture-edubridge",
    {
      acknowledgeIncomplete: true,
      at: "2026-07-25T04:05:00.000Z",
    },
  );
  assertOk(confirmed);
  assert.equal(
    getCurrentBaseline(confirmed.state, "venture-edubridge")
      ?.version,
    "2",
  );
});

