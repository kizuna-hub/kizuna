import {
  FileText,
  ScanSearch,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";

import type {
  StartupDocumentInput,
  VentureSignalPreview,
} from "../types/venture-analysis.types";

function formatFileSize(size: number) {
  return size >= 1_000_000
    ? `${(size / 1_000_000).toFixed(1)} MB`
    : `${Math.max(1, Math.round(size / 1_000))} KB`;
}

export function AnalysisSignalPreview({
  ventureName,
  documents,
  signals,
  completed,
}: {
  ventureName: string;
  documents: StartupDocumentInput[];
  signals: VentureSignalPreview[];
  completed: boolean;
}) {
  return (
    <aside className="flex min-h-[460px] flex-col rounded-xl border border-workspace-border bg-workspace-elevated p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-primary-border bg-primary-soft text-primary">
          <ScanSearch className="size-5" />
        </span>
        <div>
          <p className="workspace-eyebrow text-primary">
            Tài liệu đang phân tích
          </p>
          <h2 className="mt-1 workspace-section-title text-ink">
            {ventureName || "CampusFlow"}
          </h2>
        </div>
      </div>

      <ul className="mt-5 space-y-2">
        {documents.map((document) => (
          <li
            key={document.id}
            className="flex items-center gap-3 rounded-lg border border-workspace-border bg-workspace-panel px-3 py-2.5"
          >
            <FileText className="size-4 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="truncate workspace-supporting font-medium text-ink">
                {document.name}
              </p>
              <p className="workspace-meta uppercase text-workspace-muted-text">
                {document.extension} ·{" "}
                {formatFileSize(document.size)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-5 border-t border-workspace-border pt-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <h3 className="workspace-card-title text-ink">
            Tín hiệu ban đầu
          </h3>
        </div>

        {signals.length ? (
          <dl className="mt-3 space-y-2">
            {signals.map((signal) => (
              <div
                key={signal.id}
                className="animate-in fade-in slide-in-from-bottom-1 rounded-lg border border-workspace-border bg-workspace-panel px-3 py-2.5 duration-200 motion-reduce:animate-none"
              >
                <dt className="workspace-eyebrow text-workspace-muted-text">
                  {signal.label}
                </dt>
                <dd
                  className={cn(
                    "mt-1 workspace-supporting text-ink",
                    signal.id === "signal-gap" &&
                      "font-medium",
                  )}
                >
                  {signal.value}
                </dd>
                {signal.sourceLabel ? (
                  <dd className="mt-1 workspace-meta text-workspace-muted-text">
                    {signal.sourceLabel}
                  </dd>
                ) : null}
              </div>
            ))}
          </dl>
        ) : (
          <div
            role="status"
            className="mt-3 rounded-lg border border-dashed border-workspace-border px-3 py-6 text-center workspace-meta text-workspace-muted-text"
          >
            {completed
              ? "Không có tín hiệu mới."
              : "Tín hiệu sẽ xuất hiện khi Kizuna đọc xong venture context."}
          </div>
        )}
      </div>
    </aside>
  );
}
