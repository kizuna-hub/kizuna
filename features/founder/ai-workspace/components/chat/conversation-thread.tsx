"use client";

import { AlertTriangle, Bot } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";

import type { AiWorkspaceCopy } from "../../copy/types";
import { useAutoScroll } from "../../hooks/use-auto-scroll";
import type {
  AiWorkspaceMessage,
  AiWorkspaceState,
} from "../../types/ai-workspace.types";
import { ChatMessage } from "./chat-message";
import { TypingIndicator } from "./typing-indicator";

export function ConversationThread({
  state,
  copy,
  onOpenCycle,
  onSendPrompt,
  onConfirmActionProposal,
  onRetry,
  onEditFailedMessage,
  onDeleteFailedMessage,
  onOpenMentor,
  onDeferMentor,
  onOpenArtifact,
  messages,
  searchQuery = "",
  activeMatchMessageId,
  pinnedSourceIds = [],
  hasOlderMessages = false,
  initialScrollTop = 0,
  onLoadOlder,
  onToggleMessagePin,
  onSaveScrollPosition,
  requestedScroll,
}: {
  state: AiWorkspaceState;
  copy: AiWorkspaceCopy;
  onOpenCycle: () => void;
  onSendPrompt: (prompt: string) => void;
  onConfirmActionProposal: (messageId: string) => void;
  onRetry: () => void;
  onEditFailedMessage?: (messageId: string) => void;
  onDeleteFailedMessage?: (messageId: string) => void;
  onOpenMentor: () => void;
  onDeferMentor: () => void;
  onOpenArtifact: (
    surface: "documents" | "timeline",
  ) => void;
  messages?: AiWorkspaceMessage[];
  searchQuery?: string;
  activeMatchMessageId?: string;
  pinnedSourceIds?: string[];
  hasOlderMessages?: boolean;
  initialScrollTop?: number;
  onLoadOlder?: () => void;
  onToggleMessagePin?: (message: AiWorkspaceMessage) => void;
  onSaveScrollPosition?: (scrollTop: number) => void;
  requestedScroll?: { id: number; top: number };
}) {
  const displayedMessages = messages ?? state.messages;
  const messageContentLength = displayedMessages.reduce(
    (total, message) => total + message.content.length,
    0,
  );
  const structuredResponseCount = displayedMessages.filter(
    (message) => Boolean(message.structuredResponse),
  ).length;
  const { containerRef, onScroll } = useAutoScroll(
    [
      displayedMessages.length,
      messageContentLength,
      structuredResponseCount,
      state.generationStatus,
    ].join(":"),
    initialScrollTop,
  );
  const saveScrollPositionRef = React.useRef(
    onSaveScrollPosition,
  );
  const latestScrollTopRef = React.useRef(
    initialScrollTop ?? 0,
  );
  const persistTimerRef = React.useRef<number | null>(null);
  const scrollPositionDirtyRef = React.useRef(false);

  React.useEffect(() => {
    saveScrollPositionRef.current = onSaveScrollPosition;
  }, [onSaveScrollPosition]);

  const queueScrollPositionSave = React.useCallback(
    (scrollTop: number) => {
      latestScrollTopRef.current = scrollTop;
      scrollPositionDirtyRef.current = true;
      if (persistTimerRef.current !== null) {
        window.clearTimeout(persistTimerRef.current);
      }
      persistTimerRef.current = window.setTimeout(() => {
        saveScrollPositionRef.current?.(
          latestScrollTopRef.current,
        );
        scrollPositionDirtyRef.current = false;
        persistTimerRef.current = null;
      }, 120);
    },
    [],
  );

  React.useEffect(
    () => () => {
      if (persistTimerRef.current !== null) {
        window.clearTimeout(persistTimerRef.current);
      }
      if (scrollPositionDirtyRef.current) {
        saveScrollPositionRef.current?.(
          latestScrollTopRef.current,
        );
      }
    },
    [],
  );

  React.useEffect(() => {
    const element = containerRef.current;
    if (!element || !requestedScroll) return;
    window.requestAnimationFrame(() => {
      element.scrollTop = requestedScroll.top;
    });
  }, [containerRef, requestedScroll]);

  React.useEffect(() => {
    if (!activeMatchMessageId) return;
    document
      .getElementById(`message-${activeMatchMessageId}`)
      ?.scrollIntoView({
        block: "center",
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches
          ? "auto"
          : "smooth",
      });
  }, [activeMatchMessageId]);

  const loadOlder = () => {
    const element = containerRef.current;
    if (!element || !onLoadOlder) return;
    const previousHeight = element.scrollHeight;
    const previousTop = element.scrollTop;
    onLoadOlder();
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        element.scrollTop =
          previousTop + element.scrollHeight - previousHeight;
      });
    });
  };

  return (
    <div
      ref={containerRef}
      onScroll={() => {
        onScroll();
        const scrollTop = containerRef.current?.scrollTop;
        if (typeof scrollTop === "number") {
          queueScrollPositionSave(scrollTop);
        }
      }}
      className="no-scrollbar min-h-0 flex-1 scroll-auto overflow-y-auto px-1 py-4 [overflow-anchor:none] sm:px-2"
      aria-label={copy.chat.regionLabel}
      aria-live="polite"
    >
      <div className="mx-auto w-full max-w-3xl space-y-5">
        {hasOlderMessages ? (
          <div className="flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={loadOlder}
            >
              {copy.longRun.conversation.loadOlder}
            </Button>
          </div>
        ) : null}

        {displayedMessages.length === 0 ? (
          <div className="py-16 text-center">
            <Bot className="mx-auto size-6 text-primary" />
            <h2 className="mt-3 workspace-section-title text-ink">
              {copy.chat.emptyTitle}
            </h2>
            <p className="mx-auto mt-2 max-w-md workspace-supporting text-workspace-muted-text">
              {copy.chat.emptyDescription}
            </p>
          </div>
        ) : null}

        {displayedMessages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            state={state}
            copy={copy}
            searchQuery={searchQuery}
            active={activeMatchMessageId === message.id}
            pinned={pinnedSourceIds.includes(message.id)}
            onTogglePin={
              onToggleMessagePin
                ? () => onToggleMessagePin(message)
                : undefined
            }
            onOpenCycle={onOpenCycle}
            onSendPrompt={onSendPrompt}
            onConfirmActionProposal={
              onConfirmActionProposal
            }
            onRetry={onRetry}
            onEditFailedMessage={
              onEditFailedMessage
                ? () => onEditFailedMessage(message.id)
                : undefined
            }
            onDeleteFailedMessage={
              onDeleteFailedMessage
                ? () => onDeleteFailedMessage(message.id)
                : undefined
            }
            onOpenMentor={onOpenMentor}
            onDeferMentor={onDeferMentor}
            onOpenArtifact={onOpenArtifact}
          />
        ))}

        {state.generationStatus === "typing" ? (
          <TypingIndicator
            copy={copy.chat}
            prompt={state.lastRequest?.message ?? ""}
            hasReadyAttachments={state.attachments.some(
              (attachment) => attachment.status === "ready",
            )}
          />
        ) : null}

        {state.generationStatus === "error" ? (
          <div
            role="alert"
            className="flex items-start justify-between gap-3 rounded-xl border border-workspace-danger/30 bg-workspace-danger-soft px-3.5 py-3"
          >
            <div className="flex min-w-0 gap-2">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-workspace-danger" />
              <p className="workspace-supporting text-ink">
                {state.errorMessage ?? copy.chat.errorFallback}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={onRetry}
            >
              {copy.chat.retry}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
