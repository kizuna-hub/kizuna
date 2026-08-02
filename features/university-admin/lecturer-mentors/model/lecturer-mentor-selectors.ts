import type { UniversityLecturerMentorSummary } from "./lecturer-mentor";

export interface LecturerMentorFilters {
  query: string;
  faculty: string;
  expertise: string;
  availability: string;
  status: string;
}

export const initialLecturerMentorFilters: LecturerMentorFilters = {
  query: "",
  faculty: "all",
  expertise: "all",
  availability: "all",
  status: "all",
};

export function filterUniversityLecturerMentors(
  mentors: UniversityLecturerMentorSummary[],
  filters: LecturerMentorFilters,
) {
  const query = filters.query.trim().toLocaleLowerCase("vi");

  return mentors.filter((mentor) => {
    const matchesQuery =
      !query ||
      [
        mentor.name,
        mentor.academicTitle,
        mentor.faculty,
        mentor.department ?? "",
        ...mentor.expertise,
      ]
        .join(" ")
        .toLocaleLowerCase("vi")
        .includes(query);

    return (
      matchesQuery &&
      (filters.faculty === "all" ||
        mentor.faculty === filters.faculty) &&
      (filters.expertise === "all" ||
        mentor.expertise.includes(filters.expertise)) &&
      (filters.availability === "all" ||
        mentor.availability === filters.availability) &&
      (filters.status === "all" ||
        mentor.status === filters.status)
    );
  });
}

