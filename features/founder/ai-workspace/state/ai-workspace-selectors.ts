import type {
  AiWorkspaceState,
  DecisionCycleStepId,
} from "../types/ai-workspace.types";

const orderedSteps: DecisionCycleStepId[] = [
  "understand",
  "decide",
  "act",
  "evidence",
  "review",
];

export function getDecisionCycleProgress(state: AiWorkspaceState) {
  const completed = state.decisionCycle.completedSteps.length;
  return Math.round((completed / orderedSteps.length) * 100);
}

export function canOpenCycleStep(
  state: AiWorkspaceState,
  step: DecisionCycleStepId,
) {
  const stepIndex = orderedSteps.indexOf(step);
  const currentIndex = orderedSteps.indexOf(
    state.decisionCycle.currentStep,
  );
  return (
    stepIndex <= currentIndex ||
    state.decisionCycle.completedSteps.includes(step)
  );
}

export function shouldRecommendMentor(state: AiWorkspaceState) {
  return (
    state.decisionCycleLifecycle === "active" ||
    state.decisionCycle.evidenceSubmitted &&
    state.decisionCycle.reviewCompleted
  );
}
