"use client";

import {
  ArrowLeft,
  BookOpen,
  MessageSquarePlus,
  Network,
  PanelLeftClose,
  Pin,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { WorkspaceUserFooter } from "@/features/founder/shell/workspace-user-footer";
import { getCurrentUser } from "@/features/founder/venture-foundation/demo-repository";
import { useDemoWorkspace } from "@/features/founder/venture-foundation/demo-workspace-provider";
import { Link } from "@/i18n/routing";

import type { AiWorkspaceCopy } from "../../copy/types";
import type {
  ConversationSession,
  PinnedItemReference,
} from "../../types/long-run-workspace.types";
import { CollapsedWorkspaceSidebar } from "./collapsed-workspace-sidebar";
import { ConversationSidebarItem } from "./conversation-sidebar-item";

type SessionGroup = {
  label: string;
  sessions: ConversationSession[];
};

export function WorkspaceSidebar({
  collapsed,
  onNavigate,
  onToggleCollapsed,
  sessions,
  activeConversationId,
  pinnedItems,
  copy,
  onCreateConversation,
  onOpenSearch,
  onOpenSurface,
  onSelectConversation,
  onRenameConversation,
  onDeleteConversation,
  onOpenConversationInPanel,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
  onToggleCollapsed?: () => void;
  sessions: SessionGroup[];
  activeConversationId: string;
  pinnedItems: PinnedItemReference[];
  copy: AiWorkspaceCopy["longRun"];
  onCreateConversation: () => void;
  onOpenSearch: () => void;
  onOpenSurface: (
    surface: "memory" | "documents" | "pinned",
  ) => void;
  onSelectConversation: (conversationId: string) => void;
  onRenameConversation: (
    conversationId: string,
    title: string,
  ) => void;
  onDeleteConversation: (conversationId: string) => void;
  onOpenConversationInPanel: (
    conversationId: string,
  ) => void;
}) {
  const { state } = useDemoWorkspace();
  const user = getCurrentUser(state);

  if (collapsed) {
    return (
      <CollapsedWorkspaceSidebar
        user={user}
        copy={copy}
        onNavigate={onNavigate}
        onCreateConversation={onCreateConversation}
        onOpenSearch={onOpenSearch}
        onOpenSurface={onOpenSurface}
        onToggleCollapsed={onToggleCollapsed}
      />
    );
  }

  return (
    <div className="flex h-full min-h-0 w-[248px] flex-col bg-workspace-sidebar">
      <div className="flex items-center justify-between px-3 pb-2 pt-3">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg border border-primary-border bg-primary-soft font-heading text-sm font-semibold text-primary">
            K
          </span>
          <span className="font-heading text-sm font-semibold text-ink">
            Kizuna Hub
          </span>
        </div>
        {onToggleCollapsed ? (
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={onToggleCollapsed}
            aria-label={copy.sidebar.collapse}
          >
            <PanelLeftClose className="size-4" />
          </Button>
        ) : null}
      </div>

      <div className="px-2.5">
        <Button
          asChild
          type="button"
          variant="ghost"
          className="h-10 w-full justify-start rounded-lg px-2 workspace-control-text text-workspace-muted-text"
        >
          <Link href="/founder/projects" onClick={onNavigate}>
            <ArrowLeft className="size-4" />
            {copy.sidebar.backToProjects}
          </Link>
        </Button>
        <Button
          type="button"
          className="mt-2 w-full justify-start"
          onClick={onCreateConversation}
        >
          <MessageSquarePlus className="size-4" />
          {copy.sidebar.newConversation}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="mt-2 w-full justify-start border-workspace-border bg-workspace-panel"
          onClick={onOpenSearch}
        >
          <Search className="size-4" />
          <span className="min-w-0 flex-1 truncate text-left">
            {copy.sidebar.searchVenture}
          </span>
          <kbd className="workspace-meta text-workspace-muted-text">
            Ctrl K
          </kbd>
        </Button>
      </div>

      <div className="no-scrollbar mt-3 min-h-0 flex-1 overflow-y-auto px-2.5 pb-3">
        {sessions.map((group) =>
          group.sessions.length > 0 ? (
            <section key={group.label} className="mb-4">
              <h2 className="mb-1 px-2 workspace-eyebrow text-workspace-muted-text">
                {group.label}
              </h2>
              <div className="space-y-0.5">
                {group.sessions.map((session) => (
                  <ConversationSidebarItem
                    key={`${group.label}-${session.id}`}
                    session={session}
                    active={
                      session.id === activeConversationId
                    }
                    copy={copy}
                    onSelect={() => {
                      onSelectConversation(session.id);
                      onNavigate?.();
                    }}
                    onRename={(title) =>
                      onRenameConversation(session.id, title)
                    }
                    onDelete={() =>
                      onDeleteConversation(session.id)
                    }
                    onOpenInPanel={() =>
                      onOpenConversationInPanel(session.id)
                    }
                  />
                ))}
              </div>
            </section>
          ) : null,
        )}

        <section>
          <h2 className="mb-1 px-2 workspace-eyebrow text-workspace-muted-text">
            {copy.sidebar.pinned}
          </h2>
          <button
            type="button"
            onClick={() => onOpenSurface("pinned")}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left workspace-control-text text-workspace-muted-text hover:bg-workspace-row-hover hover:text-ink"
          >
            <Pin className="size-3.5" />
            <span className="min-w-0 flex-1 truncate">
              {pinnedItems[0]?.title ?? copy.saved.empty}
            </span>
            {pinnedItems.length > 0 ? (
              <span>{pinnedItems.length}</span>
            ) : null}
          </button>
        </section>
      </div>

      <div className="space-y-0.5 border-t border-workspace-border px-2.5 py-2">
        <button
          type="button"
          onClick={() => onOpenSurface("documents")}
          className="flex min-h-9 w-full items-center gap-2 rounded-lg px-2 workspace-control-text text-workspace-muted-text hover:bg-workspace-row-hover hover:text-ink"
        >
          <BookOpen className="size-4" />
          {copy.sidebar.materials}
        </button>
        <button
          type="button"
          onClick={() => onOpenSurface("pinned")}
          className="flex min-h-9 w-full items-center gap-2 rounded-lg px-2 workspace-control-text text-workspace-muted-text hover:bg-workspace-row-hover hover:text-ink"
        >
          <Network className="size-4" />
          {copy.sidebar.network}
        </button>
      </div>

      <WorkspaceUserFooter user={user} collapsed={false} />
    </div>
  );
}
