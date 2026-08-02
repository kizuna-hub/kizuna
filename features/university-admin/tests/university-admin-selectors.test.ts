import assert from "node:assert/strict";
import test from "node:test";

import { universityVentures } from "../lib/university-admin-mock-data";
import { isUniversityAdminRouteActive } from "../lib/university-admin-route-matching";
import { filterVentures } from "../lib/university-admin-selectors";

test("university mock data is deterministic and has unique route ids", () => {
  assert.equal(universityVentures.length, 8);
  assert.equal(
    new Set(universityVentures.map((venture) => venture.id)).size,
    universityVentures.length,
  );
  assert.ok(
    universityVentures.every(
      (venture) =>
        venture.readiness >= 0 && venture.readiness <= 100,
    ),
  );
});

test("venture filters combine query, stage and readiness", () => {
  const result = filterVentures(universityVentures, {
    query: "người dùng",
    stage: "Prototype",
    readiness: "Medium",
    attention: "Cần hỗ trợ",
  });

  assert.deepEqual(
    result.map((venture) => venture.id),
    ["agriconnect"],
  );
});

test("mentor navigation uses exact route boundaries for list and detail routes", () => {
  assert.equal(
    isUniversityAdminRouteActive({
      pathname:
        "/university-admin/mentor-connections/connection-agriconnect-tung",
      href: "/university-admin/mentor-connections",
    }),
    true,
  );
  assert.equal(
    isUniversityAdminRouteActive({
      pathname:
        "/university-admin/mentor-connections/connection-agriconnect-tung",
      href: "/university-admin/lecturer-mentors",
    }),
    false,
  );
  assert.equal(
    isUniversityAdminRouteActive({
      pathname:
        "/university-admin/lecturer-mentors/nguyen-thanh-tung",
      href: "/university-admin/lecturer-mentors",
    }),
    true,
  );
  assert.equal(
    isUniversityAdminRouteActive({
      pathname: "/university-admin/ventures/agriconnect",
      href: "/university-admin/mentor-connections",
    }),
    false,
  );
});
