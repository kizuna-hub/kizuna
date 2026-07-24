import type { VentureId } from "../../../core";
import type {
  DecisionChangeCriterion,
  VentureDecision,
} from "../../domain";
import type { VentureWorkspaceState } from "../model/venture-workspace-state";
import {
  getActiveActionCycle,
  getCycleTasksForExperiment,
  getEvidenceRequirementsForExperiment,
} from "./cycle-queries";
import {
  getDecisionCandidates,
  getSelectedCriticalDecision,
} from "./decision-queries";
import { getReviewSummary } from "./review-queries";
import {
  getCurrentBaseline,
  getSourcesForVenture,
} from "./source-and-baseline-queries";

export function getContextProvenance(
  state: VentureWorkspaceState,
  ventureId: VentureId,
) {
  const sources = getSourcesForVenture(state, ventureId);
  const baseline = getCurrentBaseline(state, ventureId);
  const sourceWithDocumentMetadata = sources.find(
    (source) => source.provenance?.pageCount,
  );

  return {
    sourceCount: sources.length,
    reviewedSourceCount: sources.filter(
      (source) => source.reviewStatus === "confirmed",
    ).length,
    aiAssistedSourceCount: sources.filter(
      (source) =>
        source.aiContribution === "assisted" ||
        source.aiContribution === "generated",
    ).length,
    customerEvidenceSourceCount: sources.filter(
      (source) => source.origin === "customer-evidence",
    ).length,
    pilotEvidenceSourceCount: sources.filter(
      (source) =>
        source.origin === "customer-evidence" &&
        source.tags.includes("pilot"),
    ).length,
    personalDataDetected: sources.some(
      (source) => source.provenance?.personalDataDetected,
    ),
    pageCount: sourceWithDocumentMetadata?.provenance?.pageCount,
    artifactType:
      sourceWithDocumentMetadata?.provenance?.artifactType,
    baselineUpdatedAt: baseline?.updatedAt,
  };
}

function comparisonLabel(
  decision: VentureDecision,
  index: number,
) {
  if (decision.isRecommended) return "Recommended now" as const;
  if (index === 1) return "Useful next" as const;
  return "Can wait" as const;
}

export function getDecisionComparisonModel(
  state: VentureWorkspaceState,
  ventureId: VentureId,
) {
  const selected = getSelectedCriticalDecision(state, ventureId);
  const activeCycle = getActiveActionCycle(state, ventureId);
  const readOnly =
    activeCycle?.status === "committed" ||
    activeCycle?.status === "in-progress";

  return getDecisionCandidates(state, ventureId).map(
    (decision, index) => ({
      decision,
      label: comparisonLabel(decision, index),
      selected: selected?.id === decision.id,
      requiresOverrideRationale: !decision.isRecommended,
      readOnly,
    }),
  );
}

export function getFounderDecisionRationale(
  state: VentureWorkspaceState,
  ventureId: VentureId,
) {
  return getSelectedCriticalDecision(state, ventureId)
    ?.founderRationale;
}

export function getChangeMyMindCriteria(
  decision: VentureDecision,
): DecisionChangeCriterion[] {
  return (
    decision.changeMyMindCriteria ??
    (decision.decisionChangingEvidence ?? []).map(
      (text, index) => ({
        id: `${decision.id}-criterion-${index + 1}`,
        text,
        selected: true,
        founderCreated: false,
      }),
    )
  );
}

export function getActiveCycleSummary(
  state: VentureWorkspaceState,
  ventureId: VentureId,
) {
  const cycle = getActiveActionCycle(state, ventureId);
  if (
    !cycle ||
    (cycle.status !== "committed" &&
      cycle.status !== "in-progress")
  ) {
    return undefined;
  }
  const decision = state.decisions.find(
    (candidate) => candidate.id === cycle.decisionId,
  );
  const experiment = cycle.experimentId
    ? state.experiments.find(
        (candidate) => candidate.id === cycle.experimentId,
      )
    : undefined;
  const tasks = experiment
    ? getCycleTasksForExperiment(state, experiment.id)
    : [];
  const requirements = experiment
    ? getEvidenceRequirementsForExperiment(
        state,
        experiment.id,
      )
    : [];
  const nextTask =
    tasks.find((task) => task.status === "in-progress") ??
    tasks.find((task) => task.status === "not-started") ??
    tasks.find((task) => task.status === "blocked");

  return {
    cycle,
    decision,
    experiment,
    founderRationale:
      cycle.founderRationale ?? decision?.founderRationale,
    tasks,
    completedTaskCount: tasks.filter(
      (task) => task.status === "done",
    ).length,
    requirements,
    nextTask,
  };
}
