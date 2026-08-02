"use client";

import React from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { AiWorkspaceCopy } from "../../copy/types";
import type { ContextConflict } from "../../types/long-run-workspace.types";

export function ContextConflictCard({
  conflict,
  copy,
  onResolve,
}: {
  conflict: ContextConflict;
  copy: AiWorkspaceCopy["longRun"];
  onResolve: (
    resolution:
      | "set_current"
      | "future_direction"
      | "parallel_hypotheses",
    valueId: string,
  ) => void;
}) {
  const [selectedValueId, setSelectedValueId] = React.useState(
    conflict.resolvedValueId ?? conflict.values.at(-1)?.id ?? "",
  );

  return (
    <section className="rounded-xl border border-workspace-warning/30 bg-workspace-warning-soft p-3">
      <div className="flex items-start gap-2.5">
        {conflict.status === "resolved" ? (
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
        ) : (
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-workspace-warning" />
        )}
        <div className="min-w-0 flex-1">
          <h3 className="workspace-section-title text-ink">
            {conflict.status === "resolved"
              ? copy.conflict.resolved
              : copy.conflict.title}
          </h3>
          <p className="mt-1 workspace-meta text-workspace-muted-text">
            {conflict.description}
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-2 lg:grid-cols-3">
        {conflict.values.map((value) => {
          const selected = selectedValueId === value.id;
          return (
            <button
              key={value.id}
              type="button"
              onClick={() => setSelectedValueId(value.id)}
              disabled={conflict.status === "resolved"}
              className={cn(
                "rounded-lg border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40",
                selected
                  ? "border-primary-border bg-workspace-selected"
                  : "border-workspace-border bg-workspace-panel",
              )}
            >
              <p className="workspace-supporting font-medium text-ink">
                {value.value}
              </p>
              <p className="mt-1 workspace-meta text-workspace-muted-text">
                {value.sourceLabel}
              </p>
              <p className="workspace-meta text-workspace-muted-text">
                {new Intl.DateTimeFormat("vi-VN").format(
                  new Date(value.observedAt),
                )}{" "}
                ·{" "}
                {value.freshness === "current"
                  ? copy.conflict.current
                  : value.freshness === "older"
                    ? copy.conflict.older
                    : copy.conflict.outdated}
              </p>
            </button>
          );
        })}
      </div>

      {conflict.status === "open" ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            disabled={!selectedValueId}
            onClick={() =>
              onResolve("set_current", selectedValueId)
            }
          >
            {copy.conflict.setCurrent}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={!selectedValueId}
            onClick={() =>
              onResolve("future_direction", selectedValueId)
            }
          >
            {copy.conflict.futureDirection}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={!selectedValueId}
            onClick={() =>
              onResolve(
                "parallel_hypotheses",
                selectedValueId,
              )
            }
          >
            {copy.conflict.parallelHypotheses}
          </Button>
        </div>
      ) : null}
    </section>
  );
}
