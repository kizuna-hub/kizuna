import type {
  ActionCycleId,
  DecisionId,
  EvidenceId,
  OpportunityId,
  ProgramId,
  VentureId,
} from "./identifiers";

export interface SupportRelationship {
  id: string;
  ventureId: VentureId;
  personName: string;
  role:
    | "primary-mentor"
    | "secondary-mentor"
    | "program-mentor"
    | "advisor"
    | "specialist"
    | "guest-reviewer";
  source:
    | "existing-network"
    | "program"
    | "competition"
    | "warm-introduction"
    | "kizuna"
    | "manual";
  expertise: string[];
  status: "active" | "inactive" | "pending";
  nextSessionAt?: string;
}

export interface Program {
  id: ProgramId;
  name: string;
  ventureId: VentureId;
  status: "active" | "completed" | "upcoming";
  assignedMentorRelationshipId?: string;
  currentModule?: string;
  nextDeliverable?: string;
  nextDeadlineAt?: string;
}

export interface Opportunity {
  id: OpportunityId;
  ventureId?: VentureId;
  name: string;
  type: "program" | "competition" | "grant" | "pilot" | "specialist";
  status: "saved" | "open" | "closed";
  relevance: string;
  deadlineAt?: string;
}

export interface Evidence {
  id: EvidenceId;
  ventureId: VentureId;
  decisionId?: DecisionId;
  title: string;
  summary: string;
  sourceType:
    | "interview"
    | "observation"
    | "experiment"
    | "document"
    | "metric"
    | "external-feedback";
  status: "captured" | "needs-review" | "accepted" | "rejected";
  collectedAt: string;
}

export interface VentureFeedback {
  id: string;
  ventureId: VentureId;
  decisionId?: DecisionId;
  supportRelationshipId?: string;
  authorName: string;
  summary: string;
  status: "unreviewed" | "acknowledged" | "reconciled";
  conflictsWithFeedbackId?: string;
  createdAt: string;
}

export interface VentureOutcome {
  id: string;
  ventureId: VentureId;
  decisionId: DecisionId;
  actionCycleId?: ActionCycleId;
  result: "validated" | "invalidated" | "inconclusive";
  learning: string;
  recordedAt: string;
}

export interface ReadinessDelta {
  id: string;
  ventureId: VentureId;
  dimension: string;
  change: number;
  reason: string;
  evidenceIds: EvidenceId[];
  recordedAt: string;
}

export interface VentureActivity {
  id: string;
  ventureId: VentureId;
  type:
    | "decision"
    | "cycle"
    | "evidence"
    | "support"
    | "program"
    | "project";
  message: string;
  occurredAt: string;
}
