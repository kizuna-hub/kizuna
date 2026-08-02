import { ChevronDown, History } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import type { VentureId } from "../../../core";
import {
  getChangeMyMindCriteria,
  getDecisionComparisonModel,
  getExperimentForVenture,
  getReviewItems,
  getSelectedCriticalDecision,
  type VentureWorkspaceState,
} from "../../application";

function HistorySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group rounded-lg border border-workspace-border bg-workspace-panel">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 workspace-body font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/40">
        {title}
        <ChevronDown
          className="size-4 text-workspace-muted-text transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="border-t border-workspace-border p-4">
        {children}
      </div>
    </details>
  );
}

export function ReasoningHistory({
  state,
  ventureId,
}: {
  state: VentureWorkspaceState;
  ventureId: VentureId;
}) {
  const reviewItems = getReviewItems(state, ventureId);
  const candidates = getDecisionComparisonModel(
    state,
    ventureId,
  ).slice(0, 3);
  const selected = getSelectedCriticalDecision(state, ventureId);
  const criteria = selected
    ? getChangeMyMindCriteria(selected)
    : [];
  const experiment = getExperimentForVenture(state, ventureId);

  return (
    <section
      aria-labelledby="reasoning-history-title"
      className="rounded-xl border border-workspace-border bg-workspace-elevated p-4"
    >
      <div className="flex items-center gap-2">
        <History
          className="size-4 text-workspace-muted-text"
          aria-hidden="true"
        />
        <h2
          id="reasoning-history-title"
          className="workspace-section-title text-ink"
        >
          Review reasoning
        </h2>
      </div>
      <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
        This decision trace is read-only while the cycle is active.
      </p>

      <div className="mt-3 space-y-2">
        <HistorySection title="Review findings">
          <div className="divide-y divide-workspace-border">
            {reviewItems.map(({ item, priority }) => (
              <div key={item.id} className="py-2.5 first:pt-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="outline" className="capitalize">
                    {priority.replace("-", " ")}
                  </Badge>
                  <Badge variant="outline">
                    {item.founderResponse.replace("-", " ")}
                  </Badge>
                </div>
                <p className="mt-1.5 workspace-supporting font-semibold text-ink">
                  {item.title}
                </p>
                {item.founderNote ? (
                  <p className="mt-1 workspace-meta text-workspace-muted-text">
                    Founder note: {item.founderNote}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </HistorySection>

        <HistorySection title="Decision comparison">
          <div className="space-y-3">
            {candidates.map(({ decision, label, selected: chosen }) => (
              <div key={decision.id}>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="outline">{label}</Badge>
                  {chosen ? (
                    <Badge className="bg-primary text-primary-foreground">
                      Founder choice
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-1.5 workspace-supporting font-semibold text-ink">
                  {decision.title}
                </p>
                {chosen ? (
                  <p className="mt-1 workspace-meta text-workspace-muted-text">
                    {decision.founderRationale}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </HistorySection>

        <HistorySection title="Hypotheses and change criteria">
          <div className="grid gap-3 sm:grid-cols-2">
            {(selected?.alternativeHypotheses ?? []).map(
              (hypothesis) => (
                <div key={hypothesis.id}>
                  <p className="workspace-supporting font-semibold text-ink">
                    {hypothesis.title}
                  </p>
                  <p className="mt-1 workspace-meta text-workspace-muted-text">
                    {hypothesis.summary}
                  </p>
                </div>
              ),
            )}
          </div>
          {criteria.length ? (
            <ul className="mt-3 space-y-1 border-t border-workspace-border pt-3 workspace-meta text-workspace-muted-text">
              {criteria
                .filter((criterion) => criterion.selected)
                .map((criterion) => (
                  <li key={criterion.id} className="flex gap-2">
                    <span aria-hidden="true">•</span>
                    <span>{criterion.text}</span>
                  </li>
                ))}
            </ul>
          ) : null}
        </HistorySection>

        <HistorySection title="Committed plan">
          <p className="workspace-supporting font-semibold text-ink">
            {experiment?.title}
          </p>
          <p className="mt-1 workspace-meta text-workspace-muted-text">
            {experiment?.method}
          </p>
        </HistorySection>
      </div>
    </section>
  );
}
