import { ArrowRight, CheckCircle2, FlaskConical } from "lucide-react";

import { Button } from "@/components/ui/button";

import type {
  AssistantResponseLifecycle,
  DecisionCycleLifecycle,
  NextActionPayload,
} from "../../types/ai-workspace.types";

export function NextActionPlanCard({
  plan,
  lifecycle,
  cycleLifecycle,
  onConfirm,
  onOpenCycle,
}: {
  plan: NextActionPayload;
  lifecycle: AssistantResponseLifecycle;
  cycleLifecycle: DecisionCycleLifecycle;
  onConfirm: () => void;
  onOpenCycle: () => void;
}) {
  const created =
    lifecycle === "completed" ||
    cycleLifecycle !== "not_created";

  return (
    <section className="rounded-xl border border-workspace-border bg-workspace-panel p-4">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
          {created ? (
            <CheckCircle2 className="size-4.5" />
          ) : (
            <FlaskConical className="size-4.5" />
          )}
        </span>
        <div className="min-w-0">
          <p className="workspace-eyebrow text-primary">
            Ưu tiên tiếp theo
          </p>
          <h3 className="mt-1 workspace-card-title text-ink">
            {plan.title}
          </h3>
          <p className="mt-1.5 workspace-meta text-workspace-muted-text">
            {plan.priority}
          </p>
        </div>
      </div>
      <dl className="mt-4 grid gap-2 border-y border-workspace-border py-3 sm:grid-cols-3">
        <div>
          <dt className="workspace-eyebrow text-workspace-muted-text">
            Quy mô
          </dt>
          <dd className="mt-1 workspace-supporting text-ink">
            {plan.participantCount} người · {plan.durationDays} ngày
          </dd>
        </div>
        <div>
          <dt className="workspace-eyebrow text-workspace-muted-text">
            Metric chính
          </dt>
          <dd className="mt-1 workspace-supporting text-ink">
            {plan.primaryMetric}
          </dd>
        </div>
        <div>
          <dt className="workspace-eyebrow text-workspace-muted-text">
            Ngưỡng thành công
          </dt>
          <dd className="mt-1 font-tabular workspace-supporting text-workspace-success">
            {plan.successThreshold}
          </dd>
        </div>
      </dl>
      <p className="mt-3 workspace-meta text-workspace-warning">
        Dự kiến · Chưa cập nhật điểm hiện tại: +
        {plan.projectedDelta[0]}–{plan.projectedDelta[1]} điểm
      </p>
      {created ? (
        <p
          role="status"
          className="mt-3 flex items-center gap-2 rounded-lg border border-workspace-success/30 bg-workspace-success-soft p-2.5 workspace-meta text-ink"
        >
          <CheckCircle2 className="size-4 text-workspace-success" />
          Đã tạo chu kỳ pilot. Readiness vẫn giữ nguyên 65/100 cho
          tới khi evidence được xác minh.
        </p>
      ) : null}
      <Button
        type="button"
        size="sm"
        className="mt-3 w-full"
        onClick={created ? onOpenCycle : onConfirm}
      >
        {created ? "Mở Decision Canvas" : "Tạo chu kỳ pilot"}
        <ArrowRight className="size-3.5" />
      </Button>
    </section>
  );
}
