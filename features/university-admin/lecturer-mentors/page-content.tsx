"use client";

import * as React from "react";
import {
  Clock3,
  RotateCcw,
  Search,
  UserRoundCheck,
  UserRoundCog,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { MentorDemandChart } from "../components/admin-charts";
import {
  AdminPageHeader,
  AdminPanel,
  AdminSelect,
  AdminUpdatedFooter,
  KpiCard,
  PanelHeading,
} from "../components/admin-ui";
import { LecturerMentorSheet } from "./components/lecturer-mentor-sheet";
import { LecturerMentorTable } from "./components/lecturer-mentor-table";
import {
  filterUniversityLecturerMentors,
  initialLecturerMentorFilters,
  type LecturerMentorFilters,
} from "./model/lecturer-mentor-selectors";
import type { UniversityLecturerMentorSummary } from "./model/lecturer-mentor";
import { getLecturerMentorDirectoryDashboard } from "./repository/lecturer-mentor-repository";

const dashboard = getLecturerMentorDirectoryDashboard();

export function LecturerMentorsPageContent() {
  const [filters, setFilters] =
    React.useState<LecturerMentorFilters>(
      initialLecturerMentorFilters,
    );
  const [selectedMentor, setSelectedMentor] =
    React.useState<UniversityLecturerMentorSummary | null>(null);
  const mentors = filterUniversityLecturerMentors(
    dashboard.mentors,
    filters,
  );

  const updateFilter = (
    key: keyof LecturerMentorFilters,
    value: string,
  ) => setFilters((current) => ({ ...current, [key]: value }));

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Mentor giảng viên"
        description="Quản lý đội ngũ mentor hỗ trợ các startup trong chương trình."
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_1.55fr]">
        <KpiCard
          label="Mentor đang hoạt động"
          value={String(dashboard.metrics.activeMentors)}
          trend="14%"
          icon={UsersRound}
          tone="blue"
        />
        <KpiCard
          label="Yêu cầu đang mở"
          value={String(dashboard.metrics.openRequests)}
          trend="9%"
          icon={UserRoundCog}
          tone="orange"
        />
        <KpiCard
          label="Thời gian phản hồi TB"
          value={String(dashboard.metrics.averageResponseHours)}
          suffix="giờ"
          trend="2.3 giờ"
          icon={Clock3}
          tone="purple"
        />
        <KpiCard
          label="Tỷ lệ chấp nhận"
          value={`${dashboard.metrics.acceptanceRate}%`}
          trend="12%"
          icon={UserRoundCheck}
          tone="cyan"
        />
        <AdminPanel className="min-w-0 p-4 sm:col-span-2 xl:col-span-1">
          <PanelHeading title="Nhu cầu mentor theo chuyên môn" />
          <MentorDemandChart data={dashboard.expertiseDemand} />
        </AdminPanel>
      </section>

      <AdminPanel className="overflow-hidden">
        <div className="border-b border-[var(--admin-border)] p-3">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span>
              <h2 className="text-sm font-semibold">
                Danh sách mentor giảng viên
              </h2>
              <p className="mt-0.5 text-[9px] text-[var(--admin-muted)]">
                Dữ liệu capacity được cập nhật 10 phút trước.
              </p>
            </span>
            <span className="inline-flex items-center gap-1.5 text-[9px] text-[var(--admin-muted)]">
              <span className="size-2 rounded-full bg-[var(--admin-green)]" />
              48 mentor trong chương trình
            </span>
          </div>
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-[170px_170px_190px_190px_minmax(200px,1fr)_auto]">
            <AdminSelect
              label="Khoa hoặc bộ môn"
              value={filters.faculty}
              onValueChange={(value) =>
                updateFilter("faculty", value)
              }
              className="w-full min-w-0"
              options={[
                { value: "all", label: "Khoa / Bộ môn · Tất cả" },
                { value: "Khoa CNTT", label: "Khoa CNTT" },
                { value: "Khoa QTKD", label: "Khoa QTKD" },
                { value: "Khoa Cơ khí", label: "Khoa Cơ khí" },
                { value: "Khoa Kinh tế", label: "Khoa Kinh tế" },
                {
                  value: "Khoa Điện - Điện tử",
                  label: "Khoa Điện - Điện tử",
                },
              ]}
            />
            <AdminSelect
              label="Chuyên môn"
              value={filters.expertise}
              onValueChange={(value) =>
                updateFilter("expertise", value)
              }
              className="w-full min-w-0"
              options={[
                { value: "all", label: "Chuyên môn · Tất cả" },
                { value: "AI/ML", label: "AI/ML" },
                { value: "Chiến lược", label: "Chiến lược" },
                { value: "Sản phẩm", label: "Sản phẩm" },
                { value: "Tài chính", label: "Tài chính" },
                { value: "IoT", label: "IoT" },
              ]}
            />
            <AdminSelect
              label="Availability"
              value={filters.availability}
              onValueChange={(value) =>
                updateFilter("availability", value)
              }
              className="w-full min-w-0"
              options={[
                { value: "all", label: "Availability · Tất cả" },
                { value: "Rảnh", label: "Rảnh" },
                { value: "Bận nhẹ", label: "Bận nhẹ" },
                { value: "Bận", label: "Bận" },
                {
                  value: "Tạm ngưng nhận request",
                  label: "Tạm ngưng nhận request",
                },
              ]}
            />
            <AdminSelect
              label="Trạng thái nhận request"
              value={filters.status}
              onValueChange={(value) => updateFilter("status", value)}
              className="w-full min-w-0"
              options={[
                {
                  value: "all",
                  label: "Trạng thái · Tất cả",
                },
                {
                  value: "Đang hoạt động",
                  label: "Đang hoạt động",
                },
                { value: "Tạm ngưng", label: "Tạm ngưng" },
                { value: "Chưa kích hoạt", label: "Chưa kích hoạt" },
                {
                  value: "Đã rời chương trình",
                  label: "Đã rời chương trình",
                },
              ]}
            />
            <label className="relative">
              <span className="sr-only">Tìm kiếm mentor</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--admin-muted)]" />
              <Input
                value={filters.query}
                onChange={(event) =>
                  updateFilter("query", event.target.value)
                }
                placeholder="Tìm kiếm mentor..."
                className="h-10 border-[var(--admin-border)] bg-[var(--admin-surface)] pl-9 text-xs"
              />
            </label>
            <Button
              type="button"
              variant="outline"
              onClick={() => setFilters(initialLecturerMentorFilters)}
              className="h-10 border-[var(--admin-border)] bg-transparent text-[10px]"
            >
              <RotateCcw className="size-3.5" />
              Xóa lọc
            </Button>
          </div>
        </div>

        {dashboard.mentors.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
            <UsersRound className="size-8 text-[var(--admin-muted)]" />
            <h3 className="mt-3 text-sm font-semibold">
              Chưa có mentor giảng viên trong chương trình.
            </h3>
            <p className="mt-1 max-w-md text-xs text-[var(--admin-muted)]">
              Thêm hoặc kích hoạt mentor để bắt đầu hỗ trợ các venture.
            </p>
          </div>
        ) : mentors.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
            <Search className="size-8 text-[var(--admin-muted)]" />
            <h3 className="mt-3 text-sm font-semibold">
              Không có mentor phù hợp
            </h3>
            <p className="mt-1 text-xs text-[var(--admin-muted)]">
              Hãy thử một tổ hợp bộ lọc khác.
            </p>
          </div>
        ) : (
          <>
            <LecturerMentorTable
              mentors={mentors}
              onSelect={setSelectedMentor}
            />
            <div className="flex flex-col gap-3 border-t border-[var(--admin-border)] px-4 py-3 text-[11px] text-[var(--admin-muted)] sm:flex-row sm:items-center sm:justify-between">
              <span>
                Hiển thị 1 đến {mentors.length} trong tổng số 48 mentor
              </span>
              <div className="flex items-center gap-2">
                <span className="rounded-lg border border-[var(--admin-border)] px-3 py-2">
                  10 / trang
                </span>
                <span className="rounded-lg bg-[var(--admin-primary)] px-3 py-2 text-white">
                  1
                </span>
                <span className="px-2">2</span>
                <span className="px-2">3</span>
              </div>
            </div>
          </>
        )}
      </AdminPanel>

      <LecturerMentorSheet
        mentor={selectedMentor}
        open={Boolean(selectedMentor)}
        onOpenChange={(open) => {
          if (!open) setSelectedMentor(null);
        }}
      />

      <AdminUpdatedFooter />
    </div>
  );
}

