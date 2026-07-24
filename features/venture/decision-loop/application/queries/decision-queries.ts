import type { VentureId } from "../../../core";
import type { VentureDecision } from "../../domain";
import type { VentureWorkspaceState } from "../model/venture-workspace-state";
import { rankDecisionCandidates } from "../services/decision-ranking";
import { getCurrentChallengeScan } from "./challenge-queries";
import { getVenture } from "../services/workspace-state-utils";

export function getDecisionCandidates(
  state: VentureWorkspaceState,
  ventureId: VentureId,
) {
  const scan = getCurrentChallengeScan(state, ventureId);
  if (!scan) return [];
  const byId = new Map(
    state.decisions
      .filter((decision) => decision.ventureId === ventureId)
      .map((decision) => [decision.id, decision]),
  );
  return rankDecisionCandidates(
    scan.candidateDecisionIds
      .map((id) => byId.get(id))
      .filter((decision): decision is VentureDecision =>
        Boolean(decision),
      ),
  );
}

export function getSelectedCriticalDecision(
  state: VentureWorkspaceState,
  ventureId: VentureId,
) {
  const venture = getVenture(state, ventureId);
  if (!venture?.activeDecisionId) return undefined;
  return state.decisions.find(
    (decision) =>
      decision.id === venture.activeDecisionId &&
      decision.ventureId === ventureId &&
      (decision.status === "selected" ||
        decision.status === "committed"),
  );
}

function challengeItemsByIds(
  state: VentureWorkspaceState,
  ids: string[] = [],
) {
  const idSet = new Set(ids);
  return state.challengeItems.filter((item) => idSet.has(item.id));
}

export function getExploreModeViewModel(
  state: VentureWorkspaceState,
  ventureId: VentureId,
  decisionId?: string,
) {
  const decision =
    state.decisions.find(
      (candidate) =>
        candidate.id === decisionId &&
        candidate.ventureId === ventureId,
    ) ??
    getSelectedCriticalDecision(state, ventureId) ??
    getDecisionCandidates(state, ventureId)[0];
  if (!decision) return undefined;

  return {
    decision,
    hypotheses: decision.alternativeHypotheses ?? [],
    supportingItems: challengeItemsByIds(
      state,
      decision.supportingChallengeItemIds,
    ),
    contradictingItems: challengeItemsByIds(
      state,
      decision.contradictingChallengeItemIds,
    ),
    unknownItems: challengeItemsByIds(
      state,
      decision.unknownChallengeItemIds,
    ),
    deferredItems: challengeItemsByIds(
      state,
      decision.deferredRiskIds,
    ),
    decisionChangingEvidence:
      decision.decisionChangingEvidence ?? [],
  };
}
