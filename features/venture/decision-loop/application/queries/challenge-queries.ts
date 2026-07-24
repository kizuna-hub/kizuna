import type { VentureId } from "../../../core";
import type { ChallengeItemType } from "../../domain";
import type { VentureWorkspaceState } from "../model/venture-workspace-state";

export function getCurrentChallengeScan(
  state: VentureWorkspaceState,
  ventureId: VentureId,
) {
  return state.challengeScans
    .filter(
      (scan) =>
        scan.ventureId === ventureId &&
        scan.status !== "superseded",
    )
    .sort((left, right) =>
      (right.generatedAt ?? "").localeCompare(
        left.generatedAt ?? "",
      ),
    )[0];
}

export function getChallengeItemsByType(
  state: VentureWorkspaceState,
  ventureId: VentureId,
  type?: ChallengeItemType,
) {
  const scan = getCurrentChallengeScan(state, ventureId);
  if (!scan) return [];
  const itemIdSet = new Set(scan.itemIds);
  return state.challengeItems.filter(
    (item) =>
      item.ventureId === ventureId &&
      itemIdSet.has(item.id) &&
      (!type || item.type === type),
  );
}

export function getHighestPriorityChallengeItems(
  state: VentureWorkspaceState,
  ventureId: VentureId,
  limit = 3,
) {
  return getChallengeItemsByType(state, ventureId)
    .sort(
      (left, right) =>
        right.priorityScore - left.priorityScore ||
        left.id.localeCompare(right.id),
    )
    .slice(0, limit);
}

export function getChallengeTypeCounts(
  state: VentureWorkspaceState,
  ventureId: VentureId,
) {
  const counts: Record<ChallengeItemType, number> = {
    fact: 0,
    "founder-claim": 0,
    assumption: 0,
    "ai-inference": 0,
    contradiction: 0,
    unknown: 0,
  };
  getChallengeItemsByType(state, ventureId).forEach((item) => {
    counts[item.type] += 1;
  });
  return counts;
}

