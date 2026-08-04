"use client";

import { ArrowRight, Send, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { useAiWorkspace } from "../../hooks/use-ai-workspace";
import { MentorConnectionPreview } from "../../mentor-connection/components/mentor-connection-preview";
import { MentorRecommendationGrid } from "../../mentor-recommendation/components/mentor-recommendation-grid";
import { selectMentorMatch } from "../../mentor-recommendation/state/mentor-recommendation-selectors";

type Workspace = ReturnType<typeof useAiWorkspace>;

const connectionStatusLabels = {
  pending: "Đang chờ phản hồi",
  accepted: "Đã chấp nhận",
  declined: "Đã từ chối",
} as const;

export function MentorDiscoveryWorkspaceView({
  workspace,
}: {
  workspace: Workspace;
}) {
  const recommendation = workspace.state.mentorRecommendation;

  return (
    <section
      aria-labelledby="mentor-discovery-heading"
      className="no-scrollbar min-h-0 flex-1 overflow-y-auto"
    >
      <div className="mx-auto w-full max-w-5xl px-5 pb-10 pt-4 sm:px-7">
        <div className="mb-5 max-w-2xl">
          <p className="workspace-eyebrow text-primary">
            Không gian venture
          </p>
          <h1
            id="mentor-discovery-heading"
            className="mt-1 workspace-page-title text-ink"
          >
            Mentor phù hợp với CampusFlow
          </h1>
          <p className="mt-2 workspace-supporting text-workspace-muted-text">
            Gợi ý được đối chiếu từ Venture Brief, nhu cầu hỗ trợ và
            outcome mà team muốn chốt ở giai đoạn Prototype.
          </p>
        </div>

        {recommendation ? (
          <MentorRecommendationGrid
            recommendation={recommendation}
            connectionBriefs={
              workspace.state.mentorConnectionBriefs
            }
            connectionRequest={
              workspace.state.mentorConnectionRequest
            }
            onOpenDetails={workspace.openMentorFit}
            onOpenConnection={workspace.openMentorConnection}
            onToggleSave={workspace.toggleSaveMentor}
          />
        ) : (
          <div
            role="status"
            className="rounded-xl border border-workspace-border bg-workspace-panel p-8 text-center"
          >
            <UsersRound className="mx-auto size-6 text-primary" />
            <p className="mt-3 workspace-card-title text-ink">
              Chưa có mentor phù hợp để hiển thị.
            </p>
            <p className="mt-1 workspace-meta text-workspace-muted-text">
              Kizuna cần Venture Brief và nhu cầu hỗ trợ trước khi đối
              chiếu mentor.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export function ConnectionRequestsWorkspaceView({
  workspace,
}: {
  workspace: Workspace;
}) {
  const recommendation = workspace.state.mentorRecommendation;
  const mentor = selectMentorMatch(
    recommendation,
    workspace.layout.selectedMentorId,
  );
  const brief = mentor
    ? workspace.state.mentorConnectionBriefs[mentor.mentorId]
    : undefined;
  const request = workspace.state.mentorConnectionRequest;

  return (
    <section
      aria-labelledby="connection-requests-heading"
      className="no-scrollbar min-h-0 flex-1 overflow-y-auto"
    >
      <div className="mx-auto w-full max-w-4xl px-5 pb-10 pt-4 sm:px-7">
        <p className="workspace-eyebrow text-primary">
          Không gian venture
        </p>
        <h1
          id="connection-requests-heading"
          className="mt-1 workspace-page-title text-ink"
        >
          Yêu cầu kết nối
        </h1>
        <p className="mt-2 workspace-supporting text-workspace-muted-text">
          Theo dõi brief và trạng thái kết nối mentor của CampusFlow.
        </p>

        <div className="mt-5">
          {brief ? (
            <div className="space-y-3">
              <MentorConnectionPreview brief={brief} />
              {request ? (
                <p className="rounded-xl border border-workspace-border bg-workspace-panel px-4 py-3 workspace-supporting text-ink">
                  Trạng thái hiện tại:{" "}
                  {connectionStatusLabels[request.status]}
                </p>
              ) : null}
              <Button
                type="button"
                onClick={() =>
                  workspace.openMentorConnection(brief.mentorId)
                }
              >
                Mở yêu cầu kết nối
                <ArrowRight className="size-4" />
              </Button>
            </div>
          ) : mentor ? (
            <div className="rounded-xl border border-workspace-border bg-workspace-panel p-6">
              <Send className="size-5 text-primary" />
              <h2 className="mt-3 workspace-card-title text-ink">
                Chưa có yêu cầu kết nối
              </h2>
              <p className="mt-1 workspace-supporting text-workspace-muted-text">
                Tạo brief kết nối với {mentor.profile.name} từ context
                hiện tại của CampusFlow.
              </p>
              <Button
                type="button"
                className="mt-4"
                onClick={() =>
                  workspace.openMentorConnection(mentor.mentorId)
                }
              >
                Chuẩn bị yêu cầu
                <ArrowRight className="size-4" />
              </Button>
            </div>
          ) : (
            <p className="rounded-xl border border-workspace-border bg-workspace-panel p-6 workspace-supporting text-workspace-muted-text">
              Chọn mentor phù hợp trước khi tạo yêu cầu kết nối.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
