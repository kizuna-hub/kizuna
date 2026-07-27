import assert from "node:assert/strict";
import test from "node:test";

import type { Venture } from "../../venture/core";
import {
  formatProjectActivity,
  getProjectCardDestination,
  getProjectPortfolioReferenceTime,
  groupProjectVenturesByActivity,
  sortProjectVentures,
} from "./project-portfolio";

function createVenture(
  id: string,
  name: string,
  lastUpdatedAt: string,
): Venture {
  return {
    id,
    name,
    slug: id,
    oneLineDescription: `${name} description`,
    stage: "idea",
    status: "active",
    tags: [],
    currentPhase: "venture-context",
    supportSummary: {
      status: "uncovered",
      activeRelationshipCount: 0,
      summary: "No active support",
    },
    lastUpdatedAt,
    createdAt: lastUpdatedAt,
  };
}

test("project portfolio groups by recent activity windows", () => {
  const ventures = [
    createVenture("recent", "Recent", "2026-07-27T00:00:00.000Z"),
    createVenture("medium", "Medium", "2026-07-01T00:00:00.000Z"),
    createVenture("old", "Old", "2026-04-01T00:00:00.000Z"),
  ];
  const referenceTime = getProjectPortfolioReferenceTime(ventures);
  const groups = groupProjectVenturesByActivity(
    ventures,
    referenceTime,
  );

  assert.deepEqual(
    groups.map((group) => [
      group.id,
      group.ventures.map((venture) => venture.id),
    ]),
    [
      ["last-14-days", ["recent"]],
      ["last-60-days", ["medium"]],
      ["older", ["old"]],
    ],
  );
});

test("project portfolio sort and activity copy are deterministic", () => {
  const ventures = [
    createVenture("b", "Beta", "2026-07-20T00:00:00.000Z"),
    createVenture("a", "Alpha", "2026-07-27T00:00:00.000Z"),
  ];
  const referenceTime = getProjectPortfolioReferenceTime(ventures);

  assert.deepEqual(
    sortProjectVentures(ventures, "name").map(
      (venture) => venture.name,
    ),
    ["Alpha", "Beta"],
  );
  assert.equal(
    formatProjectActivity(ventures[0].lastUpdatedAt, referenceTime),
    "Edited 7 days ago",
  );
});

test("active project cards open the AI workspace directly", () => {
  const active = createVenture(
    "venture-active",
    "Active",
    "2026-07-27T00:00:00.000Z",
  );
  const setup = {
    ...createVenture(
      "venture-setup",
      "Setup",
      "2026-07-27T00:00:00.000Z",
    ),
    status: "setup" as const,
  };

  assert.equal(
    getProjectCardDestination(
      active,
      "/founder/projects/venture-active/cycle",
    ),
    "/founder/projects/venture-active/workspace",
  );
  assert.equal(
    getProjectCardDestination(
      setup,
      "/founder/projects/venture-setup/setup",
    ),
    "/founder/projects/venture-setup/setup",
  );
});
