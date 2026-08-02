import type {
  MentorConnectionBrief,
  MentorConnectionBriefSection,
  MentorConnectionBriefSectionId,
  MentorShareableContext,
} from "../types/mentor-connection.types";

const REQUIRED_CONTEXT: MentorShareableContext[] = [
  "venture_summary",
  "current_focus",
];

export function updateMentorBriefSection(
  brief: MentorConnectionBrief,
  sectionId: MentorConnectionBriefSectionId,
  update: Pick<
    MentorConnectionBriefSection,
    "content" | "checklistItems"
  >,
  updatedAt: string,
) {
  return {
    ...brief,
    sections: brief.sections.map((section) =>
      section.id === sectionId
        ? {
            ...section,
            content: update.content,
            checklistItems: update.checklistItems,
            generationStatus: "founder_edited" as const,
            updatedAt,
          }
        : section,
    ),
    status: "ready" as const,
    updatedAt,
    errorMessage: undefined,
  };
}

export function toggleMentorBriefContext(
  brief: MentorConnectionBrief,
  context: MentorShareableContext,
  updatedAt: string,
) {
  const selected = brief.selectedContext.includes(context);
  return {
    ...brief,
    selectedContext: selected
      ? brief.selectedContext.filter((item) => item !== context)
      : [...brief.selectedContext, context],
    status: "ready" as const,
    updatedAt,
  };
}

export function toggleMentorBriefEvidence(
  brief: MentorConnectionBrief,
  evidenceId: string,
  updatedAt: string,
) {
  const evidence = brief.evidence.find(
    (item) => item.id === evidenceId,
  );
  if (
    !evidence ||
    evidence.status === "disputed" ||
    evidence.status === "unavailable"
  ) {
    return brief;
  }
  const selected = brief.selectedEvidenceIds.includes(evidenceId);
  const selectedEvidenceIds = selected
    ? brief.selectedEvidenceIds.filter((id) => id !== evidenceId)
    : [...brief.selectedEvidenceIds, evidenceId];
  return {
    ...brief,
    selectedEvidenceIds,
    selectedContext:
      selectedEvidenceIds.length === 0
        ? brief.selectedContext.filter(
            (item) => item !== "selected_evidence",
          )
        : [
            ...new Set([
              ...brief.selectedContext,
              "selected_evidence" as const,
            ]),
          ],
    updatedAt,
    status: "ready" as const,
  };
}

export function toggleMentorBriefDocument(
  brief: MentorConnectionBrief,
  documentId: string,
  updatedAt: string,
) {
  const document = brief.documents.find(
    (item) => item.id === documentId,
  );
  if (!document || document.availability === "unavailable") {
    return brief;
  }
  const selected = brief.selectedDocumentIds.includes(documentId);
  return {
    ...brief,
    selectedDocumentIds: selected
      ? brief.selectedDocumentIds.filter((id) => id !== documentId)
      : [...brief.selectedDocumentIds, documentId],
    selectedContext: (
      documentId === "campusflow-pitch-deck-v2"
        ? selected
          ? brief.selectedContext.filter(
              (item) => item !== "pitch_deck",
            )
          : [...new Set([...brief.selectedContext, "pitch_deck"])]
        : selected
          ? brief.selectedContext.filter(
              (item) => item !== "business_plan",
            )
          : [
              ...new Set([
                ...brief.selectedContext,
                "business_plan",
              ]),
            ]
    ) as MentorShareableContext[],
    updatedAt,
    status: "ready" as const,
  };
}

export function validateMentorBriefContext(
  brief?: MentorConnectionBrief,
) {
  if (!brief) {
    return {
      valid: false,
      missing: REQUIRED_CONTEXT,
      message: "Brief chưa sẵn sàng.",
    };
  }
  const missing = REQUIRED_CONTEXT.filter(
    (item) => !brief.selectedContext.includes(item),
  );
  const meaningfulCount =
    brief.selectedContext.length +
    brief.selectedEvidenceIds.length +
    brief.selectedDocumentIds.length;
  return {
    valid: missing.length === 0 && meaningfulCount > 0,
    missing,
    message:
      missing.length > 0
        ? "Cần chia sẻ Venture summary và Current Focus trước khi gửi."
        : meaningfulCount === 0
          ? "Chọn ít nhất một context có ý nghĩa trước khi gửi."
          : undefined,
  };
}

export function refreshMentorConnectionBrief(
  existing: MentorConnectionBrief,
  generated: MentorConnectionBrief,
) {
  const founderSections = new Map(
    existing.sections
      .filter(
        (section) =>
          section.generationStatus === "founder_edited",
      )
      .map((section) => [section.id, section]),
  );
  const selectedEvidenceIds =
    existing.selectedEvidenceIds.filter((id) =>
      generated.evidence.some(
        (item) =>
          item.id === id &&
          item.status !== "disputed" &&
          item.status !== "unavailable",
      ),
    );
  const selectedDocumentIds =
    existing.selectedDocumentIds.filter((id) =>
      generated.documents.some(
        (item) =>
          item.id === id &&
          item.availability === "available",
      ),
    );
  const selectedContext = existing.selectedContext.filter(
    (item) =>
      (item !== "selected_evidence" ||
        selectedEvidenceIds.length > 0) &&
      (item !== "pitch_deck" ||
        selectedDocumentIds.includes(
          "campusflow-pitch-deck-v2",
        )) &&
      (item !== "business_plan" ||
        selectedDocumentIds.includes(
          "campusflow-business-plan-v1",
        )),
  );
  return {
    ...generated,
    id: existing.id,
    createdAt: existing.createdAt,
    sections: generated.sections.map(
      (section) => founderSections.get(section.id) ?? section,
    ),
    selectedContext,
    selectedEvidenceIds,
    selectedDocumentIds,
    status: "ready" as const,
    savedAt: existing.savedAt,
  };
}
