import {
  getAllVentures,
  getLastVisitedPathForVenture,
  getVentureById,
} from "./demo-repository";
import type {
  DemoWorkspaceState,
  VentureId,
} from "./types";

const canonicalSections = new Set([
  "context",
  "cycle",
  "evidence",
  "sessions",
  "outputs",
  "timeline",
]);

const legacyOutputSections = new Set([
  "ai-pitch-deck",
  "data-room",
]);

export function getVentureOverviewPath(ventureId: VentureId) {
  return `/founder/projects/${ventureId}`;
}

export function normalizeFounderPath(pathname: string) {
  const withoutQuery = pathname.split(/[?#]/, 1)[0] || "/";
  const withoutLocale = withoutQuery.replace(/^\/(?:en|vi)(?=\/)/, "");
  if (withoutLocale.length > 1 && withoutLocale.endsWith("/")) {
    return withoutLocale.slice(0, -1);
  }
  return withoutLocale;
}

export function resolveFounderEntryPath(state: DemoWorkspaceState) {
  const ventures = getAllVentures(state);
  if (ventures.length === 0) return "/submit-project";

  if (ventures.length === 1) {
    const [venture] = ventures;
    if (venture.status === "setup") {
      return `${getVentureOverviewPath(venture.id)}/context`;
    }
    return (
      getLastVisitedPathForVenture(state, venture.id) ??
      getVentureOverviewPath(venture.id)
    );
  }

  const lastVisitedId = state.currentUser.lastVisitedVentureId;
  const lastVisited = getVentureById(state, lastVisitedId);
  if (lastVisited && lastVisited.status !== "archived") {
    return (
      getLastVisitedPathForVenture(state, lastVisited.id) ??
      getVentureOverviewPath(lastVisited.id)
    );
  }

  const active = getVentureById(
    state,
    state.currentUser.activeVentureId,
  );
  if (active?.status === "archived") {
    return "/founder/projects?notice=archived";
  }

  return "/founder/projects";
}

export function getVentureSwitchPath(
  pathname: string,
  targetVentureId: VentureId,
) {
  const normalized = normalizeFounderPath(pathname);
  const canonicalMatch = normalized.match(
    /^\/founder\/projects\/[^/]+(?:\/([^/]+))?$/,
  );
  const canonicalSection = canonicalMatch?.[1];

  if (
    canonicalSection &&
    canonicalSections.has(canonicalSection)
  ) {
    return `${getVentureOverviewPath(
      targetVentureId,
    )}/${canonicalSection}`;
  }

  const legacyMatch = normalized.match(
    /^\/founder\/founder-workspace\/[^/]+(?:\/([^/]+))?$/,
  );
  const legacySection = legacyMatch?.[1];
  if (
    legacySection &&
    legacyOutputSections.has(legacySection)
  ) {
    return `/founder/founder-workspace/${targetVentureId}/${legacySection}`;
  }

  return getVentureOverviewPath(targetVentureId);
}

export function isValidDirectVenture(
  state: DemoWorkspaceState,
  ventureId: VentureId,
) {
  const venture = getVentureById(state, ventureId);
  return Boolean(venture && venture.status !== "archived");
}

