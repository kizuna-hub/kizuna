"use client";

import React from "react";
import {
  ArrowLeft,
  BookOpen,
  Clock3,
  FileStack,
  FlaskConical,
  FolderKanban,
  GraduationCap,
  Home,
  LayoutDashboard,
  Menu,
  MessagesSquare,
  Repeat2,
  Telescope,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  getCurrentUser,
  getVentureById,
} from "@/features/founder/venture-foundation/demo-repository";
import { useDemoWorkspace } from "@/features/founder/venture-foundation/demo-workspace-provider";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { VentureSwitcher } from "./venture-switcher";

type NavigationItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  note?: string;
};

const globalNavigation: NavigationItem[] = [
  {
    label: "Home",
    href: "/founder/home",
    icon: Home,
    exact: true,
  },
  {
    label: "Projects",
    href: "/founder/projects",
    icon: FolderKanban,
  },
  {
    label: "Programs",
    href: "/founder/programs",
    icon: GraduationCap,
    note: "Later",
  },
  {
    label: "Opportunities",
    href: "/founder/opportunities",
    icon: Telescope,
    note: "Later",
  },
  {
    label: "Library",
    href: "/founder/library",
    icon: BookOpen,
    note: "Preview",
  },
];

function getVentureNavigation(ventureId: string): NavigationItem[] {
  const base = `/founder/projects/${ventureId}`;
  return [
    {
      label: "Overview",
      href: base,
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Current Cycle",
      href: `${base}/cycle`,
      icon: Repeat2,
    },
    {
      label: "Evidence",
      href: `${base}/evidence`,
      icon: FlaskConical,
    },
    {
      label: "Sessions",
      href: `${base}/sessions`,
      icon: MessagesSquare,
    },
    {
      label: "Outputs",
      href: `${base}/outputs`,
      icon: FileStack,
    },
    {
      label: "Timeline",
      href: `${base}/timeline`,
      icon: Clock3,
    },
  ];
}

function isPathActive(pathname: string, item: NavigationItem) {
  if (item.exact) return pathname === item.href;
  return (
    pathname === item.href ||
    pathname.startsWith(`${item.href}/`)
  );
}

function NavigationLink({
  item,
  onNavigate,
  subdued = false,
}: {
  item: NavigationItem;
  onNavigate?: () => void;
  subdued?: boolean;
}) {
  const pathname = usePathname();
  const active = isPathActive(pathname, item);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "workspace-control-text relative flex min-h-11 items-center gap-2.5 rounded-lg border px-2.5 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40 lg:min-h-9",
        active
          ? "border-primary-border bg-workspace-selected text-ink"
          : cn(
              "border-transparent text-workspace-muted-text hover:border-workspace-border hover:bg-workspace-row-hover hover:text-ink",
              subdued && "text-workspace-muted-text/75",
            ),
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
      />
      <span className="min-w-0 flex-1 truncate font-medium">
        {item.label}
      </span>
      {item.note ? (
        <span className="rounded-pill border border-workspace-border bg-workspace-elevated px-1.5 py-0.5 text-[10px] leading-none text-workspace-muted-text">
          {item.note}
        </span>
      ) : null}
    </Link>
  );
}

function AccountFooter() {
  const { state } = useDemoWorkspace();
  const user = getCurrentUser(state);

  return (
    <div className="border-t border-workspace-border p-2.5">
      <div className="flex min-h-11 items-center gap-2.5 rounded-lg px-2 py-1.5 lg:min-h-10">
        <Avatar className="size-8 border border-workspace-border">
          <AvatarImage src={user.avatarUrl} alt="" />
          <AvatarFallback className="bg-workspace-elevated text-xs font-semibold text-ink">
            {user.name
              .split(" ")
              .slice(-2)
              .map((part) => part.charAt(0))
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium leading-5 text-ink">
            {user.name}
          </p>
          <p className="truncate text-xs leading-4 text-workspace-muted-text">
            Founder
          </p>
        </div>
      </div>
    </div>
  );
}

function SidebarContent({
  ventureId,
  onNavigate,
}: {
  ventureId?: string;
  onNavigate?: () => void;
}) {
  const { state } = useDemoWorkspace();
  const venture = ventureId
    ? getVentureById(state, ventureId)
    : undefined;
  const navigation = venture
    ? getVentureNavigation(venture.id)
    : globalNavigation;

  return (
    <div className="flex h-full min-h-0 flex-col bg-workspace-sidebar">
      <div className="px-3 pb-2 pt-3">
        <Link
          href="/founder"
          onClick={onNavigate}
          className="workspace-control-text inline-flex min-h-11 items-center gap-2.5 rounded-lg px-1 font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40 lg:min-h-9"
        >
          <span className="flex size-7 items-center justify-center rounded-md border border-primary-border bg-primary-soft font-heading text-xs text-primary">
            K
          </span>
          Kizuna Hub
        </Link>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2.5 pb-3">
        {venture ? (
          <div className="mb-3">
            <Link
              href="/founder/projects"
              onClick={onNavigate}
              className="mb-2 inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-xs font-medium text-workspace-muted-text transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40 lg:min-h-8"
            >
              <ArrowLeft className="size-3.5" />
              All Projects
            </Link>
            <VentureSwitcher
              ventureId={venture.id}
              onNavigate={onNavigate}
            />
          </div>
        ) : (
          <p className="mb-2 px-2.5 pt-1 workspace-eyebrow text-workspace-muted-text">
            Workspace
          </p>
        )}

        <nav
          aria-label={
            venture ? "Project workspace" : "Founder workspace"
          }
          className="space-y-0.5"
        >
          {navigation.slice(0, 2).map((item) => (
            <NavigationLink
              key={item.href}
              item={item}
              onNavigate={onNavigate}
            />
          ))}

          {navigation.length > 2 ? (
            <>
              <p className="mb-1 mt-4 px-2.5 workspace-eyebrow text-workspace-muted-text/70">
                {venture ? "Preview & tools" : "More"}
              </p>
              {navigation.slice(2).map((item) => (
                <NavigationLink
                  key={item.href}
                  item={item}
                  onNavigate={onNavigate}
                  subdued
                />
              ))}
            </>
          ) : null}
        </nav>
      </div>

      <AccountFooter />
    </div>
  );
}

export function FounderShell({
  children,
  ventureId,
  contentClassName,
  contentWidth = "wide",
}: {
  children: React.ReactNode;
  ventureId?: string;
  contentClassName?: string;
  contentWidth?: "wide" | "focused";
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="workspace-density min-h-[100dvh] bg-workspace-background text-ink">
      <aside className="fixed inset-y-2 left-2 z-header hidden w-[248px] overflow-hidden rounded-2xl border border-workspace-border lg:block">
        <SidebarContent ventureId={ventureId} />
      </aside>

      <div className="flex min-h-[100dvh] min-w-0 flex-col lg:pl-[264px]">
        <div className="flex items-center px-4 pt-3 md:px-5 lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="workspace-control-text h-11 gap-2 px-3 sm:h-10 lg:h-9"
                aria-label="Open founder navigation"
              >
                <Menu className="size-4" />
                Menu
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[min(304px,calc(100vw-1rem))] gap-0 border-workspace-border bg-workspace-sidebar p-0 sm:max-w-[304px]"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Founder navigation</SheetTitle>
                <SheetDescription>
                  Navigate projects and the active project workspace.
                </SheetDescription>
              </SheetHeader>
              <SidebarContent
                ventureId={ventureId}
                onNavigate={() => setMobileOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>

        <main className="min-w-0 flex-1 px-4 py-5 md:px-5 lg:px-6">
          <div
            className={cn(
              "mx-auto w-full",
              contentWidth === "focused"
                ? "max-w-5xl"
                : "max-w-6xl",
              contentClassName,
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
