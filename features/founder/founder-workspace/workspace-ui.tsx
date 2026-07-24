"use client";

import React from "react";
import { CheckCircle2, Copy, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type DemoToastState = {
  title: string;
  description?: string;
  tone?: "default" | "success" | "warning";
} | null;

export function WorkspacePageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="mb-3 text-caption font-bold uppercase tracking-[0.16em] text-ink-muted">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-display-md text-ink text-balance md:text-display-lg">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-body-framer text-ink-muted">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}

export function WorkspaceCard({
  children,
  className,
  title,
  description,
  action,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <section className={cn("rounded-xl border border-hairline bg-surface-1 p-5 shadow-framer-edge", className)}>
      {(title || description || action) ? (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title ? <h2 className="text-headline text-ink">{title}</h2> : null}
            {description ? <p className="mt-1 text-body-framer-sm text-ink-muted">{description}</p> : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function WorkspaceMetric({
  label,
  value,
  detail,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string;
  detail?: string;
  icon?: React.ElementType;
  accent?: boolean;
}) {
  return (
    <WorkspaceCard className={cn("min-h-[150px]", accent && "bg-surface-2")}>
      <div className="flex h-full flex-col justify-between gap-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">{label}</p>
          {Icon ? (
            <div className="flex size-9 items-center justify-center rounded-full border border-hairline bg-surface-2 text-ink">
              <Icon className="size-4" />
            </div>
          ) : null}
        </div>
        <div>
          <p className="font-mono text-3xl font-bold leading-none text-ink">{value}</p>
          {detail ? <p className="mt-3 text-body-framer-sm text-ink-muted">{detail}</p> : null}
        </div>
      </div>
    </WorkspaceCard>
  );
}

export function WorkspaceActionModal({
  open,
  title,
  description,
  children,
  onClose,
  footer,
}: {
  open: boolean;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
      <button
        aria-label="Close modal"
        className="absolute inset-0 bg-canvas/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg rounded-xl border border-hairline bg-surface-1 p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-headline text-ink">{title}</h2>
            {description ? <p className="mt-2 text-body-framer-sm text-ink-muted">{description}</p> : null}
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close">
            <X className="size-4" />
          </Button>
        </div>
        {children}
        {footer ? <div className="mt-6 flex justify-end gap-3">{footer}</div> : null}
      </div>
    </div>
  );
}

export function DemoToast({
  toast,
  onDismiss,
}: {
  toast: DemoToastState;
  onDismiss: () => void;
}) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-5 right-5 z-toast w-[min(360px,calc(100vw-2rem))] rounded-xl border border-hairline bg-surface-1 p-4 shadow-framer-edge">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-hairline bg-surface-2 text-ink",
            toast.tone === "success" && "text-semantic-success",
            toast.tone === "warning" && "text-accent-blue"
          )}
        >
          <CheckCircle2 className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-body-framer-sm font-bold text-ink">{toast.title}</p>
          {toast.description ? <p className="mt-1 text-caption text-ink-muted">{toast.description}</p> : null}
        </div>
        <button className="text-ink-muted transition-colors hover:text-ink" onClick={onDismiss} aria-label="Dismiss">
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}

export function CopyField({ value, onCopy }: { value: string; onCopy?: () => void }) {
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    onCopy?.();
  };

  return (
    <div className="flex items-center gap-2 rounded-xl border border-hairline bg-surface-2 p-2">
      <code className="min-w-0 flex-1 truncate px-2 font-mono text-caption text-ink-muted">{value}</code>
      <Button variant="secondary" size="sm" onClick={copy}>
        <Copy className="size-3.5" />
        Copy
      </Button>
    </div>
  );
}
