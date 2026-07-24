type RankedDecisionCandidate = {
  recommendationRank?: number;
};

export function rankDecisionCandidates<
  TCandidate extends RankedDecisionCandidate,
>(candidates: TCandidate[], limit = 3): TCandidate[] {
  return [...candidates]
    .sort(
      (left, right) =>
        (left.recommendationRank ?? 99) -
        (right.recommendationRank ?? 99),
    )
    .slice(0, limit);
}
