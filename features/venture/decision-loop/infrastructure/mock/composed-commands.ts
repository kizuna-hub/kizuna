import type { VentureId } from "../../../core";
import {
  executeChallengeScan,
} from "../../application/commands/challenge-scan-commands";
import {
  createExperimentDraft,
} from "../../application/commands/experiment-commands";
import {
  deriveCriticalPattern,
} from "../../application/queries/workflow-queries";
import type { VentureWorkspaceState } from "../../application/model/venture-workspace-state";
import { getDecisionLoopScenarioTemplate } from "./decision-loop-seed";

export function runChallengeScan(
  state: VentureWorkspaceState,
  ventureId: VentureId,
) {
  return executeChallengeScan(
    state,
    ventureId,
    getDecisionLoopScenarioTemplate(ventureId),
  );
}

export function createDraftExperiment(
  state: VentureWorkspaceState,
  ventureId: VentureId,
  at?: string,
) {
  return createExperimentDraft(
    state,
    ventureId,
    at,
    getDecisionLoopScenarioTemplate(ventureId),
  );
}

export function getScenarioCriticalPattern(
  state: VentureWorkspaceState,
  ventureId: VentureId,
) {
  return deriveCriticalPattern(
    state,
    ventureId,
    getDecisionLoopScenarioTemplate(ventureId),
  );
}
