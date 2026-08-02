import {
  ArrowRight,
  FileSearch,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { PitchDeckReviewPayload } from "../../types/ai-workspace.types";

export function PitchDeckReviewCard({
  review,
  onOpenSources,
}: {
  review: PitchDeckReviewPayload;
  onOpenSources: () => void;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-workspace-border bg-workspace-panel">
      <div className="border-b border-workspace-border px-4 py-3.5">
        <div className="flex items-center gap-2">
          <FileSearch className="size-4 text-primary" />
          <h3 className="workspace-card-title text-ink">
            {review.title}
          </h3>
        </div>
        <p className="mt-1.5 workspace-meta text-workspace-muted-text">
          {review.summary}
        </p>
      </div>
      <ol className="divide-y divide-workspace-border">
        {review.weaknesses.map((weakness, index) => (
          <li
            key={weakness.id}
            className="grid grid-cols-[1.5rem_1fr] gap-2.5 px-4 py-3"
          >
            <span className="flex size-5 items-center justify-center rounded-full bg-primary-soft font-mono text-[11px] font-semibold text-primary">
              {index + 1}
            </span>
            <div>
              <p className="workspace-supporting font-medium text-ink">
                {weakness.title}
              </p>
              <p className="mt-1 workspace-meta text-workspace-muted-text">
                {weakness.detail}
              </p>
              <p className="mt-1.5 workspace-eyebrow text-primary">
                {weakness.sourceLabel}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <div className="border-t border-workspace-border bg-workspace-elevated px-4 py-3">
        <p className="flex items-center gap-1.5 workspace-eyebrow text-workspace-warning">
          <Sparkles className="size-3.5" />
          {review.projectedReadiness.label}
        </p>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 font-tabular workspace-meta text-ink">
          <span>
            Chỉ cải thiện trình bày:{" "}
            <strong>
              {review.projectedReadiness.presentationOnly}
            </strong>
          </span>
          <span>
            Có bằng chứng xác minh:{" "}
            <strong>
              {review.projectedReadiness.verifiedEvidenceRange[0]}–
              {review.projectedReadiness.verifiedEvidenceRange[1]}
            </strong>
          </span>
        </div>
        <ul className="mt-3 space-y-1.5 border-t border-workspace-border pt-3">
          {review.actions.map((action) => (
            <li
              key={action}
              className="flex items-start gap-2 workspace-meta text-ink"
            >
              <span className="mt-1 flex size-3.5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[9px] font-semibold text-primary">
                ✓
              </span>
              {action}
            </li>
          ))}
        </ul>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="mt-3 w-full"
          onClick={onOpenSources}
        >
          Xem nguồn và checklist cải thiện
          <ArrowRight className="size-3.5" />
        </Button>
      </div>
    </section>
  );
}
