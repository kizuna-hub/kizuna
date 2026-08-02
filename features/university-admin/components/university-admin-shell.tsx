"use client";

import * as React from "react";
import {
  BarChart3,
  Building2,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Moon,
  Network,
  Rocket,
  Settings,
  Sun,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useKizunaTheme } from "@/components/theme-provider";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import { universityProgram } from "../lib/university-admin-mock-data";
import { isUniversityAdminRouteActive } from "../lib/university-admin-route-matching";

const navigation = [
  {
    label: "Tổng quan",
    href: "/university-admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Ventures",
    href: "/university-admin/ventures",
    icon: Rocket,
  },
  {
    label: "Kết nối mentor",
    href: "/university-admin/mentor-connections",
    icon: Network,
  },
  {
    label: "Mentor giảng viên",
    href: "/university-admin/lecturer-mentors",
    icon: UsersRound,
  },
  {
    label: "Báo cáo",
    href: "/university-admin/reports",
    icon: BarChart3,
  },
] as const;

function UniversityMark() {
  return (
    <span className="grid size-10 shrink-0 rotate-45 grid-cols-2 gap-0.5 rounded-lg border-2 border-white p-1">
      {Array.from({ length: 4 }).map((_, index) => (
        <span
          key={index}
          className="rounded-[2px] border border-white/80"
        />
      ))}
    </span>
  );
}

function SidebarContent({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { resolvedAppearance, setAppearance } = useKizunaTheme();

  return (
    <div className="flex h-full flex-col bg-[var(--admin-sidebar)] text-white">
      <div className="flex items-center gap-3 px-5 py-6">
        <UniversityMark />
        <div>
          <p className="text-base font-semibold leading-tight">
            Kizuna
          </p>
          <p className="text-base font-semibold leading-tight">
            University
          </p>
        </div>
      </div>

      <nav
        aria-label="Điều hướng University Admin"
        className="flex-1 space-y-1 px-3 py-3"
      >
        {navigation.map((item) => {
          const active = isUniversityAdminRouteActive({
            pathname,
            href: item.href,
            exact: "exact" in item && item.exact,
          });
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-[var(--admin-sidebar-muted)] transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
                active
                  ? "bg-[var(--admin-sidebar-active)] text-white"
                  : "hover:bg-[var(--admin-sidebar-hover)] hover:text-white",
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          );
        })}

        <div className="my-3 border-t border-white/10" />

        <button
          type="button"
          disabled
          className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-medium text-[var(--admin-sidebar-muted)] opacity-65"
          title="Quản lý cohort sẽ được bổ sung sau bản demo"
        >
          <GraduationCap className="size-5" />
          Quản lý cohort
          <span className="ml-auto text-[9px] uppercase">Sau</span>
        </button>
        <button
          type="button"
          disabled
          className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-medium text-[var(--admin-sidebar-muted)] opacity-65"
          title="Cài đặt sẽ được bổ sung sau bản demo"
        >
          <Settings className="size-5" />
          Cài đặt
          <span className="ml-auto text-[9px] uppercase">Sau</span>
        </button>
      </nav>

      <div className="space-y-2 p-3">
        <button
          type="button"
          onClick={() =>
            setAppearance(
              resolvedAppearance === "light" ? "dark" : "light",
            )
          }
          className="flex min-h-10 w-full items-center gap-3 rounded-lg border border-white/15 px-3 text-xs text-[var(--admin-sidebar-muted)] hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          {resolvedAppearance === "light" ? (
            <Moon className="size-4" />
          ) : (
            <Sun className="size-4" />
          )}
          {resolvedAppearance === "light"
            ? "Chuyển sang giao diện tối"
            : "Chuyển sang giao diện sáng"}
        </button>

        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl border border-white/20 bg-white/5 p-3 text-left hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          aria-label={`Trường hiện tại: ${universityProgram.school}`}
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[var(--admin-sidebar)]">
            <Building2 className="size-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-semibold">
              Đại học Bách Khoa
            </span>
            <span className="block truncate text-[10px] text-[var(--admin-sidebar-muted)]">
              Hà Nội
            </span>
          </span>
          <ChevronDown className="size-4" />
        </button>
      </div>
    </div>
  );
}

export function UniversityAdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="university-admin-theme min-h-dvh">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 lg:block">
        <SidebarContent />
      </aside>

      <div className="lg:pl-56">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-white/10 bg-[var(--admin-sidebar)] px-4 text-white lg:hidden">
          <div className="flex items-center gap-2 font-semibold">
            <UniversityMark />
            Kizuna University
          </div>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text)]"
                aria-label="Mở điều hướng University Admin"
              >
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="university-admin-theme w-72 border-0 bg-[var(--admin-sidebar)] p-0"
            >
              <SheetTitle className="sr-only">
                Điều hướng University Admin
              </SheetTitle>
              <SheetDescription className="sr-only">
                Chọn trang quản trị chương trình.
              </SheetDescription>
              <SidebarContent
                onNavigate={() => setMobileOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </header>

        <main className="min-w-0 px-4 py-5 sm:px-6 lg:px-7 lg:py-6">
          <div className="mx-auto max-w-[1440px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
