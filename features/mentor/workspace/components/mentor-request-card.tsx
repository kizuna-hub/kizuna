"use client";

import {
  ArrowRight,
  BriefcaseBusiness,
  Clock3,
  MapPin,
  Sparkles,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import type { MentorConnectionRequest } from "../types/mentor-workspace.types";
import {
  initials,
  relativeRequestTime,
  stageLabels,
} from "./mentor-workspace-labels";
import { MentorRequestStatus } from "./mentor-request-status";

export function MentorRequestCard({
  request,
  primary = false,
  onOpenBrief,
  onAccept,
  onDecline,
}: {
  request: MentorConnectionRequest;
  primary?: boolean;
  onOpenBrief: () => void;
  onAccept: () => void;
  onDecline: () => void;
}) {
  const unavailable =
    request.status === "cancelled" ||
    request.status === "declined" ||
    request.status === "accepted";

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-xl border border-workspace-border bg-workspace-panel transition-colors hover:border-workspace-border-strong",
        primary && "border-primary-border",
        request.status === "cancelled" && "opacity-65",
      )}
    >
      {primary ? (
        <span className="absolute right-4 top-4 size-2 rounded-full bg-primary" />
      ) : null}
      <div
        className={cn(
          "grid gap-5 p-5",
          primary
            ? "xl:grid-cols-[minmax(15rem,0.95fr)_minmax(18rem,1.2fr)_minmax(13rem,0.8fr)_auto]"
            : "lg:grid-cols-[minmax(14rem,0.9fr)_minmax(19rem,1.35fr)_auto]",
        )}
      >
        <div className="min-w-0">
          <div className="flex items-start gap-3">
            <Avatar className="size-12 border border-workspace-border bg-workspace-elevated">
              <AvatarImage
                src={request.founder.avatarSrc}
                alt=""
              />
              <AvatarFallback className="bg-primary-soft font-semibold text-primary">
                {initials(request.founder.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="workspace-card-title truncate">
                  {request.founder.name}
                </h2>
                <MentorRequestStatus status={request.status} />
              </div>
              <p className="mt-1 workspace-supporting text-workspace-muted-text">
                {request.venture.name} ·{" "}
                {stageLabels[request.venture.stage]}
              </p>
            </div>
          </div>
          <p className="mt-4 line-clamp-2 workspace-supporting text-workspace-muted-text">
            {request.venture.productSummary}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 workspace-meta text-workspace-muted-text">
            <span className="flex items-center gap-1.5">
              <BriefcaseBusiness
                className="size-3.5"
                aria-hidden="true"
              />
              {request.venture.teamSummary}
            </span>
            {request.founder.institution ? (
              <span className="flex items-center gap-1.5">
                <MapPin
                  className="size-3.5"
                  aria-hidden="true"
                />
                {request.founder.institution}
              </span>
            ) : null}
          </div>
        </div>

        <div
          className={cn(
            "min-w-0 border-workspace-border",
            primary
              ? "xl:border-l xl:pl-5"
              : "lg:border-l lg:pl-5",
          )}
        >
          <p className="workspace-meta font-semibold uppercase tracking-[0.1em] text-workspace-muted-text">
            Khó khăn hiện tại
          </p>
          <p className="mt-2 line-clamp-3 workspace-supporting">
            {request.brief.currentChallenge}
          </p>
          <p className="mt-4 workspace-meta font-semibold uppercase tracking-[0.1em] text-workspace-muted-text">
            Cần bạn hỗ trợ
          </p>
          <ul className="mt-2 space-y-1 workspace-supporting text-workspace-muted-text">
            {request.brief.supportNeeded
              .slice(0, primary ? 3 : 1)
              .map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2"
                >
                  <span
                    className="mt-2 size-1 shrink-0 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  <span className="line-clamp-1">{item}</span>
                </li>
              ))}
          </ul>
        </div>

        {primary ? (
          <div className="min-w-0 border-workspace-border xl:border-l xl:pl-5">
            <p className="workspace-meta font-semibold uppercase tracking-[0.1em] text-workspace-muted-text">
              Bằng chứng ban đầu
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {request.evidence.slice(0, 4).map((item) => (
                <Badge
                  key={item.id}
                  variant="outline"
                  className="rounded-lg border-workspace-border bg-workspace-elevated px-2.5 py-1.5 text-workspace-muted-text"
                >
                  {item.label}
                </Badge>
              ))}
            </div>
            <p className="mt-4 flex items-center gap-1.5 workspace-meta text-workspace-muted-text">
              <Sparkles
                className="size-3.5 text-primary"
                aria-hidden="true"
              />
              Phù hợp {request.fitScore}%
            </p>
          </div>
        ) : null}

        <div className="flex min-w-[10rem] flex-col justify-between gap-4">
          <p className="flex items-center justify-end gap-1.5 workspace-meta text-workspace-muted-text">
            <Clock3 className="size-3.5" aria-hidden="true" />
            {relativeRequestTime(request.createdAt)}
          </p>
          <div className="grid gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenBrief}
            >
              Brief nhanh
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={unavailable}
              onClick={onAccept}
            >
              {request.status === "accepted"
                ? "Đã chấp nhận"
                : "Chấp nhận"}
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link
                href={`/mentor/dashboard/requests/${request.id}`}
              >
                Xem đầy đủ
                <ArrowRight />
              </Link>
            </Button>
            {!unavailable ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onDecline}
                className="text-workspace-muted-text"
              >
                Bỏ qua
              </Button>
            ) : null}
          </div>
        </div>
      </div>
      {request.status === "cancelled" ? (
        <div className="border-t border-workspace-border bg-workspace-danger-soft px-5 py-3 workspace-supporting text-workspace-danger">
          Founder đã hủy yêu cầu này. Các hành động đã được vô
          hiệu hóa.
        </div>
      ) : null}
      {request.briefVersion >
      (request.viewedBriefVersion ?? request.briefVersion) ? (
        <div className="border-t border-workspace-border bg-workspace-warning-soft px-5 py-3 workspace-supporting text-workspace-warning">
          Founder vừa cập nhật brief. Mở lại để xem nội dung mới.
        </div>
      ) : null}
    </article>
  );
}
