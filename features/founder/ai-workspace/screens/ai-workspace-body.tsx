"use client";

import React from "react";
import { Activity } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { ConversationWorkspaceView } from "../components/conversation/conversation-workspace-view";
import { DecisionCycleCanvas } from "../components/decision-cycle/decision-cycle-canvas";
import { MentorMatchDetailPanel } from "../components/mentor/mentor-match-detail-panel";
import { VenturePulsePanel } from "../components/venture-pulse/venture-pulse-panel";
import { aiWorkspaceVi } from "../copy/vi";
import { useAiWorkspace } from "../hooks/use-ai-workspace";
import { useConversationSearchController } from "../hooks/use-conversation-search-controller";

type AiWorkspaceController = ReturnType<typeof useAiWorkspace>;

export function AiWorkspaceBody({
  workspace,
  onOpenSearch,
  jumpMessageId,
  onJumpHandled,
  overlayOpen,
  onOpenArtifact,
}: {
  workspace: AiWorkspaceController;
  onOpenSearch: () => void;
  jumpMessageId?: string;
  onJumpHandled: () => void;
  overlayOpen: boolean;
  onOpenArtifact: (
    surface: "documents" | "timeline",
  ) => void;
}) {
  const [pulseOpen, setPulseOpen] = React.useState(false);
  const [panelView, setPanelView] = React.useState<
    "pulse" | "mentor"
  >("pulse");
  const [cycleReviewing, setCycleReviewing] =
    React.useState(false);
  const mentorTriggerRef = React.useRef<HTMLElement | null>(
    null,
  );
  const { state, longRun } = workspace;
  const copy = aiWorkspaceVi;
  const generating =
    state.generationStatus === "typing" ||
    state.generationStatus === "streaming";
  const pinnedSourceIds = longRun.pinnedItems.map(
    (item) => item.sourceId,
  );
  const search = useConversationSearchController({
    workspace,
    onOpenVentureSearch: onOpenSearch,
    overlayOpen,
    jumpMessageId,
    onJumpHandled,
  });

  const showReadinessExplanation = () => {
    workspace.setView("conversation");
    setPulseOpen(false);
    void workspace.sendMessage(copy.prompts.explainReadiness);
  };

  const openMentorDetails = () => {
    if (!state.mentorRecommendation) return;
    if (document.activeElement instanceof HTMLElement) {
      mentorTriggerRef.current = document.activeElement;
    }
    setPanelView("mentor");
    if (window.matchMedia("(max-width: 1279px)").matches) {
      setPulseOpen(true);
    }
  };

  const closeMentorDetails = React.useCallback(() => {
    setPanelView("pulse");
    window.requestAnimationFrame(() =>
      mentorTriggerRef.current?.focus(),
    );
  }, []);

  React.useEffect(() => {
    if (panelView !== "mentor") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setPulseOpen(false);
      closeMentorDetails();
    };
    window.addEventListener("keydown", onKeyDown);
    return () =>
      window.removeEventListener("keydown", onKeyDown);
  }, [closeMentorDetails, panelView]);

  const pulse = (
    <VenturePulsePanel
      state={state}
      copy={copy}
      onExplainReadiness={showReadinessExplanation}
      onOpenCycle={() => {
        workspace.setView("decision-cycle");
        setPulseOpen(false);
      }}
    />
  );
  const contextualPanel =
    panelView === "mentor" && state.mentorRecommendation ? (
      <MentorMatchDetailPanel
        mentor={state.mentorRecommendation}
        session={state.mentorSession}
        copy={copy}
        onBack={closeMentorDetails}
        onBook={workspace.bookMentor}
        onSave={workspace.saveMentor}
        onDismiss={(reason) => {
          workspace.deferMentor(reason);
          setPanelView("pulse");
          setPulseOpen(false);
        }}
        onUseOwnMentor={workspace.useOwnMentor}
        onTogglePreparation={
          workspace.toggleMentorPreparation
        }
        onRefresh={workspace.refreshMentor}
      />
    ) : (
      pulse
    );

  return (
    <div
      className="relative flex min-h-[calc(100dvh-6rem)] flex-col xl:h-[calc(100dvh-2.5rem)] xl:min-h-0"
      aria-busy={
        !workspace.hydrated || generating || cycleReviewing
      }
    >
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={() => setPulseOpen(true)}
        className="absolute right-2 top-2 z-overlay bg-workspace-panel xl:hidden"
        aria-label={copy.workspace.openPulse}
      >
        <Activity className="size-4" />
      </Button>

      {!workspace.hydrated || !workspace.activeSession ? (
        <div
          className="flex flex-1 items-center justify-center workspace-supporting text-workspace-muted-text"
          role="status"
        >
          {copy.workspace.loading}
        </div>
      ) : (
        <div className="grid min-h-0 flex-1 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-5">
          <section className="flex min-h-0 min-w-0 flex-col">
            {state.view === "conversation" ? (
              <ConversationWorkspaceView
                workspace={workspace}
                generating={generating}
                searchOpen={search.open}
                searchQuery={search.query}
                activeMatchIndex={search.activeMatchIndex}
                matchCount={search.matches.length}
                activeMatchMessageId={
                  search.activeMatchMessageId
                }
                pinnedSourceIds={pinnedSourceIds}
                topicDriftDismissed={
                  search.topicDriftDismissed
                }
                requestedScroll={
                  search.scrollRestoreRequest
                }
                onSearchQueryChange={search.setQuery}
                onPreviousMatch={() =>
                  search.setActiveMatchIndex((current) =>
                    search.matches.length === 0
                      ? 0
                      : (current -
                          1 +
                          search.matches.length) %
                        search.matches.length,
                  )
                }
                onNextMatch={() =>
                  search.setActiveMatchIndex((current) =>
                    search.matches.length === 0
                      ? 0
                      : (current + 1) %
                        search.matches.length,
                  )
                }
                onCloseSearch={search.closeCurrentSearch}
                onDismissTopicDrift={() =>
                  search.setTopicDriftDismissed(true)
                }
                onOpenMentor={openMentorDetails}
                onOpenArtifact={onOpenArtifact}
              />
            ) : (
              <DecisionCycleCanvas
                state={state}
                copy={copy}
                onBack={() =>
                  workspace.setView("conversation")
                }
                onSelectStep={workspace.setCycleStep}
                onToggleTask={workspace.toggleCycleTask}
                onSubmitEvidence={
                  workspace.submitCycleEvidence
                }
                onCompleteReview={async () => {
                  if (cycleReviewing) return;
                  setCycleReviewing(true);
                  await new Promise((resolve) =>
                    window.setTimeout(resolve, 650),
                  );
                  workspace.completeCycleReview();
                  setCycleReviewing(false);
                }}
                reviewing={cycleReviewing}
              />
            )}
          </section>

          <div className="hidden min-h-0 overflow-hidden rounded-xl border border-workspace-border xl:block">
            {contextualPanel}
          </div>
        </div>
      )}

      <Sheet
        open={pulseOpen}
        onOpenChange={(open) => {
          setPulseOpen(open);
          if (!open && panelView === "mentor") {
            closeMentorDetails();
          }
        }}
      >
        <SheetContent
          side="right"
          className="w-[min(360px,calc(100vw-1rem))] gap-0 border-workspace-border bg-workspace-panel p-0 xl:hidden"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{copy.pulse.title}</SheetTitle>
            <SheetDescription>
              {copy.workspace.description}
            </SheetDescription>
          </SheetHeader>
          {contextualPanel}
        </SheetContent>
      </Sheet>
    </div>
  );
}
