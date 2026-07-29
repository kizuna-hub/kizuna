import { campusFlowMentorDocuments } from "../demo/campusflow-mentor-connection-data";
import type {
  GenerateMentorConnectionBriefInput,
  GenerateMentorConnectionBriefResult,
  MentorConnectionBrief,
  MentorConnectionBriefGenerator,
  MentorConnectionSource,
} from "../types/mentor-connection.types";

const GENERATED_AT = "2026-07-29T03:15:00.000Z";
const GENERATION_LATENCY_MS = 420;

function wait(durationMs: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, durationMs);
  });
}

export function createMentorContextFingerprint(
  input: Pick<
    GenerateMentorConnectionBriefInput,
    "canonicalVentureContext" | "currentFocus" | "readiness"
  >,
) {
  return [
    input.canonicalVentureContext.ventureName,
    input.canonicalVentureContext.ventureStage,
    input.currentFocus?.id ?? "no-focus",
    input.currentFocus?.bottleneck ?? "",
    input.readiness?.currentScore ?? "no-readiness",
    input.readiness?.assessment.updatedAt ?? "",
  ].join("|");
}

function createSources(
  input: GenerateMentorConnectionBriefInput,
): MentorConnectionSource[] {
  const sources: MentorConnectionSource[] = [
    {
      id: "venture-summary",
      label: "Venture summary",
      detail: input.canonicalVentureContext.ventureSummary,
      status: "verified",
      updatedAt: GENERATED_AT,
    },
    {
      id: "venture-stage",
      label: "Giai đoạn hiện tại",
      detail: input.canonicalVentureContext.ventureStage,
      status: "verified",
      updatedAt: GENERATED_AT,
    },
  ];

  if (input.currentFocus) {
    sources.push({
      id: "current-focus",
      label: "Current Focus",
      detail: input.currentFocus.bottleneck,
      status:
        input.currentFocus.sourceStatus === "verified"
          ? "verified"
          : "inferred",
      updatedAt: GENERATED_AT,
    });
  }
  if (input.activeDecisionCycle) {
    sources.push({
      id: "active-decision-cycle",
      label: "Decision Cycle đang hoạt động",
      detail: input.activeDecisionCycle.title,
      status: "verified",
      updatedAt: GENERATED_AT,
    });
  }
  if (input.readiness) {
    sources.push({
      id: "readiness-overview",
      label: "Readiness overview",
      detail: `${input.readiness.currentScore}/100 · ${input.canonicalVentureContext.ventureStage}`,
      status: "verified",
      updatedAt: input.readiness.assessment.updatedAt,
    });
  }
  if (input.relevantConversationSummary) {
    sources.push({
      id: "conversation-summary",
      label: "Tóm tắt cuộc trò chuyện hôm nay",
      detail:
        "Chỉ dùng bản tóm tắt liên quan để soạn brief; không chia sẻ raw chat.",
      status: "inferred",
      updatedAt: GENERATED_AT,
    });
  }
  sources.push(
    {
      id: "pitch-deck-page-6",
      label: "Pitch Deck · trang 6",
      detail: "Customer discovery",
      status: "verified",
      updatedAt: GENERATED_AT,
    },
    {
      id: "pitch-deck-page-8",
      label: "Pitch Deck · trang 8",
      detail: "Prototype validation",
      status: "verified",
      updatedAt: GENERATED_AT,
    },
    {
      id: "business-plan-page-11",
      label: "Business Plan · trang 11",
      detail:
        "Hai câu lạc bộ quan tâm; chưa phải pilot đã xác nhận",
      status: "verified",
      updatedAt: GENERATED_AT,
    },
  );
  return sources;
}

function buildBrief(
  input: GenerateMentorConnectionBriefInput,
): MentorConnectionBrief {
  const focus =
    input.currentFocus?.bottleneck ??
    input.clarification ??
    "Team cần làm rõ mục tiêu quan trọng nhất cho phiên mentor.";
  const focusVerified =
    input.currentFocus?.sourceStatus === "verified";
  const sectionStatus = focusVerified
    ? ("verified_context" as const)
    : ("ai_inferred" as const);
  const activeCycle = input.activeDecisionCycle;
  const currentChallenge =
    input.currentFocus
      ? "CampusFlow đã có hai câu lạc bộ quan tâm tới pilot, nhưng team chưa biết cách xác định phạm vi, success metric và evidence cần thu thập."
      : focus;
  const expectedOutcome =
    activeCycle?.expectedOutcome
      ? `Sau phiên ${input.mentor.durationMinutes} phút, team muốn ${input.mentor.recommendedFor.toLocaleLowerCase("vi")}`
      : `Sau phiên ${input.mentor.durationMinutes} phút, team muốn chốt được: ${input.clarification ?? input.mentor.recommendedFor.toLocaleLowerCase("vi")}`;
  const evidenceSentence =
    input.verifiedEvidence.length > 0
      ? "Bọn em đã phỏng vấn 12 người, test prototype với 5 người, có 3 người quay lại test và có hai câu lạc bộ quan tâm tới pilot."
      : "Context hiện còn hạn chế, nên bọn em muốn dùng phiên đầu tiên để làm rõ hướng kiểm chứng phù hợp.";
  const mentorFirstName =
    input.mentor.profile.name.split(" ").at(-1) ??
    input.mentor.profile.name;
  const mentorSalutation =
    input.mentor.mentorId === "mentor-pham-thu-ha"
      ? "chị"
      : "anh";

  return {
    id: `mentor-brief:${input.ventureId}:${input.mentor.mentorId}`,
    ventureId: input.ventureId,
    mentorId: input.mentor.mentorId,
    mentorSnapshot: {
      id: input.mentor.mentorId,
      name: input.mentor.profile.name,
      role: `${input.mentor.profile.role} · ${input.mentor.profile.organization}`,
      expertise: input.mentor.relevantExpertise,
      matchScore: input.mentor.fit.score,
    },
    sections: [
      {
        id: "current_challenge",
        title: "Khó khăn hiện tại",
        content: currentChallenge,
        sourceIds: input.currentFocus
          ? ["current-focus", "readiness-overview"]
          : ["venture-summary"],
        generationStatus: sectionStatus,
        updatedAt: GENERATED_AT,
      },
      {
        id: "support_needed",
        title: "Founder muốn mentor giúp chốt",
        content: input.mentor.recommendedFor,
        checklistItems: input.mentor.expectedOutcomes.slice(0, 4),
        sourceIds: activeCycle
          ? ["current-focus", "active-decision-cycle"]
          : ["current-focus"],
        generationStatus: activeCycle
          ? "verified_context"
          : sectionStatus,
        updatedAt: GENERATED_AT,
      },
      {
        id: "expected_outcome",
        title: "Kết quả mong muốn sau phiên",
        content: expectedOutcome,
        sourceIds: activeCycle
          ? ["active-decision-cycle"]
          : ["current-focus"],
        generationStatus: activeCycle
          ? "verified_context"
          : sectionStatus,
        updatedAt: GENERATED_AT,
      },
      {
        id: "mentor_message",
        title: "Lời nhắn cho mentor",
        content: `Chào ${mentorSalutation} ${mentorFirstName},

CampusFlow là một venture do nhóm sinh viên phát triển, giúp các câu lạc bộ onboarding và hỗ trợ thành viên mới.

${evidenceSentence}

Bọn em muốn nhờ ${mentorSalutation} hỗ trợ ${input.mentor.recommendedFor.toLocaleLowerCase("vi")}`,
        sourceIds: [
          "venture-summary",
          "current-focus",
          "pitch-deck-page-6",
          "pitch-deck-page-8",
          "business-plan-page-11",
        ],
        generationStatus:
          input.verifiedEvidence.length >= 3
            ? "verified_context"
            : "ai_inferred",
        updatedAt: GENERATED_AT,
      },
    ],
    sources: createSources(input),
    evidence: input.verifiedEvidence,
    documents: structuredClone(campusFlowMentorDocuments),
    selectedContext: [
      "venture_summary",
      "venture_stage",
      "current_focus",
      ...(input.readiness ? (["readiness_overview"] as const) : []),
      ...(input.verifiedEvidence.length
        ? (["selected_evidence"] as const)
        : []),
      "pitch_deck",
      ...(activeCycle
        ? (["active_decision_cycle"] as const)
        : []),
    ],
    selectedEvidenceIds: input.verifiedEvidence
      .filter((item) => item.status === "verified")
      .slice(0, 3)
      .map((item) => item.id),
    selectedDocumentIds: ["campusflow-pitch-deck-v2"],
    status: "ready",
    confidence:
      input.currentFocus && input.verifiedEvidence.length >= 2
        ? "high"
        : "medium",
    contextFingerprint: createMentorContextFingerprint(input),
    createdAt: GENERATED_AT,
    updatedAt: GENERATED_AT,
  };
}

export function createMockMentorConnectionBriefGenerator(
  options: {
    latencyMs?: number;
    fail?: boolean;
  } = {},
): MentorConnectionBriefGenerator {
  return {
    async generate(input): Promise<GenerateMentorConnectionBriefResult> {
      await wait(options.latencyMs ?? GENERATION_LATENCY_MS);
      if (options.fail) {
        throw new Error(
          "Kizuna chưa thể chuẩn bị yêu cầu kết nối.",
        );
      }

      const missingRequiredContext: string[] = [];
      if (!input.canonicalVentureContext.ventureSummary.trim()) {
        missingRequiredContext.push("venture_summary");
      }
      if (
        !input.currentFocus?.bottleneck.trim() &&
        !input.clarification?.trim()
      ) {
        missingRequiredContext.push("connection_goal");
      }

      const brief = buildBrief(input);
      return {
        brief,
        missingRequiredContext,
        confidence: brief.confidence,
        generatedAt: GENERATED_AT,
      };
    },
  };
}
