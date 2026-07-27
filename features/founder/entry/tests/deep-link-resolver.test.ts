import assert from "node:assert/strict";
import test from "node:test";

import { createDemoWorkspaceSeed } from "../../venture-foundation/demo-seed";
import { resolveFounderDeepLink } from "../services/deep-link-resolver";

const ventureId = "venture-kizuna-hub";
const workspace = `/founder/projects/${ventureId}/workspace`;

test("workspace, conversation, cycle, document, analysis and memory links resolve", () => {
  const state = createDemoWorkspaceSeed();
  const hrefs = [
    workspace,
    `${workspace}?conversation=conversation-activation`,
    `${workspace}?view=decision-cycle&cycle=cycle-kizuna-buyer-validation`,
    `${workspace}?surface=documents&document=material-pitch-v5`,
    `${workspace}?surface=documents&analysis=analysis-pitch-v5`,
    `${workspace}?surface=memory&memory=memory-activation-priority`,
    `${workspace}?conversation=conversation-mentor&session=mentor-session-growth`,
  ];

  hrefs.forEach((href) => {
    const resolution = resolveFounderDeepLink(href, state);
    assert.equal(resolution?.status, "valid", href);
    assert.equal(resolution?.href, href);
  });
});

test("evidence and opportunity links validate canonical collections", () => {
  const state = createDemoWorkspaceSeed();
  const evidence = state.evidence.find(
    (item) => item.ventureId === ventureId,
  );
  assert.ok(evidence);
  const evidenceResolution = resolveFounderDeepLink(
    `/founder/projects/${ventureId}/evidence?evidence=${evidence.id}`,
    state,
  );
  assert.equal(evidenceResolution?.status, "valid");

  const opportunity = state.opportunities[0];
  assert.ok(opportunity);
  const opportunityResolution = resolveFounderDeepLink(
    `/founder/opportunities?opportunity=${opportunity.id}`,
    state,
  );
  assert.equal(opportunityResolution?.status, "valid");
});

test("unknown target in an accessible venture returns venture fallback", () => {
  const resolution = resolveFounderDeepLink(
    `${workspace}?memory=memory-missing`,
    createDemoWorkspaceSeed(),
  );
  assert.equal(resolution?.status, "target-unavailable");
  assert.equal(
    resolution?.href,
    `${workspace}?notice=target-unavailable`,
  );
});

test("unknown or archived venture returns access-safe Hub fallback", () => {
  const state = createDemoWorkspaceSeed();
  const missing = resolveFounderDeepLink(
    "/founder/projects/venture-secret/workspace",
    state,
  );
  assert.equal(missing?.status, "access-denied");
  assert.equal(missing?.href, "/founder/home?notice=access-denied");

  state.ventures[0].status = "archived";
  const archived = resolveFounderDeepLink(workspace, state);
  assert.equal(archived?.status, "access-denied");
});

