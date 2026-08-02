"use client";

import React from "react";
import {
  AlertTriangle,
  Bot,
  ChevronDown,
  ExternalLink,
  History,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { AiWorkspaceCopy } from "../../copy/types";
import { compareContextUpdateVersions } from "../../services/context-update-guard";
import type {
  VentureMemoryItem,
  VentureMemoryStatus,
} from "../../types/long-run-workspace.types";
import { MemoryStatusUpdatePrompt } from "./memory-status-update-prompt";

export function MemoryItemCard({
  item,
  stateVersion,
  copy,
  onSetStatus,
  onAsk,
  onOpenSource,
}: {
  item: VentureMemoryItem;
  stateVersion: number;
  copy: AiWorkspaceCopy["longRun"];
  onSetStatus: (status: VentureMemoryStatus) => void;
  onAsk: () => void;
  onOpenSource: () => void;
}) {
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [freshnessDismissed, setFreshnessDismissed] =
    React.useState(false);
  const [pendingUpdate, setPendingUpdate] = React.useState<{
    status: VentureMemoryStatus;
    expectedVersion: number;
  }>();
  const [versionConflict, setVersionConflict] =
    React.useState(false);
  const [comparisonOpen, setComparisonOpen] =
    React.useState(false);
  const stale =
    item.status === "outdated" ||
    item.status === "superseded";

  const clearPendingUpdate = () => {
    setPendingUpdate(undefined);
    setVersionConflict(false);
    setComparisonOpen(false);
  };

  const beginUpdate = (status: VentureMemoryStatus) => {
    setPendingUpdate({
      status,
      expectedVersion: stateVersion,
    });
    setVersionConflict(false);
    setComparisonOpen(false);
  };

  const applyPendingUpdate = () => {
    if (!pendingUpdate) return;
    const versionCheck = compareContextUpdateVersions(
      pendingUpdate.expectedVersion,
      stateVersion,
    );
    if (versionCheck.status === "conflict") {
      setVersionConflict(true);
      return;
    }
    onSetStatus(pendingUpdate.status);
    clearPendingUpdate();
  };

  return (
    <article className="rounded-xl border border-workspace-border bg-workspace-panel p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="workspace-supporting font-medium text-ink">
            {item.title}
          </h3>
          <p className="mt-1 workspace-meta leading-5 text-workspace-muted-text">
            {item.summary}
          </p>
        </div>
        <span className="shrink-0 rounded-pill border border-workspace-border bg-workspace-elevated px-2 py-0.5 workspace-meta text-workspace-muted-text">
          {copy.memory.statuses[item.status]}
        </span>
      </div>

      {stale && !freshnessDismissed ? (
        <div className="mt-2 flex gap-2 rounded-lg border border-workspace-warning/30 bg-workspace-warning-soft p-2">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-workspace-warning" />
          <div className="min-w-0">
            <p className="workspace-meta text-ink">
              {copy.memory.freshnessWarning}
            </p>
            <div className="mt-1 flex flex-wrap gap-1">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={onAsk}
              >
                {copy.memory.updateValue}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setFreshnessDismissed(true)}
              >
                {copy.memory.keepValue}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <dl className="mt-2 flex flex-wrap gap-x-3 gap-y-1 workspace-meta text-workspace-muted-text">
        <div>
          <dt className="sr-only">{copy.memory.sources(0)}</dt>
          <dd>{copy.memory.sources(item.sourceIds.length)}</dd>
        </div>
        <div>
          <dt className="sr-only">{copy.memory.updated}</dt>
          <dd>
            {copy.memory.updated}:{" "}
            {new Intl.DateTimeFormat("vi-VN").format(
              new Date(item.updatedAt),
            )}
          </dd>
        </div>
        <div>
          <dt className="sr-only">{copy.memory.createdBy}</dt>
          <dd>
            {copy.memory.createdBy}:{" "}
            {copy.memory.creators[item.createdBy]}
          </dd>
        </div>
      </dl>

      <div className="mt-2 flex flex-wrap gap-1">
        {item.status !== "verified" ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => beginUpdate("verified")}
          >
            <ShieldCheck className="size-3.5" />
            {copy.memory.confirm}
          </Button>
        ) : null}
        {item.status !== "disputed" ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => beginUpdate("disputed")}
          >
            {copy.memory.dispute}
          </Button>
        ) : null}
        {item.status !== "outdated" ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => beginUpdate("outdated")}
          >
            {copy.memory.markOutdated}
          </Button>
        ) : null}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onOpenSource}
        >
          <ExternalLink className="size-3.5" />
          {copy.common.openSource}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onAsk}
        >
          <Bot className="size-3.5" />
          {copy.common.askKizuna}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() =>
            setHistoryOpen((current) => !current)
          }
          aria-expanded={historyOpen}
        >
          <History className="size-3.5" />
          {copy.memory.viewHistory}
          <ChevronDown className="size-3.5" />
        </Button>
      </div>

      {pendingUpdate ? (
        <MemoryStatusUpdatePrompt
          currentStatus={item.status}
          pendingStatus={pendingUpdate.status}
          expectedVersion={pendingUpdate.expectedVersion}
          currentVersion={stateVersion}
          versionConflict={versionConflict}
          comparisonOpen={comparisonOpen}
          copy={copy}
          onApply={applyPendingUpdate}
          onReload={() => {
            setPendingUpdate({
              ...pendingUpdate,
              expectedVersion: stateVersion,
            });
            setVersionConflict(false);
            setComparisonOpen(false);
          }}
          onCompare={() =>
            setComparisonOpen((current) => !current)
          }
          onCancel={clearPendingUpdate}
        />
      ) : null}

      {historyOpen ? (
        <ol className="mt-2 space-y-2 border-t border-workspace-border pt-2">
          {item.history.length > 0 ? (
            item.history.map((entry) => (
              <li
                key={entry.id}
                className="workspace-meta text-workspace-muted-text"
              >
                <span className="font-medium text-ink">
                  {copy.memory.statuses[entry.status]}
                </span>{" "}
                · {entry.actor} ·{" "}
                {new Intl.DateTimeFormat("vi-VN").format(
                  new Date(entry.createdAt),
                )}
                <p>{entry.reason}</p>
              </li>
            ))
          ) : (
            <li className="workspace-meta text-workspace-muted-text">
              {copy.memory.noHistory}
            </li>
          )}
        </ol>
      ) : null}
    </article>
  );
}
