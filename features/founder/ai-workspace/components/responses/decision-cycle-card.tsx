import { ArrowRight, Repeat2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { AiWorkspaceCopy } from "../../copy/types";
import type { DecisionCycleState } from "../../types/ai-workspace.types";
import { ResponseCardShell } from "./response-card-shell";

export function DecisionCycleCard({
  cycle,
  copy,
  onOpen,
}: {
  cycle: DecisionCycleState;
  copy: AiWorkspaceCopy;
  onOpen: () => void;
}) {
  return (
    <ResponseCardShell
      eyebrow={copy.cycle.eyebrow}
      title={cycle.title}
      icon={<Repeat2 className="size-4" />}
      actions={
        <Button size="sm" onClick={onOpen}>
          {copy.response.openCycle}
          <ArrowRight className="size-3.5" />
        </Button>
      }
    >
      <dl className="grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="workspace-eyebrow text-workspace-muted-text">
            {copy.cycle.goal}
          </dt>
          <dd className="mt-1 workspace-supporting text-ink">
            {cycle.goal}
          </dd>
        </div>
        <div>
          <dt className="workspace-eyebrow text-workspace-muted-text">
            {copy.cycle.primaryMetric}
          </dt>
          <dd className="mt-1 workspace-supporting text-ink">
            {cycle.primaryMetric}
          </dd>
        </div>
      </dl>
    </ResponseCardShell>
  );
}

