import type { VentureId } from "../../../core";
import type { CycleTask } from "../../domain";
import type { DecisionLoopCommandResult } from "../contracts";
import type { VentureWorkspaceState } from "../model/venture-workspace-state";
import { slugify, uniqueId } from "../services/workspace-state-utils";

export function addCycleTask(
  state: VentureWorkspaceState,
  ventureId: VentureId,
  experimentId: string,
  input: {
    title: string;
    ownerId?: string;
    dueAt?: string;
    evidenceRequirementId?: string;
    note?: string;
  },
): DecisionLoopCommandResult {
  const experiment = state.experiments.find(
    (candidate) =>
      candidate.id === experimentId &&
      candidate.ventureId === ventureId &&
      candidate.status === "draft",
  );
  const duplicate = state.cycleTasks.some(
    (task) =>
      task.experimentId === experimentId &&
      task.title.trim().toLowerCase() ===
        input.title.trim().toLowerCase(),
  );
  if (!experiment || !input.title.trim() || duplicate) {
    return {
      state,
      ok: false,
      errors: [
        duplicate
          ? "A task with this title already exists."
          : "An editable experiment and task title are required.",
      ],
    };
  }
  if (
    input.evidenceRequirementId &&
    !state.evidenceRequirements.some(
      (requirement) =>
        requirement.id === input.evidenceRequirementId &&
        requirement.ventureId === ventureId &&
        requirement.experimentId === experimentId,
    )
  ) {
    return {
      state,
      ok: false,
      errors: ["Linked evidence requirement is invalid."],
    };
  }

  const id = uniqueId(
    state.cycleTasks.map((task) => task.id),
    `task-${ventureId.replace(/^venture-/, "")}-${slugify(
      input.title,
    )}`,
  );
  const task: CycleTask = {
    id,
    ventureId,
    experimentId,
    title: input.title.trim(),
    ownerId: input.ownerId ?? experiment.ownerId,
    status: "not-started",
    dueAt: input.dueAt,
    evidenceRequirementId: input.evidenceRequirementId,
    note: input.note?.trim() || undefined,
  };
  return {
    state: {
      ...state,
      cycleTasks: [...state.cycleTasks, task],
      actionCycles: state.actionCycles.map((cycle) =>
        cycle.experimentId === experimentId &&
        cycle.status === "draft"
          ? {
              ...cycle,
              taskIds: [...(cycle.taskIds ?? []), id],
            }
          : cycle,
      ),
    },
    ok: true,
    errors: [],
  };
}

export function updateCycleTask(
  state: VentureWorkspaceState,
  ventureId: VentureId,
  taskId: string,
  patch: Partial<
    Pick<
      CycleTask,
      | "title"
      | "ownerId"
      | "status"
      | "dueAt"
      | "evidenceRequirementId"
      | "note"
    >
  >,
): DecisionLoopCommandResult {
  const task = state.cycleTasks.find(
    (candidate) => candidate.id === taskId,
  );
  if (!task || task.ventureId !== ventureId) {
    return {
      state,
      ok: false,
      errors: ["Task does not belong to this project."],
    };
  }
  if (
    patch.evidenceRequirementId &&
    !state.evidenceRequirements.some(
      (requirement) =>
        requirement.id === patch.evidenceRequirementId &&
        requirement.ventureId === ventureId &&
        requirement.experimentId === task.experimentId,
    )
  ) {
    return {
      state,
      ok: false,
      errors: ["Linked evidence requirement is invalid."],
    };
  }
  const cycleTasks = state.cycleTasks.map((candidate) =>
    candidate.id === taskId
      ? {
          ...candidate,
          ...patch,
          title: patch.title?.trim() ?? candidate.title,
          note:
            patch.note === undefined
              ? candidate.note
              : patch.note.trim() || undefined,
        }
      : candidate,
  );
  const experimentTasks = cycleTasks.filter(
    (candidate) => candidate.experimentId === task.experimentId,
  );
  const progress = experimentTasks.length
    ? Math.round(
        (experimentTasks.filter(
          (candidate) => candidate.status === "done",
        ).length /
          experimentTasks.length) *
          100,
      )
    : 0;
  return {
    state: {
      ...state,
      cycleTasks,
      actionCycles: state.actionCycles.map((cycle) =>
        cycle.experimentId === task.experimentId
          ? { ...cycle, progress }
          : cycle,
      ),
    },
    ok: true,
    errors: [],
  };
}
