import {
  ArrowRight,
  FileSearch,
  Gauge,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { DocumentOnboardingAnalysisPayload } from "../../types/ai-workspace.types";

export function DocumentOnboardingAnalysisCard({
  analysis,
  onOpenAnalysis,
  onOpenEvidence,
}: {
  analysis: DocumentOnboardingAnalysisPayload;
  onOpenAnalysis: () => void;
  onOpenEvidence: () => void;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-workspace-border bg-workspace-panel">
      <header className="border-b border-workspace-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <h3 className="workspace-card-title text-ink">
            Phân tích ban đầu đã sẵn sàng
          </h3>
        </div>
        <p className="mt-1 workspace-meta text-workspace-muted-text">
          Baseline dựa trên tài liệu hiện có và có thể tiếp
          tục được làm rõ.
        </p>
      </header>

      <dl className="grid divide-y divide-workspace-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <div className="p-4">
          <dt className="workspace-eyebrow text-workspace-muted-text">
            Readiness
          </dt>
          <dd className="mt-1 flex items-baseline gap-2 text-ink">
            <span className="font-tabular text-2xl font-semibold">
              {analysis.readinessScore}
            </span>
            <span className="workspace-meta">
              /100 · {analysis.stageLabel}
            </span>
          </dd>
        </div>
        <div className="p-4">
          <dt className="workspace-eyebrow text-workspace-muted-text">
            Nguồn
          </dt>
          <dd className="mt-1 workspace-card-title text-ink">
            {analysis.documentCount} tài liệu ·{" "}
            {analysis.evidenceCount} trang được sử dụng
          </dd>
        </div>
      </dl>

      <div className="grid gap-px bg-workspace-border">
        <AnalysisRow
          icon={Gauge}
          label="Điểm mạnh"
          value={`${analysis.strongestCriterion.label} · ${analysis.strongestCriterion.score}`}
        />
        <AnalysisRow
          icon={FileSearch}
          label="Cần mở khóa"
          value={`${analysis.biggestGap.label} · ${analysis.biggestGap.score}`}
        />
      </div>

      <div className="flex flex-col gap-2 border-t border-workspace-border p-3 sm:flex-row">
        <Button
          type="button"
          size="sm"
          onClick={onOpenAnalysis}
          className="light-primary-foreground sm:flex-1"
        >
          Xem phân tích
          <ArrowRight className="size-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={onOpenEvidence}
          className="sm:flex-1"
        >
          Xem bằng chứng
        </Button>
      </div>
    </section>
  );
}

function AnalysisRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 bg-workspace-panel px-4 py-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
        <Icon className="size-4" />
      </span>
      <div>
        <p className="workspace-eyebrow text-workspace-muted-text">
          {label}
        </p>
        <p className="mt-1 workspace-supporting font-medium text-ink">
          {value}
        </p>
      </div>
    </div>
  );
}
