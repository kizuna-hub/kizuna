import { CircleHelp } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { VentureStage } from "@/features/venture/core";

export function StageConfirmation({
  onConfirm,
  onUnclear,
}: {
  onConfirm: (stage: VentureStage) => void;
  onUnclear: () => void;
}) {
  return (
    <section
      aria-labelledby="stage-confirmation-heading"
      className="rounded-xl border border-workspace-warning/40 bg-workspace-warning-soft p-4"
    >
      <div className="flex items-start gap-3">
        <CircleHelp className="mt-0.5 size-5 shrink-0 text-workspace-warning" />
        <div>
          <h3
            id="stage-confirmation-heading"
            className="workspace-card-title text-ink"
          >
            Kizuna chưa xác định chắc chắn giai đoạn venture
          </h3>
          <p className="mt-1 workspace-meta text-workspace-muted-text">
            Xác nhận giai đoạn trước khi tạo readiness
            baseline.
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => onConfirm("idea")}
        >
          Idea
        </Button>
        <Button
          type="button"
          onClick={() => onConfirm("prototype")}
        >
          Prototype
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onUnclear}
        >
          Tôi chưa rõ
        </Button>
      </div>
    </section>
  );
}
