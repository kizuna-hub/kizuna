export type MentorConnectionRequestStatus =
  | "new"
  | "viewed"
  | "needs_more_context"
  | "accepted"
  | "declined"
  | "cancelled";

export type MentorContactMethod =
  | "zalo"
  | "phone"
  | "email"
  | "messenger"
  | "mentor_will_contact";

export type MentorMeetingPreference =
  | "google_meet"
  | "in_person"
  | "coordinate_later";

export type MentorRequestStage =
  | "idea"
  | "prototype"
  | "pilot"
  | "launched";

export type MentorRequestFilter =
  | "all"
  | "new"
  | "viewed"
  | "contacted";

export type MentorRequestSort =
  | "newest"
  | "best_fit"
  | "expiring";

export interface MentorPersona {
  id: string;
  name: string;
  role: string;
  organization: string;
  experience: string;
  mentoringBackground: string;
  expertise: string[];
  verificationLabel: string;
  avatarSrc?: string;
  profileCompletion: number;
}

export interface MentorAcceptance {
  id: string;
  requestId: string;
  mentorId: string;
  message: string;
  contactMethod: MentorContactMethod;
  contactValue?: string;
  meetingPreference: MentorMeetingPreference;
  acceptedAt: string;
}

export interface MentorContactPreference {
  preferredChannel: MentorContactMethod;
  contactValue?: string;
  defaultAcceptanceMessage?: string;
}

export interface MentorFounder {
  id: string;
  name: string;
  avatarSrc?: string;
  institution?: string;
}

export interface MentorVenture {
  id: string;
  name: string;
  stage: MentorRequestStage;
  teamSummary: string;
  productSummary: string;
  tags?: string[];
}

export interface MentorRequestBrief {
  currentChallenge: string;
  supportNeeded: string[];
  expectedOutcome: string;
  founderMessage?: string;
  founderConfirmed: boolean;
}

export interface MentorRequestEvidence {
  id: string;
  label: string;
  value: string;
  sourceLabel?: string;
}

export interface MentorSharedDocument {
  id: string;
  name: string;
  type: "pdf" | "pptx" | "docx";
  selectedPageLabels?: string[];
  available: boolean;
}

export interface MentorMoreContextRecord {
  selectedTopics: MentorMoreContextTopic[];
  note?: string;
  requestedAt: string;
}

export interface MentorDeclineRecord {
  reason: MentorDeclineReason;
  note?: string;
  declinedAt: string;
}

export interface MentorConnectionRequest {
  id: string;
  founder: MentorFounder;
  venture: MentorVenture;
  brief: MentorRequestBrief;
  evidence: MentorRequestEvidence[];
  sharedDocuments: MentorSharedDocument[];
  status: MentorConnectionRequestStatus;
  fitScore: number;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  briefVersion: number;
  viewedBriefVersion?: number;
  acceptance?: MentorAcceptance;
  moreContext?: MentorMoreContextRecord;
  decline?: MentorDeclineRecord;
}

export type MentorMoreContextTopic =
  | "product_summary"
  | "current_challenge"
  | "founder_question"
  | "evidence"
  | "documents"
  | "other";

export type MentorDeclineReason =
  | "expertise_mismatch"
  | "no_time"
  | "insufficient_context"
  | "conflict_of_interest"
  | "other";

export interface MentorRequestListInput {
  filter?: MentorRequestFilter;
  sort?: MentorRequestSort;
}

export interface AcceptMentorRequestInput {
  requestId: string;
  mentorId: string;
  message: string;
  contactMethod: MentorContactMethod;
  contactValue?: string;
  meetingPreference: MentorMeetingPreference;
  saveAsDefault: boolean;
}

export interface RequestMoreContextInput {
  requestId: string;
  selectedTopics: MentorMoreContextTopic[];
  note?: string;
}

export interface DeclineMentorRequestInput {
  requestId: string;
  reason: MentorDeclineReason;
  note?: string;
}

export interface MentorWorkspaceSnapshot {
  requests: MentorConnectionRequest[];
  contactPreference: MentorContactPreference | null;
}

export interface MentorWorkspaceRepository {
  listRequests(
    input?: MentorRequestListInput,
  ): Promise<MentorConnectionRequest[]>;
  getRequest(
    requestId: string,
  ): Promise<MentorConnectionRequest | null>;
  markRequestViewed(
    requestId: string,
  ): Promise<MentorConnectionRequest>;
  acceptRequest(
    input: AcceptMentorRequestInput,
  ): Promise<MentorConnectionRequest>;
  requestMoreContext(
    input: RequestMoreContextInput,
  ): Promise<MentorConnectionRequest>;
  declineRequest(
    input: DeclineMentorRequestInput,
  ): Promise<MentorConnectionRequest>;
  listAcceptedConnections(): Promise<MentorConnectionRequest[]>;
  getContactPreference(): Promise<MentorContactPreference | null>;
  saveContactPreference(
    preference: MentorContactPreference,
  ): Promise<MentorContactPreference>;
}
