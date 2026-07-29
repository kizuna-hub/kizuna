export type MentorAvailabilityStatus =
  | "available"
  | "limited"
  | "unavailable";

export type MentorMeetingMethod =
  | "google_meet"
  | "in_person";

export type MentorPricing =
  | {
      type: "free";
      label: string;
    }
  | {
      type: "paid";
      amount: number;
      currency: "VND";
      unit: "session";
      durationMinutes: number;
      label: string;
    }
  | {
      type: "sponsored";
      sponsorName: string;
      label: string;
    };

export interface MentorFitReason {
  id: string;
  title: string;
  description: string;
}

export interface MentorMatch {
  mentorId: string;
  profile: {
    name: string;
    avatarSrc?: string;
    role: string;
    organization: string;
    shortBio: string;
  };
  availability: {
    status: MentorAvailabilityStatus;
    label: string;
    nextSlots: string[];
    meetingMethods: MentorMeetingMethod[];
  };
  fit: {
    score: number;
    level: "good" | "strong" | "excellent";
    label: string;
    isPrimary: boolean;
  };
  relevantExpertise: string[];
  relevantExperience: Array<{
    id: string;
    label: string;
    value: string;
  }>;
  fitReasons: MentorFitReason[];
  recommendedFor: string;
  expectedOutcomes: string[];
  pricing: MentorPricing;
  durationMinutes: number;
}

export interface MentorRecommendationGridPayload {
  ventureId: string;
  contextSummary: string;
  primaryMentorId: string;
  mentors: MentorMatch[];
  generatedAt: string;
}

export type MentorRecommendationStatus =
  | "recommended"
  | "booked"
  | "deferred"
  | "external"
  | "stale";

export interface MentorRecommendationState {
  payload: MentorRecommendationGridPayload;
  selectedMentorId: string;
  savedMentorIds: string[];
  status: MentorRecommendationStatus;
  decisionCycleId: string;
  blockerId: string;
  recommendationVersion: number;
  errorMessage?: string;
}

export interface MentorRecommendationServiceInput {
  ventureId: string;
  ventureName: string;
  ventureStage: string;
  blocker: string;
  desiredOutcome?: string;
}

export interface MentorRecommendationService {
  recommend(
    input: MentorRecommendationServiceInput,
  ): Promise<MentorRecommendationGridPayload>;
}
