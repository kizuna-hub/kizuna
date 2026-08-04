export const CAMPUSFLOW_MENTOR_CONVERSATION_IDS = [
  "campusflow-mentor-priority-tran-minh-quan",
  "campusflow-mentor-profile-pham-thu-ha",
  "campusflow-mentor-comparison-pilot-research",
  "campusflow-prepare-pilot-session",
  "campusflow-mentor-interview-questions",
] as const;

export type CampusFlowMentorConversationId =
  (typeof CAMPUSFLOW_MENTOR_CONVERSATION_IDS)[number];
