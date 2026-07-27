import { ArrowRight, ClipboardCheck, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { AiWorkspaceCopy } from "../../copy/types";
import type { ReadinessState } from "../../types/ai-workspace.types";
import { ResponseCardShell } from "./response-card-shell";

export function EvidenceReviewCard({
  title,
  summary,
  readiness,
  copy,
  onOpenCycle,
}: {
  title: string;
  summary: string;
  readiness: ReadinessState;
  copy: AiWorkspaceCopy;
  onOpenCycle: () => void;
}) {
  return (
    <ResponseCardShell
      eyebrow={copy.response.evidenceReview}
      title={title}
      icon={<ClipboardCheck className="size-4" />}
      actions={
        <Button size="sm" onClick={onOpenCycle}>
          {copy.response.openCycle}
          <ArrowRight className="size-3.5" />
        </Button>
      }
    >
      <p className="workspace-supporting text-ink">{summary}</p>
      <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-workspace-success/30 bg-workspace-success-soft px-3 py-2.5">
        <span className="workspace-meta font-medium text-workspace-success">
          {copy.response.cycleChange}
        </span>
        <span className="inline-flex items-center gap-1 font-tabular workspace-card-title text-workspace-success">
          <TrendingUp className="size-3.5" />
          +{readiness.delta} · {readiness.currentScore}/100
        </span>
      </div>
    </ResponseCardShell>
  );
}

