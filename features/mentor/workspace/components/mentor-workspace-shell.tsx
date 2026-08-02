"use client";

import Image from "next/image";
import * as React from "react";
import {
  CalendarDays,
  ChevronRight,
  Inbox,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";
import { ThemeMenu } from "@/features/theme/components/theme-menu";
import { useDemoAuth } from "@/features/auth/state/demo-auth-provider";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import { canonicalMentorPersona } from "../demo/mentor-workspace-demo-data";
import {
  MentorWorkspaceProvider,
  useMentorWorkspace,
} from "../state/mentor-workspace-provider";

const navigation = [
  {
    label: "Yêu cầu",
    href: "/mentor/dashboard/requests",
    icon: Inbox,
  },
  {
    label: "Sắp tới",
    href: "/mentor/dashboard/calendar",
    icon: CalendarDays,
  },
  {
    label: "Hồ sơ mentor",
    href: "/mentor/dashboard/profile",
    icon: UserRound,
  },
  {
    label: "Cài đặt",
    href: "/mentor/dashboard/settings",
    icon: Settings,
  },
] as const;

function MentorNavigation({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { requests } = useMentorWorkspace();
  const unresolvedCount = requests.filter(
    (request) =>
      request.status === "new" ||
      request.status === "viewed" ||
      request.status === "needs_more_context",
  ).length;
  const acceptedCount = requests.filter(
    (request) => request.status === "accepted",
  ).length;

  return (
    <nav
      aria-label="Điều hướng Mentor Workspace"
      className="flex flex-1 flex-col gap-1"
    >
      {navigation.map((item, index) => {
        const active =
          pathname === item.href ||
          pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <div
            key={item.href}
            className={cn(index === 2 && "mt-5")}
          >
            {index === 2 ? (
              <p className="mb-1 mt-4 px-2.5 workspace-eyebrow text-workspace-muted-text/70">
                TÀI KHOẢN
              </p>
            ) : null}
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "workspace-control-text relative flex min-h-11 items-center rounded-lg border py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40 lg:min-h-9 w-full gap-2.5 px-2.5",
                active
                  ? "border-primary-border bg-workspace-selected text-ink"
                  : "border-transparent text-workspace-muted-text hover:border-workspace-border hover:bg-workspace-row-hover hover:text-ink",
              )}
            >
              {active ? (
                <span className="absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-primary" />
              ) : null}
              <Icon
                className={cn(
                  "size-4 shrink-0",
                  active ? "text-primary" : "text-workspace-muted-text",
                )}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1 truncate font-medium">
                {item.label}
              </span>
              {index < 2 ? (
                <span
                  className={cn(
                    "rounded-pill border border-workspace-border bg-workspace-elevated px-1.5 py-0.5 workspace-meta leading-none text-workspace-muted-text",
                    active && "border-primary-border bg-primary-soft text-primary",
                  )}
                >
                  {index === 0
                    ? unresolvedCount
                    : acceptedCount}
                </span>
              ) : (
                <ChevronRight
                  className="size-4 shrink-0 opacity-50"
                  aria-hidden="true"
                />
              )}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}

function MentorBrand() {
  return (
    <Link
      href="/mentor/dashboard/requests"
      className="workspace-control-text inline-flex min-h-11 w-full items-center gap-2.5 rounded-lg px-1 font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40 lg:min-h-9"
    >
      <span className="flex size-7 items-center justify-center rounded-md border border-primary-border bg-primary-soft font-heading text-xs text-primary shrink-0">
        K
      </span>
      Kizuna Hub
    </Link>
  );
}

function MentorProfileSummary() {
  return (
    <div className="rounded-xl border border-workspace-border bg-workspace-panel p-3">
      <div className="flex items-center gap-3">
        <div className="relative size-11 shrink-0 overflow-hidden rounded-full border border-workspace-border bg-workspace-elevated">
          {canonicalMentorPersona.avatarSrc ? (
            <Image
              src={canonicalMentorPersona.avatarSrc}
              alt=""
              fill
              sizes="44px"
              className="object-cover"
            />
          ) : (
            <span className="flex size-full items-center justify-center font-semibold">
              TMQ
            </span>
          )}
          <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-workspace-panel bg-workspace-success" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="workspace-card-title truncate">
            {canonicalMentorPersona.name}
          </p>
          <p className="workspace-meta truncate text-workspace-muted-text">
            {canonicalMentorPersona.role}
          </p>
          <p className="mt-1 flex items-center gap-1 workspace-meta text-workspace-success">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            {canonicalMentorPersona.verificationLabel}
          </p>
        </div>
      </div>
      <div className="mt-3 border-t border-workspace-border pt-3">
        <div className="mb-2 flex items-center justify-between workspace-meta">
          <span>Hồ sơ mentor</span>
          <span className="text-workspace-muted-text">
            {canonicalMentorPersona.profileCompletion}% hoàn thiện
          </span>
        </div>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-workspace-elevated"
          aria-label={`Hồ sơ hoàn thiện ${canonicalMentorPersona.profileCompletion}%`}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={canonicalMentorPersona.profileCompletion}
        >
          <div
            className="h-full rounded-full bg-primary"
            style={{
              width: `${canonicalMentorPersona.profileCompletion}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function SidebarContent({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const { logout } = useDemoAuth();
  const router = useRouter();
  return (
    <>
      <div className="pb-2 pt-3 px-3">
        <MentorBrand />
      </div>
      <div className="flex min-h-0 flex-1 flex-col px-2.5 pb-3">
        <MentorNavigation onNavigate={onNavigate} />
        <div className="mt-auto pt-4">
          <MentorProfileSummary />
          <ThemeMenu
            showLabel
            className="mt-2 rounded-xl border border-workspace-border bg-workspace-panel p-1"
          />
          <button
            type="button"
            onClick={async () => {
              await logout();
              router.replace("/auth/login");
              onNavigate?.();
            }}
            className="mt-2 flex min-h-10 w-full items-center gap-2.5 rounded-xl border border-workspace-border bg-workspace-panel px-3 text-sm text-workspace-muted-text transition-colors hover:bg-workspace-row-hover hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Đăng xuất
          </button>
        </div>
      </div>
    </>
  );
}

export function MentorWorkspaceShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavigationOpen, setMobileNavigationOpen] =
    React.useState(false);

  return (
    <MentorWorkspaceProvider>
      <div className="workspace-density min-h-dvh bg-workspace-background text-foreground">
        <aside className="fixed inset-y-2 left-2 z-40 hidden w-[248px] flex-col overflow-hidden rounded-2xl border border-workspace-border bg-workspace-sidebar lg:flex">
          <SidebarContent />
        </aside>

        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-workspace-border bg-workspace-background/95 px-4 backdrop-blur lg:hidden">
          <MentorBrand />
          <Sheet
            open={mobileNavigationOpen}
            onOpenChange={setMobileNavigationOpen}
          >
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Mở điều hướng"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[min(88vw,19rem)] gap-0 border-workspace-border bg-workspace-sidebar p-0"
            >
              <SheetTitle className="sr-only">
                Điều hướng Mentor Workspace
              </SheetTitle>
              <SheetDescription className="sr-only">
                Chuyển giữa yêu cầu, sắp tới, hồ sơ và cài đặt.
              </SheetDescription>
              <SidebarContent
                onNavigate={() =>
                  setMobileNavigationOpen(false)
                }
              />
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex min-h-[100dvh] min-w-0 flex-col lg:pl-[264px]">
          {children}
        </main>
        <Toaster
          position="bottom-right"
          toastOptions={{ duration: 2600 }}
        />
      </div>
    </MentorWorkspaceProvider>
  );
}
