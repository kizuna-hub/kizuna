import assert from "node:assert/strict";
import test from "node:test";

import {
  restoreDemoState,
  serializeDemoWorkspaceState,
} from "../../../founder/venture-foundation/demo-repository";
import { createDemoWorkspaceSeed } from "../../../founder/venture-foundation/demo-seed";
import {
  getBaselineCompleteness,
  getCurrentBaseline,
  getDecisionLoopWorkflowState,
  getSourcesForVenture,
} from "../application";

test("the canonical Decision Loop seed keeps its collection and workflow shape", () => {
  const state = createDemoWorkspaceSeed();

  assert.deepEqual(
    {
      ventures: state.ventures.length,
      sources: state.sources.length,
      baselines: state.baselines.length,
      challengeScans: state.challengeScans.length,
      challengeItems: state.challengeItems.length,
      decisions: state.decisions.length,
      experiments: state.experiments.length,
      evidenceRequirements: state.evidenceRequirements.length,
      cycleTasks: state.cycleTasks.length,
      actionCycles: state.actionCycles.length,
    },
    {
      ventures: 5,
      sources: 13,
      baselines: 5,
      challengeScans: 1,
      challengeItems: 11,
      decisions: 7,
      experiments: 1,
      evidenceRequirements: 1,
      cycleTasks: 3,
      actionCycles: 1,
    },
  );

  assert.deepEqual(
    state.ventures.map((venture) => ({
      id: venture.id,
      sourceCount: getSourcesForVenture(state, venture.id).length,
      baselineVersion: getCurrentBaseline(state, venture.id)?.version,
      workflow: getDecisionLoopWorkflowState(state, venture.id),
      canRunChallengeScan:
        getBaselineCompleteness(state, venture.id).canRunChallengeScan,
    })),
    [
      {
        id: "venture-kizuna-hub",
        sourceCount: 4,
        baselineVersion: "1",
        workflow: "review-ready",
        canRunChallengeScan: true,
      },
      {
        id: "venture-snapmoney",
        sourceCount: 3,
        baselineVersion: "1",
        workflow: "context-review",
        canRunChallengeScan: false,
      },
      {
        id: "venture-edubridge",
        sourceCount: 3,
        baselineVersion: "1",
        workflow: "review-ready",
        canRunChallengeScan: true,
      },
      {
        id: "venture-caremind",
        sourceCount: 2,
        baselineVersion: "1",
        workflow: "review-ready",
        canRunChallengeScan: true,
      },
      {
        id: "call-to-cash-risk-copilot",
        sourceCount: 1,
        baselineVersion: "1",
        workflow: "review-in-progress",
        canRunChallengeScan: false,
      },
    ],
  );
});

test("Decision Loop collections retain exact persistence parity", () => {
  const state = createDemoWorkspaceSeed();
  const restored = restoreDemoState(serializeDemoWorkspaceState(state));

  assert.deepEqual(
    {
      sources: restored.sources,
      baselines: restored.baselines,
      challengeScans: restored.challengeScans,
      challengeItems: restored.challengeItems,
      decisions: restored.decisions,
      experiments: restored.experiments,
      evidenceRequirements: restored.evidenceRequirements,
      cycleTasks: restored.cycleTasks,
      actionCycles: restored.actionCycles,
    },
    {
      sources: state.sources,
      baselines: state.baselines,
      challengeScans: state.challengeScans,
      challengeItems: state.challengeItems,
      decisions: state.decisions,
      experiments: state.experiments,
      evidenceRequirements: state.evidenceRequirements,
      cycleTasks: state.cycleTasks,
      actionCycles: state.actionCycles,
    },
  );
});

test("the four established venture scenarios retain their canonical identities", () => {
  const state = createDemoWorkspaceSeed();
  const establishedVentureIds = [
    "venture-kizuna-hub",
    "venture-snapmoney",
    "venture-edubridge",
    "venture-caremind",
  ];

  assert.deepEqual(
    establishedVentureIds.map((ventureId) => ({
      venture: state.ventures.find(
        (candidate) => candidate.id === ventureId,
      )?.name,
      sources: getSourcesForVenture(state, ventureId).map(
        (source) => source.id,
      ),
      baseline: getCurrentBaseline(state, ventureId)?.id,
    })),
    [
      {
        venture: "Kizuna Hub",
        sources: [
          "source-kizuna-mentor-note",
          "source-kizuna-program-brief",
          "source-kizuna-program-interviews",
          "source-kizuna-founder-context",
        ],
        baseline: "baseline-kizuna",
      },
      {
        venture: "SnapMoney",
        sources: [
          "source-snapmoney-ai-brief",
          "source-snapmoney-api-research",
          "source-snapmoney-prototype",
        ],
        baseline: "baseline-snapmoney",
      },
      {
        venture: "EduBridge",
        sources: [
          "source-edubridge-founder-direct-advice",
          "source-edubridge-university-advice",
          "source-edubridge-founder-context",
        ],
        baseline: "baseline-edubridge",
      },
      {
        venture: "CareMind",
        sources: [
          "source-caremind-concept",
          "source-caremind-end-user-interviews",
        ],
        baseline: "baseline-caremind",
      },
    ],
  );
});
