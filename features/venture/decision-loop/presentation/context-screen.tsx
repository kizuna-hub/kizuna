"use client";

import React from "react";
import type { VentureId } from "../../core";
import { ArrowLeft, ArrowRight, Bot, FilePlus2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { FounderShell } from "@/features/founder/shell/founder-shell";
import { getVentureById } from "@/features/founder/venture-foundation/demo-repository";
import { useDemoWorkspace } from "@/features/founder/venture-foundation/demo-workspace-provider";
import { useDemoDecisionLoopRepository } from "@/features/founder/venture-foundation/use-demo-decision-loop-repository";
import { baselineFieldKeys, baselineFieldLabels, getBaselineCompleteness, getCurrentBaseline, getSourcesForVenture, type DecisionLoopOperationResult } from "../application";
import { Link, usePathname } from "@/i18n/routing";
import { BaselineFieldEditor } from "./components/baseline-field-editor";
import {
  AddSourceSheet,
  originLabels,
  sourceKindLabels,
  sourceStatusClass,
  SourceDetailSheet,
} from "./components/context-source-sheets";
import { UnavailableProject } from "./components/unavailable-project";
import { ContextProvenanceStrip } from "./workflow/context-provenance-strip";


export function ContextScreen({
  ventureId,
}: {
  ventureId: VentureId;
}) {
  const pathname = usePathname();
  const decisionLoopRepository =
    useDemoDecisionLoopRepository();
  const {
    state,
    setActiveVenture,
    setLastVisitedVenturePath,
  } = useDemoWorkspace();
  const venture = getVentureById(state, ventureId);
  const sources = getSourcesForVenture(state, ventureId);
  const baseline = getCurrentBaseline(state, ventureId);
  const completeness = getBaselineCompleteness(state, ventureId);
  const [addOpen, setAddOpen] = React.useState(false);
  const [selectedSourceId, setSelectedSourceId] =
    React.useState<string>();
  const [message, setMessage] = React.useState("");
  const [acknowledgeIncomplete, setAcknowledgeIncomplete] =
    React.useState(baseline?.acknowledgedIncomplete ?? false);
  const selectedSource = sources.find(
    (source) => source.id === selectedSourceId,
  );

  React.useEffect(() => {
    if (!venture || venture.status === "archived") return;
    setActiveVenture(venture.id);
    setLastVisitedVenturePath(venture.id, pathname);
  }, [
    pathname,
    setActiveVenture,
    setLastVisitedVenturePath,
    venture?.id,
    venture?.status,
  ]);

  if (!venture || venture.status === "archived" || !baseline) {
    return <UnavailableProject />;
  }

  async function run(
    operation: Promise<DecisionLoopOperationResult>,
    successMessage: string,
  ) {
    try {
      const result = await operation;
      setMessage(
        result.ok ? successMessage : result.errors.join(" "),
      );
      return result.ok;
    } catch {
      setMessage("The Decision Loop is temporarily unavailable.");
      return false;
    }
  }

  return (
    <FounderShell ventureId={venture.id} contentWidth="focused">
      <div className="space-y-5">
        <header className="flex flex-col gap-3 border-b border-workspace-border pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="workspace-eyebrow text-primary">
              Decision foundation
            </p>
            <h1 className="mt-1.5 workspace-page-title text-ink">
              Venture context
            </h1>
            <p className="mt-1.5 max-w-2xl workspace-body text-workspace-muted-text">
              Review source provenance, then confirm the minimum baseline
              the decision review is allowed to use.
            </p>
          </div>
          <Button
            asChild
            variant="ghost"
            className="h-11 px-3 lg:h-9"
          >
            <Link href={`/founder/projects/${venture.id}`}>
              <ArrowLeft className="size-4" />
              Back to overview
            </Link>
          </Button>
        </header>

        <ContextProvenanceStrip
          state={state}
          ventureId={venture.id}
        />

        {message ? (
          <p
            role="status"
            className="rounded-lg border border-workspace-border bg-workspace-elevated px-3.5 py-2.5 workspace-supporting text-ink"
          >
            {message}
          </p>
        ) : null}

        <section
          aria-labelledby="context-sources-title"
          className="rounded-xl border border-workspace-border bg-workspace-panel"
        >
          <div className="flex flex-col gap-3 border-b border-workspace-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2
                id="context-sources-title"
                className="workspace-section-title text-ink"
              >
                Context sources
              </h2>
              <p className="mt-1 workspace-supporting text-workspace-muted-text">
                {sources.length} captured ·{" "}
                {
                  sources.filter(
                    (source) => source.reviewStatus === "confirmed",
                  ).length
                }{" "}
                confirmed
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => setAddOpen(true)}
            >
              <FilePlus2 className="size-4" />
              Add source
            </Button>
          </div>
          <div className="divide-y divide-workspace-border">
            {sources.length ? (
              sources.map((source) => (
                <article
                  key={source.id}
                  className="grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                >
                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => setSelectedSourceId(source.id)}
                      className="text-left workspace-body font-semibold text-ink hover:text-primary focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    >
                      {source.title}
                    </button>
                    <p className="mt-1 workspace-meta text-workspace-muted-text">
                      {sourceKindLabels[source.kind]} ·{" "}
                      {originLabels[source.origin]} ·{" "}
                      {source.freshness.replace("-", " ")}
                    </p>
                    {source.summary ? (
                      <p className="mt-1.5 line-clamp-2 workspace-supporting text-workspace-muted-text">
                        {source.summary}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    {source.aiContribution !== "none" ? (
                      <Badge variant="outline">
                        <Bot className="size-3" />
                        AI {source.aiContribution}
                      </Badge>
                    ) : null}
                    {source.visibility === "private" ? (
                      <Badge variant="outline">Private</Badge>
                    ) : null}
                    {source.provenance?.personalDataDetected ? (
                      <Badge
                        variant="outline"
                        className="border-workspace-warning/30 bg-workspace-warning-soft text-workspace-warning"
                      >
                        Personal data detected
                      </Badge>
                    ) : null}
                    <Badge
                      variant="outline"
                      className={sourceStatusClass(
                        source.reviewStatus,
                      )}
                    >
                      {source.reviewStatus.replace("-", " ")}
                    </Badge>
                    {source.reviewStatus !== "confirmed" ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          run(
                            decisionLoopRepository.updateSourceReviewStatus(
                              venture.id,
                              source.id,
                              "confirmed",
                            ),
                            `${source.title} is confirmed.`,
                          )
                        }
                      >
                        Confirm
                      </Button>
                    ) : null}
                  </div>
                </article>
              ))
            ) : (
              <div className="p-6 text-center">
                <p className="workspace-body font-medium text-ink">
                  No context sources yet
                </p>
                <p className="mt-1 workspace-supporting text-workspace-muted-text">
                  Add one founder-authored or external source to begin.
                </p>
              </div>
            )}
          </div>
        </section>

        {completeness.allReviewedSourcesAreAiGenerated ? (
          <div
            role="note"
            className="flex items-start gap-3 rounded-lg border border-workspace-warning/30 bg-workspace-warning-soft px-3.5 py-3"
          >
            <Bot className="mt-0.5 size-4 shrink-0 text-workspace-warning" />
            <p className="workspace-supporting text-ink">
              Every confirmed source is AI-generated. The baseline can
              proceed, but each claim should be founder-checked and the
              first cycle should seek human or market evidence.
            </p>
          </div>
        ) : null}

        <section aria-labelledby="baseline-title">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="baseline-title"
                className="workspace-section-title text-ink"
              >
                Venture baseline
              </h2>
              <p className="mt-1 workspace-supporting text-workspace-muted-text">
                Drafts save automatically to this venture. Required:
                problem, solution, current goal, customer or buyer, and
                one confirmed source.
              </p>
            </div>
            <div className="min-w-44">
              <div className="flex items-center justify-between workspace-meta text-workspace-muted-text">
                <span>{completeness.percentage}% captured</span>
                <span>
                  {completeness.completedCount}/
                  {completeness.totalCount}
                </span>
              </div>
              <Progress
                value={completeness.percentage}
                className="mt-2 bg-workspace-elevated"
                aria-label={`${completeness.percentage}% of venture baseline captured`}
              />
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {baselineFieldKeys.map((fieldKey) => {
              const field = baseline[fieldKey];
              return (
                <BaselineFieldEditor
                  key={fieldKey}
                  fieldKey={fieldKey}
                  value={field.value}
                  status={field.status}
                  confidence={field.confidence}
                  sourceCount={field.sourceIds.length}
                  founderConfirmed={field.founderConfirmed}
                  onChange={(patch) =>
                    run(
                      decisionLoopRepository.updateBaselineField(
                        venture.id,
                        fieldKey,
                        patch,
                      ),
                      "Draft saved automatically.",
                    )
                  }
                />
              );
            })}
          </div>
        </section>

        <section className="rounded-xl border border-primary-border bg-primary-soft p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <h2 className="workspace-section-title text-ink">
                Confirm the baseline
              </h2>
              <p className="mt-1 workspace-supporting text-workspace-muted-text">
                Confirmation freezes the current baseline version for a
                deterministic review. Editing it later invalidates
                the old scan without deleting history.
              </p>
              {completeness.missingOptional.length > 0 ? (
                <label className="mt-3 flex items-start gap-2 workspace-supporting text-ink">
                  <Checkbox
                    className="mt-0.5"
                    checked={acknowledgeIncomplete}
                    onCheckedChange={(checked) =>
                      setAcknowledgeIncomplete(checked === true)
                    }
                  />
                  I understand that optional context remains incomplete.
                </label>
              ) : null}
              {completeness.missingRequired.length > 0 ? (
                <p className="mt-3 workspace-meta text-workspace-warning">
                  Missing minimum context:{" "}
                  {completeness.missingRequired
                    .map((key) => baselineFieldLabels[key])
                    .join(", ")}
                  .
                </p>
              ) : null}
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button
                  disabled={
                    !completeness.canConfirm ||
                    (completeness.missingOptional.length > 0 &&
                      !acknowledgeIncomplete)
                  }
                  onClick={() =>
                    run(
                      decisionLoopRepository.confirmBaseline(
                        venture.id,
                        { acknowledgeIncomplete },
                      ),
                      "Baseline confirmed. Review is ready.",
                    )
                  }
                >
                  <ShieldCheck className="size-4" />
                  Confirm baseline
                </Button>
                {completeness.canRunChallengeScan ? (
                  <Button asChild variant="secondary">
                    <Link
                      href={`/founder/projects/${venture.id}/cycle`}
                    >
                      Continue to Review
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </div>

      <AddSourceSheet
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={(input) =>
          run(
            decisionLoopRepository.addSource(venture.id, input),
            "Source added. Review and confirm it before scanning.",
          )
        }
      />
      <SourceDetailSheet
        source={selectedSource}
        open={Boolean(selectedSource)}
        onOpenChange={(open) => {
          if (!open) setSelectedSourceId(undefined);
        }}
        onReview={(status) => {
          if (!selectedSource) return;
          run(
            decisionLoopRepository.updateSourceReviewStatus(
              venture.id,
              selectedSource.id,
              status,
            ),
            status === "confirmed"
              ? "Source confirmed."
              : "Source marked as needing an update.",
          );
        }}
        onExclude={() => {
          if (!selectedSource) return;
          run(
            decisionLoopRepository.excludeSource(
              venture.id,
              selectedSource.id,
            ),
            "Source excluded from the working context.",
          );
        }}
      />
    </FounderShell>
  );
}
