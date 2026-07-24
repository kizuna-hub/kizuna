import type { VentureId } from "../../core";
import type {
  EvidenceRequirement,
  ExperimentPlan,
} from "./experiment";

export function validateExperimentPlanInvariants(
  ventureId: VentureId,
  experiment: ExperimentPlan | undefined,
  requirements: EvidenceRequirement[],
) {
  const errors: string[] = [];
  if (!experiment || experiment.ventureId !== ventureId) {
    return ["Create an experiment draft before committing."];
  }
  if (!experiment.title.trim()) errors.push("Experiment title is required.");
  if (!experiment.hypothesis.trim()) {
    errors.push("A falsifiable hypothesis is required.");
  }
  if (!experiment.method.trim()) {
    errors.push("An observable experiment method is required.");
  }
  if (!experiment.ownerId.trim()) errors.push("Owner is required.");
  if (
    !Number.isInteger(experiment.timeboxDays) ||
    experiment.timeboxDays < 1 ||
    experiment.timeboxDays > 42
  ) {
    errors.push("Timebox must be between 1 and 42 days.");
  }
  if (!experiment.expectedSignal.trim()) {
    errors.push("Expected signal is required.");
  }
  if (!experiment.failureSignal.trim()) {
    errors.push("Failure signal is required.");
  }
  if (requirements.length === 0) {
    errors.push("At least one evidence requirement is required.");
  }
  if (experiment.exitCriteria.filter(Boolean).length === 0) {
    errors.push("At least one exit criterion is required.");
  }
  if (experiment.whatNotToDo.filter(Boolean).length === 0) {
    errors.push("At least one scope guard is required.");
  }
  return errors;
}
