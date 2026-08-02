"use client";

import { Activity, RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { AiWorkspaceCopy } from "../copy/types";
import type { AiWorkspaceScenarioId } from "../types/ai-workspace.types";

const scenarioOrder: AiWorkspaceScenarioId[] = [
  "bottleneck",
  "materials",
  "readiness",
  "decision-cycle",
  "mentor",
  "error",
  "long-running",
  "search-pricing",
  "context-conflict",
  "stale-traction",
  "readiness-decrease",
  "safe-switch",
  "search-ask",
  "session-summary",
  "failed-response",
];

export function WorkspaceHeader({
  ventureName,
  ventureStage,
  scenarioId,
  copy,
  onScenarioChange,
  onReset,
  onOpenPulse,
}: {
  ventureName: string;
  ventureStage: string;
  scenarioId: AiWorkspaceScenarioId;
  copy: AiWorkspaceCopy;
  onScenarioChange: (scenarioId: AiWorkspaceScenarioId) => void;
  onReset: () => void;
  onOpenPulse: () => void;
}) {
  return (
    <header className="flex flex-col gap-3 border-b border-workspace-border pb-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="workspace-eyebrow text-primary">
            {copy.workspace.eyebrow}
          </p>
          <Badge
            variant="outline"
            className="rounded-pill border-workspace-border bg-workspace-elevated px-2 py-0.5 workspace-meta text-workspace-muted-text"
          >
            {copy.workspace.demoLabel}
          </Badge>
        </div>
        <h1 className="mt-1.5 workspace-page-title text-ink">
          {copy.workspace.title}
        </h1>
        <p className="mt-1 max-w-2xl workspace-supporting text-workspace-muted-text">
          {copy.workspace.description}
        </p>
        <p className="mt-1 workspace-meta text-workspace-muted-text">
          <span className="font-medium text-ink">{ventureName}</span>
          {" · "}
          {ventureStage}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={scenarioId}
          onValueChange={(value) =>
            onScenarioChange(value as AiWorkspaceScenarioId)
          }
        >
          <SelectTrigger
            size="sm"
            className="max-w-[220px] border-workspace-border bg-workspace-panel text-ink"
            aria-label={copy.workspace.scenarioLabel}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-workspace-border bg-workspace-panel">
            {scenarioOrder.map((scenario) => (
              <SelectItem key={scenario} value={scenario}>
                {copy.scenarios[scenario]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onReset}
          aria-label={copy.workspace.reset}
        >
          <RotateCcw className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpenPulse}
          className="xl:hidden"
        >
          <Activity className="size-3.5" />
          {copy.workspace.openPulse}
        </Button>
      </div>
    </header>
  );
}
