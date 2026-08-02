import { ArrowRight, CheckCircle2 } from "lucide-react";

import type { MentorConnectionFunnelStep } from "../model/mentor-connection";

export function ConnectionFunnel({
  steps,
}: {
  steps: MentorConnectionFunnelStep[];
}) {
  const start = steps[0]?.count ?? 1;
  const accepted = steps.at(-1)?.count ?? 0;

  return (
    <div className="mt-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_170px]">
        <div className="space-y-3">
          {steps.map((step, index) => {
            const percentage = Math.round((step.count / start) * 100);
            return (
              <div
                key={step.id}
                className="grid items-center gap-3 sm:grid-cols-[170px_minmax(120px,1fr)_70px]"
              >
                <span className="text-[11px] font-medium">
                  {step.label}
                </span>
                <span className="h-8 overflow-hidden rounded-md bg-[var(--admin-surface-muted)]">
                  <span
                    className="flex h-full items-center rounded-md bg-[var(--admin-primary)] px-3 text-[10px] font-semibold text-white transition-[width] motion-reduce:transition-none"
                    style={{ width: `${Math.max(percentage, 18)}%` }}
                  >
                    {step.count}
                  </span>
                </span>
                <span className="text-right text-[10px] text-[var(--admin-muted)]">
                  {percentage}% đầu funnel
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] p-4 text-center">
          <CheckCircle2 className="size-7 text-[var(--admin-green)]" />
          <span className="mt-2 text-[10px] text-[var(--admin-muted)]">
            Tỷ lệ chấp nhận tổng thể
          </span>
          <strong className="mt-1 font-mono text-3xl text-[var(--admin-green)]">
            {Math.round((accepted / start) * 100)}%
          </strong>
          <span className="mt-2 inline-flex items-center gap-1 text-[9px] text-[var(--admin-green)]">
            +4% so với kỳ trước <ArrowRight className="size-3" />
          </span>
        </div>
      </div>
    </div>
  );
}

