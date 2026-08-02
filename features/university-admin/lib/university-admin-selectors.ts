import type { UniversityVenture } from "../types";

export interface VentureFilters {
  query: string;
  stage: string;
  readiness: string;
  attention: string;
}

export function filterVentures(
  ventures: UniversityVenture[],
  filters: VentureFilters,
) {
  const query = filters.query.trim().toLocaleLowerCase("vi");

  return ventures.filter((venture) => {
    const matchesQuery =
      !query ||
      [
        venture.name,
        venture.description,
        venture.founder.name,
        venture.blocker,
      ].some((value) =>
        value.toLocaleLowerCase("vi").includes(query),
      );

    return (
      matchesQuery &&
      (filters.stage === "all" ||
        venture.stage === filters.stage) &&
      (filters.readiness === "all" ||
        venture.readinessLevel === filters.readiness) &&
      (filters.attention === "all" ||
        venture.attention === filters.attention)
    );
  });
}

