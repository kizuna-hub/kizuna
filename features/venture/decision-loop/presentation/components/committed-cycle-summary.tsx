"use client";

import type { VentureId } from "../../../core";
import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDemoWorkspace } from "@/features/founder/venture-foundation/demo-workspace-provider";
import { getActiveActionCycle, getCycleTasksForExperiment, getEvidenceRequirementsForExperiment } from "../../application";

export function CommittedCycleSummary({
  state,
  ventureId,
  onStart,
}: {
  state: ReturnType<typeof useDemoWorkspace>["state"];
  ventureId: VentureId;
  onStart: () => void;
}) {
  const cycle = getActiveActionCycle(state, ventureId);
  if (!cycle) return null;
  const experiment = cycle.experimentId
    ? state.experiments.find(
        (candidate) => candidate.id === cycle.experimentId,
      )
    : undefined;
  const owner = state.currentUser.id === cycle.ownerId
    ? state.currentUser.name
    : cycle.ownerId;
  const requirements = experiment
    ? getEvidenceRequirementsForExperiment(
        state,
        experiment.id,
      )
    : [];
  const tasks = experiment
    ? getCycleTasksForExperiment(state, experiment.id)
    : [];

  return (
    <section className="rounded-xl border border-primary-border bg-primary-soft p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge className="capitalize">
            {cycle.status.replace("-", " ")}
          </Badge>
          <h2 className="mt-3 workspace-decision-title text-ink">
            {cycle.title}
          </h2>
          <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
            {cycle.hypothesis}
          </p>
        </div>
        {cycle.status === "committed" ? (
          <Button onClick={onStart}>
            <Play className="size-4" />
            Start cycle
          </Button>
        ) : null}
      </div>
      <dl className="mt-4 grid gap-3 border-t border-primary-border pt-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="workspace-meta text-workspace-muted-text">
            Owner
          </dt>
          <dd className="mt-1 workspace-supporting font-semibold text-ink">
            {owner}
          </dd>
        </div>
        <div>
          <dt className="workspace-meta text-workspace-muted-text">
            Timebox
          </dt>
          <dd className="mt-1 workspace-supporting font-semibold text-ink">
            {cycle.timeboxDays} days
          </dd>
        </div>
        <div>
          <dt className="workspace-meta text-workspace-muted-text">
            Evidence target
          </dt>
          <dd className="mt-1 workspace-supporting font-semibold text-ink">
            {requirements.length} requirement
            {requirements.length === 1 ? "" : "s"}
          </dd>
        </div>
        <div>
          <dt className="workspace-meta text-workspace-muted-text">
            Tasks
          </dt>
          <dd className="mt-1 workspace-supporting font-semibold text-ink">
            {tasks.length} planned
          </dd>
        </div>
      </dl>
      <div className="mt-4 rounded-lg bg-workspace-panel px-3.5 py-3">
        <p className="workspace-meta font-semibold text-ink">
          Execution boundary
        </p>
        <p className="mt-1 workspace-supporting text-workspace-muted-text">
          Starting this cycle schedules focused work only. Planning and
          task progress do not create accepted evidence, outcomes, or
          readiness gains.
        </p>
      </div>
    </section>
  );
}
