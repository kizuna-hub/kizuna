import assert from "node:assert/strict";
import test from "node:test";

import {
  adaptiveEntryScenarioIds,
  createAdaptiveEntryScenario,
} from "../demo/entry-scenarios";
import { resolveAdaptiveFounderEntry } from "../services/adaptive-entry-resolver";
import { resolveFounderDeepLink } from "../services/deep-link-resolver";

function resolveScenario(
  scenarioId: (typeof adaptiveEntryScenarioIds)[number],
) {
  const scenario = createAdaptiveEntryScenario(scenarioId);
  const pendingDeepLink =
    scenario.pendingDeepLink ??
    resolveFounderDeepLink(scenario.rawDeepLink, scenario.state);
  return resolveAdaptiveFounderEntry({
    state: scenario.state,
    pendingDeepLink,
    pendingMentorSession: scenario.pendingMentorSession,
  });
}

test("new founder resolves to the single canonical creation flow", () => {
  const destination = resolveScenario("new-founder");
  assert.equal(destination.type, "new-founder-onboarding");
  assert.equal(destination.href, "/founder/projects/new");
});

test("single active venture resumes its venture-scoped AI workspace", () => {
  const destination = resolveScenario("single-venture");
  assert.equal(destination.type, "resume-last-workspace");
  assert.equal(
    destination.href,
    "/founder/projects/venture-kizuna-hub/workspace",
  );
});

test("multiple ventures respect the Hub Home entry preference", () => {
  const scenario = createAdaptiveEntryScenario(
    "multiple-ventures",
  );
  const hub = resolveAdaptiveFounderEntry({
    state: scenario.state,
  });
  assert.equal(hub.type, "hub-home");
  assert.equal(hub.href, "/founder/home");

  scenario.state.uiPreferences.entryPreference =
    "continue-last-work";
  const continuation = resolveAdaptiveFounderEntry({
    state: scenario.state,
  });
  assert.equal(continuation.type, "resume-last-workspace");
});

test("incomplete setup resumes exact step before normal entry preference", () => {
  const destination = resolveScenario("incomplete-setup");
  assert.equal(destination.type, "resume-venture-setup");
  if (destination.type !== "resume-venture-setup") return;
  assert.equal(destination.stepId, "materials");
  assert.equal(
    destination.href,
    "/founder/projects/venture-snapmoney/setup",
  );
});

test("pending mentor session opens mentor conversation and brief", () => {
  const destination = resolveScenario(
    "pending-mentor-session",
  );
  assert.equal(destination.type, "mentor-session");
  assert.match(destination.href, /conversation=conversation-mentor/);
  assert.match(destination.href, /session=mentor-session-growth/);
});

test("valid explicit decision-cycle deep link has top priority", () => {
  const destination = resolveScenario(
    "decision-cycle-deep-link",
  );
  assert.equal(destination.type, "deep-link");
  assert.match(destination.href, /view=decision-cycle/);
  assert.match(
    destination.href,
    /cycle=cycle-onboarding-activation/,
  );
});

test("missing target falls back to current venture workspace", () => {
  const destination = resolveScenario("invalid-deep-link");
  assert.equal(destination.type, "deep-link");
  assert.equal(
    destination.href,
    "/founder/projects/venture-kizuna-hub/workspace?notice=target-unavailable",
  );
});

test("archived last venture opens Hub Home with a notice", () => {
  const destination = resolveScenario(
    "archived-last-venture",
  );
  assert.equal(destination.type, "hub-home");
  assert.equal(destination.href, "/founder/home?notice=archived");
});

test("removed access never opens or exposes the target venture", () => {
  const destination = resolveScenario("access-removed");
  assert.equal(destination.type, "access-error");
  assert.equal(
    destination.href,
    "/founder/home?notice=access-denied",
  );
  assert.doesNotMatch(destination.href, /private/);
});

test("deleted last conversation keeps venture and restores in workspace", () => {
  const destination = resolveScenario("deleted-conversation");
  assert.equal(destination.type, "resume-last-workspace");
  assert.match(destination.href, /conversation=conversation-deleted/);
  assert.match(
    destination.href,
    /notice=conversation-unavailable/,
  );
});
