"use client";

import {
  BrainCircuit,
  Clock3,
  MoreHorizontal,
  Search,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { AiWorkspaceCopy } from "../../copy/types";
import type { ConversationSession } from "../../types/long-run-workspace.types";
import { ConversationSearch } from "./conversation-search";

export function ConversationHeader({
  session,
  searchOpen,
  searchQuery,
  activeMatchIndex,
  matchCount,
  copy,
  onOpenSearch,
  onSearchQueryChange,
  onPreviousMatch,
  onNextMatch,
  onCloseSearch,
  onOpenMemory,
  onOpenSummary,
  onOpenTimeline,
}: {
  session: ConversationSession;
  searchOpen: boolean;
  searchQuery: string;
  activeMatchIndex: number;
  matchCount: number;
  copy: AiWorkspaceCopy["longRun"];
  onOpenSearch: () => void;
  onSearchQueryChange: (query: string) => void;
  onPreviousMatch: () => void;
  onNextMatch: () => void;
  onCloseSearch: () => void;
  onOpenMemory: () => void;
  onOpenSummary: () => void;
  onOpenTimeline: () => void;
}) {
  return (
    <div className="border-b border-workspace-border bg-workspace-background">
      <div className="flex min-h-14 items-center justify-between gap-3 px-2 sm:px-3">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <h2 className="truncate workspace-section-title text-ink">
              {session.title}
            </h2>
            {session.summaryStatus !== "none" ? (
              <Badge
                variant="outline"
                className="hidden shrink-0 border-workspace-border bg-workspace-elevated workspace-meta text-workspace-muted-text sm:inline-flex"
              >
                {session.summaryStatus === "draft"
                  ? copy.summary.draft
                  : session.summaryStatus === "confirmed"
                    ? copy.summary.confirmed
                    : copy.summary.memoryUpdated}
              </Badge>
            ) : null}
          </div>
          <p className="truncate workspace-meta text-workspace-muted-text">
            {copy.conversation.scope}:{" "}
            {copy.conversation.categories[session.category]}
            {session.relatedDecisionCycleId
              ? ` · ${session.relatedDecisionCycleId}`
              : ""}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label={copy.conversation.search}
            onClick={onOpenSearch}
          >
            <Search className="size-4" />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            className="hidden sm:inline-flex"
            aria-label={copy.conversation.memory}
            onClick={onOpenMemory}
          >
            <BrainCircuit className="size-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                aria-label={copy.common.more}
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="border-workspace-border bg-workspace-panel"
            >
              <DropdownMenuItem onSelect={onOpenSearch}>
                <Search className="size-4" />
                {copy.conversation.search}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={onOpenSummary}>
                <Sparkles className="size-4" />
                {copy.conversation.summarize}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={onOpenMemory}>
                <BrainCircuit className="size-4" />
                {copy.conversation.memory}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={onOpenTimeline}>
                <Clock3 className="size-4" />
                {copy.conversation.timeline}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {searchOpen ? (
        <ConversationSearch
          query={searchQuery}
          activeIndex={activeMatchIndex}
          total={matchCount}
          copy={copy.conversation}
          onQueryChange={onSearchQueryChange}
          onPrevious={onPreviousMatch}
          onNext={onNextMatch}
          onClose={onCloseSearch}
        />
      ) : null}
    </div>
  );
}
