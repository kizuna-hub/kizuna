"use client";

import { UserRoundCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { AiWorkspaceCopy } from "../../copy/types";
import type { MentorRecommendation } from "../../types/ai-workspace.types";
import { ResponseCardShell } from "./response-card-shell";

export function MentorRecommendationCard({
  mentor,
  copy,
  onOpenDetails,
  onDefer,
}: {
  mentor: MentorRecommendation | null;
  copy: AiWorkspaceCopy;
  onOpenDetails: () => void;
  onDefer: () => void;
}) {
  if (!mentor) {
    return (
      <ResponseCardShell
        eyebrow={copy.response.mentorRecommendation}
        title={copy.response.noMentorNeeded}
        icon={<UserRoundCheck className="size-4" />}
      >
        <p className="workspace-supporting text-workspace-muted-text">
          {copy.pulse.noMentor}
        </p>
      </ResponseCardShell>
    );
  }

  if (mentor.status === "deferred") {
    return (
      <ResponseCardShell
        eyebrow={copy.response.mentorRecommendation}
        title={copy.response.mentorDeferred}
        icon={<UserRoundCheck className="size-4" />}
      >
        <p className="workspace-supporting text-workspace-muted-text">
          {mentor.dismissReason
            ? copy.mentor.dismissReasons[mentor.dismissReason]
            : mentor.expectedOutcome}
        </p>
      </ResponseCardShell>
    );
  }

  return (
    <ResponseCardShell
      eyebrow={copy.response.mentorRecommendation}
      title={copy.response.whyHumanNow}
      icon={<UserRoundCheck className="size-4" />}
      actions={
        <>
          <Button
            size="sm"
            onClick={onOpenDetails}
          >
            {mentor.status === "booked" ||
            mentor.status === "external"
              ? copy.mentor.sessionPreparation
              : copy.response.viewFit}
          </Button>
          {mentor.status === "recommended" ||
          mentor.status === "saved" ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDefer()}
            >
              {copy.mentor.continueWithAi}
            </Button>
          ) : null}
        </>
      }
    >
      <p className="workspace-supporting text-ink">
        {mentor.whyHumanNow}
      </p>
      <div className="mt-3 border-t border-workspace-border pt-3">
        <div className="flex items-start gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary-border bg-primary-soft font-heading text-xs font-semibold text-primary">
            {mentor.name
              .split(" ")
              .map((part) => part.charAt(0))
              .slice(0, 2)
              .join("")}
          </span>
          <div className="min-w-0">
            <p className="workspace-card-title text-ink">
              {mentor.name}
            </p>
            <p className="mt-0.5 workspace-meta text-primary">
              {mentor.expertise}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-3 rounded-lg border border-workspace-border bg-workspace-elevated px-3 py-2.5">
        <p className="workspace-eyebrow text-workspace-muted-text">
          {copy.response.expectedOutcome}
        </p>
        <p className="mt-1 workspace-meta text-ink">
          {mentor.expectedOutcome}
        </p>
      </div>
    </ResponseCardShell>
  );
}
