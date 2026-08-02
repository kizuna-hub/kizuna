import assert from "node:assert/strict";
import test from "node:test";

import type {
  EvidenceRequirement,
  ExperimentPlan,
} from "./experiment";
import { validateExperimentPlanInvariants } from "./validation";

const validPlan: ExperimentPlan = {
  id: "experiment-domain",
  ventureId: "venture-domain",
  decisionId: "decision-domain",
  title: "Buyer interview cycle",
  hypothesis: "Program operators own the buying decision.",
  method: "Run five structured interviews.",
  expectedSignal: "Three operators confirm budget authority.",
  failureSignal: "Operators route the decision elsewhere.",
  evidenceRequirementIds: ["requirement-domain"],
  ownerId: "user-domain",
  contributorIds: [],
  timeboxDays: 7,
  exitCriteria: ["Select or reject the buyer segment."],
  stopConditions: [],
  whatNotToDo: ["Do not build unrelated product work."],
  status: "draft",
  updatedAt: "2026-07-25T00:00:00.000Z",
};

const validRequirement: EvidenceRequirement = {
  id: "requirement-domain",
  ventureId: "venture-domain",
  experimentId: "experiment-domain",
  label: "Buyer interviews",
  description: "Five recorded interviews.",
  acceptedSourceKinds: ["customer-interview"],
  requiredForExit: true,
  status: "required",
};

test("valid experiment plans satisfy domain invariants", () => {
  assert.deepEqual(
    validateExperimentPlanInvariants(
      "venture-domain",
      validPlan,
      [validRequirement],
    ),
    [],
  );
});

test("domain invariants report every commitment blocker", () => {
  assert.deepEqual(
    validateExperimentPlanInvariants(
      "venture-domain",
      {
        ...validPlan,
        title: "",
        hypothesis: "",
        method: "",
        ownerId: "",
        timeboxDays: 0,
        expectedSignal: "",
        failureSignal: "",
        exitCriteria: [],
        whatNotToDo: [],
      },
      [],
    ),
    [
      "Experiment title is required.",
      "A falsifiable hypothesis is required.",
      "An observable experiment method is required.",
      "Owner is required.",
      "Timebox must be between 1 and 42 days.",
      "Expected signal is required.",
      "Failure signal is required.",
      "At least one evidence requirement is required.",
      "At least one exit criterion is required.",
      "At least one scope guard is required.",
    ],
  );
});
