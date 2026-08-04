import {
  ArrowLeft,
  BookOpen,
  Clock3,
  FileText,
  HeartHandshake,
  PanelLeftOpen,
  Send,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { WorkspaceUserFooter } from "@/features/founder/shell/workspace-user-footer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import type { AiWorkspaceCopy } from "../../copy/types";
import type { WorkspaceDestination } from "../../types/workspace-layout.types";

const destinationIcons: Array<{
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
  {
    destination: "conversation_history",
    label: "Lịch sử trao đổi",
    icon: Clock3,
  },
];

export function CollapsedWorkspaceSidebar({
  user,
  copy,
  destination,
  onNavigate,
  onDestinationChange,
  onToggleCollapsed,
  hasAcceptedMentorConnection,
}: {
  user: { name: string; avatarUrl?: string };
  copy: AiWorkspaceCopy["longRun"];
  destination: WorkspaceDestination;
  onNavigate?: () => void;
  onDestinationChange: (
    destination: WorkspaceDestination,
  ) => void;
  onToggleCollapsed?: () => void;
  hasAcceptedMentorConnection: boolean;
}) {
  const visibleDestinationIcons = hasAcceptedMentorConnection
    ? [
        {
          destination: "mentorship_continuity" as const,
          label: "Đồng hành",
          icon: HeartHandshake,
        },
        ...destinationIcons,
      ]
    : destinationIcons;
  return (
    <div className="flex h-full flex-col items-center bg-workspace-sidebar px-2 py-2.5">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="group relative mb-3 size-9 border border-primary-border bg-primary-soft text-primary hover:bg-workspace-row-hover hover:text-ink"
            aria-label={copy.sidebar.expand}
            onClick={() => onToggleCollapsed?.()}
          >
            <span className="font-heading text-sm font-semibold transition-opacity group-hover:opacity-0 group-focus-visible:opacity-0">
              K
            </span>
            <PanelLeftOpen className="absolute size-4 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          {copy.sidebar.expand}
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            asChild
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-9"
          >
            <Link
              href="/founder/projects"
              aria-label="Quay lại Projects"
              onClick={onNavigate}
            >
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          Quay lại Projects
        </TooltipContent>
      </Tooltip>

      <nav
        aria-label="Điều hướng workspace CampusFlow"
        className="mt-2 flex flex-1 flex-col items-center gap-1"
      >
        {visibleDestinationIcons.map((item) => {
          const Icon = item.icon;
          const active = item.destination === destination;
          return (
            <Tooltip key={item.destination}>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className={cn(
                    "size-9",
                    active && "bg-primary-soft text-primary",
                  )}
                  aria-label={item.label}
                  aria-current={active ? "page" : undefined}
                  onClick={() =>
                    onDestinationChange(item.destination)
                  }
                >
                  <Icon className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      <div className="w-full">
        <WorkspaceUserFooter
          user={user}
          roleLabel="Founder"
          collapsed
        />
      </div>
    </div>
  );
}
