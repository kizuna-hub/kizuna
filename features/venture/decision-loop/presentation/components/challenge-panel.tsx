"use client";

import {
  AlertTriangle,
  ArrowRight,
  LockKeyhole,
  ScanSearch,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "@/i18n/routing";

import type { VentureId } from "../../../core";
import type { ChallengeFounderResponse } from "../../domain";
import {
  getBaselineCompleteness,
  getCriticalReviewItems,
  getCurrentChallengeScan,
  getImportantReviewItems,
  getReviewSummary,
  getSupportingReviewItems,
  type VentureWorkspaceState,
} from "../../application";
import {
  ReviewDisclosure,
  ReviewItemCard,
} from "../review/challenge-review-item";

export function ChallengePanel({
  ventureId,
  onRun,
  onResponse,
  onNote,
  onContinue,
  state,
}: {
  ventureId: VentureId;
  onRun: () => void;
  onResponse: (
    itemId: string,
    response: ChallengeFounderResponse,
  ) => void;
  onNote: (itemId: string, note: string) => void;
  onContinue: () => void;
  state: VentureWorkspaceState;
}) {
  const scan = getCurrentChallengeScan(state, ventureId);
  const completeness = getBaselineCompleteness(state, ventureId);
  const summary = getReviewSummary(state, ventureId);
  const criticalItems = getCriticalReviewItems(
    state,
    ventureId,
  ).map(({ item }) => item);
  const importantItems = getImportantReviewItems(
    state,
    ventureId,
  ).map(({ item }) => item);
  const supportingItems = getSupportingReviewItems(
    state,
    ventureId,
  ).map(({ item }) => item);
  const sourceById = new Map(
    state.sources
      .filter((source) => source.ventureId === ventureId)
      .map((source) => [source.id, source.title]),
  );
  const reviewPercentage = summary.criticalCount
    ? Math.round(
        (summary.reviewedCriticalCount / summary.criticalCount) * 100,
      )
    : 0;

  if (!completeness.canRunChallengeScan && !scan) {
    return (
      <section className="rounded-xl border border-workspace-border bg-workspace-panel p-5">
        <LockKeyhole className="size-5 text-workspace-warning" />
        <h2 className="mt-3 workspace-section-title text-ink">
          Confirm the venture baseline first
        </h2>
        <p className="mt-1.5 max-w-2xl workspace-supporting text-workspace-muted-text">
          Review needs a confirmed minimum baseline and at least one
          reviewed source.
        </p>
        <Button asChild className="mt-4">
          <Link href={`/founder/projects/${ventureId}/context`}>
            Review venture context
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </section>
    );
  }

  if (!scan) {
    return (
      <section className="rounded-xl border border-workspace-border bg-workspace-panel p-5">
        <ScanSearch className="size-5 text-primary" />
        <h2 className="mt-3 workspace-section-title text-ink">
          Review claims and assumptions
        </h2>
        <p className="mt-1.5 max-w-2xl workspace-supporting text-workspace-muted-text">
          Generate a deterministic review of what the baseline supports,
          assumes, contradicts, or leaves unknown. This does not create
          evidence or increase readiness.
        </p>
        <Button onClick={onRun} className="mt-4">
          <ScanSearch className="size-4" />
          Start review
        </Button>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-workspace-border bg-workspace-panel p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="workspace-eyebrow text-primary">
              Review summary
            </p>
            <h2 className="mt-2 workspace-section-title text-ink">
              {scan.summary ??
                "Review the most consequential uncertainty before comparing decisions."}
            </h2>
            <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
              {summary.criticalCount} critical issues need your attention
              {" · "}
              {summary.importantCount} important issues
              {" · "}
              {summary.supportingCount} supporting observations
            </p>
          </div>
          <div className="min-w-48">
            <div className="flex items-center justify-between workspace-meta text-workspace-muted-text">
              <span>Critical review progress</span>
              <span>
                {summary.reviewedCriticalCount}/{summary.criticalCount}
              </span>
            </div>
            <Progress
              value={reviewPercentage}
              className="mt-2 bg-workspace-elevated"
              aria-label={`${reviewPercentage}% of critical findings reviewed`}
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="critical-review-title">
        <div className="mb-2 flex items-center gap-2">
          <AlertTriangle
            className="size-4 text-workspace-warning"
            aria-hidden="true"
          />
          <h2
            id="critical-review-title"
            className="workspace-section-title text-ink"
          >
            Critical now
          </h2>
        </div>
        <div className="space-y-3">
          {criticalItems.map((item) => (
            <ReviewItemCard
              key={item.id}
              item={item}
              sourceTitles={item.sourceIds
                .map((id) => sourceById.get(id))
                .filter((title): title is string => Boolean(title))}
              onResponse={(response) =>
                onResponse(item.id, response)
              }
              onNote={(note) => onNote(item.id, note)}
            />
          ))}
        </div>
      </section>

      {importantItems.length ? (
        <ReviewDisclosure
          title={`Important (${importantItems.length})`}
          description="Open when you are ready to inspect the next layer of uncertainty."
          items={importantItems}
          sourceById={sourceById}
          onResponse={onResponse}
          onNote={onNote}
        />
      ) : null}

      {supportingItems.length ? (
        <ReviewDisclosure
          title={`Supporting context (${supportingItems.length})`}
          description="Useful context that should not distract from the critical issues."
          items={supportingItems}
          sourceById={sourceById}
          onResponse={onResponse}
          onNote={onNote}
        />
      ) : null}

      <div className="flex flex-col gap-2 rounded-lg border border-workspace-border bg-workspace-elevated px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="workspace-supporting text-workspace-muted-text">
          {summary.criticalReviewComplete
            ? "Critical findings reviewed. You can now compare decision candidates."
            : `Review ${summary.criticalCount - summary.reviewedCriticalCount} critical ${summary.criticalCount - summary.reviewedCriticalCount === 1 ? "issue" : "issues"} before comparing decisions.`}
        </p>
        <Button
          onClick={onContinue}
          disabled={!summary.criticalReviewComplete}
        >
          Compare decisions
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
