import { createAiWorkspaceScenarioState } from "../demo/demo-scenarios";
import { createLongRunDemoState } from "../demo/demo-long-run-data";
import {
  AI_WORKSPACE_STORAGE_KEY,
  parseAiWorkspaceEnvelope,
  toPersistedSession,
  type PersistedAiWorkspaceSession,
} from "../state/ai-workspace-persistence";
import { createWorkspaceLayoutState } from "../state/workspace-layout-reducer";
import type {
  AiWorkspaceMessage,
  MockAttachment,
} from "../types/ai-workspace.types";
import type {
  ConversationSession,
  LongRunWorkspaceState,
  MaterialVersion,
  VentureMemoryItem,
} from "../types/long-run-workspace.types";

export interface DocumentAnalysisWorkspaceDocument {
  id: string;
  role: "pitch_deck" | "business_plan";
  name: string;
  size: number;
  type: string;
}

export interface DocumentAnalysisWorkspaceEvidence {
  id: string;
  fileName: string;
  page: number;
  supports: string[];
}

export interface DocumentAnalysisWorkspaceBootstrapInput {
  ventureId: string;
  analysisRunId: string;
  documents: DocumentAnalysisWorkspaceDocument[];
  evidence: DocumentAnalysisWorkspaceEvidence[];
}

export interface DocumentAnalysisWorkspaceBootstrap {
  ventureId: string;
  conversationId: string;
  session: PersistedAiWorkspaceSession;
}

const CREATED_AT = "2026-07-28T13:30:00.000Z";
const CONVERSATION_ID = "conversation-document-analysis";

function firstMessage({
  documents,
  evidence,
}: DocumentAnalysisWorkspaceBootstrapInput): AiWorkspaceMessage {
  const materialLabel =
    documents.length === 2
      ? "Pitch Deck và Business Plan"
      : documents[0]?.role === "pitch_deck"
        ? "Pitch Deck"
        : "Business Plan";

  return {
    id: "assistant-document-analysis-initial",
    role: "assistant",
    content: `Mình đã phân tích ${materialLabel} của CampusFlow.

Venture hiện mô tả khá rõ vấn đề của các câu lạc bộ và nhóm người dùng mục tiêu.

Khoảng trống lớn nhất hiện tại là hai câu lạc bộ mới chỉ thể hiện sự quan tâm, nhưng chưa có phạm vi pilot, lịch hoặc success metric cụ thể.

Mình đã tạo readiness baseline và liên kết các bằng chứng chính từ tài liệu để bạn kiểm tra.`,
    createdAt: CREATED_AT,
    status: "complete",
    responseKind: "artifact_preview",
    responseLifecycle: "completed",
    structuredResponse: {
      type: "document-onboarding-analysis",
      payload: {
        readinessScore: 65,
        stageLabel: "Prototype",
        strongestCriterion: {
          label: "Hiểu vấn đề và người dùng",
          score: 78,
        },
        biggestGap: {
          label: "Tín hiệu thị trường và commitment",
          score: 45,
        },
        documentCount: documents.length,
        evidenceCount: evidence.length,
      },
    },
    sources: evidence.map((item) => ({
      id: item.id,
      label: `${item.fileName} · Trang ${item.page}`,
      status: "verified" as const,
    })),
  };
}

function onboardingConversation(
  ventureId: string,
  documents: DocumentAnalysisWorkspaceDocument[],
): ConversationSession {
  return {
    id: CONVERSATION_ID,
    ventureId,
    title: "Phân tích ban đầu CampusFlow",
    category: "material_analysis",
    relatedMaterialIds: documents.map((document) => document.id),
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    isPinned: false,
    isArchived: false,
    summaryStatus: "confirmed",
  };
}

function onboardingMaterials(
  ventureId: string,
  documents: DocumentAnalysisWorkspaceDocument[],
): MaterialVersion[] {
  return documents.map((document) => ({
    id: document.id,
    ventureId,
    familyId: `document-onboarding-${document.role}`,
    name: document.name,
    versionLabel: "Bản phân tích ban đầu",
    createdAt: CREATED_AT,
    status: "canonical",
    summary:
      document.role === "pitch_deck"
        ? "Nguồn cho problem, customer discovery và prototype learning."
        : "Nguồn cho tín hiệu pilot và market commitment.",
    comparisonNotes: [],
    dependencies: {
      memoryItems: document.role === "pitch_deck" ? 3 : 1,
      readinessDimensions:
        document.role === "pitch_deck" ? 3 : 1,
      activeDecisionCycles: 0,
    },
  }));
}

function onboardingMemory(
  ventureId: string,
  evidence: DocumentAnalysisWorkspaceEvidence[],
): VentureMemoryItem[] {
  const entries = [
    {
      id: "memory-campusflow-problem",
      type: "fact" as const,
      status: "verified" as const,
      title: "Workflow onboarding bị phân tán",
      summary:
        "Câu lạc bộ đang dùng Google Forms và nhóm chat, khiến tiến độ khó theo dõi.",
      sourceIds: evidence
        .filter((item) => item.page === 4)
        .map((item) => item.id),
    },
    {
      id: "memory-campusflow-interviews",
      type: "evidence" as const,
      status: "verified" as const,
      title: "12 customer interviews",
      summary:
        "8/12 người được phỏng vấn xác nhận quy trình onboarding bị phân tán.",
      sourceIds: evidence
        .filter((item) => item.page === 6)
        .map((item) => item.id),
    },
    {
      id: "memory-campusflow-prototype",
      type: "evidence" as const,
      status: "verified" as const,
      title: "5 prototype testers",
      summary:
        "4 người hoàn thành core flow và 3 người quay lại test lần hai.",
      sourceIds: evidence
        .filter((item) => item.page === 8)
        .map((item) => item.id),
    },
    {
      id: "memory-campusflow-pilot-interest",
      type: "assumption" as const,
      status: "inferred" as const,
      title: "2 pilot interests",
      summary:
        "Hai câu lạc bộ quan tâm nhưng chưa xác nhận phạm vi, lịch và success metric.",
      sourceIds: evidence
        .filter((item) => item.page === 11)
        .map((item) => item.id),
    },
  ];

  return entries
    .filter((entry) => entry.sourceIds.length > 0)
    .map((entry) => ({
      ...entry,
      ventureId,
      createdAt: CREATED_AT,
      updatedAt: CREATED_AT,
      observedAt: CREATED_AT,
      createdBy: "ai" as const,
      history: [
        {
          id: `history-${entry.id}`,
          status: entry.status,
          value: entry.summary,
          actor: "Kizuna",
          createdAt: CREATED_AT,
          reason:
            "Được trích xuất trong flow phân tích tài liệu demo.",
        },
      ],
    }));
}

function onboardingLongRunState(
  input: DocumentAnalysisWorkspaceBootstrapInput,
  message: AiWorkspaceMessage,
): LongRunWorkspaceState {
  const base = createLongRunDemoState(input.ventureId);
  const session = onboardingConversation(
    input.ventureId,
    input.documents,
  );
  const attachments: MockAttachment[] = input.documents.map(
    (document) => ({
      id: document.id,
      name: document.name,
      size: document.size,
      type: document.type,
      origin: "local",
      status: "ready",
    }),
  );

  return {
    ...base,
    stateVersion: 1,
    sessions: [session],
    activeConversationId: session.id,
    lastConversationId: session.id,
    messagesByConversation: {
      [session.id]: [message],
    },
    draftsByConversation: { [session.id]: "" },
    attachmentsByConversation: {
      [session.id]: attachments,
    },
    visibleMessageCountByConversation: {
      [session.id]: 12,
    },
    scrollTopByConversation: {},
    memory: onboardingMemory(
      input.ventureId,
      input.evidence,
    ),
    timeline: [
      {
        id: "timeline-document-analysis-readiness",
        ventureId: input.ventureId,
        type: "readiness_changed",
        title: "Đã tạo readiness baseline 65/100",
        createdAt: CREATED_AT,
        actor: "Kizuna",
        reason:
          "Baseline demo được tạo từ các bằng chứng đã liên kết trong tài liệu.",
        sourceIds: input.evidence.map((item) => item.id),
        readinessChangeId: "readiness-document-analysis-65",
      },
      {
        id: "timeline-document-analysis-context",
        ventureId: input.ventureId,
        type: "context_confirmed",
        title: "Đã tạo venture context từ tài liệu",
        createdAt: CREATED_AT,
        actor: "Kizuna",
        reason:
          "Founder hoàn tất flow phân tích tài liệu startup.",
        sourceIds: input.documents.map(
          (document) => document.id,
        ),
      },
    ],
    readinessHistory: [
      {
        id: "readiness-document-analysis-65",
        ventureId: input.ventureId,
        previousScore: 61,
        nextScore: 65,
        dimensionChanges: [
          {
            id: "problem_and_user_understanding",
            label: "Hiểu vấn đề và người dùng",
            previousScore: 74,
            nextScore: 78,
            reason:
              "Problem statement và customer interviews đã được liên kết với nguồn.",
          },
        ],
        evidenceAddedIds: input.evidence.map((item) => item.id),
        evidenceRemovedIds: [],
        reason:
          "Tạo baseline ban đầu từ tài liệu hiện có.",
        rubricVersion: "student-prototype-v1",
        createdAt: CREATED_AT,
      },
    ],
    pinnedItems: [],
    materialVersions: onboardingMaterials(
      input.ventureId,
      input.documents,
    ),
    summaries: [],
    conflicts: [],
  };
}

export function createDocumentAnalysisWorkspaceBootstrap(
  input: DocumentAnalysisWorkspaceBootstrapInput,
): DocumentAnalysisWorkspaceBootstrap {
  const message = firstMessage(input);
  const materialState = createAiWorkspaceScenarioState(
    input.ventureId,
    "materials",
  );
  const mentorState = createAiWorkspaceScenarioState(
    input.ventureId,
    "mentor",
  );
  const longRun = onboardingLongRunState(input, message);
  const attachments = input.documents.map((document) => ({
    id: document.id,
    name: document.name,
    size: document.size,
    type: document.type,
    origin: "local" as const,
    status: "ready" as const,
  }));
  const state = {
    ...mentorState,
    messages: [message],
    attachments,
    suggestedPrompts: [
      "Tại sao điểm hiện tại là 65?",
      "Pitch deck yếu nhất ở đâu?",
      "Tôi nên làm gì tiếp theo?",
      "Tìm mentor phù hợp",
    ],
    materialAnalysis: {
      ...materialState.materialAnalysis!,
      fileNames: input.documents.map(
        (document) => document.name,
      ),
    },
  };
  const primaryMentorId =
    state.mentorRecommendation?.selectedMentorId;
  const layout = {
    ...createWorkspaceLayoutState(),
    destination: "mentor_discovery" as const,
    secondaryPaneMode: primaryMentorId
      ? ("mentor_fit" as const)
      : ("closed" as const),
    secondaryPaneWidth: 42,
    selectedMentorId: primaryMentorId,
  };

  return {
    ventureId: input.ventureId,
    conversationId: CONVERSATION_ID,
    session: toPersistedSession(
      state,
      longRun,
      layout,
      {
        source: "document_analysis",
        analysisRunId: input.analysisRunId,
        initialAnalysisPaneShown: true,
      },
    ),
  };
}

export function serializeAiWorkspaceBootstrap(
  rawValue: string | null,
  bootstrap: DocumentAnalysisWorkspaceBootstrap,
) {
  const envelope = parseAiWorkspaceEnvelope(rawValue);
  const existing =
    envelope.sessions[bootstrap.ventureId]?.onboarding;
  const existingSession =
    envelope.sessions[bootstrap.ventureId];
  if (
    existing?.analysisRunId ===
      bootstrap.session.onboarding?.analysisRunId &&
    existingSession?.longRun?.sessions.some(
      (session) =>
        session.id === bootstrap.conversationId,
    )
  ) {
    const alreadyMentorFirst =
      existingSession.layout?.destination ===
        "mentor_discovery" &&
      existingSession.layout.secondaryPaneMode ===
        "mentor_fit" &&
      existingSession.onboarding?.initialAnalysisPaneShown ===
        true &&
      Boolean(existingSession.mentorRecommendation);
    if (alreadyMentorFirst) {
      return JSON.stringify(envelope);
    }

    envelope.sessions[bootstrap.ventureId] = {
      ...existingSession,
      activeScenarioId: bootstrap.session.activeScenarioId,
      materialAnalysis:
        existingSession.materialAnalysis ??
        bootstrap.session.materialAnalysis,
      mentorRecommendation:
        bootstrap.session.mentorRecommendation,
      layout: bootstrap.session.layout,
      onboarding: bootstrap.session.onboarding,
    };
    return JSON.stringify(envelope);
  }
  envelope.sessions[bootstrap.ventureId] =
    bootstrap.session;
  return JSON.stringify(envelope);
}

export { AI_WORKSPACE_STORAGE_KEY };
