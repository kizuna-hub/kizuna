import type { VentureId } from "../../../core";
import type {
  addCycleTask,
  updateCycleTask,
} from "../commands/cycle-task-commands";
import type {
  commitActionCycle,
  startActionCycle,
} from "../commands/cycle-commitment-commands";
import type {
  respondToChallengeItem,
  updateChallengeItemNote,
} from "../commands/challenge-response-commands";
import type {
  confirmBaseline,
  updateBaselineField,
} from "../commands/baseline-commands";
import type {
  deferDecisionCandidate,
  rejectDecisionCandidate,
  saveFounderDecisionRationale,
  selectCriticalDecision,
  updateDecisionChangeCriteria,
} from "../commands/decision-commands";
import type {
  addEvidenceRequirement,
  updateEvidenceRequirement,
} from "../commands/evidence-requirement-commands";
import type {
  createExperimentDraft,
  updateExperimentPlan,
} from "../commands/experiment-commands";
import type {
  addSource,
  excludeSource,
  updateSourceReviewStatus,
} from "../commands/source-commands";
import type { DecisionLoopOperationResult } from "../contracts";
import type { VentureWorkspaceState } from "../model/venture-workspace-state";

type OperationWithoutState<T> = T extends (
  state: VentureWorkspaceState,
  ...args: infer TArgs
) => unknown
  ? (...args: TArgs) => Promise<DecisionLoopOperationResult>
  : never;

/**
 * Business-use-case boundary used by presentation.
 *
 * Business validation failures resolve with `ok: false` and stable messages.
 * Transport or availability failures may reject and are handled by the
 * presentation integration boundary.
 */
export interface DecisionLoopRepository {
  addSource: OperationWithoutState<typeof addSource>;
  updateSourceReviewStatus: OperationWithoutState<
    typeof updateSourceReviewStatus
  >;
  excludeSource: OperationWithoutState<typeof excludeSource>;
  updateBaselineField: OperationWithoutState<
    typeof updateBaselineField
  >;
  confirmBaseline: OperationWithoutState<typeof confirmBaseline>;
  runChallengeScan: (
    ventureId: VentureId,
  ) => Promise<DecisionLoopOperationResult>;
  respondToChallengeItem: OperationWithoutState<
    typeof respondToChallengeItem
  >;
  updateChallengeItemNote: OperationWithoutState<
    typeof updateChallengeItemNote
  >;
  selectCriticalDecision: OperationWithoutState<
    typeof selectCriticalDecision
  >;
  saveFounderDecisionRationale: OperationWithoutState<
    typeof saveFounderDecisionRationale
  >;
  updateDecisionChangeCriteria: OperationWithoutState<
    typeof updateDecisionChangeCriteria
  >;
  deferDecisionCandidate: OperationWithoutState<
    typeof deferDecisionCandidate
  >;
  rejectDecisionCandidate: OperationWithoutState<
    typeof rejectDecisionCandidate
  >;
  createExperimentDraft: (
    ventureId: VentureId,
    at?: string,
  ) => Promise<DecisionLoopOperationResult>;
  updateExperimentPlan: OperationWithoutState<
    typeof updateExperimentPlan
  >;
  addEvidenceRequirement: OperationWithoutState<
    typeof addEvidenceRequirement
  >;
  updateEvidenceRequirement: OperationWithoutState<
    typeof updateEvidenceRequirement
  >;
  addCycleTask: OperationWithoutState<typeof addCycleTask>;
  updateCycleTask: OperationWithoutState<typeof updateCycleTask>;
  commitActionCycle: OperationWithoutState<typeof commitActionCycle>;
  startActionCycle: OperationWithoutState<typeof startActionCycle>;
}
