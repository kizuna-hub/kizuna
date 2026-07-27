import { ArrowRight, FlaskConical } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { AiWorkspaceCopy } from "../../copy/types";
import type {
  AiWorkspaceMessage,
  DecisionCycleLifecycle,
} from "../../types/ai-workspace.types";
import { ConfirmedStateRow } from "./confirmed-state-row";

type ActionProposal = Extract<
  NonNullable<AiWorkspaceMessage["structuredResponse"]>,
  { type: "suggested-action" }
>["payload"];

export function ActionProposalCard({
  proposal,
  confirmedSummary,
  lifecycle,
  cycleLifecycle,
  copy,
  onConfirm,
  onEdit,
  onOpenCycle,
}: {
  proposal: ActionProposal;
  confirmedSummary: string;
  lifecycle: NonNullable<
    AiWorkspaceMessage["responseLifecycle"]
  >;
  cycleLifecycle: DecisionCycleLifecycle;
  copy: AiWorkspaceCopy;
  onConfirm: () => void;
  onEdit: () => void;
  onOpenCycle: () => void;
}) {
  if (lifecycle === "completed") {
    return (
      <ConfirmedStateRow
        title={copy.response.cycleCreated}
        summary={confirmedSummary}
        detail={`${copy.response.currentStep}: ${copy.cycle.steps.understand.label}`}
        actionLabel={copy.response.openCycle}
        onOpen={onOpenCycle}
      />
    );
  }

  if (lifecycle === "superseded") {
    return (
      <div className="rounded-lg border border-workspace-warning/30 bg-workspace-warning-soft px-3 py-2.5 workspace-meta text-ink">
        {copy.response.superseded}
      </div>
    );
  }

  return (
    <section
      className="rounded-xl border border-primary-border bg-workspace-panel px-4 py-3.5"
      aria-label={copy.response.actionProposal}
    >
      <div className="flex items-start gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary-border bg-primary-soft text-primary">
          <FlaskConical className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="workspace-eyebrow text-primary">
            {copy.response.actionProposal}
          </p>
          <h3 className="mt-1 workspace-card-title text-ink">
            {proposal.title}
          </h3>
        </div>
      </div>

      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="workspace-eyebrow text-workspace-muted-text">
            {copy.cycle.goal}
          </dt>
          <dd className="mt-1 workspace-meta text-ink">
            {proposal.goal}
          </dd>
        </div>
        <div>
          <dt className="workspace-eyebrow text-workspace-muted-text">
            {copy.response.expectedOutcome}
          </dt>
          <dd className="mt-1 workspace-meta text-ink">
            {proposal.expectedOutcome}
          </dd>
        </div>
      </dl>

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-workspace-border pt-3">
        <Button
          type="button"
          size="sm"
          onClick={onConfirm}
          disabled={cycleLifecycle !== "not_created"}
        >
          {copy.response.openCycle}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onEdit}
        >
          {copy.response.editProposal}
        </Button>
      </div>
    </section>
  );
}
