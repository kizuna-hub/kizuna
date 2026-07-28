"use client";

import React from "react";
import {
  FileCheck2,
  FileUp,
  LockKeyhole,
  RefreshCw,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { validateStartupDocument } from "../services/document-validation";
import type {
  StartupDocumentInput,
  StartupDocumentRole,
} from "../types/venture-analysis.types";

const roleCopy: Record<
  StartupDocumentRole,
  { label: string; description: string }
> = {
  pitch_deck: {
    label: "Pitch Deck",
    description:
      "Problem, solution, người dùng, prototype và traction.",
  },
  business_plan: {
    label: "Business Plan",
    description:
      "Kế hoạch vận hành, mô hình và tín hiệu pilot.",
  },
};

function formatFileSize(size: number) {
  if (size < 1_000_000) {
    return `${Math.max(1, Math.round(size / 1_000))} KB`;
  }
  return `${(size / 1_000_000).toFixed(1)} MB`;
}

export function DocumentUploadForm({
  ventureName,
  documents,
  analyzing,
  onVentureNameChange,
  onDocumentsChange,
  onAnalyze,
}: {
  ventureName: string;
  documents: StartupDocumentInput[];
  analyzing: boolean;
  onVentureNameChange: (value: string) => void;
  onDocumentsChange: (
    documents: StartupDocumentInput[],
  ) => void;
  onAnalyze: () => void;
}) {
  const [errors, setErrors] = React.useState<
    Partial<Record<StartupDocumentRole, string>>
  >({});

  const selectFile = (
    role: StartupDocumentRole,
    file?: File,
  ) => {
    if (!file) return;
    const result = validateStartupDocument(
      file,
      role,
      documents,
    );
    if (!result.ok) {
      setErrors((current) => ({
        ...current,
        [role]: result.message,
      }));
      return;
    }
    setErrors((current) => ({
      ...current,
      [role]: undefined,
    }));
    onDocumentsChange([
      ...documents.filter(
        (document) => document.role !== role,
      ),
      result.document,
    ]);
  };

  return (
    <section
      aria-labelledby="document-upload-heading"
      className="rounded-xl border border-workspace-border bg-workspace-panel p-4 sm:p-5"
    >
      <div className="max-w-2xl">
        <h2
          id="document-upload-heading"
          className="workspace-section-title text-ink"
        >
          Tải tài liệu startup
        </h2>
        <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
          Chọn ít nhất một tài liệu. Kizuna sẽ dùng metadata và
          kết quả mô phỏng để tạo context ban đầu.
        </p>
        <p className="mt-1 workspace-meta text-workspace-muted-text">
          Hỗ trợ PDF, PPTX, DOCX · Tối đa 2 tài liệu trong live
          demo.
        </p>
      </div>

      <label className="mt-5 block max-w-2xl">
        <span className="workspace-supporting font-medium text-ink">
          Tên venture{" "}
          <span className="font-normal text-workspace-muted-text">
            · tùy chọn
          </span>
        </span>
        <Input
          value={ventureName}
          maxLength={80}
          onChange={(event) =>
            onVentureNameChange(event.target.value)
          }
          placeholder="Để trống để Kizuna nhận diện từ tài liệu"
          className="mt-2 h-11 border-workspace-border bg-workspace-elevated"
        />
      </label>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {(
          ["pitch_deck", "business_plan"] as const
        ).map((role) => {
          const selected = documents.find(
            (document) => document.role === role,
          );
          const errorId = `${role}-file-error`;
          return (
            <div
              key={role}
              className={cn(
                "rounded-xl border bg-workspace-elevated p-4",
                errors[role]
                  ? "border-workspace-danger/50"
                  : selected
                    ? "border-primary-border"
                    : "border-workspace-border",
              )}
            >
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-workspace-border bg-workspace-panel text-primary">
                  {selected ? (
                    <FileCheck2 className="size-5" />
                  ) : (
                    <FileUp className="size-5" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="workspace-card-title text-ink">
                    {roleCopy[role].label}
                  </h3>
                  <p className="mt-1 workspace-meta text-workspace-muted-text">
                    {roleCopy[role].description}
                  </p>
                </div>
              </div>

              {selected ? (
                <div className="mt-4 rounded-lg border border-workspace-border bg-workspace-panel p-3">
                  <p className="truncate workspace-supporting font-medium text-ink">
                    {selected.name}
                  </p>
                  <p className="mt-1 workspace-meta uppercase text-workspace-muted-text">
                    {selected.extension} ·{" "}
                    {formatFileSize(selected.size)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <label className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-md px-2.5 workspace-meta font-medium text-workspace-muted-text transition-colors hover:bg-workspace-row-hover hover:text-ink focus-within:ring-2 focus-within:ring-workspace-focus-ring/50">
                      <RefreshCw className="size-3.5" />
                      Thay file
                      <input
                        type="file"
                        accept=".pdf,.pptx,.docx"
                        className="sr-only"
                        aria-describedby={
                          errors[role] ? errorId : undefined
                        }
                        onChange={(event) => {
                          selectFile(
                            role,
                            event.target.files?.[0],
                          );
                          event.target.value = "";
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        onDocumentsChange(
                          documents.filter(
                            (document) =>
                              document.role !== role,
                          ),
                        )
                      }
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-md px-2.5 workspace-meta font-medium text-workspace-muted-text transition-colors hover:bg-workspace-danger-soft hover:text-workspace-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/50"
                      aria-label={`Bỏ ${selected.name}`}
                    >
                      <Trash2 className="size-3.5" />
                      Bỏ file
                    </button>
                  </div>
                </div>
              ) : (
                <label className="mt-4 flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-workspace-border bg-workspace-panel px-4 text-center transition-colors hover:border-primary-border hover:bg-workspace-row-hover focus-within:ring-2 focus-within:ring-workspace-focus-ring/50">
                  <FileUp className="size-5 text-primary" />
                  <span className="mt-2 workspace-supporting font-medium text-ink">
                    Chọn file
                  </span>
                  <span className="mt-1 workspace-meta text-workspace-muted-text">
                    PDF, PPTX hoặc DOCX
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.pptx,.docx"
                    className="sr-only"
                    aria-label={`Chọn ${roleCopy[role].label}`}
                    aria-describedby={
                      errors[role] ? errorId : undefined
                    }
                    onChange={(event) => {
                      selectFile(
                        role,
                        event.target.files?.[0],
                      );
                      event.target.value = "";
                    }}
                  />
                </label>
              )}

              {errors[role] ? (
                <p
                  id={errorId}
                  role="alert"
                  className="mt-3 workspace-meta text-workspace-danger"
                >
                  {errors[role]}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-4 border-t border-workspace-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex max-w-xl items-start gap-2 text-workspace-muted-text">
          <LockKeyhole className="mt-0.5 size-3.5 shrink-0" />
          <p className="workspace-meta">
            Đây là flow demo. Tài liệu được xử lý cục bộ và
            không được tải lên backend.
          </p>
        </div>
        <Button
          type="button"
          onClick={onAnalyze}
          disabled={documents.length === 0 || analyzing}
          aria-busy={analyzing}
          className="h-11 shrink-0 px-5 workspace-control-text"
        >
          {analyzing
            ? "Đang chuẩn bị phân tích…"
            : "Tải lên và phân tích"}
          <FileUp className="size-4" />
        </Button>
      </div>
    </section>
  );
}
