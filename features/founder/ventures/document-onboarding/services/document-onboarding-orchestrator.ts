import {
  AI_WORKSPACE_STORAGE_KEY,
  createDocumentAnalysisWorkspaceBootstrap,
  serializeAiWorkspaceBootstrap,
  type DocumentAnalysisWorkspaceBootstrap,
} from "../../../ai-workspace/onboarding/document-analysis-workspace-bootstrap";
import {
  confirmDemoVentureSetup,
  createDemoVenture,
  getVentureById,
  serializeDemoWorkspaceState,
  updateDemoVentureSetup,
} from "../../../venture-foundation/demo-repository";
import { DEMO_WORKSPACE_STORAGE_KEY } from "../../../venture-foundation/demo-seed";
import type { DemoWorkspaceState } from "../../../venture-foundation/types";
import type { Evidence } from "../../../../venture/core";
import type { VentureSource } from "../../../../venture/decision-loop/domain/source";

import type {
  CompleteDocumentOnboardingInput,
  CompleteDocumentOnboardingResult,
  StartupDocumentInput,
  VentureAnalysisResult,
} from "../types/venture-analysis.types";

export interface DocumentOnboardingOrchestrationResult
  extends CompleteDocumentOnboardingResult {
  state: DemoWorkspaceState;
  aiWorkspaceBootstrap: DocumentAnalysisWorkspaceBootstrap;
}

export interface DocumentOnboardingStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

function sourceId(
  ventureId: string,
  document: StartupDocumentInput,
) {
  return `source-${ventureId}-${document.role}`;
}

function canonicalSources(
  ventureId: string,
  analysis: VentureAnalysisResult,
  createdAt: string,
): VentureSource[] {
  return analysis.sourceDocuments.map((document) => ({
    id: sourceId(ventureId, document),
    ventureId,
    title: document.name,
    kind:
      document.role === "pitch_deck"
        ? ("pitch-deck" as const)
        : ("document" as const),
    origin: "founder-authored",
    authorName: "Nhóm CampusFlow",
    summary:
      document.role === "pitch_deck"
        ? "Problem, customer discovery và prototype learning."
        : "Pilot interest và kế hoạch kiểm chứng ban đầu.",
    content: analysis.evidence
      .filter(
        (evidence) =>
          evidence.documentRole === document.role,
      )
      .map(
        (evidence) =>
          `Trang ${evidence.page}: ${evidence.quote}`,
      )
      .join("\n"),
    createdAt,
    importedAt: createdAt,
    freshness: "current",
    reviewStatus: "confirmed",
    visibility: "private",
    aiContribution: "none",
    provenance: {
      artifactType:
        document.role === "pitch_deck"
          ? "Pitch Deck"
          : "Business Plan",
      purpose: "Tạo venture context và readiness baseline demo",
      personalDataDetected: false,
      productContext: "high",
      technicalContext: "low",
      marketEvidence:
        document.role === "pitch_deck" ? "medium" : "low",
      commercialEvidence: "low",
    },
    tags: ["document-onboarding", document.role],
  }));
}

function canonicalEvidence(
  ventureId: string,
  analysis: VentureAnalysisResult,
  createdAt: string,
): Evidence[] {
  return analysis.evidence.map((reference) => ({
    id: `evidence-${ventureId}-${reference.id}`,
    ventureId,
    title: reference.supports[0] ?? "Bằng chứng từ tài liệu",
    summary: `${reference.quote}${
      reference.limitation
        ? ` Giới hạn: ${reference.limitation}`
        : ""
    }`,
    sourceType: "document",
    status: "accepted",
    collectedAt: createdAt,
  }));
}

function upsertById<T extends { id: string }>(
  current: T[],
  additions: T[],
) {
  const additionIds = new Set(additions.map((item) => item.id));
  return [
    ...additions,
    ...current.filter((item) => !additionIds.has(item.id)),
  ];
}

function enrichCanonicalState(
  state: DemoWorkspaceState,
  ventureId: string,
  input: CompleteDocumentOnboardingInput,
  createdAt: string,
) {
  const sources = canonicalSources(
    ventureId,
    input.analysisResult,
    createdAt,
  );
  const evidence = canonicalEvidence(
    ventureId,
    input.analysisResult,
    createdAt,
  );
  const sourceIds = sources.map((source) => source.id);
  const evidenceIds = evidence.map((item) => item.id);
  const readinessDeltaId = `readiness-${ventureId}-document-baseline`;
  const activityId = `activity-${ventureId}-document-analysis`;

  return {
    ...state,
    sources: upsertById(state.sources, sources),
    evidence: upsertById(state.evidence, evidence),
    baselines: state.baselines.map((baseline) =>
      baseline.ventureId === ventureId
        ? {
            ...baseline,
            problem: {
              ...baseline.problem,
              value: input.ventureContext.problem,
              sourceIds,
              confidence: "strong" as const,
              status: "confirmed" as const,
              founderConfirmed: true,
            },
            customer: {
              ...baseline.customer,
              value: input.ventureContext.targetUser,
              sourceIds,
              confidence: "moderate" as const,
              status: "confirmed" as const,
              founderConfirmed: true,
            },
            stage: {
              ...baseline.stage,
              value: input.ventureContext.stageLabel,
              sourceIds,
              confidence: "strong" as const,
              status: "confirmed" as const,
              founderConfirmed: true,
            },
            evidenceSummary: {
              ...baseline.evidenceSummary,
              value:
                "12 customer interviews · 5 prototype testers · 2 pilot interests",
              sourceIds,
              confidence: "moderate" as const,
              status: "confirmed" as const,
              founderConfirmed: true,
            },
            currentGoal: {
              ...baseline.currentGoal,
              value:
                input.analysisResult.readiness
                  .recommendedNextStep,
              sourceIds,
              confidence: "developing" as const,
              status: "needs-review" as const,
              founderConfirmed: false,
            },
            acknowledgedIncomplete: true,
            status: "confirmed" as const,
            updatedAt: createdAt,
          }
        : baseline,
    ),
    readinessDeltas: upsertById(state.readinessDeltas, [
      {
        id: readinessDeltaId,
        ventureId,
        dimension: "Initial readiness baseline",
        change: 4,
        reason:
          "Prototype learning và các nguồn chính đã được liên kết để tạo baseline 65/100.",
        evidenceIds,
        recordedAt: createdAt,
      },
    ]),
    activities: upsertById(state.activities, [
      {
        id: activityId,
        ventureId,
        type: "evidence",
        message:
          "Initial document analysis completed with readiness baseline 65/100.",
        occurredAt: createdAt,
      },
    ]),
  } satisfies DemoWorkspaceState;
}

export function completeDocumentOnboarding(
  state: DemoWorkspaceState,
  input: CompleteDocumentOnboardingInput,
): DocumentOnboardingOrchestrationResult {
  const createdAt = "2026-07-28T13:30:00.000Z";
  const created = createDemoVenture(state, {
    requestId: `document-onboarding-${input.analysisRunId}`,
    creationIntent: "analyze-materials",
    name: input.ventureContext.name,
    oneLineDescription:
      input.ventureContext.productSummary,
    stage: input.ventureContext.stage,
    currentPhase: "venture-context",
    initialSetupStepId: "materials",
    initialDecisionTitle:
      input.analysisResult.readiness.recommendedNextStep,
    initialDecisionRationale:
      input.analysisResult.readiness.biggestGap.explanation,
    createdAt,
  });
  const existing = getVentureById(
    created.state,
    created.ventureId,
  );

  let canonicalState = created.state;
  if (existing?.setup?.status !== "completed") {
    canonicalState = updateDemoVentureSetup(
      canonicalState,
      created.ventureId,
      {
        currentStepId: "confirm-context",
        completedStepIds: [
          "venture-name",
          "problem",
          "target-user",
          "materials",
        ],
        name: input.ventureContext.name,
        stage: input.ventureContext.stage,
        problem: input.ventureContext.problem,
        targetUser: input.ventureContext.targetUser,
        initialGoal:
          input.analysisResult.readiness
            .recommendedNextStep,
        materials: input.sourceDocuments.map((document) => ({
          id: document.id,
          name: document.name,
          size: document.size,
          type: document.type,
        })),
        updatedAt: createdAt,
      },
    );
    const confirmed = confirmDemoVentureSetup(
      canonicalState,
      created.ventureId,
      createdAt,
    );
    if (!confirmed.confirmed) {
      throw new Error(
        "Document onboarding could not confirm the venture context.",
      );
    }
    canonicalState = confirmed.state;
  }

  canonicalState = enrichCanonicalState(
    canonicalState,
    created.ventureId,
    input,
    createdAt,
  );

  const aiWorkspaceBootstrap =
    createDocumentAnalysisWorkspaceBootstrap({
      ventureId: created.ventureId,
      analysisRunId: input.analysisRunId,
      documents: input.sourceDocuments,
      evidence: input.analysisResult.evidence,
    });
  const workspacePath = `/founder/projects/${created.ventureId}/workspace?conversation=${aiWorkspaceBootstrap.conversationId}`;

  return {
    state: canonicalState,
    aiWorkspaceBootstrap,
    ventureId: created.ventureId,
    conversationId: aiWorkspaceBootstrap.conversationId,
    workspacePath,
  };
}

export function persistDocumentOnboardingTransaction(
  storage: DocumentOnboardingStorage,
  result: DocumentOnboardingOrchestrationResult,
) {
  const previousWorkspace = storage.getItem(
    DEMO_WORKSPACE_STORAGE_KEY,
  );
  const previousAiWorkspace = storage.getItem(
    AI_WORKSPACE_STORAGE_KEY,
  );
  const nextWorkspace = serializeDemoWorkspaceState(
    result.state,
  );
  const nextAiWorkspace = serializeAiWorkspaceBootstrap(
    previousAiWorkspace,
    result.aiWorkspaceBootstrap,
  );

  try {
    storage.setItem(
      DEMO_WORKSPACE_STORAGE_KEY,
      nextWorkspace,
    );
    storage.setItem(
      AI_WORKSPACE_STORAGE_KEY,
      nextAiWorkspace,
    );
  } catch (error) {
    if (previousWorkspace === null) {
      storage.removeItem(DEMO_WORKSPACE_STORAGE_KEY);
    } else {
      storage.setItem(
        DEMO_WORKSPACE_STORAGE_KEY,
        previousWorkspace,
      );
    }
    if (previousAiWorkspace === null) {
      storage.removeItem(AI_WORKSPACE_STORAGE_KEY);
    } else {
      storage.setItem(
        AI_WORKSPACE_STORAGE_KEY,
        previousAiWorkspace,
      );
    }
    throw error;
  }
}
