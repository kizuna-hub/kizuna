"use client";

import { AlertTriangle } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { FounderShell } from "@/features/founder/shell/founder-shell";
import { useDemoWorkspace } from "@/features/founder/venture-foundation/demo-workspace-provider";

import {
  ContinueVenturePanel,
  GettingStartedJourney,
  HomePageHeader,
  HomeQuickActions,
  NeedsAttentionList,
  NothingUrgentStatus,
  NoVentureHome,
  OtherActiveProjects,
  RecentActivityList,
} from "./components/home-sections";
import { getFounderHomeViewModel } from "./lib/home-view-model";

export function FounderHomeScreen() {
  const searchParams = useSearchParams();
  const { state, updateUiPreferences } = useDemoWorkspace();
  const home = getFounderHomeViewModel(state);
  const notice = searchParams.get("notice");
  const noticeCopy =
    notice === "access-denied"
      ? "Bạn không còn quyền truy cập nội dung từ liên kết này."
      : notice === "target-unavailable"
        ? "Nội dung bạn mở không còn tồn tại hoặc đã được di chuyển."
        : notice === "archived"
          ? "Venture gần nhất đã được lưu trữ. Hãy chọn một venture đang hoạt động."
          : undefined;

  return (
    <FounderShell contentWidth="focused">
      <div className="space-y-5">
        <HomePageHeader
          userName={home.userName}
          state={home.state}
          entryPreference={
            state.uiPreferences.entryPreference ??
            "continue-last-work"
          }
          onEntryPreferenceChange={(entryPreference) =>
            updateUiPreferences({ entryPreference })
          }
        />

        {noticeCopy ? (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl border border-workspace-warning/30 bg-workspace-warning-soft px-4 py-3 workspace-supporting text-ink"
          >
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-workspace-warning" />
            <span>{noticeCopy}</span>
          </div>
        ) : null}

        {home.state === "no-venture" ? <NoVentureHome /> : null}

        {home.setupJourney ? (
          <GettingStartedJourney journey={home.setupJourney} />
        ) : null}

        {home.continuation &&
        home.state !== "setup-incomplete" ? (
          <>
            <ContinueVenturePanel
              continuation={home.continuation}
            />
            <HomeQuickActions
              actions={home.quickActions}
              ventureName={home.continuation.ventureName}
            />
            {home.attentionItems.length > 0 ? (
              <NeedsAttentionList items={home.attentionItems} />
            ) : (
              <NothingUrgentStatus />
            )}
            <RecentActivityList
              activities={home.recentActivity}
            />
            <OtherActiveProjects
              projects={home.otherActiveProjects}
            />
          </>
        ) : null}
      </div>
    </FounderShell>
  );
}
