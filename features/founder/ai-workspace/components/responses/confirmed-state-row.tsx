import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ConfirmedStateRow({
  title,
  summary,
  detail,
  actionLabel,
  onOpen,
}: {
  title: string;
  summary: string;
  detail?: string;
  actionLabel: string;
  onOpen: () => void;
}) {
  return (
    <section
      className="rounded-lg border border-workspace-success/30 bg-workspace-success-soft/50 px-3 py-2.5"
      aria-label={title}
    >
      <div className="flex items-start gap-2.5">
        <CheckCircle2
          className="mt-0.5 size-4 shrink-0 text-workspace-success"
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <p className="workspace-supporting font-medium text-ink">
            {title}
          </p>
          <p className="mt-0.5 workspace-meta text-workspace-muted-text">
            {summary}
            {detail ? ` · ${detail}` : ""}
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onOpen}
          className="shrink-0"
        >
          {actionLabel}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}
