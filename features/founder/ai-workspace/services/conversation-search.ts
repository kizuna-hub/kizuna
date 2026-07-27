import type { AiWorkspaceMessage } from "../types/ai-workspace.types";

export function findConversationMessageMatches(
  messages: AiWorkspaceMessage[],
  query: string,
) {
  const normalizedQuery = query.trim().toLocaleLowerCase("vi");
  if (!normalizedQuery) return [];
  return messages.filter((message) =>
    message.content
      .toLocaleLowerCase("vi")
      .includes(normalizedQuery),
  );
}
