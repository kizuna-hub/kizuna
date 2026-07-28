import { ArrowRight, Gauge, Radar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { TractionDiagnosisPayload } from "../../types/ai-workspace.types";

const assessmentLabels = {
  good: "Tốt",
  weak: "Yếu",
  very_weak: "Rất yếu",
} as const;

export function TractionDiagnosisCard({
  diagnosis,
  onOpenReadiness,
}: {
  diagnosis: TractionDiagnosisPayload;
  onOpenReadiness: () => void;
}) {
  return (
    <section className="rounded-xl border border-workspace-border bg-workspace-panel p-4">
      <div className="flex items-center gap-2">
        <Gauge className="size-4 text-primary" />
        <h3 className="workspace-card-title text-ink">
          {diagnosis.title}
        </h3>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {diagnosis.metrics.map((metric) => (
          <div
            key={metric.id}
            className="rounded-lg border border-workspace-border bg-workspace-elevated px-3 py-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="workspace-meta text-workspace-muted-text">
                {metric.label}
              </span>
              <span
                className={cn(
                  "workspace-eyebrow",
                  metric.assessment === "good"
                    ? "text-workspace-success"
                    : metric.assessment === "weak"
                      ? "text-workspace-warning"
                      : "text-workspace-danger",
                )}
              >
                {assessmentLabels[metric.assessment]}
              </span>
            </div>
            <p className="mt-1 font-tabular workspace-card-title text-ink">
              {metric.value}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-start gap-2 rounded-lg border border-workspace-warning/25 bg-workspace-warning-soft p-3">
        <Radar className="mt-0.5 size-4 shrink-0 text-workspace-warning" />
        <div>
          <p className="workspace-supporting font-medium text-ink">
            Kết luận: đủ điều kiện chạy pilot nhỏ
          </p>
          <p className="mt-1 workspace-meta text-workspace-muted-text">
            {diagnosis.scaleThresholds.join(" · ")}
          </p>
        </div>
      </div>
      <p className="mt-3 workspace-meta text-workspace-warning">
        Dự kiến · Chưa cập nhật điểm hiện tại: tín hiệu thị trường{" "}
        {diagnosis.projectedTraction[0]}–
        {diagnosis.projectedTraction[1]} · readiness{" "}
        {diagnosis.projectedReadiness[0]}–
        {diagnosis.projectedReadiness[1]}
      </p>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="mt-3 w-full"
        onClick={onOpenReadiness}
      >
        Xem evidence
        <ArrowRight className="size-3.5" />
      </Button>
    </section>
  );
}
