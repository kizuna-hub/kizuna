import { ArrowRight, UserRoundCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { AiWorkspaceCopy } from "../../copy/types";
import type {
  AssistantResponseLifecycle,
  MentorRecommendation,
  MentorSessionState,
} from "../../types/ai-workspace.types";
import { ConfirmedStateRow } from "./confirmed-state-row";

export function MentorInterventionCard({
  mentor,
  session,
  lifecycle,
  copy,
  onOpenDetails,
  onContinueWithAi,
}: {
  mentor: MentorRecommendation | null;
  session?: MentorSessionState;
  lifecycle: AssistantResponseLifecycle;
  copy: AiWorkspaceCopy;
  onOpenDetails: () => void;
  onContinueWithAi: () => void;
}) {
  if (!mentor) return null;

  if (lifecycle === "completed" && session) {
    return (
      <ConfirmedStateRow
        title={
          session.status === "external"
            ? copy.response.ownMentorPreparation
            : copy.response.mentorBooked(mentor.name)
        }
        summary={session.goal}
        detail={session.displayTime}
        actionLabel={copy.mentor.sessionPreparation}
        onOpen={onOpenDetails}
      />
    );
  }

  if (
    lifecycle === "dismissed" ||
    mentor.status === "deferred"
  ) {
    return (
      <div className="rounded-lg border border-workspace-border px-3 py-2.5 workspace-meta text-workspace-muted-text">
        {copy.response.mentorDeferred}
      </div>
    );
  }

  if (
    lifecycle === "superseded" ||
    mentor.status === "stale"
  ) {
    return (
      <div className="rounded-lg border border-workspace-warning/30 bg-workspace-warning-soft px-3 py-2.5 workspace-meta text-ink">
        {copy.mentor.staleExplanation}
      </div>
    );
  }

  return (
    <section
      className="rounded-xl border border-primary-border bg-workspace-panel px-4 py-3.5"
      aria-label={copy.response.mentorRecommendation}
    >
      <div className="flex items-start gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary-border bg-primary-soft text-primary">
          <UserRoundCheck
            className="size-4"
            aria-hidden="true"
          />
        </span>
        <div className="min-w-0 flex-1">
          <p className="workspace-eyebrow text-primary">
            {copy.response.mentorRecommendation}
          </p>
          <h3 className="mt-1 workspace-card-title text-ink">
            {mentor.name}
          </h3>
          <p className="mt-0.5 workspace-meta text-workspace-muted-text">
            {mentor.role}
          </p>
        </div>
      </div>

      <dl className="mt-3 space-y-3">
        <div>
          <dt className="workspace-eyebrow text-workspace-muted-text">
            {copy.mentor.whyNow}
          </dt>
          <dd className="mt-1 workspace-meta text-ink">
            {mentor.whyHumanNow}
          </dd>
        </div>
        <div>
          <dt className="workspace-eyebrow text-workspace-muted-text">
            {copy.response.expectedOutcome}
          </dt>
          <dd className="mt-1 workspace-meta text-ink">
            {mentor.expectedOutcome}
          </dd>
        </div>
      </dl>

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-workspace-border pt-3">
        <Button
          type="button"
          size="sm"
          onClick={onOpenDetails}
        >
          {copy.response.viewFit}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onContinueWithAi}
        >
          {copy.mentor.continueWithAi}
        </Button>
      </div>
    </section>
  );
}
