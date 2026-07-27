import {
  getAllVentures,
  getLastVisitedPathForVenture,
  getVentureById,
} from "../../venture-foundation/demo-repository";

import type {
  EntryDestination,
  ResolveEntryInput,
} from "../types/entry.types";

const hubHome = (
  notice?: "archived" | "access-denied" | "target-unavailable",
): EntryDestination => ({
  type: "hub-home",
  href: notice
    ? `/founder/home?notice=${notice}`
    : "/founder/home",
});

export function resolveAdaptiveFounderEntry({
  state,
  pendingDeepLink,
  pendingMentorSession,
  entryPreference,
}: ResolveEntryInput): EntryDestination {
  if (pendingDeepLink?.status === "valid") {
    return {
      type: "deep-link",
      href: pendingDeepLink.href,
    };
  }

  if (pendingDeepLink?.status === "access-denied") {
    return {
      type: "access-error",
      reason: pendingDeepLink.reason,
      href: pendingDeepLink.href,
    };
  }

  if (pendingDeepLink?.status === "target-unavailable") {
    return {
      type: "deep-link",
      href: pendingDeepLink.href,
    };
  }

  const ventures = getAllVentures(state);
  const incomplete = ventures
    .filter(
      (venture) =>
        venture.status === "setup" &&
        venture.setup &&
        venture.setup.status !== "completed",
    )
    .sort((left, right) =>
      right.lastUpdatedAt.localeCompare(left.lastUpdatedAt),
    )[0];
  if (incomplete?.setup) {
    return {
      type: "resume-venture-setup",
      ventureId: incomplete.id,
      stepId: incomplete.setup.currentStepId,
      href: `/founder/projects/${incomplete.id}/setup`,
    };
  }

  if (
    pendingMentorSession &&
    !state.uiPreferences.dismissedMentorSessionIds?.includes(
      pendingMentorSession.id,
    )
  ) {
    const venture = getVentureById(
      state,
      pendingMentorSession.ventureId,
    );
    if (venture && venture.status !== "archived") {
      return {
        type: "mentor-session",
        ventureId: venture.id,
        sessionId: pendingMentorSession.id,
        href: `/founder/projects/${venture.id}/workspace?conversation=${pendingMentorSession.conversationId}&session=${pendingMentorSession.id}`,
      };
    }
  }

  if (ventures.length === 0) {
    return {
      type: "new-founder-onboarding",
      href: "/founder/projects/new",
    };
  }

  const activeVentures = ventures.filter(
    (venture) => venture.status === "active",
  );
  const lastVisited = getVentureById(
    state,
    state.currentUser.lastVisitedVentureId,
  );

  if (
    state.currentUser.lastVisitedVentureId &&
    lastVisited?.status === "archived"
  ) {
    return hubHome("archived");
  }

  if (activeVentures.length === 1) {
    const venture = activeVentures[0];
    return {
      type: "resume-last-workspace",
      ventureId: venture.id,
      href:
        getLastVisitedPathForVenture(state, venture.id) ??
        `/founder/projects/${venture.id}/workspace`,
    };
  }

  if (activeVentures.length > 1) {
    const preference =
      entryPreference ??
      state.uiPreferences.entryPreference ??
      "continue-last-work";
    if (
      preference === "continue-last-work" &&
      lastVisited?.status === "active"
    ) {
      return {
        type: "resume-last-workspace",
        ventureId: lastVisited.id,
        href:
          getLastVisitedPathForVenture(state, lastVisited.id) ??
          `/founder/projects/${lastVisited.id}/workspace`,
      };
    }
    return hubHome();
  }

  return hubHome();
}
