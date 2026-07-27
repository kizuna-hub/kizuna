import assert from "node:assert/strict";
import test from "node:test";

import { createLongRunDemoState } from "../demo/demo-long-run-data";
import { createMockVentureSearchService } from "../demo/mock-venture-search-service";
import { createContextAssemblyService } from "../services/context-assembly-service";
import { compareContextUpdateVersions } from "../services/context-update-guard";
import { findConversationMessageMatches } from "../services/conversation-search";
import { isScopedRequestCurrent } from "../services/scoped-request";
import type { VentureSearchFilters } from "../types/long-run-workspace.types";

const filters: VentureSearchFilters = {
  contentType: "all",
  dateRange: "all",
  decisionCycleId: "all",
  status: "all",
  contributor: "all",
  pinnedOnly: false,
};

test("semantic pricing aliases resolve decisions, evidence, messages, documents, and mentor advice", async () => {
  const state = createLongRunDemoState("venture-a");
  const service = createMockVentureSearchService(() => state);
  const results = await service.search({
    ventureId: "venture-a",
    query: "pricing",
    filters,
  });
  const types = new Set(
    results.map((result) => result.contentType),
  );

  assert.ok(types.has("decision"));
  assert.ok(types.has("evidence"));
  assert.ok(types.has("conversation"));
  assert.ok(types.has("document"));
  assert.ok(types.has("mentor_session"));
});

test("current-conversation search remains local to the active message list", () => {
  const state = createLongRunDemoState("venture-a");
  const activation =
    state.messagesByConversation["conversation-activation"];
  const pricing =
    state.messagesByConversation["conversation-pricing"];

  assert.ok(
    findConversationMessageMatches(activation, "cohort").length >
      1,
  );
  assert.equal(
    findConversationMessageMatches(pricing, "cohort").length,
    0,
  );
});

test("search filters by status and never crosses venture scope", async () => {
  const state = createLongRunDemoState("venture-a");
  const service = createMockVentureSearchService(() => state);
  const verified = await service.search({
    ventureId: "venture-a",
    query: "",
    filters: { ...filters, status: "verified" },
  });
  assert.ok(
    verified.every(
      (result) =>
        result.status === undefined ||
        result.status === "verified",
    ),
  );

  const otherVenture = await service.search({
    ventureId: "venture-b",
    query: "pricing",
    filters,
  });
  assert.deepEqual(otherVenture, []);
});

test("context assembly selects recent relevant state and excludes stale memory", () => {
  const state = createLongRunDemoState("venture-a");
  const service = createContextAssemblyService(() => state);
  const result = service.buildContext({
    ventureId: "venture-a",
    conversationId: "conversation-activation",
    query: "activation",
    selectedSourceIds: ["material-pitch-v5"],
  });

  assert.equal(result.recentMessages.length, 6);
  assert.ok(result.confirmedMemory.length > 0);
  assert.equal(result.selectedDocuments[0]?.id, "material-pitch-v5");
  assert.ok(
    result.excludedItems.some(
      (item) => item.id === "memory-mrr",
    ),
  );
});

test("scoped request guard rejects another venture, conversation, request, or state version", () => {
  const expected = {
    requestId: "request-1",
    ventureId: "venture-a",
    conversationId: "conversation-a",
    stateVersion: 3,
  };
  assert.equal(isScopedRequestCurrent(expected, expected), true);
  assert.equal(
    isScopedRequestCurrent(expected, {
      ...expected,
      ventureId: "venture-b",
    }),
    false,
  );
  assert.equal(
    isScopedRequestCurrent(expected, {
      ...expected,
      conversationId: "conversation-b",
    }),
    false,
  );
  assert.equal(
    isScopedRequestCurrent(expected, {
      ...expected,
      stateVersion: 4,
    }),
    false,
  );
});

test("context update guard blocks stale confirmations without mutating either version", () => {
  const current = compareContextUpdateVersions(8, 8);
  assert.equal(current.status, "current");

  const conflict = compareContextUpdateVersions(8, 9);
  assert.equal(conflict.status, "conflict");
  assert.equal(conflict.expectedVersion, 8);
  assert.equal(conflict.currentVersion, 9);
});
