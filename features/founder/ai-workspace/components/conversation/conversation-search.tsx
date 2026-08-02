"use client";

import {
  ChevronDown,
  ChevronUp,
  Search,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import type { AiWorkspaceCopy } from "../../copy/types";

export function ConversationSearch({
  query,
  activeIndex,
  total,
  copy,
  onQueryChange,
  onPrevious,
  onNext,
  onClose,
  floating = false,
}: {
  query: string;
  activeIndex: number;
  total: number;
  copy: AiWorkspaceCopy["longRun"]["conversation"];
  onQueryChange: (query: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
  floating?: boolean;
}) {
  return (
    <div
      role="search"
      className={cn(
        "flex items-center gap-1.5 px-2 py-2 sm:px-3",
        floating
          ? "rounded-xl border border-workspace-border bg-workspace-elevated shadow-framer-edge"
          : "border-t border-workspace-border",
      )}
    >
      <Search className="size-4 shrink-0 text-workspace-muted-text" />
      <Input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={copy.search}
        aria-label={copy.search}
        autoFocus
        className="h-9 min-w-0 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
      />
      <span
        className="min-w-16 text-right workspace-meta text-workspace-muted-text"
        role="status"
        aria-live="polite"
      >
        {query && total === 0
          ? copy.noMatches
          : copy.resultCount(
              total === 0 ? 0 : activeIndex + 1,
              total,
            )}
      </span>
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        onClick={onPrevious}
        disabled={total === 0}
        aria-label={copy.previousMatch}
      >
        <ChevronUp className="size-4" />
      </Button>
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        onClick={onNext}
        disabled={total === 0}
        aria-label={copy.nextMatch}
      >
        <ChevronDown className="size-4" />
      </Button>
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        onClick={onClose}
        aria-label={copy.closeSearch}
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}
