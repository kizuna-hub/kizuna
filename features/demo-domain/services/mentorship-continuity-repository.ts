import type {
  DemoDomainRepository,
  DemoDomainState,
} from "../types/demo-domain.types";
import type {
  MentorshipCheckpoint,
  MentorshipEvidenceReference,
} from "../types/mentorship-continuity.types";
import { createMentorshipPreReadRepositoryMethods } from "./mentorship-pre-read-repository";

type MentorshipMethods = Pick<
  DemoDomainRepository,
  | "getMentorshipJourney"
  | "listMentorshipCheckpoints"
  | "getMentorshipCheckpoint"
  | "createMentorshipCheckpoint"
  | "updateMentorshipCheckpointResult"
  | "getMentorshipEvidence"
  | "attachMentorshipEvidence"
  | "getMentorshipPreRead"
  | "createOrUpdateMentorshipPreRead"
  | "sendMentorshipPreRead"
>;

export class MentorshipContinuityUnavailableError extends Error {
  constructor() {
    super("Bạn chưa có Mentor đang đồng hành.");
    this.name = "MentorshipContinuityUnavailableError";
  }
}

export class MentorshipCheckpointNotFoundError extends Error {
  constructor() {
    super("Không tìm thấy checkpoint này.");
    this.name = "MentorshipCheckpointNotFoundError";
  }
}

function clean(value: string | undefined) {
  return value?.trim() || undefined;
}

function getCheckpointOrThrow(
  state: DemoDomainState,
  checkpointId: string,
) {
  const checkpoint = state.mentorshipCheckpoints.find(
    (item) => item.id === checkpointId,
  );
  if (!checkpoint) throw new MentorshipCheckpointNotFoundError();
  return checkpoint;
}

function evidenceId(checkpointId: string, index: number) {
  return `mentorship-evidence-${checkpointId}-${index + 1}`;
}

export function createMentorshipContinuityRepositoryMethods({
  readLatest,
  commit,
}: {
  readLatest: () => DemoDomainState;
  commit: (state: DemoDomainState) => DemoDomainState;
}): MentorshipMethods {
  const preReadMethods = createMentorshipPreReadRepositoryMethods({
    readLatest,
    commit,
  });
  const toEvidence = (
    checkpointId: string,
    input: Parameters<
      DemoDomainRepository["attachMentorshipEvidence"]
    >[0]["evidence"],
  ): MentorshipEvidenceReference[] =>
    input.map((item, index) => {
      if (!/\.(pdf|docx|xlsx|png|jpe?g|eml)$/i.test(item.filename)) {
        throw new Error(
          "Định dạng demo hỗ trợ: PDF, DOCX, XLSX, PNG, JPG và EML.",
        );
      }
      return {
        ...structuredClone(item),
        id: item.id ?? evidenceId(checkpointId, index),
        checkpointId,
        attachedAt: new Date().toISOString(),
      };
    });

  return {
    getMentorshipJourney(ventureId) {
      return structuredClone(
        readLatest().mentorshipJourneys.find(
          (item) => item.ventureId === ventureId,
        ) ?? null,
      );
    },

    listMentorshipCheckpoints(ventureId) {
      return structuredClone(
        readLatest()
          .mentorshipCheckpoints.filter(
            (item) => item.ventureId === ventureId,
          )
          .sort((a, b) => b.sequence - a.sequence),
      );
    },

    getMentorshipCheckpoint(checkpointId) {
      return structuredClone(
        readLatest().mentorshipCheckpoints.find(
          (item) => item.id === checkpointId,
        ) ?? null,
      );
    },

    createMentorshipCheckpoint(input) {
      const current = readLatest();
      const journey = current.mentorshipJourneys.find(
        (item) => item.ventureId === input.ventureId,
      );
      if (!journey) throw new MentorshipContinuityUnavailableError();
      const id = `mentorship-${input.ventureId}-${input.idempotencyKey}`;
      const duplicate = current.mentorshipCheckpoints.find(
        (item) => item.id === id,
      );
      if (duplicate) return structuredClone(duplicate);
      const decision = clean(input.decision);
      const founderCommitment = clean(input.founderCommitment);
      const nextReviewQuestion = clean(input.nextReviewQuestion);
      if (!decision || !founderCommitment || !nextReviewQuestion) {
        throw new Error("Vui lòng hoàn thành ba nội dung chính.");
      }
      if (
        [decision, founderCommitment, nextReviewQuestion].some(
          (value) => value.length > 800,
        )
      ) {
        throw new Error("Mỗi nội dung chính tối đa 800 ký tự.");
      }
      if (
        input.nextReviewAt &&
        Number.isNaN(new Date(input.nextReviewAt).getTime())
      ) {
        throw new Error("Thời gian review tiếp theo chưa hợp lệ.");
      }
      const now = new Date().toISOString();
      const sequence =
        Math.max(
          -1,
          ...current.mentorshipCheckpoints
            .filter((item) => item.ventureId === input.ventureId)
            .map((item) => item.sequence),
        ) + 1;
      const created: MentorshipCheckpoint = {
        id,
        ventureId: input.ventureId,
        founderId:
          current.connectionRequests.find(
            (request) => request.id === journey.connectionRequestId,
          )?.founderId ?? "founder-nguyen-tuan-ngoc",
        mentorId: journey.mentorId,
        connectionRequestId: journey.connectionRequestId,
        sequence,
        title: `Checkpoint #${sequence}`,
        sessionDate: now,
        decision,
        founderCommitment,
        nextReviewQuestion,
        nextReviewAt: clean(input.nextReviewAt),
        privateFounderNote: clean(input.privateFounderNote),
        expectedEvidenceReferences: clean(
          input.expectedEvidenceReferences,
        ),
        source: "founder_reported",
        status: "recorded",
        evidenceIds: [],
        createdAt: now,
        updatedAt: now,
      };
      commit({
        ...current,
        mentorshipCheckpoints: [
          ...current.mentorshipCheckpoints,
          created,
        ],
        mentorshipJourneys: current.mentorshipJourneys.map((item) =>
          item.ventureId === input.ventureId
            ? {
                ...item,
                activeCheckpointId: created.id,
                nextReviewAt: created.nextReviewAt ?? item.nextReviewAt,
              }
            : item,
        ),
      });
      return structuredClone(created);
    },

    updateMentorshipCheckpointResult(input) {
      const current = readLatest();
      const checkpoint = getCheckpointOrThrow(
        current,
        input.checkpointId,
      );
      const now = new Date().toISOString();
      const evidence = input.evidence
        ? toEvidence(checkpoint.id, input.evidence)
        : current.mentorshipEvidence.filter((item) =>
            checkpoint.evidenceIds.includes(item.id),
          );
      const updated: MentorshipCheckpoint = {
        ...checkpoint,
        executionStatus: input.executionStatus,
        status: current.mentorshipPreReads.some(
          (item) =>
            item.checkpointId === checkpoint.id &&
            item.status === "sent",
        )
          ? "pre_read_sent"
          : input.executionStatus,
        resultSummary: clean(input.resultSummary),
        changedAssumption: clean(input.changedAssumption),
        blockerSummary: clean(input.blockerSummary),
        evidenceIds: evidence.map((item) => item.id),
        updatedAt: now,
      };
      commit({
        ...current,
        mentorshipCheckpoints: current.mentorshipCheckpoints.map(
          (item) => (item.id === updated.id ? updated : item),
        ),
        mentorshipEvidence: [
          ...current.mentorshipEvidence.filter(
            (item) => item.checkpointId !== checkpoint.id,
          ),
          ...evidence,
        ],
      });
      return structuredClone(updated);
    },

    getMentorshipEvidence(checkpointId) {
      return structuredClone(
        readLatest().mentorshipEvidence.filter(
          (item) => item.checkpointId === checkpointId,
        ),
      );
    },

    attachMentorshipEvidence(input) {
      const current = readLatest();
      const checkpoint = getCheckpointOrThrow(
        current,
        input.checkpointId,
      );
      const evidence = toEvidence(checkpoint.id, input.evidence);
      commit({
        ...current,
        mentorshipEvidence: [
          ...current.mentorshipEvidence.filter(
            (item) => item.checkpointId !== checkpoint.id,
          ),
          ...evidence,
        ],
        mentorshipCheckpoints: current.mentorshipCheckpoints.map(
          (item) =>
            item.id === checkpoint.id
              ? {
                  ...item,
                  evidenceIds: evidence.map((entry) => entry.id),
                  updatedAt: new Date().toISOString(),
                }
              : item,
        ),
      });
      return structuredClone(evidence);
    },

    ...preReadMethods,
  };
}
