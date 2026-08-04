"use client";

import {
  ArrowLeft,
  BookOpen,
  Clock3,
  FileText,
  HeartHandshake,
  PanelLeftClose,
  Send,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { WorkspaceUserFooter } from "@/features/founder/shell/workspace-user-footer";
import {
  getCurrentUser,
  getVentureById,
  getVentureStageLabel,
} from "@/features/founder/venture-foundation/demo-repository";
import { useDemoWorkspace } from "@/features/founder/venture-foundation/demo-workspace-provider";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import type { AiWorkspaceCopy } from "../../copy/types";
import type { WorkspaceDestination } from "../../types/workspace-layout.types";
import { CollapsedWorkspaceSidebar } from "./collapsed-workspace-sidebar";

const baseVentureNavigation: Array<{
  destination: WorkspaceDestination;
  label: string;
  icon: typeof UsersRound;
}> = [
  {
    destination: "mentor_discovery",
    label: "Mentor phù hợp",
    icon: UsersRound,
  },
  {
    destination: "connection_requests",
    label: "Yêu cầu kết nối",
    icon: Send,
  },
];

const resourceNavigation: Array<{
  destination: WorkspaceDestination;
  label: string;
  icon: typeof UsersRound;
}> = [
  {
    destination: "venture_brief",
    label: "Venture Brief",
    icon: FileText,
  },
  {
    destination: "documents",
    label: "Tài liệu",
    icon: BookOpen,
  },
];

export function WorkspaceSidebar({
  ventureId,
  collapsed,
  destination,
  onNavigate,
  onToggleCollapsed,
  copy,
  onDestinationChange,
  hasAcceptedMentorConnection,
}: {
  ventureId: string;
  collapsed: boolean;
  destination: WorkspaceDestination;
  onNavigate?: () => void;
  onToggleCollapsed?: () => void;
  copy: AiWorkspaceCopy["longRun"];
  onDestinationChange: (
    destination: WorkspaceDestination,
  ) => void;
  hasAcceptedMentorConnection: boolean;
}) {
  const { state } = useDemoWorkspace();
  const user = getCurrentUser(state);
  const venture = getVentureById(state, ventureId);
  const ventureName = venture?.name ?? "CampusFlow";
  const stageLabel = venture
    ? getVentureStageLabel(venture)
    : "Prototype";
  const ventureNavigation = hasAcceptedMentorConnection
    ? [
        {
          destination: "mentorship_continuity" as const,
          label: "Đồng hành",
          icon: HeartHandshake,
        },
        ...baseVentureNavigation,
      ]
    : baseVentureNavigation;

  const selectDestination = (
    nextDestination: WorkspaceDestination,
  ) => {
    onDestinationChange(nextDestination);
    onNavigate?.();
  };

  if (collapsed) {
    return (
      <CollapsedWorkspaceSidebar
        user={user}
        copy={copy}
        destination={destination}
        onNavigate={onNavigate}
        onDestinationChange={selectDestination}
        onToggleCollapsed={onToggleCollapsed}
        hasAcceptedMentorConnection={hasAcceptedMentorConnection}
      />
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-workspace-sidebar lg:w-[248px]">
      <div className="flex items-center justify-between px-3 pb-2 pt-3">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg border border-primary-border bg-primary-soft font-heading text-sm font-semibold text-primary">
            K
          </span>
          <span className="font-heading text-sm font-semibold text-ink">
            Kizuna Hub
          </span>
        </div>
        {onToggleCollapsed ? (
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={onToggleCollapsed}
            aria-label={copy.sidebar.collapse}
          >
            <PanelLeftClose className="size-4" />
          </Button>
        ) : null}
      </div>

      <div className="px-2.5">
        <Button
          asChild
          type="button"
          variant="ghost"
          className="h-10 w-full justify-start rounded-lg px-2 workspace-control-text text-workspace-muted-text"
        >
          <Link href="/founder/projects" onClick={onNavigate}>
            <ArrowLeft className="size-4" />
            Quay lại Projects
          </Link>
        </Button>

        <div className="mt-2 rounded-xl border border-workspace-border bg-workspace-panel px-3 py-2.5">
          <p className="truncate workspace-card-title text-ink">
            {ventureName}
          </p>
          <p className="mt-0.5 workspace-meta text-workspace-muted-text">
            {stageLabel}
          </p>
        </div>
      </div>

      <nav
        aria-label="Điều hướng workspace CampusFlow"
        className="no-scrollbar mt-4 min-h-0 flex-1 overflow-y-auto px-2.5 pb-3"
      >
        <SidebarSection
          label="Không gian venture"
          items={ventureNavigation}
          destination={destination}
          onSelect={selectDestination}
        />
        <SidebarSection
          label="Tài nguyên"
          items={resourceNavigation}
          destination={destination}
          onSelect={selectDestination}
        />
        <SidebarSection
          label="Hỗ trợ"
          items={[
            {
              destination: "conversation_history",
              label: "Lịch sử trao đổi",
              icon: Clock3,
            },
          ]}
          destination={destination}
          onSelect={selectDestination}
        />
      </nav>

      <WorkspaceUserFooter
        user={user}
        roleLabel="Founder"
        collapsed={false}
      />
    </div>
  );
}

function SidebarSection({
  label,
  items,
  destination,
  onSelect,
}: {
  label: string;
  items: Array<{
    destination: WorkspaceDestination;
    label: string;
    icon: typeof UsersRound;
  }>;
  destination: WorkspaceDestination;
  onSelect: (destination: WorkspaceDestination) => void;
}) {
  return (
    <section className="mb-4">
      <h2 className="mb-1 px-2 workspace-eyebrow text-workspace-muted-text">
        {label}
      </h2>
      <div className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.destination === destination;
          return (
            <button
              key={item.destination}
              type="button"
              onClick={() => onSelect(item.destination)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-10 w-full items-center gap-2 rounded-lg px-2.5 text-left workspace-control-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/50 motion-reduce:transition-none",
                active
                  ? "bg-primary-soft text-primary"
                  : "text-workspace-muted-text hover:bg-workspace-row-hover hover:text-ink",
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
