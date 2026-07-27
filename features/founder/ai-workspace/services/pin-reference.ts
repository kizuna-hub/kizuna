import type {
  PinnedItemReference,
  PinnedItemType,
  VentureSearchResult,
} from "../types/long-run-workspace.types";

export function pinTypeForSearchResult(
  result: VentureSearchResult,
): PinnedItemType {
  if (result.contentType === "decision") return "decision";
  if (result.contentType === "evidence") return "evidence";
  if (result.contentType === "document") return "document";
  if (result.contentType === "mentor_session") {
    return "mentor_advice";
  }
  if (result.contentType === "conversation") return "message";
  return "search_result";
}

export function createPinReference(
  ventureId: string,
  sourceId: string,
  title: string,
  sourceLabel: string,
  itemType: PinnedItemType,
): PinnedItemReference {
  return {
    id: `pin-${itemType}-${sourceId}`,
    ventureId,
    itemType,
    sourceId,
    title,
    sourceLabel,
    createdAt: new Date().toISOString(),
  };
}
