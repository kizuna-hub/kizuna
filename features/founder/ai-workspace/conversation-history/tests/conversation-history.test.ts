import assert from "node:assert/strict";
import test from "node:test";

import { createLongRunDemoState } from "../../demo/demo-long-run-data";
import { longRunWorkspaceReducer } from "../../state/long-run-workspace-reducer";
import {
  CAMPUSFLOW_MENTOR_CONVERSATION_IDS,
  ensureCampusFlowMentorConversationHistory,
} from "../data/mentor-conversation-session-seed";
import {
  filterMentorConversationSessions,
  getConversationHistoryPaneMode,
  selectMentorConversationSessions,
} from "../services/conversation-session-selector";

test("maps every history type to its contextual secondary pane", () => {
  assert.deepEqual(
    [
      "mentor_matching",
      "mentor_profile",
      "mentor_comparison",
      "session_preparation",
      "mentor_questions",
    ].map((type) =>
      getConversationHistoryPaneMode(
        type as Parameters<typeof getConversationHistoryPaneMode>[0],
      ),
    ),
    [
      "mentor_fit",
      "mentor_sources",
      "mentor_comparison",
      "session_preparation",
      "mentor_questions",
    ],
  );
});

test("seeds exactly five stable mentor-history sessions idempotently", () => {
  const initial = createLongRunDemoState("venture-campusflow");
  const sessions = selectMentorConversationSessions(
    initial.sessions,
  );
  assert.equal(sessions.length, 5);
  assert.deepEqual(
    [...sessions.map((session) => session.id)].sort(),
    [...CAMPUSFLOW_MENTOR_CONVERSATION_IDS].sort(),
  );

  const restored = ensureCampusFlowMentorConversationHistory(initial);
  assert.equal(
    restored.sessions.length,
    initial.sessions.length,
    "refresh must not duplicate session metadata",
  );
  assert.equal(
    Object.keys(restored.messagesByConversation).length,
    Object.keys(initial.messagesByConversation).length,
    "refresh must not duplicate transcripts",
  );
});

test("does not leak CampusFlow sessions into another venture", () => {
  const state = createLongRunDemoState("venture-snapmoney");
  assert.equal(selectMentorConversationSessions(state.sessions).length, 0);
  assert.equal(state.conversationSources.length, 0);
});

test("search is Vietnamese-friendly and covers title, mentor, preview, venture, and category", () => {
  const sessions = createLongRunDemoState(
    "venture-campusflow",
  ).sessions;
  assert.equal(
    filterMentorConversationSessions(
      sessions,
      "tran minh quan",
      "all",
    ).length,
    4,
  );
  assert.equal(
    filterMentorConversationSessions(
      sessions,
      "nguon xac minh",
      "all",
    )[0]?.historyType,
    "mentor_profile",
  );
  assert.equal(
    filterMentorConversationSessions(
      sessions,
      "CampusFlow",
      "mentor_comparison",
    )[0]?.historyType,
    "mentor_comparison",
  );
  assert.equal(
    filterMentorConversationSessions(
      sessions,
      "không tồn tại",
      "all",
    ).length,
    0,
  );
  for (const type of [
    "mentor_matching",
    "mentor_profile",
    "mentor_comparison",
    "session_preparation",
    "mentor_questions",
  ] as const) {
    assert.equal(
      filterMentorConversationSessions(sessions, "", type).length,
      1,
    );
  }
});

test("pinning a session moves it ahead of newer unpinned sessions", () => {
  const initial = createLongRunDemoState("venture-campusflow");
  const oldestId = CAMPUSFLOW_MENTOR_CONVERSATION_IDS[4];
  const withoutInitialPin = longRunWorkspaceReducer(initial, {
    type: "toggle-conversation-pin",
    conversationId: CAMPUSFLOW_MENTOR_CONVERSATION_IDS[0],
  });
  const pinned = longRunWorkspaceReducer(withoutInitialPin, {
    type: "toggle-conversation-pin",
    conversationId: oldestId,
  });
  assert.equal(
    selectMentorConversationSessions(pinned.sessions)[0]?.id,
    oldestId,
  );
});

test("all five scripted conversations contain the required mentor jobs", () => {
  const state = createLongRunDemoState("venture-campusflow");
  const transcript = (id: string) =>
    (state.messagesByConversation[id] ?? [])
      .map((message) => message.content)
      .join(" ");

  assert.match(
    transcript(CAMPUSFLOW_MENTOR_CONVERSATION_IDS[0]),
    /matching do Kizuna suy luận/i,
  );
  assert.match(
    transcript(CAMPUSFLOW_MENTOR_CONVERSATION_IDS[1]),
    /bốn nhóm/i,
  );
  assert.match(
    transcript(CAMPUSFLOW_MENTOR_CONVERSATION_IDS[2]),
    /hai loại quyết định/i,
  );
  assert.match(
    transcript(CAMPUSFLOW_MENTOR_CONVERSATION_IDS[3]),
    /AGENDA ĐỀ XUẤT · 45 PHÚT/i,
  );
  assert.match(
    transcript(CAMPUSFLOW_MENTOR_CONVERSATION_IDS[4]),
    /PHẠM VI PILOT/i,
  );
  for (const id of CAMPUSFLOW_MENTOR_CONVERSATION_IDS) {
    assert.doesNotMatch(transcript(id), /readiness|65\/100/i);
  }
});

test("mentor source provenance never fabricates a public URL", () => {
  const state = createLongRunDemoState("venture-campusflow");
  const publicSource = state.conversationSources.find(
    (source) => source.provenance === "public_source",
  );
  const inference = state.conversationSources.find(
    (source) => source.provenance === "kizuna_inference",
  );
  assert.equal(publicSource?.verificationStatus, "unverified");
  assert.equal(publicSource?.href, undefined);
  assert.equal(inference?.verificationStatus, "inferred");
});

test("syncing a new message updates only the selected session preview", () => {
  const initial = createLongRunDemoState("venture-campusflow");
  const selectedId = CAMPUSFLOW_MENTOR_CONVERSATION_IDS[0];
  const untouchedId = CAMPUSFLOW_MENTOR_CONVERSATION_IDS[1];
  const untouched = initial.sessions.find(
    (session) => session.id === untouchedId,
  );
  const next = longRunWorkspaceReducer(initial, {
    type: "sync-messages",
    conversationId: selectedId,
    messages: [
      ...(initial.messagesByConversation[selectedId] ?? []),
      {
        id: "history-new-follow-up",
        role: "founder",
        content: "Giúp mình chọn một success metric chính.",
        createdAt: "2026-08-04T10:00:00.000Z",
        status: "complete",
      },
    ],
  });
  assert.equal(
    next.sessions.find((session) => session.id === selectedId)
      ?.preview,
    "Giúp mình chọn một success metric chính.",
  );
  assert.deepEqual(
    next.sessions.find((session) => session.id === untouchedId),
    untouched,
  );
});

test("existing historical context wins over a later seed refresh", () => {
  const initial = createLongRunDemoState("venture-campusflow");
  const selectedId = CAMPUSFLOW_MENTOR_CONVERSATION_IDS[0];
  const changed = {
    ...initial,
    sessions: initial.sessions.map((session) =>
      session.id === selectedId && session.contextSnapshot
        ? {
            ...session,
            contextSnapshot: {
              ...session.contextSnapshot,
              ventureStage: "Pilot",
            },
          }
        : session,
    ),
  };
  const restored = ensureCampusFlowMentorConversationHistory(changed);
  assert.equal(
    restored.sessions.find((session) => session.id === selectedId)
      ?.contextSnapshot?.ventureStage,
    "Pilot",
  );
});

test("seed refresh preserves an existing transcript verbatim", () => {
  const initial = createLongRunDemoState("venture-campusflow");
  const selectedId = CAMPUSFLOW_MENTOR_CONVERSATION_IDS[0];
  const editedMessages = initial.messagesByConversation[selectedId].map(
    (message, index) =>
      index === 0
        ? { ...message, content: "Nội dung founder đã lưu trước đó." }
        : message,
  );
  const restored = ensureCampusFlowMentorConversationHistory({
    ...initial,
    messagesByConversation: {
      ...initial.messagesByConversation,
      [selectedId]: editedMessages,
    },
  });
  assert.deepEqual(
    restored.messagesByConversation[selectedId],
    editedMessages,
  );
});
