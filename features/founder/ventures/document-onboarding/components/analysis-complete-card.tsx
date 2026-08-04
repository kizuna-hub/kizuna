import {
  ArrowRight,
  Check,
  FileSearch,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { VentureAnalysisResult } from "../types/venture-analysis.types";

export function AnalysisCompleteCard({
  result,
  enteringWorkspace,
  workspaceError,
  onEnterWorkspace,
  onReviewFiles,
  onReanalyze,
}: {
  result: VentureAnalysisResult;
  enteringWorkspace: boolean;
  workspaceError?: string;
  onEnterWorkspace: () => void;
  onReviewFiles: () => void;
  onReanalyze: () => void;
}) {
  const completion = result.mentorFirstCompletion;

  return (
    <section
      aria-labelledby="analysis-complete-heading"
      className="animate-in fade-in rounded-xl border border-primary-border bg-workspace-panel p-4 duration-200 motion-reduce:animate-none sm:p-5"
    >
      <span className="flex size-10 items-center justify-center rounded-full border border-workspace-success/40 bg-workspace-success-soft text-workspace-success">
        <Check className="size-5" />
      </span>
      <p className="sr-only" role="status" aria-live="polite">
        Phân tích hoàn tất. {completion.ventureName} đã sẵn sàng tìm
        mentor phù hợp.
      </p>
      <h2
        id="analysis-complete-heading"
        tabIndex={-1}
        className="mt-4 workspace-page-title text-ink focus:outline-none"
      >
        Đã sẵn sàng tìm mentor phù hợp
      </h2>
      <p className="mt-2 workspace-supporting text-workspace-muted-text">
        Kizuna đã đọc tài liệu của {completion.ventureName}, tạo
        Venture Brief và xác định nhu cầu hỗ trợ ở giai đoạn hiện tại.
      </p>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {[
          `Đọc ${result.sourceDocuments.length} tài liệu`,
          "Đã tạo Venture Brief",
          `Liên kết ${result.evidence.length} bằng chứng chính`,
          "Đã xác định nhu cầu hỗ trợ",
          "Đã chuẩn bị context matching mentor",
        ].map((item) => (
          <li
            key={item}
            className="flex items-center gap-2 rounded-lg border border-workspace-border bg-workspace-elevated px-3 py-2.5 workspace-meta text-ink"
          >
            <Check className="size-3.5 shrink-0 text-workspace-success" />
            {item}
          </li>
        ))}
      </ul>

      <dl className="mt-4 divide-y divide-workspace-border overflow-hidden rounded-xl border border-workspace-border bg-workspace-elevated">
        <SummaryRow
          label="Venture Brief"
          value={`${completion.ventureName} · ${completion.ventureStage} · ${completion.ventureCategory}. ${completion.ventureSummary}`}
        />
        <SummaryRow
          label="Nhu cầu hiện tại"
          value={completion.currentSupportNeed}
        />
        <SummaryRow
          label="Outcome mong muốn"
          value={completion.expectedOutcome}
        />
        <SummaryRow
          label="Chủ đề cần mentor hỗ trợ"
          value={completion.mentorTopics.join(" · ")}
        />
      </dl>

      <p className="mt-4 rounded-lg border border-workspace-border bg-workspace-elevated px-3 py-2.5 workspace-meta text-workspace-muted-text">
        Tài liệu đã phân tích: {completion.analyzedDocuments.join(", ")}.
        {" "}
        {completion.evidenceSummary}.
      </p>

      {workspaceError ? (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-workspace-danger/35 bg-workspace-danger-soft px-3 py-2.5 workspace-supporting text-ink"
        >
          <p>Chưa thể tạo workspace lúc này.</p>
          <p className="mt-1 workspace-meta text-workspace-muted-text">
            {workspaceError}
          </p>
        </div>
      ) : null}

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button
          type="button"
          onClick={onEnterWorkspace}
          disabled={enteringWorkspace}
          aria-busy={enteringWorkspace}
          className="sm:min-w-44"
        >
          {enteringWorkspace
            ? "Đang chuẩn bị workspace…"
            : workspaceError
              ? "Thử lại"
              : "Xem mentor phù hợp"}
          <ArrowRight className="size-4" />
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onReviewFiles}
          disabled={enteringWorkspace}
        >
          <FileSearch className="size-4" />
          Xem lại Venture Brief
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onReanalyze}
          disabled={enteringWorkspace}
        >
          <RefreshCw className="size-4" />
          Phân tích lại
        </Button>
      </div>
    </section>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="grid gap-1 px-3.5 py-3 sm:grid-cols-[130px_minmax(0,1fr)]">
      <dt className="workspace-eyebrow text-workspace-muted-text">
        {label}
      </dt>
      <dd className="workspace-supporting font-medium text-ink">
        {value}
      </dd>
    </div>
  );
}
