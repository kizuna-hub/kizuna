import type {
  VentureSearchContentType,
  VentureSearchResult,
  VentureSearchService,
} from "../types/long-run-workspace.types";

export interface VentureSearchIndex {
  getResults(ventureId: string): VentureSearchResult[];
}

export const searchGroupOrder: VentureSearchContentType[] = [
  "decision",
  "evidence",
  "conversation",
  "document",
  "mentor_session",
  "readiness",
  "memory",
  "opportunity",
  "report",
];

export function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/g, "d")
    .toLowerCase()
    .trim();
}

const semanticAliasGroups = [
  [
    "pricing",
    "dinh gia",
    "willingness to pay",
    "kha nang chi tra",
    "monetization",
  ],
  [
    "activation",
    "onboarding",
    "kich hoat",
    "nguoi dung moi",
  ],
  [
    "mentor",
    "co van",
    "chuyen gia",
    "expert",
  ],
  [
    "target customer",
    "khach hang muc tieu",
    "phan khuc",
    "segment",
  ],
] as const;

function expandedQueryTerms(query: string) {
  const normalized = normalizeSearchText(query);
  if (!normalized) return [];
  const aliasGroup = semanticAliasGroups.find((group) =>
    group.some((term) => normalized.includes(term)),
  );
  return aliasGroup ? [...aliasGroup, normalized] : [normalized];
}

function matchesDateRange(
  createdAt: string,
  dateRange: "all" | "7_days" | "30_days" | "older",
) {
  if (dateRange === "all") return true;
  const now = new Date("2026-07-27T12:00:00.000Z").getTime();
  const ageInDays =
    (now - new Date(createdAt).getTime()) / 86_400_000;
  if (dateRange === "7_days") return ageInDays <= 7;
  if (dateRange === "30_days") return ageInDays <= 30;
  return ageInDays > 30;
}

export function createVentureSearchService(
  index: VentureSearchIndex,
): VentureSearchService {
  return {
    async search(input) {
      if (
        normalizeSearchText(input.query).includes(
          "loi tim kiem",
        )
      ) {
        await Promise.resolve();
        throw new Error("Deterministic venture search failure");
      }
      const terms = expandedQueryTerms(input.query);
      const results = index
        .getResults(input.ventureId)
        .filter((result) => {
          const haystack = normalizeSearchText(
            `${result.title} ${result.snippet} ${result.searchText}`,
          );
          const queryMatches =
            terms.length === 0 ||
            terms.some((term) => haystack.includes(term));
          const typeMatches =
            input.filters.contentType === "all" ||
            result.contentType === input.filters.contentType;
          const statusMatches =
            input.filters.status === "all" ||
            result.status === input.filters.status;
          const cycleMatches =
            input.filters.decisionCycleId === "all" ||
            result.relatedDecisionCycleId ===
              input.filters.decisionCycleId;
          const contributorMatches =
            input.filters.contributor === "all" ||
            result.contributor === input.filters.contributor;
          const pinnedMatches =
            !input.filters.pinnedOnly || result.isPinned;
          return (
            queryMatches &&
            typeMatches &&
            statusMatches &&
            cycleMatches &&
            contributorMatches &&
            pinnedMatches &&
            matchesDateRange(
              result.createdAt,
              input.filters.dateRange,
            )
          );
        })
        .sort((left, right) => {
          const groupDelta =
            searchGroupOrder.indexOf(left.contentType) -
            searchGroupOrder.indexOf(right.contentType);
          if (groupDelta !== 0) return groupDelta;
          return right.createdAt.localeCompare(left.createdAt);
        });

      await Promise.resolve();
      return results;
    },
  };
}
