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
  getAllVentures,
  getVentureById,
  ventureStageLabels,
} from "@/features/founder/venture-foundation/demo-repository";
import { useDemoWorkspace } from "@/features/founder/venture-foundation/demo-workspace-provider";
import { getVentureSwitchPath } from "@/features/founder/venture-foundation/route-resolver";
import { usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function VentureSwitcher({
  ventureId,
  onNavigate,
}: {
  ventureId: string;
  onNavigate?: () => void;
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Switch project. Current project: ${current.name}`}
          className="flex min-h-11 w-full items-center gap-2.5 rounded-lg border border-workspace-border bg-workspace-elevated px-2.5 py-1.5 text-left transition-colors hover:bg-workspace-row-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40 lg:min-h-9"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-primary-border bg-primary-soft font-heading text-xs font-semibold text-primary">
            {current.name.charAt(0)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="workspace-project-identity block truncate text-ink">
              {current.name}
            </span>
            <span className="block truncate text-xs leading-4 text-workspace-muted-text">
              {ventureStageLabels[current.stage]} ·{" "}
              {current.status === "setup"
                ? "Setup"
                : current.status === "paused"
                  ? "Paused"
                  : "Active"}
            </span>
          </span>
          <ChevronsUpDown className="size-3.5 shrink-0 text-workspace-muted-text" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={6}
        className="w-[min(280px,calc(100vw-1rem))] border-workspace-border bg-workspace-panel p-1.5"
      >
        <DropdownMenuLabel className="px-2 py-1.5 workspace-eyebrow text-workspace-muted-text">
          Switch project
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
                  {ventureStageLabels[venture.stage]}
                </span>
              </span>
              {isCurrent ? (
                <Check
                  className="size-4 text-primary"
                  aria-label="Current project"
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
          className="min-h-10 text-[13px] focus:bg-workspace-row-hover focus:text-ink"
        >
          <LayoutGrid className="size-4" />
          View all projects
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            router.push("/submit-project");
            onNavigate?.();
          }}
          className="min-h-10 text-[13px] focus:bg-workspace-row-hover focus:text-ink"
        >
          <Plus className="size-4" />
          Create project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
