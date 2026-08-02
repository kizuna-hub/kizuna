import { ArrowRight, Focus } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { AiWorkspaceCopy } from "../../copy/types";
import type {
  AssistantResponseLifecycle,
  CurrentFocus,
} from "../../types/ai-workspace.types";

export function CompactInsightBlock({
  focus,
  lifecycle,
  sourceCount,
  copy,
  onViewEvidence,
}: {
  focus: CurrentFocus;
  lifecycle: AssistantResponseLifecycle;
  sourceCount: number;
  copy: AiWorkspaceCopy;
  onViewEvidence: () => void;
}) {
  if (lifecycle === "superseded") {
    return (
      <div className="rounded-lg border border-workspace-warning/30 bg-workspace-warning-soft px-3 py-2.5 workspace-meta text-ink">
        {copy.response.superseded}
      </div>
    );
  }

  if (lifecycle === "dismissed") {
    return (
      <div className="rounded-lg border border-workspace-border px-3 py-2.5 workspace-meta text-workspace-muted-text">
        {copy.response.dismissed}
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-workspace-border bg-workspace-panel px-3.5 py-3">
      <div className="flex items-start gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary-border bg-primary-soft text-primary">
          <Focus className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="workspace-eyebrow text-primary">
            {copy.response.insightDetected}
          </p>
          <p className="mt-1 workspace-card-title text-ink">
            {focus.bottleneck}
          </p>
          <p className="mt-1 workspace-meta text-workspace-muted-text">
            {copy.statuses[focus.sourceStatus]} · {sourceCount}{" "}
            nguồn liên quan
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onViewEvidence}
          className="shrink-0"
        >
          {copy.response.viewEvidence}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}
