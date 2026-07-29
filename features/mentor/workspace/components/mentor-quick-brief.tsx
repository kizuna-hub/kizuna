"use client";

import * as React from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  FolderOpen,
  PackageOpen,
  Paperclip,
  Target,
  UserRoundCheck,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import type { MentorConnectionRequest } from "../types/mentor-workspace.types";
import {
  MentorAcceptanceDialog,
  MentorMoreContextDialog,
} from "./mentor-request-actions";
import {
  stageLabels,
  statusLabels,
} from "./mentor-workspace-labels";

function QuickBriefSection({
  icon: Icon,
  title,
  children,
  prominent = false,
}: {
  icon: typeof Target;
  title: string;
  children: React.ReactNode;
  prominent?: boolean;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-workspace-border bg-workspace-elevated p-4",
        prominent &&
          "border-primary-border bg-primary-soft/50",
      )}
    >
      <div className="flex items-center gap-2">
        <Icon
          className={cn(
            "size-4 text-primary",
            prominent && "text-workspace-warning",
          )}
          aria-hidden="true"
        />
        <h3 className="workspace-card-title">{title}</h3>
      </div>
      <div className="mt-3 workspace-supporting text-workspace-muted-text">
        {children}
      </div>
    </section>
  );
}

export function MentorQuickBrief({
  request,
  onClose,
  className,
}: {
  request: MentorConnectionRequest;
  onClose: () => void;
  className?: string;
}) {
  const [acceptOpen, setAcceptOpen] = React.useState(false);
  const [moreContextOpen, setMoreContextOpen] =
    React.useState(false);
  const [documentOpen, setDocumentOpen] =
    React.useState(false);
  const unavailable =
    request.status === "cancelled" ||
    request.status === "declined" ||
    request.status === "accepted";

  return (
    <>
      <aside
        aria-label={`Brief đọc nhanh của ${request.venture.name}`}
        className={cn(
          "flex min-h-0 flex-col overflow-hidden rounded-xl border border-workspace-border bg-workspace-panel",
          className,
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-workspace-border px-5 py-5">
          <div>
            <h2 className="workspace-section-title">
              Brief đọc nhanh
            </h2>
            <p className="mt-1 workspace-supporting text-workspace-muted-text">
              Bản tóm tắt giúp bạn nắm nhanh yêu cầu của
              founder.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Đóng brief đọc nhanh"
          >
            <X />
          </Button>
        </header>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="workspace-card-title">
              {request.venture.name}
            </h3>
            <Badge
              variant="outline"
              className="border-workspace-border bg-workspace-elevated"
            >
              {stageLabels[request.venture.stage]}
            </Badge>
            <Badge
              variant="outline"
              className="border-workspace-border bg-workspace-elevated"
            >
              {statusLabels[request.status]}
            </Badge>
          </div>

          <QuickBriefSection icon={PackageOpen} title="Sản phẩm">
            <p className="line-clamp-3">
              {request.venture.productSummary}
            </p>
          </QuickBriefSection>

          <QuickBriefSection
            icon={AlertTriangle}
            title="Khó khăn hiện tại"
            prominent
          >
            <p>{request.brief.currentChallenge}</p>
            {request.brief.founderConfirmed ? (
              <p className="mt-3 flex items-center gap-1.5 workspace-meta text-workspace-success">
                <CheckCircle2
                  className="size-3.5"
                  aria-hidden="true"
                />
                Được founder xác nhận
              </p>
            ) : null}
          </QuickBriefSection>

          <QuickBriefSection
            icon={UserRoundCheck}
            title="Founder muốn bạn hỗ trợ"
          >
            <ul className="space-y-2">
              {request.brief.supportNeeded
                .slice(0, 4)
                .map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2"
                  >
                    <span
                      className="mt-2 size-1 shrink-0 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
            </ul>
          </QuickBriefSection>

          <QuickBriefSection
            icon={Target}
            title="Outcome mong muốn"
          >
            {request.brief.expectedOutcome}
          </QuickBriefSection>

          <QuickBriefSection
            icon={FolderOpen}
            title="Bằng chứng"
          >
            <div className="grid grid-cols-2 gap-2">
              {request.evidence.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-workspace-border bg-workspace-background px-3 py-2"
                >
                  <p className="workspace-card-title">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </QuickBriefSection>

          <QuickBriefSection
            icon={Paperclip}
            title="Tài liệu"
          >
            {request.sharedDocuments.length > 0 ? (
              request.sharedDocuments.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-workspace-border bg-workspace-background p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate workspace-card-title">
                      {document.name}
                    </p>
                    <p className="mt-1 workspace-meta text-workspace-muted-text">
                      {document.selectedPageLabels?.join(" · ") ??
                        document.type.toLocaleUpperCase("vi")}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    disabled={!document.available}
                    onClick={() => setDocumentOpen(true)}
                    aria-label={`Mở ${document.name}`}
                  >
                    <ArrowUpRight />
                  </Button>
                </div>
              ))
            ) : (
              <p>Founder chưa chia sẻ tài liệu.</p>
            )}
          </QuickBriefSection>
        </div>

        <footer className="grid gap-2 border-t border-workspace-border p-4 sm:grid-cols-2">
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
            disabled={unavailable}
            onClick={() => setAcceptOpen(true)}
          >
            {request.status === "accepted"
              ? "Đã chấp nhận"
              : "Chấp nhận"}
          </Button>
          <Button
            asChild
            variant="ghost"
            className="sm:col-span-2"
          >
            <Link
              href={`/mentor/dashboard/requests/${request.id}`}
            >
              Xem brief đầy đủ
              <ArrowUpRight />
            </Link>
          </Button>
        </footer>
      </aside>

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
      <Dialog open={documentOpen} onOpenChange={setDocumentOpen}>
        <DialogContent className="border-workspace-border bg-workspace-panel sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              {request.sharedDocuments[0]?.name ??
                "Tài liệu chia sẻ"}
            </DialogTitle>
            <DialogDescription>
              Bản xem nguồn rút gọn cho live demo.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border border-workspace-border bg-workspace-background p-5">
            <p className="workspace-meta uppercase tracking-[0.12em] text-workspace-muted-text">
              Trang được founder chọn
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {request.sharedDocuments[0]?.selectedPageLabels?.map(
                (page) => (
                  <Badge
                    key={page}
                    variant="outline"
                    className="border-primary-border bg-primary-soft text-primary"
                  >
                    {page}
                  </Badge>
                ),
              )}
            </div>
            <p className="mt-5 workspace-supporting text-workspace-muted-text">
              Viewer đầy đủ chưa được nối trong Mentor MVP. Các
              trích dẫn evidence vẫn giữ source label để truy xuất.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => {
              toast.info("Mock demo: Đã mở tài liệu.");
              setDocumentOpen(false);
            }}
          >
            Mở tài liệu (demo)
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
