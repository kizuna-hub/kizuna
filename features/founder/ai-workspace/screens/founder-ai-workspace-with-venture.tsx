"use client";

import dynamic from "next/dynamic";
import React from "react";
import { AlertCircle, CalendarClock } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getMentorPreparationSession } from "@/features/founder/mentor-sessions/demo/mentor-session-data";
import { FounderShell } from "@/features/founder/shell/founder-shell";
import { trackProductEvent } from "@/features/demo-domain/services/product-analytics";
import { usePathname, useRouter } from "@/i18n/routing";

import { WorkspaceSidebar } from "../components/conversation/workspace-sidebar";
import type { LongRunSurface } from "../components/long-run-artifact-sheet";
import { aiWorkspaceVi } from "../copy/vi";
import { useAiWorkspace } from "../hooks/use-ai-workspace";
import {
  createPinReference,
  pinTypeForSearchResult,
} from "../services/pin-reference";
import type { VentureSearchResult } from "../types/long-run-workspace.types";
import type {
  WorkspaceDestination,
  WorkspaceEntryPanel,
} from "../types/workspace-layout.types";
import type { FounderConversationSessionType } from "../conversation-history/types/conversation-session.types";
import { AiWorkspaceBody } from "./ai-workspace-body";

const LongRunArtifactSheet = dynamic(
  () =>
    import("../components/long-run-artifact-sheet").then(
      (module) => module.LongRunArtifactSheet,
    ),
  { ssr: false },
);

const VentureSearchDialog = dynamic(
  () =>
    import("../components/search/venture-search-dialog").then(
      (module) => module.VentureSearchDialog,
    ),
  { ssr: false },
);

const MentorSessionBrief = dynamic(
  () =>
    import(
      "@/features/founder/mentor-sessions/components/mentor-session-brief"
    ).then((module) => module.MentorSessionBrief),
  { ssr: false },
);

const workspaceDestinations = new Set<WorkspaceDestination>([
  "mentorship_continuity",
  "mentor_discovery",
  "connection_requests",
  "venture_brief",
  "documents",
  "conversation_history",
]);

const workspaceEntryPanels = new Set<WorkspaceEntryPanel>([
  "closed",
  "mentor_detail",
  "copilot",
  "connection_brief",
  "connection_status",
]);

function isWorkspaceDestination(
  value: string | null,
): value is WorkspaceDestination {
  return Boolean(
    value &&
      workspaceDestinations.has(value as WorkspaceDestination),
  );
}

function isWorkspaceEntryPanel(
  value: string | null,
): value is WorkspaceEntryPanel {
  return Boolean(
    value && workspaceEntryPanels.has(value as WorkspaceEntryPanel),
  );
}

export const FounderAiWorkspaceWithVenture = React.memo(
  function FounderAiWorkspaceWithVenture({
    ventureId,
  }: {
    ventureId: string;
  }) {
    const workspace = useAiWorkspace(ventureId);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const [searchOpen, setSearchOpen] =
      React.useState(false);
    const [artifactOpen, setArtifactOpen] =
      React.useState(false);
    const [artifactSurface, setArtifactSurface] =
      React.useState<LongRunSurface>("memory");
    const [jumpMessageId, setJumpMessageId] =
      React.useState<string>();
    const [contextNotice, setContextNotice] =
      React.useState<string>();
    const [mentorBriefOpen, setMentorBriefOpen] =
      React.useState(false);
    const handledContextRef = React.useRef<string | undefined>(
      undefined,
    );
    const workspaceRef = React.useRef(workspace);
    workspaceRef.current = workspace;
    const copy = aiWorkspaceVi.longRun;
    const queryString = searchParams.toString();
    const mentorSession = getMentorPreparationSession(
      searchParams.get("session") ?? undefined,
    );

    const openArtifact = React.useCallback(
      (surface: LongRunSurface) => {
        setArtifactSurface(surface);
        setArtifactOpen(true);
      },
      [],
    );

    const applyWorkspaceDestination = React.useCallback(
      (
        destination: WorkspaceDestination,
        panel: WorkspaceEntryPanel = "closed",
        mentorId?: string,
      ) => {
        const current = workspaceRef.current;
        current.setWorkspaceDestination(destination);
        current.setView("conversation");

        if (destination === "conversation_history") {
          setArtifactOpen(false);
          current.showConversationHistoryLibrary();
          return;
        }

        if (destination === "mentorship_continuity") {
          setArtifactOpen(false);
          current.closeSecondaryPane();
          return;
        }

        if (destination === "mentor_discovery") {
          setArtifactOpen(false);
          const selectedMentorId =
            mentorId ??
            current.state.mentorRecommendation?.selectedMentorId;
          if (
            panel === "mentor_detail" &&
            selectedMentorId
          ) {
            current.openMentorFit(selectedMentorId);
          } else {
            current.closeSecondaryPane();
          }
          return;
        }

        if (
          destination === "connection_requests" &&
          (panel === "connection_brief" ||
            panel === "connection_status")
        ) {
          const selectedMentorId =
            mentorId ??
            current.state.mentorRecommendation?.selectedMentorId;
          if (selectedMentorId) {
            current.openMentorConnection(selectedMentorId);
            return;
          }
        }

        current.closeSecondaryPane();
        if (destination === "venture_brief") {
          openArtifact("memory");
        } else if (destination === "documents") {
          openArtifact("documents");
        } else {
          setArtifactOpen(false);
        }
      },
      [openArtifact],
    );

    const navigateToDestination = React.useCallback(
      (destination: WorkspaceDestination) => {
        const params = new URLSearchParams(queryString);
        params.set("destination", destination);
        params.delete("surface");
        params.delete("panel");
        params.delete("mentor");
        params.delete("view");
        params.delete("session");

        let panel: WorkspaceEntryPanel = "closed";
        let mentorId: string | undefined;
        if (destination === "mentor_discovery") {
          panel = "mentor_detail";
          mentorId =
            workspaceRef.current.state.mentorRecommendation
              ?.selectedMentorId;
          params.set("panel", panel);
          if (mentorId) params.set("mentor", mentorId);
        } else if (destination === "venture_brief") {
          params.set("surface", "memory");
        } else if (destination === "documents") {
          params.set("surface", "documents");
        }

        applyWorkspaceDestination(destination, panel, mentorId);
        if (destination === "mentorship_continuity") {
          const journey = workspaceRef.current.mentorshipJourney;
          trackProductEvent("mentorship_destination_opened", {
            ventureId,
            mentorId: journey?.mentorId ?? "unknown",
            connectionRequestId:
              journey?.connectionRequestId ?? "unknown",
          });
        }
        router.push(`${pathname}?${params.toString()}`);
      },
      [applyWorkspaceDestination, pathname, queryString, router, ventureId],
    );

    const openHistorySession = React.useCallback(
      (sessionId: string) => {
        const current = workspaceRef.current;
        if (!current.openConversationHistorySession(sessionId)) {
          return;
        }
        const params = new URLSearchParams(queryString);
        params.set("destination", "conversation_history");
        params.set("session", sessionId);
        params.delete("conversation");
        params.delete("surface");
        params.delete("panel");
        params.delete("mentor");
        params.delete("view");
        router.push(`${pathname}?${params.toString()}`);
      },
      [pathname, queryString, router],
    );

    const backToHistory = React.useCallback(() => {
      workspaceRef.current.showConversationHistoryLibrary();
      const params = new URLSearchParams(queryString);
      params.set("destination", "conversation_history");
      params.delete("session");
      params.delete("conversation");
      params.delete("panel");
      params.delete("mentor");
      router.push(`${pathname}?${params.toString()}`);
    }, [pathname, queryString, router]);

    const createHistorySession = React.useCallback(
      (type: FounderConversationSessionType) => {
        const sessionId =
          workspaceRef.current.createMentorConversationSession(type);
        if (!sessionId) return;
        const params = new URLSearchParams(queryString);
        params.set("destination", "conversation_history");
        params.set("session", sessionId);
        params.delete("conversation");
        params.delete("surface");
        params.delete("panel");
        params.delete("mentor");
        params.delete("view");
        router.push(`${pathname}?${params.toString()}`);
      },
      [pathname, queryString, router],
    );

    React.useEffect(() => {
      if (
        !workspace.hydrated ||
        !workspace.demoDomainHydrated ||
        handledContextRef.current === queryString
      ) {
        return;
      }
      handledContextRef.current = queryString;
      const current = workspaceRef.current;

      const conversationId =
        searchParams.get("conversation");
      if (conversationId) {
        const exists = current.longRun.sessions.some(
          (session) =>
            session.id === conversationId &&
            !session.isArchived,
        );
        if (exists) {
          current.switchConversation(conversationId);
        } else {
          setContextNotice(
            "Cuộc trò chuyện gần nhất không còn tồn tại. Kizuna đã mở cuộc trò chuyện khả dụng mới nhất.",
          );
        }
      }

      if (searchParams.get("view") === "decision-cycle") {
        current.setView("decision-cycle");
      }

      const destination = searchParams.get("destination");
      const panel = searchParams.get("panel");
      if (isWorkspaceDestination(destination)) {
        applyWorkspaceDestination(
          destination,
          isWorkspaceEntryPanel(panel) ? panel : "closed",
          searchParams.get("mentor") ?? undefined,
        );
        if (destination === "conversation_history") {
          const historySessionId = searchParams.get("session");
          if (historySessionId) {
            const opened =
              current.openConversationHistorySession(
                historySessionId,
              );
            if (!opened && !mentorSession) {
              current.showConversationHistoryLibrary();
              setContextNotice(
                "Chưa thể tải cuộc trao đổi này. Nội dung của bạn vẫn được giữ lại.",
              );
              const params = new URLSearchParams(queryString);
              params.delete("session");
              router.replace(
                `${pathname}?${params.toString()}`,
              );
            }
          }
        }
      } else if (conversationId || mentorSession) {
        applyWorkspaceDestination("conversation_history");
      } else if (
        searchParams.get("view") === "decision-cycle"
      ) {
        current.setWorkspaceDestination(
          "conversation_history",
        );
        current.closeSecondaryPane();
      }

      const surface = searchParams.get("surface");
      if (
        surface === "memory" ||
        surface === "summary" ||
        surface === "timeline" ||
        surface === "documents" ||
        surface === "pinned"
      ) {
        openArtifact(surface);
      } else if (
        searchParams.has("document") ||
        searchParams.has("analysis")
      ) {
        openArtifact("documents");
      } else if (searchParams.has("memory")) {
        openArtifact("memory");
      }

      if (mentorSession) {
        if (
          current.longRun.sessions.some(
            (session) =>
              session.id === mentorSession.conversationId &&
              !session.isArchived,
          )
        ) {
          current.switchConversation(
            mentorSession.conversationId,
          );
        }
        setMentorBriefOpen(true);
      }

      if (
        searchParams.get("notice") === "target-unavailable"
      ) {
        setContextNotice(
          "Nội dung bạn mở không còn tồn tại hoặc đã được di chuyển. Kizuna đã đưa bạn về ngữ cảnh workspace hiện tại.",
        );
      }
    }, [
      mentorSession,
      applyWorkspaceDestination,
      openArtifact,
      queryString,
      pathname,
      router,
      searchParams,
      workspace.hydrated,
      workspace.demoDomainHydrated,
    ]);

    const askSource = (sourceId: string, title: string) => {
      workspace.attachSourceToDraft(sourceId, title);
      setArtifactOpen(false);
      setSearchOpen(false);
    };

    const openSearchResult = (
      result: VentureSearchResult,
    ) => {
      if (result.conversationId) {
        workspace.switchConversation(
          result.conversationId,
        );
      }
      if (result.messageId) {
        setJumpMessageId(result.messageId);
      } else if (result.contentType === "document") {
        openArtifact("documents");
      } else if (result.contentType === "readiness") {
        openArtifact("timeline");
      } else {
        openArtifact("memory");
      }
      setSearchOpen(false);
    };

    return (
      <FounderShell
        ventureId={ventureId}
        navigationScope="global"
        contentWidth="fluid"
        edgeToEdgeDesktop
        collapsible
        renderSidebar={(sidebarProps) => (
          <WorkspaceSidebar
            ventureId={ventureId}
            collapsed={sidebarProps.collapsed}
            destination={workspace.layout.destination}
            onNavigate={sidebarProps.onNavigate}
            onToggleCollapsed={
              sidebarProps.onToggleCollapsed
            }
            copy={copy}
            onDestinationChange={navigateToDestination}
            hasAcceptedMentorConnection={Boolean(
              workspace.acceptedMentorConnection,
            )}
          />
        )}
      >
        {contextNotice ? (
          <div
            role="status"
            className="mb-3 flex items-start gap-3 rounded-xl border border-workspace-warning/30 bg-workspace-warning-soft px-3.5 py-3 workspace-supporting text-ink"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-workspace-warning" />
            <span className="min-w-0 flex-1">
              {contextNotice}
            </span>
            <button
              type="button"
              onClick={() => setContextNotice(undefined)}
              className="workspace-meta text-workspace-muted-text hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40"
            >
              Đóng
            </button>
          </div>
        ) : null}

        {mentorSession && !mentorBriefOpen ? (
          <div className="mb-3 flex flex-col gap-3 rounded-xl border border-workspace-warning/30 bg-workspace-panel px-3.5 py-3 sm:flex-row sm:items-center">
            <CalendarClock className="size-4 shrink-0 text-workspace-warning" />
            <div className="min-w-0 flex-1">
              <p className="workspace-supporting font-medium text-ink">
                Phiên với {mentorSession.mentorName} bắt đầu sau
                30 phút
              </p>
              <p className="workspace-meta text-workspace-muted-text">
                {mentorSession.goal}
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => setMentorBriefOpen(true)}
              className="h-10 workspace-control-text"
            >
              Mở brief phiên
            </Button>
          </div>
        ) : null}

        <AiWorkspaceBody
          workspace={workspace}
          onOpenSearch={() => setSearchOpen(true)}
          jumpMessageId={jumpMessageId}
          onJumpHandled={() =>
            setJumpMessageId(undefined)
          }
          overlayOpen={searchOpen || artifactOpen}
          onOpenArtifact={openArtifact}
          onOpenHistorySession={openHistorySession}
          onBackToHistory={backToHistory}
          onCreateHistorySession={createHistorySession}
          onNavigateToMentorDiscovery={() =>
            navigateToDestination("mentor_discovery")
          }
          showLegacyConversation={Boolean(mentorSession)}
        />

        <VentureSearchDialog
          open={searchOpen}
          copy={copy}
          onOpenChange={setSearchOpen}
          onSearch={workspace.searchVenture}
          onOpenResult={openSearchResult}
          onAskKizuna={(result) => {
            workspace.askKizunaAboutResult(result);
            setSearchOpen(false);
          }}
          onTogglePin={(result) =>
            workspace.togglePin(
              createPinReference(
                ventureId,
                result.sourceId,
                result.title,
                result.sourceLabel,
                pinTypeForSearchResult(result),
              ),
            )
          }
        />

        <LongRunArtifactSheet
          open={artifactOpen}
          surface={artifactSurface}
          state={workspace.longRun}
          activeSummary={workspace.activeSummary}
          copy={copy}
          onOpenChange={setArtifactOpen}
          onSurfaceChange={setArtifactSurface}
          onSetMemoryStatus={
            workspace.setMemoryStatus
          }
          onResolveConflict={workspace.resolveConflict}
          onEditSummaryItem={workspace.editSummaryItem}
          onSetSummaryStatus={
            workspace.setSummaryStatus
          }
          onSetMaterialStatus={
            workspace.setMaterialStatus
          }
          onRemoveMaterial={workspace.removeMaterial}
          onTogglePin={workspace.togglePin}
          onAsk={askSource}
          onOpenCycle={() =>
            workspace.setView("decision-cycle")
          }
        />

        {mentorSession ? (
          <MentorSessionBrief
            session={mentorSession}
            open={mentorBriefOpen}
            onOpenChange={setMentorBriefOpen}
            onAskKizuna={() => {
              setMentorBriefOpen(false);
              workspace.setView("conversation");
              void workspace.sendMessage(
                "Gợi ý thêm các câu hỏi quan trọng cho phiên mentor sắp tới.",
              );
            }}
            onOpenCycle={() => {
              setMentorBriefOpen(false);
              workspace.setView("decision-cycle");
            }}
          />
        ) : null}
      </FounderShell>
    );
  },
);
