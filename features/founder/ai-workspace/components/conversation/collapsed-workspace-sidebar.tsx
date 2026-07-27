import {
  ArrowLeft,
  BrainCircuit,
  FileText,
  MessageSquarePlus,
  Network,
  PanelLeftOpen,
  Search,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@/i18n/routing";

import type { AiWorkspaceCopy } from "../../copy/types";

function SidebarIconButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="size-9"
          aria-label={label}
          onClick={onClick}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

export function CollapsedWorkspaceSidebar({
  user,
  copy,
  onNavigate,
  onCreateConversation,
  onOpenSearch,
  onOpenSurface,
  onToggleCollapsed,
}: {
  user: { name: string; avatarUrl?: string };
  copy: AiWorkspaceCopy["longRun"];
  onNavigate?: () => void;
  onCreateConversation: () => void;
  onOpenSearch: () => void;
  onOpenSurface: (
    surface: "memory" | "documents" | "pinned",
  ) => void;
  onToggleCollapsed?: () => void;
}) {
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
              aria-label={copy.sidebar.backToProjects}
              onClick={onNavigate}
            >
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          {copy.sidebar.backToProjects}
        </TooltipContent>
      </Tooltip>
      <div className="mt-2 flex flex-1 flex-col items-center gap-1">
        <SidebarIconButton
          label={copy.sidebar.newConversation}
          icon={<MessageSquarePlus className="size-4" />}
          onClick={onCreateConversation}
        />
        <SidebarIconButton
          label={copy.sidebar.searchVenture}
          icon={<Search className="size-4" />}
          onClick={onOpenSearch}
        />
        <SidebarIconButton
          label={copy.conversation.memory}
          icon={<BrainCircuit className="size-4" />}
          onClick={() => onOpenSurface("memory")}
        />
        <SidebarIconButton
          label={copy.sidebar.materials}
          icon={<FileText className="size-4" />}
          onClick={() => onOpenSurface("documents")}
        />
        <SidebarIconButton
          label={copy.sidebar.network}
          icon={<Network className="size-4" />}
          onClick={() => onOpenSurface("pinned")}
        />
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar className="mt-2 size-7 border border-workspace-border">
            <AvatarImage src={user.avatarUrl} alt="" />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent side="right">{user.name}</TooltipContent>
      </Tooltip>
    </div>
  );
}
