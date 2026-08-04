"use client";

import { ArrowLeft, PanelRightOpen, Pin, PinOff } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { ConversationSession } from "../../types/long-run-workspace.types";
import {
  formatConversationSessionTime,
  getConversationMentorNames,
} from "../services/conversation-session-selector";

export function ConversationSessionHeader({
  session,
  panelOpen,
  onBack,
  onTogglePin,
  onOpenContext,
}: {
  session: ConversationSession;
  panelOpen: boolean;
  onBack: () => void;
  onTogglePin: () => void;
  onOpenContext: () => void;
}) {
  const mentors = getConversationMentorNames(session);
  const sourceCount = session.sourceIds?.length ?? 0;

  return (
    <header className="border-b border-workspace-border px-4 py-3 sm:px-5">
      <div className="mx-auto flex w-full max-w-4xl items-start gap-3">
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          className="mt-0.5 shrink-0"
          onClick={onBack}
          aria-label="Quay lại Lịch sử trao đổi"
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="min-w-0 flex-1">
          <p className="truncate workspace-card-title text-ink">
            {session.title}
          </p>
          <p className="mt-0.5 truncate workspace-meta text-workspace-muted-text">
            {session.contextSnapshot?.ventureName ?? "CampusFlow"} ·{" "}
            {mentors.join(", ") || "Kizuna"}
          </p>
          <p className="workspace-meta text-workspace-muted-text">
            Cập nhật {formatConversationSessionTime(session.updatedAt)} ·{" "}
            {sourceCount} nguồn
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {!panelOpen ? (
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={onOpenContext}
              aria-label="Mở ngữ cảnh cuộc trao đổi"
            >
              <PanelRightOpen className="size-4" />
            </Button>
          ) : null}
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={onTogglePin}
            aria-label={session.isPinned ? "Bỏ ghim" : "Ghim"}
            aria-pressed={session.isPinned}
          >
            {session.isPinned ? (
              <PinOff className="size-4" />
            ) : (
              <Pin className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
