"use client";

import React from "react";
import { X } from "lucide-react";
import type { ImperativePanelHandle } from "react-resizable-panels";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

import { ConversationWorkspaceView } from "../components/conversation/conversation-workspace-view";
import { ConversationSessionHeader } from "../conversation-history/components/conversation-session-header";
import { ConversationSessionLibrary } from "../conversation-history/components/conversation-session-library";
import { getConversationPlaceholder } from "../conversation-history/services/conversation-session-selector";
import type { FounderConversationSessionType } from "../conversation-history/types/conversation-session.types";
import { DecisionCycleCanvas } from "../components/decision-cycle/decision-cycle-canvas";
import { SecondaryPane } from "../components/secondary-pane/secondary-pane";
import { WorkspaceActionBar } from "../components/workspace/workspace-action-bar";
import {
  ConnectionRequestsWorkspaceView,
  MentorDiscoveryWorkspaceView,
} from "../components/workspace/mentor-first-destination-view";
import { aiWorkspaceVi } from "../copy/vi";
import { useAiWorkspace } from "../hooks/use-ai-workspace";
import { useConversationSearchController } from "../hooks/use-conversation-search-controller";
import type { ReadinessCriterionId } from "../readiness/types/readiness.types";
import { MentorshipContinuityOverview } from "../mentorship-continuity/components/mentorship-continuity-overview";

type AiWorkspaceController = ReturnType<typeof useAiWorkspace>;

export function AiWorkspaceBody({
  workspace,
  onOpenSearch,
  jumpMessageId,
  onJumpHandled,
  overlayOpen,
  onOpenArtifact,
  onOpenHistorySession,
  onBackToHistory,
  onCreateHistorySession,
  onNavigateToMentorDiscovery,
  showLegacyConversation = false,
}: {
  workspace: AiWorkspaceController;
  onOpenSearch: () => void;
  jumpMessageId?: string;
  onJumpHandled: () => void;
  overlayOpen: boolean;
  onOpenArtifact: (
    surface: "documents" | "timeline",
  ) => void;
  onOpenHistorySession: (sessionId: string) => void;
  onBackToHistory: () => void;
  onCreateHistorySession: (
    type: FounderConversationSessionType,
  ) => void;
  onNavigateToMentorDiscovery: () => void;
  showLegacyConversation?: boolean;
}) {
  const [cycleReviewing, setCycleReviewing] =
    React.useState(false);
  const [composerFocusKey, setComposerFocusKey] =
    React.useState(0);
  const [desktop, setDesktop] = React.useState<boolean | null>(
    null,
  );
  const [containerWidth, setContainerWidth] =
    React.useState(1200);
  const [panesSwapped, setPanesSwapped] =
    React.useState(false);
  const [secondaryAnimating, setSecondaryAnimating] =
    React.useState(false);
  const [secondaryCardSettled, setSecondaryCardSettled] =
    React.useState(false);
  const [
    secondaryContentVisible,
    setSecondaryContentVisible,
  ] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const secondaryPanelRef =
    React.useRef<ImperativePanelHandle | null>(null);
  const previousPaneModeRef = React.useRef(
    workspace.layout.secondaryPaneMode,
  );
  const newChatGuardRef = React.useRef(false);
  const { state, longRun, layout } = workspace;
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

  React.useEffect(() => {
    const media = window.matchMedia("(min-width: 1280px)");
    const update = () => setDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  React.useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setContainerWidth(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const openReadiness = (criterionId?: ReadinessCriterionId) => {
    if (criterionId) {
      workspace.setSelectedCriterion(criterionId);
      workspace.openEvidence("by_criterion");
      return;
    }
    workspace.openAnalysis("readiness");
  };

  const createNewChat = () => {
    if (newChatGuardRef.current) return;
    newChatGuardRef.current = true;
    if (layout.destination === "conversation_history") {
      onCreateHistorySession("mentor_matching");
    } else {
      workspace.createConversation();
    }
    setComposerFocusKey((current) => current + 1);
    window.setTimeout(() => {
      newChatGuardRef.current = false;
    }, 350);
  };

  const historySession = workspace.activeHistorySession;
  const historyLibrary = (
    <ConversationSessionLibrary
      sessions={workspace.conversationHistorySessions}
      selectedSessionId={layout.selectedHistorySessionId}
      query={layout.conversationHistorySearch}
      filter={layout.conversationHistoryFilter}
      scrollTop={layout.conversationHistoryScrollTop}
      onQueryChange={workspace.setConversationHistorySearch}
      onFilterChange={workspace.setConversationHistoryFilter}
      onScrollPositionChange={
        workspace.saveConversationHistoryScroll
      }
      onOpenSession={onOpenHistorySession}
      onTogglePin={workspace.toggleConversationPin}
      onCreateSession={onCreateHistorySession}
    />
  );
  const mainContent =
    layout.destination === "mentorship_continuity" ? (
      <MentorshipContinuityOverview
        workspace={workspace}
        onNavigateToMentorDiscovery={onNavigateToMentorDiscovery}
      />
    ) : layout.destination === "mentor_discovery" ? (
      <MentorDiscoveryWorkspaceView workspace={workspace} />
    ) : layout.destination === "connection_requests" ? (
      <ConnectionRequestsWorkspaceView workspace={workspace} />
    ) : state.view === "decision-cycle" ? (
      <DecisionCycleCanvas
        state={state}
        copy={copy}
        onBack={() => workspace.setView("conversation")}
        onSelectStep={workspace.setCycleStep}
        onToggleTask={workspace.toggleCycleTask}
        onSubmitEvidence={workspace.submitCycleEvidence}
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
    ) : layout.destination === "conversation_history" &&
      !showLegacyConversation &&
      layout.conversationHistoryView === "session_library" ? (
      historyLibrary
    ) : layout.destination === "conversation_history" &&
      !showLegacyConversation &&
      historySession ? (
      <ConversationWorkspaceView
        workspace={workspace}
        generating={generating}
        composerFocusKey={composerFocusKey}
        searchOpen={search.open}
        searchQuery={search.query}
        activeMatchIndex={search.activeMatchIndex}
        matchCount={search.matches.length}
        activeMatchMessageId={search.activeMatchMessageId}
        pinnedSourceIds={pinnedSourceIds}
        topicDriftDismissed={search.topicDriftDismissed}
        requestedScroll={search.scrollRestoreRequest}
        onSearchQueryChange={search.setQuery}
        onPreviousMatch={() =>
          search.setActiveMatchIndex((current) =>
            search.matches.length === 0
              ? 0
              : (current - 1 + search.matches.length) %
                search.matches.length,
          )
        }
        onNextMatch={() =>
          search.setActiveMatchIndex((current) =>
            search.matches.length === 0
              ? 0
              : (current + 1) % search.matches.length,
          )
        }
        onCloseSearch={search.closeCurrentSearch}
        onDismissTopicDrift={() =>
          search.setTopicDriftDismissed(true)
        }
        onOpenMentor={workspace.openMentorFit}
        onOpenArtifact={onOpenArtifact}
        onOpenReadiness={openReadiness}
        composerPlaceholder={getConversationPlaceholder(
          historySession.historyType,
        )}
        header={
          <ConversationSessionHeader
            session={historySession}
            panelOpen={layout.secondaryPaneMode !== "closed"}
            onBack={onBackToHistory}
            onTogglePin={() =>
              workspace.toggleConversationPin(historySession.id)
            }
            onOpenContext={() =>
              workspace.openConversationHistorySession(
                historySession.id,
              )
            }
          />
        }
      />
    ) : (
      layout.destination === "conversation_history" &&
      !showLegacyConversation ? (
        historyLibrary
      ) : (
        <ConversationWorkspaceView
          workspace={workspace}
          generating={generating}
          composerFocusKey={composerFocusKey}
          searchOpen={search.open}
          searchQuery={search.query}
          activeMatchIndex={search.activeMatchIndex}
          matchCount={search.matches.length}
          activeMatchMessageId={search.activeMatchMessageId}
          pinnedSourceIds={pinnedSourceIds}
          topicDriftDismissed={search.topicDriftDismissed}
          requestedScroll={search.scrollRestoreRequest}
          onSearchQueryChange={search.setQuery}
          onPreviousMatch={() =>
            search.setActiveMatchIndex((current) =>
              search.matches.length === 0
                ? 0
                : (current - 1 + search.matches.length) %
                  search.matches.length,
            )
          }
          onNextMatch={() =>
            search.setActiveMatchIndex((current) =>
              search.matches.length === 0
                ? 0
                : (current + 1) % search.matches.length,
            )
          }
          onCloseSearch={search.closeCurrentSearch}
          onDismissTopicDrift={() =>
            search.setTopicDriftDismissed(true)
          }
          onOpenMentor={workspace.openMentorFit}
          onOpenArtifact={onOpenArtifact}
          onOpenReadiness={openReadiness}
        />
      )
    );

  const paneOpen = layout.secondaryPaneMode !== "closed";
  const minSecondary = Math.min(
    45,
    Math.max(24, (360 / Math.max(containerWidth, 1)) * 100),
  );
  const maxSecondary = Math.max(
    minSecondary,
    Math.min(
      55,
      ((containerWidth - 540) / Math.max(containerWidth, 1)) *
      100,
    ),
  );
  const splitChatOpen =
    layout.secondaryPaneMode === "panel_chat";
  const effectiveMinSecondary = splitChatOpen
    ? 45
    : minSecondary;
  const effectiveMaxSecondary = splitChatOpen
    ? 55
    : maxSecondary;
  const desiredSecondarySize = Math.min(
    effectiveMaxSecondary,
    Math.max(
      effectiveMinSecondary,
      layout.secondaryPaneWidth,
    ),
  );
  const openingSecondaryPane =
    paneOpen &&
    desktop === true &&
    previousPaneModeRef.current === "closed";
  const paneEntering =
    openingSecondaryPane || secondaryAnimating;

  React.useEffect(() => {
    if (!paneOpen) {
      previousPaneModeRef.current = "closed";
      setSecondaryAnimating(false);
      setSecondaryCardSettled(false);
      setSecondaryContentVisible(false);
      setPanesSwapped(false);
      return;
    }

    if (desktop !== true) {
      setSecondaryCardSettled(true);
      setSecondaryContentVisible(true);
      return;
    }

    const opening =
      previousPaneModeRef.current === "closed";
    previousPaneModeRef.current =
      layout.secondaryPaneMode;

    if (!opening) {
      setSecondaryCardSettled(true);
      setSecondaryContentVisible(true);
      return;
    }

    if (
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches
    ) {
      secondaryPanelRef.current?.resize(
        desiredSecondarySize,
      );
      setSecondaryAnimating(false);
      setSecondaryCardSettled(true);
      setSecondaryContentVisible(true);
      return;
    }

    setSecondaryAnimating(true);
    setSecondaryCardSettled(false);
    setSecondaryContentVisible(false);

    let revealTimer: number | undefined;
    const animationFrame = window.requestAnimationFrame(() => {
      secondaryPanelRef.current?.resize(
        desiredSecondarySize,
      );
      setSecondaryCardSettled(true);
      revealTimer = window.setTimeout(() => {
        setSecondaryAnimating(false);
        setSecondaryContentVisible(true);
      }, 320);
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      if (revealTimer !== undefined) {
        window.clearTimeout(revealTimer);
      }
    };
  }, [
    desktop,
    desiredSecondarySize,
    layout.secondaryPaneMode,
    paneOpen,
  ]);

  const handlePaneLayout = React.useCallback(
    (sizes: number[]) => {
      if (
        !paneOpen ||
        desktop !== true ||
        paneEntering
      ) {
        return;
      }
      const width = panesSwapped ? sizes[0] : sizes[1];
      if (typeof width === "number") {
        workspace.setSecondaryPaneWidth(width);
      }
    },
    [
      desktop,
      paneOpen,
      paneEntering,
      panesSwapped,
      workspace.setSecondaryPaneWidth,
    ],
  );

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-[calc(100dvh-6rem)] flex-col xl:-my-3 xl:h-[calc(100dvh-1rem)] xl:min-h-0"
      aria-busy={
        !workspace.hydrated || generating || cycleReviewing
      }
    >
      {!workspace.hydrated || !workspace.activeSession ? (
        <div
          className="flex flex-1 items-center justify-center workspace-supporting text-workspace-muted-text"
          role="status"
        >
          {copy.workspace.loading}
        </div>
      ) : (
        <ResizablePanelGroup
          direction="horizontal"
          className={cn(
            "min-h-0 flex-1",
            paneOpen &&
              desktop === true &&
              "pr-2",
          )}
          onLayout={handlePaneLayout}
        >
          <ResizablePanel
            id="workspace-main-chat"
            order={panesSwapped ? 2 : 1}
            className={cn(
              paneEntering &&
                "transition-[flex-grow] duration-300 ease-out motion-reduce:transition-none",
            )}
            style={{ order: panesSwapped ? 3 : 1 }}
            minSize={
              paneOpen && desktop === true
                ? Math.max(
                    45,
                    100 - effectiveMaxSecondary,
                  )
                : undefined
            }
          >
            <section
              className={cn(
                "flex h-full min-h-0 min-w-0 flex-col",
                paneOpen &&
                  desktop === true &&
                  "overflow-hidden rounded-2xl border border-workspace-border bg-workspace-background",
              )}
            >
              <div className="flex h-11 shrink-0 items-center justify-end px-4">
                <WorkspaceActionBar
                  activeMode={layout.secondaryPaneMode}
                  onAnalysis={() =>
                    layout.secondaryPaneMode === "analysis"
                      ? workspace.closeSecondaryPane()
                      : workspace.openAnalysis()
                  }
                  onEvidence={() =>
                    layout.secondaryPaneMode === "evidence"
                      ? workspace.closeSecondaryPane()
                      : workspace.openEvidence()
                  }
                  onNewChat={createNewChat}
                  onSplitChat={() =>
                    layout.secondaryPaneMode === "panel_chat"
                      ? workspace.closeSecondaryPane()
                      : workspace.openSplitChat()
                  }
                  showSwap={paneOpen && desktop === true}
                  showClose={
                    paneOpen &&
                    desktop === true &&
                    panesSwapped
                  }
                  onSwap={() =>
                    setPanesSwapped((current) => !current)
                  }
                  onClose={workspace.closeSecondaryPane}
                />
              </div>
              {mainContent}
            </section>
          </ResizablePanel>
          {paneOpen && desktop === true ? (
            <>
              <ResizableHandle
                aria-label="Thay đổi chiều rộng panel phụ"
                className={cn(
                  "order-2 w-2.5 shrink-0 bg-transparent opacity-100 transition-opacity duration-150 after:w-2.5 focus-visible:ring-workspace-focus-ring motion-reduce:transition-none",
                  paneEntering &&
                    "pointer-events-none opacity-0",
                )}
              />
              <ResizablePanel
                ref={secondaryPanelRef}
                id="workspace-secondary-pane"
                order={panesSwapped ? 1 : 2}
                className={cn(
                  paneEntering &&
                    "transition-[flex-grow] duration-300 ease-out motion-reduce:transition-none",
                )}
                style={{ order: panesSwapped ? 1 : 3 }}
                defaultSize={
                  openingSecondaryPane
                    ? 0
                    : desiredSecondarySize
                }
                minSize={
                  paneEntering ? 0 : effectiveMinSecondary
                }
                maxSize={effectiveMaxSecondary}
              >
                <div
                  className={cn(
                    "relative h-full min-h-0 translate-x-4 overflow-hidden rounded-2xl border border-workspace-border transition-transform duration-300 ease-out motion-reduce:translate-x-0 motion-reduce:transition-none",
                    secondaryCardSettled && "translate-x-0",
                    layout.secondaryPaneMode === "panel_chat"
                      ? "bg-workspace-background"
                      : "bg-workspace-panel",
                  )}
                >
                  {!panesSwapped ? (
                    <button
                      type="button"
                      onClick={workspace.closeSecondaryPane}
                      className="absolute right-4 top-1.5 z-overlay inline-flex size-8 items-center justify-center rounded-lg text-workspace-muted-text transition-colors hover:bg-surface-2 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/50 motion-reduce:transition-none"
                      aria-label="Đóng panel phụ"
                      title="Đóng panel phụ"
                    >
                      <X className="size-4" />
                    </button>
                  ) : null}
                  <div
                    className={cn(
                      "h-full min-h-0 opacity-0 transition-opacity duration-150 motion-reduce:transition-none",
                      secondaryContentVisible &&
                        "opacity-100",
                      !secondaryContentVisible &&
                        "pointer-events-none",
                    )}
                  >
                    <SecondaryPane
                      workspace={workspace}
                      showClose={false}
                    />
                  </div>
                </div>
              </ResizablePanel>
            </>
          ) : null}
        </ResizablePanelGroup>
      )}

      <Sheet
        open={paneOpen && desktop === false}
        onOpenChange={(open) => {
          if (!open) workspace.closeSecondaryPane();
        }}
      >
        <SheetContent
          side="right"
          className="w-full max-w-none gap-0 border-workspace-border bg-workspace-panel p-0 sm:w-[min(680px,92vw)] sm:max-w-none xl:hidden"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Không gian làm việc phụ</SheetTitle>
            <SheetDescription>
              Phân tích, bằng chứng hoặc chat song song.
            </SheetDescription>
          </SheetHeader>
          <SecondaryPane
            workspace={workspace}
            showClose={false}
          />
        </SheetContent>
      </Sheet>
      <Toaster
        position="bottom-center"
        toastOptions={{
          classNames: {
            toast:
              "border-workspace-border bg-workspace-elevated text-ink",
          },
        }}
      />
    </div>
  );
}
