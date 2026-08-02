"use client";

import * as React from "react";
import {
  AlertTriangle,
  BellRing,
  CheckCircle2,
  Circle,
  Clock3,
  Eye,
  UserRoundSearch,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

import { PersonAvatar } from "../../components/admin-ui";
import type { UniversityMentorConnectionSummary } from "../model/mentor-connection";
import { ConnectionStatusBadge } from "./mentor-connection-table";

export function ConnectionRequestDetail({
  request,
}: {
  request: UniversityMentorConnectionSummary;
}) {
  const [founderReminded, setFounderReminded] = React.useState(false);
  const [isWatching, setIsWatching] = React.useState(false);
  const timeline = [
    {
      label: "Request được tạo",
      time: request.createdAt,
      complete: true,
    },
    {
      label: "Request đã gửi",
      time: request.status === "Draft" ? "Chưa gửi" : request.createdAt,
      complete: request.status !== "Draft",
    },
    {
      label: "Mentor đã mở",
      time: request.openedAt ?? "Chưa mở",
      complete: Boolean(request.openedAt),
    },
    {
      label: "Mentor đã phản hồi",
      time: request.respondedAt ?? "Đang chờ",
      complete: Boolean(request.respondedAt),
    },
  ];

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] p-4">
        <div className="flex items-center justify-between gap-3">
          <span>
            <span className="block text-[10px] text-[var(--admin-muted)]">
              Venture
            </span>
            <strong className="text-sm">{request.ventureName}</strong>
          </span>
          <ConnectionStatusBadge status={request.status} />
        </div>
        <p className="mt-3 text-[10px] text-[var(--admin-muted)]">
          Mục tiêu kết nối
        </p>
        <p className="mt-1 text-xs leading-5">{request.objective}</p>
        <div className="mt-3 flex flex-wrap gap-1">
          {request.expertise.map((expertise) => (
            <span
              key={expertise}
              className="rounded-md bg-[var(--admin-blue-soft)] px-2 py-1 text-[9px] text-[var(--admin-primary)]"
            >
              {expertise}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xs font-semibold">Mentor được đề xuất</h3>
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-[var(--admin-border)] p-3">
          <PersonAvatar
            name={request.mentorName}
            src={request.mentorAvatarUrl}
            size="md"
          />
          <span className="min-w-0 flex-1">
            <strong className="block text-xs">{request.mentorName}</strong>
            <span className="text-[10px] text-[var(--admin-muted)]">
              {request.expertise.join(" · ")}
            </span>
          </span>
          {request.mentorOverloaded ? (
            <span className="flex items-center gap-1 text-[9px] text-[var(--admin-red)]">
              <AlertTriangle className="size-3.5" />
              Quá tải
            </span>
          ) : null}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold">Tiến trình request</h3>
          <span className="inline-flex items-center gap-1 text-[10px] text-[var(--admin-muted)]">
            <Clock3 className="size-3.5" />
            Chờ {request.waitingHours} giờ
          </span>
        </div>
        <ol className="mt-3 space-y-1">
          {timeline.map((item, index) => (
            <li key={item.label} className="grid grid-cols-[20px_1fr] gap-2">
              <span className="flex flex-col items-center">
                {item.complete ? (
                  <CheckCircle2 className="size-4 text-[var(--admin-green)]" />
                ) : (
                  <Circle className="size-4 text-[var(--admin-muted)]" />
                )}
                {index < timeline.length - 1 ? (
                  <span className="h-8 w-px bg-[var(--admin-border)]" />
                ) : null}
              </span>
              <span>
                <strong className="block text-[10px]">{item.label}</strong>
                <span className="text-[9px] text-[var(--admin-muted)]">
                  {item.time}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {request.needsContext ? (
        <section className="rounded-xl border border-[var(--admin-red)]/35 bg-[var(--admin-red-soft)] p-4">
          <h3 className="flex items-center gap-2 text-xs font-semibold text-[var(--admin-red)]">
            <AlertTriangle className="size-4" />
            Context còn thiếu
          </h3>
          <p className="mt-2 text-[10px] leading-5 text-[var(--admin-muted)]">
            Founder chưa cung cấp success metric và phạm vi hỗ trợ mong
            muốn. Admin nên nhắc founder hoàn thiện brief trước khi mentor
            phản hồi.
          </p>
        </section>
      ) : null}

      <section>
        <h3 className="text-xs font-semibold">Hành động đề xuất</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Button
            asChild
            variant="outline"
            className="border-[var(--admin-border)] bg-transparent text-[10px]"
          >
            <Link href={`/university-admin/ventures/${request.ventureId}`}>
              <Eye className="size-3.5" />
              Xem venture
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-[var(--admin-border)] bg-transparent text-[10px]"
          >
            <Link
              href={`/university-admin/lecturer-mentors/${request.mentorId}`}
            >
              <UserRoundSearch className="size-3.5" />
              Xem mentor
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setFounderReminded(true)}
            disabled={founderReminded}
            className="border-[var(--admin-border)] bg-transparent text-[10px]"
          >
            <BellRing className="size-3.5" />
            {founderReminded
              ? "Đã gửi lời nhắc"
              : "Nhắc founder bổ sung context"}
          </Button>
          <Button
            type="button"
            onClick={() => setIsWatching((current) => !current)}
            className="bg-[var(--admin-primary)] text-[10px] text-white hover:bg-[var(--admin-primary-hover)]"
          >
            {isWatching
              ? "Đã đánh dấu theo dõi"
              : "Đánh dấu cần theo dõi"}
          </Button>
        </div>
      </section>

      <p className="rounded-lg bg-[var(--admin-blue-soft)] p-3 text-[9px] leading-4 text-[var(--admin-muted)]">
        University Admin chỉ xem trạng thái và dữ liệu vận hành của
        request. Tin nhắn riêng giữa founder và mentor không được hiển thị.
      </p>
    </div>
  );
}
