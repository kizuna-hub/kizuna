"use client";

import {
  BookOpenCheck,
  GitCompareArrows,
  ListChecks,
  Pin,
  PinOff,
  SearchCheck,
  UserRoundSearch,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { ConversationSession } from "../../types/long-run-workspace.types";
import {
  conversationSessionTypeLabels,
  type FounderConversationSessionType,
} from "../types/conversation-session.types";
import {
  formatConversationSessionTime,
  getConversationMentorNames,
} from "../services/conversation-session-selector";

const typeIcons = {
  mentor_matching: UserRoundSearch,
  mentor_profile: SearchCheck,
  mentor_comparison: GitCompareArrows,
  session_preparation: BookOpenCheck,
  mentor_questions: ListChecks,
} satisfies Record<FounderConversationSessionType, typeof Pin>;

export function ConversationSessionRow({
  session,
  selected,
  onOpen,
  onTogglePin,
}: {
  session: ConversationSession;
  selected: boolean;
  onOpen: () => void;
  onTogglePin: () => void;
}) {
  if (!session.historyType) return null;
  const Icon = typeIcons[session.historyType];
  const mentorNames = getConversationMentorNames(session);
  const sourceCount = session.sourceIds?.length ?? 0;

  return (
    <li
      className={cn(
        "group flex items-start gap-2 rounded-xl border border-workspace-border bg-workspace-panel p-2 transition-colors hover:border-primary-border hover:bg-workspace-elevated motion-reduce:transition-none",
        selected && "border-primary-border bg-primary-soft",
      )}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-current={selected ? "true" : undefined}
        className="flex min-w-0 flex-1 items-start gap-3 rounded-lg px-2 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/50"
      >
        <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-workspace-border bg-workspace-elevated text-primary">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate workspace-card-title text-ink">
            {session.title}
          </span>
          <span className="mt-0.5 block workspace-meta text-workspace-muted-text">
            {session.contextSnapshot?.ventureName ?? "CampusFlow"} ·{" "}
            {conversationSessionTypeLabels[session.historyType]}
          </span>
          <span className="mt-2 line-clamp-2 block workspace-supporting text-workspace-muted-text">
            {session.preview}
          </span>
          <span className="mt-2 block workspace-meta text-workspace-muted-text">
            {mentorNames.join(", ") || "Kizuna"} · {sourceCount}{" "}
            {sourceCount === 1 ? "nguồn" : "nguồn"} ·{" "}
            {formatConversationSessionTime(session.updatedAt)}
          </span>
        </span>
      </button>

      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        className="mt-1 shrink-0"
        onClick={onTogglePin}
        aria-label={
          session.isPinned
            ? `Bỏ ghim ${session.title}`
            : `Ghim ${session.title}`
        }
        aria-pressed={session.isPinned}
      >
        {session.isPinned ? (
          <PinOff className="size-3.5" />
        ) : (
          <Pin className="size-3.5" />
        )}
      </Button>
    </li>
  );
}
