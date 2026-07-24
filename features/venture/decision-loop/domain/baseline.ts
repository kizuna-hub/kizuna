import type {
  ConfidenceLevel,
  SourceId,
  VentureId,
} from "../../core";

export type BaselineFieldStatus =
  | "confirmed"
  | "needs-review"
  | "missing"
  | "conflicting"
  | "possibly-stale";

export type BaselineFieldKey =
  | "problem"
  | "customer"
  | "buyer"
  | "solution"
  | "stage"
  | "businessModel"
  | "evidenceSummary"
  | "currentGoal"
  | "supportSummary"
  | "programSummary"
  | "openAssumptions";

export interface BaselineField {
  value: string;
  sourceIds: SourceId[];
  confidence: ConfidenceLevel;
  status: BaselineFieldStatus;
  lastConfirmedAt?: string;
  founderConfirmed: boolean;
}

export interface VentureBaseline {
  id: string;
  ventureId: VentureId;
  version: string;
  problem: BaselineField;
  customer: BaselineField;
  buyer: BaselineField;
  solution: BaselineField;
  stage: BaselineField;
  businessModel: BaselineField;
  evidenceSummary: BaselineField;
  currentGoal: BaselineField;
  supportSummary: BaselineField;
  programSummary: BaselineField;
  openAssumptions: BaselineField;
  confirmedAt?: string;
  updatedAt: string;
  acknowledgedIncomplete: boolean;
  status: "draft" | "reviewed" | "confirmed" | "needs-update";
}
