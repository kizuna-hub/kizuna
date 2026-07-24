"use client";

import React from "react";
import { ArrowRight, FolderOpen, Plus, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCompactNextActionLabel } from "@/features/founder/projects/next-action-label";
import { FounderShell } from "@/features/founder/shell/founder-shell";
import {
  getActiveDecisionForVenture,
  getAllVentures,
  getFilteredVentures,
  getNextActionForVenture,
  getVentureStageLabel,
  venturePhaseLabels,
  ventureStageLabels,
} from "@/features/founder/venture-foundation/demo-repository";
import { useDemoWorkspace } from "@/features/founder/venture-foundation/demo-workspace-provider";
import type {
  Venture,
  VentureStage,
} from "@/features/founder/venture-foundation/types";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function ProjectPortfolioItem({
  venture,
}: {
  venture: Venture;
}) {
  const {
    state,
    setActiveVenture,
    setLastVisitedVenturePath,
  } = useDemoWorkspace();
  const decision = getActiveDecisionForVenture(state, venture.id);
  const nextAction = getNextActionForVenture(state, venture.id);
  const compactActionLabel = getCompactNextActionLabel(
    nextAction.targetPath,
    nextAction.kind,
  );
  const overviewPath = `/founder/projects/${venture.id}`;

  const rememberDestination = (path: string) => {
    setActiveVenture(venture.id);
    setLastVisitedVenturePath(venture.id, path);
  };

  return (
    <article className="rounded-xl border border-workspace-border bg-workspace-panel p-4 transition-colors hover:border-hairline-soft">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="workspace-card-title text-ink">
                {venture.name}
              </h2>
              {venture.status === "setup" ? (
                <Badge
                  variant="outline"
                  className="border-workspace-warning/30 bg-workspace-warning-soft text-workspace-warning"
                >
                  Setup
                </Badge>
              ) : null}
            </div>
            <p className="mt-1.5 max-w-3xl workspace-supporting text-workspace-muted-text">
              {venture.oneLineDescription}
            </p>
          </div>
          <p className="shrink-0 workspace-meta text-workspace-muted-text">
            {getVentureStageLabel(venture)} · Updated{" "}
            {formatUpdatedAt(venture.lastUpdatedAt)}
          </p>
        </div>

        <div className="grid gap-3 border-y border-workspace-border py-3 md:grid-cols-[152px_minmax(0,1fr)]">
          <div>
            <p className="workspace-eyebrow text-workspace-muted-text">
              Current phase
            </p>
            <p className="mt-1.5 workspace-body font-medium text-ink">
              {venturePhaseLabels[venture.currentPhase]}
            </p>
          </div>
          <div>
            <p className="workspace-eyebrow text-workspace-muted-text">
              Critical decision
            </p>
            <p className="mt-1.5 workspace-body font-medium text-ink">
              {decision?.title ?? "No active decision recorded"}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="workspace-eyebrow text-workspace-muted-text">
              Next action
            </p>
            <p className="mt-1.5 workspace-body font-medium text-ink">
              {nextAction.label}
            </p>
            {nextAction.description ? (
              <p className="mt-1 workspace-meta text-workspace-muted-text">
                {nextAction.description}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild className="workspace-control-text h-11 px-4 lg:h-9">
              <Link
                href={nextAction.targetPath}
                aria-label={`${compactActionLabel} for ${venture.name}`}
                onClick={() =>
                  rememberDestination(nextAction.targetPath)
                }
              >
                {compactActionLabel}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="workspace-control-text h-11 px-3 lg:h-9"
            >
              <Link
                href={overviewPath}
                aria-label={`Open ${venture.name} overview`}
                onClick={() => rememberDestination(overviewPath)}
              >
                <FolderOpen className="size-4" />
                Open overview
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ProjectsScreen() {
  const searchParams = useSearchParams();
  const { state, updateUiPreferences } = useDemoWorkspace();
  const ventures = getAllVentures(state);
  const [query, setQuery] = React.useState(
    state.uiPreferences.projectsQuery,
  );
  const [stage, setStage] = React.useState<VentureStage | "all">(
    state.uiPreferences.projectsStageFilter,
  );
  const notice = searchParams.get("notice");

  const stages = React.useMemo(
    () =>
      Array.from(new Set(ventures.map((venture) => venture.stage))),
    [ventures],
  );

  const visibleVentures = React.useMemo(
    () => getFilteredVentures(state, { query, stage }),
    [query, stage, state],
  );

  const updateQuery = (value: string) => {
    setQuery(value);
    updateUiPreferences({ projectsQuery: value });
  };

  const updateStage = (value: VentureStage | "all") => {
    setStage(value);
    updateUiPreferences({ projectsStageFilter: value });
  };

  return (
    <FounderShell>
      <div className="space-y-5">
        <header className="flex flex-col gap-3 border-b border-workspace-border pb-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="workspace-eyebrow text-primary">
              Project portfolio
            </p>
            <h1 className="mt-1.5 workspace-page-title text-ink">
              Projects
            </h1>
            <p className="mt-1.5 max-w-2xl workspace-body text-workspace-muted-text">
              Manage and continue your startup workspaces.
            </p>
          </div>
          <Button asChild className="workspace-control-text h-11 px-4 lg:h-9">
            <Link href="/submit-project">
              <Plus className="size-4" />
              New project
            </Link>
          </Button>
        </header>

        {notice === "archived" ? (
          <div
            role="status"
            className="rounded-xl border border-workspace-warning/30 bg-workspace-warning-soft px-4 py-3 text-body-framer-sm text-ink"
          >
            The previously active project is archived. Choose an active
            project to continue.
          </div>
        ) : null}

        <section
          aria-label="Project filters"
          className="flex flex-col gap-3 sm:flex-row"
        >
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search projects</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-workspace-muted-text" />
            <Input
              value={query}
              onChange={(event) => updateQuery(event.target.value)}
              placeholder="Search projects"
              className="workspace-input-text h-11 border-workspace-border bg-workspace-panel pl-10 lg:h-9"
            />
          </label>
          <label>
            <span className="sr-only">Filter by stage</span>
            <select
              value={stage}
              onChange={(event) =>
                updateStage(
                  event.target.value as VentureStage | "all",
                )
              }
              className="workspace-input-text h-11 min-w-44 rounded-md border border-workspace-border bg-workspace-panel px-3 text-ink outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40 lg:h-9"
            >
              <option value="all">All stages</option>
              {stages.map((stageValue) => (
                <option key={stageValue} value={stageValue}>
                  {ventureStageLabels[stageValue]}
                </option>
              ))}
            </select>
          </label>
        </section>

        {visibleVentures.length ? (
          <section
            aria-label={`${visibleVentures.length} projects`}
            className="space-y-3"
          >
            {visibleVentures.map((venture) => (
              <ProjectPortfolioItem
                key={venture.id}
                venture={venture}
              />
            ))}
          </section>
        ) : (
          <section className="rounded-xl border border-workspace-border bg-workspace-panel p-4 text-center">
            <h2 className="workspace-card-title text-ink">
              {ventures.length
                ? "No projects match these filters"
                : "Create your first project"}
            </h2>
            <p className="mx-auto mt-2 max-w-lg workspace-supporting text-workspace-muted-text">
              {ventures.length
                ? "Clear the search or choose another stage."
                : "Add the minimum venture context, then open a decision-led workspace."}
            </p>
            {ventures.length ? (
              <Button
                variant="secondary"
                className="mt-5"
                onClick={() => {
                  updateQuery("");
                  updateStage("all");
                }}
              >
                Clear filters
              </Button>
            ) : (
              <Button asChild className="mt-5">
                <Link href="/submit-project">New project</Link>
              </Button>
            )}
          </section>
        )}

        <p
          className={cn(
            "workspace-meta text-workspace-muted-text",
            visibleVentures.length === ventures.length && "sr-only",
          )}
          aria-live="polite"
        >
          Showing {visibleVentures.length} of {ventures.length} projects.
        </p>
      </div>
    </FounderShell>
  );
}
