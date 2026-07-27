import { ArrowRight, Focus } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { AiWorkspaceCopy } from "../../copy/types";
import type { CurrentFocus } from "../../types/ai-workspace.types";
import { StatusBadge } from "../shared/status-badge";
import { ResponseCardShell } from "./response-card-shell";

export function CurrentFocusCard({
  focus,
  copy,
  onOpenCycle,
  onExplain,
}: {
  focus: CurrentFocus;
  copy: AiWorkspaceCopy;
  onOpenCycle: () => void;
  onExplain: () => void;
}) {
  return (
    <ResponseCardShell
      eyebrow={copy.response.currentFocus}
      title={focus.bottleneck}
      icon={<Focus className="size-4" />}
      actions={
        <>
          <Button size="sm" onClick={onOpenCycle}>
            {copy.response.openCycle}
            <ArrowRight className="size-3.5" />
          </Button>
          <Button size="sm" variant="ghost" onClick={onExplain}>
            {copy.response.explainConclusion}
          </Button>
        </>
      }
    >
      <dl className="space-y-3">
        <div>
          <dt className="workspace-eyebrow text-workspace-muted-text">
            {copy.response.whyItMatters}
          </dt>
          <dd className="mt-1 workspace-supporting text-ink">
            {focus.whyItMatters}
          </dd>
        </div>
        <div>
          <dt className="workspace-eyebrow text-workspace-muted-text">
            {copy.response.nextAction}
          </dt>
          <dd className="mt-1 workspace-supporting text-ink">
            {focus.nextAction}
          </dd>
        </div>
      </dl>
      <StatusBadge
        status={focus.sourceStatus}
        copy={copy.statuses}
        className="mt-3"
      />
    </ResponseCardShell>
  );
}

