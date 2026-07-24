import type { UserId, VentureId } from "./identifiers";
import type {
  VenturePhase,
  VentureStage,
} from "./venture";

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
}

export interface CreateDemoVentureInput {
  id?: VentureId;
  name: string;
  oneLineDescription: string;
  stage: VentureStage;
  tags?: string[];
  currentPhase?: VenturePhase;
  initialDecisionTitle?: string;
  initialDecisionRationale?: string;
  createdAt?: string;
}
