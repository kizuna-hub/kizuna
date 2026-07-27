import type { UserId, VentureId } from "./identifiers";
import type {
  VentureCreationIntent,
  VenturePhase,
  VentureStage,
  VentureStatus,
  VentureSetupStepId,
} from "./venture";

export type ProjectsSort = "last-edited" | "name";
export type ProjectsViewMode = "grid" | "list";

export interface FounderUser {
  id: UserId;
  name: string;
  avatarUrl?: string;
  activeVentureId?: VentureId;
  lastVisitedVentureId?: VentureId;
  lastVisitedPathByVenture?: Partial<Record<VentureId, string>>;
}

export interface WorkspaceUiPreferences {
  storageVersion: number;
  projectsQuery: string;
  projectsStageFilter: VentureStage | "all";
  projectsStatusFilter?: VentureStatus | "all";
  projectsSort?: ProjectsSort;
  projectsView?: ProjectsViewMode;
  founderSidebarCollapsed?: boolean;
  entryPreference?: "continue-last-work" | "hub-home";
  ventureCreationRequestMap?: Record<string, VentureId>;
  dismissedMentorSessionIds?: string[];
  mentorPreparationBySession?: Record<string, string[]>;
}

export interface CreateDemoVentureInput {
  id?: VentureId;
  requestId?: string;
  creationIntent?: VentureCreationIntent;
  name: string;
  oneLineDescription: string;
  stage: VentureStage;
  tags?: string[];
  currentPhase?: VenturePhase;
  initialDecisionTitle?: string;
  initialDecisionRationale?: string;
  initialSetupStepId?: VentureSetupStepId;
  createdAt?: string;
}
