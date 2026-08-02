import type { VentureId } from "../../../core";
import type {
  ChallengeItem,
  ReviewPriority,
} from "../../domain";
import type { VentureWorkspaceState } from "../model/venture-workspace-state";
import { getChallengeItemsByType } from "./challenge-queries";

export type ReviewItemModel = {
  item: ChallengeItem;
  priority: ReviewPriority;
};

function fallbackPriority(
  index: number,
  total: number,
): ReviewPriority {
  if (index < Math.min(2, total)) return "critical";
  if (index < Math.min(6, total)) return "important";
  return "supporting";
}

export function getReviewItems(
  state: VentureWorkspaceState,
  ventureId: VentureId,
): ReviewItemModel[] {
  return [...getChallengeItemsByType(state, ventureId)]
    .sort(
      (left, right) =>
        right.priorityScore - left.priorityScore ||
        left.id.localeCompare(right.id),
    )
    .map((item, index, items) => ({
      item,
      priority:
        item.reviewPriority ??
        fallbackPriority(index, items.length),
    }));
}

export function getCriticalReviewItems(
  state: VentureWorkspaceState,
  ventureId: VentureId,
) {
  return getReviewItems(state, ventureId).filter(
    (model) => model.priority === "critical",
  );
}

export function getImportantReviewItems(
  state: VentureWorkspaceState,
  ventureId: VentureId,
) {
  return getReviewItems(state, ventureId).filter(
    (model) => model.priority === "important",
  );
}

export function getSupportingReviewItems(
  state: VentureWorkspaceState,
  ventureId: VentureId,
) {
  return getReviewItems(state, ventureId).filter(
    (model) =>
      model.priority === "supporting" ||
      model.priority === "can-wait",
  );
}

export function getReviewSummary(
  state: VentureWorkspaceState,
  ventureId: VentureId,
) {
  const critical = getCriticalReviewItems(state, ventureId);
  const important = getImportantReviewItems(state, ventureId);
  const supporting = getSupportingReviewItems(state, ventureId);
  const reviewedCriticalCount = critical.filter(
    ({ item }) => item.founderResponse !== "unreviewed",
  ).length;

  return {
    criticalCount: critical.length,
    reviewedCriticalCount,
    importantCount: important.length,
    supportingCount: supporting.length,
    criticalReviewComplete:
      critical.length > 0 &&
      reviewedCriticalCount === critical.length,
  };
}
