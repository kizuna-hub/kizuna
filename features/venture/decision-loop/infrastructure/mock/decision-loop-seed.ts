import type {
  ChallengeItem,
  ChallengeScan,
  CycleTask,
  EvidenceRequirement,
  ExperimentPlan,
  VentureBaseline,
  VentureDecision,
  VentureSource,
} from "../../domain";
import type { VentureId } from "../../../core";
import {
  CALL_TO_CASH_VENTURE_ID,
  callToCashBaseline,
  callToCashScenario,
  callToCashSources,
} from "./fixtures/call-to-cash.fixture";
import {
  careMindBaseline,
  careMindScenario,
  careMindSources,
} from "./fixtures/caremind.fixture";
import {
  eduBridgeBaseline,
  eduBridgeScenario,
  eduBridgeSources,
} from "./fixtures/edubridge.fixture";
import {
  kizunaHubBaseline,
  kizunaHubScenario,
  kizunaHubSources,
} from "./fixtures/kizuna-hub.fixture";
import {
  snapMoneyBaseline,
  snapMoneyScenario,
  snapMoneySources,
} from "./fixtures/snapmoney.fixture";
import type { DecisionLoopScenarioTemplate } from "../../application/model/scenario-template";
import { calculateChallengePriority } from "../../application/services/challenge-priority";

const sources = [
  ...kizunaHubSources,
  ...snapMoneySources,
  ...eduBridgeSources,
  ...careMindSources,
  ...callToCashSources,
];

const baselines = [
  kizunaHubBaseline,
  snapMoneyBaseline,
  eduBridgeBaseline,
  careMindBaseline,
  callToCashBaseline,
];

const decisionLoopScenarioTemplates: Record<
  VentureId,
  DecisionLoopScenarioTemplate
> = {
  "venture-kizuna-hub": kizunaHubScenario,
  "venture-snapmoney": snapMoneyScenario,
  "venture-edubridge": eduBridgeScenario,
  "venture-caremind": careMindScenario,
  [CALL_TO_CASH_VENTURE_ID]: callToCashScenario,
};

const callToCashGeneratedAt = "2026-06-30T08:00:00.000Z";
const callToCashItemIdByKey = new Map(
  callToCashScenario.challenges.map((item) => [
    item.key,
    `challenge-${CALL_TO_CASH_VENTURE_ID}-${item.key}`,
  ]),
);
const callToCashChallengeItems: ChallengeItem[] =
  callToCashScenario.challenges.map((item) => ({
    id: callToCashItemIdByKey.get(item.key)!,
    ventureId: CALL_TO_CASH_VENTURE_ID,
    scanId: "scan-call-to-cash-v1",
    type: item.type,
    title: item.title,
    explanation: item.explanation,
    whyItMatters: item.whyItMatters,
    whatSupportsIt: item.whatSupportsIt,
    whatIsMissing: item.whatIsMissing,
    reviewPriority: item.reviewPriority,
    sourceIds: item.sourceIds,
    relatedClaimIds: item.relatedKeys
      ?.map((key) => callToCashItemIdByKey.get(key))
      .filter((id): id is string => Boolean(id)),
    impact: item.impact,
    uncertainty: item.uncertainty,
    urgency: item.urgency,
    controllability: item.controllability,
    priorityScore: calculateChallengePriority(item),
    confidence: item.confidence,
    founderResponse: "unreviewed",
  }));
const callToCashDecisions: VentureDecision[] =
  callToCashScenario.decisions.map((decision) => {
    const mapKeys = (keys: string[]) =>
      keys
        .map((key) => callToCashItemIdByKey.get(key))
        .filter((id): id is string => Boolean(id));
    return {
      id: decision.id,
      ventureId: CALL_TO_CASH_VENTURE_ID,
      title: decision.title,
      whyItMatters: decision.whyItMatters,
      status: "candidate",
      priority: decision.isRecommended ? "critical" : "high",
      nextAction: {
        id: `next-${decision.id}-compare`,
        label: "Compare this decision candidate",
        description: decision.whyNow,
        targetPath: `/founder/projects/${CALL_TO_CASH_VENTURE_ID}/cycle`,
        kind: "select-critical-decision",
      },
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
      createdAt: callToCashGeneratedAt,
      updatedAt: callToCashGeneratedAt,
    };
  });
const callToCashChallengeScan: ChallengeScan = {
  id: "scan-call-to-cash-v1",
  ventureId: CALL_TO_CASH_VENTURE_ID,
  baselineVersion: callToCashBaseline.version,
  summary: callToCashScenario.criticalPattern,
  status: "review-required",
  itemIds: callToCashChallengeItems.map((item) => item.id),
  candidateDecisionIds: [...callToCashDecisions]
    .sort(
      (left, right) =>
        (left.recommendationRank ?? 99) -
        (right.recommendationRank ?? 99),
    )
    .map((decision) => decision.id),
  generatedAt: callToCashGeneratedAt,
};

export function getDecisionLoopScenarioTemplate(ventureId: VentureId) {
  return decisionLoopScenarioTemplates[ventureId];
}

export function createDecisionLoopSeedCollections(): {
  sources: VentureSource[];
  baselines: VentureBaseline[];
  challengeScans: ChallengeScan[];
  challengeItems: ChallengeItem[];
  decisions: VentureDecision[];
  experiments: ExperimentPlan[];
  evidenceRequirements: EvidenceRequirement[];
  cycleTasks: CycleTask[];
} {
  const experiment: ExperimentPlan = {
    id: "experiment-kizuna-buyer",
    ventureId: "venture-kizuna-hub",
    decisionId: "decision-kizuna-buyer",
    title: decisionLoopScenarioTemplates["venture-kizuna-hub"].experiment.title,
    hypothesis:
      decisionLoopScenarioTemplates["venture-kizuna-hub"].experiment
        .hypothesis,
    method:
      decisionLoopScenarioTemplates["venture-kizuna-hub"].experiment.method,
    expectedSignal:
      decisionLoopScenarioTemplates["venture-kizuna-hub"].experiment
        .expectedSignal,
    failureSignal:
      decisionLoopScenarioTemplates["venture-kizuna-hub"].experiment
        .failureSignal,
    evidenceRequirementIds: [
      "requirement-kizuna-buyer-interviews",
    ],
    ownerId: "user-founder-ngoc",
    contributorIds: [],
    reviewerRelationshipId: "support-kizuna-mai",
    timeboxDays:
      decisionLoopScenarioTemplates["venture-kizuna-hub"].experiment
        .timeboxDays,
    exitCriteria:
      decisionLoopScenarioTemplates["venture-kizuna-hub"].experiment
        .exitCriteria,
    stopConditions:
      decisionLoopScenarioTemplates["venture-kizuna-hub"].experiment
        .stopConditions,
    whatNotToDo:
      decisionLoopScenarioTemplates["venture-kizuna-hub"].experiment
        .whatNotToDo,
    status: "draft",
    updatedAt: "2026-07-24T08:20:00.000Z",
  };

  const requirement: EvidenceRequirement = {
    id: "requirement-kizuna-buyer-interviews",
    ventureId: "venture-kizuna-hub",
    experimentId: experiment.id,
    label: "Budget-owner interviews",
    description:
      "Record five interviews with role, budget authority, approval steps, and direct quotations.",
    minimumCount: 5,
    acceptedSourceKinds: ["customer-interview"],
    requiredForExit: true,
    status: "required",
  };

  const tasks: CycleTask[] =
    decisionLoopScenarioTemplates[
      "venture-kizuna-hub"
    ].experiment.tasks.map((task) => ({
      ...task,
      ventureId: "venture-kizuna-hub",
      experimentId: experiment.id,
      ownerId: "user-founder-ngoc",
      status: "not-started",
    }));

  return {
    sources,
    baselines,
    challengeScans: [callToCashChallengeScan],
    challengeItems: callToCashChallengeItems,
    decisions: callToCashDecisions,
    experiments: [experiment],
    evidenceRequirements: [requirement],
    cycleTasks: tasks,
  };
}
