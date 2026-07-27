import { createDemoWorkspaceSeed } from "../../venture-foundation/demo-seed";
import type {
  DemoWorkspaceState,
  VentureSetupStatus,
} from "../../venture-foundation/types";

import type {
  PendingDeepLink,
  PendingMentorSession,
} from "../types/entry.types";

export type AdaptiveEntryScenarioId =
  | "new-founder"
  | "single-venture"
  | "multiple-ventures"
  | "incomplete-setup"
  | "pending-mentor-session"
  | "decision-cycle-deep-link"
  | "invalid-deep-link"
  | "archived-last-venture"
  | "access-removed"
  | "deleted-conversation";

export interface AdaptiveEntryScenario {
  id: AdaptiveEntryScenarioId;
  label: string;
  state: DemoWorkspaceState;
  rawDeepLink?: string;
  pendingDeepLink?: PendingDeepLink;
  pendingMentorSession?: PendingMentorSession;
}

export const adaptiveEntryScenarioIds: AdaptiveEntryScenarioId[] =
  [
    "new-founder",
    "single-venture",
    "multiple-ventures",
    "incomplete-setup",
    "pending-mentor-session",
    "decision-cycle-deep-link",
    "invalid-deep-link",
    "archived-last-venture",
    "access-removed",
    "deleted-conversation",
  ];

function retainVentures(
  state: DemoWorkspaceState,
  ventureIds: string[],
) {
  const retained = new Set(ventureIds);
  return {
    ...state,
    ventures: state.ventures.filter((item) =>
      retained.has(item.id),
    ),
    sources: state.sources.filter((item) =>
      retained.has(item.ventureId),
    ),
    baselines: state.baselines.filter((item) =>
      retained.has(item.ventureId),
    ),
    challengeScans: state.challengeScans.filter((item) =>
      retained.has(item.ventureId),
    ),
    challengeItems: state.challengeItems.filter((item) =>
      retained.has(item.ventureId),
    ),
    decisions: state.decisions.filter((item) =>
      retained.has(item.ventureId),
    ),
    experiments: state.experiments.filter((item) =>
      retained.has(item.ventureId),
    ),
    evidenceRequirements: state.evidenceRequirements.filter(
      (item) => retained.has(item.ventureId),
    ),
    cycleTasks: state.cycleTasks.filter((item) =>
      retained.has(item.ventureId),
    ),
    actionCycles: state.actionCycles.filter((item) =>
      retained.has(item.ventureId),
    ),
    supportRelationships: state.supportRelationships.filter(
      (item) => retained.has(item.ventureId),
    ),
    programs: state.programs.filter((item) =>
      retained.has(item.ventureId),
    ),
    evidence: state.evidence.filter((item) =>
      retained.has(item.ventureId),
    ),
    feedback: state.feedback.filter((item) =>
      retained.has(item.ventureId),
    ),
    outcomes: state.outcomes.filter((item) =>
      retained.has(item.ventureId),
    ),
    readinessDeltas: state.readinessDeltas.filter((item) =>
      retained.has(item.ventureId),
    ),
    opportunities: state.opportunities.filter(
      (item) => !item.ventureId || retained.has(item.ventureId),
    ),
    activities: state.activities.filter((item) =>
      retained.has(item.ventureId),
    ),
  };
}

function oneVenture(ventureId: string) {
  const state = retainVentures(
    createDemoWorkspaceSeed(),
    [ventureId],
  );
  return {
    ...state,
    currentUser: {
      ...state.currentUser,
      activeVentureId: ventureId,
      lastVisitedVentureId: ventureId,
      lastVisitedPathByVenture: {
        [ventureId]: `/founder/projects/${ventureId}/workspace`,
      },
    },
  };
}

function emptyCollections(
  state: DemoWorkspaceState,
): DemoWorkspaceState {
  return {
    ...state,
    currentUser: {
      ...state.currentUser,
      activeVentureId: undefined,
      lastVisitedVentureId: undefined,
      lastVisitedPathByVenture: {},
    },
    ventures: [],
    sources: [],
    baselines: [],
    challengeScans: [],
    challengeItems: [],
    decisions: [],
    experiments: [],
    evidenceRequirements: [],
    cycleTasks: [],
    actionCycles: [],
    supportRelationships: [],
    programs: [],
    evidence: [],
    feedback: [],
    outcomes: [],
    readinessDeltas: [],
    opportunities: [],
    activities: [],
  };
}

export function createAdaptiveEntryScenario(
  id: AdaptiveEntryScenarioId,
): AdaptiveEntryScenario {
  if (id === "new-founder") {
    return {
      id,
      label: "Founder mới",
      state: emptyCollections(createDemoWorkspaceSeed()),
    };
  }

  if (id === "single-venture") {
    return {
      id,
      label: "Một venture đang hoạt động",
      state: oneVenture("venture-kizuna-hub"),
    };
  }

  if (id === "multiple-ventures") {
    const state = createDemoWorkspaceSeed();
    return {
      id,
      label: "Nhiều venture",
      state: {
        ...state,
        ventures: state.ventures.slice(0, 4).map((venture) => ({
          ...venture,
          status: "active" as const,
          setup: undefined,
        })),
        uiPreferences: {
          ...state.uiPreferences,
          entryPreference: "hub-home",
        },
      },
    };
  }

  if (id === "incomplete-setup") {
    const state = oneVenture("venture-snapmoney");
    const setup: VentureSetupStatus = {
      status: "in-progress",
      creationIntent: "analyze-materials",
      currentStepId: "materials",
      completedStepIds: [
        "venture-name",
        "problem",
        "target-user",
      ],
      missingRequiredFields: ["Mục tiêu ban đầu"],
      draft: {
        problem:
          "Người dùng trẻ khó hiểu luồng tiền từ các giao dịch hằng ngày.",
        targetUser: "Người đi làm 22–32 tuổi",
        initialGoal: "",
        materials: [
          {
            id: "material-snapmoney-brief",
            name: "SnapMoney-product-brief.pdf",
            size: 248000,
            type: "application/pdf",
          },
        ],
      },
      lastUpdatedAt: "2026-07-27T03:30:00.000Z",
    };
    return {
      id,
      label: "Setup dở ở bước 4/5",
      state: {
        ...state,
        ventures: state.ventures.map((venture) => ({
          ...venture,
          status: "setup" as const,
          currentPhase: "venture-context" as const,
          setup,
        })),
      },
    };
  }

  if (id === "pending-mentor-session") {
    const state = oneVenture("venture-kizuna-hub");
    return {
      id,
      label: "Phiên mentor sau 30 phút",
      state: {
        ...state,
        supportRelationships: state.supportRelationships.map(
          (relationship) =>
            relationship.id === "support-kizuna-mai"
              ? {
                  ...relationship,
                  nextSessionAt: "2026-07-27T04:00:00.000Z",
                }
              : relationship,
        ),
      },
      pendingMentorSession: {
        id: "mentor-session-growth",
        ventureId: "venture-kizuna-hub",
        relationshipId: "support-kizuna-mai",
        conversationId: "conversation-mentor",
        startsAt: "2026-07-27T04:00:00.000Z",
      },
    };
  }

  if (id === "decision-cycle-deep-link") {
    return {
      id,
      label: "Deep link Decision Cycle",
      state: createDemoWorkspaceSeed(),
      rawDeepLink:
        "/founder/projects/venture-kizuna-hub/workspace?view=decision-cycle&cycle=cycle-onboarding-activation",
    };
  }

  if (id === "invalid-deep-link") {
    return {
      id,
      label: "Deep link không tồn tại",
      state: createDemoWorkspaceSeed(),
      rawDeepLink:
        "/founder/projects/venture-kizuna-hub/workspace?conversation=conversation-deleted",
    };
  }

  if (id === "archived-last-venture") {
    const state = createDemoWorkspaceSeed();
    return {
      id,
      label: "Venture gần nhất đã lưu trữ",
      state: {
        ...state,
        ventures: state.ventures.map((venture) =>
          venture.id === "venture-kizuna-hub"
            ? { ...venture, status: "archived" as const }
            : venture,
        ),
      },
    };
  }

  if (id === "access-removed") {
    return {
      id,
      label: "Quyền truy cập đã bị gỡ",
      state: createDemoWorkspaceSeed(),
      rawDeepLink:
        "/founder/projects/venture-private-demo/workspace?conversation=conversation-private",
    };
  }

  const state = oneVenture("venture-kizuna-hub");
  return {
    id,
    label: "Cuộc trò chuyện gần nhất đã bị xóa",
    state: {
      ...state,
      currentUser: {
        ...state.currentUser,
        lastVisitedPathByVenture: {
          "venture-kizuna-hub":
            "/founder/projects/venture-kizuna-hub/workspace?conversation=conversation-deleted&notice=conversation-unavailable",
        },
      },
    },
  };
}
