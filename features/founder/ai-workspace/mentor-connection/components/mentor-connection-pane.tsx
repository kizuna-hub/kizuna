"use client";

import {
  AlertCircle,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";

import type { useAiWorkspace } from "../../hooks/use-ai-workspace";
import { selectMentorMatch } from "../../mentor-recommendation/state/mentor-recommendation-selectors";
import { createMentorContextFingerprint } from "../services/mock-mentor-connection-brief-generator";
import { isMentorConnectionContextStale } from "../state/mentor-connection-selectors";
import { validateMentorBriefContext } from "../state/mentor-connection-state";
import type { MentorConnectionBriefSectionId } from "../types/mentor-connection.types";
import { MentorBriefSection } from "./mentor-brief-section";
import { MentorConnectionFooter } from "./mentor-connection-footer";
import { MentorConnectionHeader } from "./mentor-connection-header";
import { MentorConnectionPreview } from "./mentor-connection-preview";
import { MentorConnectionSuccess } from "./mentor-connection-success";
import { MentorContextClarification } from "./mentor-context-clarification";
import { MentorSendConfirmation } from "./mentor-send-confirmation";
import { MentorSharedContext } from "./mentor-shared-context";
import { MentorSummary } from "./mentor-summary";

type Workspace = ReturnType<typeof useAiWorkspace>;

export function MentorConnectionPane({
  workspace,
  showClose = true,
}: {
  workspace: Workspace;
  showClose?: boolean;
}) {
  const [editingSection, setEditingSection] =
    React.useState<MentorConnectionBriefSectionId>();
  const [contextExpanded, setContextExpanded] =
    React.useState(false);
  const [confirmationOpen, setConfirmationOpen] =
    React.useState(false);
  const brief = workspace.mentorConnectionBrief;
  const operation = workspace.state.mentorConnectionOperation;
  const request = workspace.state.mentorConnectionRequest;
  const mentor = selectMentorMatch(
    workspace.state.mentorRecommendation,
    operation.activeMentorId,
  );
  const validation = validateMentorBriefContext(brief);
  const currentFingerprint = createMentorContextFingerprint({
    canonicalVentureContext: {
      ventureName:
        workspace.state.readiness.assessment.ventureName,
      ventureStage:
        workspace.state.readiness.assessment.ventureStage,
      ventureSummary:
        "Nền tảng giúp câu lạc bộ trong trường onboarding và hỗ trợ thành viên mới.",
    },
    currentFocus: workspace.state.currentFocus,
    readiness: workspace.state.readiness,
  });
  const stale = isMentorConnectionContextStale(
    brief,
    currentFingerprint,
  );
  const matchingRequest =
    request &&
    mentor &&
    request.mentorId === mentor.mentorId
      ? request
      : undefined;

  if (matchingRequest) {
    return (
      <MentorConnectionSuccess
        request={matchingRequest}
        onClose={workspace.closeSecondaryPane}
      />
    );
  }

  if (operation.clarification) {
    return (
      <MentorContextClarification
        kind={operation.clarification.kind}
        prompt={operation.clarification.prompt}
        working={operation.generationStatus === "working"}
        onSubmit={workspace.answerMentorConnectionClarification}
      />
    );
  }

  if (
    !brief &&
    operation.generationStatus === "working"
  ) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex min-h-full items-center justify-center p-5"
      >
        <div className="text-center">
          <LoaderCircle className="mx-auto size-6 animate-spin text-primary motion-reduce:animate-none" />
          <h2 className="mt-3 workspace-section-title text-ink">
            Kizuna đang chuẩn bị Connection Brief
          </h2>
          <p className="mt-2 max-w-sm workspace-supporting text-workspace-muted-text">
            Đang tổng hợp Current Focus, evidence đã xác minh và
            readiness gap. Yêu cầu sẽ không được tự động gửi.
          </p>
        </div>
      </div>
    );
  }

  if (!brief) {
    return (
      <div
        role="alert"
        className="flex min-h-full items-center justify-center p-5"
      >
        <section className="w-full max-w-sm text-center">
          <AlertCircle className="mx-auto size-6 text-workspace-danger" />
          <h2 className="mt-3 workspace-section-title text-ink">
            Kizuna chưa thể chuẩn bị yêu cầu kết nối
          </h2>
          <p className="mt-2 workspace-supporting text-workspace-muted-text">
            {operation.errorMessage ??
              "Nội dung bạn đã nhập vẫn được giữ lại."}
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Button
              type="button"
              onClick={() =>
                void workspace.retryMentorConnectionGeneration()
              }
            >
              Thử lại
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                workspace.answerMentorConnectionClarification(
                  "Founder sẽ tự rà soát và hoàn thiện mục tiêu phiên mentor.",
                )
              }
            >
              Điền thủ công
            </Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <aside className="flex h-full min-h-0 flex-col bg-workspace-panel">
      <MentorConnectionHeader
        showClose={showClose}
        onClose={workspace.closeSecondaryPane}
      />

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-4 p-4 pb-6">
          <MentorSummary mentor={brief.mentorSnapshot} />

          {stale ? (
            <div
              role="status"
              className="rounded-xl border border-workspace-warning/30 bg-workspace-warning-soft p-3"
            >
              <p className="workspace-supporting font-medium text-ink">
                Context của venture đã thay đổi sau khi nháp được tạo.
              </p>
              <p className="mt-1 workspace-meta text-workspace-muted-text">
                Kizuna sẽ giữ nguyên mọi phần founder đã chỉnh sửa.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={workspace.refreshMentorConnection}
                >
                  <RefreshCw className="size-3.5" />
                  Cập nhật nháp bằng context mới
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={workspace.keepMentorConnectionDraft}
                >
                  Giữ nội dung hiện tại
                </Button>
              </div>
            </div>
          ) : null}

          <section className="rounded-xl border border-workspace-border bg-workspace-elevated px-4">
            {brief.sections.map((section) => (
              <MentorBriefSection
                key={section.id}
                section={section}
                sources={brief.sources}
                editing={editingSection === section.id}
                editDisabled={
                  editingSection !== undefined &&
                  editingSection !== section.id
                }
                onEdit={() => setEditingSection(section.id)}
                onCancel={() => setEditingSection(undefined)}
                onSave={(content, checklistItems) => {
                  workspace.updateMentorConnectionSection(
                    section.id,
                    content,
                    checklistItems,
                  );
                  setEditingSection(undefined);
                }}
              />
            ))}
          </section>

          <MentorSharedContext
            brief={brief}
            expanded={contextExpanded}
            onExpandedChange={setContextExpanded}
            onToggleContext={
              workspace.toggleMentorConnectionContext
            }
            onToggleEvidence={
              workspace.toggleMentorConnectionEvidence
            }
            onToggleDocument={
              workspace.toggleMentorConnectionDocument
            }
          />

          <MentorConnectionPreview brief={brief} />

          {!validation.valid ? (
            <p
              id="mentor-connection-validation"
              role="alert"
              className="workspace-meta text-workspace-warning"
            >
              {validation.message}
            </p>
          ) : null}

          {brief.status === "failed" ? (
            <div
              role="alert"
              className="rounded-xl border border-workspace-danger/30 bg-workspace-danger-soft p-3"
            >
              <p className="workspace-supporting font-medium text-ink">
                Chưa thể gửi yêu cầu lúc này.
              </p>
              <p className="mt-1 workspace-meta text-workspace-muted-text">
                Nội dung của bạn vẫn được giữ lại.
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="mt-2"
                onClick={() =>
                  setConfirmationOpen(true)
                }
              >
                Thử lại
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      <MentorConnectionFooter
        operation={operation}
        canSend={validation.valid}
        editing={editingSection !== undefined}
        onSave={() => void workspace.saveMentorConnectionDraft()}
        onCancel={workspace.closeSecondaryPane}
        onSend={() => setConfirmationOpen(true)}
      />

      <MentorSendConfirmation
        open={confirmationOpen}
        brief={brief}
        onOpenChange={setConfirmationOpen}
        onConfirm={() => {
          setConfirmationOpen(false);
          void workspace.sendMentorConnection();
        }}
      />
    </aside>
  );
}
