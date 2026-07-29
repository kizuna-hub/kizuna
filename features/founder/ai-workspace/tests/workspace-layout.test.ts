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
