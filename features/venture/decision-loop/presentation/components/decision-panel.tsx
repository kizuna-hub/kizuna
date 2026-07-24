"use client";

import React from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  FileSearch,
  LockKeyhole,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { VentureId } from "../../../core";
import {
  getCurrentChallengeScan,
  getDecisionComparisonModel,
  getReviewSummary,
  type VentureWorkspaceState,
} from "../../application";

type ComparisonModel = ReturnType<
  typeof getDecisionComparisonModel
>[number];

function FindingList({
  title,
  ids,
  titleById,
  empty,
}: {
  title: string;
  ids?: string[];
  titleById: Map<string, string>;
  empty: string;
}) {
  const items = (ids ?? [])
    .map((id) => titleById.get(id))
    .filter((item): item is string => Boolean(item));
  return (
    <div>
      <p className="workspace-meta font-semibold text-ink">{title}</p>
      {items.length ? (
        <ul className="mt-1.5 space-y-1 workspace-meta text-workspace-muted-text">
          {items.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden="true">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1.5 workspace-meta text-workspace-muted-text">
          {empty}
        </p>
      )}
    </div>
  );
}

function CandidateRow({
  model,
  titleById,
  onChoose,
  onExplore,
  onDefer,
  onReject,
}: {
  model: ComparisonModel;
  titleById: Map<string, string>;
  onChoose: (
    decisionId: string,
    rationale: string,
  ) => Promise<boolean>;
  onExplore: (decisionId: string) => void;
  onDefer: (decisionId: string) => void;
  onReject: (decisionId: string) => void;
}) {
  const { decision } = model;
  const [rationale, setRationale] = React.useState(
    decision.founderRationale ?? "",
  );
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    setRationale(decision.founderRationale ?? "");
  }, [decision.founderRationale]);

  async function choose() {
    setBusy(true);
    await onChoose(decision.id, rationale);
    setBusy(false);
  }

  return (
    <article
      className={
        model.selected
          ? "rounded-xl border border-primary-border bg-primary-soft p-4"
          : "rounded-xl border border-workspace-border bg-workspace-panel p-4"
      }
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge
              variant={decision.isRecommended ? "default" : "outline"}
              className={
                decision.isRecommended
                  ? "bg-primary text-primary-foreground"
                  : undefined
              }
            >
              {decision.isRecommended ? (
                <Sparkles className="size-3" aria-hidden="true" />
              ) : null}
              {model.label}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {decision.confidence ?? "low"} confidence
            </Badge>
            {model.selected ? (
              <Badge
                variant="outline"
                className="border-workspace-success/30 bg-workspace-success-soft text-workspace-success"
              >
                <CheckCircle2 className="size-3" aria-hidden="true" />
                Founder choice
              </Badge>
            ) : null}
          </div>
          <h3 className="mt-2 workspace-decision-title text-ink">
            {decision.title}
          </h3>
          <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
            {decision.whyNow ?? decision.whyItMatters}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {model.selected ? (
            <Button onClick={() => onExplore(decision.id)}>
              Explore hypotheses
              <ArrowRight className="size-4" />
            </Button>
          ) : null}
        </div>
      </div>

      <details className="group mt-3 border-t border-workspace-border pt-3">
        <summary className="flex min-h-9 cursor-pointer list-none items-center justify-between gap-2 workspace-supporting font-semibold text-ink focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40">
          Review supporting logic
          <ChevronDown
            className="size-4 text-workspace-muted-text transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <FindingList
            title="Supporting findings"
            ids={decision.supportingChallengeItemIds}
            titleById={titleById}
            empty="No supporting finding is recorded."
          />
          <FindingList
            title="Contradictions"
            ids={decision.contradictingChallengeItemIds}
            titleById={titleById}
            empty="No direct contradiction is recorded."
          />
          <FindingList
            title="Important unknowns"
            ids={decision.unknownChallengeItemIds}
            titleById={titleById}
            empty="No explicit unknown is recorded."
          />
          <FindingList
            title="Deferred risks"
            ids={decision.deferredRiskIds}
            titleById={titleById}
            empty="No deferred risk is recorded."
          />
          <div className="sm:col-span-2">
            <p className="workspace-meta font-semibold text-ink">
              What this unlocks
            </p>
            <p className="mt-1.5 workspace-meta text-workspace-muted-text">
              {decision.unlocks?.join(" · ") ||
                "The next focused experiment."}
            </p>
          </div>
        </div>
      </details>

      {!model.readOnly ? (
        <div className="mt-3 border-t border-workspace-border pt-3">
          <Label htmlFor={`${decision.id}-rationale`}>
            Why should this decision be resolved now?
          </Label>
          <Textarea
            id={`${decision.id}-rationale`}
            className="mt-1.5"
            value={rationale}
            onChange={(event) => setRationale(event.target.value)}
            placeholder="Write the founder reasoning that should remain with this cycle."
            rows={3}
          />
          {model.requiresOverrideRationale ? (
            <p className="mt-1.5 workspace-meta text-workspace-muted-text">
              This differs from the recommendation, so your rationale is
              required before choosing it.
            </p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              onClick={choose}
              disabled={!rationale.trim() || busy}
            >
              {model.selected
                ? "Save founder rationale"
                : "Save rationale and choose"}
            </Button>
            {!model.selected ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => onDefer(decision.id)}
                >
                  Defer
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => onReject(decision.id)}
                >
                  Reject
                </Button>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}

export function DecisionPanel({
  state,
  ventureId,
  onChoose,
  onExplore,
  onDefer,
  onReject,
}: {
  state: VentureWorkspaceState;
  ventureId: VentureId;
  onChoose: (
    decisionId: string,
    rationale: string,
  ) => Promise<boolean>;
  onExplore: (decisionId: string) => void;
  onDefer: (decisionId: string) => void;
  onReject: (decisionId: string) => void;
}) {
  const scan = getCurrentChallengeScan(state, ventureId);
  const review = getReviewSummary(state, ventureId);
  const candidates = getDecisionComparisonModel(
    state,
    ventureId,
  ).slice(0, 3);
  const titleById = new Map(
    state.challengeItems
      .filter((item) => item.ventureId === ventureId)
      .map((item) => [item.id, item.title]),
  );

  if (!scan) {
    return (
      <section className="rounded-xl border border-workspace-border bg-workspace-panel p-5">
        <FileSearch className="size-5 text-workspace-warning" />
        <h2 className="mt-3 workspace-section-title text-ink">
          Complete Review first
        </h2>
        <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
          Decision candidates must remain traceable to one reviewed
          baseline and its findings.
        </p>
      </section>
    );
  }

  if (!review.criticalReviewComplete) {
    return (
      <section className="rounded-xl border border-workspace-border bg-workspace-panel p-5">
        <LockKeyhole className="size-5 text-workspace-warning" />
        <h2 className="mt-3 workspace-section-title text-ink">
          Review critical findings before comparing
        </h2>
        <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
          {review.criticalCount - review.reviewedCriticalCount} critical{" "}
          {review.criticalCount - review.reviewedCriticalCount === 1
            ? "issue remains"
            : "issues remain"}
          . Your responses become part of the decision trace.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-workspace-border bg-workspace-elevated px-3.5 py-3">
        <p className="workspace-supporting text-workspace-muted-text">
          Compare up to three candidates. Recommendation order is
          deterministic and explainable; your rationale determines the
          final choice.
        </p>
      </div>
      {candidates.map((model) => (
        <CandidateRow
          key={model.decision.id}
          model={model}
          titleById={titleById}
          onChoose={onChoose}
          onExplore={onExplore}
          onDefer={onDefer}
          onReject={onReject}
        />
      ))}
    </div>
  );
}
