import type {
  DemoDomainRepository,
  DemoDomainState,
} from "../types/demo-domain.types";
import type { MentorshipPreRead } from "../types/mentorship-continuity.types";

type PreReadMethods = Pick<
  DemoDomainRepository,
  | "getMentorshipPreRead"
  | "createOrUpdateMentorshipPreRead"
  | "sendMentorshipPreRead"
>;

export function createMentorshipPreReadRepositoryMethods({
  readLatest,
  commit,
}: {
  readLatest: () => DemoDomainState;
  commit: (state: DemoDomainState) => DemoDomainState;
}): PreReadMethods {
  return {
    getMentorshipPreRead(checkpointId) {
      return structuredClone(
        readLatest().mentorshipPreReads.find(
          (item) => item.checkpointId === checkpointId,
        ) ?? null,
      );
    },

    createOrUpdateMentorshipPreRead(input) {
      const current = readLatest();
      const checkpoint = current.mentorshipCheckpoints.find(
        (item) => item.id === input.checkpointId,
      );
      if (!checkpoint) throw new Error("Không tìm thấy checkpoint này.");
      const existing = current.mentorshipPreReads.find(
        (item) => item.checkpointId === checkpoint.id,
      );
      if (existing?.status === "sent") {
        return structuredClone(existing);
      }
      const now = new Date().toISOString();
      const preRead: MentorshipPreRead = {
        ...structuredClone(input),
        id: existing?.id ?? `mentorship-pre-read-${checkpoint.id}`,
        ventureId: checkpoint.ventureId,
        founderId: checkpoint.founderId,
        mentorId: checkpoint.mentorId,
        reviewAt: checkpoint.nextReviewAt,
        status: "ready",
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      };
      commit({
        ...current,
        mentorshipPreReads: existing
          ? current.mentorshipPreReads.map((item) =>
              item.id === preRead.id ? preRead : item,
            )
          : [...current.mentorshipPreReads, preRead],
        mentorshipCheckpoints: current.mentorshipCheckpoints.map(
          (item) =>
            item.id === checkpoint.id
              ? { ...item, status: "pre_read_ready", updatedAt: now }
              : item,
        ),
        mentorshipJourneys: current.mentorshipJourneys.map((item) =>
          item.ventureId === checkpoint.ventureId
            ? { ...item, latestPreReadId: preRead.id }
            : item,
        ),
      });
      return structuredClone(preRead);
    },

    sendMentorshipPreRead(preReadId) {
      const current = readLatest();
      const preRead = current.mentorshipPreReads.find(
        (item) => item.id === preReadId,
      );
      if (!preRead) throw new Error("Không tìm thấy bản pre-read.");
      if (preRead.status === "sent" && preRead.sentSnapshot) {
        return structuredClone(preRead);
      }
      const now = new Date().toISOString();
      const sent: MentorshipPreRead = {
        ...preRead,
        status: "sent",
        sentAt: now,
        updatedAt: now,
        sentSnapshot: {
          previousDecision: preRead.previousDecision,
          founderCommitment: preRead.founderCommitment,
          resultSummary: preRead.resultSummary,
          newInsight: preRead.newInsight,
          incompleteSummary: preRead.incompleteSummary,
          mentorReviewQuestion: preRead.mentorReviewQuestion,
          evidenceIds: [...preRead.evidenceIds],
        },
      };
      commit({
        ...current,
        mentorshipPreReads: current.mentorshipPreReads.map((item) =>
          item.id === sent.id ? sent : item,
        ),
        mentorshipCheckpoints: current.mentorshipCheckpoints.map(
          (item) =>
            item.id === sent.checkpointId
              ? { ...item, status: "pre_read_sent", updatedAt: now }
              : item,
        ),
      });
      return structuredClone(sent);
    },
  };
}
