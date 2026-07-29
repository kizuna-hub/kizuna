"use client";

import { SearchX, UsersRound } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import type {
  MentorConnectionBrief,
  MentorConnectionRequest,
} from "../../mentor-connection/types/mentor-connection.types";
import { isMentorSaved } from "../state/mentor-recommendation-selectors";
import type {
  MentorRecommendationGridPayload,
  MentorRecommendationState,
} from "../types/mentor-recommendation.types";
import { MentorProfileCard } from "./mentor-profile-card";

export function MentorRecommendationGrid({
  recommendation,
  fallbackPayload,
  connectionBriefs,
  connectionRequest,
  onOpenDetails,
  onOpenConnection,
  onToggleSave,
}: {
  recommendation?: MentorRecommendationState;
  fallbackPayload?: MentorRecommendationGridPayload;
  connectionBriefs: Record<string, MentorConnectionBrief>;
  connectionRequest?: MentorConnectionRequest;
  onOpenDetails: (mentorId: string) => void;
  onOpenConnection: (mentorId: string) => void;
  onToggleSave: (mentorId: string) => void;
}) {
  const payload = recommendation?.payload ?? fallbackPayload;

  if (!payload || !Array.isArray(payload.mentors)) {
    return (
      <div
        role="status"
        className="rounded-xl border border-workspace-border bg-workspace-panel p-5 text-center"
      >
        <SearchX className="mx-auto size-5 text-primary" />
        <p className="mt-3 workspace-card-title text-ink">
          Kizuna chưa tìm được mentor đủ phù hợp với nhu cầu hiện tại.
        </p>
        <p className="mt-1 workspace-meta text-workspace-muted-text">
          Hãy điều chỉnh mục tiêu hỗ trợ hoặc xem lại mạng lưới mentor.
        </p>
      </div>
    );
  }

  const mentors = payload.mentors.slice(0, 3);
  if (mentors.length === 0) {
    return (
      <div
        role="status"
        className="rounded-xl border border-workspace-border bg-workspace-panel p-5 text-center"
      >
        <UsersRound className="mx-auto size-5 text-primary" />
        <p className="mt-3 workspace-card-title text-ink">
          Chưa có mentor phù hợp để hiển thị.
        </p>
      </div>
    );
  }

  return (
    <section
      aria-label="Mentor phù hợp với CampusFlow"
      className="w-full"
    >
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,15.5rem),1fr))] items-stretch gap-3">
        {mentors.map((mentor) => {
          const saved = isMentorSaved(
            recommendation,
            mentor.mentorId,
          );
          return (
            <MentorProfileCard
              key={mentor.mentorId}
              mentor={mentor}
              saved={saved}
              connectionBrief={
                connectionBriefs[mentor.mentorId]
              }
              connectionRequest={
                connectionRequest?.mentorId ===
                mentor.mentorId
                  ? connectionRequest
                  : undefined
              }
              onOpenDetails={() =>
                onOpenDetails(mentor.mentorId)
              }
              onOpenConnection={() =>
                onOpenConnection(mentor.mentorId)
              }
              onToggleSave={() => {
                onToggleSave(mentor.mentorId);
                toast(
                  saved
                    ? "Đã bỏ lưu mentor"
                    : "Đã lưu mentor",
                );
              }}
            />
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        {recommendation?.savedMentorIds?.length ?? 0} mentor đã lưu.
      </p>
    </section>
  );
}

export function MentorRecommendationGridSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="space-y-3"
    >
      <p className="workspace-meta text-workspace-muted-text">
        Đang đối chiếu nhu cầu hiện tại với chuyên môn của mentor…
      </p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,15.5rem),1fr))] gap-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="h-[30rem] animate-pulse rounded-xl border border-workspace-border bg-workspace-elevated motion-reduce:animate-none"
          />
        ))}
      </div>
    </div>
  );
}
