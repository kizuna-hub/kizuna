import {
  Check,
  Circle,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";

import type {
  VentureAnalysisStatus,
  VentureAnalysisStepId,
} from "../types/venture-analysis.types";

export function AnalysisStepRow({
  step,
  active,
  completed,
  analysisStatus,
}: {
  step: {
    id: VentureAnalysisStepId;
    label: string;
    description: string;
  };
  active: boolean;
  completed: boolean;
  analysisStatus: VentureAnalysisStatus;
}) {
  return (
    <li
      className={cn(
        "rounded-xl border px-3.5 py-3 transition-colors duration-200 motion-reduce:transition-none",
        active
          ? "border-primary-border bg-primary-soft"
          : "border-transparent",
      )}
      aria-current={active ? "step" : undefined}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border",
            completed &&
              "border-workspace-success/50 bg-workspace-success-soft text-workspace-success",
            active &&
              !completed &&
              "border-primary-border bg-workspace-panel text-primary",
            !active &&
              !completed &&
              "border-workspace-border text-workspace-muted-text",
          )}
          aria-hidden="true"
        >
          {completed ? (
            <Check className="size-3.5" />
          ) : active &&
            analysisStatus === "processing" ? (
            <Loader2 className="size-3.5 animate-spin motion-reduce:animate-none" />
          ) : (
            <Circle className="size-2.5" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "workspace-supporting font-medium",
              active || completed
                ? "text-ink"
                : "text-workspace-muted-text",
            )}
          >
            {step.label}
            {completed ? (
              <span className="sr-only"> · Đã hoàn tất</span>
            ) : null}
          </p>
          <p className="mt-1 workspace-meta text-workspace-muted-text">
            {step.description}
          </p>
        </div>
      </div>
    </li>
  );
}
