import type {
  MentorConnectionStatus,
  UniversityMentorConnectionSummary,
} from "./mentor-connection";

export interface MentorConnectionFilters {
  query: string;
  status: string;
  expertise: string;
  venture: string;
  waitingTime: string;
}

export const initialMentorConnectionFilters: MentorConnectionFilters = {
  query: "",
  status: "all",
  expertise: "all",
  venture: "all",
  waitingTime: "all",
};

export function isPendingMentorConnection(
  request: UniversityMentorConnectionSummary,
) {
  return ![
    "Draft",
    "Đã chấp nhận",
    "Đã từ chối",
    "Hết hạn",
  ].includes(request.status);
}

export function filterMentorConnections(
  requests: UniversityMentorConnectionSummary[],
  filters: MentorConnectionFilters,
) {
  const query = filters.query.trim().toLocaleLowerCase("vi");

  return requests.filter((request) => {
    const matchesQuery =
      !query ||
      [
        request.ventureName,
        request.mentorName,
        request.objective,
        ...request.expertise,
      ]
        .join(" ")
        .toLocaleLowerCase("vi")
        .includes(query);
    const matchesWaiting =
      filters.waitingTime === "all" ||
      (filters.waitingTime === "over-72" &&
        request.waitingHours > 72 &&
        isPendingMentorConnection(request)) ||
      (filters.waitingTime === "24-72" &&
        request.waitingHours >= 24 &&
        request.waitingHours <= 72) ||
      (filters.waitingTime === "under-24" &&
        request.waitingHours < 24);

    return (
      matchesQuery &&
      (filters.status === "all" ||
        request.status ===
          (filters.status as MentorConnectionStatus)) &&
      (filters.expertise === "all" ||
        request.expertise.includes(filters.expertise)) &&
      (filters.venture === "all" ||
        request.ventureId === filters.venture) &&
      matchesWaiting
    );
  });
}
