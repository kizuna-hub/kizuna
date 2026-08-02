import type { VentureId } from "../../../core";
import type { VentureWorkspaceState } from "../model/venture-workspace-state";
import { getSelectedCriticalDecision } from "./decision-queries";
import { getVenture } from "../services/workspace-state-utils";

export function hasCommittedCycle(
  state: VentureWorkspaceState,
  ventureId: VentureId,
) {
  return state.actionCycles.some(
    (cycle) =>
      cycle.ventureId === ventureId &&
      (cycle.status === "committed" ||
        cycle.status === "in-progress"),
  );
}

export function getDraftExperiment(
  state: VentureWorkspaceState,
  ventureId: VentureId,
) {
  const selected = getSelectedCriticalDecision(state, ventureId);
  return state.experiments.find(
    (experiment) =>
      experiment.ventureId === ventureId &&
      experiment.status === "draft" &&
      (!selected || experiment.decisionId === selected.id),
  );
}

export function getExperimentForVenture(
  state: VentureWorkspaceState,
  ventureId: VentureId,
) {
  const activeCycle = getActiveActionCycle(state, ventureId);
  if (activeCycle?.experimentId) {
    const linked = state.experiments.find(
      (experiment) =>
        experiment.id === activeCycle.experimentId &&
        experiment.ventureId === ventureId,
    );
    if (linked) return linked;
  }
  return (
    getDraftExperiment(state, ventureId) ??
    state.experiments.find(
      (experiment) => experiment.ventureId === ventureId,
    )
  );
}

export function getEvidenceRequirementsForExperiment(
  state: VentureWorkspaceState,
  experimentId: string,
) {
  return state.evidenceRequirements.filter(
    (requirement) => requirement.experimentId === experimentId,
  );
}

export function getCycleTasksForExperiment(
  state: VentureWorkspaceState,
  experimentId: string,
) {
  return state.cycleTasks.filter(
    (task) => task.experimentId === experimentId,
  );
}

export function getActiveActionCycle(
  state: VentureWorkspaceState,
  ventureId: VentureId,
) {
  const venture = getVenture(state, ventureId);
  if (!venture?.activeCycleId) return undefined;
  return state.actionCycles.find(
    (cycle) =>
      cycle.id === venture.activeCycleId &&
      cycle.ventureId === ventureId,
  );
}

