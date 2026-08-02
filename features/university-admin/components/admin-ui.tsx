"use client";

import Image from "next/image";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Download,
  GraduationCap,
  HeartPulse,
  Leaf,
  MapPinned,
  Rocket,
  ShieldCheck,
  Sprout,
  Wind,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { universityProgram } from "../lib/university-admin-mock-data";
import type {
  AttentionStatus,
  ReadinessLevel,
  UniversityVenture,
  VentureMark as VentureMarkName,
  VentureStage,
} from "../types";

export function AdminPanel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-[var(--admin-shadow)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function AdminSelect({
  value,
  onValueChange,
  options,
  label,
  className,
}: {
  value: string;
  onValueChange?: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  label: string;
  className?: string;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        aria-label={label}
        className={cn(
          "h-10 min-w-40 border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 text-xs text-[var(--admin-text)] shadow-none",
          className,
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="university-admin-theme border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text)]">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function downloadCsv(filename: string) {
  const rows = [
    ["Chương trình", universityProgram.name],
    ["Cập nhật", universityProgram.updatedAt],
    ["Venture hoạt động", "24"],
    ["Đã hoàn tất phân tích", "18"],
    ["Đang cần hỗ trợ", "7"],
    ["Kết nối được chấp nhận", "12"],
  ];
  const content = rows
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");
  const blob = new Blob([`\uFEFF${content}`], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function AdminExportButton({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => downloadCsv("kizuna-university-report.csv")}
      className={cn(
        "h-10 rounded-lg border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 text-xs text-[var(--admin-text)] shadow-none hover:bg-[var(--admin-surface-muted)]",
        compact && "size-10 px-0",
      )}
      aria-label="Xuất báo cáo CSV"
    >
      <Download className="size-4" />
      {compact ? null : "Xuất báo cáo"}
    </Button>
  );
}

export function AdminPageHeader({
  title,
  description,
  showDateRange = true,
}: {
  title: string;
  description?: string;
  showDateRange?: boolean;
}) {
  return (
    <header className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--admin-text)] sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 text-sm text-[var(--admin-muted)]">
            {description}
          </p>
        ) : (
          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-[var(--admin-muted)]">
            <span className="inline-flex items-center gap-2 font-semibold text-[var(--admin-text)]">
              <Building2 className="size-4" />
              {universityProgram.name}
            </span>
            {showDateRange ? (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-3.5" />
                {universityProgram.dateRange}
              </span>
            ) : null}
          </div>
        )}
      </div>
      <AdminHeaderControls />
    </header>
  );
}

export function AdminHeaderControls() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <AdminSelect
        label="Chọn cohort"
        value="bk-2026"
        options={[
          { value: "bk-2026", label: universityProgram.name },
        ]}
        className="min-w-52"
      />
      <AdminSelect
        label="Chọn khoảng thời gian"
        value="7-days"
        options={[
          { value: "7-days", label: "7 ngày qua" },
          { value: "30-days", label: "30 ngày qua" },
        ]}
      />
      <AdminExportButton />
    </div>
  );
}

export function TinySparkline({
  color,
}: {
  color: string;
}) {
  return (
    <svg
      viewBox="0 0 96 38"
      className="h-9 w-24"
      role="img"
      aria-label="Xu hướng tăng trong 7 ngày"
    >
      <path
        d="M2 31 11 26 20 29 29 20 38 23 47 16 56 22 65 12 74 6 84 9 94 3"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function KpiCard({
  label,
  value,
  suffix,
  trend,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  suffix?: string;
  trend: string;
  icon: LucideIcon;
  tone: "blue" | "green" | "orange" | "purple" | "cyan";
}) {
  const toneMap = {
    blue: {
      color: "var(--admin-primary)",
      soft: "var(--admin-blue-soft)",
    },
    green: {
      color: "var(--admin-green)",
      soft: "var(--admin-green-soft)",
    },
    orange: {
      color: "var(--admin-orange)",
      soft: "var(--admin-orange-soft)",
    },
    purple: {
      color: "var(--admin-purple)",
      soft: "var(--admin-purple-soft)",
    },
    cyan: {
      color: "var(--admin-cyan)",
      soft: "var(--admin-cyan-soft)",
    },
  } as const;
  const palette = toneMap[tone];

  return (
    <AdminPanel className="min-h-32 p-4">
      <div className="flex items-start gap-3">
        <span
          className="flex size-11 shrink-0 items-center justify-center rounded-full"
          style={{
            color: palette.color,
            background: palette.soft,
          }}
        >
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-[var(--admin-text)]">
            {label}
          </p>
          <div className="mt-1.5 flex items-end justify-between gap-2">
            <p
              className="font-mono text-3xl font-semibold tabular-nums"
              style={{ color: palette.color }}
            >
              {value}
              {suffix ? (
                <span className="ml-1 text-base text-[var(--admin-muted)]">
                  {suffix}
                </span>
              ) : null}
            </p>
            <TinySparkline color={palette.color} />
          </div>
        </div>
      </div>
      <p className="mt-3 text-[11px] text-[var(--admin-muted)]">
        <span className="font-semibold text-[var(--admin-green)]">
          ↑ {trend}
        </span>{" "}
        so với 7 ngày trước
      </p>
    </AdminPanel>
  );
}

const ventureIcons: Record<VentureMarkName, LucideIcon> = {
  leaf: Leaf,
  graduation: GraduationCap,
  shield: ShieldCheck,
  sprout: Sprout,
  heart: HeartPulse,
  building: Building2,
  map: MapPinned,
  air: Wind,
};

export function VentureMark({
  venture,
  size = "md",
}: {
  venture: Pick<UniversityVenture, "name" | "mark" | "tone">;
  size?: "sm" | "md" | "lg";
}) {
  const Icon = ventureIcons[venture.mark] ?? Rocket;
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full text-white shadow-sm",
        venture.tone,
        size === "sm" && "size-7",
        size === "md" && "size-9",
        size === "lg" && "size-14",
      )}
      aria-label={`Logo ${venture.name}`}
    >
      <Icon
        className={cn(
          size === "sm" && "size-3.5",
          size === "md" && "size-4.5",
          size === "lg" && "size-7",
        )}
      />
    </span>
  );
}

export function PersonAvatar({
  name,
  src,
  initials,
  tone,
  size = "sm",
}: {
  name: string;
  src?: string;
  initials?: string;
  tone?: string;
  size?: "sm" | "md";
}) {
  const dimensions = size === "sm" ? "size-7" : "size-10";
  if (src) {
    return (
      <Image
        src={src}
        alt=""
        width={size === "sm" ? 28 : 40}
        height={size === "sm" ? 28 : 40}
        className={cn(dimensions, "rounded-full object-cover")}
      />
    );
  }
  return (
    <span
      aria-label={`Ảnh đại diện ${name}`}
      className={cn(
        dimensions,
        "flex shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
        tone ?? "bg-[var(--admin-blue-soft)] text-[var(--admin-primary)]",
      )}
    >
      {initials ?? name.slice(0, 2).toUpperCase()}
    </span>
  );
}

export function StagePill({ stage }: { stage: VentureStage }) {
  const classes: Record<VentureStage, string> = {
    Idea: "bg-slate-100 text-slate-700 dark:bg-slate-700/50 dark:text-slate-200",
    Prototype:
      "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    Pilot:
      "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
    Launched:
      "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  };
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium",
        classes[stage],
      )}
    >
      {stage}
    </span>
  );
}

export function AttentionPill({
  status,
}: {
  status: AttentionStatus;
}) {
  const classes: Record<AttentionStatus, string> = {
    "Cần hỗ trợ":
      "bg-[var(--admin-orange-soft)] text-[var(--admin-orange)]",
    "Rủi ro cao": "bg-[var(--admin-red-soft)] text-[var(--admin-red)]",
    "Theo dõi": "bg-[var(--admin-blue-soft)] text-[var(--admin-primary)]",
    "Đang tốt":
      "bg-[var(--admin-green-soft)] text-[var(--admin-green)]",
  };
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium",
        classes[status],
      )}
    >
      {status}
    </span>
  );
}

export function ReadinessLabel({
  level,
  score,
}: {
  level: ReadinessLevel;
  score: number;
}) {
  const color =
    level === "High"
      ? "var(--admin-green)"
      : level === "Medium"
        ? "var(--admin-orange)"
        : "var(--admin-red)";
  return (
    <div className="flex items-start gap-2">
      <span
        className="mt-1.5 size-2 rounded-full"
        style={{ background: color }}
      />
      <span>
        <span className="block text-xs font-medium">{level}</span>
        <span className="text-[10px] text-[var(--admin-muted)]">
          {score}/100
        </span>
      </span>
    </div>
  );
}

export function AdminUpdatedFooter() {
  return (
    <footer className="flex flex-col gap-2 border-t border-[var(--admin-border)] py-4 text-[10px] text-[var(--admin-muted)] sm:flex-row sm:items-center sm:justify-between">
      <span>© 2026 Kizuna University. All rights reserved.</span>
      <span>Dữ liệu cập nhật: {universityProgram.updatedAt}</span>
    </footer>
  );
}

export function PanelHeading({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-sm font-semibold text-[var(--admin-text)]">
        {title}
      </h2>
      {action}
    </div>
  );
}

export function AdminPrimaryButton({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      className={cn(
        "bg-[var(--admin-primary)] text-white hover:bg-[var(--admin-primary-hover)]",
        className,
      )}
    >
      {children}
    </Button>
  );
}

export function CompactChevron() {
  return <ChevronDown className="size-3.5" />;
}

export function VerifiedIndicator() {
  return (
    <CheckCircle2
      className="size-3.5 text-[var(--admin-green)]"
      aria-hidden="true"
    />
  );
}
