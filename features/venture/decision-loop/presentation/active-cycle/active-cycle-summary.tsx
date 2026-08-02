"use client";

import {
  CheckCircle2,
  CircleDot,
  Clock3,
  FileSearch,
  History,
  ListChecks,
  Play,
  Target,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import type { VentureId } from "../../../core";
import type { CycleTask } from "../../domain";
import {
  getActiveCycleSummary,
  type VentureWorkspaceState,
} from "../../application";

function CriteriaList({
  title,
  items,
}: {
  title: string;
  items?: string[];
}) {
  if (!items?.length) return null;
  return (
    <div>
      <p className="workspace-meta font-semibold text-ink">{title}</p>
      <ul className="mt-1.5 space-y-1 workspace-meta text-workspace-muted-text">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden="true">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ActiveCycleSummary({
  state,
  ventureId,
  onStart,
  onUpdateTask,
  onReviewReasoning,
}: {
  state: VentureWorkspaceState;
  ventureId: VentureId;
  onStart: () => void;
  onUpdateTask: (
    taskId: string,
    status: CycleTask["status"],
  ) => void;
  onReviewReasoning: () => void;
}) {
  const summary = getActiveCycleSummary(state, ventureId);
  if (!summary) return null;

  const {
    cycle,
    decision,
    experiment,
    founderRationale,
    tasks,
    completedTaskCount,
    requirements,
    nextTask,
  } = summary;
  const progress = tasks.length
    ? Math.round((completedTaskCount / tasks.length) * 100)
    : 0;
  const owner =
    cycle.ownerId === state.currentUser.id
      ? state.currentUser.name
      : cycle.ownerId;
  const started = cycle.status === "in-progress";

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-primary-border bg-primary-soft p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <Badge className="capitalize">
              {cycle.status.replace("-", " ")}
            </Badge>
            <h2 className="mt-3 workspace-decision-title text-ink">
              {cycle.title}
            </h2>
            <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
              {decision?.title}
            </p>
          </div>
          {cycle.status === "committed" ? (
            <Button onClick={onStart}>
              <Play className="size-4" />
              Start cycle
            </Button>
          ) : null}
        </div>

        <div className="mt-4 grid gap-3 border-t border-primary-border pt-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="workspace-meta text-workspace-muted-text">
              Owner
            </p>
            <p className="mt-1 workspace-supporting font-semibold text-ink">
              {owner}
            </p>
          </div>
          <div>
            <p className="workspace-meta text-workspace-muted-text">
              Timebox
            </p>
            <p className="mt-1 workspace-supporting font-semibold text-ink">
              {cycle.timeboxDays} days
            </p>
          </div>
          <div>
            <p className="workspace-meta text-workspace-muted-text">
              Evidence targets
            </p>
            <p className="mt-1 workspace-supporting font-semibold text-ink">
              {requirements.length}
            </p>
          </div>
          <div>
            <p className="workspace-meta text-workspace-muted-text">
              Task progress
            </p>
            <p className="mt-1 workspace-supporting font-semibold text-ink">
              {completedTaskCount}/{tasks.length} complete
            </p>
          </div>
        </div>
        <Progress
          value={progress}
          className="mt-3 bg-workspace-panel"
          aria-label={`${progress}% of active cycle tasks complete`}
        />
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <article className="rounded-xl border border-workspace-border bg-workspace-panel p-4">
          <div className="flex items-center gap-2">
            <Target className="size-4 text-primary" aria-hidden="true" />
            <h2 className="workspace-section-title text-ink">
              Decision and rationale
            </h2>
          </div>
          <p className="mt-3 workspace-body font-semibold text-ink">
            {decision?.title}
          </p>
          <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
            {founderRationale ??
              "No founder rationale was captured for this cycle."}
          </p>
        </article>

        <article className="rounded-xl border border-workspace-border bg-workspace-panel p-4">
          <div className="flex items-center gap-2">
            <Clock3 className="size-4 text-primary" aria-hidden="true" />
            <h2 className="workspace-section-title text-ink">
              Current next action
            </h2>
          </div>
          <p className="mt-3 workspace-body font-semibold text-ink">
            {cycle.status === "committed"
              ? "Start the committed cycle"
              : nextTask?.title ?? "Review cycle progress"}
          </p>
          <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
            {cycle.status === "committed"
              ? "Begin the focused tasks when the owner is ready."
              : nextTask
                ? `Move this task forward from ${nextTask.status.replace("-", " ")}.`
                : "All planned tasks are complete; review the exit criteria."}
          </p>
        </article>
      </section>

      <section className="rounded-xl border border-workspace-border bg-workspace-panel p-4">
        <h2 className="workspace-section-title text-ink">
          Hypothesis and experiment
        </h2>
        <p className="mt-3 workspace-body font-semibold text-ink">
          {cycle.hypothesis}
        </p>
        <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
          {experiment?.method}
        </p>
        <div className="mt-4 grid gap-3 border-t border-workspace-border pt-4 sm:grid-cols-2">
          <div>
            <p className="workspace-meta font-semibold text-ink">
              Expected signal
            </p>
            <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
              {cycle.expectedSignal}
            </p>
          </div>
          <div>
            <p className="workspace-meta font-semibold text-ink">
              Failure signal
            </p>
            <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
              {cycle.failureSignal}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-workspace-border bg-workspace-panel p-4">
        <div className="flex items-center gap-2">
          <FileSearch className="size-4 text-primary" aria-hidden="true" />
          <h2 className="workspace-section-title text-ink">
            Evidence requirements
          </h2>
        </div>
        <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
          These are collection targets, not accepted evidence.
        </p>
        <div className="mt-3 divide-y divide-workspace-border">
          {requirements.map((requirement) => (
            <div key={requirement.id} className="py-3 first:pt-0">
              <p className="workspace-supporting font-semibold text-ink">
                {requirement.label}
              </p>
              <p className="mt-1 workspace-meta text-workspace-muted-text">
                {requirement.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-workspace-border bg-workspace-panel p-4">
        <div className="flex items-center gap-2">
          <ListChecks className="size-4 text-primary" aria-hidden="true" />
          <h2 className="workspace-section-title text-ink">
            Cycle tasks
          </h2>
        </div>
        {!started ? (
          <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
            Start the cycle before updating task progress.
          </p>
        ) : null}
        <div className="mt-3 divide-y divide-workspace-border">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex flex-col gap-2 py-3 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-2">
                {task.status === "done" ? (
                  <CheckCircle2
                    className="mt-0.5 size-4 shrink-0 text-workspace-success"
                    aria-hidden="true"
                  />
                ) : (
                  <CircleDot
                    className="mt-1 size-3 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                )}
                <p className="workspace-supporting font-medium text-ink">
                  {task.title}
                </p>
              </div>
              <select
                aria-label={`Status for ${task.title}`}
                value={task.status}
                disabled={!started}
                onChange={(event) =>
                  onUpdateTask(
                    task.id,
                    event.target.value as CycleTask["status"],
                  )
                }
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm text-ink disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                <option value="not-started">Not started</option>
                <option value="in-progress">In progress</option>
                <option value="blocked">Blocked</option>
                <option value="done">Done</option>
              </select>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-workspace-border bg-workspace-panel p-4">
        <h2 className="workspace-section-title text-ink">
          Exit and scope guard
        </h2>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          <CriteriaList
            title="Exit criteria"
            items={cycle.exitCriteria}
          />
          <CriteriaList
            title="Stop conditions"
            items={cycle.stopConditions}
          />
          <CriteriaList
            title="What not to do"
            items={cycle.whatNotToDo}
          />
        </div>
      </section>

      <div className="flex justify-start">
        <Button variant="ghost" onClick={onReviewReasoning}>
          <History className="size-4" />
          Review reasoning
        </Button>
      </div>
    </div>
  );
}
