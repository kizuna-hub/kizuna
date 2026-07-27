import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function ResponseCardShell({
  eyebrow,
  title,
  icon,
  children,
  actions,
  className,
}: {
  eyebrow: string;
  title: string;
  icon: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "overflow-hidden rounded-xl border border-workspace-border bg-workspace-panel animate-in fade-in slide-in-from-bottom-2 duration-200 motion-reduce:animate-none",
        className,
      )}
    >
      <div className="flex items-start gap-3 border-b border-workspace-border px-4 py-3.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary-border bg-primary-soft text-primary">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="workspace-eyebrow text-primary">{eyebrow}</p>
          <h3 className="mt-1 workspace-card-title text-ink">
            {title}
          </h3>
        </div>
      </div>
      <div className="px-4 py-3.5">{children}</div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2 border-t border-workspace-border px-4 py-3">
          {actions}
        </div>
      ) : null}
    </article>
  );
}

