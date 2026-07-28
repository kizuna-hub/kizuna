import {
  AlertTriangle,
  Pin,
  PinOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { AiWorkspaceCopy } from "../../copy/types";
import type {
  AiWorkspaceMessage,
  AiWorkspaceState,
} from "../../types/ai-workspace.types";
import type { ReadinessCriterionId } from "../../readiness/types/readiness.types";
import { AssistantResponseRenderer } from "../responses/assistant-response-renderer";
import { ResponseSourceFooter } from "../responses/response-source-footer";

function formatTime(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function highlightText(content: string, query: string) {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) return content;
  const escaped = normalizedQuery.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
  const parts = content.split(
    new RegExp(`(${escaped})`, "gi"),
  );
  return parts.map((part, index) =>
    part.toLocaleLowerCase("vi") ===
    normalizedQuery.toLocaleLowerCase("vi") ? (
      <mark
        key={`${part}-${index}`}
        className="rounded-sm bg-workspace-warning-soft px-0.5 text-ink"
      >
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

export function ChatMessage({
  message,
  state,
  copy,
  searchQuery,
  active,
  pinned,
  onTogglePin,
  onOpenCycle,
  onSendPrompt,
  onConfirmActionProposal,
  onRetry,
  onEditFailedMessage,
  onDeleteFailedMessage,
  onOpenMentor,
  onDeferMentor,
  onOpenArtifact,
  onOpenReadiness,
  onVerifyReadinessEvidence,
}: {
  message: AiWorkspaceMessage;
  state: AiWorkspaceState;
  copy: AiWorkspaceCopy;
  searchQuery: string;
  active: boolean;
  pinned: boolean;
  onTogglePin?: () => void;
  onOpenCycle: () => void;
  onSendPrompt: (prompt: string) => void;
  onConfirmActionProposal: (messageId: string) => void;
  onRetry: () => void;
  onEditFailedMessage?: () => void;
  onDeleteFailedMessage?: () => void;
  onOpenMentor: () => void;
  onDeferMentor: () => void;
  onOpenArtifact: (
    surface: "documents" | "timeline",
  ) => void;
  onOpenReadiness: (criterionId?: ReadinessCriterionId) => void;
  onVerifyReadinessEvidence: () => void;
}) {
  const founder = message.role === "founder";

  return (
    <article
      id={`message-${message.id}`}
      className={cn(
        "animate-in fade-in slide-in-from-bottom-1 duration-150 motion-reduce:animate-none",
        founder ? "ml-auto max-w-[85%]" : "max-w-full",
        active &&
          "rounded-xl ring-2 ring-workspace-focus-ring/50 ring-offset-2 ring-offset-workspace-background",
      )}
      aria-label={
        founder
          ? copy.chat.founderLabel
          : copy.chat.assistantLabel
      }
    >
      <div
        className={cn(
          "min-w-0",
          founder
            ? "rounded-xl rounded-tr-sm bg-workspace-elevated px-3.5 py-2.5"
            : "w-full",
        )}
      >
        {!founder && message.thinkingDurationSeconds ? (
          <p className="mb-2 flex items-center gap-1.5 workspace-meta font-medium text-workspace-muted-text">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-workspace-success"
            />
            {copy.chat.thoughtFor.replace(
              "{seconds}",
              String(message.thinkingDurationSeconds),
            )}
          </p>
        ) : null}
        <p className="whitespace-pre-wrap workspace-body text-ink">
          {highlightText(message.content, searchQuery)}
        </p>
        <div className="mt-1 flex items-center gap-1">
          <time
            dateTime={message.createdAt}
            className="workspace-meta text-workspace-muted-text"
          >
            {formatTime(message.createdAt)}
          </time>
          {onTogglePin ? (
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              className="size-7"
              onClick={onTogglePin}
              aria-label={
                pinned
                  ? copy.longRun.common.unpin
                  : copy.longRun.common.pin
              }
            >
              {pinned ? (
                <PinOff className="size-3" />
              ) : (
                <Pin className="size-3" />
              )}
            </Button>
          ) : null}
        </div>
      </div>

      {founder && message.status === "failed" ? (
        <div
          role="alert"
          className="mt-2 flex flex-wrap items-center justify-end gap-1 workspace-meta text-workspace-danger"
        >
          <span>{copy.chat.messageSendFailed}</span>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onRetry}
          >
            {copy.longRun.common.retry}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onEditFailedMessage}
          >
            {copy.longRun.common.edit}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onDeleteFailedMessage}
          >
            {copy.longRun.common.delete}
          </Button>
        </div>
      ) : null}

      {!founder &&
      message.status === "complete" &&
      message.responseKind !== "conversation" &&
      message.structuredResponse ? (
        <div className="mt-3">
          <AssistantResponseRenderer
            message={message}
            state={state}
            copy={copy}
            onOpenCycle={onOpenCycle}
            onSendPrompt={onSendPrompt}
            onConfirmActionProposal={
              onConfirmActionProposal
            }
            onOpenMentor={onOpenMentor}
            onDeferMentor={onDeferMentor}
            onOpenArtifact={onOpenArtifact}
            onOpenReadiness={onOpenReadiness}
            onVerifyReadinessEvidence={
              onVerifyReadinessEvidence
            }
          />
        </div>
      ) : null}

      {!founder &&
      message.status === "complete" &&
      (message.sources?.length ?? 0) > 0 ? (
        <div>
          <ResponseSourceFooter
            sources={message.sources ?? []}
            copy={copy}
          />
        </div>
      ) : null}

      {!founder && message.status === "incomplete" ? (
        <p className="mt-2 flex items-center gap-1.5 workspace-meta text-workspace-warning">
          <AlertTriangle className="size-3.5" />
          {copy.chat.incompleteResponse}
        </p>
      ) : null}
    </article>
  );
}
