"use client";

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
  const { state } = useDemoWorkspace();
  const home = getFounderHomeViewModel(state);

  return (
    <FounderShell contentWidth="focused">
      <div className="space-y-5">
        <HomePageHeader userName={home.userName} state={home.state} />

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
