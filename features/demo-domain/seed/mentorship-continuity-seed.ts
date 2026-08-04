import type { DemoDomainState } from "../types/demo-domain.types";
import type {
  MentorshipCheckpoint,
  MentorshipJourneySummary,
} from "../types/mentorship-continuity.types";

const FOUNDER_ID = "founder-nguyen-tuan-ngoc";
const CONNECTED_AT = "2026-07-15T07:00:00.000Z";
const NEXT_REVIEW_AT = "2026-08-18T07:00:00.000Z";

function checkpoint(
  requestId: string,
  ventureId: string,
  mentorId: string,
  input: Omit<
    MentorshipCheckpoint,
    | "ventureId"
    | "founderId"
    | "mentorId"
    | "connectionRequestId"
  >,
): MentorshipCheckpoint {
  return {
    ...input,
    ventureId,
    founderId: FOUNDER_ID,
    mentorId,
    connectionRequestId: requestId,
  };
}

function createCampusFlowMentorshipSeed(
  requestId: string,
  ventureId: string,
  mentorId: string,
): {
  journey: MentorshipJourneySummary;
  checkpoints: MentorshipCheckpoint[];
} {
  const checkpoints = [
    checkpoint(requestId, ventureId, mentorId, {
      id: `mentorship-${ventureId}-kickoff`,
      sequence: 0,
      title: "Thiết lập mục tiêu đồng hành",
      sessionDate: "2026-07-15T07:00:00.000Z",
      decision:
        "Tập trung làm rõ buyer, buying process và người ra quyết định trong trường đại học.",
      founderCommitment:
        "Chuẩn bị danh sách giả định hiện tại và ba nhóm stakeholder ban đầu.",
      nextReviewQuestion:
        "Nhóm đang nhầm lẫn user, influencer và buyer ở điểm nào?",
      source: "mentor_confirmed",
      status: "reviewed",
      evidenceIds: [],
      createdAt: "2026-07-15T07:00:00.000Z",
      updatedAt: "2026-07-15T07:00:00.000Z",
    }),
    checkpoint(requestId, ventureId, mentorId, {
      id: `mentorship-${ventureId}-checkpoint-1`,
      sequence: 1,
      title: "Hiểu nhu cầu thật sự của phòng/ban đào tạo",
      sessionDate: "2026-07-18T07:00:00.000Z",
      decision:
        "Không tiếp tục giả định rằng phòng CNTT là buyer chính.",
      founderCommitment:
        "Trao đổi với đại diện vận hành chương trình tại ba trường.",
      nextReviewQuestion:
        "Đâu là người dùng, người ảnh hưởng và bên phê duyệt?",
      source: "founder_reported",
      status: "reviewed",
      evidenceIds: [],
      createdAt: "2026-07-18T07:00:00.000Z",
      updatedAt: "2026-07-18T07:00:00.000Z",
    }),
    checkpoint(requestId, ventureId, mentorId, {
      id: `mentorship-${ventureId}-checkpoint-2`,
      sequence: 2,
      title: "Làm rõ buying process của trường đại học",
      sessionDate: "2026-08-01T07:00:00.000Z",
      decision:
        "Đội ngũ quyết định chưa phát triển thêm các tính năng cho dashboard trường đại học. Trước khi đầu tư sản phẩm, team sẽ ưu tiên làm rõ buying process, các bên liên quan và tiêu chí ra quyết định.",
      founderCommitment:
        "Phỏng vấn đại diện tại ba trường đại học: một trường công lập, một trường ngoài công lập và một trường hoặc chương trình quốc tế. Mỗi trường cần có insight từ người vận hành và người có ảnh hưởng tới quyết định.",
      nextReviewQuestion:
        "Stakeholder map và decision flow hiện tại đã phản ánh đúng buying process chưa? Team còn bỏ sót bên liên quan hoặc bước phê duyệt nào không?",
      nextReviewAt: NEXT_REVIEW_AT,
      source: "founder_reported",
      status: "recorded",
      evidenceIds: [],
      createdAt: "2026-08-01T07:00:00.000Z",
      updatedAt: "2026-08-01T07:00:00.000Z",
    }),
  ];

  return {
    journey: {
      ventureId,
      mentorId,
      connectionRequestId: requestId,
      connectedAt: CONNECTED_AT,
      currentGoal: "Làm rõ buying process của trường đại học",
      nextReviewAt: NEXT_REVIEW_AT,
      activeCheckpointId: checkpoints[2].id,
    },
    checkpoints,
  };
}

export function seedAcceptedMentorshipJourneys(
  state: DemoDomainState,
): DemoDomainState {
  let next = state;
  for (const request of state.connectionRequests) {
    if (
      request.status !== "accepted" ||
      !request.acceptance ||
      next.mentorshipJourneys.some(
        (journey) => journey.ventureId === request.ventureId,
      )
    ) {
      continue;
    }
    const seed = createCampusFlowMentorshipSeed(
      request.id,
      request.ventureId,
      request.mentorId,
    );
    next = {
      ...next,
      mentorshipJourneys: [
        ...next.mentorshipJourneys,
        seed.journey,
      ],
      mentorshipCheckpoints: [
        ...next.mentorshipCheckpoints,
        ...seed.checkpoints,
      ],
    };
  }
  return next;
}
