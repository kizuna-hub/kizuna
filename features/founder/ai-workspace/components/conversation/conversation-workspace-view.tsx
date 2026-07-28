"use client";

import { Database, X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ChatComposer } from "../chat/chat-composer";
import { ConversationThread } from "../chat/conversation-thread";
import { aiWorkspaceVi } from "../../copy/vi";
import { useAiWorkspace } from "../../hooks/use-ai-workspace";
import { createPinReference } from "../../services/pin-reference";
import type { AiWorkspaceMessage } from "../../types/ai-workspace.types";
import type { ReadinessCriterionId } from "../../readiness/types/readiness.types";
import { ConversationSearch } from "./conversation-search";
import { TopicDriftSuggestion } from "./topic-drift-suggestion";

type AiWorkspaceController = ReturnType<typeof useAiWorkspace>;

export function ConversationWorkspaceView({
  workspace,
  generating,
  composerFocusKey,
  searchOpen,
  searchQuery,
  activeMatchIndex,
  matchCount,
  activeMatchMessageId,
  pinnedSourceIds,
  topicDriftDismissed,
  requestedScroll,
  onSearchQueryChange,
  onPreviousMatch,
  onNextMatch,
  onCloseSearch,
  onDismissTopicDrift,
  onOpenMentor,
  onOpenArtifact,
  onOpenReadiness,
}: {
  workspace: AiWorkspaceController;
  generating: boolean;
  composerFocusKey?: number;
  searchOpen: boolean;
  searchQuery: string;
  activeMatchIndex: number;
  matchCount: number;
  activeMatchMessageId?: string;
  pinnedSourceIds: string[];
  topicDriftDismissed: boolean;
  requestedScroll?: { id: number; top: number };
  onSearchQueryChange: (query: string) => void;
  onPreviousMatch: () => void;
  onNextMatch: () => void;
  onCloseSearch: () => void;
  onDismissTopicDrift: () => void;
  onOpenMentor: () => void;
  onOpenArtifact: (
    surface: "documents" | "timeline",
  ) => void;
  onOpenReadiness: (criterionId?: ReadinessCriterionId) => void;
}) {
  const copy = aiWorkspaceVi;
  const { state, longRun } = workspace;

  if (!workspace.activeSession) return null;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      {searchOpen ? (
        <div className="absolute inset-x-2 top-2 z-overlay mx-auto max-w-2xl">
          <ConversationSearch
            query={searchQuery}
            activeIndex={activeMatchIndex}
            total={matchCount}
            copy={copy.longRun.conversation}
            onQueryChange={onSearchQueryChange}
            onPrevious={onPreviousMatch}
            onNext={onNextMatch}
            onClose={onCloseSearch}
            floating
          />
        </div>
      ) : null}

      {state.activeScenarioId === "search-pricing" &&
      !topicDriftDismissed ? (
        <div className="px-1 pt-3 sm:px-2">
          <TopicDriftSuggestion
            copy={copy.longRun.conversation}
            onCreateConversation={() => {
              workspace.createConversation(
                "Chiến lược định giá",
              );
              onDismissTopicDrift();
            }}
            onContinue={onDismissTopicDrift}
          />
        </div>
      ) : null}

      <ConversationThread
        key={longRun.activeConversationId}
        state={state}
        messages={workspace.visibleMessages}
        searchQuery={searchQuery}
        activeMatchMessageId={activeMatchMessageId}
        pinnedSourceIds={pinnedSourceIds}
        hasOlderMessages={workspace.hasOlderMessages}
        initialScrollTop={
          longRun.scrollTopByConversation[
            longRun.activeConversationId
          ]
        }
        copy={copy}
        onLoadOlder={workspace.loadOlderMessages}
        onSaveScrollPosition={workspace.saveScrollPosition}
        requestedScroll={requestedScroll}
        onToggleMessagePin={(message: AiWorkspaceMessage) =>
          workspace.togglePin(
            createPinReference(
              longRun.ventureId,
              message.id,
              message.content.slice(0, 80),
              workspace.activeSession?.title ??
                copy.longRun.sidebar.newConversation,
              "message",
            ),
          )
        }
        onOpenCycle={() =>
          workspace.setView("decision-cycle")
        }
        onSendPrompt={(prompt) =>
          void workspace.sendMessage(prompt)
        }
        onConfirmActionProposal={
          workspace.confirmActionProposal
        }
        onRetry={() => void workspace.retryLastRequest()}
        onEditFailedMessage={workspace.editFailedMessage}
        onDeleteFailedMessage={
          workspace.deleteFailedMessage
        }
        onOpenMentor={onOpenMentor}
        onDeferMentor={workspace.deferMentor}
        onOpenArtifact={onOpenArtifact}
        onOpenReadiness={onOpenReadiness}
        onVerifyReadinessEvidence={
          workspace.verifyReadinessEvidence
        }
      />

      <div className="w-full px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
        <div className="mx-auto w-full max-w-2xl">
          {workspace.selectedContextSourceIds.length > 0 ? (
            <div className="mb-2 flex items-start gap-2 rounded-lg border border-primary-border bg-primary-soft p-2">
              <Database className="mt-0.5 size-3.5 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="workspace-meta font-medium text-ink">
                  {copy.longRun.conversation.contextSources}
                </p>
                <p className="workspace-meta text-workspace-muted-text">
                  {workspace.contextPreview.humanReadableSources.join(
                    " · ",
                  )}
                </p>
              </div>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                onClick={workspace.clearScopedContext}
                aria-label={copy.longRun.common.close}
              >
                <X className="size-3.5" />
              </Button>
            </div>
          ) : null}
          <ChatComposer
            focusRequestKey={composerFocusKey}
            value={workspace.draft}
            onValueChange={workspace.setDraft}
            prompts={state.suggestedPrompts}
            attachments={state.attachments}
            disabled={generating}
            copy={copy}
            onSend={(message) =>
              void workspace.sendMessage(message)
            }
            onSelectSample={workspace.addSampleAttachment}
            onSelectFiles={workspace.addLocalFiles}
            onRemoveAttachment={workspace.removeAttachment}
            selectedModel={state.selectedModel}
            onModelChange={workspace.setAiModel}
          />
        </div>
      </div>
    </div>
  );
}
