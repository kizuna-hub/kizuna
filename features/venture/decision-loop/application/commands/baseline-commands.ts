import type { VentureId } from "../../../core";
import type {
  BaselineField,
  BaselineFieldKey,
  VentureBaseline,
} from "../../domain";
import { baselineFieldKeys, baselineFieldLabels } from "../baseline-fields";
import type { DecisionLoopCommandResult } from "../contracts";
import type { VentureWorkspaceState } from "../model/venture-workspace-state";
import {
  getCurrentBaseline,
} from "../queries/source-and-baseline-queries";
import { getBaselineCompleteness } from "../services/baseline-completeness";
import {
  hasValue,
  isAccessibleVenture,
  markVentureUpdated,
  nextVersion,
  timestamp,
} from "../services/workspace-state-utils";

export function updateBaselineField(
  state: VentureWorkspaceState,
  ventureId: VentureId,
  fieldKey: BaselineFieldKey,
  patch: Partial<
    Pick<
      BaselineField,
      | "value"
      | "sourceIds"
      | "confidence"
      | "status"
      | "founderConfirmed"
    >
  >,
  at?: string,
): DecisionLoopCommandResult {
  if (!isAccessibleVenture(state, ventureId)) {
    return {
      state,
      ok: false,
      errors: ["Project is missing or archived."],
    };
  }
  const baseline = getCurrentBaseline(state, ventureId);
  if (!baseline) {
    return {
      state,
      ok: false,
      errors: ["No venture baseline exists."],
    };
  }

  const invalidSource = patch.sourceIds?.find((sourceId) => {
    const source = state.sources.find((item) => item.id === sourceId);
    return !source || source.ventureId !== ventureId;
  });
  if (invalidSource) {
    return {
      state,
      ok: false,
      errors: ["A linked source belongs to another project."],
    };
  }

  const changedAt = timestamp(at);
  const existingField = baseline[fieldKey];
  const nextField: BaselineField = {
    ...existingField,
    ...patch,
    value:
      patch.value === undefined
        ? existingField.value
        : patch.value.trim(),
    founderConfirmed: patch.founderConfirmed ?? false,
    lastConfirmedAt:
      patch.founderConfirmed === true
        ? changedAt
        : existingField.lastConfirmedAt,
  };
  if (!nextField.value) {
    nextField.status = "missing";
  } else if (
    patch.value !== undefined &&
    patch.status === undefined
  ) {
    nextField.status = "needs-review";
  }

  const nextBaseline: VentureBaseline = {
    ...baseline,
    [fieldKey]: nextField,
    version: nextVersion(baseline.version),
    status: "needs-update",
    confirmedAt: undefined,
    acknowledgedIncomplete: false,
    updatedAt: changedAt,
  };

  const nextState: VentureWorkspaceState = {
    ...state,
    baselines: state.baselines.map((item) =>
      item.id === baseline.id ? nextBaseline : item,
    ),
    challengeScans: state.challengeScans.map((scan) =>
      scan.ventureId === ventureId &&
      scan.status !== "superseded"
        ? { ...scan, status: "superseded" as const }
        : scan,
    ),
  };

  return {
    state: markVentureUpdated(nextState, ventureId, changedAt),
    ok: true,
    errors: [],
  };
}

export function confirmBaseline(
  state: VentureWorkspaceState,
  ventureId: VentureId,
  options: { acknowledgeIncomplete?: boolean; at?: string } = {},
): DecisionLoopCommandResult {
  const baseline = getCurrentBaseline(state, ventureId);
  const completeness = getBaselineCompleteness(state, ventureId);
  if (!baseline || !isAccessibleVenture(state, ventureId)) {
    return {
      state,
      ok: false,
      errors: ["No accessible venture baseline exists."],
    };
  }
  if (!completeness.canConfirm) {
    const missing = completeness.missingRequired
      .map((key) => baselineFieldLabels[key])
      .join(", ");
    return {
      state,
      ok: false,
      errors: [
        completeness.reviewedSourceCount === 0
          ? "Confirm at least one current source before continuing."
          : `Minimum context is missing: ${missing}.`,
      ],
    };
  }
  if (
    completeness.missingOptional.length > 0 &&
    !options.acknowledgeIncomplete
  ) {
    return {
      state,
      ok: false,
      errors: [
        "Acknowledge the visible context gaps before confirming this incomplete baseline.",
      ],
    };
  }

  const confirmedAt = timestamp(options.at);
  const confirmedBaseline: VentureBaseline = {
    ...baseline,
    status: "confirmed",
    confirmedAt,
    updatedAt: confirmedAt,
    acknowledgedIncomplete:
      completeness.missingOptional.length > 0,
  };

  baselineFieldKeys.forEach((key) => {
    const field = confirmedBaseline[key];
    if (!hasValue(field)) return;
    confirmedBaseline[key] = {
      ...field,
      founderConfirmed: true,
      lastConfirmedAt: confirmedAt,
      status:
        field.status === "missing" ? "needs-review" : field.status,
    };
  });

  const nextState = {
    ...state,
    baselines: state.baselines.map((item) =>
      item.id === baseline.id ? confirmedBaseline : item,
    ),
  };
  return {
    state: markVentureUpdated(nextState, ventureId, confirmedAt),
    ok: true,
    errors: [],
  };
}
