"use client";

import React from "react";
import { CheckCircle2, Database, Pencil, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { AiWorkspaceCopy } from "../../copy/types";
import type { SessionSummary } from "../../types/long-run-workspace.types";

export function SessionSummaryCard({
  summary,
  copy,
  onEditItem,
  onConfirm,
  onUpdateMemory,
  onSkip,
}: {
  summary: SessionSummary;
  copy: AiWorkspaceCopy["longRun"];
  onEditItem: (
    sectionId: string,
    itemIndex: number,
    value: string,
  ) => void;
  onConfirm: () => void;
  onUpdateMemory: () => void;
  onSkip: () => void;
}) {
  const [editing, setEditing] = React.useState<{
    sectionId: string;
    itemIndex: number;
  } | null>(null);

  const statusLabel =
    summary.status === "draft"
      ? copy.summary.draft
      : summary.status === "confirmed"
        ? copy.summary.confirmed
        : summary.status === "memory_updated"
          ? copy.summary.memoryUpdated
          : copy.summary.draft;

  return (
    <article className="rounded-xl border border-workspace-border bg-workspace-panel p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="workspace-section-title text-ink">
            {copy.summary.title}
          </h2>
          <p className="mt-1 workspace-meta text-workspace-muted-text">
            {copy.summary.description}
          </p>
        </div>
        <span className="rounded-pill border border-workspace-border bg-workspace-elevated px-2 py-0.5 workspace-meta text-workspace-muted-text">
          {statusLabel}
        </span>
      </div>

      <div className="mt-3 divide-y divide-workspace-border rounded-lg border border-workspace-border">
        {summary.sections.map((section) => (
          <section key={section.id} className="p-3">
            <h3 className="workspace-supporting font-medium text-ink">
              {section.label}
            </h3>
            <ul className="mt-1.5 space-y-1.5">
              {section.items.map((item, itemIndex) => {
                const isEditing =
                  editing?.sectionId === section.id &&
                  editing.itemIndex === itemIndex;
                return (
                  <li
                    key={`${section.id}-${itemIndex}`}
                    className="flex items-start gap-2 workspace-meta text-workspace-muted-text"
                  >
                    <span aria-hidden>•</span>
                    {isEditing ? (
                      <form
                        className="flex min-w-0 flex-1 gap-1"
                        onSubmit={(event) => {
                          event.preventDefault();
                          setEditing(null);
                        }}
                      >
                        <Input
                          value={item}
                          onChange={(event) =>
                            onEditItem(
                              section.id,
                              itemIndex,
                              event.target.value,
                            )
                          }
                          aria-label={copy.summary.editItem}
                          autoFocus
                          className="h-8 min-w-0 flex-1 border-workspace-border bg-workspace-elevated workspace-meta"
                        />
                        <Button type="submit" size="icon-sm">
                          <CheckCircle2 className="size-3.5" />
                        </Button>
                      </form>
                    ) : (
                      <>
                        <span className="min-w-0 flex-1">{item}</span>
                        {summary.status === "draft" ? (
                          <Button
                            type="button"
                            size="icon-sm"
                            variant="ghost"
                            className="size-7 shrink-0"
                            aria-label={copy.summary.editItem}
                            onClick={() =>
                              setEditing({
                                sectionId: section.id,
                                itemIndex,
                              })
                            }
                          >
                            <Pencil className="size-3" />
                          </Button>
                        ) : null}
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {summary.status === "draft" ? (
          <Button type="button" size="sm" onClick={onConfirm}>
            <CheckCircle2 className="size-3.5" />
            {copy.summary.confirm}
          </Button>
        ) : null}
        {summary.status === "confirmed" ? (
          <Button
            type="button"
            size="sm"
            onClick={onUpdateMemory}
          >
            <Database className="size-3.5" />
            {copy.summary.updateMemory}
          </Button>
        ) : null}
        {summary.status !== "memory_updated" ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onSkip}
          >
            <X className="size-3.5" />
            {copy.summary.skip}
          </Button>
        ) : null}
      </div>
    </article>
  );
}
