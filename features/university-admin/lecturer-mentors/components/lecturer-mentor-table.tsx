"use client";

import { MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { PersonAvatar } from "../../components/admin-ui";
import type {
  LecturerMentorAvailability,
  LecturerMentorStatus,
  UniversityLecturerMentorSummary,
} from "../model/lecturer-mentor";

const availabilityColors: Record<LecturerMentorAvailability, string> = {
  Rảnh: "bg-[var(--admin-green)]",
  "Bận nhẹ": "bg-[var(--admin-orange)]",
  Bận: "bg-[var(--admin-red)]",
  "Tạm ngưng nhận request": "bg-[var(--admin-muted)]",
};

const statusClasses: Record<LecturerMentorStatus, string> = {
  "Đang hoạt động":
    "bg-[var(--admin-green-soft)] text-[var(--admin-green)]",
  "Tạm ngưng":
    "bg-[var(--admin-orange-soft)] text-[var(--admin-orange)]",
  "Chưa kích hoạt":
    "bg-[var(--admin-blue-soft)] text-[var(--admin-primary)]",
  "Đã rời chương trình":
    "bg-[var(--admin-surface-muted)] text-[var(--admin-muted)]",
};

export function LecturerMentorTable({
  mentors,
  onSelect,
}: {
  mentors: UniversityLecturerMentorSummary[];
  onSelect: (mentor: UniversityLecturerMentorSummary) => void;
}) {
  return (
    <div
      className="overflow-x-auto"
      tabIndex={0}
      aria-label="Bảng mentor giảng viên"
    >
      <table className="w-full min-w-[1200px] text-left text-[11px]">
        <thead>
          <tr className="border-b border-[var(--admin-border)] bg-[var(--admin-surface-muted)]">
            <th className="w-10 px-3 py-3">
              <span className="sr-only">Chọn</span>
            </th>
            <th className="px-3 py-3 font-semibold">Mentor</th>
            <th className="px-3 py-3 font-semibold">
              Học hàm / Học vị
            </th>
            <th className="px-3 py-3 font-semibold">
              Khoa / Bộ môn
            </th>
            <th className="px-3 py-3 font-semibold">Chuyên môn</th>
            <th className="px-3 py-3 text-center font-semibold">
              Yêu cầu đang xử lý
            </th>
            <th className="px-3 py-3 font-semibold">
              Thời gian phản hồi TB
            </th>
            <th className="px-3 py-3 font-semibold">
              Tỷ lệ chấp nhận
            </th>
            <th className="px-3 py-3 font-semibold">Availability</th>
            <th className="px-3 py-3 font-semibold">Trạng thái</th>
            <th className="w-10 px-2 py-3" />
          </tr>
        </thead>
        <tbody>
          {mentors.map((mentor) => {
            const acceptanceClass =
              mentor.acceptanceRate >= 70
                ? "text-[var(--admin-green)]"
                : mentor.acceptanceRate >= 60
                  ? "text-[var(--admin-orange)]"
                  : "text-[var(--admin-red)]";

            return (
              <tr
                key={mentor.id}
                className="border-b border-[var(--admin-border)] last:border-0 hover:bg-[var(--admin-surface-muted)]"
              >
                <td className="px-3 py-2.5">
                  <input
                    type="checkbox"
                    aria-label={`Chọn ${mentor.name}`}
                    className="size-4 rounded border-[var(--admin-border)] accent-[var(--admin-primary)]"
                  />
                </td>
                <td className="px-3 py-2.5">
                  <button
                    type="button"
                    onClick={() => onSelect(mentor)}
                    className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]"
                  >
                    <PersonAvatar
                      name={mentor.name}
                      src={mentor.avatarUrl}
                      size="md"
                    />
                    <span>
                      <span className="block font-semibold">
                        {mentor.name}
                      </span>
                      <span className="text-[9px] text-[var(--admin-muted)]">
                        {mentor.department}
                      </span>
                    </span>
                  </button>
                </td>
                <td className="px-3 py-2.5 text-[var(--admin-muted)]">
                  {mentor.academicTitle}
                </td>
                <td className="px-3 py-2.5">{mentor.faculty}</td>
                <td className="px-3 py-2.5">
                  <div className="flex max-w-48 flex-wrap gap-1">
                    {mentor.expertise.slice(0, 2).map((expertise) => (
                      <span
                        key={expertise}
                        className="rounded bg-[var(--admin-blue-soft)] px-2 py-1 text-[9px] text-[var(--admin-primary)]"
                      >
                        {expertise}
                      </span>
                    ))}
                    {mentor.expertise.length > 2 ? (
                      <span className="rounded bg-[var(--admin-surface-muted)] px-2 py-1 text-[9px] text-[var(--admin-muted)]">
                        +{mentor.expertise.length - 2}
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className="px-3 py-2.5 text-center font-semibold">
                  {mentor.activeRequestCount}
                </td>
                <td className="px-3 py-2.5">
                  {mentor.medianResponseHours.toFixed(1)} giờ
                </td>
                <td
                  className={cn(
                    "px-3 py-2.5 font-semibold",
                    acceptanceClass,
                  )}
                >
                  {mentor.acceptanceRate}%
                </td>
                <td className="px-3 py-2.5">
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        availabilityColors[mentor.availability],
                      )}
                    />
                    {mentor.availability}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <span
                    className={cn(
                      "inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[9px]",
                      statusClasses[mentor.status],
                    )}
                  >
                    {mentor.status}
                  </span>
                </td>
                <td className="px-2 py-2.5">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        aria-label={`Thao tác với ${mentor.name}`}
                      >
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="university-admin-theme border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text)]"
                    >
                      <DropdownMenuItem
                        onSelect={() => onSelect(mentor)}
                      >
                        Xem hồ sơ tóm tắt
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Xem request đang xử lý
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Xem venture đang hỗ trợ
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

