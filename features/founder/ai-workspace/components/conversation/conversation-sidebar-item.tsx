"use client";

import React from "react";
import {
  Archive,
  MessageSquarePlus,
  MoreHorizontal,
  Pencil,
  Pin,
  PinOff,
  Target,
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
  onTogglePin,
  onArchive,
}: {
  session: ConversationSession;
  active: boolean;
  copy: AiWorkspaceCopy["longRun"];
  onSelect: () => void;
  onRename: (title: string) => void;
  onTogglePin: () => void;
  onArchive: () => void;
}) {
  const [editing, setEditing] = React.useState(false);
  const [title, setTitle] = React.useState(session.title);

  if (editing) {
    return (
      <form
        className="flex items-center gap-1 px-1"
        onSubmit={(event) => {
          event.preventDefault();
          onRename(title);
          setEditing(false);
        }}
      >
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          aria-label={copy.sidebar.rename}
          autoFocus
          className="h-9 min-w-0 border-workspace-border bg-workspace-panel workspace-control-text"
        />
        <Button type="submit" size="sm">
          {copy.common.save}
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
          className="border-workspace-border bg-workspace-panel"
        >
          <DropdownMenuItem onSelect={() => setEditing(true)}>
            <Pencil className="size-4" />
            {copy.sidebar.rename}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onTogglePin}>
            {session.isPinned ? (
              <PinOff className="size-4" />
            ) : (
              <Pin className="size-4" />
            )}
            {session.isPinned
              ? copy.common.unpin
              : copy.common.pin}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onArchive}>
            <Archive className="size-4" />
            {copy.sidebar.archive}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
