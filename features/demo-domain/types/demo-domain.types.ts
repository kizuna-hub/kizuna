export type DemoDomainRequestStatus =
  | "pending"
  | "viewed"
  | "needs_more_context"
  | "accepted"
  | "declined"
  | "cancelled";

export interface DemoDomainUser {
  id: string;
  name: string;
  email: string;
  role: "founder" | "mentor";
}

export interface DemoFounderProfile {
  id: string;
  userId: string;
  displayName: string;
  title: "Founder";
}

export interface DemoMentorProfile {
  id: string;
  userId: string;
  displayName: string;
  role: string;
  organization: string;
  expertise: string[];
}

export interface DemoDomainDocument {
  id: string;
  name: string;
  type: "pdf" | "pptx" | "docx";
  selectedPageLabels: string[];
  available: boolean;
}

export interface DemoDomainEvidence {
  id: string;
  label: string;
  value: string;
  sourceLabel?: string;
}

export interface DemoDomainReadiness {
  overallScore: number;
  strongestDimension: {
    id: string;
    label: string;
    score: number;
  };
  biggestGap: {
    id: string;
    label: string;
    score: number;
  };
}

export interface DemoDomainVenture {
  id: string;
  ownerId: string;
  name: string;
  stage: "idea" | "prototype" | "pilot" | "launched";
  teamSummary: string;
  productSummary: string;
  tags: string[];
  documentIds: string[];
  evidenceIds: string[];
  readiness: DemoDomainReadiness;
  canonicalQuestionIds: string[];
  updatedAt: string;
}

export interface ConnectionBriefSnapshot {
  id: string;
  version: 1;
  capturedAt: string;
  founder: {
    id: string;
    name: string;
    institution: string;
  };
  venture: DemoDomainVenture;
  mentor: {
    id: string;
    name: string;
    role: string;
    organization: string;
    fitScore: number;
  };
  currentChallenge: string;
  supportNeeded: string[];
  expectedOutcome: string;
  founderMessage?: string;
  evidence: DemoDomainEvidence[];
  sharedDocuments: DemoDomainDocument[];
}

export interface DemoDomainMentorAcceptance {
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
}

export interface DemoDomainConnectionRequest {
  id: string;
  founderId: string;
  ventureId: string;
  mentorId: string;
  status: DemoDomainRequestStatus;
  briefSnapshot: ConnectionBriefSnapshot;
  createdAt: string;
  updatedAt: string;
  viewedAt?: string;
  acceptance?: DemoDomainMentorAcceptance;
}

export interface DemoDomainState {
  version: 1;
  revision: number;
  users: DemoDomainUser[];
  founderProfiles: DemoFounderProfile[];
  mentorProfiles: DemoMentorProfile[];
  documents: DemoDomainDocument[];
  evidence: DemoDomainEvidence[];
  ventures: DemoDomainVenture[];
  connectionRequests: DemoDomainConnectionRequest[];
  updatedAt: string;
}

export interface DemoDomainRepository {
  getSnapshot(): DemoDomainState;
  bootstrapCampusFlow(
    venture: DemoDomainVenture,
    documents: DemoDomainDocument[],
    evidence: DemoDomainEvidence[],
  ): DemoDomainState;
  recordCanonicalQuestion(
    ventureId: string,
    questionId: string,
  ): DemoDomainState;
  createConnectionRequest(
    brief: ConnectionBriefSnapshot,
  ): DemoDomainConnectionRequest;
  markRequestViewed(
    requestId: string,
  ): DemoDomainConnectionRequest;
  updateRequestStatus(
    requestId: string,
    status: Extract<
      DemoDomainRequestStatus,
      "needs_more_context" | "declined" | "cancelled"
    >,
  ): DemoDomainConnectionRequest;
  acceptRequest(
    requestId: string,
    acceptance: Omit<
      DemoDomainMentorAcceptance,
      "id" | "requestId" | "mentorId" | "acceptedAt"
    >,
  ): DemoDomainConnectionRequest;
  subscribe(listener: (state: DemoDomainState) => void): () => void;
  destroy(): void;
}
