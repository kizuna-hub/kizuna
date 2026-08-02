import type {
  ChallengeItemId,
  ChallengeScanId,
  ConfidenceLevel,
  DecisionId,
  SourceId,
  VentureId,
} from "../../core";

export type ChallengeItemType =
  | "fact"
  | "founder-claim"
  | "assumption"
  | "ai-inference"
  | "contradiction"
  | "unknown";

export type ChallengeDimension = "low" | "medium" | "high";

export type ChallengeFounderResponse =
  | "unreviewed"
  | "agree"
  | "challenge"
  | "edit"
  | "defer"
  | "needs-evidence";

export type ReviewPriority =
  | "critical"
  | "important"
  | "supporting"
  | "can-wait";

export interface ChallengeItem {
  id: ChallengeItemId;
  ventureId: VentureId;
  scanId: ChallengeScanId;
  type: ChallengeItemType;
  title: string;
  explanation: string;
  whyItMatters?: string;
  whatSupportsIt?: string[];
  whatIsMissing?: string[];
  reviewPriority?: ReviewPriority;
  sourceIds: SourceId[];
  relatedClaimIds?: ChallengeItemId[];
  impact: ChallengeDimension;
  uncertainty: ChallengeDimension;
  urgency: ChallengeDimension;
  controllability: ChallengeDimension;
  priorityScore: number;
  confidence: ConfidenceLevel;
  founderResponse: ChallengeFounderResponse;
  founderNote?: string;
}

export interface ChallengeScan {
  id: ChallengeScanId;
  ventureId: VentureId;
  baselineVersion: string;
  summary?: string;
  status:
    | "not-started"
    | "ready"
    | "running"
    | "review-required"
    | "reviewed"
    | "superseded";
  itemIds: ChallengeItemId[];
  candidateDecisionIds: DecisionId[];
  generatedAt?: string;
  reviewedAt?: string;
}
