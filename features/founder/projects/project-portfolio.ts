import type {
  ProjectsSort,
  Venture,
} from "../../venture/core";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export type ProjectActivityGroupId =
  | "last-14-days"
  | "last-60-days"
  | "older";

export interface ProjectActivityGroup {
  id: ProjectActivityGroupId;
  label: string;
  ventures: Venture[];
}

export function getProjectCardDestination(
  venture: Venture,
  fallbackPath: string,
) {
  return venture.status === "active"
    ? `/founder/projects/${venture.id}/workspace`
    : fallbackPath;
}

const groupLabels: Record<ProjectActivityGroupId, string> = {
  "last-14-days": "Active in the last 14 days",
  "last-60-days": "Active in the last 60 days",
  older: "Older projects",
};

function getTimestamp(value: string) {
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

export function getProjectPortfolioReferenceTime(
  ventures: Venture[],
) {
  return ventures.reduce(
    (latest, venture) =>
      Math.max(latest, getTimestamp(venture.lastUpdatedAt)),
    0,
  );
}

export function sortProjectVentures(
  ventures: Venture[],
  sort: ProjectsSort,
) {
  return [...ventures].sort((left, right) => {
    if (sort === "name") {
      return left.name.localeCompare(right.name, "en", {
        sensitivity: "base",
      });
    }

    return (
      getTimestamp(right.lastUpdatedAt) -
      getTimestamp(left.lastUpdatedAt)
    );
  });
}

export function groupProjectVenturesByActivity(
  ventures: Venture[],
  referenceTime: number,
): ProjectActivityGroup[] {
  const grouped: Record<ProjectActivityGroupId, Venture[]> = {
    "last-14-days": [],
    "last-60-days": [],
    older: [],
  };

  ventures.forEach((venture) => {
    const ageInDays = Math.max(
      0,
      Math.floor(
        (referenceTime - getTimestamp(venture.lastUpdatedAt)) /
          DAY_IN_MS,
      ),
    );
    const groupId: ProjectActivityGroupId =
      ageInDays <= 14
        ? "last-14-days"
        : ageInDays <= 60
          ? "last-60-days"
          : "older";

    grouped[groupId].push(venture);
  });

  return (
    Object.keys(grouped) as ProjectActivityGroupId[]
  )
    .filter((id) => grouped[id].length > 0)
    .map((id) => ({
      id,
      label: groupLabels[id],
      ventures: grouped[id],
    }));
}

export function formatProjectActivity(
  value: string,
  referenceTime: number,
) {
  const ageInDays = Math.max(
    0,
    Math.floor(
      (referenceTime - getTimestamp(value)) / DAY_IN_MS,
    ),
  );

  if (ageInDays === 0) return "Edited today";
  if (ageInDays === 1) return "Edited yesterday";
  if (ageInDays < 30) return `Edited ${ageInDays} days ago`;

  const ageInMonths = Math.max(1, Math.floor(ageInDays / 30));
  if (ageInMonths < 12) {
    return `Edited ${ageInMonths} ${
      ageInMonths === 1 ? "month" : "months"
    } ago`;
  }

  const ageInYears = Math.max(1, Math.floor(ageInMonths / 12));
  return `Edited ${ageInYears} ${
    ageInYears === 1 ? "year" : "years"
  } ago`;
}
