import type {
  ExplainableReadinessAssessment,
  ReadinessConfidence,
  ReadinessContribution,
  ReadinessCriterion,
  ReadinessHistoryEntry,
} from "../types/readiness.types";

const EXCLUDED_STATUSES = new Set([
  "disputed",
  "missing",
  "superseded",
]);

export function getCountedContributions(
  contributions: ReadinessContribution[],
) {
  const seen = new Set<string>();
  return contributions.filter((contribution) => {
    if (
      contribution.excluded ||
      EXCLUDED_STATUSES.has(contribution.status)
    ) {
      return false;
    }
    if (seen.has(contribution.dedupeKey)) return false;
    seen.add(contribution.dedupeKey);
    return true;
  });
}

export function getEffectiveCriterionScore(
  criterion: ReadinessCriterion,
) {
  return Math.min(
    criterion.score,
    criterion.cap?.maxScore ?? 100,
  );
}

export function calculateOverallReadiness(
  criteria: ReadinessCriterion[],
) {
  const totalWeight = criteria.reduce(
    (sum, criterion) => sum + criterion.weight,
    0,
  );
  if (totalWeight <= 0) return 0;
  const weighted = criteria.reduce(
    (sum, criterion) =>
      sum +
      getEffectiveCriterionScore(criterion) *
        criterion.weight,
    0,
  );
  return Math.round(weighted / totalWeight);
}

export function deriveCriterionConfidence(
  contributions: ReadinessContribution[],
): ReadinessConfidence {
  const counted = getCountedContributions(contributions);
  const verified = counted.filter(
    (contribution) => contribution.status === "verified",
  ).length;
  const staleOrAssumed = counted.filter(
    (contribution) =>
      contribution.status === "outdated" ||
      contribution.status === "assumed",
  ).length;
  const hasConflict = contributions.some(
    (contribution) => contribution.status === "disputed",
  );

  if (verified >= 2 && staleOrAssumed === 0 && !hasConflict) {
    return "high";
  }
  if (verified >= 1 && staleOrAssumed <= 1) return "medium";
  return "low";
}

export function withRecalculatedReadiness(
  assessment: ExplainableReadinessAssessment,
): ExplainableReadinessAssessment {
  const criteria = assessment.criteria.map((criterion) => ({
    ...criterion,
    confidence: deriveCriterionConfidence(
      criterion.contributions,
    ),
  }));
  const overallScore = calculateOverallReadiness(criteria);
  return {
    ...assessment,
    criteria,
    overallScore,
    delta: overallScore - assessment.previousScore,
  };
}

export function disputeContribution(
  assessment: ExplainableReadinessAssessment,
  contributionId: string,
  occurredAt = new Date().toISOString(),
): ExplainableReadinessAssessment {
  const previousScore = assessment.overallScore;
  const criteria = assessment.criteria.map((criterion) => {
    const hasContribution = criterion.contributions.some(
      (contribution) => contribution.id === contributionId,
    );
    if (!hasContribution) return criterion;
    const contribution = criterion.contributions.find(
      (item) => item.id === contributionId,
    );
    return {
      ...criterion,
      score: Math.max(
        0,
        Math.min(
          100,
          criterion.score -
            (contribution?.contributionPoints ?? 0),
        ),
      ),
      contributions: criterion.contributions.map((item) =>
        item.id === contributionId
          ? { ...item, status: "disputed" as const, excluded: true }
          : item,
      ),
    };
  });
  const recalculated = withRecalculatedReadiness({
    ...assessment,
    criteria,
  });
  const entry: ReadinessHistoryEntry = {
    id: `history-disputed-${contributionId}`,
    type: "evidence_disputed",
    previousScore,
    nextScore: recalculated.overallScore,
    delta: recalculated.overallScore - previousScore,
    reason:
      "Founder đánh dấu cách diễn giải của AI không chính xác; đóng góp này đã bị loại khỏi điểm canonical.",
    occurredAt,
    rubricVersion: assessment.rubricVersion,
    evidenceIds: [contributionId],
  };
  return {
    ...recalculated,
    previousScore,
    delta: recalculated.overallScore - previousScore,
    history: [entry, ...assessment.history],
  };
}

export function hasRubricVersionWarning(
  entries: ReadinessHistoryEntry[],
) {
  return new Set(entries.map((entry) => entry.rubricVersion)).size > 1;
}
