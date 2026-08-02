import type { VentureId } from "../../../core";
import type {
  ChallengeItem,
  VentureDecision,
  VentureSource,
} from "../../domain";
import type { DecisionLoopCommandResult } from "../contracts";
import type { DecisionLoopScenarioTemplate } from "../model/scenario-template";
import type { VentureWorkspaceState } from "../model/venture-workspace-state";
import { getCurrentChallengeScan } from "../queries/challenge-queries";
import {
  getCurrentBaseline,
  getReviewedSourcesForVenture,
} from "../queries/source-and-baseline-queries";
import { getBaselineCompleteness } from "../services/baseline-completeness";
import { createChallengeScenario } from "../services/challenge-generator";
import { calculateChallengePriority } from "../services/challenge-priority";
import { rankDecisionCandidates } from "../services/decision-ranking";
import {
  isAccessibleVenture,
  markVentureUpdated,
} from "../services/workspace-state-utils";

export function executeChallengeScan(
  state: VentureWorkspaceState,
  ventureId: VentureId,
  scenarioTemplate?: DecisionLoopScenarioTemplate,
): DecisionLoopCommandResult {
  const baseline = getCurrentBaseline(state, ventureId);
  const completeness = getBaselineCompleteness(state, ventureId);
  if (
    !baseline ||
    !isAccessibleVenture(state, ventureId) ||
    !completeness.canRunChallengeScan
  ) {
    return {
      state,
      ok: false,
      errors: [
        "Confirm a minimum venture baseline and at least one reviewed source before running the scan.",
      ],
    };
  }

  const current = getCurrentChallengeScan(state, ventureId);
  if (current?.baselineVersion === baseline.version) {
    return { state, ok: true, errors: [] };
  }

  const scenario =
    scenarioTemplate ??
    createChallengeScenario(state, ventureId, baseline);
  const scanId = `scan-${ventureId.replace(/^venture-/, "")}-v${
    baseline.version
  }`;
  const itemIdByKey = new Map(
    scenario.challenges.map((item) => [
      item.key,
      `challenge-${ventureId.replace(/^venture-/, "")}-${item.key}`,
    ]),
  );
  const reviewedSources = getReviewedSourcesForVenture(
    state,
    ventureId,
  );
  const reviewedSourceById = new Map(
    reviewedSources.map((source) => [source.id, source]),
  );
  const challengeItems: ChallengeItem[] =
    scenario.challenges.map((item) => {
      const sourceIds = item.sourceIds.filter((sourceId) =>
        reviewedSourceById.has(sourceId),
      );
      const referencedSources = sourceIds
        .map((sourceId) => reviewedSourceById.get(sourceId))
        .filter((source): source is VentureSource =>
          Boolean(source),
        );
      const lostSourceTrace =
        item.sourceIds.length > 0 && sourceIds.length === 0;
      const onlyAiTrace =
        referencedSources.length > 0 &&
        referencedSources.every(
          (source) =>
            source.origin === "ai-generated" ||
            source.aiContribution === "generated",
        );
      const type =
        lostSourceTrace ||
        (item.type === "fact" && onlyAiTrace)
          ? completeness.allReviewedSourcesAreAiGenerated
            ? ("ai-inference" as const)
            : ("unknown" as const)
          : item.type;
      const uncertainty = lostSourceTrace
        ? ("high" as const)
        : item.uncertainty;
      const confidence = lostSourceTrace
        ? ("low" as const)
        : onlyAiTrace && item.type === "fact"
          ? ("developing" as const)
          : item.confidence;

      return {
        id: itemIdByKey.get(item.key)!,
        ventureId,
        scanId,
        type,
        title: item.title,
        explanation: lostSourceTrace
          ? `${item.explanation} The referenced source is not currently confirmed, so this remains an explicit unknown.`
          : item.explanation,
        whyItMatters: item.whyItMatters,
        whatSupportsIt: item.whatSupportsIt,
        whatIsMissing: item.whatIsMissing,
        reviewPriority: item.reviewPriority,
        sourceIds,
        relatedClaimIds: item.relatedKeys
          ?.map((key) => itemIdByKey.get(key))
          .filter((id): id is string => Boolean(id)),
        impact: item.impact,
        uncertainty,
        urgency: item.urgency,
        controllability: item.controllability,
        priorityScore: calculateChallengePriority({
          ...item,
          uncertainty,
        }),
        confidence,
        founderResponse: "unreviewed" as const,
      };
    });

  const candidateIds = rankDecisionCandidates(scenario.decisions)
    .map((decision) => decision.id);
  const decisions = scenario.decisions.map<VentureDecision>(
    (decision) => {
      const existing = state.decisions.find(
        (item) => item.id === decision.id,
      );
      const mapKeys = (keys: string[]) =>
        keys
          .map((key) => itemIdByKey.get(key))
          .filter((id): id is string => Boolean(id));
      const keepSelectedStatus =
        existing?.status === "selected" ||
        existing?.status === "committed";

      return {
        id: decision.id,
        ventureId,
        title: decision.title,
        whyItMatters: decision.whyItMatters,
        status: keepSelectedStatus
          ? existing.status
          : "candidate",
        priority: decision.isRecommended ? "critical" : "high",
        nextAction: {
          id: `next-${decision.id}-select`,
          label: decision.isRecommended
            ? "Review the recommended critical decision"
            : "Compare this decision candidate",
          description: decision.whyNow,
          targetPath: `/founder/projects/${ventureId}/cycle`,
          kind: "select-critical-decision",
        },
        blockedBy: existing?.blockedBy,
        unlocks: decision.unlocks,
        whyNow: decision.whyNow,
        supportingChallengeItemIds: mapKeys(
          decision.supportingKeys,
        ),
        contradictingChallengeItemIds: mapKeys(
          decision.contradictingKeys,
        ),
        unknownChallengeItemIds: mapKeys(decision.unknownKeys),
        deferredRiskIds: mapKeys(decision.deferredKeys),
        confidence: decision.confidence,
        recommendationRank: decision.recommendationRank,
        isRecommended: decision.isRecommended,
        alternativeHypotheses: decision.alternativeHypotheses,
        distinguishingEvidence: decision.distinguishingEvidence,
        decisionChangingEvidence:
          decision.decisionChangingEvidence,
        changeMyMindCriteria: decision.changeMyMindCriteria,
        createdAt: existing?.createdAt ?? baseline.updatedAt,
        updatedAt: baseline.updatedAt,
      };
    },
  );
  const generatedAt = baseline.updatedAt;
  const scan = {
    id: scanId,
    ventureId,
    baselineVersion: baseline.version,
    summary: scenario.criticalPattern,
    status: "review-required" as const,
    itemIds: challengeItems.map((item) => item.id),
    candidateDecisionIds: candidateIds,
    generatedAt,
  };
  const decisionIdSet = new Set(decisions.map((item) => item.id));
  const itemIdSet = new Set(challengeItems.map((item) => item.id));

  return {
    state: markVentureUpdated(
      {
        ...state,
        challengeScans: [
          ...state.challengeScans.map((item) =>
            item.ventureId === ventureId &&
            item.status !== "superseded"
              ? { ...item, status: "superseded" as const }
              : item,
          ),
          scan,
        ],
        challengeItems: [
          ...state.challengeItems.filter(
            (item) => !itemIdSet.has(item.id),
          ),
          ...challengeItems,
        ],
        decisions: [
          ...state.decisions.filter(
            (item) => !decisionIdSet.has(item.id),
          ),
          ...decisions,
        ],
      },
      ventureId,
      generatedAt,
    ),
    ok: true,
    errors: [],
  };
}
