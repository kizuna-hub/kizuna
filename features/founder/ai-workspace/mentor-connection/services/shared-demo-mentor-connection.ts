import type {
  ConnectionBriefSnapshot,
  DemoDomainConnectionRequest,
  DemoDomainRepository,
} from "@/features/demo-domain/types/demo-domain.types";

import type {
  MentorConnectionBrief,
  MentorConnectionRequest,
} from "../types/mentor-connection.types";

function section(
  brief: MentorConnectionBrief,
  id:
    | "current_challenge"
    | "support_needed"
    | "expected_outcome"
    | "mentor_message",
) {
  return brief.sections.find((item) => item.id === id);
}

export function createSharedConnectionBriefSnapshot(
  repository: DemoDomainRepository,
  brief: MentorConnectionBrief,
): ConnectionBriefSnapshot {
  const domain = repository.getSnapshot();
  const venture =
    domain.ventures.find((item) => item.id === brief.ventureId) ??
    {
      id: brief.ventureId,
      ownerId: "founder-nguyen-tuan-ngoc",
      name: "CampusFlow",
      stage: "prototype" as const,
      teamSummary: "3 student founders",
      productSummary:
        "Nền tảng giúp câu lạc bộ trong trường onboarding và hỗ trợ thành viên mới.",
      tags: ["EdTech", "B2B", "SaaS"],
      documentIds: brief.documents.map((item) => item.id),
      evidenceIds: brief.evidence.map((item) => item.id),
      readiness: {
        overallScore: 65,
        strongestDimension: {
          id: "problem_and_user_understanding",
          label: "Hiểu vấn đề và người dùng",
          score: 78,
        },
        biggestGap: {
          id: "market_signal_and_commitment",
          label: "Tín hiệu thị trường và commitment",
          score: 45,
        },
      },
      canonicalQuestionIds: [],
      updatedAt: brief.updatedAt,
    };
  const support = section(brief, "support_needed");

  return {
    id: `brief-snapshot-${brief.ventureId}`,
    version: 1,
    capturedAt: "2026-07-30T03:10:00.000Z",
    founder: {
      id: "founder-nguyen-tuan-ngoc",
      name: "Nguyễn Tuấn Ngọc",
      institution: "Nhóm sinh viên đại học",
    },
    venture: structuredClone(venture),
    mentor: {
      id: brief.mentorId,
      name: brief.mentorSnapshot.name,
      role: brief.mentorSnapshot.role,
      organization: "VNPay",
      fitScore: brief.mentorSnapshot.matchScore,
    },
    currentChallenge:
      section(brief, "current_challenge")?.content ??
      "Team cần làm rõ phạm vi pilot đầu tiên.",
    supportNeeded:
      support?.checklistItems ??
      [support?.content].filter(
        (item): item is string => Boolean(item),
      ),
    expectedOutcome:
      section(brief, "expected_outcome")?.content ??
      "Một kế hoạch pilot 14 ngày rõ ràng.",
    founderMessage: section(brief, "mentor_message")?.content,
    evidence: brief.evidence.map((item) => ({
      id: item.id,
      label: item.label,
      value: item.detail,
      sourceLabel: item.sourceLabel,
    })),
    sharedDocuments: brief.documents
      .filter((item) =>
        brief.selectedDocumentIds.includes(item.id),
      )
      .map((item) => ({
        id: item.id,
        name: item.name,
        type: "pdf" as const,
        selectedPageLabels: ["Trang 6", "Trang 8", "Trang 11"],
        available: item.availability === "available",
      })),
  };
}

export function toFounderConnectionRequest(
  shared: DemoDomainConnectionRequest,
  brief: MentorConnectionBrief,
): MentorConnectionRequest {
  return {
    id: shared.id,
    ventureId: shared.ventureId,
    mentorId: shared.mentorId,
    brief: {
      ...structuredClone(brief),
      status: "sent",
      updatedAt: shared.updatedAt,
    },
    status:
      shared.status === "accepted"
        ? "accepted"
        : shared.status === "declined"
          ? "declined"
          : "pending",
    sentAt: shared.createdAt,
    acceptance: shared.acceptance
      ? structuredClone(shared.acceptance)
      : undefined,
  };
}
