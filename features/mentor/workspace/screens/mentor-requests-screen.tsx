"use client";

import * as React from "react";
import {
  ArrowDownUp,
  CircleHelp,
  Filter,
  Inbox,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { useMentorWorkspace } from "../state/mentor-workspace-provider";
import type {
  MentorConnectionRequest,
  MentorRequestFilter,
  MentorRequestSort,
} from "../types/mentor-workspace.types";
import {
  MentorAcceptanceDialog,
  MentorDeclineDialog,
} from "../components/mentor-request-actions";
import { MentorRequestCard } from "../components/mentor-request-card";
import { MentorQuickBrief } from "../components/mentor-quick-brief";

const filters: Array<{
  value: MentorRequestFilter;
  label: string;
}> = [
  { value: "all", label: "Tất cả" },
  { value: "new", label: "Mới" },
  { value: "viewed", label: "Đang xem" },
  { value: "contacted", label: "Đã liên hệ" },
];

function filterRequests(
  requests: MentorConnectionRequest[],
  filter: MentorRequestFilter,
  sort: MentorRequestSort,
) {
  const filtered = requests.filter((request) => {
    if (filter === "new") return request.status === "new";
    if (filter === "viewed") return request.status === "viewed";
    if (filter === "contacted") {
      return (
        request.status === "accepted" ||
        request.status === "needs_more_context"
      );
    }
    return request.status !== "cancelled";
  });
  return filtered.sort((left, right) => {
    if (sort === "best_fit") {
      return right.fitScore - left.fitScore;
    }
    if (sort === "expiring") {
      return left.expiresAt.localeCompare(right.expiresAt);
    }
    return right.createdAt.localeCompare(left.createdAt);
  });
}

function countForFilter(
  requests: MentorConnectionRequest[],
  filter: MentorRequestFilter,
) {
  return filterRequests(requests, filter, "newest").length;
}

function RequestsLoading() {
  return (
    <div className="space-y-3" aria-label="Đang tải yêu cầu">
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          className="grid gap-4 rounded-xl border border-workspace-border bg-workspace-panel p-5 lg:grid-cols-[14rem_1fr_10rem]"
        >
          <div className="flex gap-3">
            <Skeleton className="size-12 rounded-full bg-workspace-elevated" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4 bg-workspace-elevated" />
              <Skeleton className="h-3 w-1/2 bg-workspace-elevated" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/3 bg-workspace-elevated" />
            <Skeleton className="h-3 w-full bg-workspace-elevated" />
            <Skeleton className="h-3 w-4/5 bg-workspace-elevated" />
          </div>
          <Skeleton className="h-9 w-full rounded-full bg-workspace-elevated" />
        </div>
      ))}
    </div>
  );
}

function useDesktopBrief() {
  const [desktop, setDesktop] = React.useState(false);
  React.useEffect(() => {
    const media = window.matchMedia("(min-width: 1280px)");
    const update = () => setDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return desktop;
}

export function MentorRequestsScreen() {
  const {
    requests,
    loading,
    error,
    filter,
    sort,
    setFilter,
    setSort,
    refresh,
  } = useMentorWorkspace();
  const [selectedRequestId, setSelectedRequestId] =
    React.useState<string | null>(null);
  const [acceptRequest, setAcceptRequest] =
    React.useState<MentorConnectionRequest | null>(null);
  const [declineRequest, setDeclineRequest] =
    React.useState<MentorConnectionRequest | null>(null);
  const desktopBrief = useDesktopBrief();

  const visibleRequests = React.useMemo(
    () => filterRequests(requests, filter, sort),
    [filter, requests, sort],
  );
  const selectedRequest =
    requests.find(
      (request) => request.id === selectedRequestId,
    ) ?? null;

  return (
    <div className="mx-auto w-full max-w-[96rem] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-workspace-border pb-5">
        <div>
          <h1 className="workspace-page-title">
            Yêu cầu kết nối
          </h1>
          <p className="mt-1 workspace-card-body text-workspace-muted-text">
            Các founder đang tìm kiếm sự hỗ trợ từ bạn.
          </p>
        </div>
        <Button variant="outline" size="sm">
          <CircleHelp />
          Hướng dẫn
        </Button>
      </header>

      <div className="mt-4 flex flex-col gap-3 border-b border-workspace-border pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="group"
          aria-label="Lọc trạng thái yêu cầu"
          className="flex max-w-full gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {filters.map((item) => (
            <Button
              key={item.value}
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setFilter(item.value)}
              aria-pressed={filter === item.value}
              className={cn(
                "shrink-0 rounded-xl",
                filter === item.value &&
                  "bg-workspace-selected text-foreground",
              )}
            >
              {item.value === "all" ? (
                <Inbox />
              ) : item.value === "new" ? (
                <Filter />
              ) : null}
              {item.label}
              <span className="rounded-full bg-workspace-elevated px-2 py-0.5 workspace-meta text-workspace-muted-text">
                {countForFilter(requests, item.value)}
              </span>
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <ArrowDownUp
            className="size-4 text-workspace-muted-text"
            aria-hidden="true"
          />
          <Select
            value={sort}
            onValueChange={(value) =>
              setSort(value as MentorRequestSort)
            }
          >
            <SelectTrigger className="w-full min-w-44 border-workspace-border bg-workspace-panel sm:w-auto">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent className="border-workspace-border bg-workspace-panel">
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="best_fit">
                Phù hợp nhất
              </SelectItem>
              <SelectItem value="expiring">
                Sắp hết hạn
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div
        className={cn(
          "mt-4 grid items-start gap-4",
          selectedRequest &&
            desktopBrief &&
            "xl:grid-cols-[minmax(0,1.35fr)_minmax(23rem,0.65fr)]",
        )}
      >
        <section aria-label="Danh sách yêu cầu" className="min-w-0">
          {loading ? <RequestsLoading /> : null}
          {!loading && error ? (
            <div className="rounded-xl border border-workspace-danger/30 bg-workspace-danger-soft p-6 text-center">
              <p className="workspace-card-title">
                Chưa thể tải yêu cầu
              </p>
              <p className="mt-2 workspace-supporting text-workspace-danger">
                {error}
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => void refresh()}
              >
                <RefreshCw />
                Thử lại
              </Button>
            </div>
          ) : null}
          {!loading && !error && visibleRequests.length === 0 ? (
            <div className="rounded-xl border border-dashed border-workspace-border bg-workspace-panel px-6 py-16 text-center">
              <Inbox className="mx-auto size-8 text-workspace-muted-text" />
              <h2 className="mt-4 workspace-section-title">
                Không có yêu cầu trong bộ lọc này
              </h2>
              <p className="mt-2 workspace-supporting text-workspace-muted-text">
                Chọn trạng thái khác để xem các request đã xử lý.
              </p>
            </div>
          ) : null}
          {!loading && !error ? (
            <div className="space-y-3">
              {visibleRequests.map((request, index) => (
                <MentorRequestCard
                  key={request.id}
                  request={request}
                  primary={index === 0 && filter !== "contacted"}
                  onOpenBrief={() =>
                    setSelectedRequestId(request.id)
                  }
                  onAccept={() => setAcceptRequest(request)}
                  onDecline={() => setDeclineRequest(request)}
                />
              ))}
            </div>
          ) : null}
        </section>

        {selectedRequest && desktopBrief ? (
          <MentorQuickBrief
            key={selectedRequest.id}
            request={selectedRequest}
            onClose={() => setSelectedRequestId(null)}
            className="sticky top-7 max-h-[calc(100dvh-3.5rem)]"
          />
        ) : null}
      </div>

      {!desktopBrief ? (
        <Sheet
          open={Boolean(selectedRequest)}
          onOpenChange={(open) => {
            if (!open) setSelectedRequestId(null);
          }}
        >
          <SheetContent
            side="right"
            className="w-[min(94vw,36rem)] max-w-none gap-0 border-workspace-border bg-workspace-background p-0 sm:max-w-[36rem] [&>button]:hidden"
          >
            <SheetTitle className="sr-only">
              Brief đọc nhanh
            </SheetTitle>
            <SheetDescription className="sr-only">
              Tóm tắt yêu cầu kết nối của founder.
            </SheetDescription>
            {selectedRequest ? (
              <MentorQuickBrief
                request={selectedRequest}
                onClose={() => setSelectedRequestId(null)}
                className="h-full rounded-none border-0"
              />
            ) : null}
          </SheetContent>
        </Sheet>
      ) : null}

      {acceptRequest ? (
        <MentorAcceptanceDialog
          request={acceptRequest}
          open
          onOpenChange={(open) => {
            if (!open) setAcceptRequest(null);
          }}
        />
      ) : null}
      {declineRequest ? (
        <MentorDeclineDialog
          request={declineRequest}
          open
          onOpenChange={(open) => {
            if (!open) setDeclineRequest(null);
          }}
        />
      ) : null}
    </div>
  );
}
