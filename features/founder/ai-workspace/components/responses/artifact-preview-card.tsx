import { ArrowRight, FileCheck2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { AiWorkspaceCopy } from "../../copy/types";
import type { AssistantResponseLifecycle } from "../../types/ai-workspace.types";

export function ArtifactPreviewCard({
  title,
  summary,
  items,
  lifecycle,
  copy,
  onOpen,
}: {
  title: string;
  summary: string;
  items: string[];
  lifecycle: AssistantResponseLifecycle;
  copy: AiWorkspaceCopy;
  onOpen: () => void;
}) {
  if (lifecycle === "superseded") {
    return (
      <div className="rounded-lg border border-workspace-warning/30 bg-workspace-warning-soft px-3 py-2.5 workspace-meta text-ink">
        {copy.response.superseded}
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-workspace-border bg-workspace-panel px-3.5 py-3">
      <div className="flex items-start gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-workspace-border bg-workspace-elevated text-primary">
          <FileCheck2 className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="workspace-eyebrow text-workspace-muted-text">
            {copy.response.artifactCompleted}
          </p>
          <h3 className="mt-1 workspace-card-title text-ink">
            {title}
          </h3>
          <p className="mt-1 workspace-meta text-workspace-muted-text">
            {summary}
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onOpen}
        >
          {copy.response.openAnalysis}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Button>
      </div>
      <ul className="mt-3 space-y-1.5 border-t border-workspace-border pt-3 workspace-meta text-ink">
        {items.slice(0, 2).map((item) => (
          <li key={item} className="flex gap-2">
            <span
              aria-hidden="true"
              className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
