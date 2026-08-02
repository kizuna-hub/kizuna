import assert from "node:assert/strict";
import test from "node:test";

import {
  archiveDemoVenture,
  createDemoVenture,
  deleteDemoVenture,
  duplicateDemoVenture,
  getActiveVenture,
  getFilteredVentures,
  getLastVisitedPathForVenture,
  getNextActionForVenture,
  getSupportCoverageForVenture,
  getVentureOverviewData,
  resetDemoState,
  renameDemoVenture,
  restoreDemoState,
  serializeDemoWorkspaceState,
  setActiveVenture,
  setLastVisitedVenturePath,
} from "./demo-repository";
import { createDemoWorkspaceSeed } from "./demo-seed";
import {
  getVentureSwitchPath,
  isValidDirectVenture,
  resolveFounderEntryPath,
} from "./route-resolver";

test("the demo seed is deterministic and fresh", () => {
  const first = createDemoWorkspaceSeed();
  const second = createDemoWorkspaceSeed();

  assert.deepEqual(first, second);
  first.ventures[0].name = "Changed";
  assert.equal(second.ventures[0].name, "Kizuna Hub");
});

test("active venture selection updates valid ventures only", () => {
  const seed = createDemoWorkspaceSeed();
  const selected = setActiveVenture(seed, "venture-caremind");
  const invalid = setActiveVenture(selected, "missing");

  assert.equal(getActiveVenture(selected)?.id, "venture-caremind");
  assert.equal(invalid, selected);
  assert.equal(
    setActiveVenture(selected, "venture-caremind"),
    selected,
  );
});

test("invalid active venture falls back to last visited or first accessible", () => {
  const seed = createDemoWorkspaceSeed();
  seed.currentUser.activeVentureId = "missing";
  seed.currentUser.lastVisitedVentureId = "venture-edubridge";
  assert.equal(getActiveVenture(seed)?.id, "venture-edubridge");

  seed.currentUser.lastVisitedVentureId = "missing";
  assert.equal(getActiveVenture(seed)?.id, "venture-kizuna-hub");
});

test("last visited venture path is validated and persisted", () => {
  const seed = createDemoWorkspaceSeed();
  const updated = setLastVisitedVenturePath(
    seed,
    "venture-caremind",
    "/founder/projects/venture-caremind/evidence",
  );
  const rejected = setLastVisitedVenturePath(
    updated,
    "venture-caremind",
    "/founder/projects/venture-edubridge",
  );

  assert.equal(
    getLastVisitedPathForVenture(updated, "venture-caremind"),
    "/founder/projects/venture-caremind/evidence",
  );
  assert.equal(rejected, updated);
  assert.equal(
    setLastVisitedVenturePath(
      updated,
      "venture-caremind",
      "/founder/projects/venture-caremind/evidence",
    ),
    updated,
  );
});

test("next action and support selectors reflect canonical scenarios", () => {
  const seed = createDemoWorkspaceSeed();

  assert.equal(
    getNextActionForVenture(seed, "venture-kizuna-hub").label,
    "Review claims and assumptions",
  );
  assert.deepEqual(
    getSupportCoverageForVenture(seed, "venture-snapmoney"),
    {
      status: "uncovered",
      activeRelationshipCount: 0,
      summary: "No active support relationship",
      gap: "FinTech compliance expertise",
    },
  );
});

test("project filters and overview data use the canonical repository", () => {
  const seed = createDemoWorkspaceSeed();
  assert.deepEqual(
    getFilteredVentures(seed, { query: "compliance" }).map(
      (venture) => venture.name,
    ),
    ["SnapMoney"],
  );
  assert.deepEqual(
    getFilteredVentures(seed, { stage: "prototype" }).map(
      (venture) => venture.name,
    ),
    ["CareMind"],
  );
  assert.deepEqual(
    getFilteredVentures(seed, { status: "setup" }).map(
      (venture) => venture.name,
    ),
    ["SnapMoney"],
  );

  const overview = getVentureOverviewData(
    seed,
    "venture-kizuna-hub",
  );
  assert.equal(overview?.venture.currentPhase, "buyer-validation");
  assert.equal(
    overview?.decision?.title,
    "Who owns the budget and final purchasing decision?",
  );
  assert.equal(
    overview?.decision?.whyItMatters,
    "Pricing and go-to-market remain speculative without a verified buyer.",
  );
  assert.equal(
    overview?.relationships[0]?.personName,
    "Mai Tran",
  );
});

test("persistence restores valid state and recovers from corruption", () => {
  const seed = setActiveVenture(
    createDemoWorkspaceSeed(),
    "venture-caremind",
  );

  assert.deepEqual(
    restoreDemoState(serializeDemoWorkspaceState(seed)),
    seed,
  );
  assert.deepEqual(
    restoreDemoState("{not valid json"),
    createDemoWorkspaceSeed(),
  );
  assert.deepEqual(
    restoreDemoState('{"version":99,"state":{}}'),
    createDemoWorkspaceSeed(),
  );
});

test("persistence migrates a valid v1 workspace without losing ventures", () => {
  const seed = createDemoWorkspaceSeed();
  const legacy = JSON.parse(
    serializeDemoWorkspaceState(seed),
  ) as {
    version: number;
    state: Record<string, unknown> & {
      uiPreferences: Record<string, unknown>;
    };
  };
  legacy.version = 1;
  legacy.state.uiPreferences.storageVersion = 1;
  for (const key of [
    "sources",
    "baselines",
    "challengeScans",
    "challengeItems",
    "experiments",
    "evidenceRequirements",
    "cycleTasks",
  ]) {
    delete legacy.state[key];
  }

  const restored = restoreDemoState(JSON.stringify(legacy));

  assert.deepEqual(
    restored.ventures.map((venture) => venture.id),
    seed.ventures.map((venture) => venture.id),
  );
  assert.equal(restored.uiPreferences.storageVersion, 2);
  assert.ok(restored.sources.length > 0);
  assert.ok(restored.baselines.length > 0);
});

test("persistence adds missing canonical ventures without overwriting saved work", () => {
  const seed = createDemoWorkspaceSeed();
  const legacyV2 = {
    ...seed,
    ventures: seed.ventures
      .filter(
        (venture) =>
          venture.id !== "call-to-cash-risk-copilot",
      )
      .map((venture) =>
        venture.id === "venture-kizuna-hub"
          ? { ...venture, name: "Saved Kizuna Workspace" }
          : venture,
      ),
  };
  const withoutCallToCash = <T extends { ventureId: string }>(
    items: T[],
  ) =>
    items.filter(
      (item) =>
        item.ventureId !== "call-to-cash-risk-copilot",
    );
  legacyV2.sources = withoutCallToCash(legacyV2.sources);
  legacyV2.baselines = withoutCallToCash(legacyV2.baselines);
  legacyV2.challengeScans = withoutCallToCash(
    legacyV2.challengeScans,
  );
  legacyV2.challengeItems = withoutCallToCash(
    legacyV2.challengeItems,
  );
  legacyV2.decisions = withoutCallToCash(legacyV2.decisions);
  legacyV2.supportRelationships = withoutCallToCash(
    legacyV2.supportRelationships,
  );
  legacyV2.programs = withoutCallToCash(legacyV2.programs);
  legacyV2.activities = withoutCallToCash(legacyV2.activities);

  const restored = restoreDemoState(
    serializeDemoWorkspaceState(legacyV2),
  );

  assert.equal(restored.ventures.length, 5);
  assert.equal(restored.ventures[0].name, "Saved Kizuna Workspace");
  assert.ok(
    restored.ventures.some(
      (venture) =>
        venture.id === "call-to-cash-risk-copilot",
    ),
  );
  assert.equal(
    restored.challengeItems.filter(
      (item) =>
        item.ventureId === "call-to-cash-risk-copilot",
    ).length,
    11,
  );
});

test("reset returns the canonical seed", () => {
  const changed = setActiveVenture(
    createDemoWorkspaceSeed(),
    "venture-edubridge",
  );
  assert.notDeepEqual(changed, createDemoWorkspaceSeed());
  assert.deepEqual(resetDemoState(), createDemoWorkspaceSeed());
});

test("venture creation activates the new project and archive falls back", () => {
  const created = createDemoVenture(createDemoWorkspaceSeed(), {
    id: "venture-new",
    name: "New Venture",
    oneLineDescription: "A focused new project.",
    stage: "concept",
    createdAt: "2026-07-24T12:00:00.000Z",
  });

  assert.equal(created.ventureId, "venture-new");
  assert.equal(getActiveVenture(created.state)?.id, "venture-new");

  const archived = archiveDemoVenture(
    created.state,
    "venture-new",
  );
  assert.equal(
    archived.ventures.find((venture) => venture.id === "venture-new")
      ?.status,
    "archived",
  );
  assert.equal(getActiveVenture(archived)?.id, "venture-kizuna-hub");
});

test("project card actions rename, duplicate, and delete without orphaning scoped state", () => {
  const seed = createDemoWorkspaceSeed();
  const original = seed.ventures.find(
    (venture) => venture.id === "venture-kizuna-hub",
  )!;
  const renamed = renameDemoVenture(
    seed,
    original.id,
    "Kizuna Studio",
  );
  const renamedVenture = renamed.ventures.find(
    (venture) => venture.id === original.id,
  );

  assert.equal(renamedVenture?.name, "Kizuna Studio");
  assert.equal(
    renamedVenture?.setup?.status,
    original.setup?.status,
  );

  const duplicated = duplicateDemoVenture(
    renamed,
    original.id,
  );
  assert.equal(
    duplicated.state.ventures.some(
      (venture) =>
        venture.id === duplicated.ventureId &&
        venture.name === "Kizuna Studio Copy",
    ),
    true,
  );

  const deleted = deleteDemoVenture(
    duplicated.state,
    duplicated.ventureId!,
  );
  assert.equal(
    deleted.ventures.some(
      (venture) => venture.id === duplicated.ventureId,
    ),
    false,
  );
  assert.equal(
    deleted.decisions.some(
      (decision) =>
        decision.ventureId === duplicated.ventureId,
    ),
    false,
  );
  assert.equal(
    deleted.baselines.some(
      (baseline) =>
        baseline.ventureId === duplicated.ventureId,
    ),
    false,
  );
});

test("founder entry resolves zero, one, many, and archived continuity", () => {
  const empty = createDemoWorkspaceSeed();
  empty.ventures = [];
  assert.equal(
    resolveFounderEntryPath(empty),
    "/founder/projects/new",
  );

  const one = createDemoWorkspaceSeed();
  one.ventures = [
    one.ventures.find(
      (venture) => venture.id === "venture-snapmoney",
    )!,
  ];
  one.currentUser.activeVentureId = "venture-snapmoney";
  one.currentUser.lastVisitedVentureId = "venture-snapmoney";
  assert.equal(
    resolveFounderEntryPath(one),
    "/founder/projects/venture-snapmoney/context",
  );

  const many = setLastVisitedVenturePath(
    createDemoWorkspaceSeed(),
    "venture-caremind",
    "/founder/projects/venture-caremind/evidence",
  );
  assert.equal(
    resolveFounderEntryPath(many),
    "/founder/projects/venture-caremind/evidence",
  );

  const archived = createDemoWorkspaceSeed();
  archived.currentUser.activeVentureId = "venture-kizuna-hub";
  archived.currentUser.lastVisitedVentureId = "venture-kizuna-hub";
  archived.ventures[0].status = "archived";
  assert.equal(
    resolveFounderEntryPath(archived),
    "/founder/projects?notice=archived",
  );
});

test("project switching preserves valid equivalent sections", () => {
  assert.equal(
    getVentureSwitchPath(
      "/vi/founder/home",
      "venture-caremind",
    ),
    "/founder/home",
  );
  assert.equal(
    getVentureSwitchPath(
      "/en/founder/projects/venture-kizuna-hub/evidence",
      "venture-caremind",
    ),
    "/founder/projects/venture-caremind/evidence",
  );
  assert.equal(
    getVentureSwitchPath(
      "/founder/founder-workspace/venture-kizuna-hub/data-room",
      "venture-caremind",
    ),
    "/founder/founder-workspace/venture-caremind/data-room",
  );
  assert.equal(
    getVentureSwitchPath(
      "/founder/founder-workspace/venture-kizuna-hub/metrics",
      "venture-caremind",
    ),
    "/founder/projects/venture-caremind",
  );
});

test("direct venture validation rejects missing and archived ventures", () => {
  const seed = createDemoWorkspaceSeed();
  assert.equal(
    isValidDirectVenture(seed, "venture-kizuna-hub"),
    true,
  );
  assert.equal(isValidDirectVenture(seed, "missing"), false);

  seed.ventures[0].status = "archived";
  assert.equal(
    isValidDirectVenture(seed, "venture-kizuna-hub"),
    false,
  );
});
