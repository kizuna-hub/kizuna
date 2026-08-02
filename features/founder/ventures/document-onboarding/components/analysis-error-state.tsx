import {
  AlertTriangle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type {
  StartupDocumentOutcome,
  VentureAnalysisError,
} from "../types/venture-analysis.types";

export function AnalysisErrorState({
  error,
  outcomes,
  onRetry,
  onReplaceFiles,
  onContinuePartial,
  onContinueConversation,
}: {
  error: VentureAnalysisError;
  outcomes: StartupDocumentOutcome[];
  onRetry: () => void;
  onReplaceFiles: () => void;
  onContinuePartial?: () => void;
  onContinueConversation: () => void;
}) {
  const partial =
    error.code === "partial_file_failure";
  return (
    <section
      role="alert"
      className="rounded-xl border border-workspace-danger/35 bg-workspace-danger-soft p-4 sm:p-5"
    >
      <AlertTriangle className="size-5 text-workspace-danger" />
      <h2 className="mt-3 workspace-section-title text-ink">
        {partial
          ? "Một tài liệu cần được thay thế"
          : "Kizuna chưa thể hoàn tất phân tích tài liệu"}
      </h2>
      <p className="mt-2 workspace-supporting text-workspace-muted-text">
        {error.message}
      </p>

      {outcomes.length ? (
        <ul className="mt-4 space-y-2">
          {outcomes.map((outcome) => (
            <li
              key={outcome.document.id}
              className="rounded-lg border border-workspace-border bg-workspace-panel px-3 py-2.5 workspace-meta text-ink"
            >
              <span className="font-medium">
                {outcome.document.name}
              </span>
              {" · "}
              {outcome.status === "failed"
                ? "Chưa đọc được"
                : "Sẵn sàng tiếp tục"}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {partial && onContinuePartial ? (
          <Button type="button" onClick={onContinuePartial}>
            Tiếp tục phân tích
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button type="button" onClick={onRetry}>
            <RefreshCw className="size-4" />
            Thử lại
          </Button>
        )}
        <Button
          type="button"
          variant="secondary"
          onClick={onReplaceFiles}
        >
          Thay file
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onContinueConversation}
        >
          Tiếp tục bằng hội thoại
        </Button>
      </div>
    </section>
  );
}
