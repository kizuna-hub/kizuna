"use client";

import type { useAiWorkspace } from "../../hooks/use-ai-workspace";
import { MentorConnectionPane } from "../../mentor-connection/components/mentor-connection-pane";
import { MentorFitDetailPane } from "../../mentor-recommendation/components/mentor-fit-detail-pane";
import { ConversationHistoryContextPanel } from "../../conversation-history/components/conversation-history-context-panel";
import { MentorshipContinuityPane } from "../../mentorship-continuity/components/mentorship-continuity-pane";
import { AnalysisPane } from "../analysis/analysis-pane";
import { PanelChatView } from "../conversation/panel-chat-view";
import { EvidencePane } from "../evidence/evidence-pane";

type Workspace = ReturnType<typeof useAiWorkspace>;

export function SecondaryPane({
  workspace,
  showClose = true,
}: {
  workspace: Workspace;
  showClose?: boolean;
}) {
  switch (workspace.layout.secondaryPaneMode) {
    case "analysis":
      return (
        <AnalysisPane
          workspace={workspace}
          showClose={showClose}
        />
      );
    case "evidence":
      return (
        <EvidencePane
          workspace={workspace}
          showClose={showClose}
        />
      );
    case "panel_chat":
      return (
        <PanelChatView
          workspace={workspace}
          showClose={showClose}
        />
      );
    case "mentor_fit":
      return <MentorFitDetailPane workspace={workspace} />;
    case "mentor_connection":
      return (
        <MentorConnectionPane
          workspace={workspace}
          showClose={showClose}
        />
      );
    case "mentor_sources":
    case "mentor_comparison":
    case "session_preparation":
    case "mentor_questions":
      return (
        <ConversationHistoryContextPanel workspace={workspace} />
      );
    case "checkpoint_capture":
    case "checkpoint_update":
    case "checkpoint_detail":
    case "pre_read":
      return <MentorshipContinuityPane workspace={workspace} />;
    case "closed":
      return null;
  }
}
