import assert from "node:assert/strict";
import test from "node:test";

import { createAiWorkspaceScenarioState } from "../demo/demo-scenarios";
import { createLongRunDemoState } from "../demo/demo-long-run-data";
import { aiWorkspaceReducer } from "../state/ai-workspace-reducer";
import {
  AI_WORKSPACE_STORAGE_VERSION,
  parseAiWorkspaceEnvelope,
  restoreLongRunSession,
  toPersistedSession,
} from "../state/ai-workspace-persistence";
import {
  getStaleMemoryItems,
  getVisibleConversationMessages,
  groupConversationSessions,
  longRunWorkspaceReducer,
} from "../state/long-run-workspace-reducer";

test("conversation sessions are grouped by activity and purpose", () => {
  const state = createLongRunDemoState("venture-a");
  const groups = groupConversationSessions(state);

  assert.equal(groups.today[0]?.id, "conversation-activation");
  assert.ok(
    groups.decisionCycles.some(
      (session) => session.id === "conversation-pricing",
    ),
  );
  assert.ok(
    groups.mentorSessions.some(
      (session) => session.id === "conversation-mentor",
    ),
  );
});

test("drafts remain isolated when switching conversations", () => {
  const initial = createLongRunDemoState("venture-a");
  const withActivationDraft = longRunWorkspaceReducer(initial, {
    type: "set-draft",
    conversationId: "conversation-activation",
    draft: "Bản nháp activation",
  });
  const withPricingDraft = longRunWorkspaceReducer(
    withActivationDraft,
    {
      type: "set-draft",
      conversationId: "conversation-pricing",
      draft: "Bản nháp pricing",
    },
  );

  assert.equal(
    withPricingDraft.draftsByConversation[
      "conversation-activation"
    ],
    "Bản nháp activation",
  );
  assert.equal(
    withPricingDraft.draftsByConversation[
      "conversation-pricing"
    ],
    "Bản nháp pricing",
  );
});

test("long-run state persists per venture and migrates a v1 envelope safely", () => {
  const ai = createAiWorkspaceScenarioState(
    "venture-a",
    "long-running",
  );
  const longRun = longRunWorkspaceReducer(
    createLongRunDemoState("venture-a"),
    {
      type: "set-draft",
      conversationId: "conversation-pricing",
      draft: "Giữ draft sau refresh",
    },
  );
  const envelope = parseAiWorkspaceEnvelope(
    JSON.stringify({
      version: AI_WORKSPACE_STORAGE_VERSION,
      sessions: {
        "venture-a": toPersistedSession(ai, longRun),
      },
    }),
  );
  assert.equal(
    restoreLongRunSession(
      "venture-a",
      envelope.sessions["venture-a"],
    ).draftsByConversation["conversation-pricing"],
    "Giữ draft sau refresh",
  );

  const legacy = parseAiWorkspaceEnvelope(
    JSON.stringify({
      version: 1,
      sessions: {
        "venture-a": {
          activeScenarioId: "bottleneck",
          readiness: ai.readiness,
          currentFocus: ai.currentFocus,
          evidenceHealth: ai.evidenceHealth,
          decisionCycle: ai.decisionCycle,
        },
      },
    }),
  );
  assert.equal(
    restoreLongRunSession(
      "venture-a",
      legacy.sessions["venture-a"],
    ).ventureId,
    "venture-a",
  );
});

test("long conversations load the latest page before older messages", () => {
  const initial = createLongRunDemoState("venture-a");
  const latest = getVisibleConversationMessages(initial);
  assert.equal(latest.length, 12);
  assert.equal(
    latest.at(-1)?.id,
    initial.messagesByConversation[
      initial.activeConversationId
    ].at(-1)?.id,
  );

  const expanded = longRunWorkspaceReducer(initial, {
    type: "load-older",
    conversationId: initial.activeConversationId,
  });
  assert.equal(
    getVisibleConversationMessages(expanded).length,
    22,
  );
});

test("memory status transitions retain history and AI inference is not verified automatically", () => {
  const initial = createLongRunDemoState("venture-a");
  assert.equal(
    initial.memory.find(
      (item) => item.id === "memory-target-incubator",
    )?.status,
    "inferred",
  );

  const disputed = longRunWorkspaceReducer(initial, {
    type: "set-memory-status",
    memoryId: "memory-target-incubator",
    status: "disputed",
    reason: "Founder chưa xác nhận buyer này.",
  });
  const item = disputed.memory.find(
    (candidate) =>
      candidate.id === "memory-target-incubator",
  );
  assert.equal(item?.status, "disputed");
  assert.equal(item?.history.at(-1)?.status, "disputed");
});

test("context resolution verifies one value and supersedes competing history", () => {
  const initial = createLongRunDemoState("venture-a");
  const resolved = longRunWorkspaceReducer(initial, {
    type: "resolve-conflict",
    conflictId: "conflict-target-customer",
    resolution: "set_current",
    valueId: "value-founders",
  });

  assert.equal(resolved.conflicts[0]?.status, "resolved");
  assert.equal(
    resolved.memory.find(
      (item) => item.id === "memory-founder-priority",
    )?.status,
    "verified",
  );
  assert.equal(
    resolved.memory.find(
      (item) => item.id === "memory-target-student",
    )?.status,
    "superseded",
  );
  assert.equal(
    resolved.timeline[0]?.type,
    "context_superseded",
  );
});

test("stale context detection includes expired and superseded information", () => {
  const initial = createLongRunDemoState("venture-a");
  const staleIds = getStaleMemoryItems(initial).map(
    (item) => item.id,
  );
  assert.ok(staleIds.includes("memory-mrr"));
  assert.ok(staleIds.includes("memory-team-size"));
  assert.ok(staleIds.includes("memory-pricing-model"));
});

test("summary confirmation and memory update are explicit transitions", () => {
  const initial = createLongRunDemoState("venture-a");
  const summaryId = initial.summaries[0].id;
  const confirmed = longRunWorkspaceReducer(initial, {
    type: "set-summary-status",
    summaryId,
    status: "confirmed",
  });
  assert.equal(confirmed.summaries[0].status, "confirmed");

  const memoryUpdated = longRunWorkspaceReducer(confirmed, {
    type: "set-summary-status",
    summaryId,
    status: "memory_updated",
  });
  assert.equal(
    memoryUpdated.summaries[0].status,
    "memory_updated",
  );
  assert.equal(
    memoryUpdated.memory
      .find(
        (item) => item.id === "memory-activation-priority",
      )
      ?.history.at(-1)?.reason,
    "Founder xác nhận cập nhật từ tóm tắt phiên làm việc.",
  );
});

test("duplicate readiness events and duplicate conversations are ignored", () => {
  const initial = createLongRunDemoState("venture-a");
  const duplicateReadiness = longRunWorkspaceReducer(initial, {
    type: "append-readiness-change",
    change: initial.readinessHistory[0],
  });
  assert.equal(
    duplicateReadiness.readinessHistory.length,
    initial.readinessHistory.length,
  );

  const duplicateConversation = longRunWorkspaceReducer(initial, {
    type: "create-conversation",
    session: initial.sessions[0],
    messages: [],
  });
  assert.equal(duplicateConversation, initial);
});

test("duplicate evidence submission is idempotent", () => {
  const initial = createAiWorkspaceScenarioState(
    "venture-a",
    "decision-cycle",
  );
  const submitted = aiWorkspaceReducer(initial, {
    type: "submit-cycle-evidence",
  });
  const submittedAgain = aiWorkspaceReducer(submitted, {
    type: "submit-cycle-evidence",
  });

  assert.equal(submittedAgain, submitted);
  assert.equal(
    submittedAgain.readiness.supportedBy.filter((item) =>
      item.includes("Cohort onboarding"),
    ).length,
    1,
  );
});

test("deleting a source preserves history and marks dependent memory missing", () => {
  const initial = createLongRunDemoState("venture-a");
  const removed = longRunWorkspaceReducer(initial, {
    type: "remove-material",
    materialId: "material-pitch-v3",
  });

  assert.equal(
    removed.materialVersions.some(
      (material) => material.id === "material-pitch-v3",
    ),
    false,
  );
  assert.equal(
    removed.memory.find(
      (item) => item.id === "memory-target-student",
    )?.status,
    "missing",
  );
});
