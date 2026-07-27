"use client";

import React, { useState } from "react";
import {
  Check,
  ChevronRight,
  ChevronsUpDown,
  Compass,
  CreditCard,
  HeartHandshake,
  HelpCircle,
  Keyboard,
  LogOut,
  MessageSquare,
  Monitor,
  Moon,
  Palette,
  Plug,
  Settings,
  Share2,
  Smartphone,
  Sun,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ColorPaletteOption {
  id: string;
  name: string;
  dotBg: string;
  dotText: string;
  dotBorder: string;
  bulletColor: string;
}

const colorPalettes: ColorPaletteOption[] = [
  {
    id: "default",
    name: "Default",
    dotBg: "bg-neutral-800",
    dotText: "text-neutral-300",
    dotBorder: "border-neutral-700",
    bulletColor: "bg-neutral-400",
  },
  {
    id: "eden",
    name: "Eden",
    dotBg: "bg-emerald-950/80",
    dotText: "text-emerald-400",
    dotBorder: "border-emerald-800/60",
    bulletColor: "bg-emerald-400",
  },
  {
    id: "ocean",
    name: "Ocean",
    dotBg: "bg-sky-950/80",
    dotText: "text-sky-400",
    dotBorder: "border-sky-800/60",
    bulletColor: "bg-sky-400",
  },
  {
    id: "violet",
    name: "Violet",
    dotBg: "bg-purple-950/80",
    dotText: "text-purple-400",
    dotBorder: "border-purple-800/60",
    bulletColor: "bg-purple-400",
  },
  {
    id: "amber",
    name: "Amber",
    dotBg: "bg-amber-950/80",
    dotText: "text-amber-400",
    dotBorder: "border-amber-800/60",
    bulletColor: "bg-amber-400",
  },
  {
    id: "rose",
    name: "Rose",
    dotBg: "bg-rose-950/80",
    dotText: "text-rose-400",
    dotBorder: "border-rose-800/60",
    bulletColor: "bg-rose-400",
  },
  {
    id: "graphite",
    name: "Graphite",
    dotBg: "bg-slate-800/80",
    dotText: "text-slate-300",
    dotBorder: "border-slate-700",
    bulletColor: "bg-slate-300",
  },
  {
    id: "monochrome",
    name: "Monochrome",
    dotBg: "bg-neutral-900",
    dotText: "text-neutral-200",
    dotBorder: "border-neutral-600",
    bulletColor: "bg-white",
  },
];

export interface WorkspaceUserFooterProps {
  user?: { name: string; avatarUrl?: string };
  workspaceName?: string;
  collapsed?: boolean;
  onTrashClick?: () => void;
}

export function WorkspaceUserFooter({
  workspaceName = "knkidngoc's workspace",
  collapsed = false,
  onTrashClick,
}: WorkspaceUserFooterProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [selectedPalette, setSelectedPalette] = useState<string>("eden");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? theme : "dark";

  const renderDropdownMenuContent = () => (
    <DropdownMenuContent
      side="top"
      align="start"
      sideOffset={10}
      className="z-dropdown w-[240px] rounded-xl border border-workspace-border/60 bg-[#141414] p-1 text-neutral-200 shadow-2xl backdrop-blur-xl"
    >
      <div className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-white/10">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex size-5 shrink-0 items-center justify-center rounded bg-neutral-800 text-[11px] font-bold text-neutral-300 border border-white/10">
            K
          </span>
          <span className="truncate text-sm font-medium text-white">
            {workspaceName}
          </span>
        </div>
        <ChevronRight className="size-4 shrink-0 text-neutral-500" />
      </div>
      <DropdownMenuSeparator className="my-1 border-t border-white/10 bg-transparent" />

      <div className="space-y-0.5">
        <DropdownMenuItem className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-neutral-300 transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white">
          <Settings className="mr-2.5 size-4 shrink-0 text-neutral-400" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-neutral-300 transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white">
          <Keyboard className="mr-2.5 size-4 shrink-0 text-neutral-400" />
          <span>Shortcuts</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-neutral-300 transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white">
          <CreditCard className="mr-2.5 size-4 shrink-0 text-neutral-400" />
          <span>Billing</span>
        </DropdownMenuItem>
      </div>

      <DropdownMenuSeparator className="my-1 border-t border-white/10 bg-transparent" />

      <div className="space-y-0.5">
        <DropdownMenuItem className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-neutral-300 transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white">
          <MessageSquare className="mr-2.5 size-4 shrink-0 text-neutral-400" />
          <span>Join the Discord</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-neutral-300 transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white">
          <Plug className="mr-2.5 size-4 shrink-0 text-neutral-400" />
          <span>Get the MCP</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-neutral-300 transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white">
          <Compass className="mr-2.5 size-4 shrink-0 text-neutral-400" />
          <span>Chrome Extension</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-neutral-300 transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white">
          <Smartphone className="mr-2.5 size-4 shrink-0 text-neutral-400" />
          <span>Get the iOS app</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-neutral-300 transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white">
          <Share2 className="mr-2.5 size-4 shrink-0 text-neutral-400" />
          <span>Become an affiliate</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-neutral-300 transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white">
          <HeartHandshake className="mr-2.5 size-4 shrink-0 text-neutral-400" />
          <span>Leave a testimonial</span>
        </DropdownMenuItem>
      </div>

      <DropdownMenuSeparator className="my-1 border-t border-white/10 bg-transparent" />

      <div className="space-y-0.5">
        <DropdownMenuItem className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-neutral-300 transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white">
          <UserPlus className="mr-2.5 size-4 shrink-0 text-neutral-400" />
          <span>Add another account</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-neutral-300 transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white">
          <HelpCircle className="mr-2.5 size-4 shrink-0 text-neutral-400" />
          <span>Help & support</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/vi/login")}
          className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-neutral-300 transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
        >
          <LogOut className="mr-2.5 size-4 shrink-0 text-neutral-400" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </div>
    </DropdownMenuContent>
  );

  const renderPopoverContent = () => (
    <PopoverContent
      side="top"
      align="center"
      sideOffset={10}
      className="z-dropdown w-[220px] rounded-2xl border border-workspace-border/60 bg-[#141414] p-3 text-neutral-200 shadow-2xl backdrop-blur-xl"
    >
      <div className="mb-2 text-xs font-semibold text-neutral-400">
        Theme
      </div>
      <div className="mb-3 grid grid-cols-3 gap-1 rounded-xl border border-white/5 bg-[#202020] p-1">
        <button
          type="button"
          onClick={() => setTheme("light")}
          aria-label="Light theme"
          className={cn(
            "flex h-7 items-center justify-center rounded-lg transition-all",
            currentTheme === "light"
              ? "bg-[#141414] text-white shadow-sm border border-white/10"
              : "text-neutral-400 hover:text-white",
          )}
        >
          <Sun className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => setTheme("dark")}
          aria-label="Dark theme"
          className={cn(
            "flex h-7 items-center justify-center rounded-lg transition-all",
            currentTheme === "dark"
              ? "bg-[#141414] text-white shadow-sm border border-white/10"
              : "text-neutral-400 hover:text-white",
          )}
        >
          <Moon className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => setTheme("system")}
          aria-label="System theme"
          className={cn(
            "flex h-7 items-center justify-center rounded-lg transition-all",
            currentTheme === "system" || !currentTheme
              ? "bg-[#141414] text-white shadow-sm border border-white/10"
              : "text-neutral-400 hover:text-white",
          )}
        >
          <Monitor className="size-4" />
        </button>
      </div>

      <div className="space-y-1">
        {colorPalettes.map((palette) => {
          const isSelected = selectedPalette === palette.id;
          return (
            <button
              key={palette.id}
              type="button"
              onClick={() => setSelectedPalette(palette.id)}
              className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-white/10"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center gap-0.5 rounded-full border text-[11px] font-semibold",
                    palette.dotBg,
                    palette.dotText,
                    palette.dotBorder,
                  )}
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      palette.bulletColor,
                    )}
                  />
                  <span>Aa</span>
                </span>
                <span className="text-sm font-medium text-neutral-200">
                  {palette.name}
                </span>
              </div>
              {isSelected ? (
                <Check className="size-4 text-neutral-300" />
              ) : null}
            </button>
          );
        })}
      </div>
    </PopoverContent>
  );

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-1.5 border-t border-workspace-border py-2.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-workspace-row-hover focus-visible:outline-none"
              aria-label="Workspace options"
            >
              <span className="flex size-7 items-center justify-center rounded-full border border-white/10 bg-neutral-800 text-xs font-bold text-amber-400 shadow-inner">
                K
              </span>
            </button>
          </DropdownMenuTrigger>
          {renderDropdownMenuContent()}
        </DropdownMenu>

        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="Theme palette"
              className="flex size-8 items-center justify-center rounded-lg text-workspace-muted-text transition-colors hover:bg-workspace-row-hover hover:text-ink focus-visible:outline-none"
            >
              <Palette className="size-4" />
            </button>
          </PopoverTrigger>
          {renderPopoverContent()}
        </Popover>

        <button
          type="button"
          onClick={onTrashClick}
          className="flex size-8 items-center justify-center rounded-lg text-workspace-muted-text transition-colors hover:bg-workspace-row-hover hover:text-ink focus-visible:outline-none"
          aria-label="Delete"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-12 items-center justify-between gap-1 border-t border-workspace-border px-2 py-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex min-w-0 flex-1 items-center justify-between gap-1.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-workspace-row-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-neutral-800 text-xs font-bold text-amber-400 shadow-inner">
                K
              </span>
              <span className="truncate text-sm font-medium text-ink">
                knkidngoc&apos;...
              </span>
            </div>
            <ChevronsUpDown className="size-3.5 shrink-0 text-workspace-muted-text opacity-70" />
          </button>
        </DropdownMenuTrigger>
        {renderDropdownMenuContent()}
      </DropdownMenu>

      <div className="flex shrink-0 items-center gap-0.5">
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="Theme palette"
              className="flex size-8 items-center justify-center rounded-lg text-workspace-muted-text transition-colors hover:bg-workspace-row-hover hover:text-ink focus-visible:outline-none"
            >
              <Palette className="size-4" />
            </button>
          </PopoverTrigger>
          {renderPopoverContent()}
        </Popover>

        <button
          type="button"
          aria-label="Delete"
          onClick={onTrashClick}
          className="flex size-8 items-center justify-center rounded-lg text-workspace-muted-text transition-colors hover:bg-workspace-row-hover hover:text-ink focus-visible:outline-none"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}
