import type {
  Evidence,
  FounderUser,
  Opportunity,
  Program,
  ReadinessDelta,
  SupportRelationship,
  Venture,
  VentureActivity,
  VentureFeedback,
  VentureOutcome,
  WorkspaceUiPreferences,
} from "../../../core";
import type {
  ActionCycle,
  ChallengeItem,
  ChallengeScan,
  CycleTask,
  EvidenceRequirement,
  ExperimentPlan,
  VentureBaseline,
  VentureDecision,
  VentureSource,
} from "../../domain";

export interface VentureWorkspaceState {
  currentUser: FounderUser;
  ventures: Venture[];
  sources: VentureSource[];
  baselines: VentureBaseline[];
  challengeScans: ChallengeScan[];
  challengeItems: ChallengeItem[];
  decisions: VentureDecision[];
  experiments: ExperimentPlan[];
  evidenceRequirements: EvidenceRequirement[];
  cycleTasks: CycleTask[];
  actionCycles: ActionCycle[];
  supportRelationships: SupportRelationship[];
  programs: Program[];
  evidence: Evidence[];
  feedback: VentureFeedback[];
  outcomes: VentureOutcome[];
  readinessDeltas: ReadinessDelta[];
  opportunities: Opportunity[];
  activities: VentureActivity[];
  uiPreferences: WorkspaceUiPreferences;
}
