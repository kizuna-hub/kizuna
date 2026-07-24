import type { VentureId } from "../../../core";
import type { BaselineFieldKey } from "../../domain";
import { baselineFieldKeys } from "../baseline-fields";
import type { BaselineCompleteness } from "../contracts";
import type { VentureWorkspaceState } from "../model/venture-workspace-state";
import {
  getCurrentBaseline,
  getReviewedSourcesForVenture,
} from "../queries/source-and-baseline-queries";
import { hasValue } from "./workspace-state-utils";

export function getBaselineCompleteness(
  state: VentureWorkspaceState,
  ventureId: VentureId,
): BaselineCompleteness {
  const baseline = getCurrentBaseline(state, ventureId);
  const reviewedSources = getReviewedSourcesForVenture(
    state,
    ventureId,
  );

  if (!baseline) {
    return {
      completedCount: 0,
      totalCount: baselineFieldKeys.length,
      percentage: 0,
      missingRequired: [
        "problem",
        "customer",
        "buyer",
        "solution",
        "currentGoal",
      ],
      missingOptional: baselineFieldKeys.filter(
        (key) =>
          ![
            "problem",
            "customer",
            "buyer",
            "solution",
            "currentGoal",
          ].includes(key),
      ),
      reviewedSourceCount: reviewedSources.length,
      allReviewedSourcesAreAiGenerated: false,
      hasMinimumContext: false,
      canConfirm: false,
      canRunChallengeScan: false,
    };
  }

  const completed = baselineFieldKeys.filter((key) =>
    hasValue(baseline[key]),
  );
  const requiredMissing: BaselineFieldKey[] = [];
  if (!hasValue(baseline.problem)) requiredMissing.push("problem");
  if (!hasValue(baseline.solution)) requiredMissing.push("solution");
  if (!hasValue(baseline.currentGoal)) {
    requiredMissing.push("currentGoal");
  }
  if (
    !hasValue(baseline.customer) &&
    !hasValue(baseline.buyer)
  ) {
    requiredMissing.push("customer", "buyer");
  }

  const optionalMissing = baselineFieldKeys.filter(
    (key) =>
      !hasValue(baseline[key]) && !requiredMissing.includes(key),
  );
  const hasMinimumContext =
    requiredMissing.length === 0 && reviewedSources.length > 0;
  const allReviewedSourcesAreAiGenerated =
    reviewedSources.length > 0 &&
    reviewedSources.every(
      (source) =>
        source.origin === "ai-generated" ||
        source.aiContribution === "generated",
    );

  return {
    completedCount: completed.length,
    totalCount: baselineFieldKeys.length,
    percentage: Math.round(
      (completed.length / baselineFieldKeys.length) * 100,
    ),
    missingRequired: requiredMissing,
    missingOptional: optionalMissing,
    reviewedSourceCount: reviewedSources.length,
    allReviewedSourcesAreAiGenerated,
    hasMinimumContext,
    canConfirm: hasMinimumContext,
    canRunChallengeScan:
      hasMinimumContext && baseline.status === "confirmed",
  };
}
