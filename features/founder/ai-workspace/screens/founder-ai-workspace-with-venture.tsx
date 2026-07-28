"use client";

import React from "react";
import { AlertCircle, CalendarClock } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { MentorSessionBrief } from "@/features/founder/mentor-sessions/components/mentor-session-brief";
import { getMentorPreparationSession } from "@/features/founder/mentor-sessions/demo/mentor-session-data";
import { FounderShell } from "@/features/founder/shell/founder-shell";

import { WorkspaceSidebar } from "../components/conversation/workspace-sidebar";
import {
  LongRunArtifactSheet,
  type LongRunSurface,
} from "../components/long-run-artifact-sheet";
import { VentureSearchDialog } from "../components/search/venture-search-dialog";
import { aiWorkspaceVi } from "../copy/vi";
import { useAiWorkspace } from "../hooks/use-ai-workspace";
import {
  createPinReference,
  pinTypeForSearchResult,
} from "../services/pin-reference";
import type { VentureSearchResult } from "../types/long-run-workspace.types";
import { AiWorkspaceBody } from "./ai-workspace-body";

export const FounderAiWorkspaceWithVenture = React.memo(
  function FounderAiWorkspaceWithVenture({
    ventureId,
  }: {
    ventureId: string;
  }) {
    const workspace = useAiWorkspace(ventureId);
    const searchParams = useSearchParams();
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
    const initializedContextRef = React.useRef(false);
    const copy = aiWorkspaceVi.longRun;
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

    React.useEffect(() => {
      if (!workspace.hydrated || initializedContextRef.current) {
        return;
      }
      initializedContextRef.current = true;

      const conversationId =
        searchParams.get("conversation");
      if (conversationId) {
        const exists = workspace.longRun.sessions.some(
          (session) =>
            session.id === conversationId &&
            !session.isArchived,
        );
        if (exists) {
          workspace.switchConversation(conversationId);
        } else {
          setContextNotice(
            "Cuộc trò chuyện gần nhất không còn tồn tại. Kizuna đã mở cuộc trò chuyện khả dụng mới nhất.",
          );
        }
      }

      if (searchParams.get("view") === "decision-cycle") {
        workspace.setView("decision-cycle");
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
          workspace.longRun.sessions.some(
            (session) =>
              session.id === mentorSession.conversationId &&
              !session.isArchived,
          )
        ) {
          workspace.switchConversation(
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
      openArtifact,
      searchParams,
      workspace,
      workspace.hydrated,
    ]);

    const sessionGroups = React.useMemo(
      () => [
        {
          label: copy.sidebar.today,
          sessions: workspace.groupedSessions.today,
        },
        {
          label: copy.sidebar.recent,
          sessions:
            workspace.groupedSessions.recent.filter(
              (session) =>
                session.category !== "decision_cycle",
            ),
        },
        {
          label: copy.sidebar.decisionCycles,
          sessions:
            workspace.groupedSessions.decisionCycles.filter(
              (session) =>
                !workspace.groupedSessions.today.some(
                  (today) => today.id === session.id,
                ),
            ),
        },
        {
          label: copy.sidebar.older,
          sessions:
            workspace.groupedSessions.older.filter(
              (session) =>
                session.category !== "decision_cycle",
            ),
        },
      ],
      [copy.sidebar, workspace.groupedSessions],
    );

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
            collapsed={sidebarProps.collapsed}
            onNavigate={sidebarProps.onNavigate}
            onToggleCollapsed={
              sidebarProps.onToggleCollapsed
            }
            sessions={sessionGroups}
            activeConversationId={
              workspace.longRun.activeConversationId
            }
            pinnedItems={workspace.longRun.pinnedItems}
            copy={copy}
            onCreateConversation={() =>
              workspace.createConversation()
            }
            onOpenSearch={() => setSearchOpen(true)}
            onOpenSurface={openArtifact}
            onSelectConversation={
              workspace.switchConversation
            }
            onRenameConversation={
              workspace.renameConversation
            }
            onDeleteConversation={
              workspace.deleteConversation
            }
            onOpenConversationInPanel={
              workspace.openConversationInPanel
            }
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
