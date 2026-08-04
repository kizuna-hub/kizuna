export type FounderConversationSessionType =
  | "mentor_matching"
  | "mentor_profile"
  | "mentor_comparison"
  | "session_preparation"
  | "mentor_questions";

export type ConversationHistoryView =
  | "session_library"
  | "session_detail";

export type ConversationSessionFilter =
  | "all"
  | FounderConversationSessionType;

export type MentorSourceProvenance =
  | "kizuna_verified"
  | "public_source"
  | "mentor_self_declared"
  | "kizuna_inference";

export type MentorSourceVerificationStatus =
  | "verified"
  | "unverified"
  | "self_declared"
  | "inferred";

export interface ConversationContextSnapshot {
  ventureName: string;
  ventureStage: string;
  currentSupportNeed: string;
  expectedOutcome?: string;
  selectedMentorIds: string[];
  sourceIds: string[];
  capturedAt: string;
}

export interface MentorConversationSource {
  id: string;
  title: string;
  description: string;
  provenance: MentorSourceProvenance;
  verificationStatus: MentorSourceVerificationStatus;
  href?: string;
  capturedAt?: string;
}

export const conversationSessionTypeLabels: Record<
  FounderConversationSessionType,
  string
> = {
  mentor_matching: "Mentor matching",
  mentor_profile: "Thông tin mentor",
  mentor_comparison: "So sánh mentor",
  session_preparation: "Chuẩn bị phiên",
  mentor_questions: "Câu hỏi cho mentor",
};

export const mentorSourceProvenanceLabels: Record<
  MentorSourceProvenance,
  string
> = {
  kizuna_verified: "Kizuna đã xác minh",
  public_source: "Nguồn công khai",
  mentor_self_declared: "Mentor tự khai báo",
  kizuna_inference: "Phân tích của Kizuna",
};
