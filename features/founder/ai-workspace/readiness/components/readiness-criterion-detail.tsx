"use client";

import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  Plus,
  ShieldQuestion,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type {
  ReadinessContribution,
  ReadinessCriterion,
} from "../types/readiness.types";

export function ReadinessCriterionDetail({
  criterion,
  onBack,
  onOpenSource,
  onCreateCycle,
}: {
  criterion: ReadinessCriterion;
  onBack: () => void;
  onOpenSource: (contribution: ReadinessContribution) => void;
  onCreateCycle: () => void;
}) {
  const existing = criterion.contributions.filter(
    (item) =>
      item.status !== "missing" &&
      item.type !== "missing" &&
      !item.excluded,
  );
  const contradictionCount = criterion.contributions.filter(
    (item) => item.status === "disputed",
  ).length;

  return (
    <div>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="-ml-2"
        onClick={onBack}
      >
        <ArrowLeft className="size-3.5" />
        Tất cả tiêu chí
      </Button>

      <div className="mt-2 flex items-start justify-between gap-3">
        <div>
          <h3 className="workspace-section-title text-ink">
            {criterion.label}
          </h3>
          <p className="mt-1 workspace-meta text-workspace-muted-text">
            {criterion.description}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-tabular text-2xl font-semibold text-ink">
            {criterion.score}
            <span className="text-sm text-workspace-muted-text">
              /100
            </span>
          </p>
          <p className="workspace-eyebrow text-workspace-muted-text">
            Trọng số {criterion.weight}%
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-1.5">
        {[
          ["Nguồn dùng", "6"],
          ["Đã xác minh", "2"],
          ["AI suy luận", "3"],
          ["Mâu thuẫn", String(contradictionCount || 1)],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg border border-workspace-border bg-workspace-elevated px-2 py-2 text-center"
          >
            <p className="font-tabular workspace-card-title text-ink">
              {value}
            </p>
            <p className="mt-0.5 text-[10px] leading-tight text-workspace-muted-text">
              {label}
            </p>
          </div>
        ))}
      </div>

      <section className="mt-5">
        <h4 className="flex items-center gap-2 workspace-eyebrow text-workspace-success">
          <CheckCircle2 className="size-3.5" />
          Đã có
        </h4>
        <div className="mt-2 space-y-2">
          {existing.map((contribution) => (
            <button
              key={contribution.id}
              type="button"
              onClick={() => onOpenSource(contribution)}
              className="flex w-full items-start justify-between gap-3 rounded-lg border border-workspace-border bg-workspace-elevated p-3 text-left outline-none hover:border-primary-border focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/50"
            >
              <span className="flex min-w-0 gap-2">
                <FileText className="mt-0.5 size-3.5 shrink-0 text-primary" />
                <span>
                  <span className="block workspace-supporting font-medium text-ink">
                    {contribution.title}
                  </span>
                  <span className="mt-1 block workspace-meta text-workspace-muted-text">
                    {contribution.source.fileName}
                    {contribution.source.page
                      ? ` · Trang ${contribution.source.page}`
                      : ""}
                  </span>
                </span>
              </span>
              <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-workspace-muted-text" />
            </button>
          ))}
        </div>
      </section>

      <section className="mt-5">
        <h4 className="flex items-center gap-2 workspace-eyebrow text-workspace-warning">
          <ShieldQuestion className="size-3.5" />
          Còn thiếu
        </h4>
        <ul className="mt-2 space-y-1.5">
          {criterion.missingEvidence.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 workspace-meta text-ink"
            >
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-workspace-warning" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {criterion.contradictions.length > 0 ? (
        <section className="mt-5 rounded-lg border border-workspace-danger/25 bg-workspace-danger-soft p-3">
          <h4 className="flex items-center gap-2 workspace-eyebrow text-workspace-danger">
            <AlertTriangle className="size-3.5" />
            Mâu thuẫn
          </h4>
          <p className="mt-2 workspace-meta text-ink">
            {criterion.contradictions[0]}
          </p>
          <p className="mt-2 workspace-meta text-workspace-muted-text">
            Khi nguồn mâu thuẫn, analytics đã xác minh được ưu tiên hơn
            tuyên bố hoặc suy luận.
          </p>
        </section>
      ) : null}

      <section className="mt-5">
        <h4 className="workspace-eyebrow text-workspace-muted-text">
          Điều gì sẽ tăng điểm
        </h4>
        <ul className="mt-2 space-y-1.5">
          {criterion.improvementActions.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 workspace-meta text-ink"
            >
              <Plus className="mt-0.5 size-3.5 shrink-0 text-primary" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <Button
        type="button"
        size="sm"
        className="mt-5 w-full"
        onClick={onCreateCycle}
      >
        Tạo chu kỳ kiểm chứng
        <ArrowRight className="size-3.5" />
      </Button>
    </div>
  );
}
