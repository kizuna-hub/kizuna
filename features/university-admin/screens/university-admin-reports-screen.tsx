"use client";

import * as React from "react";
import {
  BarChart3,
  CalendarCheck2,
  Download,
  Eye,
  FileBarChart2,
  FileText,
  GripVertical,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import {
  BottlenecksChart,
  ReadinessDistributionChart,
  StageMovementChart,
} from "../components/admin-charts";
import {
  AdminPageHeader,
  AdminPanel,
  AdminUpdatedFooter,
  KpiCard,
} from "../components/admin-ui";
import { AttentionTable } from "../components/venture-tables";
import {
  reportSections,
  reportTemplates,
  universityProgram,
  universityVentures,
} from "../lib/university-admin-mock-data";

function downloadMockReport(
  filename: string,
  contentType: string,
  content: string,
) {
  const url = URL.createObjectURL(
    new Blob([content], { type: contentType }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function TemplateCard({
  template,
}: {
  template: (typeof reportTemplates)[number];
}) {
  const tones = {
    blue: "bg-[var(--admin-blue-soft)] text-[var(--admin-primary)]",
    green: "bg-[var(--admin-green-soft)] text-[var(--admin-green)]",
    orange:
      "bg-[var(--admin-orange-soft)] text-[var(--admin-orange)]",
    purple:
      "bg-[var(--admin-purple-soft)] text-[var(--admin-purple)]",
  } as const;

  return (
    <article className="flex min-h-32 flex-col rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)]">
      <div className="flex flex-1 gap-3 p-3">
        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${tones[template.tone]}`}
        >
          <FileBarChart2 className="size-4" />
        </span>
        <span>
          <strong className="block text-xs">{template.title}</strong>
          <span className="mt-1 block text-[9px] text-[var(--admin-muted)]">
            {template.description}
          </span>
          <span className="mt-1 block text-[9px] text-[var(--admin-muted)]">
            {template.cadence}
          </span>
        </span>
      </div>
      <div className="grid grid-cols-3 border-t border-[var(--admin-border)]">
        <button
          type="button"
          className="flex items-center justify-center gap-1 border-r border-[var(--admin-border)] py-2 text-[9px] hover:bg-[var(--admin-surface-muted)]"
        >
          <Eye className="size-3" />
          Xem trước
        </button>
        <button
          type="button"
          onClick={() =>
            downloadMockReport(
              `${template.id}.pdf`,
              "application/pdf",
              `Kizuna University – ${template.title}`,
            )
          }
          className="flex items-center justify-center gap-1 border-r border-[var(--admin-border)] py-2 text-[9px] hover:bg-[var(--admin-surface-muted)]"
        >
          <Download className="size-3" />
          Xuất PDF
        </button>
        <button
          type="button"
          onClick={() =>
            downloadMockReport(
              `${template.id}.csv`,
              "text/csv;charset=utf-8",
              "\uFEFFTên báo cáo,Cập nhật\n" +
                `${template.title},${template.cadence}`,
            )
          }
          className="flex items-center justify-center gap-1 py-2 text-[9px] hover:bg-[var(--admin-surface-muted)]"
        >
          <Download className="size-3" />
          Xuất CSV
        </button>
      </div>
    </article>
  );
}

export function UniversityAdminReportsScreen() {
  const [selectedSections, setSelectedSections] = React.useState(
    () => new Set(reportSections.map((section) => section.id)),
  );
  const [showComparison, setShowComparison] = React.useState(true);
  const [note, setNote] = React.useState("");
  const [updatedAt, setUpdatedAt] = React.useState<string>(
    universityProgram.updatedAt,
  );

  const toggleSection = (id: string, checked: boolean) => {
    setSelectedSections((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  return (
    <div className="space-y-5">
      <AdminPageHeader title="Báo cáo chương trình" />

      <section className="grid items-start gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
        <AdminPanel className="overflow-hidden">
          <div className="border-b border-[var(--admin-border)] p-4">
            <h2 className="text-sm font-semibold">Cấu hình báo cáo</h2>
            <p className="mt-1 text-[10px] text-[var(--admin-muted)]">
              Chọn nội dung bạn muốn đưa vào báo cáo
            </p>
          </div>
          <div className="p-3">
            <p className="mb-2 text-[10px] font-semibold">
              Chọn phần báo cáo
            </p>
            <div className="overflow-hidden rounded-lg border border-[var(--admin-border)]">
              {reportSections.map((section) => (
                <label
                  key={section.id}
                  className="flex cursor-pointer items-center gap-2 border-b border-[var(--admin-border)] p-2.5 last:border-0 hover:bg-[var(--admin-surface-muted)]"
                >
                  <Checkbox
                    checked={selectedSections.has(section.id)}
                    onCheckedChange={(checked) =>
                      toggleSection(section.id, checked === true)
                    }
                    className="border-[var(--admin-border)] data-[state=checked]:border-[var(--admin-primary)] data-[state=checked]:bg-[var(--admin-primary)]"
                  />
                  <span className="flex size-7 items-center justify-center rounded-full bg-[var(--admin-surface-muted)]">
                    <FileText className="size-3.5 text-[var(--admin-primary)]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <strong className="block text-[10px]">
                      {section.label}
                    </strong>
                    <span className="block truncate text-[9px] text-[var(--admin-muted)]">
                      {section.description}
                    </span>
                  </span>
                  <GripVertical className="size-3.5 text-[var(--admin-muted)]" />
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-4 border-t border-[var(--admin-border)] p-3">
            <div className="flex items-start justify-between gap-3">
              <span>
                <strong className="block text-[10px]">
                  Hiển thị so sánh với kỳ trước
                </strong>
                <span className="text-[9px] text-[var(--admin-muted)]">
                  So sánh với 7 ngày trước
                </span>
              </span>
              <Switch
                checked={showComparison}
                onCheckedChange={setShowComparison}
                className="data-[state=checked]:bg-[var(--admin-primary)]"
              />
            </div>
            <label className="block">
              <span className="text-[10px] font-semibold">
                Ghi chú báo cáo{" "}
                <span className="font-normal text-[var(--admin-muted)]">
                  (tùy chọn)
                </span>
              </span>
              <Textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Nhập ghi chú cho báo cáo này..."
                className="mt-2 min-h-20 resize-none border-[var(--admin-border)] bg-[var(--admin-surface)] text-xs"
              />
            </label>
            <Button
              type="button"
              onClick={() =>
                setUpdatedAt(
                  new Intl.DateTimeFormat("vi-VN", {
                    dateStyle: "short",
                    timeStyle: "short",
                  }).format(new Date()),
                )
              }
              className="w-full bg-[var(--admin-primary)] text-white hover:bg-[var(--admin-primary-hover)]"
            >
              <RefreshCw className="size-4" />
              Cập nhật báo cáo
            </Button>
          </div>
        </AdminPanel>

        <AdminPanel className="min-w-0 p-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-sm font-semibold">Xem trước báo cáo</h2>
            <span className="text-[9px] text-[var(--admin-muted)]">
              Dữ liệu được cập nhật: {updatedAt}
            </span>
          </div>

          {selectedSections.size === 0 ? (
            <div className="flex min-h-[480px] flex-col items-center justify-center text-center">
              <FileBarChart2 className="size-9 text-[var(--admin-muted)]" />
              <h3 className="mt-3 text-sm font-semibold">
                Chưa chọn nội dung báo cáo
              </h3>
              <p className="mt-1 text-xs text-[var(--admin-muted)]">
                Chọn ít nhất một phần ở cột cấu hình để xem trước.
              </p>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {selectedSections.has("venture-overview") ? (
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  <KpiCard
                    label="Venture hoạt động"
                    value="24"
                    trend="14%"
                    icon="chart"
                    tone="blue"
                  />
                  <KpiCard
                    label="Đã hoàn tất phân tích"
                    value="18"
                    suffix="/24"
                    trend="8%"
                    icon="calendar-check"
                    tone="green"
                  />
                  <KpiCard
                    label="Đang cần hỗ trợ"
                    value="7"
                    trend="2"
                    icon="file-chart"
                    tone="orange"
                  />
                  <KpiCard
                    label="Kết nối được chấp nhận"
                    value="12"
                    trend="20%"
                    icon="calendar-check"
                    tone="purple"
                  />
                </div>
              ) : null}

              <div className="grid gap-3 lg:grid-cols-3">
                {selectedSections.has("stage-movement") ? (
                  <div className="rounded-lg border border-[var(--admin-border)] p-3">
                    <h3 className="text-xs font-semibold">
                      Dịch chuyển stage
                    </h3>
                    <StageMovementChart compact />
                  </div>
                ) : null}
                {selectedSections.has("bottlenecks") ? (
                  <div className="rounded-lg border border-[var(--admin-border)] p-3">
                    <h3 className="text-xs font-semibold">
                      Top bottlenecks
                    </h3>
                    <BottlenecksChart compact />
                  </div>
                ) : null}
                {selectedSections.has("readiness") ? (
                  <div className="rounded-lg border border-[var(--admin-border)] p-3">
                    <h3 className="text-xs font-semibold">
                      Phân bố readiness
                    </h3>
                    <ReadinessDistributionChart compact />
                  </div>
                ) : null}
              </div>

              {selectedSections.has("attention") ? (
                <div className="rounded-lg border border-[var(--admin-border)] p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold">
                      Danh sách cần chú ý
                    </h3>
                    <span className="text-[9px] text-[var(--admin-primary)]">
                      Xem chi tiết →
                    </span>
                  </div>
                  <AttentionTable
                    ventures={universityVentures.slice(1, 4)}
                  />
                </div>
              ) : null}

              {showComparison ? (
                <p className="text-right text-[9px] text-[var(--admin-green)]">
                  ↑ Các chỉ số đang được so sánh với 7 ngày trước
                </p>
              ) : null}
              {note ? (
                <div className="rounded-lg bg-[var(--admin-surface-muted)] p-3 text-[10px]">
                  <strong>Ghi chú:</strong> {note}
                </div>
              ) : null}
            </div>
          )}
        </AdminPanel>
      </section>

      <AdminPanel className="p-3">
        <h2 className="mb-3 text-sm font-semibold">
          Mẫu báo cáo & báo cáo gần đây
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {reportTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </AdminPanel>

      <AdminUpdatedFooter />
    </div>
  );
}
