"use client";

import React from "react";
import { Loader2 } from "lucide-react";

import { useDemoWorkspace } from "@/features/founder/venture-foundation/demo-workspace-provider";
import { resolveFounderEntryPath } from "@/features/founder/venture-foundation/route-resolver";
import { useRouter } from "@/i18n/routing";

export function FounderEntryScreen() {
  const router = useRouter();
  const { state, hydrated } = useDemoWorkspace();

  React.useEffect(() => {
    if (!hydrated) return;
    router.replace(resolveFounderEntryPath(state));
  }, [hydrated, router, state]);

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-workspace-background px-6 text-ink">
      <div
        className="flex max-w-sm items-center gap-4 rounded-xl border border-workspace-border bg-workspace-panel p-5"
        role="status"
        aria-live="polite"
      >
        <span className="flex size-10 items-center justify-center rounded-lg border border-primary-border bg-primary-soft font-heading text-primary">
          K
        </span>
        <div>
          <p className="text-body-framer-sm font-semibold">
            Opening your workspace
          </p>
          <p className="mt-1 text-caption text-workspace-muted-text">
            Resolving the last valid project context.
          </p>
        </div>
        <Loader2 className="ml-auto size-4 animate-spin text-primary motion-reduce:animate-none" />
      </div>
    </main>
  );
}

