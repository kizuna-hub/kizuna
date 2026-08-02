"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { aiWorkspaceVi } from "../../copy/vi";
import type { useAiWorkspace } from "../../hooks/use-ai-workspace";
import { ChatComposer } from "../chat/chat-composer";
import { ConversationThread } from "../chat/conversation-thread";

type Workspace = ReturnType<typeof useAiWorkspace>;

export function PanelChatView({
  workspace,
  showClose = true,
}: {
  workspace: Workspace;
  showClose?: boolean;
}) {
  const conversation = workspace.panelConversation;
  if (!conversation) return null;

  const panelState = {
    ...workspace.state,
    messages: workspace.panelMessages,
    attachments: workspace.panelAttachments,
    generationStatus: workspace.panelGenerating
      ? ("typing" as const)
      : ("idle" as const),
    lastRequest: workspace.panelGenerating
      ? {
          message: workspace.panelMessages.at(-1)?.content ?? "",
          retryAttempt: 0,
        }
      : undefined,
  };

  return (
    <aside
      className="flex h-full min-h-0 flex-col bg-workspace-background"
      aria-label={`Chat song song: ${conversation.title}`}
    >
      <div className="flex h-11 shrink-0 items-center justify-end px-4">
        {showClose ? (
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={workspace.closeSecondaryPane}
            aria-label="Đóng chat song song"
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </div>

      <ConversationThread
        key={`panel-${conversation.id}`}
        state={panelState}
        messages={workspace.panelMessages}
        copy={aiWorkspaceVi}
        onOpenCycle={() => workspace.setView("decision-cycle")}
        onSendPrompt={(prompt) =>
          void workspace.sendPanelMessage(prompt)
        }
        onConfirmActionProposal={() => undefined}
        onRetry={() => undefined}
        onOpenMentor={workspace.openMentorFit}
        onConnectMentor={workspace.openMentorConnection}
        onToggleSaveMentor={workspace.toggleSaveMentor}
        onOpenArtifact={() => workspace.openEvidence()}
        onOpenReadiness={(criterionId) => {
          workspace.setSelectedCriterion(criterionId);
          workspace.openAnalysis("readiness");
        }}
        onVerifyReadinessEvidence={() => undefined}
      />

      <div className="w-full shrink-0 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
        <div className="mx-auto w-full max-w-2xl">
          <ChatComposer
            idPrefix={`panel-${conversation.id}`}
            value={workspace.panelDraft}
            onValueChange={workspace.setPanelDraft}
            prompts={workspace.state.suggestedPrompts}
            attachments={workspace.panelAttachments}
            disabled={workspace.panelGenerating}
            copy={aiWorkspaceVi}
            onSend={(message) =>
              void workspace.sendPanelMessage(message)
            }
            onSelectSample={() => undefined}
            onSelectFiles={workspace.addPanelLocalFiles}
            onRemoveAttachment={workspace.removePanelAttachment}
            selectedModel={workspace.state.selectedModel}
            onModelChange={workspace.setAiModel}
          />
        </div>
      </div>
    </aside>
  );
}
