import type {
  DemoWorkspaceState,
  VentureId,
} from "../../venture-foundation/types";

export type EntryPreference =
  | "continue-last-work"
  | "hub-home";

export type EntryDestination =
  | {
      type: "new-founder-onboarding";
      href: "/founder/projects/new";
    }
  | {
      type: "resume-venture-setup";
      ventureId: VentureId;
      stepId: string;
      href: string;
    }
  | {
      type: "resume-last-workspace";
      ventureId: VentureId;
      href: string;
    }
  | {
      type: "mentor-session";
      ventureId: VentureId;
      sessionId: string;
      href: string;
    }
  | {
      type: "hub-home";
      href: string;
    }
  | {
      type: "deep-link";
      href: string;
    }
  | {
      type: "access-error";
      reason: string;
      href: string;
    };

export type PendingDeepLink =
  | {
      status: "valid";
      href: string;
    }
  | {
      status: "target-unavailable";
      ventureId: VentureId;
      href: string;
      reason: string;
    }
  | {
      status: "access-denied";
      href: string;
      reason: string;
    };

export interface PendingMentorSession {
  id: string;
  ventureId: VentureId;
  relationshipId: string;
  conversationId: string;
  startsAt: string;
}

export interface ResolveEntryInput {
  state: DemoWorkspaceState;
  pendingDeepLink?: PendingDeepLink;
  pendingMentorSession?: PendingMentorSession;
  entryPreference?: EntryPreference;
}
