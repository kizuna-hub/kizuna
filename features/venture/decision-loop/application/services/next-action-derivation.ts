import type { NextAction, VentureId } from "../../../core";
import type { VentureWorkspaceState } from "../model/venture-workspace-state";
import { getDraftExperiment } from "../queries/cycle-queries";
import { getDecisionLoopWorkflowState } from "../queries/workflow-queries";
import { getReviewSummary } from "../queries/review-queries";
import { isAccessibleVenture } from "./workspace-state-utils";

export function getDecisionLoopNextAction(
  state: VentureWorkspaceState,
  ventureId: VentureId,
): NextAction | undefined {
  if (!isAccessibleVenture(state, ventureId)) return undefined;
  const workflow = getDecisionLoopWorkflowState(state, ventureId);
  const cyclePath = `/founder/projects/${ventureId}/cycle`;
  const contextPath = `/founder/projects/${ventureId}/context`;

  if (workflow === "context-review") {
    return {
      id: `next-${ventureId}-context`,
      label: "Review and confirm venture context",
      description:
        "Confirm a minimum source-backed baseline before reviewing claims and assumptions.",
      targetPath: contextPath,
      kind: "review-context",
    };
  }
  if (workflow === "review-ready") {
    return {
      id: `next-${ventureId}-scan`,
      label: "Review claims and assumptions",
      description:
        "Separate what the current context supports from what still needs evidence.",
      targetPath: cyclePath,
      kind: "run-challenge-scan",
    };
  }
  if (workflow === "review-in-progress") {
    const summary = getReviewSummary(state, ventureId);
    const remaining =
      summary.criticalCount - summary.reviewedCriticalCount;
    return {
      id: `next-${ventureId}-review-scan`,
      label:
        remaining === 1
          ? "Review one critical finding"
          : `Review ${remaining} critical findings`,
      description:
        "Resolve the findings that block a useful decision comparison.",
      targetPath: cyclePath,
      kind: "review-challenge-scan",
    };
  }
  if (workflow === "decision-comparison") {
    return {
      id: `next-${ventureId}-decision`,
      label: "Compare decision candidates",
      description:
        "Compare the candidates and explicitly choose what this cycle must unlock.",
      targetPath: cyclePath,
      kind: "select-critical-decision",
    };
  }
  if (
    workflow === "decision-selected" ||
    workflow === "plan-draft" ||
    workflow === "plan-valid"
  ) {
    const draft = getDraftExperiment(state, ventureId);
    return {
      id: `next-${ventureId}-commit`,
      label: draft
        ? workflow === "plan-valid"
          ? "Commit the focused action cycle"
          : "Complete the focused action plan"
        : "Explore the selected decision",
      description:
        "Lock one hypothesis, owner, timebox, evidence target, and exit criterion.",
      targetPath: cyclePath,
      kind: draft ? "commit-cycle" : "plan-cycle",
    };
  }
  if (workflow === "cycle-committed") {
    return {
      id: `next-${ventureId}-start`,
      label: "Start the committed action cycle",
      description:
        "Begin the focused tasks without changing evidence readiness.",
      targetPath: cyclePath,
      kind: "start-cycle",
    };
  }
  return {
    id: `next-${ventureId}-continue-cycle`,
    label: "Continue the active action cycle",
    description:
      "Work through the committed tasks and required evidence targets.",
    targetPath: cyclePath,
    kind: "open-cycle",
  };
}
