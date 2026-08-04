"use client";

import type { useAiWorkspace } from "../../hooks/use-ai-workspace";
import { CheckpointCapturePane } from "./checkpoint-capture-pane";
import { CheckpointDetailPane } from "./checkpoint-detail-pane";
import { CheckpointResultPane } from "./checkpoint-result-pane";
import { MentorshipPreReadPane } from "./mentorship-pre-read-pane";

type Workspace = ReturnType<typeof useAiWorkspace>;

export function MentorshipContinuityPane({ workspace }: { workspace: Workspace }) {
  switch (workspace.layout.secondaryPaneMode) {
    case "checkpoint_capture":
      return <CheckpointCapturePane workspace={workspace} />;
    case "checkpoint_update":
      return <CheckpointResultPane workspace={workspace} />;
    case "checkpoint_detail":
      return <CheckpointDetailPane workspace={workspace} />;
    case "pre_read":
      return <MentorshipPreReadPane workspace={workspace} />;
    default:
      return null;
  }
}
