import type { AiWorkspaceCopy } from "../../copy/types";
import type {
  MaterialAnalysis,
  MentorRecommendation,
  StructuredResponse,
} from "../../types/ai-workspace.types";
import { CurrentFocusCard } from "./current-focus-card";
import { DecisionCycleCard } from "./decision-cycle-card";
import { EvidenceReviewCard } from "./evidence-review-card";
import { MaterialAnalysisCard } from "./material-analysis-card";
import { MentorRecommendationCard } from "./mentor-recommendation-card";
import { ReadinessChangeCard } from "./readiness-change-card";
import { SuggestedActionCard } from "./suggested-action-card";

export function StructuredResponseView({
  response,
  copy,
  onOpenCycle,
  onSendPrompt,
  onConfirmInterpretation,
  onOpenMentor,
  onDeferMentor,
  currentMaterialAnalysis,
  currentMentorRecommendation,
}: {
  response: StructuredResponse;
  copy: AiWorkspaceCopy;
  onOpenCycle: () => void;
  onSendPrompt: (prompt: string) => void;
  onConfirmInterpretation: (
    status: "confirmed" | "disputed",
  ) => void;
  onOpenMentor: () => void;
  onDeferMentor: () => void;
  currentMaterialAnalysis?: MaterialAnalysis;
  currentMentorRecommendation?: MentorRecommendation;
}) {
  switch (response.type) {
    case "current-focus":
      return (
        <CurrentFocusCard
          focus={response.payload}
          copy={copy}
          onOpenCycle={onOpenCycle}
          onExplain={() =>
            onSendPrompt(copy.prompts.explainBottleneck)
          }
        />
      );
    case "material-analysis":
      return (
        <MaterialAnalysisCard
          analysis={currentMaterialAnalysis ?? response.payload}
          copy={copy}
          onConfirm={() => onConfirmInterpretation("confirmed")}
          onChallenge={() => {
            onConfirmInterpretation("disputed");
            onSendPrompt(copy.prompts.challengeInterpretation);
          }}
          onCreateCycle={onOpenCycle}
        />
      );
    case "readiness-change":
      return (
        <ReadinessChangeCard
          readiness={response.payload}
          copy={copy}
          onOpenCycle={onOpenCycle}
        />
      );
    case "suggested-action":
      return (
        <SuggestedActionCard
          payload={response.payload}
          copy={copy}
          onOpenCycle={onOpenCycle}
        />
      );
    case "decision-cycle":
      return (
        <DecisionCycleCard
          cycle={response.payload}
          copy={copy}
          onOpen={onOpenCycle}
        />
      );
    case "evidence-review":
      return (
        <EvidenceReviewCard
          title={response.payload.title}
          summary={response.payload.summary}
          readiness={response.payload.readiness}
          copy={copy}
          onOpenCycle={onOpenCycle}
        />
      );
    case "mentor-recommendation":
      return (
        <MentorRecommendationCard
          mentor={
            currentMentorRecommendation ??
            response.payload
          }
          copy={copy}
          onOpenDetails={onOpenMentor}
          onDefer={onDeferMentor}
        />
      );
  }
}
