export type ReadinessCriterionId =
  | "problem_and_user_understanding"
  | "customer_discovery_and_evidence"
  | "prototype_and_learning"
  | "market_signal_and_commitment"
  | "experiment_and_execution_discipline"
  | "team_capability_and_resource_access"
  | "communication_and_materials";

export type ReadinessConfidence = "low" | "medium" | "high";

export type ReadinessEvidenceStatus =
  | "verified"
  | "inferred"
  | "assumed"
  | "disputed"
  | "outdated"
  | "missing"
  | "superseded";

export type EvidenceContributionType =
  | "positive"
  | "negative"
  | "cap"
  | "missing"
  | "informational";

export interface ReadinessSourceLocation {
  fileName: string;
  page?: number;
  totalPages?: number;
  section?: string;
  quote?: string;
  context?: string;
}
export interface ReadinessContribution {
  id: string;
  criterionId: ReadinessCriterionId;
  type: EvidenceContributionType;
  status: ReadinessEvidenceStatus;
  title: string;
  interpretation: string;
  confidence: ReadinessConfidence;
  contributionPoints: number;
  source: ReadinessSourceLocation;
  observedAt: string;
  freshnessDays: number;
  dedupeKey: string;
  excluded?: boolean;
  canonical?: boolean;
}

export interface ReadinessCriterionCap {
  maxScore: number;
  reason: string;
  contributionId?: string;
}

export interface ReadinessCriterion {
  id: ReadinessCriterionId;
  label: string;
  description: string;
  weight: number;
  score: number;
  delta: number;
  confidence: ReadinessConfidence;
  contributions: ReadinessContribution[];
  missingEvidence: string[];
  contradictions: string[];
  improvementActions: string[];
  cap?: ReadinessCriterionCap;
}

export interface ReadinessProjection {
  label: "Dự kiến · Chưa cập nhật điểm hiện tại";
  overallRange: [number, number];
  criterionId?: ReadinessCriterionId;
  criterionRange?: [number, number];
  assumptions: string[];
}

export type ReadinessHistoryEventType =
  | "increase"
  | "decrease"
  | "no_change"
  | "evidence_removed"
  | "evidence_disputed"
  | "rubric_version";

export interface ReadinessHistoryEntry {
  id: string;
  type: ReadinessHistoryEventType;
  previousScore: number;
  nextScore: number;
  delta: number;
  reason: string;
  occurredAt: string;
  rubricVersion: string;
  evidenceIds: string[];
}

export interface ExplainableReadinessAssessment {
  ventureName: string;
  ventureStage: string;
  businessModel: string;
  overallScore: number;
  previousScore: number;
  delta: number;
  label: string;
  confidence: ReadinessConfidence;
  rubricVersion: string;
  updatedAt: string;
  criteria: ReadinessCriterion[];
  projection?: ReadinessProjection;
  history: ReadinessHistoryEntry[];
  canonicalNotice?: string;
}

export interface ReadinessSourceDocument {
  id: string;
  fileName: string;
  fileType: "pdf" | "docx" | "xlsx" | "md" | "json";
  totalPages: number;
  updatedAt: string;
  availability: "available" | "unavailable";
  pages: Array<{
    page: number;
    title: string;
    body: string;
    highlight?: string;
  }>;
}
