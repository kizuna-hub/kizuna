import type { AiWorkspaceCopy } from "../../copy/types";
import type {
  AiWorkspaceMessage,
  AiWorkspaceState,
} from "../../types/ai-workspace.types";
import { ActionProposalCard } from "./action-proposal-card";
import { ArtifactPreviewCard } from "./artifact-preview-card";
import { CompactInsightBlock } from "./compact-insight-block";
import { ConfirmedStateRow } from "./confirmed-state-row";
import { MentorInterventionCard } from "./mentor-intervention-card";

export function AssistantResponseRenderer({
  message,
  state,
  copy,
  onOpenCycle,
  onSendPrompt,
  onConfirmActionProposal,
  onOpenMentor,
  onDeferMentor,
  onOpenArtifact,
}: {
  message: AiWorkspaceMessage;
  state: AiWorkspaceState;
  copy: AiWorkspaceCopy;
  onOpenCycle: () => void;
  onSendPrompt: (prompt: string) => void;
  onConfirmActionProposal: (messageId: string) => void;
  onOpenMentor: () => void;
  onDeferMentor: () => void;
  onOpenArtifact: (
    surface: "documents" | "timeline",
  ) => void;
}) {
  if (message.role !== "assistant") return null;

  const lifecycle = message.responseLifecycle ?? "completed";
  const structured = message.structuredResponse;

  switch (message.responseKind) {
    case "conversation":
      return null;

    case "insight":
      return structured?.type === "current-focus" ? (
        <CompactInsightBlock
          focus={structured.payload}
          lifecycle={lifecycle}
          sourceCount={message.sources?.length ?? 0}
          copy={copy}
          onViewEvidence={() =>
            onSendPrompt(
              "Bằng chứng nào đang hỗ trợ kết luận này?",
            )
          }
        />
      ) : null;

    case "action_proposal":
      return structured?.type === "suggested-action" ? (
        <ActionProposalCard
          proposal={structured.payload}
          confirmedSummary={
            state.currentFocus.label ??
            state.decisionCycle.title
          }
          lifecycle={lifecycle}
          cycleLifecycle={state.decisionCycleLifecycle}
          copy={copy}
          onConfirm={() =>
            onConfirmActionProposal(message.id)
          }
          onEdit={() =>
            onSendPrompt(
              "Hãy chỉnh đề xuất để thử nghiệm nhỏ hơn và dễ đo hơn.",
            )
          }
          onOpenCycle={onOpenCycle}
        />
      ) : null;

    case "state_confirmation":
      return structured?.type === "decision-cycle" ? (
        <ConfirmedStateRow
          title={copy.response.cycleCreated}
          summary={structured.payload.title}
          detail={`${copy.response.currentStep}: ${
            copy.cycle.steps[structured.payload.currentStep]
              .label
          }`}
          actionLabel={copy.response.openCycle}
          onOpen={onOpenCycle}
        />
      ) : null;

    case "artifact_preview":
      if (structured?.type === "material-analysis") {
        return (
          <ArtifactPreviewCard
            title={copy.response.materialAnalysis}
            summary={structured.payload.summary}
            items={structured.payload.findings.map(
              (finding) =>
                `${finding.label}: ${finding.detail}`,
            )}
            lifecycle={lifecycle}
            copy={copy}
            onOpen={() => onOpenArtifact("documents")}
          />
        );
      }
      if (structured?.type === "evidence-review") {
        return (
          <ArtifactPreviewCard
            title={structured.payload.title}
            summary={structured.payload.summary}
            items={[
              `${copy.response.readiness}: ${structured.payload.readiness.previousScore} → ${structured.payload.readiness.currentScore}`,
              ...structured.payload.readiness.supportedBy,
            ]}
            lifecycle={lifecycle}
            copy={copy}
            onOpen={() => onOpenArtifact("timeline")}
          />
        );
      }
      if (structured?.type === "readiness-change") {
        return (
          <ArtifactPreviewCard
            title={copy.response.readiness}
            summary={structured.payload.explanation}
            items={structured.payload.breakdown.map(
              (dimension) =>
                `${dimension.label}: ${dimension.score}/100`,
            )}
            lifecycle={lifecycle}
            copy={copy}
            onOpen={() => onOpenArtifact("timeline")}
          />
        );
      }
      return null;

    case "mentor_intervention":
      return structured?.type ===
        "mentor-recommendation" ? (
        <MentorInterventionCard
          mentor={
            state.mentorRecommendation ??
            structured.payload
          }
          session={state.mentorSession}
          lifecycle={lifecycle}
          copy={copy}
          onOpenDetails={onOpenMentor}
          onContinueWithAi={onDeferMentor}
        />
      ) : null;

    case "warning":
    case "error":
      return (
        <div
          role="alert"
          className="rounded-lg border border-workspace-danger/30 bg-workspace-danger-soft px-3 py-2.5 workspace-meta text-ink"
        >
          {message.content}
        </div>
      );
  }
}
