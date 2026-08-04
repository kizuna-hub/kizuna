import type {
  MentorshipCheckpoint,
  MentorshipPreReadContent,
} from "@/features/demo-domain/types/mentorship-continuity.types";

export function buildMentorshipPreReadContent(
  checkpoint: MentorshipCheckpoint,
): MentorshipPreReadContent {
  return {
    previousDecision: checkpoint.decision,
    founderCommitment: checkpoint.founderCommitment,
    resultSummary:
      checkpoint.resultSummary ?? "Chưa có kết quả được ghi nhận.",
    newInsight:
      checkpoint.changedAssumption ??
      "Chưa có insight mới được ghi nhận.",
    incompleteSummary:
      checkpoint.blockerSummary ??
      "Không có nội dung chưa hoàn thành được ghi nhận.",
    mentorReviewQuestion: checkpoint.nextReviewQuestion,
    evidenceIds: [...checkpoint.evidenceIds],
  };
}
