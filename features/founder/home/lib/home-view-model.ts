import {
  getActiveCycleForVenture,
  getActiveDecisionForVenture,
  getActiveVenture,
  getAllVentures,
  getCurrentUser,
  getNextActionForVenture,
  getVentureStageLabel,
  getVentureById,
  venturePhaseLabels,
} from "../../venture-foundation/demo-repository";
import { getDecisionLoopWorkflowState } from "../../../venture/decision-loop/application";
import type {
  DemoWorkspaceState,
  Venture,
  VentureActivity,
} from "../../venture-foundation/types";
import { getCompactNextActionLabel } from "../../projects/next-action-label";

export type FounderHomeState =
  | "no-venture"
  | "setup-incomplete"
  | "returning"
  | "multiple";

export type HomeQuickActionKind =
  | "context"
  | "cycle"
  | "decision";

export type HomeAttentionKind =
  | "setup"
  | "session"
  | "program";

export interface HomeContinuation {
  ventureId: string;
  ventureName: string;
  stageLabel: string;
  phaseLabel: string;
  cycleLabel?: string;
  decisionTitle: string;
  nextActionDescription: string;
  lastUpdatedAt: string;
  primaryAction: {
    label: string;
    href: string;
  };
  overviewHref: string;
}

export interface HomeSetupJourney {
  ventureId: string;
  ventureName: string;
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  steps: Array<{
    label: string;
    status: "completed" | "current" | "upcoming";
  }>;
}

export interface HomeQuickAction {
  id: string;
  kind: HomeQuickActionKind;
  title: string;
  description: string;
  href: string;
}

export interface HomeAttentionItem {
  id: string;
  kind: HomeAttentionKind;
  title: string;
  context: string;
  meta?: string;
  href: string;
}

export interface HomeRecentActivity {
  id: string;
  ventureName: string;
  message: string;
  occurredAt: string;
  href: string;
  type: VentureActivity["type"];
}

export interface HomeOtherProject {
  id: string;
  name: string;
  phaseLabel: string;
  nextAction: string;
  updatedAt: string;
  href: string;
}

export interface FounderHomeViewModel {
  state: FounderHomeState;
  userName: string;
  ventureCount: number;
  continuation?: HomeContinuation;
  setupJourney?: HomeSetupJourney;
  quickActions: HomeQuickAction[];
  attentionItems: HomeAttentionItem[];
  recentActivity: HomeRecentActivity[];
  otherActiveProjects: HomeOtherProject[];
}

function isAccessible(venture?: Venture) {
  return Boolean(venture && venture.status !== "archived");
}

function getLastActiveVenture(state: DemoWorkspaceState) {
  const lastVisited = getVentureById(
    state,
    state.currentUser.lastVisitedVentureId,
  );
  if (isAccessible(lastVisited)) return lastVisited;

  const active = getVentureById(
    state,
    state.currentUser.activeVentureId,
  );
  if (isAccessible(active)) return active;

  return getActiveVenture(state);
}

function toStatusLabel(value: string) {
  return value
    .split("-")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function getHomeContinuation(
  state: DemoWorkspaceState,
  venture: Venture,
): HomeContinuation {
  const decision = getActiveDecisionForVenture(state, venture.id);
  const cycle = getActiveCycleForVenture(state, venture.id);
  const action = getNextActionForVenture(state, venture.id);

  return {
    ventureId: venture.id,
    ventureName: venture.name,
    stageLabel: getVentureStageLabel(venture),
    phaseLabel: venturePhaseLabels[venture.currentPhase],
    cycleLabel: cycle
      ? `${cycle.title} / ${toStatusLabel(cycle.status)}`
      : undefined,
    decisionTitle:
      decision?.title ??
      venture.overallProgress?.unresolvedGap ??
      "Review the current project context.",
    nextActionDescription:
      action.description ?? action.label,
    lastUpdatedAt: venture.lastUpdatedAt,
    primaryAction: {
      label: getCompactNextActionLabel(
        action.targetPath,
        action.kind,
      ),
      href: action.targetPath,
    },
    overviewHref: `/founder/projects/${venture.id}`,
  };
}

function getHomeSetupJourney(venture: Venture): HomeSetupJourney {
  return {
    ventureId: venture.id,
    ventureName: venture.name,
    currentStep: 2,
    totalSteps: 3,
    title: "Confirm your startup context",
    description:
      "Kizuna needs enough context to identify the first decision worth validating.",
    actionLabel: "Review context",
    actionHref: `/founder/projects/${venture.id}/context`,
    steps: [
      { label: "Create project", status: "completed" },
      { label: "Confirm startup context", status: "current" },
      {
        label: "Commit the first validation cycle",
        status: "upcoming",
      },
    ],
  };
}

function addQuickAction(
  actions: HomeQuickAction[],
  action: HomeQuickAction,
) {
  if (
    actions.some(
      (existing) =>
        existing.href === action.href ||
        existing.title === action.title,
    )
  ) {
    return;
  }
  actions.push(action);
}

export function getHomeQuickActions(
  state: DemoWorkspaceState,
  venture: Venture,
  continuation: HomeContinuation,
): HomeQuickAction[] {
  if (
    venture.status === "setup" ||
    venture.currentPhase === "venture-context"
  ) {
    return [];
  }

  const actions: HomeQuickAction[] = [];
  const cycle = getActiveCycleForVenture(state, venture.id);
  const workflow = getDecisionLoopWorkflowState(state, venture.id);
  const cycleHref = `/founder/projects/${venture.id}/cycle`;
  const contextHref = `/founder/projects/${venture.id}/context`;

  if (
    cycle &&
    (cycle.status === "committed" ||
      cycle.status === "in-progress") &&
    continuation.primaryAction.href !== cycleHref
  ) {
    addQuickAction(actions, {
      id: `home-${venture.id}-cycle`,
      kind: "cycle",
      title: "Continue cycle",
      description: `Return to ${cycle.title.toLowerCase()}.`,
      href: cycleHref,
    });
  }

  if (
    [
      "review-ready",
      "review-in-progress",
      "decision-comparison",
      "decision-selected",
      "plan-draft",
      "plan-valid",
    ].includes(workflow) &&
    continuation.primaryAction.href !== cycleHref
  ) {
    const quickAction =
      workflow === "review-ready" ||
      workflow === "review-in-progress"
        ? {
            title: "Review findings",
            description:
              "Separate supported context from assumptions and unknowns.",
          }
        : workflow === "decision-comparison"
          ? {
              title: "Compare decisions",
              description:
                "Choose which uncertainty is most useful to resolve now.",
            }
          : workflow === "decision-selected"
            ? {
                title: "Explore hypotheses",
                description:
                  "Set the evidence that would change the founder decision.",
              }
            : {
                title: "Review plan",
                description:
                  "Confirm the experiment, evidence targets, and exit criteria.",
              };
    addQuickAction(actions, {
      id: `home-${venture.id}-decision`,
      kind: "decision",
      title: quickAction.title,
      description: quickAction.description,
      href: cycleHref,
    });
  }

  if (continuation.primaryAction.href !== contextHref) {
    addQuickAction(actions, {
      id: `home-${venture.id}-context`,
      kind: "context",
      title: "Review context",
      description:
        "Check the venture context behind the current decision.",
      href: contextHref,
    });
  }

  return actions.slice(0, 3);
}

type SortableAttentionItem = HomeAttentionItem & {
  priority: number;
  sortAt: string;
};

export function getHomeAttentionItems(
  state: DemoWorkspaceState,
  limit = 5,
): HomeAttentionItem[] {
  const ventures = getAllVentures(state);
  const ventureById = new Map(
    ventures.map((venture) => [venture.id, venture]),
  );
  const items: SortableAttentionItem[] = [];

  ventures
    .filter(
      (venture) =>
        venture.status === "setup" ||
        venture.currentPhase === "venture-context",
    )
    .forEach((venture) => {
      items.push({
        id: `attention-setup-${venture.id}`,
        kind: "setup",
        title: `Finish setting up ${venture.name}`,
        context: "Startup context is incomplete",
        meta: "Continue",
        href: `/founder/projects/${venture.id}/context`,
        priority: 2,
        sortAt: venture.lastUpdatedAt,
      });
    });

  state.supportRelationships
    .filter(
      (relationship) =>
        relationship.status === "active" &&
        relationship.nextSessionAt,
    )
    .forEach((relationship) => {
      const venture = ventureById.get(relationship.ventureId);
      if (!venture || !relationship.nextSessionAt) return;
      items.push({
        id: `attention-session-${relationship.id}`,
        kind: "session",
        title: `Mentor session with ${relationship.personName}`,
        context: venture.name,
        meta: relationship.nextSessionAt,
        href: `/founder/projects/${venture.id}/sessions`,
        priority: 3,
        sortAt: relationship.nextSessionAt,
      });
    });

  state.programs
    .filter(
      (program) =>
        program.status === "active" &&
        program.nextDeliverable &&
        program.nextDeadlineAt,
    )
    .forEach((program) => {
      const venture = ventureById.get(program.ventureId);
      if (
        !venture ||
        !program.nextDeliverable ||
        !program.nextDeadlineAt
      ) {
        return;
      }
      items.push({
        id: `attention-program-${program.id}`,
        kind: "program",
        title: program.nextDeliverable,
        context: `${venture.name} / ${program.name}`,
        meta: program.nextDeadlineAt,
        href: `/founder/projects/${venture.id}`,
        priority: 3,
        sortAt: program.nextDeadlineAt,
      });
    });

  return items
    .sort(
      (left, right) =>
        left.priority - right.priority ||
        left.sortAt.localeCompare(right.sortAt),
    )
    .slice(0, limit)
    .map(({ priority: _priority, sortAt: _sortAt, ...item }) => item);
}

function getActivityHref(activity: VentureActivity) {
  const base = `/founder/projects/${activity.ventureId}`;
  if (activity.type === "evidence") return `${base}/evidence`;
  if (
    activity.type === "cycle" ||
    activity.type === "decision"
  ) {
    return `${base}/cycle`;
  }
  if (activity.type === "support") return `${base}/sessions`;
  return base;
}

function isMeaningfulActivity(activity: VentureActivity) {
  return !/\b(opened|viewed|visited|logged in|signed in)\b/i.test(
    activity.message,
  );
}

export function getRecentCrossProjectActivity(
  state: DemoWorkspaceState,
  limit = 5,
): HomeRecentActivity[] {
  const ventureById = new Map(
    getAllVentures(state).map((venture) => [
      venture.id,
      venture,
    ]),
  );

  return state.activities
    .filter(
      (activity) =>
        ventureById.has(activity.ventureId) &&
        isMeaningfulActivity(activity),
    )
    .sort((left, right) =>
      right.occurredAt.localeCompare(left.occurredAt),
    )
    .slice(0, limit)
    .map((activity) => ({
      id: activity.id,
      ventureName:
        ventureById.get(activity.ventureId)?.name ?? "Project",
      message: activity.message,
      occurredAt: activity.occurredAt,
      href: getActivityHref(activity),
      type: activity.type,
    }));
}

export function getOtherActiveVentures(
  state: DemoWorkspaceState,
  continuationVentureId: string,
  limit = 3,
): HomeOtherProject[] {
  return getAllVentures(state)
    .filter(
      (venture) =>
        venture.id !== continuationVentureId &&
        venture.status === "active",
    )
    .sort((left, right) =>
      right.lastUpdatedAt.localeCompare(left.lastUpdatedAt),
    )
    .slice(0, limit)
    .map((venture) => {
      const nextAction = getNextActionForVenture(
        state,
        venture.id,
      );
      return {
        id: venture.id,
        name: venture.name,
        phaseLabel: venturePhaseLabels[venture.currentPhase],
        nextAction: nextAction.description ?? nextAction.label,
        updatedAt: venture.lastUpdatedAt,
        href: `/founder/projects/${venture.id}`,
      };
    });
}

export function getFounderHomeViewModel(
  state: DemoWorkspaceState,
): FounderHomeViewModel {
  const user = getCurrentUser(state);
  const ventures = getAllVentures(state);
  const activeVentures = ventures.filter(
    (venture) => venture.status === "active",
  );

  if (ventures.length === 0) {
    return {
      state: "no-venture",
      userName: user.name,
      ventureCount: 0,
      quickActions: [],
      attentionItems: [],
      recentActivity: [],
      otherActiveProjects: [],
    };
  }

  const venture = getLastActiveVenture(state);
  if (!venture) {
    return {
      state: "no-venture",
      userName: user.name,
      ventureCount: 0,
      quickActions: [],
      attentionItems: [],
      recentActivity: [],
      otherActiveProjects: [],
    };
  }

  const setupIncomplete =
    venture.status === "setup" ||
    venture.currentPhase === "venture-context";
  const continuation = getHomeContinuation(state, venture);

  return {
    state: setupIncomplete
      ? "setup-incomplete"
      : activeVentures.length > 1
        ? "multiple"
        : "returning",
    userName: user.name,
    ventureCount: ventures.length,
    continuation,
    setupJourney: setupIncomplete
      ? getHomeSetupJourney(venture)
      : undefined,
    quickActions: setupIncomplete
      ? []
      : getHomeQuickActions(state, venture, continuation),
    attentionItems: setupIncomplete
      ? []
      : getHomeAttentionItems(state),
    recentActivity: setupIncomplete
      ? []
      : getRecentCrossProjectActivity(state),
    otherActiveProjects: setupIncomplete
      ? []
      : getOtherActiveVentures(state, venture.id),
  };
}
