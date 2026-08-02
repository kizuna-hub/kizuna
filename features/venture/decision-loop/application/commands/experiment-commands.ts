import type { VentureId } from "../../../core";
import type {
  CycleTask,
  EvidenceRequirement,
  ExperimentPlan,
} from "../../domain";
import type {
  DecisionLoopCommandResult,
  ExperimentPlanPatch,
} from "../contracts";
import type { VentureWorkspaceState } from "../model/venture-workspace-state";
import type { DecisionLoopScenarioTemplate } from "../model/scenario-template";
import {
  getDraftExperiment,
  hasCommittedCycle,
} from "../queries/cycle-queries";
import { getSelectedCriticalDecision } from "../queries/decision-queries";
import { getCurrentBaseline } from "../queries/source-and-baseline-queries";
import { createChallengeScenario } from "../services/challenge-generator";
import {
  isAccessibleVenture,
  markVentureUpdated,
  timestamp,
} from "../services/workspace-state-utils";

export function createExperimentDraft(
  state: VentureWorkspaceState,
  ventureId: VentureId,
  at?: string,
  scenarioTemplate?: DecisionLoopScenarioTemplate,
): DecisionLoopCommandResult {
  const decision = getSelectedCriticalDecision(state, ventureId);
  if (!decision || !isAccessibleVenture(state, ventureId)) {
    return {
      state,
      ok: false,
      errors: [
        "Select one critical decision before creating an experiment.",
      ],
    };
  }
  if (hasCommittedCycle(state, ventureId)) {
    return {
      state,
      ok: false,
      errors: [
        "An active committed cycle already exists for this project.",
      ],
    };
  }
  const existing = getDraftExperiment(state, ventureId);
  if (existing?.decisionId === decision.id) {
    return { state, ok: true, errors: [] };
  }

  const baseline = getCurrentBaseline(state, ventureId);
  const scenario =
    scenarioTemplate ??
    (baseline
      ? createChallengeScenario(state, ventureId, baseline)
      : undefined);
  if (!scenario) {
    return {
      state,
      ok: false,
      errors: ["No experiment template can be derived."],
    };
  }
  const selectedTemplate =
    scenario.experiment.decisionId === decision.id
      ? scenario.experiment
      : {
          ...scenario.experiment,
          decisionId: decision.id,
          title: `${decision.title} test`,
          hypothesis:
            decision.alternativeHypotheses?.[0]?.summary ??
            "The selected decision can be resolved with a focused observable test.",
        };
  const updatedAt = timestamp(at);
  const experimentId = `experiment-${ventureId.replace(
    /^venture-/,
    "",
  )}-${decision.id.replace(/^decision-/, "")}`;
  const requirements: EvidenceRequirement[] =
    selectedTemplate.evidenceRequirements.map((requirement) => ({
      ...requirement,
      id:
        scenario.experiment.decisionId === decision.id
          ? requirement.id
          : `${requirement.id}-${decision.id.replace(
              /^decision-/,
              "",
            )}`,
      ventureId,
      experimentId,
      status: "required",
    }));
  const requirementIdMap = new Map(
    selectedTemplate.evidenceRequirements.map(
      (requirement, index) => [
        requirement.id,
        requirements[index]?.id,
      ],
    ),
  );
  const tasks: CycleTask[] = selectedTemplate.tasks.map((task) => ({
    ...task,
    id:
      scenario.experiment.decisionId === decision.id
        ? task.id
        : `${task.id}-${decision.id.replace(/^decision-/, "")}`,
    ventureId,
    experimentId,
    ownerId: state.currentUser.id,
    status: "not-started",
    evidenceRequirementId: task.evidenceRequirementId
      ? requirementIdMap.get(task.evidenceRequirementId)
      : undefined,
  }));
  const experiment: ExperimentPlan = {
    id: experimentId,
    ventureId,
    decisionId: decision.id,
    title: selectedTemplate.title,
    hypothesis: selectedTemplate.hypothesis,
    method: selectedTemplate.method,
    expectedSignal: selectedTemplate.expectedSignal,
    failureSignal: selectedTemplate.failureSignal,
    evidenceRequirementIds: requirements.map(
      (requirement) => requirement.id,
    ),
    ownerId: state.currentUser.id,
    contributorIds: [],
    reviewerRelationshipId: state.supportRelationships.find(
      (relationship) =>
        relationship.ventureId === ventureId &&
        relationship.status === "active",
    )?.id,
    timeboxDays: selectedTemplate.timeboxDays,
    exitCriteria: selectedTemplate.exitCriteria,
    stopConditions: selectedTemplate.stopConditions,
    whatNotToDo: selectedTemplate.whatNotToDo,
    status: "draft",
    updatedAt,
  };
  const cycleId = `cycle-${ventureId.replace(/^venture-/, "")}-${
    decision.id.replace(/^decision-/, "")
  }`;
  const existingDraftCycle = state.actionCycles.find(
    (cycle) =>
      cycle.ventureId === ventureId && cycle.status === "draft",
  );
  const draftCycle = {
    id: existingDraftCycle?.id ?? cycleId,
    ventureId,
    title: experiment.title,
    status: "draft" as const,
    progress: 0,
    decisionId: decision.id,
    ownerId: experiment.ownerId,
    experimentId,
    taskIds: tasks.map((task) => task.id),
    evidenceRequirementIds: requirements.map(
      (requirement) => requirement.id,
    ),
    hypothesis: experiment.hypothesis,
    expectedSignal: experiment.expectedSignal,
    failureSignal: experiment.failureSignal,
    timeboxDays: experiment.timeboxDays,
    reviewerRelationshipId: experiment.reviewerRelationshipId,
    exitCriteria: experiment.exitCriteria,
    stopConditions: experiment.stopConditions,
    whatNotToDo: experiment.whatNotToDo,
  };
  const oldExperimentIds = new Set(
    state.experiments
      .filter(
        (candidate) =>
          candidate.ventureId === ventureId &&
          candidate.status === "draft",
      )
      .map((candidate) => candidate.id),
  );

  return {
    state: markVentureUpdated(
      {
        ...state,
        experiments: [
          ...state.experiments.filter(
            (candidate) =>
              !(
                candidate.ventureId === ventureId &&
                candidate.status === "draft"
              ),
          ),
          experiment,
        ],
        evidenceRequirements: [
          ...state.evidenceRequirements.filter(
            (requirement) =>
              !oldExperimentIds.has(requirement.experimentId),
          ),
          ...requirements,
        ],
        cycleTasks: [
          ...state.cycleTasks.filter(
            (task) => !oldExperimentIds.has(task.experimentId),
          ),
          ...tasks,
        ],
        actionCycles: [
          ...state.actionCycles.filter(
            (cycle) =>
              !(
                cycle.ventureId === ventureId &&
                cycle.status === "draft"
              ),
          ),
          draftCycle,
        ],
        ventures: state.ventures.map((venture) =>
          venture.id === ventureId
            ? {
                ...venture,
                activeCycleId: draftCycle.id,
                lastUpdatedAt: updatedAt,
              }
            : venture,
        ),
      },
      ventureId,
      updatedAt,
    ),
    ok: true,
    errors: [],
  };
}

export function updateExperimentPlan(
  state: VentureWorkspaceState,
  ventureId: VentureId,
  experimentId: string,
  patch: ExperimentPlanPatch,
  at?: string,
): DecisionLoopCommandResult {
  const experiment = state.experiments.find(
    (candidate) => candidate.id === experimentId,
  );
  if (
    !experiment ||
    experiment.ventureId !== ventureId ||
    experiment.status !== "draft"
  ) {
    return {
      state,
      ok: false,
      errors: ["Editable experiment draft was not found."],
    };
  }
  if (
    patch.reviewerRelationshipId &&
    !state.supportRelationships.some(
      (relationship) =>
        relationship.id === patch.reviewerRelationshipId &&
        relationship.ventureId === ventureId,
    )
  ) {
    return {
      state,
      ok: false,
      errors: ["Reviewer does not belong to this project."],
    };
  }

  const updatedAt = timestamp(at);
  const updatedExperiment: ExperimentPlan = {
    ...experiment,
    ...patch,
    title: patch.title?.trim() ?? experiment.title,
    hypothesis:
      patch.hypothesis?.trim() ?? experiment.hypothesis,
    method: patch.method?.trim() ?? experiment.method,
    expectedSignal:
      patch.expectedSignal?.trim() ??
      experiment.expectedSignal,
    failureSignal:
      patch.failureSignal?.trim() ??
      experiment.failureSignal,
    exitCriteria:
      patch.exitCriteria?.map((item) => item.trim()).filter(Boolean) ??
      experiment.exitCriteria,
    stopConditions:
      patch.stopConditions
        ?.map((item) => item.trim())
        .filter(Boolean) ?? experiment.stopConditions,
    whatNotToDo:
      patch.whatNotToDo
        ?.map((item) => item.trim())
        .filter(Boolean) ?? experiment.whatNotToDo,
    updatedAt,
  };

  return {
    state: markVentureUpdated(
      {
        ...state,
        experiments: state.experiments.map((candidate) =>
          candidate.id === experiment.id
            ? updatedExperiment
            : candidate,
        ),
        actionCycles: state.actionCycles.map((cycle) =>
          cycle.experimentId === experiment.id &&
          cycle.status === "draft"
            ? {
                ...cycle,
                title: updatedExperiment.title,
                ownerId: updatedExperiment.ownerId,
                hypothesis: updatedExperiment.hypothesis,
                expectedSignal: updatedExperiment.expectedSignal,
                failureSignal: updatedExperiment.failureSignal,
                timeboxDays: updatedExperiment.timeboxDays,
                reviewerRelationshipId:
                  updatedExperiment.reviewerRelationshipId,
                exitCriteria: updatedExperiment.exitCriteria,
                stopConditions: updatedExperiment.stopConditions,
                whatNotToDo: updatedExperiment.whatNotToDo,
              }
            : cycle,
        ),
      },
      ventureId,
      updatedAt,
    ),
    ok: true,
    errors: [],
  };
}
