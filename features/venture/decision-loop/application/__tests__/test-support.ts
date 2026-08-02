import assert from "node:assert/strict";

import type { VentureId } from "../../../core";
import { confirmBaseline } from "../commands/baseline-commands";
import {
  saveFounderDecisionRationale,
  selectCriticalDecision,
} from "../commands/decision-commands";
import { getDecisionCandidates } from "../queries/decision-queries";
import { getBaselineCompleteness } from "../services/baseline-completeness";
import type { VentureWorkspaceState } from "../model/venture-workspace-state";
import {
  createDraftExperiment,
  runChallengeScan,
} from "../../infrastructure/mock/composed-commands";
import { createDemoWorkspaceSeed } from "../../../../founder/venture-foundation/demo-seed";

export function assertOk<T extends { ok: boolean; errors: string[] }>(
  result: T,
): asserts result is T & { ok: true } {
  assert.equal(result.ok, true, result.errors.join(" "));
}

export function scanVenture(
  state: VentureWorkspaceState,
  ventureId: VentureId,
) {
  let next = state;
  const completeness = getBaselineCompleteness(next, ventureId);
  if (!completeness.canRunChallengeScan) {
    const confirmed = confirmBaseline(next, ventureId, {
      acknowledgeIncomplete: true,
      at: "2026-07-25T01:00:00.000Z",
    });
    assertOk(confirmed);
    next = confirmed.state;
  }
  const scan = runChallengeScan(next, ventureId);
  assertOk(scan);
  return scan.state;
}

export function createSelectedDraft(
  ventureId: VentureId = "venture-kizuna-hub",
) {
  let state = scanVenture(createDemoWorkspaceSeed(), ventureId);
  const decision = getDecisionCandidates(state, ventureId)[0];
  assert.ok(decision);
  const selected = selectCriticalDecision(
    state,
    ventureId,
    decision.id,
    "2026-07-25T02:00:00.000Z",
  );
  assertOk(selected);
  const rationale = saveFounderDecisionRationale(
    selected.state,
    ventureId,
    decision.id,
    "This decision removes the largest uncertainty blocking the next useful test.",
    "2026-07-25T02:02:00.000Z",
  );
  assertOk(rationale);
  state = rationale.state;
  const drafted = createDraftExperiment(
    state,
    ventureId,
    "2026-07-25T02:05:00.000Z",
  );
  assertOk(drafted);
  return drafted.state;
}
