"use client";

import {
  ChevronRight,
  ChevronsUpDown,
  Compass,
  CreditCard,
  HeartHandshake,
  HelpCircle,
  Keyboard,
  LogOut,
  MessageSquare,
  Plug,
  Settings,
  Share2,
  Smartphone,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeMenu } from "@/features/theme/components/theme-menu";

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

  const renderDropdownMenuContent = () => (
    <DropdownMenuContent
      side="top"
      align="start"
      sideOffset={10}
      className="z-dropdown w-[240px] rounded-xl border border-workspace-border bg-popover p-1 text-popover-foreground shadow-lg"
    >
      <div className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-workspace-row-hover">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex size-5 shrink-0 items-center justify-center rounded border border-primary-border bg-primary-muted text-[11px] font-bold text-primary-text">
            K
          </span>
          <span className="truncate text-sm font-medium text-foreground">
            {workspaceName}
          </span>
        </div>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      </div>
      <DropdownMenuSeparator className="my-1 bg-border" />

      <div className="space-y-0.5">
        <DropdownMenuItem className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground">
          <Settings className="mr-2.5 size-4 shrink-0" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground">
          <Keyboard className="mr-2.5 size-4 shrink-0" />
          <span>Shortcuts</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground">
          <CreditCard className="mr-2.5 size-4 shrink-0" />
          <span>Billing</span>
        </DropdownMenuItem>
      </div>

      <DropdownMenuSeparator className="my-1 bg-border" />

      <div className="space-y-0.5">
        <DropdownMenuItem className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground">
          <MessageSquare className="mr-2.5 size-4 shrink-0" />
          <span>Join the Discord</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground">
          <Plug className="mr-2.5 size-4 shrink-0" />
          <span>Get the MCP</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground">
          <Compass className="mr-2.5 size-4 shrink-0" />
          <span>Chrome Extension</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground">
          <Smartphone className="mr-2.5 size-4 shrink-0" />
          <span>Get the iOS app</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground">
          <Share2 className="mr-2.5 size-4 shrink-0" />
          <span>Become an affiliate</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground">
          <HeartHandshake className="mr-2.5 size-4 shrink-0" />
          <span>Leave a testimonial</span>
        </DropdownMenuItem>
      </div>

      <DropdownMenuSeparator className="my-1 bg-border" />

      <div className="space-y-0.5">
        <DropdownMenuItem className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground">
          <UserPlus className="mr-2.5 size-4 shrink-0" />
          <span>Add another account</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground">
          <HelpCircle className="mr-2.5 size-4 shrink-0" />
          <span>Help & support</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/vi/login")}
          className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground"
        >
          <LogOut className="mr-2.5 size-4 shrink-0" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </div>
    </DropdownMenuContent>
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
              <span className="flex size-7 items-center justify-center rounded-full border border-primary-border bg-primary-muted text-xs font-bold text-primary-text">
                K
              </span>
            </button>
          </DropdownMenuTrigger>
          {renderDropdownMenuContent()}
        </DropdownMenu>

        <ThemeMenu collapsed />

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
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-primary-border bg-primary-muted text-xs font-bold text-primary-text">
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
        <ThemeMenu />

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
