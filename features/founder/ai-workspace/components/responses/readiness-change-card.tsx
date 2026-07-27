import { ArrowRight, Gauge, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { AiWorkspaceCopy } from "../../copy/types";
import type { ReadinessState } from "../../types/ai-workspace.types";
import { ReadinessRing } from "../shared/readiness-ring";
import { ResponseCardShell } from "./response-card-shell";

export function ReadinessChangeCard({
  readiness,
  copy,
  onOpenCycle,
}: {
  readiness: ReadinessState;
  copy: AiWorkspaceCopy;
  onOpenCycle: () => void;
}) {
  return (
    <ResponseCardShell
      eyebrow={copy.response.readiness}
      title={readiness.explanation}
      icon={<Gauge className="size-4" />}
      actions={
        <Button size="sm" onClick={onOpenCycle}>
          {copy.response.openCycle}
          <ArrowRight className="size-3.5" />
        </Button>
      }
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <ReadinessRing
          score={readiness.currentScore}
          label={copy.response.readiness}
          size="compact"
        />
        <div className="min-w-0 flex-1">
          <p className="workspace-card-title text-ink">
            {readiness.label}
          </p>
          <p className="mt-1 workspace-supporting text-workspace-muted-text">
            {copy.response.cycleChange}:{" "}
            <span className="font-medium text-workspace-success">
              {readiness.delta > 0 ? "+" : ""}
              {readiness.delta}
            </span>
          </p>
          {readiness.delta > 0 ? (
            <p className="mt-2 inline-flex items-center gap-1 workspace-meta text-workspace-success">
              <TrendingUp className="size-3.5" />
              {readiness.currentScore - readiness.previousScore}{" "}
              {copy.response.pointsFromEvidence}
            </p>
          ) : null}
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {readiness.breakdown.map((dimension) => (
          <div key={dimension.id}>
            <div className="mb-1 flex items-center justify-between gap-3 workspace-meta">
              <span className="text-ink">{dimension.label}</span>
              <span className="font-tabular text-workspace-muted-text">
                {dimension.score}/100
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-workspace-elevated">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300 motion-reduce:transition-none"
                style={{ width: `${dimension.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="workspace-eyebrow text-workspace-muted-text">
            {copy.response.supportedBy}
          </dt>
          <dd className="mt-1">
            <ul className="space-y-1 workspace-meta text-ink">
              {readiness.supportedBy.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt className="workspace-eyebrow text-workspace-muted-text">
            {copy.response.missingEvidence}
          </dt>
          <dd className="mt-1">
            <ul className="space-y-1 workspace-meta text-ink">
              {readiness.missingEvidence.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>
      <div className="mt-4 rounded-lg border border-workspace-border bg-workspace-elevated px-3 py-2.5">
        <p className="workspace-eyebrow text-workspace-muted-text">
          {copy.response.unlockAction}
        </p>
        <p className="mt-1 workspace-meta text-ink">
          {readiness.unlockAction}
        </p>
      </div>
    </ResponseCardShell>
  );
}
