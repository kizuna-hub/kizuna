import type {
  ActionCycleId,
  DecisionId,
  VentureId,
} from "./identifiers";

export type ConfidenceLevel =
  | "low"
  | "developing"
  | "moderate"
  | "strong";

export type VentureStage =
  | "idea"
  | "concept"
  | "prototype"
  | "mvp"
  | "functional-demo"
  | "pilot"
  | "early-users"
  | "launched";

export type VentureStatus = "setup" | "active" | "paused" | "archived";

export type VenturePhase =
  | "venture-context"
  | "buyer-validation"
  | "decision-framing"
  | "feasibility-review"
  | "evidence-review"
  | "action-cycle";

export type CycleProgressStatus =
  | "draft"
  | "committed"
  | "in-progress"
  | "evidence-pending"
  | "under-review"
  | "completed"
  | "repeat"
  | "pivot"
  | "paused";

export interface ProgressSummary {
  confidence: ConfidenceLevel;
  recentChange: string;
  unresolvedGap: string;
  cycleStatus?: CycleProgressStatus;
}

export interface SupportCoverageSummary {
  status: "covered" | "partial" | "uncovered";
  activeRelationshipCount: number;
  summary: string;
  gap?: string;
}

export interface Venture {
  id: VentureId;
  name: string;
  slug: string;
  shortName?: string;
  teamName?: string;
  oneLineDescription: string;
  stage: VentureStage;
  displayStage?: string;
  status: VentureStatus;
  tags: string[];
  currentPhase: VenturePhase;
  activeDecisionId?: DecisionId;
  activeCycleId?: ActionCycleId;
  overallProgress?: ProgressSummary;
  supportSummary: SupportCoverageSummary;
  lastUpdatedAt: string;
  createdAt: string;
}

export interface NextAction {
  id: string;
  label: string;
  description?: string;
  targetPath: string;
  kind:
    | "continue-setup"
    | "review-context"
    | "open-cycle"
    | "complete-profile"
    | "prepare-session"
    | "add-evidence"
    | "review-feedback"
    | "open-workspace"
    | "run-challenge-scan"
    | "review-challenge-scan"
    | "select-critical-decision"
    | "plan-cycle"
    | "commit-cycle"
    | "start-cycle";
}
