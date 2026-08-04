"use client";

import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  HeartHandshake,
  MessageCircleQuestion,
  Target,
  UserRoundCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { trackProductEvent } from "@/features/demo-domain/services/product-analytics";
import type { MentorshipCheckpoint } from "@/features/demo-domain/types/mentorship-continuity.types";

import type { useAiWorkspace } from "../../hooks/use-ai-workspace";

type Workspace = ReturnType<typeof useAiWorkspace>;

const sourceLabels = {
  founder_reported: "Founder ghi nhận",
  mentor_confirmed: "Mentor đã xác nhận",
  program_recorded: "Cán bộ chương trình ghi nhận",
} as const;

function formatDate(value: string, includeTime = false) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...(includeTime
      ? { hour: "2-digit", minute: "2-digit", hour12: false }
      : {}),
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(value));
}

function CheckpointSection({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Target;
  label: string;
  children: string;
}) {
  return (
    <div className="flex gap-3 py-3 first:pt-0 last:pb-0">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <h3 className="workspace-card-title text-ink">{label}</h3>
        <p className="mt-1 whitespace-pre-line workspace-supporting text-workspace-muted-text">
          {children}
        </p>
      </div>
    </div>
  );
}

function contextualAction(checkpoint?: MentorshipCheckpoint) {
  if (!checkpoint) return "capture" as const;
  if (checkpoint.status === "pre_read_sent") return "sent" as const;
  if (
    checkpoint.executionStatus ||
    checkpoint.resultSummary ||
    checkpoint.status === "pre_read_ready"
  ) {
    return "pre_read" as const;
  }
  return "update" as const;
}

export function MentorshipContinuityOverview({
  workspace,
  onNavigateToMentorDiscovery,
}: {
  workspace: Workspace;
  onNavigateToMentorDiscovery: () => void;
}) {
  if (!workspace.demoDomainHydrated) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center workspace-supporting text-workspace-muted-text" role="status">
        Đang tải hành trình đồng hành…
      </div>
    );
  }

  const request = workspace.acceptedMentorConnection;
  const journey = workspace.mentorshipJourney;
  if (!request || !journey) {
    return (
      <section className="flex min-h-0 flex-1 items-center justify-center p-5">
        <div className="max-w-md rounded-2xl border border-workspace-border bg-workspace-panel p-7 text-center">
          <HeartHandshake className="mx-auto size-6 text-primary" />
          <h1 className="mt-3 workspace-section-title text-ink">
            Bạn chưa có Mentor đang đồng hành.
          </h1>
          <p className="mt-2 workspace-supporting text-workspace-muted-text">
            Hãy kết nối với Mentor phù hợp trước khi bắt đầu một checkpoint.
          </p>
          <Button className="mt-5" onClick={onNavigateToMentorDiscovery}>
            Xem Mentor phù hợp
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </section>
    );
  }

  const checkpoint = workspace.activeMentorshipCheckpoint;
  const action = contextualAction(checkpoint);
  const mentor = request.briefSnapshot.mentor;
  const primaryLabel =
    action === "capture"
      ? "Ghi nhận buổi gặp"
      : action === "update"
        ? "Cập nhật kết quả"
        : action === "pre_read"
          ? "Chuẩn bị pre-read"
          : "Xem pre-read đã gửi";

  const openPrimary = () => {
    if (!checkpoint || action === "capture") {
      workspace.openMentorshipCheckpointCapture();
    } else if (action === "update") {
      workspace.openMentorshipResultUpdate(checkpoint.id);
    } else {
      workspace.openMentorshipPreRead(checkpoint.id);
    }
  };

  return (
    <section
      aria-labelledby="mentorship-heading"
      className="no-scrollbar min-h-0 flex-1 overflow-y-auto"
    >
      <div className="mx-auto w-full max-w-4xl px-5 pb-10 pt-4 sm:px-7">
        <p className="workspace-eyebrow text-primary">Không gian venture</p>
        <h1 id="mentorship-heading" className="mt-1 workspace-page-title text-ink">
          Đồng hành
        </h1>
        <p className="mt-2 workspace-supporting text-workspace-muted-text">
          Giữ mạch quyết định, cam kết và nội dung cần phản biện giữa các buổi gặp.
        </p>

        <div className="mt-5 rounded-2xl border border-workspace-border bg-workspace-panel p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <UserRoundCheck className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="workspace-section-title text-ink">{mentor.name}</h2>
                <span className="rounded-full border border-workspace-success/30 bg-workspace-success-soft px-2 py-1 workspace-meta text-workspace-success">
                  Đã kết nối
                </span>
              </div>
              <p className="mt-1 workspace-supporting text-workspace-muted-text">
                {mentor.role} · {mentor.organization}
              </p>
              <p className="mt-1 workspace-meta text-workspace-muted-text">
                Đồng hành từ {formatDate(journey.connectedAt)}
              </p>
            </div>
          </div>
          <dl className="mt-4 grid gap-3 border-t border-workspace-border pt-4 sm:grid-cols-2">
            <div>
              <dt className="workspace-eyebrow text-workspace-muted-text">Mục tiêu hiện tại</dt>
              <dd className="mt-1 workspace-supporting font-medium text-ink">{journey.currentGoal}</dd>
            </div>
            <div>
              <dt className="workspace-eyebrow text-workspace-muted-text">Review tiếp theo</dt>
              <dd className="mt-1 flex items-center gap-2 workspace-supporting font-medium text-ink">
                <CalendarClock className="size-4 text-primary" />
                {journey.nextReviewAt ? formatDate(journey.nextReviewAt, true) : "Chưa xác định"}
              </dd>
            </div>
          </dl>
        </div>

        <section className="mt-4 rounded-2xl border border-workspace-border bg-workspace-panel p-4 sm:p-5" aria-labelledby="current-checkpoint-heading">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="current-checkpoint-heading" className="workspace-section-title text-ink">Checkpoint hiện tại</h2>
            {checkpoint ? (
              <span className="rounded-full bg-primary-soft px-2 py-1 workspace-meta text-primary">
                {sourceLabels[checkpoint.source]}
              </span>
            ) : null}
          </div>
          {checkpoint ? (
            <div className="mt-4 divide-y divide-workspace-border">
              <CheckpointSection icon={CheckCircle2} label="Quyết định gần nhất">{checkpoint.decision}</CheckpointSection>
              <CheckpointSection icon={Target} label="Cam kết trước lần gặp tiếp theo">{checkpoint.founderCommitment}</CheckpointSection>
              <CheckpointSection icon={MessageCircleQuestion} label="Cần Mentor phản biện">{checkpoint.nextReviewQuestion}</CheckpointSection>
            </div>
          ) : (
            <p className="mt-3 workspace-supporting text-workspace-muted-text">Chưa có checkpoint nào được ghi nhận.</p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Button type="button" onClick={openPrimary}>
              {primaryLabel}
              <ArrowRight className="size-4" />
            </Button>
            {checkpoint ? (
              <Button type="button" variant="ghost" onClick={workspace.openMentorshipCheckpointCapture}>
                Ghi nhận buổi gặp mới
              </Button>
            ) : null}
            {checkpoint?.blockerSummary ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  trackProductEvent("mentorship_specialist_mentor_requested", {
                    ventureId: checkpoint.ventureId,
                    mentorId: checkpoint.mentorId,
                    checkpointId: checkpoint.id,
                  });
                  onNavigateToMentorDiscovery();
                }}
              >
                Tìm Specialist Mentor
              </Button>
            ) : null}
          </div>
        </section>

        <section className="mt-4" aria-labelledby="checkpoint-history-heading">
          <h2 id="checkpoint-history-heading" className="workspace-section-title text-ink">Lịch sử checkpoint</h2>
          <div className="mt-2 divide-y divide-workspace-border overflow-hidden rounded-xl border border-workspace-border bg-workspace-panel">
            {workspace.mentorshipCheckpoints.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => workspace.openMentorshipCheckpointDetail(item.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-workspace-row-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-workspace-focus-ring/50 motion-reduce:transition-none"
              >
                <div className="min-w-0 flex-1">
                  <p className="workspace-card-title text-ink">{item.sequence === 0 ? "Kick-off" : `Checkpoint #${item.sequence}`}</p>
                  <p className="mt-0.5 truncate workspace-meta text-workspace-muted-text">{item.title}</p>
                </div>
                <span className="hidden workspace-meta text-workspace-muted-text sm:block">{sourceLabels[item.source]}</span>
                <time className="workspace-meta text-workspace-muted-text">{formatDate(item.sessionDate)}</time>
                <ChevronRight className="size-4 shrink-0 text-workspace-muted-text" />
              </button>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
