import assert from "node:assert/strict";
import test from "node:test";

import {
  confirmDemoVentureSetup,
  createDemoVenture,
  getVentureById,
  restoreDemoState,
  serializeDemoWorkspaceState,
  updateDemoVentureSetup,
} from "../../venture-foundation/demo-repository";
import { createDemoWorkspaceSeed } from "../../venture-foundation/demo-seed";

test("creation request is idempotent across double submit and refresh state", () => {
  const input = {
    requestId: "request-demo-1",
    creationIntent: "conversational-setup" as const,
    name: "Nova Demo",
    oneLineDescription: "Draft context",
    stage: "idea" as const,
  };
  const first = createDemoVenture(
    createDemoWorkspaceSeed(),
    input,
  );
  const second = createDemoVenture(first.state, input);

  assert.equal(second.ventureId, first.ventureId);
  assert.equal(
    second.state.ventures.filter(
      (venture) => venture.id === first.ventureId,
    ).length,
    1,
  );
});

test("setup progress preserves fields, materials and exact current step", () => {
  const created = createDemoVenture(
    createDemoWorkspaceSeed(),
    {
      requestId: "request-demo-setup",
      creationIntent: "analyze-materials",
      name: "Material First",
      oneLineDescription: "Draft context",
      stage: "concept",
    },
  );
  const updated = updateDemoVentureSetup(
    created.state,
    created.ventureId,
    {
      currentStepId: "materials",
      completedStepIds: [
        "venture-name",
        "problem",
        "target-user",
      ],
      problem: "Activation falls after onboarding.",
      targetUser: "Seed-stage SaaS founders",
      initialGoal: "Validate the activation moment",
      materials: [
        {
          id: "material-brief",
          name: "brief.pdf",
          size: 1024,
          type: "application/pdf",
        },
      ],
      updatedAt: "2026-07-27T03:30:00.000Z",
    },
  );
  const venture = getVentureById(updated, created.ventureId);

  assert.equal(venture?.setup?.currentStepId, "materials");
  assert.equal(venture?.setup?.draft.materials.length, 1);
  assert.equal(venture?.setup?.missingRequiredFields.length, 0);
});

test("context confirmation activates venture and creates workspace destination", () => {
  const created = createDemoVenture(
    createDemoWorkspaceSeed(),
    {
      requestId: "request-demo-confirm",
      name: "Ready Venture",
      oneLineDescription: "Draft context",
      stage: "mvp",
    },
  );
  const updated = updateDemoVentureSetup(
    created.state,
    created.ventureId,
    {
      currentStepId: "confirm-context",
      problem: "Users stop before the first value moment.",
      targetUser: "B2B product teams",
      initialGoal: "Find the activation bottleneck",
    },
  );
  const result = confirmDemoVentureSetup(
    updated,
    created.ventureId,
    "2026-07-27T04:00:00.000Z",
  );
  const venture = getVentureById(
    result.state,
    created.ventureId,
  );

  assert.equal(result.confirmed, true);
  assert.equal(venture?.status, "active");
  assert.equal(venture?.setup?.status, "completed");
  assert.equal(
    result.state.currentUser.lastVisitedPathByVenture?.[
      created.ventureId
    ],
    `/founder/projects/${created.ventureId}/workspace`,
  );
});

test("corrupted setup state keeps valid fields and returns to earliest incomplete step", () => {
  const created = createDemoVenture(
    createDemoWorkspaceSeed(),
    {
      requestId: "request-demo-corrupt",
      name: "Recoverable Venture",
      oneLineDescription: "Draft context",
      stage: "idea",
    },
  );
  const envelope = JSON.parse(
    serializeDemoWorkspaceState(created.state),
  ) as {
    state: {
      ventures: Array<{
        id: string;
        setup?: unknown;
      }>;
    };
  };
  const venture = envelope.state.ventures.find(
    (item) => item.id === created.ventureId,
  );
  assert.ok(venture);
  venture.setup = {
    status: "unknown",
    creationIntent: "conversational-setup",
    currentStepId: "broken-step",
    completedStepIds: ["venture-name", "broken-step"],
    draft: {
      problem: "A valid problem survives.",
      targetUser: "",
      initialGoal: "",
      materials: [{ invalid: true }],
    },
  };

  const restored = restoreDemoState(JSON.stringify(envelope));
  const recovered = getVentureById(
    restored,
    created.ventureId,
  );
  assert.equal(recovered?.setup?.draft.problem, "A valid problem survives.");
  assert.equal(recovered?.setup?.currentStepId, "target-user");
  assert.deepEqual(recovered?.setup?.completedStepIds, [
    "venture-name",
  ]);
  assert.deepEqual(recovered?.setup?.draft.materials, []);
});
