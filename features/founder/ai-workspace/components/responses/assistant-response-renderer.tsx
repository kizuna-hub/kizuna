import type { AiWorkspaceCopy } from "../../copy/types";
import type {
  AiWorkspaceMessage,
  AiWorkspaceState,
} from "../../types/ai-workspace.types";
import type { ReadinessCriterionId } from "../../readiness/types/readiness.types";
import { ActionProposalCard } from "./action-proposal-card";
import { ArtifactPreviewCard } from "./artifact-preview-card";
import { CompactInsightBlock } from "./compact-insight-block";
import { ConfirmedStateRow } from "./confirmed-state-row";
import { DocumentOnboardingAnalysisCard } from "./document-onboarding-analysis-card";
import { MentorRecommendationGrid } from "../../mentor-recommendation/components/mentor-recommendation-grid";
import { NextActionPlanCard } from "./next-action-plan-card";
import { PitchDeckReviewCard } from "./pitch-deck-review-card";
import { ReadinessEvidenceCard } from "./readiness-evidence-card";
import { TractionDiagnosisCard } from "./traction-diagnosis-card";

export function AssistantResponseRenderer({
  message,
  state,
  copy,
  onOpenCycle,
  onSendPrompt,
  onConfirmActionProposal,
  onOpenMentor,
  onConnectMentor,
  onToggleSaveMentor,
  onOpenArtifact,
  onOpenReadiness,
  onVerifyReadinessEvidence,
}: {
  message: AiWorkspaceMessage;
  state: AiWorkspaceState;
  copy: AiWorkspaceCopy;
  onOpenCycle: () => void;
  onSendPrompt: (prompt: string) => void;
  onConfirmActionProposal: (messageId: string) => void;
  onOpenMentor: (mentorId: string) => void;
  onConnectMentor: (mentorId: string) => void;
  onToggleSaveMentor: (mentorId: string) => void;
  onOpenArtifact: (
    surface: "documents" | "timeline",
  ) => void;
  onOpenReadiness: (criterionId?: ReadinessCriterionId) => void;
  onVerifyReadinessEvidence: () => void;
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
      if (structured?.type === "next-action") {
        return (
          <NextActionPlanCard
            plan={structured.payload}
            lifecycle={lifecycle}
            cycleLifecycle={state.decisionCycleLifecycle}
            onConfirm={() =>
              onConfirmActionProposal(message.id)
            }
            onOpenCycle={onOpenCycle}
          />
        );
      }
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
      if (
        structured?.type ===
        "document-onboarding-analysis"
      ) {
        return (
          <DocumentOnboardingAnalysisCard
            analysis={structured.payload}
            onOpenAnalysis={() => onOpenReadiness()}
            onOpenEvidence={() =>
              onOpenReadiness(
                "problem_and_user_understanding",
              )
            }
          />
        );
      }
      if (structured?.type === "pitch-deck-review") {
        return (
          <PitchDeckReviewCard
            review={structured.payload}
            onOpenSources={() =>
              onOpenReadiness(
                "customer_discovery_and_evidence",
              )
            }
          />
        );
      }
      if (structured?.type === "traction-diagnosis") {
        return (
          <TractionDiagnosisCard
            diagnosis={structured.payload}
            onOpenReadiness={() =>
              onOpenReadiness(
                "market_signal_and_commitment",
              )
            }
          />
        );
      }
      if (structured?.type === "readiness-evidence") {
        return (
          <ReadinessEvidenceCard
            evidence={structured.payload}
            canonicalScore={state.readiness.currentScore}
            onVerify={onVerifyReadinessEvidence}
          />
        );
      }
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

    case "mentor_recommendation_grid":
    case "mentor_intervention":
      return structured?.type ===
          "mentor-recommendation-grid" ||
        structured?.type === "mentor-recommendation" ? (
        <MentorRecommendationGrid
          recommendation={state.mentorRecommendation}
          fallbackPayload={structured.payload ?? undefined}
          connectionBriefs={state.mentorConnectionBriefs}
          connectionRequest={state.mentorConnectionRequest}
          onOpenDetails={onOpenMentor}
          onOpenConnection={onConnectMentor}
          onToggleSave={onToggleSaveMentor}
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
