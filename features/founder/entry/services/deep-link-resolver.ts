import {
  getVentureById,
} from "../../venture-foundation/demo-repository";
import type {
  DemoWorkspaceState,
  VentureId,
} from "../../venture-foundation/types";
import { normalizeFounderPath } from "../../venture-foundation/route-resolver";

import type { PendingDeepLink } from "../types/entry.types";

const workspaceConversationIds = new Set([
  "conversation-activation",
  "conversation-pricing",
  "conversation-pitch",
  "conversation-mentor",
  "conversation-opportunity",
]);

const workspaceSurfaceTargets = {
  document: new Set([
    "material-pitch-v3",
    "material-pitch-v5",
    "material-business-model",
    "material-customer-research",
  ]),
  analysis: new Set([
    "analysis-pitch-v5",
    "analysis-onboarding-funnel",
  ]),
  memory: new Set([
    "memory-activation-priority",
    "memory-target-student",
    "memory-target-incubator",
    "memory-founder-priority",
    "memory-pricing-evidence",
    "memory-mentor-advice",
    "memory-opportunity",
  ]),
  session: new Set(["mentor-session-growth"]),
} as const;

function unavailable(
  ventureId: VentureId,
  reason: string,
): PendingDeepLink {
  return {
    status: "target-unavailable",
    ventureId,
    reason,
    href: `/founder/projects/${ventureId}/workspace?notice=target-unavailable`,
  };
}

function accessDenied(reason: string): PendingDeepLink {
  return {
    status: "access-denied",
    reason,
    href: "/founder/home?notice=access-denied",
  };
}

function isKnownWorkspaceQuery(
  params: URLSearchParams,
  state: DemoWorkspaceState,
  ventureId: VentureId,
) {
  const conversationId = params.get("conversation");
  if (
    conversationId &&
    !workspaceConversationIds.has(conversationId)
  ) {
    return false;
  }

  const cycleId = params.get("cycle");
  if (
    cycleId &&
    !state.actionCycles.some(
      (cycle) =>
        cycle.id === cycleId && cycle.ventureId === ventureId,
    ) &&
    cycleId !== "cycle-onboarding-activation" &&
    cycleId !== "cycle-pricing"
  ) {
    return false;
  }

  const documentId = params.get("document");
  if (
    documentId &&
    !workspaceSurfaceTargets.document.has(documentId)
  ) {
    return false;
  }

  const analysisId = params.get("analysis");
  if (
    analysisId &&
    !workspaceSurfaceTargets.analysis.has(analysisId)
  ) {
    return false;
  }

  const memoryId = params.get("memory");
  if (
    memoryId &&
    !workspaceSurfaceTargets.memory.has(memoryId)
  ) {
    return false;
  }

  const sessionId = params.get("session");
  if (
    sessionId &&
    !workspaceSurfaceTargets.session.has(sessionId)
  ) {
    return false;
  }

  const evidenceId = params.get("evidence");
  if (
    evidenceId &&
    !state.evidence.some(
      (item) =>
        item.id === evidenceId && item.ventureId === ventureId,
    )
  ) {
    return false;
  }

  return true;
}

export function resolveFounderDeepLink(
  rawHref: string | undefined,
  state: DemoWorkspaceState,
): PendingDeepLink | undefined {
  if (!rawHref?.trim()) return undefined;

  let url: URL;
  try {
    url = new URL(rawHref, "https://kizuna.local");
  } catch {
    return accessDenied(
      "Liên kết không hợp lệ hoặc không còn khả dụng.",
    );
  }

  const pathname = normalizeFounderPath(url.pathname);
  const opportunityMatch = pathname.match(
    /^\/founder\/opportunities$/,
  );
  if (opportunityMatch) {
    const opportunityId = url.searchParams.get("opportunity");
    const opportunity = state.opportunities.find(
      (item) => item.id === opportunityId,
    );
    if (!opportunity) {
      return {
        status: "access-denied",
        reason:
          "Cơ hội bạn mở không còn tồn tại hoặc đã được di chuyển.",
        href: "/founder/home?notice=target-unavailable",
      };
    }
    if (
      opportunity.ventureId &&
      !getVentureById(state, opportunity.ventureId)
    ) {
      return accessDenied(
        "Bạn không còn quyền truy cập nội dung này.",
      );
    }
    return {
      status: "valid",
      href: `${pathname}${url.search}`,
    };
  }

  const match = pathname.match(
    /^\/founder\/projects\/([^/]+)(?:\/([^/]+))?$/,
  );
  if (!match) {
    return accessDenied(
      "Liên kết không thuộc không gian Founder hiện tại.",
    );
  }

  const ventureId = decodeURIComponent(match[1]);
  const section = match[2] ?? "workspace";
  const venture = getVentureById(state, ventureId);
  if (!venture || venture.status === "archived") {
    return accessDenied(
      "Bạn không còn quyền truy cập venture từ liên kết này.",
    );
  }

  const allowedSections = new Set([
    "workspace",
    "context",
    "cycle",
    "evidence",
    "sessions",
    "outputs",
    "timeline",
  ]);
  if (!allowedSections.has(section)) {
    return unavailable(
      ventureId,
      "Nội dung bạn mở không còn tồn tại hoặc đã được di chuyển.",
    );
  }

  if (
    !isKnownWorkspaceQuery(url.searchParams, state, ventureId)
  ) {
    return unavailable(
      ventureId,
      "Nội dung bạn mở không còn tồn tại hoặc đã được di chuyển.",
    );
  }

  return {
    status: "valid",
    href: `${pathname}${url.search}`,
  };
}
