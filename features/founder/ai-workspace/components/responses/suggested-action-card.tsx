import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { AiWorkspaceCopy } from "../../copy/types";
import { ResponseCardShell } from "./response-card-shell";

export function SuggestedActionCard({
  payload,
  copy,
  onOpenCycle,
}: {
  payload: {
    title: string;
    rationale: string;
    action: string;
  };
  copy: AiWorkspaceCopy;
  onOpenCycle: () => void;
}) {
  return (
    <ResponseCardShell
      eyebrow={copy.response.nextAction}
      title={payload.title}
      icon={<Sparkles className="size-4" />}
      actions={
        <Button size="sm" onClick={onOpenCycle}>
          {copy.response.createCycle}
          <ArrowRight className="size-3.5" />
        </Button>
      }
    >
      <p className="workspace-supporting text-ink">
        {payload.rationale}
      </p>
      <p className="mt-3 rounded-lg border border-workspace-border bg-workspace-elevated px-3 py-2.5 workspace-supporting text-ink">
        {payload.action}
      </p>
    </ResponseCardShell>
  );
}

