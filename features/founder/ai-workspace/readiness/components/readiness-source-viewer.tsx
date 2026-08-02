"use client";

import React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  FileText,
  Flag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { readinessSourceDocuments } from "../demo/readiness-demo-data";
import type { ReadinessContribution } from "../types/readiness.types";

export function ReadinessSourceViewer({
  contribution,
  open,
  onOpenChange,
  onMarkInaccurate,
  onConfirm,
}: {
  contribution?: ReadinessContribution;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMarkInaccurate: (contributionId: string) => void;
  onConfirm: (contributionId: string) => void;
}) {
  const [viewerNotice, setViewerNotice] = React.useState("");
  const [activePage, setActivePage] = React.useState(
    contribution?.source.page,
  );
  const document = readinessSourceDocuments.find(
    (item) => item.fileName === contribution?.source.fileName,
  );
  const page = document?.pages.find(
    (item) => item.page === activePage,
  );
  const unavailable = document?.availability === "unavailable";

  React.useEffect(() => {
    setViewerNotice("");
    setActivePage(contribution?.source.page);
  }, [contribution?.id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[min(860px,calc(100dvh-1rem))] max-w-[min(1180px,calc(100vw-1rem))] flex-col gap-0 overflow-hidden border-workspace-border bg-workspace-panel p-0 sm:max-w-[min(1180px,calc(100vw-2rem))]">
        <DialogHeader className="border-b border-workspace-border px-4 py-3.5 pr-12">
          <DialogTitle className="flex items-center gap-2 workspace-card-title text-ink">
            <FileText className="size-4 text-primary" />
            {contribution?.source.fileName ?? "Nguồn bằng chứng"}
          </DialogTitle>
          <DialogDescription className="workspace-meta text-workspace-muted-text">
            {contribution?.source.page
              ? `Trang ${contribution.source.page}/${contribution.source.totalPages ?? document?.totalPages ?? "—"}`
              : contribution?.source.section ?? "Chi tiết nguồn"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <div className="no-scrollbar min-h-0 overflow-y-auto bg-workspace-canvas p-3 sm:p-5">
            {unavailable ? (
              <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-workspace-border text-center">
                <AlertTriangle className="size-6 text-workspace-warning" />
                <p className="mt-3 workspace-card-title text-ink">
                  Nguồn tạm thời không khả dụng
                </p>
                <p className="mt-1 max-w-sm workspace-meta text-workspace-muted-text">
                  Đóng góp vẫn giữ trong lịch sử nhưng cần xác minh lại
                  trước khi dùng cho điểm canonical.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4"
                  onClick={() =>
                    setViewerNotice(
                      "Đã thử xác minh lại. Nguồn vẫn chưa khả dụng; điểm canonical không thay đổi.",
                    )
                  }
                >
                  Thử xác minh lại
                </Button>
                {viewerNotice ? (
                  <p
                    role="status"
                    className="mt-3 max-w-sm workspace-meta text-workspace-muted-text"
                  >
                    {viewerNotice}
                  </p>
                ) : null}
              </div>
            ) : (
              <>
                <div className="mx-auto min-h-[560px] max-w-2xl rounded-md border border-workspace-border bg-workspace-panel p-7 shadow-sm sm:p-10">
                <div className="flex items-center justify-between gap-3 workspace-eyebrow text-workspace-muted-text">
                  <span>KIZUNA HUB · {document?.fileName}</span>
                  <span>
                    Trang {activePage ?? "—"}
                  </span>
                </div>
                <h2 className="mt-12 workspace-page-title text-ink">
                  {page?.title ??
                    contribution?.source.section ??
                    contribution?.title}
                </h2>
                <p className="mt-6 workspace-body leading-7 text-workspace-muted-text">
                  {page?.body ??
                    contribution?.source.context ??
                    "Nguồn demo được dùng để minh họa cách Kizuna truy xuất bằng chứng."}
                </p>
                {(page?.highlight ??
                  contribution?.source.quote) ? (
                  <blockquote className="mt-8 border-l-2 border-primary bg-primary-soft px-5 py-4 workspace-card-title leading-7 text-ink">
                    “
                    {page?.highlight ??
                      contribution?.source.quote}
                    ”
                  </blockquote>
                ) : null}
                <div className="mt-10 space-y-3 workspace-meta text-workspace-muted-text">
                  <p>
                    Nguồn này được mở ở đúng vị trí mà Kizuna dùng để
                    diễn giải.
                  </p>
                  <p>
                    Nội dung viewer là mock xác định; không có PDF parser
                    hoặc upload backend trong demo này.
                  </p>
                </div>
                </div>
                {(document?.pages.length ?? 0) > 1 ? (
                  <div className="mx-auto mt-3 flex max-w-2xl gap-2 overflow-x-auto pb-1">
                    {document?.pages.map((item) => (
                      <button
                        key={item.page}
                        type="button"
                        onClick={() => setActivePage(item.page)}
                        className={cn(
                          "w-28 shrink-0 rounded-md border bg-workspace-panel p-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/50",
                          activePage === item.page
                            ? "border-primary"
                            : "border-workspace-border",
                        )}
                        aria-label={`Xem trang ${item.page}`}
                        aria-pressed={activePage === item.page}
                      >
                        <span className="block workspace-eyebrow text-workspace-muted-text">
                          Trang {item.page}
                        </span>
                        <span className="mt-1 block truncate text-[10px] text-ink">
                          {item.title}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </>
            )}
          </div>

          <aside className="no-scrollbar min-h-0 overflow-y-auto border-t border-workspace-border p-4 lg:border-l lg:border-t-0">
            <p className="workspace-eyebrow text-workspace-muted-text">
              Đóng góp vào tiêu chí
            </p>
            <h3 className="mt-1 workspace-card-title text-ink">
              {contribution?.title}
            </h3>
            <p className="mt-2 workspace-supporting text-workspace-muted-text">
              {contribution?.interpretation}
            </p>

            <dl className="mt-4 divide-y divide-workspace-border rounded-lg border border-workspace-border">
              <div className="flex justify-between gap-3 px-3 py-2.5">
                <dt className="workspace-meta text-workspace-muted-text">
                  Trạng thái
                </dt>
                <dd className="workspace-meta font-medium text-ink">
                  {contribution?.status === "verified"
                    ? "Đã xác minh"
                    : contribution?.status === "inferred"
                      ? "AI suy luận"
                      : contribution?.status === "outdated"
                        ? `Đã cũ · ${contribution.freshnessDays} ngày`
                        : contribution?.status === "disputed"
                          ? "Đang tranh luận"
                          : "Chưa xác minh"}
                </dd>
              </div>
              <div className="flex justify-between gap-3 px-3 py-2.5">
                <dt className="workspace-meta text-workspace-muted-text">
                  Độ tin cậy
                </dt>
                <dd className="workspace-meta font-medium text-ink">
                  {contribution?.confidence === "high"
                    ? "Cao"
                    : contribution?.confidence === "medium"
                      ? "Trung bình"
                      : "Thấp"}
                </dd>
              </div>
              <div className="flex justify-between gap-3 px-3 py-2.5">
                <dt className="workspace-meta text-workspace-muted-text">
                  Tác động
                </dt>
                <dd className="font-tabular workspace-meta font-medium text-ink">
                  {(contribution?.contributionPoints ?? 0) > 0
                    ? "+"
                    : ""}
                  {contribution?.contributionPoints ?? 0} điểm
                </dd>
              </div>
            </dl>

            {contribution?.status === "verified" ? (
              <p className="mt-4 flex items-start gap-2 rounded-lg bg-workspace-success-soft p-3 workspace-meta text-ink">
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-workspace-success" />
                Nguồn đã được dùng trong điểm canonical hiện tại.
              </p>
            ) : null}

            <div className="mt-4 grid gap-2">
              {contribution &&
              contribution.status !== "verified" &&
              contribution.status !== "missing" &&
              contribution.status !== "disputed" ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => onConfirm(contribution.id)}
                >
                  <CheckCircle2 className="size-3.5" />
                  Xác nhận cách diễn giải
                </Button>
              ) : null}
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  setViewerNotice(
                    "Bạn đang xem đúng trang nguồn gốc được Kizuna dùng trong assessment demo.",
                  )
                }
              >
                Mở tài liệu gốc
                <ExternalLink className="size-3.5" />
              </Button>
              {contribution &&
              contribution.status !== "disputed" &&
              contribution.status !== "missing" ? (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="text-workspace-danger"
                  onClick={() =>
                    onMarkInaccurate(contribution.id)
                  }
                >
                  <Flag className="size-3.5" />
                  Đánh dấu AI hiểu sai
                </Button>
              ) : null}
            </div>
            {viewerNotice && !unavailable ? (
              <p
                role="status"
                className="mt-3 workspace-meta text-workspace-muted-text"
              >
                {viewerNotice}
              </p>
            ) : null}
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}
