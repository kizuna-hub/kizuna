"use client";

import type { useAiWorkspace } from "../../hooks/use-ai-workspace";
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
    case "closed":
      return null;
  }
}
