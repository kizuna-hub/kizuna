import {
  createVentureSearchService,
  type VentureSearchIndex,
} from "../services/venture-search-service";
import type {
  LongRunWorkspaceState,
  VentureSearchResult,
} from "../types/long-run-workspace.types";

function buildSearchResults(
  state: LongRunWorkspaceState,
): VentureSearchResult[] {
  const pinnedSourceIds = new Set(
    state.pinnedItems.map((item) => item.sourceId),
  );
  const messageResults = state.sessions.flatMap((session) =>
    (state.messagesByConversation[session.id] ?? []).map(
      (message) => ({
        id: `search-${message.id}`,
        ventureId: state.ventureId,
        contentType: "conversation" as const,
        title: session.title,
        snippet: message.content,
        searchText: message.content,
        createdAt: message.createdAt,
        sourceLabel: "Hội thoại",
        contributor:
          message.role === "founder"
            ? ("founder" as const)
            : ("ai" as const),
        conversationId: session.id,
        messageId: message.id,
        sourceId: message.id,
        isPinned: pinnedSourceIds.has(message.id),
      }),
    ),
  );

  const memoryResults = state.memory.map((item) => ({
    id: `search-${item.id}`,
    ventureId: state.ventureId,
    contentType:
      item.type === "decision"
        ? ("decision" as const)
        : item.type === "evidence"
          ? ("evidence" as const)
          : item.type === "mentor_advice"
            ? ("mentor_session" as const)
            : item.type === "opportunity"
              ? ("opportunity" as const)
              : ("memory" as const),
    title: item.title,
    snippet: item.summary,
    searchText: `${item.title} ${item.summary}`,
    createdAt: item.updatedAt,
    sourceLabel:
      item.sourceIds.length > 1
        ? `${item.sourceIds.length} nguồn`
        : "1 nguồn",
    contributor: item.createdBy,
    status: item.status,
    relatedDecisionCycleId: item.relatedDecisionCycleId,
    sourceId: item.id,
    isPinned: pinnedSourceIds.has(item.id),
  }));

  const materialResults = state.materialVersions.map((material) => ({
    id: `search-${material.id}`,
    ventureId: state.ventureId,
    contentType: "document" as const,
    title: material.name,
    snippet: material.summary,
    searchText: `${material.name} ${material.summary} ${material.comparisonNotes.join(" ")}`,
    createdAt: material.createdAt,
    sourceLabel: material.versionLabel,
    contributor: "founder" as const,
    status:
      material.status === "superseded"
        ? ("superseded" as const)
        : material.status === "archived"
          ? ("outdated" as const)
          : ("verified" as const),
    sourceId: material.id,
    isPinned: pinnedSourceIds.has(material.id),
  }));

  const readinessResults = state.readinessHistory.map((change) => ({
    id: `search-${change.id}`,
    ventureId: state.ventureId,
    contentType: "readiness" as const,
    title: `Readiness ${change.previousScore} → ${change.nextScore}`,
    snippet: change.reason,
    searchText: `${change.reason} ${change.dimensionChanges
      .map((dimension) => dimension.label)
      .join(" ")}`,
    createdAt: change.createdAt,
    sourceLabel: change.rubricVersion,
    contributor: "system" as const,
    sourceId: change.id,
    isPinned: pinnedSourceIds.has(change.id),
  }));

  const summaryResults = state.summaries.map((summary) => ({
    id: `search-${summary.id}`,
    ventureId: state.ventureId,
    contentType: "report" as const,
    title: "Tóm tắt phiên làm việc",
    snippet: summary.sections
      .flatMap((section) => section.items)
      .slice(0, 2)
      .join(" · "),
    searchText: summary.sections
      .flatMap((section) => section.items)
      .join(" "),
    createdAt: summary.updatedAt,
    sourceLabel: "Checkpoint phiên",
    contributor: "ai" as const,
    conversationId: summary.conversationId,
    sourceId: summary.id,
    isPinned: pinnedSourceIds.has(summary.id),
  }));

  return [
    ...memoryResults,
    ...messageResults,
    ...materialResults,
    ...readinessResults,
    ...summaryResults,
  ];
}

export function createMockVentureSearchService(
  getState: () => LongRunWorkspaceState,
) {
  const index: VentureSearchIndex = {
    getResults(ventureId) {
      const state = getState();
      return state.ventureId === ventureId
        ? buildSearchResults(state)
        : [];
    },
  };
  return createVentureSearchService(index);
}

export { buildSearchResults };
