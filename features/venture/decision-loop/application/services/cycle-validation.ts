import type { VentureId } from "../../../core";
import {
  type ExperimentPlan,
  validateExperimentPlanInvariants,
} from "../../domain";
import type { VentureWorkspaceState } from "../model/venture-workspace-state";
import { getEvidenceRequirementsForExperiment } from "../queries/cycle-queries";
import { getSelectedCriticalDecision } from "../queries/decision-queries";

export function validateExperimentPlan(
  state: VentureWorkspaceState,
  ventureId: VentureId,
  experiment: ExperimentPlan | undefined,
) {
  const requirements = experiment
    ? getEvidenceRequirementsForExperiment(state, experiment.id).filter(
        (requirement) =>
          experiment.evidenceRequirementIds.includes(requirement.id),
      )
    : [];
  const errors = validateExperimentPlanInvariants(
    ventureId,
    experiment,
    requirements,
  );
  const decision = getSelectedCriticalDecision(state, ventureId);
  if (!decision?.founderRationale?.trim()) {
    errors.unshift(
      "Explain why this decision is the most useful one to resolve now.",
    );
  }
  return errors;
}
