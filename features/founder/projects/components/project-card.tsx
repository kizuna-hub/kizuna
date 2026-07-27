"use client";

import {
  ArrowRight,
  FolderOpen,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCompactNextActionLabel } from "@/features/founder/projects/next-action-label";
import { getProjectCardDestination } from "@/features/founder/projects/project-portfolio";
import {
  getActiveDecisionForVenture,
  getNextActionForVenture,
  getVentureStageLabel,
  venturePhaseLabels,
} from "@/features/founder/venture-foundation/demo-repository";
import { useDemoWorkspace } from "@/features/founder/venture-foundation/demo-workspace-provider";
import type {
  ProjectsViewMode,
  Venture,
} from "@/features/founder/venture-foundation/types";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import { ProjectThumbnail } from "./project-thumbnail";

const projectStatusLabels: Record<Venture["status"], string> = {
  setup: "Setup",
  active: "Active",
  paused: "Paused",
  archived: "Archived",
};

function ProjectStatus({ status }: { status: Venture["status"] }) {
  return (
    <span className="inline-flex items-center gap-1.5 workspace-meta text-workspace-muted-text">
      <span
        className={cn(
          "size-1.5 rounded-full",
          status === "active" && "bg-workspace-success",
          status === "setup" && "bg-workspace-warning",
          status === "paused" && "bg-workspace-muted-text",
          status === "archived" && "bg-workspace-danger",
        )}
      />
      {projectStatusLabels[status]}
    </span>
  );
}

export function ProjectCard({
  venture,
  view,
  activityLabel,
}: {
  venture: Venture;
  view: ProjectsViewMode;
  activityLabel: string;
}) {
  const {
    state,
    setActiveVenture,
    setLastVisitedVenturePath,
  } = useDemoWorkspace();
  const decision = getActiveDecisionForVenture(state, venture.id);
  const nextAction = getNextActionForVenture(state, venture.id);
  const projectDestination = getProjectCardDestination(
    venture,
    nextAction.targetPath,
  );
  const compactActionLabel =
    venture.status === "active"
      ? "Open workspace"
      : getCompactNextActionLabel(
          projectDestination,
          nextAction.kind,
        );
  const overviewPath = `/founder/projects/${venture.id}`;

  const rememberDestination = (path: string) => {
    setActiveVenture(venture.id);
    setLastVisitedVenturePath(venture.id, path);
  };

  if (view === "list") {
    return (
      <article className="grid gap-4 rounded-xl border border-workspace-border bg-workspace-panel p-3.5 transition-colors hover:border-hairline-soft md:grid-cols-[minmax(220px,28%)_1fr]">
        <Link
          href={projectDestination}
          aria-label={`${compactActionLabel} for ${venture.name}`}
          onClick={() => rememberDestination(projectDestination)}
          className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/50"
        >
          <ProjectThumbnail
            venture={venture}
            className="h-full min-h-36 w-full"
          />
        </Link>

        <div className="flex min-w-0 flex-col">
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
              <p className="mt-1.5 line-clamp-2 workspace-supporting text-workspace-muted-text">
                {venture.oneLineDescription}
              </p>
            </div>
            <p className="shrink-0 workspace-meta text-workspace-muted-text">
              {activityLabel}
            </p>
          </div>

          <div className="mt-3 grid gap-3 border-y border-workspace-border py-3 sm:grid-cols-[130px_minmax(0,1fr)]">
            <div>
              <p className="workspace-eyebrow text-workspace-muted-text">
                Current phase
              </p>
              <p className="mt-1 workspace-supporting font-medium text-ink">
                {venturePhaseLabels[venture.currentPhase]}
              </p>
            </div>
            <div>
              <p className="workspace-eyebrow text-workspace-muted-text">
                Critical decision
              </p>
              <p className="mt-1 line-clamp-2 workspace-supporting font-medium text-ink">
                {decision?.title ?? "No active decision recorded"}
              </p>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-3 pt-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <ProjectStatus status={venture.status} />
                <span
                  aria-hidden="true"
                  className="text-workspace-border"
                >
                  /
                </span>
                <span className="workspace-meta text-workspace-muted-text">
                  {getVentureStageLabel(venture)}
                </span>
              </div>
              <p className="mt-1.5 line-clamp-1 workspace-supporting font-medium text-ink">
                {nextAction.label}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                asChild
                size="sm"
                className="workspace-control-text h-11 px-4 lg:h-9"
              >
                <Link
                  href={projectDestination}
                  aria-label={`${compactActionLabel} for ${venture.name}`}
                  onClick={() =>
                    rememberDestination(projectDestination)
                  }
                >
                  {compactActionLabel}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="workspace-control-text h-11 px-3 lg:h-9"
              >
                <Link
                  href={overviewPath}
                  aria-label={`Open ${venture.name} overview`}
                  onClick={() => rememberDestination(overviewPath)}
                >
                  <FolderOpen className="size-4" />
                  Overview
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group min-w-0">
      <Link
        href={projectDestination}
        aria-label={`${compactActionLabel} for ${venture.name}`}
        onClick={() => rememberDestination(projectDestination)}
        className="block rounded-xl outline-none transition-transform duration-200 motion-reduce:transform-none lg:hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/50"
      >
        <ProjectThumbnail
          venture={venture}
          className="transition-colors group-hover:border-primary-border"
        />
      </Link>

      <div className="flex items-start gap-3 px-0.5 pt-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-workspace-border bg-workspace-panel workspace-card-title text-primary">
          {venture.name.trim().charAt(0).toUpperCase() || "K"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="min-w-0 workspace-card-title text-ink">
              <Link
                href={projectDestination}
                onClick={() =>
                  rememberDestination(projectDestination)
                }
                className="line-clamp-1 rounded-sm outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/50"
              >
                {venture.name}
              </Link>
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
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <ProjectStatus status={venture.status} />
            <span
              aria-hidden="true"
              className="text-workspace-border"
            >
              /
            </span>
            <span className="workspace-meta text-workspace-muted-text">
              {getVentureStageLabel(venture)}
            </span>
          </div>
          <p className="mt-1 workspace-meta text-workspace-muted-text">
            {activityLabel}
          </p>
        </div>
      </div>
    </article>
  );
}
