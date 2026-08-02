"use client";

import { AlertTriangle, ArrowUpRight, Clock3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { PersonAvatar } from "../../components/admin-ui";
import type {
  MentorConnectionStatus,
  UniversityMentorConnectionSummary,
} from "../model/mentor-connection";
import { isPendingMentorConnection } from "../model/mentor-connection-selectors";

const statusClasses: Record<MentorConnectionStatus, string> = {
  Draft: "bg-slate-100 text-slate-700 dark:bg-slate-700/50 dark:text-slate-200",
  "Đã gửi": "bg-[var(--admin-blue-soft)] text-[var(--admin-primary)]",
  "Mentor đã mở":
    "bg-[var(--admin-purple-soft)] text-[var(--admin-purple)]",
  "Đang chờ phản hồi":
    "bg-[var(--admin-orange-soft)] text-[var(--admin-orange)]",
  "Cần thêm context":
    "bg-[var(--admin-red-soft)] text-[var(--admin-red)]",
  "Đã chấp nhận":
    "bg-[var(--admin-green-soft)] text-[var(--admin-green)]",
  "Đã từ chối": "bg-[var(--admin-red-soft)] text-[var(--admin-red)]",
  "Hết hạn": "bg-[var(--admin-surface-muted)] text-[var(--admin-muted)]",
};

export function ConnectionStatusBadge({
  status,
}: {
  status: MentorConnectionStatus;
}) {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[9px] font-medium",
        statusClasses[status],
      )}
    >
      {status}
    </span>
  );
}

export function MentorConnectionTable({
  requests,
  onSelect,
}: {
  requests: UniversityMentorConnectionSummary[];
  onSelect: (request: UniversityMentorConnectionSummary) => void;
}) {
  return (
    <div
      className="overflow-x-auto"
      tabIndex={0}
      aria-label="Bảng yêu cầu kết nối mentor"
    >
      <table className="w-full min-w-[1180px] text-left text-[11px]">
        <thead>
          <tr className="border-b border-[var(--admin-border)] bg-[var(--admin-surface-muted)]">
            <th className="px-3 py-3 font-semibold">Venture</th>
            <th className="px-3 py-3 font-semibold">Mentor</th>
            <th className="px-3 py-3 font-semibold">
              Mục tiêu kết nối
            </th>
            <th className="px-3 py-3 font-semibold">Chuyên môn</th>
            <th className="px-3 py-3 font-semibold">Trạng thái</th>
            <th className="px-3 py-3 font-semibold">Thời gian chờ</th>
            <th className="px-3 py-3 font-semibold">
              Thời gian phản hồi
            </th>
            <th className="px-3 py-3 text-right font-semibold">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => {
            const overdue =
              request.waitingHours > 72 &&
              isPendingMentorConnection(request);
            return (
              <tr
                key={request.id}
                className={cn(
                  "border-b border-[var(--admin-border)] last:border-0 hover:bg-[var(--admin-surface-muted)]",
                  (overdue || request.needsContext) &&
                    "bg-[var(--admin-orange-soft)]/25",
                )}
              >
                <td className="px-3 py-2.5">
                  <span className="flex items-center gap-2.5">
                    <span className="flex size-8 items-center justify-center rounded-full bg-[var(--admin-blue-soft)] text-[9px] font-semibold text-[var(--admin-primary)]">
                      {request.ventureMark}
                    </span>
                    <span className="font-semibold">
                      {request.ventureName}
                    </span>
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <PersonAvatar
                      name={request.mentorName}
                      src={request.mentorAvatarUrl}
                    />
                    <span>
                      <span className="block font-medium">
                        {request.mentorName}
                      </span>
                      {request.mentorOverloaded ? (
                        <span className="mt-0.5 flex items-center gap-1 text-[9px] text-[var(--admin-red)]">
                          <AlertTriangle className="size-3" />
                          Đang quá tải
                        </span>
                      ) : null}
                    </span>
                  </div>
                </td>
                <td className="max-w-56 px-3 py-2.5 text-[var(--admin-muted)]">
                  {request.objective}
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex max-w-44 flex-wrap gap-1">
                    {request.expertise.map((expertise) => (
                      <span
                        key={expertise}
                        className="rounded bg-[var(--admin-surface-muted)] px-2 py-1 text-[9px]"
                      >
                        {expertise}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <ConnectionStatusBadge status={request.status} />
                </td>
                <td className="px-3 py-2.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 font-medium",
                      overdue && "text-[var(--admin-red)]",
                    )}
                  >
                    <Clock3 className="size-3.5" />
                    {request.waitingHours} giờ
                  </span>
                  {overdue ? (
                    <span className="mt-0.5 block text-[9px] text-[var(--admin-red)]">
                      Quá hạn 72 giờ
                    </span>
                  ) : null}
                </td>
                <td className="px-3 py-2.5 text-[var(--admin-muted)]">
                  {request.responseHours
                    ? `${request.responseHours.toFixed(1)} giờ`
                    : "Chưa phản hồi"}
                </td>
                <td className="px-3 py-2.5 text-right">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => onSelect(request)}
                    className="h-8 text-[10px] text-[var(--admin-primary)] hover:bg-[var(--admin-blue-soft)]"
                  >
                    Chi tiết
                    <ArrowUpRight className="size-3.5" />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
