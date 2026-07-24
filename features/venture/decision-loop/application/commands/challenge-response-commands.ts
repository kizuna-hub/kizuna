import type { VentureId } from "../../../core";
import type { ChallengeFounderResponse } from "../../domain";
import type { DecisionLoopCommandResult } from "../contracts";
import type { VentureWorkspaceState } from "../model/venture-workspace-state";
import { getCurrentChallengeScan } from "../queries/challenge-queries";

export function respondToChallengeItem(
  state: VentureWorkspaceState,
  ventureId: VentureId,
  challengeItemId: string,
  response: ChallengeFounderResponse,
): DecisionLoopCommandResult {
  const scan = getCurrentChallengeScan(state, ventureId);
  const item = state.challengeItems.find(
    (candidate) => candidate.id === challengeItemId,
  );
  if (
    !scan ||
    !item ||
    item.ventureId !== ventureId ||
    !scan.itemIds.includes(item.id)
  ) {
    return {
      state,
      ok: false,
      errors: ["Challenge item does not belong to the current scan."],
    };
  }

  const challengeItems = state.challengeItems.map((candidate) =>
    candidate.id === item.id
      ? { ...candidate, founderResponse: response }
      : candidate,
  );
  const allReviewed = challengeItems
    .filter((candidate) => scan.itemIds.includes(candidate.id))
    .every(
      (candidate) => candidate.founderResponse !== "unreviewed",
    );
  return {
    state: {
      ...state,
      challengeItems,
      challengeScans: state.challengeScans.map((candidate) =>
        candidate.id === scan.id
          ? {
              ...candidate,
              status: allReviewed
                ? ("reviewed" as const)
                : candidate.status,
              reviewedAt: allReviewed
                ? scan.generatedAt
                : candidate.reviewedAt,
            }
          : candidate,
      ),
    },
    ok: true,
    errors: [],
  };
}

export function updateChallengeItemNote(
  state: VentureWorkspaceState,
  ventureId: VentureId,
  challengeItemId: string,
  note: string,
): DecisionLoopCommandResult {
  const item = state.challengeItems.find(
    (candidate) => candidate.id === challengeItemId,
  );
  if (!item || item.ventureId !== ventureId) {
    return {
      state,
      ok: false,
      errors: ["Challenge item does not belong to this project."],
    };
  }
  return {
    state: {
      ...state,
      challengeItems: state.challengeItems.map((candidate) =>
        candidate.id === item.id
          ? { ...candidate, founderNote: note.trim() || undefined }
          : candidate,
      ),
    },
    ok: true,
    errors: [],
  };
}

