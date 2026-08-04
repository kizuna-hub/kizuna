export type MentorshipCheckpointSource =
  | "founder_reported"
  | "mentor_confirmed"
  | "program_recorded";

export type MentorshipCheckpointStatus =
  | "recorded"
  | "in_progress"
  | "result_ready"
  | "not_completed"
  | "commitment_changed"
  | "pre_read_ready"
  | "pre_read_sent"
  | "reviewed";

export type MentorshipCheckpointExecutionStatus =
  | "in_progress"
  | "result_ready"
  | "not_completed"
  | "commitment_changed";

export interface MentorshipEvidenceReference {
  id: string;
  checkpointId: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  source:
    | "founder_submitted"
    | "existing_document"
    | "external_reference";
  attachedAt: string;
}

export interface MentorshipCheckpoint {
  id: string;
  ventureId: string;
  founderId: string;
  mentorId: string;
  connectionRequestId: string;
  sequence: number;
  title: string;
  sessionDate: string;
  decision: string;
  founderCommitment: string;
  nextReviewQuestion: string;
  nextReviewAt?: string;
  privateFounderNote?: string;
  expectedEvidenceReferences?: string;
  source: MentorshipCheckpointSource;
  status: MentorshipCheckpointStatus;
  executionStatus?: MentorshipCheckpointExecutionStatus;
  resultSummary?: string;
  changedAssumption?: string;
  blockerSummary?: string;
  evidenceIds: string[];
  mentorViewedAt?: string;
  mentorConfirmedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type MentorshipPreReadStatus = "draft" | "ready" | "sent";

export interface MentorshipPreReadContent {
  previousDecision: string;
  founderCommitment: string;
  resultSummary: string;
  newInsight: string;
  incompleteSummary: string;
  mentorReviewQuestion: string;
  evidenceIds: string[];
}

export interface MentorshipPreRead
  extends MentorshipPreReadContent {
  id: string;
  checkpointId: string;
  ventureId: string;
  founderId: string;
  mentorId: string;
  reviewAt?: string;
  status: MentorshipPreReadStatus;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  sentSnapshot?: MentorshipPreReadContent;
}

export interface MentorshipJourneySummary {
  ventureId: string;
  mentorId: string;
  connectionRequestId: string;
  connectedAt: string;
  currentGoal: string;
  nextReviewAt?: string;
  activeCheckpointId?: string;
  latestPreReadId?: string;
}

export interface CreateMentorshipCheckpointInput {
  ventureId: string;
  decision: string;
  founderCommitment: string;
  nextReviewQuestion: string;
  nextReviewAt?: string;
  privateFounderNote?: string;
  expectedEvidenceReferences?: string;
  idempotencyKey: string;
}

export interface UpdateMentorshipCheckpointResultInput {
  checkpointId: string;
  executionStatus: MentorshipCheckpointExecutionStatus;
  resultSummary: string;
  changedAssumption: string;
  blockerSummary?: string;
  evidence?: Array<
    Omit<
      MentorshipEvidenceReference,
      "id" | "checkpointId" | "attachedAt"
    > & { id?: string }
  >;
}

export interface AttachMentorshipEvidenceInput {
  checkpointId: string;
  evidence: Array<
    Omit<
      MentorshipEvidenceReference,
      "id" | "checkpointId" | "attachedAt"
    > & { id?: string }
  >;
}

export interface UpsertMentorshipPreReadInput
  extends MentorshipPreReadContent {
  checkpointId: string;
}
