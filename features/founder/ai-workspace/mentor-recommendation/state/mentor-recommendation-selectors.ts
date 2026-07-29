import type {
  MentorMatch,
  MentorPricing,
  MentorRecommendationState,
} from "../types/mentor-recommendation.types";

export const mentorFitExplanation =
  "Mức độ phù hợp được tính theo nhu cầu hiện tại của venture, không phải điểm đánh giá năng lực tổng thể của mentor.";

export function selectMentorMatch(
  recommendation: MentorRecommendationState | undefined,
  mentorId?: string,
): MentorMatch | undefined {
  const mentors = recommendation?.payload?.mentors;
  if (!Array.isArray(mentors)) return undefined;
  const selectedId =
    mentorId ?? recommendation?.selectedMentorId;
  return mentors.find(
    (mentor) => mentor.mentorId === selectedId,
  );
}

export function selectPrimaryMentor(
  recommendation: MentorRecommendationState | undefined,
): MentorMatch | undefined {
  const mentors = recommendation?.payload?.mentors;
  if (!Array.isArray(mentors)) return undefined;
  return mentors.find(
    (mentor) =>
      mentor.mentorId ===
      recommendation?.payload?.primaryMentorId,
  );
}

export function isMentorSaved(
  recommendation: MentorRecommendationState | undefined,
  mentorId: string,
) {
  return (
    recommendation?.savedMentorIds?.includes(mentorId) ?? false
  );
}

export function formatMentorPricing(
  pricing: MentorPricing,
) {
  return pricing.label;
}

export function formatMeetingMethod(
  method: MentorMatch["availability"]["meetingMethods"][number],
) {
  return method === "google_meet"
    ? "Google Meet"
    : "Gặp trực tiếp";
}

export function getMentorInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
