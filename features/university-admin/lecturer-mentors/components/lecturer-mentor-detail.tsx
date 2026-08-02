"use client";

import * as React from "react";
import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  Clock3,
  PauseCircle,
  Power,
  Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

import { PersonAvatar } from "../../components/admin-ui";
import type { UniversityLecturerMentorSummary } from "../model/lecturer-mentor";

export function LecturerMentorDetail({
  mentor,
}: {
  mentor: UniversityLecturerMentorSummary;
}) {
  const [acceptingRequests, setAcceptingRequests] = React.useState(
    mentor.availability !== "Tạm ngưng nhận request",
  );
  const primaryVentureId = mentor.supportedVentures[0]
    ?.toLocaleLowerCase("vi")
    .replaceAll(" ", "");

  return (
    <div className="space-y-5">
      <section className="flex items-start gap-4 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] p-4">
        <PersonAvatar
          name={mentor.name}
          src={mentor.avatarUrl}
          size="md"
        />
        <span className="min-w-0 flex-1">
          <strong className="block text-base">{mentor.name}</strong>
          <span className="mt-0.5 block text-xs text-[var(--admin-muted)]">
            {mentor.academicTitle} · {mentor.faculty}
          </span>
          <span className="mt-0.5 block text-[10px] text-[var(--admin-muted)]">
            {mentor.department}
          </span>
          <span className="mt-3 flex flex-wrap gap-1">
            {mentor.expertise.map((expertise) => (
              <span
                key={expertise}
                className="rounded-md bg-[var(--admin-blue-soft)] px-2 py-1 text-[9px] text-[var(--admin-primary)]"
              >
                {expertise}
              </span>
            ))}
          </span>
        </span>
      </section>

      <section className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          {
            icon: Activity,
            label: "Availability",
            value: mentor.availability,
          },
          {
            icon: BriefcaseBusiness,
            label: "Request đang xử lý",
            value: String(mentor.activeRequestCount),
          },
          {
            icon: Clock3,
            label: "Phản hồi trung vị",
            value: `${mentor.medianResponseHours} giờ`,
          },
          {
            icon: Target,
            label: "Tỷ lệ chấp nhận",
            value: `${mentor.acceptanceRate}%`,
          },
        ].map((metric) => (
          <div
            key={metric.label}
            className="rounded-lg border border-[var(--admin-border)] p-3"
          >
            <metric.icon className="size-4 text-[var(--admin-primary)]" />
            <span className="mt-2 block text-[9px] text-[var(--admin-muted)]">
              {metric.label}
            </span>
            <strong className="mt-0.5 block text-xs">{metric.value}</strong>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-[var(--admin-border)] p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xs font-semibold">Nhu cầu chuyên môn</h3>
          <span className="rounded-full bg-[var(--admin-orange-soft)] px-2.5 py-1 text-[9px] text-[var(--admin-orange)]">
            Nhu cầu {mentor.demandLevel.toLocaleLowerCase("vi")}
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--admin-surface-muted)]">
          <span
            className="block h-full rounded-full bg-[var(--admin-primary)]"
            style={{
              width:
                mentor.demandLevel === "Cao"
                  ? "86%"
                  : mentor.demandLevel === "Trung bình"
                    ? "58%"
                    : "34%",
            }}
          />
        </div>
      </section>

      <section>
        <h3 className="text-xs font-semibold">Venture đang hỗ trợ</h3>
        {mentor.supportedVentures.length ? (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {mentor.supportedVentures.map((venture) => (
              <div
                key={venture}
                className="flex items-center gap-2 rounded-lg border border-[var(--admin-border)] p-3 text-[10px]"
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-[var(--admin-green-soft)] text-[var(--admin-green)]">
                  <BriefcaseBusiness className="size-3.5" />
                </span>
                <strong>{venture}</strong>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-[10px] text-[var(--admin-muted)]">
            Mentor chưa hỗ trợ venture nào trong cohort này.
          </p>
        )}
      </section>

      <section className="rounded-xl border border-[var(--admin-border)] p-4">
        <h3 className="flex items-center gap-2 text-xs font-semibold">
          <BarChart3 className="size-4 text-[var(--admin-primary)]" />
          Hoạt động matching gần đây
        </h3>
        <p className="mt-2 text-[10px] text-[var(--admin-muted)]">
          {mentor.recentActivity}
        </p>
      </section>

      <div className="grid gap-2 sm:grid-cols-2">
        <Button
          asChild
          variant="outline"
          className="border-[var(--admin-border)] bg-transparent text-[10px]"
        >
          <Link href="/university-admin/mentor-connections">
            Xem các request
          </Link>
        </Button>
        <Button
          asChild={Boolean(primaryVentureId)}
          variant="outline"
          disabled={!primaryVentureId}
          title={
            primaryVentureId
              ? undefined
              : "Mentor chưa hỗ trợ venture nào trong cohort này"
          }
          className="border-[var(--admin-border)] bg-transparent text-[10px]"
        >
          {primaryVentureId ? (
            <Link href={`/university-admin/ventures/${primaryVentureId}`}>
              Xem venture đang hỗ trợ
            </Link>
          ) : (
            "Xem venture đang hỗ trợ"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setAcceptingRequests(false)}
          disabled={!acceptingRequests}
          className="border-[var(--admin-orange)]/40 bg-transparent text-[10px] text-[var(--admin-orange)]"
        >
          <PauseCircle className="size-3.5" />
          {acceptingRequests
            ? "Tạm ngưng nhận request"
            : "Đã tạm ngưng nhận request"}
        </Button>
        <Button
          type="button"
          onClick={() => setAcceptingRequests(true)}
          disabled={acceptingRequests}
          className="bg-[var(--admin-primary)] text-[10px] text-white hover:bg-[var(--admin-primary-hover)]"
        >
          <Power className="size-3.5" />
          Đánh dấu còn nhận request
        </Button>
      </div>
    </div>
  );
}
