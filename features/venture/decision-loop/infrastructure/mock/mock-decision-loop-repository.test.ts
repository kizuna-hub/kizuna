import assert from "node:assert/strict";
import test from "node:test";

import { createDemoWorkspaceSeed } from "../../../../founder/venture-foundation/demo-seed";
import type { VentureWorkspaceState } from "../../application";
import { createMockDecisionLoopRepository } from "./mock-decision-loop-repository";

test("the mock repository executes business use cases through the port", async () => {
  let state: VentureWorkspaceState = createDemoWorkspaceSeed();
  const untouchedSnapMoneySources = state.sources.filter(
    (source) => source.ventureId === "venture-snapmoney",
  );
  const repository = createMockDecisionLoopRepository({
    read: () => state,
    commit: (nextState) => {
      state = nextState;
    },
  });

  const result = await repository.runChallengeScan(
    "venture-kizuna-hub",
  );

  assert.equal(result.ok, true, result.errors.join(" "));
  assert.equal(
    state.challengeScans.filter(
      (scan) => scan.ventureId === "venture-kizuna-hub",
    ).length,
    1,
  );
  assert.deepEqual(
    state.sources.filter(
      (source) => source.ventureId === "venture-snapmoney",
    ),
    untouchedSnapMoneySources,
  );
});

test("business validation failures resolve without mutating state", async () => {
  let state: VentureWorkspaceState = createDemoWorkspaceSeed();
  const before = state;
  const repository = createMockDecisionLoopRepository({
    read: () => state,
    commit: (nextState) => {
      state = nextState;
    },
  });

  const result = await repository.startActionCycle(
    "venture-snapmoney",
  );

  assert.equal(result.ok, false);
  assert.deepEqual(result.errors, [
    "A committed cycle is required before starting.",
  ]);
  assert.equal(state, before);
});
