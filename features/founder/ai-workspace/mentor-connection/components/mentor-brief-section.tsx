"use client";

import { Check, ChevronDown, Pencil, Plus, Trash2 } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";

import type {
  MentorConnectionBriefSection,
  MentorConnectionSource,
} from "../types/mentor-connection.types";

const generationLabels = {
  verified_context: "Dựa trên context đã xác nhận",
  ai_inferred: "AI đề xuất · Cần bạn kiểm tra",
  founder_edited: "Founder đã chỉnh sửa",
};

export function MentorBriefSection({
  section,
  sources,
  editing,
  editDisabled,
  onEdit,
  onCancel,
  onSave,
}: {
  section: MentorConnectionBriefSection;
  sources: MentorConnectionSource[];
  editing: boolean;
  editDisabled: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (
    content: string,
    checklistItems?: string[],
  ) => void;
}) {
  const [content, setContent] = React.useState(section.content);
  const [items, setItems] = React.useState(
    section.checklistItems ?? [],
  );
  const editingRef = React.useRef(editing);
  const contentRef = React.useRef(content);
  const itemsRef = React.useRef(items);
  const onSaveRef = React.useRef(onSave);

  editingRef.current = editing;
  contentRef.current = content;
  itemsRef.current = items;
  onSaveRef.current = onSave;

  React.useEffect(
    () => () => {
      if (!editingRef.current) return;
      const normalizedContent = contentRef.current.trim();
      const normalizedItems = itemsRef.current
        .map((item) => item.trim())
        .filter(Boolean);
      if (
        normalizedContent &&
        (section.id !== "support_needed" ||
          normalizedItems.length > 0)
      ) {
        onSaveRef.current(
          normalizedContent,
          section.id === "support_needed"
            ? normalizedItems
            : undefined,
        );
      }
    },
    [section.id],
  );

  React.useEffect(() => {
    if (!editing) {
      setContent(section.content);
      setItems(section.checklistItems ?? []);
    }
  }, [editing, section]);

  const sectionSources = sources.filter((source) =>
    section.sourceIds.includes(source.id),
  );

  return (
    <section className="border-b border-workspace-border py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="workspace-card-title text-ink">
            {section.title}
          </h3>
          <Badge
            variant="outline"
            className="mt-1.5 border-workspace-border bg-workspace-elevated workspace-eyebrow text-workspace-muted-text"
          >
            {generationLabels[section.generationStatus]}
          </Badge>
        </div>
        {!editing ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onEdit}
            disabled={editDisabled}
          >
            <Pencil className="size-3.5" />
            Chỉnh sửa
          </Button>
        ) : null}
      </div>

      {editing ? (
        <div className="mt-3 space-y-3">
          {section.id === "support_needed" ? (
            <>
              <Textarea
                value={content}
                onChange={(event) =>
                  setContent(event.target.value)
                }
                aria-label={`Mô tả ${section.title}`}
                className="min-h-20 resize-y border-workspace-border bg-workspace-elevated workspace-supporting"
              />
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div
                    key={`${section.id}-${index}`}
                    className="flex items-start gap-2"
                  >
                    <Textarea
                      value={item}
                      onChange={(event) =>
                        setItems((current) =>
                          current.map((value, itemIndex) =>
                            itemIndex === index
                              ? event.target.value
                              : value,
                          ),
                        )
                      }
                      aria-label={`Mục hỗ trợ ${index + 1}`}
                      className="min-h-10 resize-y border-workspace-border bg-workspace-elevated workspace-supporting"
                    />
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      onClick={() =>
                        setItems((current) =>
                          current.filter(
                            (_, itemIndex) =>
                              itemIndex !== index,
                          ),
                        )
                      }
                      aria-label={`Xóa mục hỗ trợ ${index + 1}`}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setItems((current) => [...current, ""])
                  }
                >
                  <Plus className="size-3.5" />
                  Thêm mục
                </Button>
              </div>
            </>
          ) : (
            <Textarea
              value={content}
              onChange={(event) =>
                setContent(event.target.value)
              }
              aria-label={section.title}
              className="min-h-28 resize-y border-workspace-border bg-workspace-elevated workspace-supporting"
            />
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              onClick={() =>
                onSave(
                  content.trim(),
                  section.id === "support_needed"
                    ? items
                        .map((item) => item.trim())
                        .filter(Boolean)
                    : undefined,
                )
              }
              disabled={
                !content.trim() ||
                (section.id === "support_needed" &&
                  !items.some((item) => item.trim()))
              }
            >
              <Check className="size-3.5" />
              Lưu thay đổi
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={onCancel}
            >
              Hủy
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-3">
          <p className="whitespace-pre-wrap workspace-supporting text-ink">
            {section.content}
          </p>
          {section.checklistItems?.length ? (
            <ul className="mt-2.5 space-y-2">
              {section.checklistItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 workspace-supporting text-ink"
                >
                  <Check className="mt-0.5 size-3.5 shrink-0 text-workspace-success" />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )}

      {sectionSources.length ? (
        <Collapsible className="mt-3">
          <CollapsibleTrigger className="group inline-flex items-center gap-1 workspace-meta text-workspace-muted-text hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/50">
            Dựa trên {sectionSources.length} nguồn · Cập nhật gần đây
            <ChevronDown className="size-3 transition-transform group-data-[state=open]:rotate-180 motion-reduce:transition-none" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="mt-2 space-y-1.5 border-l border-workspace-border pl-3">
              {sectionSources.map((source) => (
                <li key={source.id}>
                  <p className="workspace-meta font-medium text-ink">
                    {source.label}
                  </p>
                  {source.detail ? (
                    <p className="workspace-meta text-workspace-muted-text">
                      {source.detail}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      ) : null}
    </section>
  );
}
