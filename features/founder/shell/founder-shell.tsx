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
  PanelLeftClose,
  PanelLeftOpen,
  Repeat2,
  Sparkles,
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getCurrentUser,
  getVentureById,
} from "@/features/founder/venture-foundation/demo-repository";
import { useDemoWorkspace } from "@/features/founder/venture-foundation/demo-workspace-provider";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import { WorkspaceUserFooter } from "./workspace-user-footer";
import { founderShellVi } from "./copy/vi";
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
    label: founderShellVi.globalNavigation.home,
    href: "/founder/home",
    icon: Home,
    exact: true,
  },
  {
    label: founderShellVi.globalNavigation.projects,
    href: "/founder/projects",
    icon: FolderKanban,
  },
  {
    label: founderShellVi.globalNavigation.programs,
    href: "/founder/programs",
    icon: GraduationCap,
    note: founderShellVi.notes.later,
  },
  {
    label: founderShellVi.globalNavigation.opportunities,
    href: "/founder/opportunities",
    icon: Telescope,
    note: founderShellVi.notes.later,
  },
  {
    label: founderShellVi.globalNavigation.library,
    href: "/founder/library",
    icon: BookOpen,
    note: founderShellVi.notes.preview,
  },
];

function getVentureNavigation(
  ventureId: string,
): NavigationItem[] {
  const base = `/founder/projects/${ventureId}`;
  return [
    {
      label: founderShellVi.projectNavigation.overview,
      href: base,
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: founderShellVi.projectNavigation.workspace,
      href: `${base}/workspace`,
      icon: Sparkles,
    },
    {
      label: founderShellVi.projectNavigation.cycle,
      href: `${base}/cycle`,
      icon: Repeat2,
    },
    {
      label: founderShellVi.projectNavigation.evidence,
      href: `${base}/evidence`,
      icon: FlaskConical,
    },
    {
      label: founderShellVi.projectNavigation.sessions,
      href: `${base}/sessions`,
      icon: MessagesSquare,
    },
    {
      label: founderShellVi.projectNavigation.outputs,
      href: `${base}/outputs`,
      icon: FileStack,
    },
    {
      label: founderShellVi.projectNavigation.timeline,
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
  collapsed = false,
}: {
  item: NavigationItem;
  onNavigate?: () => void;
  subdued?: boolean;
  collapsed?: boolean;
}) {
  const pathname = usePathname();
  const active = isPathActive(pathname, item);
  const Icon = item.icon;
  const link = (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      aria-label={collapsed ? item.label : undefined}
      className={cn(
        "workspace-control-text relative flex min-h-11 items-center rounded-lg border py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40 lg:min-h-9",
        collapsed
          ? "w-10 justify-center px-1"
          : "w-full gap-2.5 px-2.5",
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
      {collapsed ? null : (
        <>
          <span className="min-w-0 flex-1 truncate font-medium">
            {item.label}
          </span>
          {item.note ? (
            <span className="rounded-pill border border-workspace-border bg-workspace-elevated px-1.5 py-0.5 workspace-meta leading-none text-workspace-muted-text">
              {item.note}
            </span>
          ) : null}
        </>
      )}
    </Link>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        {item.label}
      </TooltipContent>
    </Tooltip>
  );
}

function AccountFooter({ collapsed }: { collapsed: boolean }) {
  const { state } = useDemoWorkspace();
  const user = getCurrentUser(state);
  return <WorkspaceUserFooter user={user} collapsed={collapsed} />;
}

function SidebarContent({
  ventureId,
  navigationScope,
  onNavigate,
  collapsed = false,
  onToggleCollapsed,
}: {
  ventureId?: string;
  navigationScope: "auto" | "global";
  onNavigate?: () => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}) {
  const { state } = useDemoWorkspace();
  const venture = ventureId
    ? getVentureById(state, ventureId)
    : undefined;
  const projectScoped =
    Boolean(venture) && navigationScope !== "global";
  const navigation =
    projectScoped && venture
      ? getVentureNavigation(venture.id)
      : globalNavigation;

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col bg-workspace-sidebar",
        !collapsed && "w-[248px]",
      )}
    >
      <div
        className={cn(
          "pb-2 pt-3",
          collapsed ? "px-3" : "px-3",
        )}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/founder/home"
              onClick={onNavigate}
              aria-label={
                collapsed ? founderShellVi.brand : undefined
              }
              className={cn(
                "workspace-control-text inline-flex min-h-11 items-center rounded-lg font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40 lg:min-h-9",
                collapsed ? "justify-center" : "gap-2.5 px-1",
              )}
            >
              <span className="flex size-7 items-center justify-center rounded-md border border-primary-border bg-primary-soft font-heading text-xs text-primary">
                K
              </span>
              {collapsed ? null : founderShellVi.brand}
            </Link>
          </TooltipTrigger>
          {collapsed ? (
            <TooltipContent side="right" sideOffset={8}>
              {founderShellVi.brand}
            </TooltipContent>
          ) : null}
        </Tooltip>
      </div>

      <div
        className={cn(
          "min-h-0 flex-1 overflow-y-auto pb-3",
          collapsed ? "px-3" : "px-2.5",
        )}
      >
        {venture ? (
          <div className="mb-3">
            {projectScoped && !collapsed ? (
              <Link
                href="/founder/projects"
                onClick={onNavigate}
                className="mb-2 inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-xs font-medium text-workspace-muted-text transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40 lg:min-h-8"
              >
                <ArrowLeft className="size-3.5" />
                {founderShellVi.navigation.allProjects}
              </Link>
            ) : null}
            <VentureSwitcher
              ventureId={venture.id}
              onNavigate={onNavigate}
              collapsed={collapsed}
            />
          </div>
        ) : collapsed ? null : (
          <p className="mb-2 px-2.5 pt-1 workspace-eyebrow text-workspace-muted-text">
            {founderShellVi.groups.workspace}
          </p>
        )}

        <nav
          aria-label={
            projectScoped
              ? founderShellVi.navigation.project
              : founderShellVi.navigation.global
          }
          className={cn("space-y-0.5", collapsed && "flex flex-col items-center")}
        >
          {navigation.slice(0, 2).map((item) => (
            <NavigationLink
              key={item.href}
              item={item}
              onNavigate={onNavigate}
              collapsed={collapsed}
            />
          ))}

          {navigation.length > 2 ? (
            <>
              {collapsed ? (
                <div className="my-3 h-px w-7 bg-workspace-border" />
              ) : (
                <p className="mb-1 mt-4 px-2.5 workspace-eyebrow text-workspace-muted-text/70">
                  {projectScoped
                    ? founderShellVi.groups.previews
                    : founderShellVi.groups.more}
                </p>
              )}
              {navigation.slice(2).map((item) => (
                <NavigationLink
                  key={item.href}
                  item={item}
                  onNavigate={onNavigate}
                  subdued
                  collapsed={collapsed}
                />
              ))}
            </>
          ) : null}
        </nav>
      </div>

      {onToggleCollapsed ? (
        <div className="border-t border-workspace-border p-2.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onToggleCollapsed}
                aria-label={
                  collapsed
                    ? founderShellVi.navigation.expand
                    : founderShellVi.navigation.collapse
                }
                className={cn(
                  "flex min-h-9 items-center rounded-lg text-workspace-muted-text transition-colors hover:bg-workspace-row-hover hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40",
                  collapsed
                    ? "w-10 justify-center"
                    : "w-full gap-2.5 px-2",
                )}
              >
                {collapsed ? (
                  <PanelLeftOpen className="size-4" />
                ) : (
                  <>
                    <PanelLeftClose className="size-4" />
                    <span className="workspace-control-text">
                      {founderShellVi.navigation.collapse}
                    </span>
                  </>
                )}
              </button>
            </TooltipTrigger>
            {collapsed ? (
              <TooltipContent side="right" sideOffset={8}>
                {founderShellVi.navigation.expand}
              </TooltipContent>
            ) : null}
          </Tooltip>
        </div>
      ) : null}

      <AccountFooter collapsed={collapsed} />
    </div>
  );
}

export interface FounderShellSidebarRenderProps {
  ventureId?: string;
  collapsed: boolean;
  onNavigate?: () => void;
  onToggleCollapsed?: () => void;
}

export function FounderShell({
  children,
  ventureId,
  navigationScope = "auto",
  contentClassName,
  contentWidth = "wide",
  collapsible = false,
  renderSidebar,
}: {
  children: React.ReactNode;
  ventureId?: string;
  navigationScope?: "auto" | "global";
  contentClassName?: string;
  contentWidth?: "wide" | "focused" | "fluid";
  collapsible?: boolean;
  renderSidebar?: (
    props: FounderShellSidebarRenderProps,
  ) => React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const {
    state,
    hydrated,
    updateUiPreferences,
  } = useDemoWorkspace();
  const collapsed =
    collapsible &&
    hydrated &&
    Boolean(state.uiPreferences.founderSidebarCollapsed);
  const toggleCollapsed = collapsible
    ? () =>
        updateUiPreferences({
          founderSidebarCollapsed: !collapsed,
        })
    : undefined;
  const compactCustomSidebar = collapsed && Boolean(renderSidebar);

  return (
    <div className="workspace-density min-h-[100dvh] bg-workspace-background text-ink">
      <aside
        className={cn(
          "fixed inset-y-2 left-2 z-header hidden overflow-hidden rounded-2xl border border-workspace-border bg-workspace-sidebar lg:block",
          hydrated &&
            "transition-all duration-[300ms] ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
          collapsed ? "w-[68px]" : "w-[248px]",
        )}
      >
        {renderSidebar ? (
          renderSidebar({
            ventureId,
            collapsed,
            onToggleCollapsed: toggleCollapsed,
          })
        ) : (
          <SidebarContent
            ventureId={ventureId}
            navigationScope={navigationScope}
            collapsed={collapsed}
            onToggleCollapsed={toggleCollapsed}
          />
        )}
      </aside>

      <div
        className={cn(
          "flex min-h-[100dvh] min-w-0 flex-col",
          hydrated &&
            "transition-all duration-[300ms] ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
          collapsed ? "lg:pl-[84px]" : "lg:pl-[264px]",
        )}
      >
        <div className="flex items-center px-4 pt-3 md:px-5 lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="workspace-control-text h-11 gap-2 px-3 sm:h-10 lg:h-9"
                aria-label={founderShellVi.navigation.open}
              >
                <Menu className="size-4" />
                {founderShellVi.navigation.menu}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[min(304px,calc(100vw-1rem))] gap-0 border-workspace-border bg-workspace-sidebar p-0 sm:max-w-[304px]"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>
                  {founderShellVi.navigation.title}
                </SheetTitle>
                <SheetDescription>
                  {founderShellVi.navigation.description}
                </SheetDescription>
              </SheetHeader>
              {renderSidebar ? (
                renderSidebar({
                  ventureId,
                  collapsed: false,
                  onNavigate: () => setMobileOpen(false),
                })
              ) : (
                <SidebarContent
                  ventureId={ventureId}
                  navigationScope={navigationScope}
                  onNavigate={() => setMobileOpen(false)}
                />
              )}
            </SheetContent>
          </Sheet>
        </div>

        <main className="min-w-0 flex-1 px-4 py-5 md:px-5 lg:px-6">
          <div
            className={cn(
              "mx-auto w-full",
              contentWidth === "focused"
                ? "max-w-5xl"
                : contentWidth === "wide"
                  ? "max-w-6xl"
                  : "max-w-none",
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
