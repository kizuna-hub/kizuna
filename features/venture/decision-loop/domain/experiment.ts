import type {
  ActionCycleId,
  CycleProgressStatus,
  CycleTaskId,
  DecisionId,
  ExperimentId,
  UserId,
  VentureId,
} from "../../core";
import type { VentureSourceKind } from "./source";

export interface EvidenceRequirement {
  id: string;
  ventureId: VentureId;
  experimentId: ExperimentId;
  label: string;
  description: string;
  minimumCount?: number;
  acceptedSourceKinds: VentureSourceKind[];
  requiredForExit: boolean;
  status: "required" | "planned";
}

export interface ExperimentPlan {
  id: ExperimentId;
  ventureId: VentureId;
  decisionId: DecisionId;
  title: string;
  hypothesis: string;
  method: string;
  expectedSignal: string;
  failureSignal: string;
  evidenceRequirementIds: string[];
  ownerId: UserId;
  contributorIds: UserId[];
  reviewerRelationshipId?: string;
  timeboxDays: number;
  exitCriteria: string[];
  stopConditions: string[];
  whatNotToDo: string[];
  status: "draft" | "committed" | "in-progress";
  updatedAt: string;
}

export interface CycleTask {
  id: CycleTaskId;
  ventureId: VentureId;
  experimentId: ExperimentId;
  title: string;
  ownerId: UserId;
  status: "not-started" | "in-progress" | "blocked" | "done";
  dueAt?: string;
  evidenceRequirementId?: string;
  note?: string;
}

export interface ActionCycle {
  id: ActionCycleId;
  ventureId: VentureId;
  title: string;
  status: CycleProgressStatus;
  progress: number;
  decisionId: DecisionId;
  founderRationale?: string;
  ownerId: UserId;
  experimentId?: ExperimentId;
  taskIds?: CycleTaskId[];
  evidenceRequirementIds?: string[];
  hypothesis?: string;
  expectedSignal?: string;
  failureSignal?: string;
  timeboxDays?: number;
  reviewerRelationshipId?: string;
  exitCriteria?: string[];
  stopConditions?: string[];
  whatNotToDo?: string[];
  startedAt?: string;
  dueAt?: string;
}
