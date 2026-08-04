import assert from "node:assert/strict";
import test from "node:test";

import {
  createWorkspaceLayoutState,
  restoreWorkspaceLayout,
  workspaceLayoutReducer,
} from "../state/workspace-layout-reducer";
import { createLongRunDemoState } from "../demo/demo-long-run-data";
import { longRunWorkspaceReducer } from "../state/long-run-workspace-reducer";

test("workspace exposes exactly one optional secondary pane mode", () => {
  const initial = createWorkspaceLayoutState();
  assert.equal(initial.destination, "conversation_history");
  assert.equal(
    initial.conversationHistoryView,
    "session_library",
  );
  const discovery = workspaceLayoutReducer(initial, {
    type: "set-destination",
    destination: "mentor_discovery",
  });
  assert.equal(discovery.destination, "mentor_discovery");
  assert.equal(
    workspaceLayoutReducer(discovery, {
      type: "set-destination",
      destination: "mentor_discovery",
    }),
    discovery,
    "reapplying the URL destination must not create a render loop",
  );
  const analysis = workspaceLayoutReducer(initial, {
    type: "open-analysis",
    tab: "readiness",
  });
  assert.equal(analysis.secondaryPaneMode, "analysis");
  assert.equal(analysis.analysisTab, "readiness");

  const evidence = workspaceLayoutReducer(analysis, {
    type: "open-evidence",
    view: "by_criterion",
  });
  assert.equal(evidence.secondaryPaneMode, "evidence");
  assert.equal(evidence.evidenceView, "by_criterion");

  const mentorFit = workspaceLayoutReducer(evidence, {
    type: "open-mentor-fit",
    mentorId: "mentor-tran-minh-quan",
  });
  assert.equal(mentorFit.secondaryPaneMode, "mentor_fit");
  assert.equal(
    mentorFit.selectedMentorId,
    "mentor-tran-minh-quan",
  );

  const mentorConnection = workspaceLayoutReducer(mentorFit, {
    type: "open-mentor-connection",
    mentorId: "mentor-tran-minh-quan",
  });
  assert.equal(
    mentorConnection.secondaryPaneMode,
    "mentor_connection",
  );
  assert.equal(mentorConnection.secondaryPaneWidth, 42);
  assert.equal(
    mentorConnection.selectedMentorId,
    "mentor-tran-minh-quan",
  );

  const panel = workspaceLayoutReducer(mentorConnection, {
    type: "open-panel-chat",
    conversationId: "panel-chat",
  });
  assert.equal(panel.secondaryPaneMode, "panel_chat");
  assert.equal(panel.secondaryPaneWidth, 50);
  assert.equal(panel.panelConversationId, "panel-chat");

  const closed = workspaceLayoutReducer(panel, {
    type: "close-secondary-pane",
  });
  assert.equal(closed.secondaryPaneMode, "closed");
  assert.equal(closed.panelConversationId, "panel-chat");
});

test("conversation history detail returns to the library without losing library state", () => {
  const initial = createWorkspaceLayoutState();
  const searched = workspaceLayoutReducer(initial, {
    type: "set-conversation-history-search",
    query: "anh Quân",
  });
  const filtered = workspaceLayoutReducer(searched, {
    type: "set-conversation-history-filter",
    filter: "mentor_matching",
  });
  const scrolled = workspaceLayoutReducer(filtered, {
    type: "save-conversation-history-scroll",
    scrollTop: 288,
  });
  const detail = workspaceLayoutReducer(scrolled, {
    type: "open-conversation-history-session",
    sessionId: "campusflow-mentor-priority-tran-minh-quan",
    secondaryPaneMode: "mentor_fit",
    mentorId: "mentor-tran-minh-quan",
  });
  assert.equal(detail.conversationHistoryView, "session_detail");
  assert.equal(detail.secondaryPaneMode, "mentor_fit");
  assert.equal(
    workspaceLayoutReducer(detail, {
      type: "open-conversation-history-session",
      sessionId: "campusflow-mentor-priority-tran-minh-quan",
      secondaryPaneMode: "mentor_fit",
      mentorId: "mentor-tran-minh-quan",
    }),
    detail,
    "reopening an equivalent session must be idempotent",
  );

  const library = workspaceLayoutReducer(detail, {
    type: "show-conversation-history-library",
  });
  assert.equal(library.conversationHistoryView, "session_library");
  assert.equal(library.secondaryPaneMode, "closed");
  assert.equal(library.conversationHistorySearch, "anh Quân");
  assert.equal(
    library.conversationHistoryFilter,
    "mentor_matching",
  );
  assert.equal(library.conversationHistoryScrollTop, 288);
});

test("workspace destination is restored only from supported values", () => {
  assert.equal(
    restoreWorkspaceLayout({
      destination: "mentorship_continuity",
      secondaryPaneMode: "checkpoint_detail",
      selectedCheckpointId: "mentorship-campusflow-checkpoint-2",
    }).destination,
    "mentorship_continuity",
  );
  assert.equal(
    restoreWorkspaceLayout({
      destination: "connection_requests",
    }).destination,
    "connection_requests",
  );
  assert.equal(
    restoreWorkspaceLayout({
      destination: "invalid" as "mentor_discovery",
    }).destination,
    "conversation_history",
  );
});

test("mentorship panels preserve the active destination and checkpoint", () => {
  const destination = workspaceLayoutReducer(
    createWorkspaceLayoutState(),
    {
      type: "set-destination",
      destination: "mentorship_continuity",
    },
  );
  const detail = workspaceLayoutReducer(destination, {
    type: "open-mentorship-panel",
    mode: "checkpoint_detail",
    checkpointId: "checkpoint-2",
  });
  assert.equal(detail.destination, "mentorship_continuity");
  assert.equal(detail.secondaryPaneMode, "checkpoint_detail");
  assert.equal(detail.selectedCheckpointId, "checkpoint-2");
  const closed = workspaceLayoutReducer(detail, {
    type: "close-secondary-pane",
  });
  assert.equal(closed.destination, "mentorship_continuity");
  assert.equal(closed.selectedCheckpointId, "checkpoint-2");
});

test("secondary pane width is clamped and restored", () => {
  assert.equal(
    restoreWorkspaceLayout({ secondaryPaneWidth: 42 })
      .secondaryPaneWidth,
    42,
  );
  assert.equal(
    restoreWorkspaceLayout({ secondaryPaneWidth: 80 })
      .secondaryPaneWidth,
    55,
  );
  assert.equal(
    restoreWorkspaceLayout({ secondaryPaneWidth: 10 })
      .secondaryPaneWidth,
    24,
  );

  const current = restoreWorkspaceLayout({
    secondaryPaneWidth: 38,
  });
  assert.equal(
    workspaceLayoutReducer(current, {
      type: "set-secondary-pane-width",
      width: 38.04,
    }),
    current,
    "layout callbacks must not create a render loop for equivalent widths",
  );
});

test("creating a panel conversation does not replace the main conversation", () => {
  const initial = createLongRunDemoState("campusflow");
  const next = longRunWorkspaceReducer(initial, {
    type: "create-conversation",
    activate: false,
    session: {
      id: "conversation-panel",
      ventureId: "campusflow",
      title: "Chat song song",
      category: "general",
      createdAt: "2026-07-28T00:00:00.000Z",
      updatedAt: "2026-07-28T00:00:00.000Z",
      isPinned: false,
      isArchived: false,
      summaryStatus: "none",
    },
    messages: [],
  });
  assert.equal(
    next.activeConversationId,
    initial.activeConversationId,
  );
  assert.ok(next.messagesByConversation["conversation-panel"]);
  assert.deepEqual(
    next.attachmentsByConversation["conversation-panel"],
    [],
  );
});
