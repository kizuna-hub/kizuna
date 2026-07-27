import assert from "node:assert/strict";
import test from "node:test";

import {
  resetDemoState,
  restoreDemoState,
  serializeDemoWorkspaceState,
} from "../../venture-foundation/demo-repository";
import { createDemoWorkspaceSeed } from "../../venture-foundation/demo-seed";

test("Founder sidebar collapsed preference survives canonical workspace persistence", () => {
  const state = createDemoWorkspaceSeed();
  state.uiPreferences.founderSidebarCollapsed = true;

  const restored = restoreDemoState(
    serializeDemoWorkspaceState(state),
  );
  assert.equal(
    restored.uiPreferences.founderSidebarCollapsed,
    true,
  );

  assert.equal(
    resetDemoState().uiPreferences.founderSidebarCollapsed,
    false,
  );
});

