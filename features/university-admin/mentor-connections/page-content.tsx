"use client";

import * as React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Eye,
  MailCheck,
  RotateCcw,
  Search,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  AdminPageHeader,
  AdminPanel,
  AdminSelect,
  AdminUpdatedFooter,
  KpiCard,
  PanelHeading,
} from "../components/admin-ui";
import { ConnectionFunnel } from "./components/connection-funnel";
import { ConnectionRequestSheet } from "./components/connection-request-sheet";
import { MentorConnectionTable } from "./components/mentor-connection-table";
import { SupplyGapPanel } from "./components/supply-gap-panel";
import {
  filterMentorConnections,
  initialMentorConnectionFilters,
  type MentorConnectionFilters,
} from "./model/mentor-connection-selectors";
import type { UniversityMentorConnectionSummary } from "./model/mentor-connection";
import { getMentorConnectionDashboard } from "./repository/mentor-connection-repository";

const dashboard = getMentorConnectionDashboard();

export function MentorConnectionsPageContent() {
  const [filters, setFilters] =
    React.useState<MentorConnectionFilters>(
      initialMentorConnectionFilters,
    );
  const [selectedRequest, setSelectedRequest] =
    React.useState<UniversityMentorConnectionSummary | null>(null);
  const requests = filterMentorConnections(
    dashboard.requests,
    filters,
  );

  const updateFilter = (
    key: keyof MentorConnectionFilters,
    value: string,
  ) => setFilters((current) => ({ ...current, [key]: value }));

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Kết nối mentor"
        description="Theo dõi hiệu quả kết nối giữa venture và mentor trong chương trình."
      />

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-[9px] text-[var(--admin-muted)]">
        <span>
          Dữ liệu pipeline được đồng bộ từ Founder và Mentor Workspace.
          Không bao gồm nội dung hội thoại riêng tư.
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[var(--admin-green)]" />
          Đồng bộ 5 phút trước
        </span>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard
          label="Yêu cầu đã gửi"
          value={String(dashboard.metrics.sent)}
          trend="13%"
          icon={Send}
          tone="blue"
        />
        <KpiCard
          label="Mentor đã mở"
          value={String(dashboard.metrics.opened)}
          trend="11%"
          icon={Eye}
          tone="purple"
        />
        <KpiCard
          label="Được chấp nhận"
          value={String(dashboard.metrics.accepted)}
          trend="20%"
          icon={CheckCircle2}
          tone="green"
        />
        <KpiCard
          label="Phản hồi trung vị"
          value={String(dashboard.metrics.medianResponseHours)}
          suffix="giờ"
          trend="2.1 giờ"
          icon={Clock3}
          tone="cyan"
        />
        <KpiCard
          label="Pending quá 72 giờ"
          value={String(dashboard.metrics.pendingOver72Hours)}
          trend="1"
          icon={AlertTriangle}
          tone="orange"
        />
      </section>

      <section className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,.75fr)]">
        <AdminPanel className="min-w-0 p-4">
          <PanelHeading
            title="Funnel kết nối mentor"
            action={
              <span className="text-[9px] text-[var(--admin-muted)]">
                7 ngày qua
              </span>
            }
          />
          <ConnectionFunnel steps={dashboard.funnel} />
        </AdminPanel>
        <AdminPanel className="p-4">
          <PanelHeading title="Khoảng trống cung – cầu" />
          <p className="mb-3 mt-1 text-[9px] text-[var(--admin-muted)]">
            Chuyên môn có nhu cầu cao hơn số mentor đang còn nhận request.
          </p>
          <SupplyGapPanel gaps={dashboard.supplyGaps} />
        </AdminPanel>
      </section>

      <AdminPanel className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[var(--admin-border)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>
              <h2 className="text-sm font-semibold">
                Yêu cầu kết nối
              </h2>
              <p className="mt-0.5 text-[9px] text-[var(--admin-muted)]">
                Ưu tiên request cần context, quá hạn hoặc mentor đang quá
                tải.
              </p>
            </span>
            <span className="rounded-full bg-[var(--admin-orange-soft)] px-3 py-1.5 text-[9px] font-medium text-[var(--admin-orange)]">
              3 request cần xử lý
            </span>
          </div>

          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-[minmax(210px,1fr)_170px_180px_150px_160px_auto]">
            <label className="relative">
              <span className="sr-only">Tìm kiếm request</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--admin-muted)]" />
              <Input
                value={filters.query}
                onChange={(event) =>
                  updateFilter("query", event.target.value)
                }
                placeholder="Tìm venture, mentor, mục tiêu..."
                className="h-10 border-[var(--admin-border)] bg-[var(--admin-surface)] pl-9 text-xs"
              />
            </label>
            <AdminSelect
              label="Trạng thái request"
              value={filters.status}
              onValueChange={(value) =>
                updateFilter("status", value)
              }
              className="w-full min-w-0"
              options={[
                { value: "all", label: "Trạng thái · Tất cả" },
                { value: "Draft", label: "Draft" },
                { value: "Đã gửi", label: "Đã gửi" },
                { value: "Mentor đã mở", label: "Mentor đã mở" },
                {
                  value: "Đang chờ phản hồi",
                  label: "Đang chờ phản hồi",
                },
                {
                  value: "Cần thêm context",
                  label: "Cần thêm context",
                },
                { value: "Đã chấp nhận", label: "Đã chấp nhận" },
                { value: "Đã từ chối", label: "Đã từ chối" },
                { value: "Hết hạn", label: "Hết hạn" },
              ]}
            />
            <AdminSelect
              label="Chuyên môn mentor"
              value={filters.expertise}
              onValueChange={(value) =>
                updateFilter("expertise", value)
              }
              className="w-full min-w-0"
              options={[
                { value: "all", label: "Chuyên môn · Tất cả" },
                {
                  value: "Customer Discovery",
                  label: "Customer Discovery",
                },
                { value: "Product Strategy", label: "Product Strategy" },
                { value: "Pilot Design", label: "Pilot Design" },
                { value: "GTM Strategy", label: "GTM Strategy" },
                { value: "Dữ liệu", label: "Dữ liệu" },
              ]}
            />
            <AdminSelect
              label="Venture"
              value={filters.venture}
              onValueChange={(value) =>
                updateFilter("venture", value)
              }
              className="w-full min-w-0"
              options={[
                { value: "all", label: "Venture · Tất cả" },
                { value: "agriconnect", label: "AgriConnect" },
                { value: "eduai", label: "EduAI" },
                { value: "saferide", label: "SafeRide" },
                { value: "greenmetric", label: "GreenMetric" },
                { value: "medbuddy", label: "MedBuddy" },
              ]}
            />
            <AdminSelect
              label="Thời gian chờ"
              value={filters.waitingTime}
              onValueChange={(value) =>
                updateFilter("waitingTime", value)
              }
              className="w-full min-w-0"
              options={[
                { value: "all", label: "Thời gian chờ · Tất cả" },
                { value: "over-72", label: "Quá 72 giờ" },
                { value: "24-72", label: "24–72 giờ" },
                { value: "under-24", label: "Dưới 24 giờ" },
              ]}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setFilters(initialMentorConnectionFilters)
              }
              className="h-10 border-[var(--admin-border)] bg-transparent text-[10px]"
            >
              <RotateCcw className="size-3.5" />
              Xóa lọc
            </Button>
          </div>
        </div>

        {dashboard.requests.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
            <MailCheck className="size-8 text-[var(--admin-muted)]" />
            <h3 className="mt-3 text-sm font-semibold">
              Chưa có yêu cầu kết nối mentor.
            </h3>
            <p className="mt-1 max-w-md text-xs text-[var(--admin-muted)]">
              Các request được gửi từ Founder Workspace sẽ xuất hiện tại
              đây.
            </p>
          </div>
        ) : requests.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
            <Search className="size-8 text-[var(--admin-muted)]" />
            <h3 className="mt-3 text-sm font-semibold">
              Không tìm thấy request phù hợp
            </h3>
            <p className="mt-1 text-xs text-[var(--admin-muted)]">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
            </p>
          </div>
        ) : (
          <MentorConnectionTable
            requests={requests}
            onSelect={setSelectedRequest}
          />
        )}
      </AdminPanel>

      <ConnectionRequestSheet
        request={selectedRequest}
        open={Boolean(selectedRequest)}
        onOpenChange={(open) => {
          if (!open) setSelectedRequest(null);
        }}
      />

      <AdminUpdatedFooter />
    </div>
  );
}

