import { ArrowRight, CheckCircle2, Clock3 } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { ReadinessEvidencePayload } from "../../types/ai-workspace.types";

export function ReadinessEvidenceCard({
  evidence,
  canonicalScore,
  onVerify,
}: {
  evidence: ReadinessEvidencePayload;
  canonicalScore: number;
  onVerify: () => void;
}) {
  const verified = evidence.status === "verified";
  return (
    <section className="rounded-xl border border-workspace-border bg-workspace-panel p-4">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-workspace-warning-soft text-workspace-warning">
          {verified ? (
            <CheckCircle2 className="size-4.5" />
          ) : (
            <Clock3 className="size-4.5" />
          )}
        </span>
        <div>
          <p className="workspace-eyebrow text-workspace-warning">
            {verified ? "Đã xác minh" : "Đang chờ xác minh"}
          </p>
          <h3 className="mt-1 workspace-card-title text-ink">
            {evidence.title}
          </h3>
        </div>
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-2 border-y border-workspace-border py-3 text-center">
        <div>
          <dt className="workspace-eyebrow text-workspace-muted-text">
            Treatment
          </dt>
          <dd className="mt-1 font-tabular workspace-card-title text-workspace-success">
            {evidence.treatmentActivation}%
          </dd>
        </div>
        <div>
          <dt className="workspace-eyebrow text-workspace-muted-text">
            Control
          </dt>
          <dd className="mt-1 font-tabular workspace-card-title text-ink">
            {evidence.controlActivation}%
          </dd>
        </div>
        <div>
          <dt className="workspace-eyebrow text-workspace-muted-text">
            Mẫu
          </dt>
          <dd className="mt-1 font-tabular workspace-card-title text-ink">
            {evidence.sampleSize}
          </dd>
        </div>
      </dl>
      <p className="mt-3 workspace-meta text-workspace-warning">
        Dự kiến · Chưa cập nhật điểm hiện tại: +
        {evidence.projectedDelta[0]}–{evidence.projectedDelta[1]} ·
        canonical {canonicalScore}/100
      </p>
      <Button
        type="button"
        size="sm"
        className="mt-3 w-full"
        onClick={onVerify}
        disabled={verified || canonicalScore > 61}
      >
        {canonicalScore > 61
          ? "Đã cập nhật điểm canonical"
          : "Xác minh bằng AnalyticsSnapshot"}
        <ArrowRight className="size-3.5" />
      </Button>
    </section>
  );
}
