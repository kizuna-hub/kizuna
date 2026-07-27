import type {
  ContextAssemblyInput,
  ContextAssemblyResult,
  LongRunWorkspaceState,
} from "../types/long-run-workspace.types";

export interface ContextAssemblyService {
  buildContext(input: ContextAssemblyInput): ContextAssemblyResult;
}

export function createContextAssemblyService(
  getState: () => LongRunWorkspaceState,
): ContextAssemblyService {
  return {
    buildContext(input) {
      const state = getState();
      if (state.ventureId !== input.ventureId) {
        return {
          recentMessages: [],
          confirmedMemory: [],
          assumptions: [],
          evidence: [],
          selectedDocuments: [],
          excludedItems: state.memory.map((item) => ({
            id: item.id,
            reason: "different_venture" as const,
          })),
          humanReadableSources: [],
        };
      }

      const messages =
        state.messagesByConversation[input.conversationId] ?? [];
      const confirmedMemory = state.memory.filter(
        (item) => item.status === "verified",
      );
      const assumptions = state.memory.filter(
        (item) =>
          item.status === "assumed" || item.status === "inferred",
      );
      const evidence = state.memory.filter(
        (item) =>
          item.type === "evidence" &&
          item.status !== "outdated" &&
          item.status !== "superseded",
      );
      const selectedDocuments = state.materialVersions.filter(
        (material) =>
          input.selectedSourceIds.includes(material.id) &&
          material.status !== "archived",
      );
      const historicalSummary = state.summaries
        .filter(
          (summary) =>
            summary.conversationId === input.conversationId &&
            summary.status !== "none",
        )
        .sort((left, right) =>
          right.updatedAt.localeCompare(left.updatedAt),
        )[0];
      const excludedItems = state.memory
        .filter(
          (item) =>
            item.status === "outdated" ||
            item.status === "superseded",
        )
        .map((item) => ({
          id: item.id,
          reason: "outdated" as const,
        }));

      return {
        recentMessages: messages.slice(-6),
        confirmedMemory: confirmedMemory.slice(0, 3),
        assumptions: assumptions.slice(0, 2),
        evidence: evidence.slice(0, 2),
        selectedDocuments,
        historicalSummary,
        excludedItems,
        humanReadableSources: [
          `${Math.min(messages.length, 6)} tin nhắn gần đây`,
          `${Math.min(confirmedMemory.length, 3)} thông tin đã xác nhận`,
          `${Math.min(evidence.length, 2)} bằng chứng liên quan`,
          "Chu kỳ quyết định hiện tại",
        ],
      };
    },
  };
}
