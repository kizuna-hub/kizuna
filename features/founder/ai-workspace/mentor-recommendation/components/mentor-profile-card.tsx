"use client";

import {
  Bookmark,
  BookmarkCheck,
  CalendarClock,
  Clock3,
  Info,
  UsersRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import type {
  MentorConnectionBrief,
  MentorConnectionRequest,
} from "../../mentor-connection/types/mentor-connection.types";
import {
  formatMentorPricing,
  mentorFitExplanation,
} from "../state/mentor-recommendation-selectors";
import type { MentorMatch } from "../types/mentor-recommendation.types";
import { MentorProfileImage } from "./mentor-profile-image";

export function MentorProfileCard({
  mentor,
  saved,
  connectionBrief,
  connectionRequest,
  priority = false,
  onOpenDetails,
  onOpenConnection,
  onToggleSave,
}: {
  mentor: MentorMatch;
  saved: boolean;
  connectionBrief?: MentorConnectionBrief;
  connectionRequest?: MentorConnectionRequest;
  priority?: boolean;
  onOpenDetails: () => void;
  onOpenConnection: () => void;
  onToggleSave: () => void;
}) {
  const requestPending =
    connectionRequest?.mentorId === mentor.mentorId;
  const hasDraft = Boolean(connectionBrief) && !requestPending;
  const primaryActionLabel = requestPending
    ? "Xem yêu cầu"
    : hasDraft
      ? "Tiếp tục chỉnh sửa"
      : "Xem mức độ phù hợp";

  return (
    <article
      className={cn(
        "flex min-w-0 flex-col overflow-hidden rounded-xl border bg-workspace-panel",
        mentor.fit.isPrimary
          ? "border-primary-border"
          : "border-workspace-border",
      )}
      aria-labelledby={`${mentor.mentorId}-name`}
    >
      <div className="relative">
        <MentorProfileImage
          name={mentor.profile.name}
          src={mentor.profile.avatarSrc}
          priority={priority || mentor.fit.isPrimary}
          className="aspect-[4/3] w-full"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <Badge
            variant="outline"
            className="border-workspace-border bg-workspace-panel/90 text-ink backdrop-blur-sm"
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                mentor.availability.status === "available"
                  ? "bg-workspace-success"
                  : mentor.availability.status === "limited"
                    ? "bg-workspace-warning"
                    : "bg-workspace-danger",
              )}
            />
            {mentor.availability.label}
          </Badge>
          {mentor.fit.isPrimary ? (
            <Badge className="border-primary-border bg-primary-soft text-primary">
              Phù hợp nhất
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3
              id={`${mentor.mentorId}-name`}
              className="workspace-card-title text-ink"
            >
              {mentor.profile.name}
            </h3>
            <p className="mt-1 workspace-meta text-workspace-muted-text">
              {mentor.profile.role} ·{" "}
              {mentor.profile.organization}
            </p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="inline-flex shrink-0 items-center gap-1 rounded-md border border-workspace-border bg-workspace-elevated px-2 py-1 font-tabular workspace-meta text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/50"
                aria-label={`${mentor.fit.label}, ${mentor.fit.score}% phù hợp. ${mentorFitExplanation}`}
              >
                {mentor.fit.score}%
                <Info className="size-3" aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="max-w-72 border border-workspace-border bg-surface-1 text-ink"
            >
              {mentorFitExplanation}
            </TooltipContent>
          </Tooltip>
        </div>

        <div
          className="mt-3 flex flex-wrap gap-1.5"
          aria-label="Chuyên môn phù hợp"
        >
          {mentor.relevantExpertise.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-workspace-border bg-workspace-elevated px-2 py-1 workspace-meta text-workspace-muted-text"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="mt-3 line-clamp-3 min-h-[3.75rem] workspace-supporting text-workspace-muted-text">
          {mentor.profile.shortBio}
        </p>

        <div className="mt-4 rounded-lg border border-primary-border bg-primary-soft p-3">
          <p className="workspace-eyebrow text-primary">
            Phù hợp nhất cho
          </p>
          <p className="mt-1 workspace-supporting font-medium text-ink">
            {mentor.recommendedFor}
          </p>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-2 workspace-meta text-workspace-muted-text">
          <div className="flex min-w-0 items-start gap-2">
            <CalendarClock
              className="mt-0.5 size-3.5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div>
              <dt className="sr-only">Chi phí</dt>
              <dd>{formatMentorPricing(mentor.pricing)}</dd>
            </div>
          </div>
          <div className="flex min-w-0 items-start gap-2">
            <Clock3
              className="mt-0.5 size-3.5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div>
              <dt className="sr-only">Thời lượng</dt>
              <dd>{mentor.durationMinutes} phút / phiên</dd>
            </div>
          </div>
          <div className="col-span-2 flex min-w-0 items-start gap-2">
            <UsersRound
              className="mt-0.5 size-3.5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div>
              <dt className="sr-only">Kinh nghiệm liên quan</dt>
              <dd>
                {mentor.relevantExperience[0]?.value}{" "}
                {mentor.relevantExperience[0]?.label.toLowerCase()}
              </dd>
            </div>
          </div>
        </dl>

        <div className="mt-auto flex items-center gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={onToggleSave}
            aria-label={
              saved
                ? `Bỏ lưu mentor ${mentor.profile.name}`
                : `Lưu mentor ${mentor.profile.name}`
            }
            aria-pressed={saved}
          >
            {saved ? (
              <BookmarkCheck className="size-4" />
            ) : (
              <Bookmark className="size-4" />
            )}
          </Button>
          <Button
            type="button"
            className="min-w-0 flex-1"
            data-mentor-fit-trigger={mentor.mentorId}
            onClick={
              requestPending || hasDraft
                ? onOpenConnection
                : onOpenDetails
            }
          >
            <span className="truncate">{primaryActionLabel}</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
