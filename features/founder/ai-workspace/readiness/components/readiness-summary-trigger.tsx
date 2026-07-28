"use client";

import { ArrowUpRight, Sparkles } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { ExplainableReadinessAssessment } from "../types/readiness.types";
import { ReadinessRing } from "../../components/shared/readiness-ring";

export function ReadinessSummaryTrigger({
  assessment,
  onOpen,
}: {
  assessment: ExplainableReadinessAssessment;
  onOpen: () => void;
}) {
  const strongest = [...assessment.criteria].sort(
    (left, right) => right.score - left.score,
  )[0];
  const biggestGap = [...assessment.criteria].sort(
    (left, right) => left.score - right.score,
  )[0];
  const progressing = assessment.criteria.filter(
    (criterion) => criterion.delta >= 3,
  ).length;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onOpen}
          className="group flex w-full items-center gap-3 rounded-xl text-left outline-none transition-colors hover:bg-workspace-elevated focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/50"
          aria-label={`Mở chi tiết mức độ sẵn sàng ${assessment.overallScore} trên 100`}
        >
          <ReadinessRing
            score={assessment.overallScore}
            label="Mức độ sẵn sàng"
            size="compact"
          />
          <span className="min-w-0 flex-1">
            <span className="workspace-eyebrow text-workspace-muted-text">
              Mức độ sẵn sàng
            </span>
            <span className="mt-1 flex items-center gap-1.5 workspace-card-title text-ink">
              {assessment.label}
              <ArrowUpRight className="size-3.5 text-primary opacity-70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" />
            </span>
            <span className="mt-1 block font-tabular workspace-meta text-workspace-success">
              +{assessment.delta} · {assessment.overallScore}/100
            </span>
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="left"
        sideOffset={12}
        className="w-72 rounded-xl border border-workspace-border bg-workspace-elevated p-3 text-ink shadow-xl"
      >
        <p className="flex items-center gap-1.5 workspace-eyebrow text-primary">
          <Sparkles className="size-3.5" />
          Xem nhanh
        </p>
        <ul className="mt-2.5 space-y-2 workspace-meta">
          <li>{progressing}/7 tiêu chí đang tiến triển</li>
          <li>
            Mạnh nhất: <strong>{strongest?.label}</strong>
          </li>
          <li>
            Khoảng trống lớn nhất: <strong>{biggestGap?.label}</strong>
          </li>
          <li className="text-workspace-muted-text">
            Cập nhật 2 giờ trước · Nhấn để xem chi tiết
          </li>
        </ul>
      </TooltipContent>
    </Tooltip>
  );
}
