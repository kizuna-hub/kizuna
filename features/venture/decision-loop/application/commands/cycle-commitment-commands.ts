import type { VentureId } from "../../../core";
import type { DecisionLoopCommandResult } from "../contracts";
import type { VentureWorkspaceState } from "../model/venture-workspace-state";
import {
  getActiveActionCycle,
  getCycleTasksForExperiment,
  getDraftExperiment,
  getEvidenceRequirementsForExperiment,
  hasCommittedCycle,
} from "../queries/cycle-queries";
import { getSelectedCriticalDecision } from "../queries/decision-queries";
import { validateExperimentPlan } from "../services/cycle-validation";
import {
  isAccessibleVenture,
  timestamp,
  uniqueId,
} from "../services/workspace-state-utils";

export function commitActionCycle(
  state: VentureWorkspaceState,
  ventureId: VentureId,
  at?: string,
): DecisionLoopCommandResult {
  if (!isAccessibleVenture(state, ventureId)) {
    return {
      state,
      ok: false,
      errors: ["Project is missing or archived."],
    };
  }
  const decision = getSelectedCriticalDecision(state, ventureId);
  const experiment = getDraftExperiment(state, ventureId);
  const errors = validateExperimentPlan(
    state,
    ventureId,
    experiment,
  );
  if (!decision) {
    errors.unshift("Select one critical decision before committing.");
  }
  if (hasCommittedCycle(state, ventureId)) {
    errors.unshift(
      "A committed or in-progress cycle already exists.",
    );
  }
  if (errors.length > 0 || !decision || !experiment) {
    return { state, ok: false, errors };
  }

  const committedAt = timestamp(at);
  const dueAt = new Date(
    new Date(committedAt).getTime() +
      experiment.timeboxDays * 24 * 60 * 60 * 1000,
  ).toISOString();
  const requirements = getEvidenceRequirementsForExperiment(
    state,
    experiment.id,
  );
  const tasks = getCycleTasksForExperiment(
    state,
    experiment.id,
  );
  const draftCycle = state.actionCycles.find(
    (cycle) =>
      cycle.ventureId === ventureId &&
      cycle.status === "draft" &&
      cycle.experimentId === experiment.id,
  );
  const cycle = {
    id:
      draftCycle?.id ??
      `cycle-${ventureId.replace(/^venture-/, "")}-${decision.id.replace(
        /^decision-/,
        "",
      )}`,
    ventureId,
    title: experiment.title,
    status: "committed" as const,
    progress: 0,
    decisionId: decision.id,
    founderRationale: decision.founderRationale,
    ownerId: experiment.ownerId,
    experimentId: experiment.id,
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
    dueAt,
  };
  const unchangedReadinessDeltas = state.readinessDeltas;

  return {
    state: {
      ...state,
      experiments: state.experiments.map((candidate) =>
        candidate.id === experiment.id
          ? { ...candidate, status: "committed" as const }
          : candidate,
      ),
      decisions: state.decisions.map((candidate) =>
        candidate.id === decision.id
          ? {
              ...candidate,
              status: "committed" as const,
              nextAction: {
                id: `next-${decision.id}-start`,
                label: "Start the committed action cycle",
                description:
                  "Begin the focused tasks and collect the required signals.",
                targetPath: `/founder/projects/${ventureId}/cycle`,
                kind: "start-cycle" as const,
              },
              updatedAt: committedAt,
            }
          : candidate,
      ),
      actionCycles: [
        ...state.actionCycles.filter(
          (candidate) => candidate.id !== cycle.id,
        ),
        cycle,
      ],
      ventures: state.ventures.map((venture) =>
        venture.id === ventureId
          ? {
              ...venture,
              status: "active" as const,
              currentPhase: "action-cycle" as const,
              activeDecisionId: decision.id,
              activeCycleId: cycle.id,
              overallProgress: {
                ...venture.overallProgress,
                confidence:
                  venture.overallProgress?.confidence ?? "low",
                recentChange:
                  "A focused action cycle was committed; no readiness evidence has been added.",
                unresolvedGap: decision.title,
                cycleStatus: "committed" as const,
              },
              lastUpdatedAt: committedAt,
            }
          : venture,
      ),
      activities: [
        {
          id: uniqueId(
            state.activities.map((activity) => activity.id),
            `activity-${ventureId.replace(
              /^venture-/,
              "",
            )}-cycle-committed`,
          ),
          ventureId,
          type: "cycle" as const,
          message: `Committed action cycle: ${experiment.title}.`,
          occurredAt: committedAt,
        },
        ...state.activities,
      ],
      readinessDeltas: unchangedReadinessDeltas,
    },
    ok: true,
    errors: [],
  };
}

export function startActionCycle(
  state: VentureWorkspaceState,
  ventureId: VentureId,
  at?: string,
): DecisionLoopCommandResult {
  const cycle = getActiveActionCycle(state, ventureId);
  if (!cycle || cycle.status !== "committed") {
    return {
      state,
      ok: false,
      errors: ["A committed cycle is required before starting."],
    };
  }
  const startedAt = timestamp(at);
  return {
    state: {
      ...state,
      actionCycles: state.actionCycles.map((candidate) =>
        candidate.id === cycle.id
          ? {
              ...candidate,
              status: "in-progress" as const,
              startedAt,
            }
          : candidate,
      ),
      experiments: state.experiments.map((experiment) =>
        experiment.id === cycle.experimentId
          ? { ...experiment, status: "in-progress" as const }
          : experiment,
      ),
      decisions: state.decisions.map((decision) =>
        decision.id === cycle.decisionId
          ? {
              ...decision,
              nextAction: {
                id: `next-${decision.id}-continue`,
                label: "Continue the active action cycle",
                description:
                  "Work through the focused tasks and required signals.",
                targetPath: `/founder/projects/${ventureId}/cycle`,
                kind: "open-cycle" as const,
              },
              updatedAt: startedAt,
            }
          : decision,
      ),
      ventures: state.ventures.map((venture) =>
        venture.id === ventureId
          ? {
              ...venture,
              overallProgress: venture.overallProgress
                ? {
                    ...venture.overallProgress,
                    recentChange: "The committed action cycle started.",
                    cycleStatus: "in-progress" as const,
                  }
                : venture.overallProgress,
              lastUpdatedAt: startedAt,
            }
          : venture,
      ),
      activities: [
        {
          id: uniqueId(
            state.activities.map((activity) => activity.id),
            `activity-${ventureId.replace(
              /^venture-/,
              "",
            )}-cycle-started`,
          ),
          ventureId,
          type: "cycle" as const,
          message: `Started action cycle: ${cycle.title}.`,
          occurredAt: startedAt,
        },
        ...state.activities,
      ],
    },
    ok: true,
    errors: [],
  };
}
