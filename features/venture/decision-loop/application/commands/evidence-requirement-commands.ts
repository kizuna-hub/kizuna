import type { VentureId } from "../../../core";
import type {
  EvidenceRequirement,
  VentureSourceKind,
} from "../../domain";
import type { DecisionLoopCommandResult } from "../contracts";
import type { VentureWorkspaceState } from "../model/venture-workspace-state";
import { slugify, uniqueId } from "../services/workspace-state-utils";

export function addEvidenceRequirement(
  state: VentureWorkspaceState,
  ventureId: VentureId,
  experimentId: string,
  input: {
    label: string;
    description: string;
    minimumCount?: number;
    acceptedSourceKinds?: VentureSourceKind[];
    requiredForExit?: boolean;
  },
): DecisionLoopCommandResult {
  const experiment = state.experiments.find(
    (candidate) =>
      candidate.id === experimentId &&
      candidate.ventureId === ventureId &&
      candidate.status === "draft",
  );
  if (!experiment || !input.label.trim()) {
    return {
      state,
      ok: false,
      errors: ["An editable experiment and requirement label are required."],
    };
  }
  const id = uniqueId(
    state.evidenceRequirements.map(
      (requirement) => requirement.id,
    ),
    `requirement-${ventureId.replace(/^venture-/, "")}-${slugify(
      input.label,
    )}`,
  );
  const requirement: EvidenceRequirement = {
    id,
    ventureId,
    experimentId,
    label: input.label.trim(),
    description: input.description.trim(),
    minimumCount: input.minimumCount,
    acceptedSourceKinds:
      input.acceptedSourceKinds ?? ["customer-interview"],
    requiredForExit: input.requiredForExit ?? true,
    status: "required",
  };
  return {
    state: {
      ...state,
      evidenceRequirements: [
        ...state.evidenceRequirements,
        requirement,
      ],
      experiments: state.experiments.map((candidate) =>
        candidate.id === experimentId
          ? {
              ...candidate,
              evidenceRequirementIds: [
                ...candidate.evidenceRequirementIds,
                id,
              ],
            }
          : candidate,
      ),
      actionCycles: state.actionCycles.map((cycle) =>
        cycle.experimentId === experimentId &&
        cycle.status === "draft"
          ? {
              ...cycle,
              evidenceRequirementIds: [
                ...(cycle.evidenceRequirementIds ?? []),
                id,
              ],
            }
          : cycle,
      ),
    },
    ok: true,
    errors: [],
  };
}

export function updateEvidenceRequirement(
  state: VentureWorkspaceState,
  ventureId: VentureId,
  requirementId: string,
  patch: Partial<
    Pick<
      EvidenceRequirement,
      | "label"
      | "description"
      | "minimumCount"
      | "acceptedSourceKinds"
      | "requiredForExit"
      | "status"
    >
  >,
): DecisionLoopCommandResult {
  const requirement = state.evidenceRequirements.find(
    (candidate) => candidate.id === requirementId,
  );
  if (!requirement || requirement.ventureId !== ventureId) {
    return {
      state,
      ok: false,
      errors: ["Evidence requirement does not belong to this project."],
    };
  }
  return {
    state: {
      ...state,
      evidenceRequirements: state.evidenceRequirements.map(
        (candidate) =>
          candidate.id === requirementId
            ? {
                ...candidate,
                ...patch,
                label:
                  patch.label?.trim() ?? candidate.label,
                description:
                  patch.description?.trim() ??
                  candidate.description,
              }
            : candidate,
      ),
    },
    ok: true,
    errors: [],
  };
}

