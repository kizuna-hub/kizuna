import type {
  ChallengeItemId,
  ConfidenceLevel,
  DecisionId,
  NextAction,
  VentureId,
} from "../../core";

export type DecisionStatus =
  | "candidate"
  | "open"
  | "blocked"
  | "selected"
  | "committed"
  | "resolved"
  | "deferred"
  | "rejected"
  | "superseded";

export interface DecisionHypothesis {
  id: string;
  title: string;
  summary: string;
  assumptions: string[];
  tradeOffs: string[];
  strengths?: string[];
  risks?: string[];
  evidenceNeeded?: string[];
  isNull?: boolean;
}

export interface DecisionChangeCriterion {
  id: string;
  text: string;
  selected: boolean;
  founderCreated: boolean;
}

export interface VentureDecision {
  id: DecisionId;
  ventureId: VentureId;
  title: string;
  whyItMatters: string;
  status: DecisionStatus;
  priority: "critical" | "high" | "medium" | "low";
  nextAction: NextAction;
  blockedBy?: string[];
  unlocks?: string[];
  whyNow?: string;
  supportingChallengeItemIds?: ChallengeItemId[];
  contradictingChallengeItemIds?: ChallengeItemId[];
  unknownChallengeItemIds?: ChallengeItemId[];
  deferredRiskIds?: ChallengeItemId[];
  confidence?: ConfidenceLevel;
  recommendationRank?: number;
  isRecommended?: boolean;
  founderRationale?: string;
  alternativeHypotheses?: DecisionHypothesis[];
  distinguishingEvidence?: string[];
  decisionChangingEvidence?: string[];
  changeMyMindCriteria?: DecisionChangeCriterion[];
  createdAt: string;
  updatedAt: string;
}
