import type {
  CurrentFocus,
  DecisionCycleState,
  ReadinessState,
} from "../../types/ai-workspace.types";
import type { MentorMatch } from "../../mentor-recommendation/types/mentor-recommendation.types";

export type MentorConnectionRequestStatus =
  | "draft"
  | "ready"
  | "sending"
  | "sent"
  | "failed"
  | "cancelled";

export type MentorConnectionBriefSectionId =
  | "current_challenge"
  | "support_needed"
  | "expected_outcome"
  | "mentor_message";

export type MentorConnectionGenerationStatus =
  | "verified_context"
  | "ai_inferred"
  | "founder_edited";

export type MentorShareableContext =
  | "venture_summary"
  | "venture_stage"
  | "current_focus"
  | "readiness_overview"
  | "selected_evidence"
  | "pitch_deck"
  | "business_plan"
  | "active_decision_cycle";

export interface MentorSummary {
  id: string;
  name: string;
  role: string;
  expertise: string[];
  matchScore: number;
}

export interface MentorConnectionSource {
  id: string;
  label: string;
  detail?: string;
  status: "verified" | "inferred" | "disputed" | "unavailable";
  updatedAt: string;
}

export interface MentorConnectionBriefSection {
  id: MentorConnectionBriefSectionId;
  title: string;
  content: string;
  checklistItems?: string[];
  sourceIds: string[];
  generationStatus: MentorConnectionGenerationStatus;
  updatedAt: string;
}

export interface MentorConnectionEvidence {
  id: string;
  label: string;
  detail: string;
  sourceLabel: string;
  status: "verified" | "inferred" | "disputed" | "unavailable";
}

export interface MentorConnectionDocument {
  id: string;
  name: string;
  detail: string;
  updatedAt: string;
  availability: "available" | "unavailable";
}

export interface MentorConnectionBrief {
  id: string;
  ventureId: string;
  mentorId: string;
  mentorSnapshot: MentorSummary;
  sections: MentorConnectionBriefSection[];
  sources: MentorConnectionSource[];
  evidence: MentorConnectionEvidence[];
  documents: MentorConnectionDocument[];
  selectedContext: MentorShareableContext[];
  selectedEvidenceIds: string[];
  selectedDocumentIds: string[];
  status: MentorConnectionRequestStatus;
  confidence: "low" | "medium" | "high";
  contextFingerprint: string;
  createdAt: string;
  updatedAt: string;
  savedAt?: string;
  errorMessage?: string;
}

export interface MentorConnectionRequest {
  id: string;
  ventureId: string;
  mentorId: string;
  brief: MentorConnectionBrief;
  status: "pending" | "accepted" | "declined";
  sentAt: string;
  acceptance?: {
    id: string;
    requestId: string;
    mentorId: string;
    message: string;
    contactMethod:
      | "zalo"
      | "phone"
      | "email"
      | "messenger"
      | "mentor_will_contact";
    contactValue?: string;
    meetingPreference:
      | "google_meet"
      | "in_person"
      | "coordinate_later";
    acceptedAt: string;
  };
}

export interface VentureContextForMentorConnection {
  ventureName: string;
  ventureStage: string;
  teamSummary?: string;
  ventureSummary: string;
}

export interface GenerateMentorConnectionBriefInput {
  ventureId: string;
  mentor: MentorMatch;
  canonicalVentureContext: VentureContextForMentorConnection;
  currentFocus?: CurrentFocus;
  readiness?: ReadinessState;
  activeDecisionCycle?: DecisionCycleState;
  verifiedEvidence: MentorConnectionEvidence[];
  relevantConversationSummary?: string;
  clarification?: string;
}

export interface GenerateMentorConnectionBriefResult {
  brief: MentorConnectionBrief;
  missingRequiredContext: string[];
  confidence: "low" | "medium" | "high";
  generatedAt: string;
}

export interface MentorConnectionBriefGenerator {
  generate(
    input: GenerateMentorConnectionBriefInput,
  ): Promise<GenerateMentorConnectionBriefResult>;
}

export interface SendMentorConnectionRequestInput {
  brief: MentorConnectionBrief;
}

export interface MentorConnectionRepository {
  getDraft(
    ventureId: string,
    mentorId: string,
  ): Promise<MentorConnectionBrief | null>;
  saveDraft(
    brief: MentorConnectionBrief,
  ): Promise<MentorConnectionBrief>;
  sendRequest(
    input: SendMentorConnectionRequestInput,
  ): Promise<MentorConnectionRequest>;
  getExistingRequest(
    ventureId: string,
    mentorId: string,
  ): Promise<MentorConnectionRequest | null>;
}

export type MentorConnectionOperationStatus =
  | "idle"
  | "working"
  | "success"
  | "error";

export interface MentorConnectionOperationState {
  activeMentorId?: string;
  generationStatus: MentorConnectionOperationStatus;
  saveStatus: MentorConnectionOperationStatus;
  sendStatus: MentorConnectionOperationStatus;
  errorMessage?: string;
  clarification?: {
    kind: "goal" | "empty_venture";
    prompt: string;
  };
}
