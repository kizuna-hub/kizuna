import type { VentureId } from "../../../core";
import type { DecisionChangeCriterion } from "../../domain";
import type { DecisionLoopCommandResult } from "../contracts";
import type { VentureWorkspaceState } from "../model/venture-workspace-state";
import { getDecisionCandidates } from "../queries/decision-queries";
import {
  isAccessibleVenture,
  markVentureUpdated,
  timestamp,
} from "../services/workspace-state-utils";

export function selectCriticalDecision(
  state: VentureWorkspaceState,
  ventureId: VentureId,
  decisionId: string,
  at?: string,
): DecisionLoopCommandResult {
  if (!isAccessibleVenture(state, ventureId)) {
    return {
      state,
      ok: false,
      errors: ["Project is missing or archived."],
    };
  }
  const decision = getDecisionCandidates(state, ventureId).find(
    (candidate) => candidate.id === decisionId,
  );
  if (!decision) {
    return {
      state,
      ok: false,
      errors: ["Decision candidate does not belong to this project."],
    };
  }
  if (
    !decision.isRecommended &&
    !decision.founderRationale?.trim()
  ) {
    return {
      state,
      ok: false,
      errors: [
        "Explain why this decision should take priority before selecting it.",
      ],
    };
  }
  const committedCycle = state.actionCycles.find(
    (cycle) =>
      cycle.ventureId === ventureId &&
      (cycle.status === "committed" ||
        cycle.status === "in-progress"),
  );
  if (
    committedCycle &&
    committedCycle.decisionId !== decisionId
  ) {
    return {
      state,
      ok: false,
      errors: [
        "Finish or pause the existing active cycle before selecting another critical decision.",
      ],
    };
  }

  const selectedAt = timestamp(at);
  return {
    state: markVentureUpdated(
      {
        ...state,
        decisions: state.decisions.map((candidate) => {
          if (candidate.ventureId !== ventureId) return candidate;
          if (candidate.id === decisionId) {
            return {
              ...candidate,
              status: "selected" as const,
              nextAction: {
                id: `next-${candidate.id}-plan`,
                label: "Plan the focused action cycle",
                description:
                  "Turn this decision into one falsifiable experiment.",
                targetPath: `/founder/projects/${ventureId}/cycle`,
                kind: "plan-cycle" as const,
              },
              updatedAt: selectedAt,
            };
          }
          if (candidate.status === "selected") {
            return {
              ...candidate,
              status: "superseded" as const,
              updatedAt: selectedAt,
            };
          }
          return candidate;
        }),
        ventures: state.ventures.map((venture) =>
          venture.id === ventureId
            ? {
                ...venture,
                status: "active" as const,
                currentPhase: "decision-framing" as const,
                activeDecisionId: decisionId,
                lastUpdatedAt: selectedAt,
              }
            : venture,
        ),
      },
      ventureId,
      selectedAt,
    ),
    ok: true,
    errors: [],
  };
}

export function saveFounderDecisionRationale(
  state: VentureWorkspaceState,
  ventureId: VentureId,
  decisionId: string,
  rationale: string,
  at?: string,
): DecisionLoopCommandResult {
  const decision = state.decisions.find(
    (candidate) =>
      candidate.id === decisionId &&
      candidate.ventureId === ventureId,
  );
  const committedCycle = state.actionCycles.find(
    (cycle) =>
      cycle.ventureId === ventureId &&
      (cycle.status === "committed" ||
        cycle.status === "in-progress"),
  );
  if (!decision || committedCycle) {
    return {
      state,
      ok: false,
      errors: [
        committedCycle
          ? "Committed reasoning is read-only while the cycle is active."
          : "Decision candidate does not belong to this project.",
      ],
    };
  }
  const normalized = rationale.trim();
  if (!normalized) {
    return {
      state,
      ok: false,
      errors: ["Add a concise founder rationale before continuing."],
    };
  }
  const changedAt = timestamp(at);
  return {
    state: markVentureUpdated(
      {
        ...state,
        decisions: state.decisions.map((candidate) =>
          candidate.id === decision.id
            ? {
                ...candidate,
                founderRationale: normalized,
                updatedAt: changedAt,
              }
            : candidate,
        ),
      },
      ventureId,
      changedAt,
    ),
    ok: true,
    errors: [],
  };
}

export function updateDecisionChangeCriteria(
  state: VentureWorkspaceState,
  ventureId: VentureId,
  decisionId: string,
  criteria: DecisionChangeCriterion[],
  at?: string,
): DecisionLoopCommandResult {
  const decision = state.decisions.find(
    (candidate) =>
      candidate.id === decisionId &&
      candidate.ventureId === ventureId,
  );
  const hasCommittedCycle = state.actionCycles.some(
    (cycle) =>
      cycle.ventureId === ventureId &&
      (cycle.status === "committed" ||
        cycle.status === "in-progress"),
  );
  if (!decision || hasCommittedCycle) {
    return {
      state,
      ok: false,
      errors: [
        hasCommittedCycle
          ? "Committed reasoning is read-only while the cycle is active."
          : "Decision candidate does not belong to this project.",
      ],
    };
  }
  const normalized = criteria
    .map((criterion) => ({
      ...criterion,
      text: criterion.text.trim(),
    }))
    .filter((criterion) => criterion.text)
    .slice(0, 8);
  const changedAt = timestamp(at);
  return {
    state: markVentureUpdated(
      {
        ...state,
        decisions: state.decisions.map((candidate) =>
          candidate.id === decision.id
            ? {
                ...candidate,
                changeMyMindCriteria: normalized,
                decisionChangingEvidence: normalized.map(
                  (criterion) => criterion.text,
                ),
                updatedAt: changedAt,
              }
            : candidate,
        ),
      },
      ventureId,
      changedAt,
    ),
    ok: true,
    errors: [],
  };
}

export function deferDecisionCandidate(
  state: VentureWorkspaceState,
  ventureId: VentureId,
  decisionId: string,
  at?: string,
): DecisionLoopCommandResult {
  const decision = state.decisions.find(
    (candidate) =>
      candidate.id === decisionId &&
      candidate.ventureId === ventureId,
  );
  if (
    !decision ||
    decision.status === "committed" ||
    decision.status === "selected"
  ) {
    return {
      state,
      ok: false,
      errors: ["This decision cannot be deferred in its current state."],
    };
  }
  const changedAt = timestamp(at);
  return {
    state: {
      ...state,
      decisions: state.decisions.map((candidate) =>
        candidate.id === decisionId
          ? {
              ...candidate,
              status: "deferred" as const,
              updatedAt: changedAt,
            }
          : candidate,
      ),
    },
    ok: true,
    errors: [],
  };
}

export function rejectDecisionCandidate(
  state: VentureWorkspaceState,
  ventureId: VentureId,
  decisionId: string,
  at?: string,
): DecisionLoopCommandResult {
  const decision = state.decisions.find(
    (candidate) =>
      candidate.id === decisionId &&
      candidate.ventureId === ventureId,
  );
  if (
    !decision ||
    decision.status === "committed" ||
    decision.status === "selected"
  ) {
    return {
      state,
      ok: false,
      errors: ["This decision cannot be rejected in its current state."],
    };
  }
  const changedAt = timestamp(at);
  return {
    state: {
      ...state,
      decisions: state.decisions.map((candidate) =>
        candidate.id === decisionId
          ? {
              ...candidate,
              status: "rejected" as const,
              updatedAt: changedAt,
            }
          : candidate,
      ),
    },
    ok: true,
    errors: [],
  };
}
