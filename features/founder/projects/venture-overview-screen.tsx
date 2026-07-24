"use client";

import React from "react";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleHelp,
  Clock3,
  FolderKanban,
  Plus,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getCompactNextActionLabel } from "@/features/founder/projects/next-action-label";
import { FounderShell } from "@/features/founder/shell/founder-shell";
import {
  getSupportCoverageForVenture,
  getVentureStageLabel,
  getVentureOverviewData,
  supportRoleLabel,
  venturePhaseLabels,
} from "@/features/founder/venture-foundation/demo-repository";
import { useDemoWorkspace } from "@/features/founder/venture-foundation/demo-workspace-provider";
import type {
  NextAction,
  SupportRelationship,
  Venture,
  VentureDecision,
} from "@/features/founder/venture-foundation/types";
import { Link, usePathname } from "@/i18n/routing";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatSession(value: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function VentureIdentityHeader({ venture }: { venture: Venture }) {
  return (
    <header className="flex flex-col gap-3 border-b border-workspace-border pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="border-workspace-border bg-workspace-elevated text-workspace-muted-text"
          >
            {getVentureStageLabel(venture)}
          </Badge>
          <Badge
            variant="outline"
            className="border-workspace-success/30 bg-workspace-success-soft text-workspace-success"
          >
            {venture.status === "setup"
              ? "Setup"
              : venture.status === "paused"
                ? "Paused"
                : "Active"}
          </Badge>
        </div>
        <h1 className="mt-2.5 workspace-page-title text-ink">
          {venture.name}
        </h1>
        <p className="mt-1.5 max-w-2xl workspace-body text-workspace-muted-text">
          {venture.oneLineDescription}
        </p>
      </div>
      <p className="shrink-0 workspace-meta text-workspace-muted-text">
        Updated {formatDate(venture.lastUpdatedAt)}
      </p>
    </header>
  );
}

function CurrentDecisionPanel({
  venture,
  decision,
  actionPath,
  actionLabel,
  actionDescription,
  actionKind,
  reviewSummary,
  onContinue,
}: {
  venture: Venture;
  decision?: VentureDecision;
  actionPath: string;
  actionLabel: string;
  actionDescription?: string;
  actionKind?: NextAction["kind"];
  reviewSummary: {
    criticalCount: number;
    reviewedCriticalCount: number;
  };
  onContinue: () => void;
}) {
  const compactActionLabel = getCompactNextActionLabel(
    actionPath,
    actionKind,
  );

  return (
    <section className="rounded-xl border border-workspace-border bg-workspace-panel p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 workspace-eyebrow text-primary">
          <CircleHelp className="size-4" />
          Current phase
        </div>
        <p className="workspace-supporting font-medium text-ink">
          {venturePhaseLabels[venture.currentPhase]}
        </p>
      </div>

      <div className="mt-3 border-t border-workspace-border pt-3">
        <p className="workspace-eyebrow text-workspace-muted-text">
          {decision ? "Critical decision" : "Decision status"}
        </p>
        <h2 className="mt-2 max-w-3xl workspace-decision-title text-ink">
          {decision?.title ??
            (reviewSummary.criticalCount
              ? `${reviewSummary.criticalCount - reviewSummary.reviewedCriticalCount} critical ${reviewSummary.criticalCount - reviewSummary.reviewedCriticalCount === 1 ? "finding needs" : "findings need"} review`
              : "No active decision recorded")}
        </h2>
      </div>

      <div className="mt-3 flex items-start gap-3 rounded-lg border-l-2 border-workspace-warning bg-workspace-warning-soft px-3.5 py-3">
        <AlertCircle className="mt-0.5 size-4 shrink-0 text-workspace-warning" />
        <div>
          <p className="workspace-meta font-semibold text-ink">
            Why it matters
          </p>
          <p className="mt-1 workspace-supporting text-workspace-muted-text">
            {decision?.whyItMatters ??
              (reviewSummary.criticalCount
                ? "Review the highest-consequence assumptions before choosing which decision to resolve."
                : "Choose a critical decision before starting more work.")}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-3 border-t border-workspace-border pt-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="workspace-eyebrow text-workspace-muted-text">
            Next action
          </p>
          <p className="mt-1.5 workspace-body font-medium text-ink">
            {actionLabel}
          </p>
          {actionDescription ? (
            <p className="mt-1 workspace-meta text-workspace-muted-text">
              {actionDescription}
            </p>
          ) : null}
        </div>
        <Button
          asChild
          className="workspace-control-text h-11 shrink-0 px-4 lg:h-9"
        >
          <Link
            href={actionPath}
            aria-label={`${compactActionLabel} for ${venture.name}`}
            onClick={onContinue}
          >
            {compactActionLabel}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

function SupportSummary({
  venture,
  relationships,
}: {
  venture: Venture;
  relationships: SupportRelationship[];
}) {
  const { state } = useDemoWorkspace();
  const coverage = getSupportCoverageForVenture(state, venture.id);
  const primary = relationships[0];

  return (
    <section className="rounded-xl border border-workspace-border bg-workspace-panel p-4">
      <div className="flex items-center gap-2">
        <Users className="size-4 text-primary" />
        <h2 className="workspace-card-title text-ink">Support</h2>
      </div>

      {primary ? (
        <div className="mt-3">
          <p className="workspace-body font-medium text-ink">
            {primary.personName}
          </p>
          <p className="mt-0.5 workspace-meta text-workspace-muted-text">
            {supportRoleLabel(primary.role)} ·{" "}
            {primary.expertise.slice(0, 2).join(", ")}
          </p>
          {primary.nextSessionAt ? (
            <div className="mt-3 border-t border-workspace-border pt-3">
              <p className="flex items-center gap-2 workspace-meta text-workspace-muted-text">
                <CalendarDays className="size-3.5" />
                Next session
              </p>
              <p className="mt-1 workspace-supporting font-medium text-ink">
                {formatSession(primary.nextSessionAt)}
              </p>
              <Link
                href={`/founder/projects/${venture.id}/sessions`}
                aria-label={`Prepare a support session for ${venture.name}`}
                className="mt-2 inline-flex min-h-8 items-center gap-1 workspace-supporting font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40"
              >
                Prepare session
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          ) : null}
          {relationships.length > 1 ? (
            <p className="mt-3 workspace-meta text-workspace-muted-text">
              +{relationships.length - 1} active advisor
              {relationships.length - 1 === 1 ? "" : "s"}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="mt-3">
          <p className="workspace-body font-medium text-ink">
            No active support relationship
          </p>
          <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
            Continue independently until the venture context identifies a
            specific expertise gap.
          </p>
          {coverage.gap ? (
            <p className="mt-3 border-l-2 border-workspace-warning pl-3 workspace-meta text-ink">
              Gap: {coverage.gap}
            </p>
          ) : null}
        </div>
      )}
    </section>
  );
}

function InvalidVentureState({ ventureId }: { ventureId: string }) {
  return (
    <FounderShell contentWidth="focused">
      <section className="mx-auto max-w-2xl rounded-xl border border-workspace-border bg-workspace-panel p-5">
        <p className="workspace-eyebrow text-workspace-danger">
          Project unavailable
        </p>
        <h1 className="mt-2 workspace-decision-title text-ink">
          This project workspace cannot be opened.
        </h1>
        <p className="mt-2 workspace-supporting text-workspace-muted-text">
          Kizuna could not find an active project for “{ventureId}”. It
          may be archived or the link may be invalid.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button asChild className="workspace-control-text h-11 px-4 lg:h-9">
            <Link href="/founder/projects">
              <FolderKanban className="size-4" />
              View projects
            </Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            className="workspace-control-text h-11 px-4 lg:h-9"
          >
            <Link href="/submit-project">
              <Plus className="size-4" />
              New project
            </Link>
          </Button>
        </div>
      </section>
    </FounderShell>
  );
}

export function VentureOverviewScreen({
  ventureId,
}: {
  ventureId: string;
}) {
  const pathname = usePathname();
  const {
    state,
    setActiveVenture,
    setLastVisitedVenturePath,
  } = useDemoWorkspace();
  const overview = getVentureOverviewData(state, ventureId);
  const validVenture = overview?.venture;

  React.useEffect(() => {
    if (!validVenture) return;
    setActiveVenture(validVenture.id);
    setLastVisitedVenturePath(validVenture.id, pathname);
  }, [
    pathname,
    setActiveVenture,
    setLastVisitedVenturePath,
    validVenture?.id,
  ]);

  if (!validVenture) {
    return <InvalidVentureState ventureId={ventureId} />;
  }

  const {
    decision,
    action,
    relationships,
    cycle,
    program,
    activities,
    feedback,
    evidence,
    experiment,
    evidenceRequirements,
    cycleTasks,
    reviewSummary,
  } = overview;

  return (
    <FounderShell ventureId={validVenture.id}>
      <div className="space-y-5">
        <VentureIdentityHeader venture={validVenture} />

        <div className="grid items-start gap-3 xl:grid-cols-[minmax(0,1fr)_304px]">
          <CurrentDecisionPanel
            venture={validVenture}
            decision={decision}
            actionPath={action.targetPath}
            actionLabel={action.label}
            actionDescription={action.description}
            actionKind={action.kind}
            reviewSummary={reviewSummary}
            onContinue={() => {
              setActiveVenture(validVenture.id);
              setLastVisitedVenturePath(
                validVenture.id,
                action.targetPath,
              );
            }}
          />
          <SupportSummary
            venture={validVenture}
            relationships={relationships}
          />
        </div>

        <section className="grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
          <div className="rounded-xl border border-workspace-border bg-workspace-panel p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="workspace-section-title text-ink">
                Current cycle
              </h2>
              <Clock3 className="size-4 text-workspace-muted-text" />
            </div>
            {cycle ? (
              <>
                <p className="mt-3 workspace-body font-medium text-ink">
                  {cycle.title}
                </p>
                <div className="mt-3 flex items-center justify-between workspace-meta text-workspace-muted-text">
                  <span className="capitalize">
                    {cycle.status.replace("-", " ")}
                  </span>
                  <span>{cycle.progress}%</span>
                </div>
                <Progress
                  value={cycle.progress}
                  aria-label={`${cycle.title} ${cycle.progress}% complete`}
                  className="mt-2 bg-workspace-elevated"
                />
                {experiment ? (
                  <>
                    <p className="mt-3 rounded-lg bg-workspace-elevated px-3 py-2.5 workspace-supporting text-ink">
                      {experiment.hypothesis}
                    </p>
                    <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-workspace-border pt-3 sm:grid-cols-4">
                      <div>
                        <dt className="workspace-meta text-workspace-muted-text">
                          Owner
                        </dt>
                        <dd className="mt-1 workspace-supporting font-semibold text-ink">
                          {experiment.ownerId ===
                          state.currentUser.id
                            ? state.currentUser.name
                            : experiment.ownerId}
                        </dd>
                      </div>
                      <div>
                        <dt className="workspace-meta text-workspace-muted-text">
                          Timebox
                        </dt>
                        <dd className="mt-1 workspace-supporting font-semibold text-ink">
                          {experiment.timeboxDays} days
                        </dd>
                      </div>
                      <div>
                        <dt className="workspace-meta text-workspace-muted-text">
                          Evidence target
                        </dt>
                        <dd className="mt-1 workspace-supporting font-semibold text-ink">
                          {evidenceRequirements.length} requirement
                          {evidenceRequirements.length === 1
                            ? ""
                            : "s"}
                        </dd>
                      </div>
                      <div>
                        <dt className="workspace-meta text-workspace-muted-text">
                          Tasks
                        </dt>
                        <dd className="mt-1 workspace-supporting font-semibold text-ink">
                          {cycleTasks.length} planned
                        </dd>
                      </div>
                    </dl>
                  </>
                ) : null}
              </>
            ) : (
              <>
                <p className="mt-3 workspace-body font-medium text-ink">
                  No cycle committed yet
                </p>
                <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
                  Clarify the active decision before committing a cycle.
                </p>
              </>
            )}
          </div>

          <div className="rounded-xl border border-workspace-border bg-workspace-panel p-4">
            <h2 className="workspace-card-title text-ink">
              Progress since last review
            </h2>
            <dl className="mt-3 space-y-3">
              <div>
                <dt className="workspace-eyebrow text-workspace-muted-text">
                  What changed
                </dt>
                <dd className="mt-1 workspace-supporting text-ink">
                  {validVenture.overallProgress?.recentChange ??
                    "No recent change recorded."}
                </dd>
              </div>
              <div>
                <dt className="workspace-eyebrow text-workspace-muted-text">
                  Main unresolved gap
                </dt>
                <dd className="mt-1 workspace-supporting text-ink">
                  {validVenture.overallProgress?.unresolvedGap ??
                    "Choose the next critical decision."}
                </dd>
              </div>
            </dl>

            <div className="mt-4 border-t border-workspace-border pt-4">
              <h3 className="workspace-card-title text-ink">Context</h3>
              {program ? (
                <div className="mt-2">
                  <p className="workspace-supporting font-medium text-ink">
                    {program.name}
                  </p>
                  <p className="mt-0.5 workspace-meta text-workspace-muted-text">
                    {program.currentModule}
                  </p>
                  {program.nextDeliverable ? (
                    <p className="mt-2 workspace-meta text-ink">
                      Next: {program.nextDeliverable}
                    </p>
                  ) : null}
                </div>
              ) : feedback.length > 1 ? (
                <div className="mt-2">
                  <p className="workspace-supporting font-medium text-ink">
                    Conflicting advice recorded
                  </p>
                  <p className="mt-1 workspace-meta text-workspace-muted-text">
                    {feedback.length} recommendations need a shared
                    decision rule.
                  </p>
                </div>
              ) : evidence.length ? (
                <div className="mt-2">
                  <p className="flex items-center gap-2 workspace-supporting font-medium text-ink">
                    <CheckCircle2 className="size-4 text-workspace-success" />
                    {evidence.length} evidence source
                  </p>
                  <p className="mt-1 workspace-meta text-workspace-muted-text">
                    {evidence[0].summary}
                  </p>
                </div>
              ) : (
                <p className="mt-2 workspace-meta text-workspace-muted-text">
                  No active program or reviewed evidence is attached.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-workspace-border bg-workspace-panel p-4">
          <h2 className="workspace-section-title text-ink">
            Recent venture activity
          </h2>
          {activities.length ? (
            <div className="mt-3 divide-y divide-workspace-border">
              {activities.slice(0, 4).map((activity) => (
                <div
                  key={activity.id}
                  className="flex flex-col gap-1 py-2.5 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
                >
                  <p className="workspace-supporting text-ink">
                    {activity.message}
                  </p>
                  <p className="shrink-0 workspace-meta text-workspace-muted-text">
                    {formatDate(activity.occurredAt)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 workspace-supporting text-workspace-muted-text">
              No recent activity recorded.
            </p>
          )}
        </section>
      </div>
    </FounderShell>
  );
}
