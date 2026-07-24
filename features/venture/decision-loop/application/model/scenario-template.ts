import type { ConfidenceLevel } from "../../../core";
import type {
  BaselineFieldKey,
  ChallengeDimension,
  ChallengeItemType,
  EvidenceRequirement,
  ReviewPriority,
  VentureDecision,
} from "../../domain";

export type ChallengeTemplate = {
  key: string;
  type: ChallengeItemType;
  title: string;
  explanation: string;
  whyItMatters?: string;
  whatSupportsIt?: string[];
  whatIsMissing?: string[];
  reviewPriority?: ReviewPriority;
  sourceIds: string[];
  relatedKeys?: string[];
  impact: ChallengeDimension;
  uncertainty: ChallengeDimension;
  urgency: ChallengeDimension;
  controllability: ChallengeDimension;
  confidence: ConfidenceLevel;
};

export type DecisionTemplate = Pick<
  VentureDecision,
  | "id"
  | "title"
  | "whyItMatters"
  | "whyNow"
  | "unlocks"
  | "alternativeHypotheses"
  | "distinguishingEvidence"
  | "decisionChangingEvidence"
  | "changeMyMindCriteria"
> & {
  confidence: ConfidenceLevel;
  isRecommended: boolean;
  recommendationRank: number;
  supportingKeys: string[];
  contradictingKeys: string[];
  unknownKeys: string[];
  deferredKeys: string[];
};

export type ExperimentTemplate = {
  decisionId: string;
  title: string;
  hypothesis: string;
  method: string;
  expectedSignal: string;
  failureSignal: string;
  timeboxDays: number;
  evidenceRequirements: Array<
    Pick<
      EvidenceRequirement,
      | "id"
      | "label"
      | "description"
      | "minimumCount"
      | "acceptedSourceKinds"
      | "requiredForExit"
    >
  >;
  exitCriteria: string[];
  stopConditions: string[];
  whatNotToDo: string[];
  tasks: Array<{
    id: string;
    title: string;
    dueAt?: string;
    evidenceRequirementId?: string;
  }>;
};

export type DecisionLoopScenarioTemplate = {
  criticalPattern: string;
  challenges: ChallengeTemplate[];
  decisions: DecisionTemplate[];
  experiment: ExperimentTemplate;
};
