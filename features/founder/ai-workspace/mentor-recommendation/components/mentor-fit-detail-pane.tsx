"use client";

import {
  Bookmark,
  BookmarkCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Info,
  MapPin,
  Sparkles,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import type { useAiWorkspace } from "../../hooks/use-ai-workspace";
import {
  formatMeetingMethod,
  formatMentorPricing,
  getMentorInitials,
  isMentorSaved,
  mentorFitExplanation,
  selectMentorMatch,
} from "../state/mentor-recommendation-selectors";

type Workspace = ReturnType<typeof useAiWorkspace>;

export function MentorFitDetailPane({
  workspace,
}: {
  workspace: Workspace;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const headerRef = React.useRef<HTMLElement>(null);
  const recommendation = workspace.state.mentorRecommendation;
  const mentor = selectMentorMatch(
    recommendation,
    workspace.layout.selectedMentorId,
  );

  React.useEffect(() => {
    scrollRef.current?.scrollTo({
      top: 0,
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches
        ? "auto"
        : "smooth",
    });
    headerRef.current?.focus({ preventScroll: true });
  }, [mentor?.mentorId]);

  if (!recommendation || !mentor) {
    return (
      <div
        role="alert"
        className="flex h-full items-center justify-center p-6 text-center"
      >
        <div>
          <Info className="mx-auto size-5 text-workspace-warning" />
          <p className="mt-3 workspace-card-title text-ink">
            Chưa thể tải chi tiết mentor.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => workspace.openAnalysis("mentor")}
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  const saved = isMentorSaved(
    recommendation,
    mentor.mentorId,
  );
  const matchingRequest =
    workspace.state.mentorConnectionRequest?.mentorId ===
    mentor.mentorId
      ? workspace.state.mentorConnectionRequest
      : undefined;
  const hasDraft = Boolean(
    workspace.state.mentorConnectionBriefs[mentor.mentorId],
  );
  const connectLabel = matchingRequest
    ? "Xem yêu cầu"
    : hasDraft
      ? "Tiếp tục chỉnh sửa"
      : `Connect với ${mentor.profile.name}`;
  const unavailable =
    mentor.availability.status === "unavailable";

  return (
    <aside className="flex h-full min-h-0 flex-col bg-workspace-panel">
      <header
        ref={headerRef}
        tabIndex={-1}
        className="shrink-0 border-b border-workspace-border px-5 py-4 outline-none"
      >
        <div className="flex items-start gap-3 pr-10">
          <Avatar className="size-12 border border-workspace-border">
            <AvatarImage
              src={mentor.profile.avatarSrc}
              alt={`Ảnh chân dung mentor ${mentor.profile.name}`}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary-soft text-primary">
              {getMentorInitials(mentor.profile.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h2 className="workspace-section-title text-ink">
              {mentor.profile.name}
            </h2>
            <p className="mt-1 workspace-meta text-workspace-muted-text">
              {mentor.profile.role} ·{" "}
              {mentor.profile.organization}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-md border border-primary-border bg-primary-soft px-2 py-1 font-tabular workspace-meta text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/50"
                  >
                    {mentor.fit.label} · {mentor.fit.score}%
                    <Info className="size-3" aria-hidden="true" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  className="max-w-72 border border-workspace-border bg-surface-1 text-ink"
                >
                  {mentorFitExplanation}
                </TooltipContent>
              </Tooltip>
              <Badge
                variant="outline"
                className="border-workspace-border text-workspace-muted-text"
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    unavailable
                      ? "bg-workspace-danger"
                      : "bg-workspace-success",
                  )}
                />
                {mentor.availability.label}
              </Badge>
            </div>
          </div>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={() => {
              workspace.toggleSaveMentor(mentor.mentorId);
              toast(
                saved ? "Đã bỏ lưu mentor" : "Đã lưu mentor",
              );
            }}
            aria-label={
              saved ? "Bỏ lưu mentor" : "Lưu mentor"
            }
            aria-pressed={saved}
          >
            {saved ? (
              <BookmarkCheck className="size-4" />
            ) : (
              <Bookmark className="size-4" />
            )}
          </Button>
        </div>

        <div
          className="mt-3 flex gap-1.5 overflow-x-auto no-scrollbar"
          aria-label="Chuyển mentor"
        >
          {recommendation.payload.mentors.map((item) => (
            <button
              key={item.mentorId}
              type="button"
              onClick={() =>
                workspace.openMentorFit(item.mentorId)
              }
              className={cn(
                "shrink-0 rounded-lg border px-2.5 py-1.5 workspace-meta transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/50 motion-reduce:transition-none",
                item.mentorId === mentor.mentorId
                  ? "border-primary-border bg-primary-soft text-primary"
                  : "border-workspace-border bg-workspace-elevated text-workspace-muted-text hover:text-ink",
              )}
              aria-pressed={item.mentorId === mentor.mentorId}
            >
              {item.profile.name.split(" ").at(-1)} ·{" "}
              {item.fit.score}%
            </button>
          ))}
        </div>
      </header>

      <div
        ref={scrollRef}
        className="no-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto p-5"
      >
        <section aria-labelledby="mentor-fit-reasons">
          <h3
            id="mentor-fit-reasons"
            className="workspace-eyebrow text-workspace-muted-text"
          >
            Vì sao phù hợp lúc này
          </h3>
          <div className="mt-2 space-y-2">
            {mentor.fitReasons.slice(0, 4).map((reason) => (
              <div
                key={reason.id}
                className="flex gap-3 rounded-xl border border-workspace-border bg-workspace-elevated p-3"
              >
                <CheckCircle2
                  className="mt-0.5 size-4 shrink-0 text-workspace-success"
                  aria-hidden="true"
                />
                <div>
                  <p className="workspace-supporting font-medium text-ink">
                    {reason.title}
                  </p>
                  <p className="mt-1 workspace-meta text-workspace-muted-text">
                    {reason.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="mentor-experience">
          <h3
            id="mentor-experience"
            className="workspace-eyebrow text-workspace-muted-text"
          >
            Kinh nghiệm liên quan
          </h3>
          <dl className="mt-2 grid grid-cols-2 gap-2">
            {mentor.relevantExperience.map((experience) => (
              <div
                key={experience.id}
                className="rounded-xl border border-workspace-border bg-workspace-elevated p-3"
              >
                <dd className="font-tabular text-xl font-semibold text-ink">
                  {experience.value}
                </dd>
                <dt className="mt-1 workspace-meta text-workspace-muted-text">
                  {experience.label}
                </dt>
              </div>
            ))}
          </dl>
        </section>

        <section
          aria-labelledby="mentor-outcomes"
          className="rounded-xl border border-primary-border bg-primary-soft p-4"
        >
          <div className="flex gap-3">
            <Sparkles
              className="mt-0.5 size-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div>
              <h3
                id="mentor-outcomes"
                className="workspace-eyebrow text-primary"
              >
                Sau phiên, CampusFlow có thể chốt
              </h3>
              <ul className="mt-2 space-y-2">
                {mentor.expectedOutcomes.map((outcome) => (
                  <li
                    key={outcome}
                    className="flex gap-2 workspace-supporting text-ink"
                  >
                    <span aria-hidden="true">•</span>
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 workspace-meta text-workspace-muted-text">
                Outcome dự kiến dựa trên nhu cầu hiện tại của
                CampusFlow và chuyên môn đã xác nhận của mentor.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="mentor-session-details">
          <h3
            id="mentor-session-details"
            className="workspace-eyebrow text-workspace-muted-text"
          >
            Phiên hỗ trợ
          </h3>
          <dl className="mt-2 divide-y divide-workspace-border rounded-xl border border-workspace-border bg-workspace-elevated">
            <SessionRow
              icon={MapPin}
              label="Hình thức"
              value={mentor.availability.meetingMethods
                .map(formatMeetingMethod)
                .join(" · ")}
            />
            <SessionRow
              icon={Clock3}
              label="Thời lượng"
              value={`${mentor.durationMinutes} phút`}
            />
            <SessionRow
              icon={Bookmark}
              label="Chi phí"
              value={formatMentorPricing(mentor.pricing)}
            />
            <SessionRow
              icon={CalendarDays}
              label="Khung giờ gần nhất"
              value={mentor.availability.nextSlots.join(" · ")}
            />
          </dl>
        </section>
      </div>

      <footer className="shrink-0 border-t border-workspace-border bg-workspace-panel p-4">
        <div className="flex gap-2">
          <Button
            type="button"
            className="flex-1"
            disabled={unavailable && !matchingRequest && !hasDraft}
            onClick={() =>
              workspace.openMentorConnection(mentor.mentorId)
            }
          >
            {connectLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              workspace.toggleSaveMentor(mentor.mentorId);
              toast(
                saved ? "Đã bỏ lưu mentor" : "Đã lưu mentor",
              );
            }}
            aria-pressed={saved}
          >
            {saved ? "Đã lưu" : "Lưu mentor"}
          </Button>
        </div>
      </footer>
    </aside>
  );
}

function SessionRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock3;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 px-3 py-2.5">
      <Icon
        className="mt-0.5 size-4 shrink-0 text-primary"
        aria-hidden="true"
      />
      <div className="min-w-0">
        <dt className="workspace-meta text-workspace-muted-text">
          {label}
        </dt>
        <dd className="mt-0.5 workspace-supporting text-ink">
          {value}
        </dd>
      </div>
    </div>
  );
}
