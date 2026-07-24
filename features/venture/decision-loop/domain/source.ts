import type {
  SourceId,
  VentureId,
} from "../../core";

export type VentureSourceKind =
  | "ai-conversation"
  | "pitch-deck"
  | "document"
  | "prototype-link"
  | "research"
  | "customer-interview"
  | "mentor-note"
  | "program-deliverable"
  | "founder-note"
  | "other";

export type SourceOrigin =
  | "founder-authored"
  | "team-authored"
  | "ai-generated"
  | "ai-assisted"
  | "mentor-feedback"
  | "customer-evidence"
  | "external-research"
  | "program-material"
  | "unknown";

export type SourceFreshness =
  | "current"
  | "possibly-stale"
  | "stale"
  | "unknown";

export type SourceReviewStatus =
  | "unreviewed"
  | "confirmed"
  | "needs-update"
  | "excluded";

export type SourceVisibility = "private" | "team" | "review-ready";

export type AiContributionLevel =
  | "none"
  | "assisted"
  | "generated"
  | "unknown";

export type SourceEvidenceStrength =
  | "none"
  | "low"
  | "medium"
  | "high";

export interface SourceProvenance {
  artifactType?: string;
  purpose?: string;
  pageCount?: number;
  currentAsOf?: string;
  personalDataDetected: boolean;
  personalDataNotice?: string;
  productContext: SourceEvidenceStrength;
  technicalContext: SourceEvidenceStrength;
  marketEvidence: SourceEvidenceStrength;
  commercialEvidence: SourceEvidenceStrength;
}

export interface VentureSource {
  id: SourceId;
  ventureId: VentureId;
  title: string;
  kind: VentureSourceKind;
  origin: SourceOrigin;
  authorName?: string;
  summary?: string;
  content?: string;
  externalUrl?: string;
  createdAt: string;
  importedAt: string;
  freshness: SourceFreshness;
  reviewStatus: SourceReviewStatus;
  visibility: SourceVisibility;
  aiContribution: AiContributionLevel;
  provenance?: SourceProvenance;
  tags: string[];
}
