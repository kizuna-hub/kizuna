"use client";

import React from "react";

import { findConversationMessageMatches } from "../services/conversation-search";
import { useAiWorkspace } from "./use-ai-workspace";

type AiWorkspaceController = ReturnType<typeof useAiWorkspace>;

export function useConversationSearchController({
  workspace,
  onOpenVentureSearch,
  overlayOpen,
  jumpMessageId,
  onJumpHandled,
}: {
  workspace: AiWorkspaceController;
  onOpenVentureSearch: () => void;
  overlayOpen: boolean;
  jumpMessageId?: string;
  onJumpHandled: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeMatchIndex, setActiveMatchIndex] =
    React.useState(0);
  const [topicDriftDismissed, setTopicDriftDismissed] =
    React.useState(false);
  const [scrollRestoreRequest, setScrollRestoreRequest] =
    React.useState<{ id: number; top: number }>();
  const preSearchScrollTop = React.useRef(0);
  const { state, longRun } = workspace;
  const activeMessages =
    longRun.messagesByConversation[
      longRun.activeConversationId
    ] ?? state.messages;
  const matches = React.useMemo(
    () =>
      findConversationMessageMatches(activeMessages, query),
    [activeMessages, query],
  );
  const activeMatchMessageId =
    jumpMessageId ?? matches[activeMatchIndex]?.id;
  const revealMessage = workspace.revealMessage;

  React.useEffect(() => {
    setActiveMatchIndex(0);
  }, [query, longRun.activeConversationId]);

  React.useEffect(() => {
    setOpen(false);
    setQuery("");
    setTopicDriftDismissed(false);
  }, [longRun.activeConversationId]);

  React.useEffect(() => {
    if (!open || !activeMatchMessageId) return;
    revealMessage(activeMatchMessageId);
  }, [activeMatchMessageId, open, revealMessage]);

  React.useEffect(() => {
    if (!jumpMessageId) return;
    const timeout = window.setTimeout(onJumpHandled, 900);
    return () => window.clearTimeout(timeout);
  }, [jumpMessageId, onJumpHandled]);

  const openCurrentSearch = React.useCallback(() => {
    preSearchScrollTop.current =
      longRun.scrollTopByConversation[
        longRun.activeConversationId
      ] ?? 0;
    setOpen(true);
  }, [
    longRun.activeConversationId,
    longRun.scrollTopByConversation,
  ]);

  const closeCurrentSearch = React.useCallback(() => {
    setOpen(false);
    setQuery("");
    setScrollRestoreRequest({
      id: Date.now(),
      top: preSearchScrollTop.current,
    });
  }, []);

  React.useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      const target = event.target;
      const editing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement &&
          target.isContentEditable);
      const key = event.key.toLocaleLowerCase();

      if ((event.ctrlKey || event.metaKey) && key === "k") {
        event.preventDefault();
        onOpenVentureSearch();
        return;
      }
      if (
        !editing &&
        !overlayOpen &&
        (event.ctrlKey || event.metaKey) &&
        key === "f"
      ) {
        event.preventDefault();
        openCurrentSearch();
      }
      if (event.key === "Escape" && open) {
        closeCurrentSearch();
      }
    };

    window.addEventListener("keydown", handleKeyboard);
    return () =>
      window.removeEventListener("keydown", handleKeyboard);
  }, [
    closeCurrentSearch,
    onOpenVentureSearch,
    open,
    openCurrentSearch,
    overlayOpen,
  ]);

  return {
    open,
    setOpen,
    query,
    setQuery,
    activeMatchIndex,
    setActiveMatchIndex,
    matches,
    activeMatchMessageId,
    topicDriftDismissed,
    setTopicDriftDismissed,
    scrollRestoreRequest,
    openCurrentSearch,
    closeCurrentSearch,
  };
}
