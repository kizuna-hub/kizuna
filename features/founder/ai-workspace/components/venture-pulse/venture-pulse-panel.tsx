import {
  ArrowRight,
  Focus,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { AiWorkspaceCopy } from "../../copy/types";
import { getDecisionCycleProgress } from "../../state/ai-workspace-selectors";
import type { AiWorkspaceState } from "../../types/ai-workspace.types";
import { ReadinessRing } from "../shared/readiness-ring";
import { StatusBadge } from "../shared/status-badge";

export function VenturePulsePanel({
  state,
  copy,
  onExplainReadiness,
  onOpenCycle,
}: {
  state: AiWorkspaceState;
  copy: AiWorkspaceCopy;
  onExplainReadiness: () => void;
  onOpenCycle: () => void;
}) {
  const progress = getDecisionCycleProgress(state);

  return (
    <aside
      className="flex h-full min-h-0 flex-col bg-workspace-panel"
      aria-label={copy.pulse.title}
    >
      <div className="border-b border-workspace-border px-4 py-3.5">
        <h2 className="workspace-section-title text-ink">
          {copy.pulse.title}
        </h2>
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
        <section className="border-b border-workspace-border p-4">
          <div className="flex items-center gap-3">
            <ReadinessRing
              score={state.readiness.currentScore}
              label={copy.pulse.readiness}
              size="compact"
            />
            <div className="min-w-0">
              <p className="workspace-eyebrow text-workspace-muted-text">
                {copy.pulse.readiness}
              </p>
              <p className="mt-1 workspace-card-title text-ink">
                {state.readiness.label}
              </p>
              <p className="mt-1 font-tabular workspace-meta text-workspace-success">
                {state.readiness.delta > 0
                  ? `+${state.readiness.delta}`
                  : state.readiness.delta}{" "}
                · {state.readiness.currentScore}/100
              </p>
              <button
                type="button"
                onClick={onExplainReadiness}
                className="mt-2 text-left workspace-meta font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40"
              >
                {copy.pulse.explain}
              </button>
            </div>
          </div>
        </section>

        <section className="border-b border-workspace-border p-4">
          <div className="flex items-center gap-2">
            <Focus className="size-3.5 text-primary" />
            <h3 className="workspace-eyebrow text-workspace-muted-text">
              {copy.pulse.currentFocus}
            </h3>
          </div>
          <p className="mt-2 workspace-card-title text-ink">
            {state.currentFocus.bottleneck}
          </p>
          <p className="mt-1.5 workspace-meta text-workspace-muted-text">
            {state.currentFocus.whyItMatters}
          </p>
          <div className="mt-3 rounded-lg border border-workspace-border bg-workspace-elevated px-3 py-2.5">
            <p className="workspace-eyebrow text-workspace-muted-text">
              {copy.response.nextAction}
            </p>
            <p className="mt-1 workspace-meta text-ink">
              {state.currentFocus.nextAction}
            </p>
          </div>
          <Button
            size="sm"
            className="mt-3 w-full"
            onClick={onOpenCycle}
          >
            {copy.response.openCycle}
            <ArrowRight className="size-3.5" />
          </Button>
        </section>

        <section className="p-4">
          {state.view === "decision-cycle" ? (
            <>
              <div className="flex items-center justify-between gap-3">
                <h3 className="workspace-eyebrow text-workspace-muted-text">
                  {copy.pulse.cycleProgress}
                </h3>
                <span className="font-tabular workspace-meta text-ink">
                  {progress}%
                </span>
              </div>
              <div
                className="mt-2 h-1.5 overflow-hidden rounded-full bg-workspace-elevated"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-200 motion-reduce:transition-none"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-3 workspace-meta text-workspace-muted-text">
                {
                  copy.cycle.steps[
                    state.decisionCycle.currentStep
                  ].description
                }
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-3.5 text-primary" />
                <h3 className="workspace-eyebrow text-workspace-muted-text">
                  {copy.pulse.evidenceHealth}
                </h3>
              </div>
              <ul className="mt-2 divide-y divide-workspace-border">
                {state.evidenceHealth.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-2 py-2 first:pt-0 last:pb-0"
                  >
                    <span className="min-w-0 truncate workspace-meta text-ink">
                      {item.label}
                    </span>
                    <StatusBadge
                      status={item.status}
                      copy={copy.statuses}
                    />
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
    </aside>
  );
}
