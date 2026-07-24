import type { VentureId } from "../../../core";
import type { DecisionLoopWorkflowState } from "../contracts";
import type { DecisionLoopScenarioTemplate } from "../model/scenario-template";
import type { VentureWorkspaceState } from "../model/venture-workspace-state";
import {
  getActiveActionCycle,
  getDraftExperiment,
} from "./cycle-queries";
import { getSelectedCriticalDecision } from "./decision-queries";
import { getCurrentChallengeScan } from "./challenge-queries";
import {
  getCurrentBaseline,
} from "./source-and-baseline-queries";
import { getBaselineCompleteness } from "../services/baseline-completeness";
import { createChallengeScenario } from "../services/challenge-generator";
import { validateExperimentPlan } from "../services/cycle-validation";
import { getReviewSummary } from "./review-queries";

export function getDecisionLoopWorkflowState(
  state: VentureWorkspaceState,
  ventureId: VentureId,
): DecisionLoopWorkflowState {
  const cycle = getActiveActionCycle(state, ventureId);
  if (cycle?.status === "in-progress") return "cycle-in-progress";
  if (cycle?.status === "committed") return "cycle-committed";

  const selected = getSelectedCriticalDecision(state, ventureId);
  const draft = getDraftExperiment(state, ventureId);
  if (selected && draft) {
    return validateExperimentPlan(state, ventureId, draft).length
      ? "plan-draft"
      : "plan-valid";
  }
  if (selected) return "decision-selected";

  const scan = getCurrentChallengeScan(state, ventureId);
  if (scan) {
    return getReviewSummary(state, ventureId)
      .criticalReviewComplete
      ? "decision-comparison"
      : "review-in-progress";
  }

  const completeness = getBaselineCompleteness(state, ventureId);
  if (completeness.canRunChallengeScan) return "review-ready";
  return "context-review";
}

export function deriveCriticalPattern(
  state: VentureWorkspaceState,
  ventureId: VentureId,
  scenarioTemplate?: DecisionLoopScenarioTemplate,
) {
  const baseline = getCurrentBaseline(state, ventureId);
  return (
    scenarioTemplate?.criticalPattern ??
    (baseline
      ? createChallengeScenario(state, ventureId, baseline)
          .criticalPattern
      : "No challenge pattern is available.")
  );
}
