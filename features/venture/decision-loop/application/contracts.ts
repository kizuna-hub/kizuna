import type { VentureWorkspaceState } from "./model/venture-workspace-state";
import type {
  BaselineFieldKey,
  ExperimentPlan,
  VentureSource,
  VentureSourceKind,
} from "../domain";

export type BaselineCompleteness = {
  completedCount: number;
  totalCount: number;
  percentage: number;
  missingRequired: BaselineFieldKey[];
  missingOptional: BaselineFieldKey[];
  reviewedSourceCount: number;
  allReviewedSourcesAreAiGenerated: boolean;
  hasMinimumContext: boolean;
  canConfirm: boolean;
  canRunChallengeScan: boolean;
};

export type DecisionLoopCommandResult = {
  state: VentureWorkspaceState;
  ok: boolean;
  errors: string[];
};

export type DecisionLoopOperationResult = Pick<
  DecisionLoopCommandResult,
  "ok" | "errors"
>;

export type AddSourceInput = {
  title: string;
  kind: VentureSourceKind;
  origin: VentureSource["origin"];
  authorName?: string;
  summary?: string;
  content?: string;
  externalUrl?: string;
  freshness?: VentureSource["freshness"];
  visibility?: VentureSource["visibility"];
  aiContribution?: VentureSource["aiContribution"];
  tags?: string[];
  createdAt?: string;
  importedAt?: string;
};

export type ExperimentPlanPatch = Partial<
  Pick<
    ExperimentPlan,
    | "title"
    | "hypothesis"
    | "method"
    | "expectedSignal"
    | "failureSignal"
    | "ownerId"
    | "contributorIds"
    | "reviewerRelationshipId"
    | "timeboxDays"
    | "exitCriteria"
    | "stopConditions"
    | "whatNotToDo"
  >
>;

export type DecisionLoopWorkflowState =
  | "context-review"
  | "review-ready"
  | "review-in-progress"
  | "decision-comparison"
  | "decision-selected"
  | "plan-draft"
  | "plan-valid"
  | "cycle-committed"
  | "cycle-in-progress";
