"use client";

import React from "react";
import {
  Check,
  MessageSquarePlus,
  MoreHorizontal,
  PanelRightOpen,
  Pencil,
  Pin,
  Target,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import type { AiWorkspaceCopy } from "../../copy/types";
import type { ConversationSession } from "../../types/long-run-workspace.types";

export function ConversationSidebarItem({
  session,
  active,
  copy,
  onSelect,
  onRename,
  onDelete,
  onOpenInPanel,
}: {
  session: ConversationSession;
  active: boolean;
  copy: AiWorkspaceCopy["longRun"];
  onSelect: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
  onOpenInPanel: () => void;
}) {
  const [editing, setEditing] = React.useState(false);
  const [title, setTitle] = React.useState(session.title);

  const cancelEditing = () => {
    setTitle(session.title);
    setEditing(false);
  };

  if (editing) {
    return (
      <form
        className="flex items-center gap-1 px-0.5"
        onSubmit={(event) => {
          event.preventDefault();
          const nextTitle = title.trim();
          if (!nextTitle) return;
          onRename(nextTitle);
          setEditing(false);
        }}
      >
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          aria-label={copy.sidebar.rename}
          autoFocus
          maxLength={80}
          onKeyDown={(event) => {
            if (event.key === "Escape") cancelEditing();
          }}
          className="h-9 min-w-0 flex-1 border-workspace-border bg-workspace-panel workspace-control-text"
        />
        <Button
          type="submit"
          size="icon-sm"
          variant="ghost"
          disabled={!title.trim()}
          aria-label={copy.common.save}
        >
          <Check className="size-3.5" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          onClick={cancelEditing}
          aria-label={copy.common.cancel}
        >
          <X className="size-3.5" />
        </Button>
      </form>
    );
  }

  return (
    <div
      className={cn(
        "group flex items-center rounded-lg border",
        active
          ? "border-primary-border bg-workspace-selected"
          : "border-transparent hover:bg-workspace-row-hover",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex min-h-9 min-w-0 flex-1 items-center gap-2 px-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40"
      >
        {session.category === "decision_cycle" ? (
          <Target className="size-3.5 shrink-0 text-primary" />
        ) : (
          <MessageSquarePlus className="size-3.5 shrink-0 text-workspace-muted-text" />
        )}
        <span className="min-w-0 flex-1 truncate workspace-control-text text-ink">
          {session.title}
        </span>
        {session.isPinned ? (
          <Pin className="size-3 shrink-0 text-primary" />
        ) : null}
      </button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onOpenInPanel}
        className={cn(
          "opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none",
          active && "opacity-70",
        )}
        aria-label={`Mở ${session.title} trong panel`}
        title="Mở trong panel"
      >
        <PanelRightOpen className="size-3.5" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="mr-0.5 opacity-70 group-hover:opacity-100"
            aria-label={copy.sidebar.conversationOptions}
          >
            <MoreHorizontal className="size-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={4}
          className="z-dropdown min-w-44 rounded-xl border-workspace-border bg-workspace-elevated p-1.5 shadow-framer-edge"
        >
          <DropdownMenuItem
            onSelect={() => setEditing(true)}
            className="h-9 rounded-lg workspace-control-text"
          >
            <Pencil className="size-3.5" />
            {copy.sidebar.rename}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={onDelete}
            className="h-9 rounded-lg workspace-control-text text-workspace-danger focus:bg-workspace-danger-soft focus:text-workspace-danger"
          >
            <Trash2 className="size-3.5" />
            {copy.sidebar.deleteConversation}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
