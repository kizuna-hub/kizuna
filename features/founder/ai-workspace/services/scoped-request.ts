import type { ScopedAiRequest } from "../types/long-run-workspace.types";

export function isScopedRequestCurrent(
  expected: ScopedAiRequest,
  current: ScopedAiRequest,
) {
  return (
    expected.requestId === current.requestId &&
    expected.ventureId === current.ventureId &&
    expected.conversationId === current.conversationId &&
    expected.stateVersion === current.stateVersion &&
    expected.surface === current.surface
  );
}
