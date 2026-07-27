"use client";

import React from "react";
import {
  ArrowDown,
  ArrowUp,
  Bot,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { AiWorkspaceCopy } from "../../copy/types";
import type {
  ReadinessChange,
  TimelineEvent,
} from "../../types/long-run-workspace.types";

function ReadinessChangeDetails({
  change,
  copy,
}: {
  change: ReadinessChange;
  copy: AiWorkspaceCopy["longRun"];
}) {
  const delta = change.nextScore - change.previousScore;
  return (
    <div className="mt-2 rounded-lg border border-workspace-border bg-workspace-elevated p-2.5">
      <div className="flex items-center gap-3">
        <div>
          <p className="workspace-meta text-workspace-muted-text">
            {copy.timeline.previousScore}
          </p>
          <p className="workspace-section-title text-ink">
            {change.previousScore}
          </p>
        </div>
        <span className="text-workspace-muted-text">→</span>
        <div>
          <p className="workspace-meta text-workspace-muted-text">
            {copy.timeline.nextScore}
          </p>
          <p className="workspace-section-title text-ink">
            {change.nextScore}
          </p>
        </div>
        <span
          className={cn(
            "ml-auto flex items-center gap-1 font-medium",
            delta >= 0 ? "text-primary" : "text-workspace-danger",
          )}
          aria-label={copy.timeline.changeLabel(delta)}
        >
          {delta >= 0 ? (
            <ArrowUp className="size-4" />
          ) : (
            <ArrowDown className="size-4" />
          )}
          {delta > 0 ? "+" : ""}
          {delta}
        </span>
      </div>
      <ul className="mt-2 space-y-1">
        {change.dimensionChanges.map((dimension) => (
          <li
            key={dimension.id}
            className="workspace-meta text-workspace-muted-text"
          >
            <span className="font-medium text-ink">
              {dimension.label}: {dimension.previousScore} →{" "}
              {dimension.nextScore}
            </span>
            <p>{dimension.reason}</p>
          </li>
        ))}
      </ul>
      <p className="mt-2 workspace-meta text-workspace-muted-text">
        {copy.timeline.rubric}: {change.rubricVersion}
      </p>
      {change.evidenceRemovedIds.length > 0 ? (
        <p className="mt-1 workspace-meta text-workspace-danger">
          {copy.timeline.evidenceRemoved}:{" "}
          {change.evidenceRemovedIds.join(", ")}
        </p>
      ) : null}
    </div>
  );
}

export function DecisionTimeline({
  events,
  readinessHistory,
  copy,
  onAsk,
  onOpenCycle,
}: {
  events: TimelineEvent[];
  readinessHistory: ReadinessChange[];
  copy: AiWorkspaceCopy["longRun"];
  onAsk: (event: TimelineEvent) => void;
  onOpenCycle: (event: TimelineEvent) => void;
}) {
  const [expandedEventId, setExpandedEventId] =
    React.useState<string>();
  const hasMultipleRubrics =
    new Set(
      readinessHistory.map((change) => change.rubricVersion),
    ).size > 1;

  return (
    <div className="space-y-3">
      {hasMultipleRubrics ? (
        <p
          role="note"
          className="rounded-lg border border-workspace-warning/30 bg-workspace-warning-soft p-2.5 workspace-meta text-ink"
        >
          {copy.timeline.rubricWarning}
        </p>
      ) : null}
      {events.map((event, index) => {
        const readiness = event.readinessChangeId
          ? readinessHistory.find(
              (change) => change.id === event.readinessChangeId,
            )
          : undefined;
        const expanded = expandedEventId === event.id;
        return (
          <article key={event.id} className="relative pl-7">
            {index < events.length - 1 ? (
              <span className="absolute bottom-[-1rem] left-[7px] top-4 w-px bg-workspace-border" />
            ) : null}
            <span className="absolute left-0 top-1.5 size-4 rounded-full border-2 border-primary bg-workspace-panel" />
            <div className="rounded-xl border border-workspace-border bg-workspace-panel p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="workspace-supporting font-medium text-ink">
                    {event.title}
                  </h3>
                  <p className="mt-1 workspace-meta text-workspace-muted-text">
                    {new Intl.DateTimeFormat("vi-VN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(event.createdAt))}{" "}
                    · {event.actor}
                  </p>
                </div>
                {readiness ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      setExpandedEventId(
                        expanded ? undefined : event.id,
                      )
                    }
                    aria-expanded={expanded}
                  >
                    {copy.timeline.compare}
                    <ChevronDown className="size-3.5" />
                  </Button>
                ) : null}
              </div>
              <p className="mt-2 workspace-meta leading-5 text-workspace-muted-text">
                {event.reason}
              </p>
              {expanded && readiness ? (
                <ReadinessChangeDetails
                  change={readiness}
                  copy={copy}
                />
              ) : null}
              <div className="mt-2 flex flex-wrap gap-1">
                {event.relatedDecisionCycleId ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => onOpenCycle(event)}
                  >
                    <ExternalLink className="size-3.5" />
                    {copy.timeline.openCycle}
                  </Button>
                ) : null}
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => onAsk(event)}
                >
                  <Bot className="size-3.5" />
                  {copy.common.askKizuna}
                </Button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
