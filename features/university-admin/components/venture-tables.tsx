"use client";

import { MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/routing";

import type { UniversityVenture } from "../types";
import {
  AttentionPill,
  PersonAvatar,
  ReadinessLabel,
  StagePill,
  VentureMark,
} from "./admin-ui";

export function AttentionTable({
  ventures,
}: {
  ventures: UniversityVenture[];
}) {
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full min-w-[620px] text-left text-[11px]">
        <thead>
          <tr className="border-b border-[var(--admin-border)] text-[var(--admin-muted)]">
            <th className="px-1 py-2 font-medium">Venture</th>
            <th className="px-2 py-2 font-medium">Stage hiện tại</th>
            <th className="px-2 py-2 font-medium">Vấn đề chính</th>
            <th className="px-2 py-2 font-medium">Ngày cập nhật</th>
            <th className="px-1 py-2 text-right font-medium">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {ventures.map((venture) => (
            <tr
              key={venture.id}
              className="border-b border-[var(--admin-border)] last:border-0"
            >
              <td className="px-1 py-2">
                <Link
                  href={`/university-admin/ventures/${venture.id}`}
                  className="flex items-center gap-2 font-medium hover:text-[var(--admin-primary)]"
                >
                  <VentureMark venture={venture} size="sm" />
                  {venture.name}
                </Link>
              </td>
              <td className="px-2 py-2">
                <StagePill stage={venture.stage} />
              </td>
              <td className="max-w-60 px-2 py-2 text-[var(--admin-muted)]">
                {venture.blocker}
              </td>
              <td className="px-2 py-2 text-[var(--admin-muted)]">
                {venture.lastActivityDate}
              </td>
              <td className="px-1 py-2 text-right">
                <AttentionPill status={venture.attention} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function VenturesTable({
  ventures,
}: {
  ventures: UniversityVenture[];
}) {
  return (
    <div
      className="overflow-x-auto"
      aria-label="Bảng danh sách ventures"
      tabIndex={0}
    >
      <table className="w-full min-w-[1180px] text-left text-[11px]">
        <thead>
          <tr className="border-b border-[var(--admin-border)] bg-[var(--admin-surface-muted)]">
            <th className="px-3 py-3 font-semibold">Venture</th>
            <th className="px-3 py-3 font-semibold">Founder</th>
            <th className="px-3 py-3 font-semibold">Stage</th>
            <th className="px-3 py-3 font-semibold">Readiness</th>
            <th className="px-3 py-3 font-semibold">Vấn đề chính</th>
            <th className="px-3 py-3 font-semibold">
              Hoạt động gần nhất
            </th>
            <th className="px-3 py-3 font-semibold">Mentor</th>
            <th className="px-3 py-3 font-semibold">
              Trạng thái chú ý
            </th>
            <th className="w-10 px-2 py-3">
              <span className="sr-only">Thao tác</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {ventures.map((venture) => (
            <tr
              key={venture.id}
              className="border-b border-[var(--admin-border)] transition-colors last:border-0 hover:bg-[var(--admin-surface-muted)]"
            >
              <td className="px-3 py-2.5">
                <Link
                  href={`/university-admin/ventures/${venture.id}`}
                  className="flex items-center gap-2.5 hover:text-[var(--admin-primary)]"
                >
                  <VentureMark venture={venture} />
                  <span className="min-w-0">
                    <span className="block font-semibold">
                      {venture.name}
                    </span>
                    <span className="block max-w-40 truncate text-[10px] text-[var(--admin-muted)]">
                      {venture.description}
                    </span>
                  </span>
                </Link>
              </td>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <PersonAvatar
                    name={venture.founder.name}
                    initials={venture.founder.initials}
                    tone={venture.founder.tone}
                  />
                  <span>
                    <span className="block font-medium">
                      {venture.founder.name}
                    </span>
                    <span className="text-[10px] text-[var(--admin-muted)]">
                      {venture.founder.subtitle}
                    </span>
                  </span>
                </div>
              </td>
              <td className="px-3 py-2.5">
                <StagePill stage={venture.stage} />
              </td>
              <td className="px-3 py-2.5">
                <ReadinessLabel
                  level={venture.readinessLevel}
                  score={venture.readiness}
                />
              </td>
              <td className="max-w-48 px-3 py-2.5 text-[var(--admin-muted)]">
                {venture.blocker}
              </td>
              <td className="px-3 py-2.5">
                <span className="block">{venture.lastActivityDate}</span>
                <span className="block max-w-40 truncate text-[10px] text-[var(--admin-muted)]">
                  {venture.lastActivity}
                </span>
              </td>
              <td className="px-3 py-2.5">
                {venture.mentor ? (
                  <div className="flex items-center gap-2">
                    <PersonAvatar
                      name={venture.mentor.name}
                      src={venture.mentor.avatar}
                    />
                    <span className="max-w-32 truncate">
                      {venture.mentor.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-[var(--admin-muted)]">
                    Chưa kết nối
                  </span>
                )}
              </td>
              <td className="px-3 py-2.5">
                <AttentionPill status={venture.attention} />
              </td>
              <td className="px-2 py-2.5">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      className="text-[var(--admin-muted)] hover:bg-[var(--admin-blue-soft)] hover:text-[var(--admin-primary)]"
                      aria-label={`Thao tác với ${venture.name}`}
                    >
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="university-admin-theme border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text)]"
                  >
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/university-admin/ventures/${venture.id}`}
                      >
                        Xem chi tiết
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() =>
                        void navigator.clipboard.writeText(
                          venture.name,
                        )
                      }
                    >
                      Sao chép tên venture
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
