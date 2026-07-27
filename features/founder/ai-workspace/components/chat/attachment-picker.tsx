"use client";

import React from "react";
import {
  FilePlus2,
  FileText,
  LoaderCircle,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { AiWorkspaceCopy } from "../../copy/types";
import { sampleMaterials } from "../../demo/demo-scenarios";
import type { MockAttachment } from "../../types/ai-workspace.types";

const acceptedTypes =
  ".pdf,.docx,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation";

function formatFileSize(size: number) {
  const megabytes = size / 1_000_000;
  return `${new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 1,
  }).format(megabytes)} MB`;
}

export function AttachmentPicker({
  open,
  attachments,
  copy,
  onSelectSample,
  onSelectFiles,
  onRemove,
}: {
  open: boolean;
  attachments: MockAttachment[];
  copy: AiWorkspaceCopy["chat"];
  onSelectSample: (sampleId: string) => void;
  onSelectFiles: (files: FileList | null) => void;
  onRemove: (attachmentId: string) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      {open ? (
        <section
          className="rounded-xl border border-workspace-border bg-workspace-elevated p-3 animate-in fade-in slide-in-from-bottom-1 duration-150 motion-reduce:animate-none"
          aria-label={copy.attachmentMenuLabel}
        >
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => inputRef.current?.click()}
              disabled={attachments.length >= 3}
            >
              <FilePlus2 className="size-3.5" />
              {copy.attach}
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept={acceptedTypes}
              multiple
              disabled={attachments.length >= 3}
              className="sr-only"
              aria-label={copy.attach}
              onChange={(event) => {
                onSelectFiles(event.currentTarget.files);
                event.currentTarget.value = "";
              }}
            />
            <span className="workspace-meta text-workspace-muted-text">
              {copy.attachmentLimit}
            </span>
          </div>
          <p className="mb-1.5 mt-3 workspace-eyebrow text-workspace-muted-text">
            {copy.sampleMaterials}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {sampleMaterials.map((material) => (
              <button
                key={material.id}
                type="button"
                onClick={() => onSelectSample(material.id)}
                disabled={
                  attachments.length >= 3 ||
                  attachments.some(
                    (attachment) =>
                      attachment.id === material.id,
                  )
                }
                className="max-w-full truncate rounded-md border border-workspace-border bg-workspace-panel px-2.5 py-1.5 workspace-meta text-ink transition-colors hover:border-primary-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40 disabled:pointer-events-none disabled:opacity-40"
              >
                {material.name}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {attachments.length > 0 ? (
        <div
          className="flex gap-1.5 overflow-x-auto no-scrollbar"
          aria-label={copy.selectedMaterials}
        >
          {attachments.map((attachment) => (
            <span
              key={attachment.id}
              className="inline-flex max-w-[240px] shrink-0 items-center gap-1.5 rounded-md border border-workspace-border bg-workspace-elevated py-1 pl-2 pr-1 workspace-meta text-ink"
            >
              {attachment.status === "processing" ? (
                <LoaderCircle className="size-3.5 animate-spin text-primary motion-reduce:animate-none" />
              ) : (
                <FileText className="size-3.5 text-primary" />
              )}
              <span className="min-w-0 truncate">
                {attachment.name}
              </span>
              <span className="text-workspace-muted-text">
                {formatFileSize(attachment.size)}
              </span>
              <button
                type="button"
                onClick={() => onRemove(attachment.id)}
                aria-label={`${copy.removeAttachment}: ${attachment.name}`}
                className="flex size-7 items-center justify-center rounded-md text-workspace-muted-text hover:bg-workspace-row-hover hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40"
              >
                <X className="size-3.5" />
              </button>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
