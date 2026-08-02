"use client";

import * as React from "react";
import {
  Activity,
  CircleAlert,
  Handshake,
  Rocket,
  RotateCcw,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  AdminPageHeader,
  AdminPanel,
  AdminUpdatedFooter,
  KpiCard,
} from "../components/admin-ui";
import { AdminSelect } from "../components/admin-ui";
import { VenturesTable } from "../components/venture-tables";
import { universityVentures } from "../lib/university-admin-mock-data";
import {
  filterVentures,
  type VentureFilters,
} from "../lib/university-admin-selectors";

const initialFilters: VentureFilters = {
  query: "",
  stage: "all",
  readiness: "all",
  attention: "all",
};

export function UniversityAdminVenturesScreen() {
  const [filters, setFilters] =
    React.useState<VentureFilters>(initialFilters);
  const ventures = filterVentures(universityVentures, filters);

  const updateFilter = (
    key: keyof VentureFilters,
    value: string,
  ) => setFilters((current) => ({ ...current, [key]: value }));

  return (
    <div className="space-y-5">
      <AdminPageHeader title="Ventures" showDateRange={false} />

      <section
        aria-label="Bộ lọc ventures"
        className="grid gap-2 md:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_180px_180px_190px_auto]"
      >
        <label className="relative">
          <span className="sr-only">Tìm kiếm venture</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--admin-muted)]" />
          <Input
            value={filters.query}
            onChange={(event) =>
              updateFilter("query", event.target.value)
            }
            placeholder="Tìm kiếm venture, founder, vấn đề..."
            className="h-10 border-[var(--admin-border)] bg-[var(--admin-surface)] pl-9 text-xs text-[var(--admin-text)]"
          />
        </label>
        <AdminSelect
          label="Lọc theo stage"
          value={filters.stage}
          onValueChange={(value) => updateFilter("stage", value)}
          className="w-full"
          options={[
            { value: "all", label: "Stage · Tất cả" },
            { value: "Idea", label: "Idea" },
            { value: "Prototype", label: "Prototype" },
            { value: "Pilot", label: "Pilot" },
            { value: "Launched", label: "Launched" },
          ]}
        />
        <AdminSelect
          label="Lọc theo readiness"
          value={filters.readiness}
          onValueChange={(value) =>
            updateFilter("readiness", value)
          }
          className="w-full"
          options={[
            { value: "all", label: "Readiness · Tất cả" },
            { value: "Low", label: "Low (0–40)" },
            { value: "Medium", label: "Medium (41–70)" },
            { value: "High", label: "High (71–100)" },
          ]}
        />
        <AdminSelect
          label="Lọc theo trạng thái"
          value={filters.attention}
          onValueChange={(value) =>
            updateFilter("attention", value)
          }
          className="w-full"
          options={[
            { value: "all", label: "Trạng thái · Tất cả" },
            { value: "Cần hỗ trợ", label: "Cần hỗ trợ" },
            { value: "Rủi ro cao", label: "Rủi ro cao" },
            { value: "Theo dõi", label: "Theo dõi" },
            { value: "Đang tốt", label: "Đang tốt" },
          ]}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => setFilters(initialFilters)}
          className="h-10 border-[var(--admin-border)] bg-[var(--admin-surface)] text-xs text-[var(--admin-muted)] hover:bg-[var(--admin-surface-muted)]"
        >
          <RotateCcw className="size-3.5" />
          Xóa bộ lọc
        </Button>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Tổng số venture"
          value="24"
          trend="14%"
          icon={Rocket}
          tone="blue"
        />
        <KpiCard
          label="Cần hỗ trợ"
          value="7"
          trend="2"
          icon={CircleAlert}
          tone="orange"
        />
        <KpiCard
          label="Đã kết nối mentor"
          value="12"
          trend="20%"
          icon={Handshake}
          tone="green"
        />
        <KpiCard
          label="Đang hoạt động"
          value="18"
          trend="8%"
          icon={Activity}
          tone="purple"
        />
      </section>

      <AdminPanel className="overflow-hidden">
        {ventures.length ? (
          <>
            <VenturesTable ventures={ventures} />
            <div className="flex flex-col gap-3 border-t border-[var(--admin-border)] px-4 py-3 text-[11px] text-[var(--admin-muted)] sm:flex-row sm:items-center sm:justify-between">
              <span>
                Hiển thị 1–{ventures.length} trong tổng số 24 venture
              </span>
              <div className="flex items-center gap-1">
                <Button
                  size="icon-sm"
                  variant="outline"
                  disabled
                  className="border-[var(--admin-border)]"
                >
                  1
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="text-[var(--admin-muted)]"
                >
                  2
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="text-[var(--admin-muted)]"
                >
                  3
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
            <Search className="size-8 text-[var(--admin-muted)]" />
            <h2 className="mt-3 text-sm font-semibold">
              Không tìm thấy venture
            </h2>
            <p className="mt-1 text-xs text-[var(--admin-muted)]">
              Thử thay đổi từ khóa hoặc xóa bộ lọc hiện tại.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => setFilters(initialFilters)}
              className="mt-4 border-[var(--admin-border)]"
            >
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </AdminPanel>

      <AdminUpdatedFooter />
    </div>
  );
}

