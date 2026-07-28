"use client";

import {
  ArrowLeftRight,
  BookOpenCheck,
  ChartNoAxesCombined,
  PanelRightDashed,
  Plus,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import type { SecondaryPaneMode } from "../../types/workspace-layout.types";

const actions = [
  {
    id: "analysis",
    label: "Phân tích",
    tooltip: "Mở phân tích venture và mức độ sẵn sàng",
    icon: ChartNoAxesCombined,
  },
  {
    id: "evidence",
    label: "Bằng chứng",
    tooltip: "Xem bằng chứng theo tài liệu hoặc tiêu chí",
    icon: BookOpenCheck,
  },
  {
    id: "new_chat",
    label: "Chat mới",
    tooltip: "Tạo cuộc trò chuyện chính mới",
    icon: Plus,
  },
  {
    id: "panel_chat",
    label: "Chat song song",
    tooltip: "Mở một cuộc trò chuyện độc lập bên cạnh",
    icon: PanelRightDashed,
  },
] as const;

export function WorkspaceActionBar({
  activeMode,
  onAnalysis,
  onEvidence,
  onNewChat,
  onSplitChat,
  showSwap = false,
  showClose = false,
  onSwap,
  onClose,
}: {
  activeMode: SecondaryPaneMode;
  onAnalysis: () => void;
  onEvidence: () => void;
  onNewChat: () => void;
  onSplitChat: () => void;
  showSwap?: boolean;
  showClose?: boolean;
  onSwap?: () => void;
  onClose?: () => void;
}) {
  const handlers = {
    analysis: onAnalysis,
    evidence: onEvidence,
    new_chat: onNewChat,
    panel_chat: onSplitChat,
  };

  return (
    <nav
      aria-label="Công cụ workspace"
      className="flex items-center gap-px"
    >
      {actions.map((action) => {
        const active =
          action.id !== "new_chat" &&
          activeMode === action.id;
        return (
          <WorkspaceActionButton
            key={action.id}
            icon={action.icon}
            label={action.label}
            tooltip={action.tooltip}
            active={active}
            onClick={handlers[action.id]}
          />
        );
      })}
      {showSwap && onSwap ? (
        <WorkspaceActionButton
          icon={ArrowLeftRight}
          label="Đổi vị trí hai panel"
          tooltip="Đổi vị trí hai panel"
          onClick={onSwap}
        />
      ) : null}
      {showClose && onClose ? (
        <WorkspaceActionButton
          icon={X}
          label="Đóng panel phụ"
          tooltip="Đóng panel phụ"
          onClick={onClose}
        />
      ) : null}
    </nav>
  );
}

function WorkspaceActionButton({
  icon: Icon,
  label,
  tooltip,
  active = false,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  tooltip: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          aria-label={label}
          aria-pressed={active || undefined}
          className={cn(
            "inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-workspace-muted-text transition-colors hover:bg-surface-2 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/50 motion-reduce:transition-none",
            active && "bg-workspace-selected text-primary",
          )}
        >
          <Icon className="size-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        sideOffset={6}
        className="border border-hairline bg-surface-2 text-ink shadow-framer-edge [&_svg]:bg-surface-2 [&_svg]:fill-surface-2"
      >
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}
