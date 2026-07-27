"use client";

import React from "react";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { AiWorkspaceCopy } from "../../copy/types";
import { searchGroupOrder } from "../../services/venture-search-service";
import type {
  VentureSearchFilters,
  VentureSearchResult,
} from "../../types/long-run-workspace.types";
import { VentureSearchFiltersPanel } from "./venture-search-filters";
import { VentureSearchResultItem } from "./venture-search-result-item";

export const defaultVentureSearchFilters: VentureSearchFilters = {
  contentType: "all",
  dateRange: "all",
  decisionCycleId: "all",
  status: "all",
  contributor: "all",
  pinnedOnly: false,
};

export function VentureSearchDialog({
  open,
  copy,
  onOpenChange,
  onSearch,
  onOpenResult,
  onAskKizuna,
  onTogglePin,
}: {
  open: boolean;
  copy: AiWorkspaceCopy["longRun"];
  onOpenChange: (open: boolean) => void;
  onSearch: (
    query: string,
    filters: VentureSearchFilters,
  ) => Promise<VentureSearchResult[]>;
  onOpenResult: (result: VentureSearchResult) => void;
  onAskKizuna: (result: VentureSearchResult) => void;
  onTogglePin: (result: VentureSearchResult) => void;
}) {
  const [query, setQuery] = React.useState("");
  const [filters, setFilters] = React.useState(
    defaultVentureSearchFilters,
  );
  const [results, setResults] = React.useState<
    VentureSearchResult[]
  >([]);
  const [status, setStatus] = React.useState<
    "idle" | "loading" | "error"
  >("idle");

  const runSearch = React.useCallback(async () => {
    setStatus("loading");
    try {
      const next = await onSearch(query, filters);
      setResults(next);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }, [filters, onSearch, query]);

  React.useEffect(() => {
    if (!open) return;
    const timeout = window.setTimeout(() => {
      void runSearch();
    }, 120);
    return () => window.clearTimeout(timeout);
  }, [open, runSearch]);

  const updateFilter = <Key extends keyof VentureSearchFilters>(
    key: Key,
    value: VentureSearchFilters[Key],
  ) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="flex max-h-[min(760px,calc(100dvh-2rem))] max-w-3xl flex-col gap-0 overflow-hidden border-workspace-border bg-workspace-panel p-0 max-sm:inset-0 max-sm:h-[100dvh] max-sm:max-h-none max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-none"
      >
        <DialogHeader className="border-b border-workspace-border px-4 py-3 text-left">
          <DialogTitle className="workspace-section-title text-ink">
            {copy.search.title}
          </DialogTitle>
          <DialogDescription className="workspace-meta text-workspace-muted-text">
            {copy.search.description}
          </DialogDescription>
        </DialogHeader>
        <Command shouldFilter={false} className="min-h-0 flex-1 bg-transparent">
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder={copy.search.placeholder}
            aria-label={copy.search.title}
          />
          <VentureSearchFiltersPanel
            filters={filters}
            copy={copy}
            onChange={updateFilter}
          />
          <div className="flex items-center justify-between px-4 py-2">
            <p
              className="workspace-meta text-workspace-muted-text"
              role="status"
              aria-live="polite"
            >
              {status === "loading"
                ? copy.search.loading
                : status === "error"
                  ? copy.search.failed
                  : copy.search.resultCount(results.length)}
            </p>
            {status === "error" ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => void runSearch()}
              >
                <RotateCcw className="size-3.5" />
                {copy.common.retry}
              </Button>
            ) : null}
          </div>

          <CommandList className="min-h-0 max-h-none flex-1 px-3 pb-3">
            <CommandEmpty>{copy.search.empty}</CommandEmpty>
            {searchGroupOrder.map((group) => {
              const groupResults = results.filter(
                (result) => result.contentType === group,
              );
              if (groupResults.length === 0) return null;
              return (
                <CommandGroup
                  key={group}
                  heading={copy.search.groups[group]}
                  className="[&_[cmdk-group-heading]]:workspace-eyebrow [&_[cmdk-group-heading]]:text-workspace-muted-text"
                >
                  {groupResults.map((result) => (
                    <VentureSearchResultItem
                      key={result.id}
                      result={result}
                      copy={copy}
                      query={query}
                      onOpenContext={() => onOpenResult(result)}
                      onAsk={() => onAskKizuna(result)}
                      onTogglePin={() => {
                        onTogglePin(result);
                        setResults((current) =>
                          current.map((candidate) =>
                            candidate.id === result.id
                              ? {
                                  ...candidate,
                                  isPinned:
                                    !candidate.isPinned,
                                }
                              : candidate,
                          ),
                        );
                      }}
                    />
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
