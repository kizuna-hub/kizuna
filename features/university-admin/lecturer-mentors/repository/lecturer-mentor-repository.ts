import {
  lecturerExpertiseDemand,
  universityLecturerMentors,
} from "../data/lecturer-mentor-mock-data";

export function listUniversityLecturerMentors() {
  return structuredClone(universityLecturerMentors);
}

export function getUniversityLecturerMentor(id: string) {
  return structuredClone(
    universityLecturerMentors.find((mentor) => mentor.id === id) ??
      null,
  );
}

export function getLecturerMentorDirectoryDashboard() {
  return {
    mentors: listUniversityLecturerMentors(),
    expertiseDemand: structuredClone(lecturerExpertiseDemand),
    metrics: {
      activeMentors: 48,
      openRequests: 32,
      averageResponseHours: 16.8,
      acceptanceRate: 67,
    },
  };
}

