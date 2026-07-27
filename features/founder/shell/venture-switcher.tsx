"use client";

import {
  Check,
  ChevronsUpDown,
  LayoutGrid,
  Plus,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getAllVentures,
  getVentureById,
} from "@/features/founder/venture-foundation/demo-repository";
import { useDemoWorkspace } from "@/features/founder/venture-foundation/demo-workspace-provider";
import { getVentureSwitchPath } from "@/features/founder/venture-foundation/route-resolver";
import { usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import { founderShellVi } from "./copy/vi";

export function VentureSwitcher({
  ventureId,
  onNavigate,
  collapsed = false,
}: {
  ventureId: string;
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    state,
    setActiveVenture,
    setLastVisitedVenturePath,
  } = useDemoWorkspace();
  const ventures = getAllVentures(state);
  const current = getVentureById(state, ventureId);

  const selectVenture = (targetId: string) => {
    const targetPath = getVentureSwitchPath(pathname, targetId);
    setActiveVenture(targetId);
    setLastVisitedVenturePath(targetId, targetPath);
    router.push(targetPath);
    onNavigate?.();
  };

  if (!current) return null;

  const trigger = (
    <DropdownMenuTrigger asChild>
      <button
        type="button"
        aria-label={`${founderShellVi.switcher.switchProject}. ${founderShellVi.switcher.currentProject}: ${current.name}`}
        className={cn(
          "flex min-h-11 items-center gap-2.5 rounded-lg border border-workspace-border bg-workspace-elevated py-1.5 text-left transition-colors hover:bg-workspace-row-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40 lg:min-h-9",
          collapsed
            ? "w-10 justify-center px-1"
            : "w-full px-2.5",
        )}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-primary-border bg-primary-soft font-heading text-xs font-semibold text-primary">
          {current.name.charAt(0)}
        </span>
        {collapsed ? null : (
          <>
            <span className="min-w-0 flex-1">
              <span className="workspace-project-identity block truncate text-ink">
                {current.name}
              </span>
              <span className="block truncate text-xs leading-4 text-workspace-muted-text">
                {founderShellVi.stages[current.stage]} ·{" "}
                {founderShellVi.statuses[current.status]}
              </span>
            </span>
            <ChevronsUpDown className="size-3.5 shrink-0 text-workspace-muted-text" />
          </>
        )}
      </button>
    </DropdownMenuTrigger>
  );

  return (
    <DropdownMenu>
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">{trigger}</span>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            {current.name}
          </TooltipContent>
        </Tooltip>
      ) : (
        trigger
      )}
      <DropdownMenuContent
        align="start"
        sideOffset={6}
        className="w-[min(280px,calc(100vw-1rem))] border-workspace-border bg-workspace-panel p-1.5"
      >
        <DropdownMenuLabel className="px-2 py-1.5 workspace-eyebrow text-workspace-muted-text">
          {founderShellVi.switcher.switchProject}
        </DropdownMenuLabel>
        {ventures.map((venture) => {
          const isCurrent = venture.id === ventureId;
          return (
            <DropdownMenuItem
              key={venture.id}
              onSelect={() => selectVenture(venture.id)}
              className={cn(
                "min-h-11 rounded-lg px-2 py-1.5 focus:bg-workspace-row-hover focus:text-ink lg:min-h-9",
                isCurrent && "bg-workspace-selected",
              )}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-workspace-border bg-workspace-elevated text-xs font-semibold text-ink">
                {venture.name.charAt(0)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="workspace-project-identity block truncate font-medium">
                  {venture.name}
                </span>
                <span className="block truncate text-xs leading-4 text-workspace-muted-text">
                  {founderShellVi.stages[venture.stage]}
                </span>
              </span>
              {isCurrent ? (
                <Check
                  className="size-4 text-primary"
                  aria-label={founderShellVi.switcher.current}
                />
              ) : null}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator className="bg-workspace-border" />
        <DropdownMenuItem
          onSelect={() => {
            router.push("/founder/projects");
            onNavigate?.();
          }}
          className="min-h-10 workspace-supporting focus:bg-workspace-row-hover focus:text-ink"
        >
          <LayoutGrid className="size-4" />
          {founderShellVi.switcher.viewAll}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            router.push("/founder/projects/new");
            onNavigate?.();
          }}
          className="min-h-10 workspace-supporting focus:bg-workspace-row-hover focus:text-ink"
        >
          <Plus className="size-4" />
          {founderShellVi.switcher.create}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
