"use client";

import * as React from "react";
import { Check, Monitor, Moon, Palette, Sun } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

import { ACCENT_THEMES } from "../config/accent-theme-definitions";
import { useKizunaTheme } from "../providers/theme-provider";
import type {
  AccentThemeId,
  AppearanceMode,
} from "../types/theme.types";

const appearanceOptions = [
  { id: "light", label: "Sáng", icon: Sun },
  { id: "dark", label: "Tối", icon: Moon },
  { id: "system", label: "Hệ thống", icon: Monitor },
] as const;

interface ThemeMenuProps {
  collapsed?: boolean;
  showLabel?: boolean;
  className?: string;
}

function ThemeMenuPanel() {
  const {
    appearance,
    accent,
    resolvedAppearance,
    setAppearance,
    setAccent,
  } = useKizunaTheme();

  return (
    <div className="space-y-4">
      <div>
        <p className="workspace-eyebrow mb-2 text-muted-foreground">
          Giao diện
        </p>
        <ToggleGroup
          type="single"
          value={appearance}
          onValueChange={(value) => {
            if (value) {
              setAppearance(value as AppearanceMode);
            }
          }}
          aria-label="Chọn chế độ giao diện"
          className="grid w-full grid-cols-3 gap-1 rounded-lg border border-border bg-muted p-1"
        >
          {appearanceOptions.map((option) => {
            const Icon = option.icon;
            return (
              <ToggleGroupItem
                key={option.id}
                value={option.id}
                aria-label={option.label}
                className="h-8 gap-1.5 rounded-md border-0 px-2 text-[0.6875rem] text-muted-foreground hover:bg-card hover:text-foreground data-[state=on]:bg-card data-[state=on]:text-foreground data-[state=on]:shadow-sm"
              >
                <Icon className="size-3.5" aria-hidden="true" />
                <span>{option.label}</span>
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </div>

      <div>
        <p className="workspace-eyebrow mb-2 text-muted-foreground">
          Màu nhấn
        </p>
        <ToggleGroup
          type="single"
          orientation="vertical"
          value={accent}
          onValueChange={(value) => {
            if (value) {
              setAccent(value as AccentThemeId);
            }
          }}
          aria-label="Chọn màu nhấn"
          className="flex w-full flex-col items-stretch gap-0.5"
        >
          {ACCENT_THEMES.map((theme) => {
            const selected = theme.id === accent;
            const tokens = theme[resolvedAppearance];

            return (
              <ToggleGroupItem
                key={theme.id}
                value={theme.id}
                aria-label={theme.label}
                className="h-9 w-full justify-between rounded-lg border border-transparent px-2 text-foreground hover:border-border hover:bg-muted data-[state=on]:border-primary-border data-[state=on]:bg-primary-muted"
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className="flex size-7 items-center justify-center rounded-full border text-[0.625rem] font-semibold"
                    style={{
                      backgroundColor: tokens.primaryMuted,
                      borderColor: tokens.primaryBorder,
                      color: tokens.primaryText,
                    }}
                    aria-hidden="true"
                  >
                    {theme.previewLabel}
                  </span>
                  <span className="text-xs font-medium">
                    {theme.label}
                  </span>
                </span>
                <Check
                  className={cn(
                    "size-4 text-primary transition-opacity",
                    selected ? "opacity-100" : "opacity-0",
                  )}
                  aria-hidden="true"
                />
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </div>
    </div>
  );
}

function ThemeMenuButton({
  collapsed,
  showLabel,
  open,
}: {
  collapsed: boolean;
  showLabel: boolean;
  open: boolean;
}) {
  return (
    <button
      type="button"
      aria-label="Giao diện và màu sắc"
      className={cn(
        "flex min-h-9 items-center rounded-lg text-workspace-muted-text transition-colors hover:bg-workspace-row-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40",
        collapsed
          ? "size-8 justify-center"
          : showLabel
            ? "w-full justify-between gap-2 px-2.5"
            : "size-8 justify-center",
        open && "bg-workspace-selected text-primary-text",
      )}
    >
      <span className="flex items-center gap-2">
        <Palette className="size-4" aria-hidden="true" />
        {showLabel && !collapsed ? (
          <span className="workspace-control-text font-medium">
            Giao diện và màu sắc
          </span>
        ) : null}
      </span>
      {showLabel && !collapsed ? (
        <span className="size-2 rounded-full bg-primary" />
      ) : null}
    </button>
  );
}

export function ThemeMenu({
  collapsed = false,
  showLabel = false,
  className,
}: ThemeMenuProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);
  const trigger = (
    <ThemeMenuButton
      collapsed={collapsed}
      showLabel={showLabel}
      open={open}
    />
  );

  if (isMobile) {
    return (
      <div className={className}>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>{trigger}</SheetTrigger>
          <SheetContent
            side="bottom"
            className="max-h-[82dvh] gap-0 overflow-y-auto rounded-t-2xl border-border bg-popover px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-5 text-popover-foreground"
          >
            <SheetTitle className="pr-8 text-base">
              Giao diện và màu sắc
            </SheetTitle>
            <SheetDescription className="mt-1 mb-4">
              Thay đổi được áp dụng ngay trên toàn bộ Kizuna Hub.
            </SheetDescription>
            <ThemeMenuPanel />
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>{trigger}</PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={6}>
            Giao diện và màu sắc
          </TooltipContent>
        </Tooltip>
        <PopoverContent
          side="top"
          align={collapsed ? "center" : "end"}
          sideOffset={10}
          className="z-popover w-[264px] rounded-xl border-border bg-popover p-3 text-popover-foreground shadow-lg"
        >
          <ThemeMenuPanel />
        </PopoverContent>
      </Popover>
    </div>
  );
}
