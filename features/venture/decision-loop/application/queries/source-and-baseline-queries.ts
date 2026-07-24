import type { VentureId } from "../../../core";
import type { VentureSource } from "../../domain";
import type { VentureWorkspaceState } from "../model/venture-workspace-state";
import { isRecord } from "../services/workspace-state-utils";

export function isDecisionLoopCollectionItem(
  value: unknown,
): value is { id: string; ventureId: string } {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.ventureId === "string"
  );
}

export function getSourcesForVenture(
  state: VentureWorkspaceState,
  ventureId: VentureId,
  options: { includeExcluded?: boolean } = {},
) {
  return state.sources
    .filter(
      (source) =>
        source.ventureId === ventureId &&
        (options.includeExcluded ||
          source.reviewStatus !== "excluded"),
    )
    .sort((left, right) =>
      right.importedAt.localeCompare(left.importedAt),
    );
}

export function getReviewedSourcesForVenture(
  state: VentureWorkspaceState,
  ventureId: VentureId,
) {
  return getSourcesForVenture(state, ventureId).filter(
    (source) => source.reviewStatus === "confirmed",
  );
}

export function getCurrentBaseline(
  state: VentureWorkspaceState,
  ventureId: VentureId,
) {
  return state.baselines.find(
    (baseline) => baseline.ventureId === ventureId,
  );
}
