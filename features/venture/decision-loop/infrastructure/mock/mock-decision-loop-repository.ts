import {
  confirmBaseline,
  updateBaselineField,
} from "../../application/commands/baseline-commands";
import {
  respondToChallengeItem,
  updateChallengeItemNote,
} from "../../application/commands/challenge-response-commands";
import { executeChallengeScan } from "../../application/commands/challenge-scan-commands";
import {
  commitActionCycle,
  startActionCycle,
} from "../../application/commands/cycle-commitment-commands";
import {
  addCycleTask,
  updateCycleTask,
} from "../../application/commands/cycle-task-commands";
import {
  deferDecisionCandidate,
  rejectDecisionCandidate,
  saveFounderDecisionRationale,
  selectCriticalDecision,
  updateDecisionChangeCriteria,
} from "../../application/commands/decision-commands";
import {
  addEvidenceRequirement,
  updateEvidenceRequirement,
} from "../../application/commands/evidence-requirement-commands";
import {
  createExperimentDraft,
  updateExperimentPlan,
} from "../../application/commands/experiment-commands";
import {
  addSource,
  excludeSource,
  updateSourceReviewStatus,
} from "../../application/commands/source-commands";
import type { DecisionLoopCommandResult } from "../../application/contracts";
import type { VentureWorkspaceState } from "../../application/model/venture-workspace-state";
import type { DecisionLoopRepository } from "../../application/ports/decision-loop-repository";
import { getDecisionLoopScenarioTemplate } from "./decision-loop-seed";

export type MockDecisionLoopStateAccess = {
  read: () => VentureWorkspaceState;
  commit: (state: VentureWorkspaceState) => void;
};

export function createMockDecisionLoopRepository(
  access: MockDecisionLoopStateAccess,
): DecisionLoopRepository {
  async function execute<TResult extends DecisionLoopCommandResult>(
    command: (state: VentureWorkspaceState) => TResult,
  ) {
    const current = access.read();
    const result = command(current);
    if (result.state !== current) {
      access.commit(result.state);
    }
    return { ok: result.ok, errors: result.errors };
  }

  return {
    addSource: (...args) =>
      execute((state) => addSource(state, ...args)),
    updateSourceReviewStatus: (...args) =>
      execute((state) => updateSourceReviewStatus(state, ...args)),
    excludeSource: (...args) =>
      execute((state) => excludeSource(state, ...args)),
    updateBaselineField: (...args) =>
      execute((state) => updateBaselineField(state, ...args)),
    confirmBaseline: (...args) =>
      execute((state) => confirmBaseline(state, ...args)),
    runChallengeScan: (ventureId) =>
      execute((state) =>
        executeChallengeScan(
          state,
          ventureId,
          getDecisionLoopScenarioTemplate(ventureId),
        ),
      ),
    respondToChallengeItem: (...args) =>
      execute((state) => respondToChallengeItem(state, ...args)),
    updateChallengeItemNote: (...args) =>
      execute((state) => updateChallengeItemNote(state, ...args)),
    selectCriticalDecision: (...args) =>
      execute((state) => selectCriticalDecision(state, ...args)),
    saveFounderDecisionRationale: (...args) =>
      execute((state) =>
        saveFounderDecisionRationale(state, ...args),
      ),
    updateDecisionChangeCriteria: (...args) =>
      execute((state) =>
        updateDecisionChangeCriteria(state, ...args),
      ),
    deferDecisionCandidate: (...args) =>
      execute((state) => deferDecisionCandidate(state, ...args)),
    rejectDecisionCandidate: (...args) =>
      execute((state) => rejectDecisionCandidate(state, ...args)),
    createExperimentDraft: (ventureId, at) =>
      execute((state) =>
        createExperimentDraft(
          state,
          ventureId,
          at,
          getDecisionLoopScenarioTemplate(ventureId),
        ),
      ),
    updateExperimentPlan: (...args) =>
      execute((state) => updateExperimentPlan(state, ...args)),
    addEvidenceRequirement: (...args) =>
      execute((state) => addEvidenceRequirement(state, ...args)),
    updateEvidenceRequirement: (...args) =>
      execute((state) => updateEvidenceRequirement(state, ...args)),
    addCycleTask: (...args) =>
      execute((state) => addCycleTask(state, ...args)),
    updateCycleTask: (...args) =>
      execute((state) => updateCycleTask(state, ...args)),
    commitActionCycle: (...args) =>
      execute((state) => commitActionCycle(state, ...args)),
    startActionCycle: (...args) =>
      execute((state) => startActionCycle(state, ...args)),
  };
}
