"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

import {
  adaptiveEntryScenarioIds,
  createAdaptiveEntryScenario,
  type AdaptiveEntryScenarioId,
} from "@/features/founder/entry/demo/entry-scenarios";
import { resolveAdaptiveFounderEntry } from "@/features/founder/entry/services/adaptive-entry-resolver";
import { resolveFounderDeepLink } from "@/features/founder/entry/services/deep-link-resolver";
import { getPendingMentorSession } from "@/features/founder/mentor-sessions/demo/mentor-session-data";
import { useDemoWorkspace } from "@/features/founder/venture-foundation/demo-workspace-provider";
import { useRouter } from "@/i18n/routing";

export function FounderEntryScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, hydrated, replaceDemoState } =
    useDemoWorkspace();
  const navigatedRef = React.useRef(false);
  const scenarioParam = searchParams.get("demoScenario");
  const deepLinkParam = searchParams.get("next") ?? undefined;

  React.useEffect(() => {
    if (!hydrated || navigatedRef.current) return;

    const scenarioId = adaptiveEntryScenarioIds.includes(
      scenarioParam as AdaptiveEntryScenarioId,
    )
      ? (scenarioParam as AdaptiveEntryScenarioId)
      : undefined;
    const scenario = scenarioId
      ? createAdaptiveEntryScenario(scenarioId)
      : undefined;
    const resolvedState = scenario?.state ?? state;
    if (scenario) replaceDemoState(resolvedState);

    const pendingDeepLink =
      scenario?.pendingDeepLink ??
      resolveFounderDeepLink(
        scenario?.rawDeepLink ?? deepLinkParam,
        resolvedState,
      );
    const destination = resolveAdaptiveFounderEntry({
      state: resolvedState,
      pendingDeepLink,
      pendingMentorSession:
        scenario?.pendingMentorSession ??
        getPendingMentorSession(resolvedState),
    });

    navigatedRef.current = true;
    router.replace(destination.href);
  }, [
    deepLinkParam,
    hydrated,
    replaceDemoState,
    router,
    scenarioParam,
    state,
  ]);

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
            Đang mở không gian làm việc của bạn…
          </p>
          <p className="mt-1 text-caption text-workspace-muted-text">
            Kizuna đang khôi phục đúng venture và ngữ cảnh gần nhất.
          </p>
        </div>
        <Loader2 className="ml-auto size-4 animate-spin text-primary motion-reduce:animate-none" />
      </div>
    </main>
  );
}
