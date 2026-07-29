"use client";

import * as React from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  Clock3,
  FileText,
  MessageSquareQuote,
  PackageOpen,
  Paperclip,
  Target,
  UserRound,
  UsersRound,
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
import { cn } from "@/lib/utils";

import {
  MentorAcceptanceDialog,
  MentorDeclineDialog,
  MentorMoreContextDialog,
} from "../components/mentor-request-actions";
import { MentorRequestStatus } from "../components/mentor-request-status";
import {
  initials,
  relativeRequestTime,
  stageLabels,
} from "../components/mentor-workspace-labels";
import { useMentorWorkspace } from "../state/mentor-workspace-provider";

function DetailSection({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon: typeof Target;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-workspace-border bg-workspace-panel p-5",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-primary" aria-hidden="true" />
        <h2 className="workspace-section-title">{title}</h2>
      </div>
      <div className="mt-4 workspace-card-body text-workspace-muted-text">
        {children}
      </div>
    </section>
  );
}

export function MentorRequestDetailScreen({
  requestId,
}: {
  requestId: string;
}) {
  const { getRequest, loading, markViewed } =
    useMentorWorkspace();
  const request = getRequest(requestId);
  const [acceptOpen, setAcceptOpen] = React.useState(false);
  const [moreContextOpen, setMoreContextOpen] =
    React.useState(false);
  const [declineOpen, setDeclineOpen] =
    React.useState(false);

  React.useEffect(() => {
    if (!request || request.status !== "new") return;
    void markViewed(request.id);
  }, [markViewed, request]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[90rem] space-y-4 px-4 py-6 sm:px-6 lg:px-8">
        <Skeleton className="h-12 w-80 bg-workspace-elevated" />
        <Skeleton className="h-40 w-full rounded-xl bg-workspace-elevated" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-56 rounded-xl bg-workspace-elevated" />
          <Skeleton className="h-56 rounded-xl bg-workspace-elevated" />
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <UserRound className="mx-auto size-9 text-workspace-muted-text" />
        <h1 className="mt-4 workspace-page-title">
          Không tìm thấy yêu cầu
        </h1>
        <p className="mt-2 workspace-card-body text-workspace-muted-text">
          Yêu cầu có thể đã được gỡ hoặc URL không còn hợp lệ.
        </p>
        <Button asChild className="mt-6">
          <Link href="/mentor/dashboard/requests">
            <ArrowLeft />
            Quay lại Yêu cầu
          </Link>
        </Button>
      </div>
    );
  }

  const unavailable =
    request.status === "cancelled" ||
    request.status === "declined" ||
    request.status === "accepted";

  return (
    <>
      <div className="mx-auto w-full max-w-[92rem] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <header className="flex flex-col gap-4 border-b border-workspace-border pb-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <Button asChild variant="ghost" size="icon">
              <Link
                href="/mentor/dashboard/requests"
                aria-label="Quay lại danh sách yêu cầu"
              >
                <ArrowLeft />
              </Link>
            </Button>
            <div className="min-w-0">
              <h1 className="workspace-page-title">
                Chi tiết yêu cầu
              </h1>
              <p className="mt-1 workspace-supporting text-workspace-muted-text">
                Review đầy đủ context founder đã chủ động chia sẻ.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              disabled={unavailable}
              onClick={() => setAcceptOpen(true)}
            >
              {request.status === "accepted"
                ? "Đã chấp nhận"
                : "Chấp nhận"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={unavailable}
              onClick={() => setMoreContextOpen(true)}
            >
              Cần thêm thông tin
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={unavailable}
              onClick={() => setDeclineOpen(true)}
            >
              Từ chối
            </Button>
          </div>
        </header>

        {request.status === "cancelled" ? (
          <div
            role="status"
            className="mt-4 rounded-xl border border-workspace-danger/30 bg-workspace-danger-soft px-4 py-3 workspace-supporting text-workspace-danger"
          >
            Founder đã hủy yêu cầu này. Nội dung vẫn được giữ để
            tham chiếu, nhưng các hành động đã bị khóa.
          </div>
        ) : null}
        {request.briefVersion >
        (request.viewedBriefVersion ?? 0) ? (
          <div
            role="status"
            className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-workspace-warning/30 bg-workspace-warning-soft px-4 py-3 workspace-supporting text-workspace-warning"
          >
            <span>
              Founder đã cập nhật brief sau lần bạn xem gần nhất.
            </span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                void markViewed(request.id);
                toast.success("Đã cập nhật brief mới nhất.");
              }}
            >
              Làm mới
            </Button>
          </div>
        ) : null}

        <section className="mt-4 rounded-xl border border-workspace-border bg-workspace-panel p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <Avatar className="size-16 border border-workspace-border bg-workspace-elevated">
                <AvatarImage
                  src={request.founder.avatarSrc}
                  alt=""
                />
                <AvatarFallback className="bg-primary-soft text-lg font-semibold text-primary">
                  {initials(request.founder.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="workspace-page-title">
                    {request.founder.name}
                  </h2>
                  <MentorRequestStatus
                    status={request.status}
                  />
                </div>
                <p className="mt-1 workspace-card-body text-workspace-muted-text">
                  {request.founder.institution}
                </p>
              </div>
            </div>
            <dl className="grid gap-4 sm:grid-cols-3 lg:min-w-[34rem]">
              <div className="border-workspace-border sm:border-l sm:pl-4">
                <dt className="flex items-center gap-1.5 workspace-meta text-workspace-muted-text">
                  <BriefcaseBusiness className="size-3.5" />
                  Venture
                </dt>
                <dd className="mt-1 workspace-card-title">
                  {request.venture.name}
                </dd>
              </div>
              <div className="border-workspace-border sm:border-l sm:pl-4">
                <dt className="flex items-center gap-1.5 workspace-meta text-workspace-muted-text">
                  <UsersRound className="size-3.5" />
                  Team · Giai đoạn
                </dt>
                <dd className="mt-1 workspace-card-title">
                  {request.venture.teamSummary} ·{" "}
                  {stageLabels[request.venture.stage]}
                </dd>
              </div>
              <div className="border-workspace-border sm:border-l sm:pl-4">
                <dt className="flex items-center gap-1.5 workspace-meta text-workspace-muted-text">
                  <Clock3 className="size-3.5" />
                  Đã gửi
                </dt>
                <dd className="mt-1 workspace-card-title">
                  {relativeRequestTime(request.createdAt)}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <DetailSection icon={PackageOpen} title="1. Sản phẩm">
            <p className="line-clamp-3">
              {request.venture.productSummary}
            </p>
          </DetailSection>

          <DetailSection
            icon={Target}
            title="2. Khó khăn hiện tại"
            className="border-primary-border bg-primary-soft/35"
          >
            <p>{request.brief.currentChallenge}</p>
            {request.brief.founderConfirmed ? (
              <p className="mt-3 flex items-center gap-1.5 workspace-meta text-workspace-success">
                <Check className="size-3.5" />
                Được founder xác nhận
              </p>
            ) : null}
          </DetailSection>

          <DetailSection
            icon={UserRound}
            title="3. Founder muốn bạn hỗ trợ"
          >
            <ul className="space-y-3">
              {request.brief.supportNeeded.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3"
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border border-primary-border text-primary">
                    <Check className="size-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </DetailSection>

          <div className="grid gap-4">
            <DetailSection
              icon={Target}
              title="4. Kết quả mong muốn sau phiên"
            >
              {request.brief.expectedOutcome}
            </DetailSection>
            <DetailSection
              icon={BriefcaseBusiness}
              title="5. Tín hiệu hiện có"
            >
              <div className="grid gap-2 sm:grid-cols-2">
                {request.evidence.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-workspace-border bg-workspace-elevated p-3"
                  >
                    <p className="workspace-card-title">
                      {item.label}
                    </p>
                    {item.sourceLabel ? (
                      <p className="mt-1 workspace-meta text-workspace-muted-text">
                        {item.sourceLabel}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </DetailSection>
          </div>

          <DetailSection
            icon={Paperclip}
            title="6. Tài liệu gửi kèm"
          >
            {request.sharedDocuments.length > 0 ? (
              <div className="space-y-2">
                {request.sharedDocuments.map((document) => (
                  <div
                    key={document.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-workspace-border bg-workspace-elevated p-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <FileText className="size-5 shrink-0 text-primary" />
                      <div className="min-w-0">
                        <p className="truncate workspace-card-title">
                          {document.name}
                        </p>
                        <p className="workspace-meta text-workspace-muted-text">
                          {document.type.toLocaleUpperCase("vi")}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {document.selectedPageLabels?.map(
                        (page) => (
                          <Badge
                            key={page}
                            variant="outline"
                            className="border-workspace-border bg-workspace-background"
                          >
                            {page}
                          </Badge>
                        ),
                      )}
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={!document.available}
                        onClick={() =>
                          toast.info(
                            document.available
                              ? "Mock demo: Đã mở tài liệu."
                              : "Tài liệu hiện không khả dụng.",
                          )
                        }
                      >
                        Xem nguồn
                        <ArrowUpRight />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Founder chưa chia sẻ tài liệu.</p>
            )}
          </DetailSection>

          <DetailSection
            icon={MessageSquareQuote}
            title="7. Lời nhắn của founder"
          >
            <blockquote className="border-l-2 border-primary pl-4 italic">
              “
              {request.brief.founderMessage ??
                "Founder chưa để lại lời nhắn riêng."}
              ”
            </blockquote>
          </DetailSection>
        </div>

        {request.status === "accepted" ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-workspace-success/30 bg-workspace-success-soft p-4">
            <p className="workspace-card-title text-workspace-success">
              Đã chấp nhận yêu cầu kết nối.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/mentor/dashboard/calendar">
                Xem trong Sắp tới
                <ArrowUpRight />
              </Link>
            </Button>
          </div>
        ) : null}
      </div>

      <MentorAcceptanceDialog
        request={request}
        open={acceptOpen}
        onOpenChange={setAcceptOpen}
      />
      <MentorMoreContextDialog
        request={request}
        open={moreContextOpen}
        onOpenChange={setMoreContextOpen}
      />
      <MentorDeclineDialog
        request={request}
        open={declineOpen}
        onOpenChange={setDeclineOpen}
      />
    </>
  );
}
