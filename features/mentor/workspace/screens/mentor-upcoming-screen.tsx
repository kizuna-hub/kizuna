"use client";

import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Copy,
  ExternalLink,
  Inbox,
  UserRoundCheck,
} from "lucide-react";
import { toast } from "sonner";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/routing";

import { copyMentorContactValue } from "../services/mentor-contact-actions";
import { useMentorWorkspace } from "../state/mentor-workspace-provider";
import type { MentorConnectionRequest } from "../types/mentor-workspace.types";
import {
  contactMethodLabels,
  initials,
  meetingPreferenceLabels,
  relativeRequestTime,
  stageLabels,
} from "../components/mentor-workspace-labels";

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Inbox;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-workspace-border bg-workspace-panel p-5">
      <span className="flex size-11 items-center justify-center rounded-full bg-workspace-elevated text-workspace-muted-text">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div>
        <p className="workspace-supporting text-workspace-muted-text">
          {label}
        </p>
        <p className="mt-1 workspace-page-title">{value}</p>
      </div>
    </div>
  );
}

function ContactActions({
  request,
}: {
  request: MentorConnectionRequest;
}) {
  const acceptance = request.acceptance;
  if (!acceptance) return null;
  const accepted = acceptance;

  async function copyContact() {
    if (!accepted.contactValue) {
      toast.info(
        "Không có contact value vì mentor sẽ chủ động liên hệ.",
      );
      return;
    }
    try {
      await copyMentorContactValue(accepted.contactValue);
      toast.success("Đã sao chép.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Chưa thể sao chép.",
      );
    }
  }

  function openContact() {
    if (accepted.contactMethod === "email") {
      if (accepted.contactValue) {
        window.location.href = `mailto:${accepted.contactValue}`;
      }
      return;
    }
    if (accepted.contactMethod === "mentor_will_contact") {
      toast.info(
        "Founder chưa chia sẻ thêm contact ngoài Connection Brief.",
      );
      return;
    }
    toast.info(
      `Mock demo: Đã mở ${contactMethodLabels[accepted.contactMethod]}.`,
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {accepted.contactValue ? (
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => void copyContact()}
        >
          <Copy />
          Sao chép
        </Button>
      ) : null}
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={openContact}
      >
        <ExternalLink />
        {accepted.contactMethod === "email"
          ? "Mở email"
          : accepted.contactMethod === "mentor_will_contact"
            ? "Xem thông tin founder"
            : `Mở ${contactMethodLabels[accepted.contactMethod]}`}
      </Button>
      <Button asChild size="sm" variant="outline">
        <Link
          href={`/mentor/dashboard/requests/${request.id}`}
        >
          Xem brief
          <ArrowUpRight />
        </Link>
      </Button>
    </div>
  );
}

export function MentorUpcomingScreen() {
  const { requests, loading, error } = useMentorWorkspace();
  const acceptedRequests = requests
    .filter(
      (request) =>
        request.status === "accepted" &&
        Boolean(request.acceptance),
    )
    .sort((left, right) =>
      (right.acceptance?.acceptedAt ?? "").localeCompare(
        left.acceptance?.acceptedAt ?? "",
      ),
    );
  const waitingContact = acceptedRequests.filter(
    (request) =>
      request.acceptance?.meetingPreference ===
        "coordinate_later" ||
      request.acceptance?.contactMethod ===
        "mentor_will_contact",
  ).length;
  const thisWeek = acceptedRequests.filter(
    (request) =>
      request.acceptance?.meetingPreference !==
      "coordinate_later",
  ).length;

  return (
    <div className="mx-auto w-full max-w-[84rem] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-workspace-border pb-5">
        <div>
          <h1 className="workspace-page-title">Sắp tới</h1>
          <p className="mt-1 workspace-card-body text-workspace-muted-text">
            Các founder bạn đã đồng ý hỗ trợ.
          </p>
        </div>
        <Button variant="outline" size="sm">
          <CalendarDays />
          Hướng dẫn handoff
        </Button>
      </header>

      <section
        aria-label="Tóm tắt kết nối"
        className="mt-4 grid gap-3 sm:grid-cols-3"
      >
        <SummaryCard
          icon={UserRoundCheck}
          label="Đang chờ liên hệ"
          value={waitingContact}
        />
        <SummaryCard
          icon={CalendarDays}
          label="Lịch tuần này"
          value={thisWeek}
        />
        <SummaryCard
          icon={CheckCircle2}
          label="Đã chấp nhận"
          value={acceptedRequests.length}
        />
      </section>

      <section aria-label="Kết nối đã chấp nhận" className="mt-4">
        {loading ? (
          <div className="space-y-3">
            {[0, 1].map((item) => (
              <Skeleton
                key={item}
                className="h-56 rounded-xl bg-workspace-elevated"
              />
            ))}
          </div>
        ) : null}
        {!loading && error ? (
          <div className="rounded-xl border border-workspace-danger/30 bg-workspace-danger-soft p-5 text-workspace-danger">
            {error}
          </div>
        ) : null}
        {!loading && !error && acceptedRequests.length === 0 ? (
          <div className="rounded-xl border border-dashed border-workspace-border bg-workspace-panel px-6 py-16 text-center">
            <CalendarDays className="mx-auto size-8 text-workspace-muted-text" />
            <h2 className="mt-4 workspace-section-title">
              Chưa có kết nối sắp tới
            </h2>
            <p className="mt-2 workspace-supporting text-workspace-muted-text">
              Khi bạn chấp nhận một request, handoff sẽ xuất
              hiện tại đây.
            </p>
            <Button asChild className="mt-5">
              <Link href="/mentor/dashboard/requests">
                Xem yêu cầu
              </Link>
            </Button>
          </div>
        ) : null}

        {!loading && !error ? (
          <div className="space-y-3">
            {acceptedRequests.map((request, index) => {
              const acceptance = request.acceptance;
              if (!acceptance) return null;
              return (
                <article
                  key={request.id}
                  className="overflow-hidden rounded-xl border border-workspace-border bg-workspace-panel"
                >
                  <div className="grid gap-5 p-5 lg:grid-cols-[minmax(15rem,0.8fr)_minmax(18rem,1fr)_auto]">
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
                          <h2 className="workspace-card-title">
                            {request.founder.name}
                          </h2>
                          {index === 0 ? (
                            <Badge
                              variant="outline"
                              className="border-workspace-success/30 bg-workspace-success-soft text-workspace-success"
                            >
                              Đã chấp nhận
                            </Badge>
                          ) : null}
                        </div>
                        <p className="mt-1 workspace-supporting text-workspace-muted-text">
                          {request.venture.name} ·{" "}
                          {stageLabels[request.venture.stage]}
                        </p>
                        <p className="mt-3 flex items-center gap-1.5 workspace-meta text-workspace-muted-text">
                          <Clock3 className="size-3.5" />
                          Chấp nhận{" "}
                          {relativeRequestTime(
                            acceptance.acceptedAt,
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="border-workspace-border lg:border-l lg:pl-5">
                      <p className="workspace-meta font-semibold uppercase tracking-[0.1em] text-workspace-muted-text">
                        Vấn đề hiện tại
                      </p>
                      <p className="mt-2 line-clamp-2 workspace-supporting">
                        {request.brief.currentChallenge}
                      </p>
                      <p className="mt-3 workspace-meta text-workspace-muted-text">
                        Hình thức:{" "}
                        {
                          meetingPreferenceLabels[
                            acceptance.meetingPreference
                          ]
                        }
                      </p>
                    </div>

                    <div className="lg:text-right">
                      <Badge
                        variant="outline"
                        className="border-workspace-success/30 bg-workspace-success-soft text-workspace-success"
                      >
                        {acceptance.meetingPreference ===
                        "coordinate_later"
                          ? "Đang chờ thống nhất"
                          : "Đã có hình thức"}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid gap-4 border-t border-workspace-border bg-workspace-elevated p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                    <div>
                      <p className="workspace-supporting">
                        {acceptance.message}
                      </p>
                      <p className="mt-2 workspace-meta text-workspace-muted-text">
                        {
                          contactMethodLabels[
                            acceptance.contactMethod
                          ]
                        }
                        {acceptance.contactValue
                          ? ` · ${acceptance.contactValue}`
                          : ""}
                      </p>
                    </div>
                    <ContactActions request={request} />
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </section>
    </div>
  );
}
