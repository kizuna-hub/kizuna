import assert from "node:assert/strict";
import test from "node:test";

import { getCompactNextActionLabel } from "./next-action-label";

test("compact next-action labels preserve route intent", () => {
  assert.equal(
    getCompactNextActionLabel(
      "/founder/projects/venture-kizuna-hub/cycle",
    ),
    "Continue cycle",
  );
  assert.equal(
    getCompactNextActionLabel(
      "/founder/projects/venture-caremind/evidence",
    ),
    "Review evidence",
  );
  assert.equal(
    getCompactNextActionLabel(
      "/founder/founder-workspace/venture-kizuna-hub/data-room",
    ),
    "View output",
  );
});

test("compact next-action labels distinguish overview and decision fallbacks", () => {
  assert.equal(
    getCompactNextActionLabel(
      "/founder/projects/venture-edubridge",
    ),
    "Open overview",
  );
  assert.equal(
    getCompactNextActionLabel("/founder/review/decision"),
    "Open decision",
  );
});
