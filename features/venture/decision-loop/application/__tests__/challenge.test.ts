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

test("challenge priority is deterministic and rewards impact, uncertainty, urgency, and control", () => {
  const low = calculateChallengePriority({
    impact: "low",
    uncertainty: "low",
    urgency: "low",
    controllability: "low",
  });
  const high = calculateChallengePriority({
    impact: "high",
    uncertainty: "high",
    urgency: "high",
    controllability: "high",
  });

  assert.equal(
    calculateChallengePriority({
      impact: "high",
      uncertainty: "high",
      urgency: "high",
      controllability: "high",
    }),
    high,
  );
  assert.ok(high > low);
});

test("the Challenge Scan is deterministic for the same baseline", () => {
  const first = scanVenture(
    createDemoWorkspaceSeed(),
    "venture-kizuna-hub",
  );
  const second = scanVenture(
    createDemoWorkspaceSeed(),
    "venture-kizuna-hub",
  );

  assert.deepEqual(
    getChallengeItemsByType(first, "venture-kizuna-hub"),
    getChallengeItemsByType(second, "venture-kizuna-hub"),
  );
  assert.deepEqual(
    getDecisionCandidates(first, "venture-kizuna-hub"),
    getDecisionCandidates(second, "venture-kizuna-hub"),
  );
});

test("an AI-only reviewed source cannot turn a seeded claim into a verified fact", () => {
  const seed = createDemoWorkspaceSeed();
  const aiOnly: DemoWorkspaceState = {
    ...seed,
    sources: seed.sources.map((source) => {
      if (source.ventureId !== "venture-kizuna-hub") {
        return source;
      }
      if (source.id === "source-kizuna-founder-context") {
        return {
          ...source,
          origin: "ai-generated" as const,
          aiContribution: "generated" as const,
          reviewStatus: "confirmed" as const,
        };
      }
      return { ...source, reviewStatus: "excluded" as const };
    }),
    challengeScans: [],
    challengeItems: [],
  };
  const completeness = getBaselineCompleteness(
    aiOnly,
    "venture-kizuna-hub",
  );
  assert.equal(completeness.allReviewedSourcesAreAiGenerated, true);
  const scanned = runChallengeScan(
    aiOnly,
    "venture-kizuna-hub",
  );
  assertOk(scanned);

  const items = getChallengeItemsByType(
    scanned.state,
    "venture-kizuna-hub",
  );
  assert.equal(
    items.some(
      (item) =>
        item.type === "fact" &&
        item.sourceIds.some(
          (sourceId) =>
            scanned.state.sources.find(
              (source) => source.id === sourceId,
            )?.origin === "ai-generated",
        ),
    ),
    false,
  );
  assert.ok(
    items.some((item) => item.type === "ai-inference"),
  );
});

test("challenge selectors group by type and rank priority", () => {
  const state = scanVenture(
    createDemoWorkspaceSeed(),
    "venture-kizuna-hub",
  );
  const unknowns = getChallengeItemsByType(
    state,
    "venture-kizuna-hub",
    "unknown",
  );
  const highest = getHighestPriorityChallengeItems(
    state,
    "venture-kizuna-hub",
    3,
  );

  assert.ok(unknowns.length > 0);
  assert.ok(
    unknowns.every((item) => item.type === "unknown"),
  );
  assert.equal(highest.length, 3);
  assert.ok(
    highest[0].priorityScore >= highest[1].priorityScore,
  );
});

test("founder responses move a fully reviewed scan to reviewed", () => {
  let state = scanVenture(
    createDemoWorkspaceSeed(),
    "venture-caremind",
  );
  const items = getChallengeItemsByType(
    state,
    "venture-caremind",
  );
  for (const item of items) {
    const result = respondToChallengeItem(
      state,
      "venture-caremind",
      item.id,
      item.type === "unknown" ? "needs-evidence" : "agree",
    );
    assertOk(result);
    state = result.state;
  }

  assert.equal(
    getCurrentChallengeScan(state, "venture-caremind")?.status,
    "reviewed",
  );
});

test("the founder can challenge an assumption and mark an unknown as needing evidence", () => {
  let state = scanVenture(
    createDemoWorkspaceSeed(),
    "venture-kizuna-hub",
  );
  const assumption = getChallengeItemsByType(
    state,
    "venture-kizuna-hub",
    "assumption",
  )[0];
  const unknown = getChallengeItemsByType(
    state,
    "venture-kizuna-hub",
    "unknown",
  )[0];
  assert.ok(assumption);
  assert.ok(unknown);

  let result = respondToChallengeItem(
    state,
    "venture-kizuna-hub",
    assumption.id,
    "challenge",
  );
  assertOk(result);
  state = result.state;
  result = respondToChallengeItem(
    state,
    "venture-kizuna-hub",
    unknown.id,
    "needs-evidence",
  );
  assertOk(result);

  assert.equal(
    result.state.challengeItems.find(
      (item) => item.id === assumption.id,
    )?.founderResponse,
    "challenge",
  );
  assert.equal(
    result.state.challengeItems.find(
      (item) => item.id === unknown.id,
    )?.founderResponse,
    "needs-evidence",
  );
});

test("equal-priority low-confidence risks retain a stable identifier order", () => {
  const scanned = scanVenture(
    createDemoWorkspaceSeed(),
    "venture-caremind",
  );
  const current = getCurrentChallengeScan(
    scanned,
    "venture-caremind",
  )!;
  const tied: DemoWorkspaceState = {
    ...scanned,
    challengeItems: scanned.challengeItems.map((item) =>
      current.itemIds.includes(item.id)
        ? {
            ...item,
            priorityScore: 50,
            confidence: "low" as const,
          }
        : item,
    ),
  };
  const highest = getHighestPriorityChallengeItems(
    tied,
    "venture-caremind",
    current.itemIds.length,
  );

  assert.deepEqual(
    highest.map((item) => item.id),
    [...current.itemIds].sort(),
  );
  assert.ok(
    highest.every((item) => item.confidence === "low"),
  );
});

