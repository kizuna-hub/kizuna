import type { SourceId, VentureId } from "../../../core";
import type {
  SourceReviewStatus,
  VentureSource,
} from "../../domain";
import type {
  AddSourceInput,
  DecisionLoopCommandResult,
} from "../contracts";
import type { VentureWorkspaceState } from "../model/venture-workspace-state";
import {
  isAccessibleVenture,
  markVentureUpdated,
  slugify,
  timestamp,
  uniqueId,
} from "../services/workspace-state-utils";

export function addSource(
  state: VentureWorkspaceState,
  ventureId: VentureId,
  input: AddSourceInput,
): DecisionLoopCommandResult & { sourceId?: SourceId } {
  if (!isAccessibleVenture(state, ventureId)) {
    return {
      state,
      ok: false,
      errors: ["Project is missing or archived."],
    };
  }
  if (!input.title.trim()) {
    return {
      state,
      ok: false,
      errors: ["Source title is required."],
    };
  }
  const duplicateTitle = state.sources.some(
    (source) =>
      source.ventureId === ventureId &&
      source.title.trim().toLowerCase() ===
        input.title.trim().toLowerCase(),
  );
  if (duplicateTitle) {
    return {
      state,
      ok: false,
      errors: [
        "A source with this title already exists in the project.",
      ],
    };
  }

  const importedAt = timestamp(input.importedAt);
  const id = uniqueId(
    state.sources.map((source) => source.id),
    `source-${ventureId.replace(/^venture-/, "")}-${slugify(
      input.title,
    )}`,
  );
  const source: VentureSource = {
    id,
    ventureId,
    title: input.title.trim(),
    kind: input.kind,
    origin: input.origin,
    authorName: input.authorName?.trim() || undefined,
    summary: input.summary?.trim() || undefined,
    content: input.content?.trim() || undefined,
    externalUrl: input.externalUrl?.trim() || undefined,
    createdAt: timestamp(input.createdAt ?? importedAt),
    importedAt,
    freshness: input.freshness ?? "unknown",
    reviewStatus: "unreviewed",
    visibility: input.visibility ?? "private",
    aiContribution:
      input.aiContribution ??
      (input.origin === "ai-generated" ? "generated" : "none"),
    tags: input.tags?.map((tag) => tag.trim()).filter(Boolean) ?? [],
  };

  return {
    state: markVentureUpdated(
      { ...state, sources: [source, ...state.sources] },
      ventureId,
      importedAt,
    ),
    ok: true,
    errors: [],
    sourceId: id,
  };
}

export function updateSourceReviewStatus(
  state: VentureWorkspaceState,
  ventureId: VentureId,
  sourceId: SourceId,
  reviewStatus: SourceReviewStatus,
  at?: string,
): DecisionLoopCommandResult {
  if (!isAccessibleVenture(state, ventureId)) {
    return {
      state,
      ok: false,
      errors: ["Project is missing or archived."],
    };
  }
  const source = state.sources.find(
    (item) => item.id === sourceId,
  );
  if (!source || source.ventureId !== ventureId) {
    return {
      state,
      ok: false,
      errors: ["Source does not belong to this project."],
    };
  }

  const changedAt = timestamp(at);
  return {
    state: markVentureUpdated(
      {
        ...state,
        sources: state.sources.map((item) =>
          item.id === sourceId
            ? {
                ...item,
                reviewStatus,
                freshness:
                  reviewStatus === "confirmed"
                    ? "current"
                    : item.freshness,
              }
            : item,
        ),
      },
      ventureId,
      changedAt,
    ),
    ok: true,
    errors: [],
  };
}

export function excludeSource(
  state: VentureWorkspaceState,
  ventureId: VentureId,
  sourceId: SourceId,
  at?: string,
) {
  return updateSourceReviewStatus(
    state,
    ventureId,
    sourceId,
    "excluded",
    at,
  );
}
