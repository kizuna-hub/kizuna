import assert from "node:assert/strict";
import test from "node:test";

import { createDemoWorkspaceSeed } from "../../venture-foundation/demo-seed";
import {
  getFounderHomeViewModel,
  getHomeAttentionItems,
  getHomeQuickActions,
  getRecentCrossProjectActivity,
} from "./home-view-model";

test("Home feature resolves the no-venture state without fabricated content", () => {
  const seed = createDemoWorkspaceSeed();
  seed.ventures = [];

  const home = getFounderHomeViewModel(seed);

  assert.equal(home.state, "no-venture");
  assert.equal(home.continuation, undefined);
  assert.deepEqual(home.attentionItems, []);
  assert.deepEqual(home.recentActivity, []);
});

test("Home resolves setup-incomplete to the canonical context route", () => {
  const seed = createDemoWorkspaceSeed();
  seed.currentUser.activeVentureId = "venture-snapmoney";
  seed.currentUser.lastVisitedVentureId = "venture-snapmoney";

  const home = getFounderHomeViewModel(seed);

  assert.equal(home.state, "setup-incomplete");
  assert.equal(home.setupJourney?.currentStep, 2);
  assert.equal(home.setupJourney?.totalSteps, 3);
  assert.equal(
    home.setupJourney?.actionHref,
    "/founder/projects/venture-snapmoney/context",
  );
  assert.deepEqual(home.quickActions, []);
});

test("Home resolves a single active venture as returning", () => {
  const seed = createDemoWorkspaceSeed();
  seed.ventures = seed.ventures.filter(
    (venture) => venture.id === "venture-kizuna-hub",
  );

  const home = getFounderHomeViewModel(seed);

  assert.equal(home.state, "returning");
  assert.equal(home.continuation?.ventureName, "Kizuna Hub");
});

test("Home resolves multiple active ventures and limits secondary projects", () => {
  const home = getFounderHomeViewModel(createDemoWorkspaceSeed());

  assert.equal(home.state, "multiple");
  assert.equal(home.continuation?.ventureName, "Kizuna Hub");
  assert.deepEqual(
    home.otherActiveProjects.map((venture) => venture.name),
    ["EduBridge", "CareMind", "Call-to-Cash Risk Copilot"],
  );
  assert.ok(home.otherActiveProjects.length <= 3);
});

test("continuation uses the valid last-active venture", () => {
  const seed = createDemoWorkspaceSeed();
  seed.currentUser.activeVentureId = "venture-caremind";
  seed.currentUser.lastVisitedVentureId = "venture-edubridge";

  const home = getFounderHomeViewModel(seed);

  assert.equal(home.continuation?.ventureId, "venture-edubridge");
});

test("continuation uses the canonical decision, action, and destination", () => {
  const home = getFounderHomeViewModel(createDemoWorkspaceSeed());

  assert.equal(
    home.continuation?.decisionTitle,
    "Who owns the budget and final purchasing decision?",
  );
  assert.equal(
    home.continuation?.primaryAction.label,
    "Review findings",
  );
  assert.equal(
    home.continuation?.primaryAction.href,
    "/founder/projects/venture-kizuna-hub/cycle",
  );
});

test("continuation falls back safely when last-active is archived", () => {
  const seed = createDemoWorkspaceSeed();
  seed.currentUser.activeVentureId = "venture-caremind";
  seed.currentUser.lastVisitedVentureId = "venture-kizuna-hub";
  seed.ventures[0].status = "archived";

  const home = getFounderHomeViewModel(seed);

  assert.equal(home.continuation?.ventureId, "venture-caremind");
});

test("quick actions are state-aware, supported, and limited to three", () => {
  const seed = createDemoWorkspaceSeed();
  const home = getFounderHomeViewModel(seed);

  assert.ok(home.continuation);
  const actions = getHomeQuickActions(
    seed,
    seed.ventures[0],
    home.continuation!,
  );

  assert.ok(actions.length <= 3);
  assert.deepEqual(
    actions.map((action) => action.title),
    ["Review context"],
  );
  assert.ok(
    actions.every((action) =>
      ["context", "cycle", "decision"].includes(action.kind),
    ),
  );
  assert.ok(
    actions.every((action) =>
      action.href.startsWith("/founder/projects/"),
    ),
  );
});

test("quick actions never expose Phase 3 evidence or mentor-feedback work", () => {
  const seed = createDemoWorkspaceSeed();
  seed.currentUser.activeVentureId = "venture-caremind";
  seed.currentUser.lastVisitedVentureId = "venture-caremind";

  const home = getFounderHomeViewModel(seed);

  assert.equal(
    home.quickActions.some(
      (action) =>
        !["context", "cycle", "decision"].includes(action.kind),
    ),
    false,
  );
});

test("attention excludes unsupported evidence-review and feedback actions", () => {
  const seed = createDemoWorkspaceSeed();
  seed.evidence[0].status = "needs-review";

  const items = getHomeAttentionItems(seed, 10);

  assert.equal(
    items.some((item) =>
      ["evidence", "feedback"].includes(item.kind),
    ),
    false,
  );
  assert.ok(items.some((item) => item.kind === "setup"));
  assert.ok(items.some((item) => item.kind === "session"));
  assert.ok(items.some((item) => item.kind === "program"));
});

test("attention becomes empty when no canonical item needs action", () => {
  const seed = createDemoWorkspaceSeed();
  seed.ventures.forEach((venture) => {
    venture.status = "active";
    if (venture.currentPhase === "venture-context") {
      venture.currentPhase = "decision-framing";
    }
  });
  seed.evidence.forEach((evidence) => {
    evidence.status = "accepted";
  });
  seed.feedback.forEach((feedback) => {
    feedback.status = "acknowledged";
  });
  seed.supportRelationships.forEach((relationship) => {
    relationship.nextSessionAt = undefined;
  });
  seed.programs.forEach((program) => {
    program.status = "completed";
  });

  assert.deepEqual(getHomeAttentionItems(seed), []);
});

test("recent activity is meaningful, newest-first, and limited", () => {
  const seed = createDemoWorkspaceSeed();
  seed.activities.push({
    id: "activity-page-view",
    ventureId: "venture-kizuna-hub",
    type: "project",
    message: "Viewed dashboard.",
    occurredAt: "2026-07-25T12:00:00.000Z",
  });

  const recent = getRecentCrossProjectActivity(seed, 3);

  assert.equal(recent.length, 3);
  assert.equal(
    recent.some((activity) => activity.id === "activity-page-view"),
    false,
  );
  assert.deepEqual(
    recent.map((activity) => activity.id),
    [
      "activity-kizuna-cycle",
      "activity-snapmoney-context",
      "activity-kizuna-mentor",
    ],
  );
});
