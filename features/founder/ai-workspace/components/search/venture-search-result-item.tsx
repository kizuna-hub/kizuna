import {
  ArrowUpRight,
  Bot,
  FileSearch,
  Pin,
  PinOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { CommandItem } from "@/components/ui/command";

import type { AiWorkspaceCopy } from "../../copy/types";
import type { VentureSearchResult } from "../../types/long-run-workspace.types";

export function VentureSearchResultItem({
  result,
  copy,
  query,
  onOpenContext,
  onAsk,
  onTogglePin,
}: {
  result: VentureSearchResult;
  copy: AiWorkspaceCopy["longRun"];
  query: string;
  onOpenContext: () => void;
  onAsk: () => void;
  onTogglePin: () => void;
}) {
  const normalizedQuery = query.trim().toLocaleLowerCase("vi");
  const snippetIndex = result.snippet
    .toLocaleLowerCase("vi")
    .indexOf(normalizedQuery);
  const snippet =
    normalizedQuery && snippetIndex >= 0 ? (
      <>
        {result.snippet.slice(0, snippetIndex)}
        <mark className="rounded-sm bg-workspace-warning-soft px-0.5 text-ink">
          {result.snippet.slice(
            snippetIndex,
            snippetIndex + query.trim().length,
          )}
        </mark>
        {result.snippet.slice(
          snippetIndex + query.trim().length,
        )}
      </>
    ) : (
      result.snippet
    );

  return (
    <CommandItem
      value={`${result.title} ${result.searchText}`}
      onSelect={onOpenContext}
      className="my-1 block rounded-xl border border-workspace-border bg-workspace-panel p-3 aria-selected:border-primary-border aria-selected:bg-workspace-selected"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate workspace-supporting font-medium text-ink">
            {result.title}
          </p>
          <p className="mt-1 line-clamp-2 workspace-meta leading-5 text-workspace-muted-text">
            {snippet}
          </p>
        </div>
        {result.status ? (
          <span className="shrink-0 rounded-pill border border-workspace-border bg-workspace-elevated px-2 py-0.5 workspace-meta text-workspace-muted-text">
            {copy.memory.statuses[result.status]}
          </span>
        ) : null}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className="workspace-meta text-workspace-muted-text">
          {copy.search.types[result.contentType]} ·{" "}
          {new Intl.DateTimeFormat("vi-VN").format(
            new Date(result.createdAt),
          )}{" "}
          · {result.sourceLabel}
        </span>
        <span className="flex-1" />
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={(event) => {
            event.stopPropagation();
            onOpenContext();
          }}
        >
          <FileSearch className="size-3.5" />
          {copy.common.openSource}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={(event) => {
            event.stopPropagation();
            onOpenContext();
          }}
        >
          <ArrowUpRight className="size-3.5" />
          {copy.common.viewContext}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={(event) => {
            event.stopPropagation();
            onAsk();
          }}
        >
          <Bot className="size-3.5" />
          {copy.common.askKizuna}
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          onClick={(event) => {
            event.stopPropagation();
            onTogglePin();
          }}
          aria-label={
            result.isPinned
              ? copy.common.unpin
              : copy.common.pin
          }
        >
          {result.isPinned ? (
            <PinOff className="size-3.5" />
          ) : (
            <Pin className="size-3.5" />
          )}
        </Button>
      </div>
    </CommandItem>
  );
}
