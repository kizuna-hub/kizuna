"use client";

import {
  AlertTriangle,
  ChevronDown,
  FileText,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

import { mentorContextLabels } from "../state/mentor-connection-selectors";
import type {
  MentorConnectionBrief,
  MentorShareableContext,
} from "../types/mentor-connection.types";

const contextItems: Array<{
  id: MentorShareableContext;
  description: string;
  required?: boolean;
}> = [
  {
    id: "venture_summary",
    description: "CampusFlow và giá trị cốt lõi",
    required: true,
  },
  {
    id: "venture_stage",
    description: "Prototype · 3 student founders",
  },
  {
    id: "current_focus",
    description: "Chuyển pilot interest thành pilot có phạm vi",
    required: true,
  },
  {
    id: "readiness_overview",
    description: "65/100 · Không gửi toàn bộ rubric",
  },
  {
    id: "active_decision_cycle",
    description: "Chỉ gửi mục tiêu và outcome liên quan",
  },
];

export function MentorSharedContext({
  brief,
  expanded,
  onExpandedChange,
  onToggleContext,
  onToggleEvidence,
  onToggleDocument,
}: {
  brief: MentorConnectionBrief;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  onToggleContext: (context: MentorShareableContext) => void;
  onToggleEvidence: (evidenceId: string) => void;
  onToggleDocument: (documentId: string) => void;
}) {
  const selectedCount = brief.selectedContext.length;

  return (
    <Collapsible
      open={expanded}
      onOpenChange={onExpandedChange}
      className="rounded-xl border border-workspace-border bg-workspace-elevated"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/50">
        <div>
          <p className="workspace-card-title text-ink">
            Context gửi kèm
          </p>
          <p className="mt-0.5 workspace-meta text-workspace-muted-text">
            {selectedCount} mục được chọn · Không bao gồm raw chat
          </p>
        </div>
        <span className="flex items-center gap-2 workspace-meta font-medium text-primary">
          Quản lý context
          <ChevronDown
            className={cn(
              "size-4 transition-transform motion-reduce:transition-none",
              expanded && "rotate-180",
            )}
          />
        </span>
      </CollapsibleTrigger>

      <CollapsibleContent className="border-t border-workspace-border">
        <div className="space-y-4 p-4">
          <fieldset>
            <legend className="workspace-eyebrow text-workspace-muted-text">
              Context canonical
            </legend>
            <div className="mt-2 divide-y divide-workspace-border">
              {contextItems.map((item) => {
                const checked =
                  brief.selectedContext.includes(item.id);
                return (
                  <label
                    key={item.id}
                    className="flex cursor-pointer items-start gap-3 py-2.5"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() =>
                        onToggleContext(item.id)
                      }
                      aria-label={mentorContextLabels[item.id]}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 workspace-supporting font-medium text-ink">
                        {mentorContextLabels[item.id]}
                        {item.required ? (
                          <Badge
                            variant="outline"
                            className="border-workspace-border workspace-eyebrow text-workspace-muted-text"
                          >
                            Bắt buộc
                          </Badge>
                        ) : null}
                      </span>
                      <span className="mt-0.5 block workspace-meta text-workspace-muted-text">
                        {item.description}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="workspace-eyebrow text-workspace-muted-text">
              Tài liệu
            </legend>
            <div className="mt-2 space-y-2">
              {brief.documents.map((document) => {
                const checked =
                  brief.selectedDocumentIds.includes(document.id);
                const unavailable =
                  document.availability === "unavailable";
                return (
                  <label
                    key={document.id}
                    className="flex items-start gap-3 rounded-lg border border-workspace-border bg-workspace-panel p-3"
                  >
                    <Checkbox
                      checked={checked}
                      disabled={unavailable}
                      onCheckedChange={() =>
                        onToggleDocument(document.id)
                      }
                      aria-label={`Chia sẻ ${document.name}`}
                    />
                    <FileText className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="min-w-0">
                      <span className="block workspace-supporting font-medium text-ink">
                        {document.name}
                      </span>
                      <span className="mt-0.5 block workspace-meta text-workspace-muted-text">
                        {document.detail} · Cập nhật gần đây
                      </span>
                      {unavailable ? (
                        <span className="mt-1 flex items-center gap-1 workspace-meta text-workspace-warning">
                          <AlertTriangle className="size-3" />
                          Tài liệu không còn khả dụng
                        </span>
                      ) : null}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="workspace-eyebrow text-workspace-muted-text">
              Evidence quan trọng
            </legend>
            <p className="mt-1 workspace-meta text-workspace-muted-text">
              Chọn từng evidence. Evidence đang tranh luận không được
              gửi như dữ kiện đã xác minh.
            </p>
            <div className="mt-2 space-y-2">
              {brief.evidence.map((evidence) => {
                const checked =
                  brief.selectedEvidenceIds.includes(evidence.id);
                const blocked =
                  evidence.status === "disputed" ||
                  evidence.status === "unavailable";
                return (
                  <label
                    key={evidence.id}
                    className="flex items-start gap-3 rounded-lg border border-workspace-border bg-workspace-panel p-3"
                  >
                    <Checkbox
                      checked={checked}
                      disabled={blocked}
                      onCheckedChange={() =>
                        onToggleEvidence(evidence.id)
                      }
                      aria-label={`Chia sẻ ${evidence.label}`}
                    />
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-workspace-success" />
                    <span className="min-w-0">
                      <span className="block workspace-supporting font-medium text-ink">
                        {evidence.label}
                      </span>
                      <span className="mt-0.5 block workspace-meta text-workspace-muted-text">
                        {evidence.detail}
                      </span>
                      <span className="mt-1 block workspace-meta text-primary">
                        {evidence.sourceLabel}
                      </span>
                      {evidence.status === "disputed" ? (
                        <span className="mt-1 block workspace-meta text-workspace-warning">
                          Evidence này đang được xem xét
                        </span>
                      ) : null}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
