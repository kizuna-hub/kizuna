import type {
  ConversationSession,
  LongRunWorkspaceState,
} from "../../types/long-run-workspace.types";
import type {
  ConversationContextSnapshot,
  FounderConversationSessionType,
} from "../types/conversation-session.types";
import { createCampusFlowMentorConversationMessages } from "./mentor-conversation-message-seed";
import {
  CAMPUSFLOW_MENTOR_CONVERSATION_IDS,
  type CampusFlowMentorConversationId,
} from "./mentor-conversation-seed-ids";
import { createCampusFlowMentorConversationSources } from "./mentor-conversation-source-seed";

export { CAMPUSFLOW_MENTOR_CONVERSATION_IDS } from "./mentor-conversation-seed-ids";

const QUAN_ID = "mentor-tran-minh-quan";
const HA_ID = "mentor-pham-thu-ha";

function contextSnapshot(
  capturedAt: string,
  selectedMentorIds: string[],
  sourceIds: string[],
  expectedOutcome: string,
): ConversationContextSnapshot {
  return {
    ventureName: "CampusFlow",
    ventureStage: "Prototype",
    currentSupportNeed:
      "Chuyển sự quan tâm của hai câu lạc bộ thành một pilot có phạm vi và cách đo rõ ràng.",
    expectedOutcome,
    selectedMentorIds,
    sourceIds,
    capturedAt,
  };
}

function session(
  id: CampusFlowMentorConversationId,
  ventureId: string,
  title: string,
  historyType: FounderConversationSessionType,
  preview: string,
  mentorIds: string[],
  sourceIds: string[],
  createdAt: string,
  updatedAt: string,
  expectedOutcome: string,
  isPinned = false,
): ConversationSession {
  return {
    id,
    ventureId,
    title,
    category: "mentor_preparation",
    createdAt,
    updatedAt,
    isPinned,
    isArchived: false,
    summaryStatus: "none",
    historyType,
    preview,
    mentorIds,
    sourceIds,
    contextSnapshot: contextSnapshot(
      createdAt,
      mentorIds,
      sourceIds,
      expectedOutcome,
    ),
  };
}

export function createCampusFlowMentorConversationSessions(
  ventureId: string,
): ConversationSession[] {
  return [
    session(
      CAMPUSFLOW_MENTOR_CONVERSATION_IDS[0],
      ventureId,
      "Vì sao Trần Minh Quân được ưu tiên?",
      "mentor_matching",
      "Kizuna giải thích sự phù hợp dựa trên pilot design, giai đoạn hiện tại và outcome CampusFlow đang cần.",
      [QUAN_ID],
      [
        "mentor-quan-kizuna-profile",
        "mentor-quan-self-declared",
        "campusflow-venture-brief",
        "mentor-priority-kizuna-inference",
      ],
      "2026-08-03T09:00:00.000Z",
      "2026-08-03T09:18:00.000Z",
      "Chốt phạm vi pilot 14 ngày, success metric và evidence cần thu thập.",
      true,
    ),
    session(
      CAMPUSFLOW_MENTOR_CONVERSATION_IDS[1],
      ventureId,
      "Hồ sơ và kinh nghiệm của Phạm Thu Hà",
      "mentor_profile",
      "Thông tin nghề nghiệp, chuyên môn, nguồn xác minh và những dữ liệu do mentor tự khai báo.",
      [HA_ID],
      [
        "mentor-ha-kizuna-profile",
        "mentor-ha-public-profile",
        "mentor-ha-self-declared",
        "mentor-priority-kizuna-inference",
      ],
      "2026-08-02T08:30:00.000Z",
      "2026-08-02T08:42:00.000Z",
      "Hiểu rõ hồ sơ và provenance trước khi cân nhắc kết nối.",
    ),
    session(
      CAMPUSFLOW_MENTOR_CONVERSATION_IDS[2],
      ventureId,
      "So sánh mentor cho pilot và user research",
      "mentor_comparison",
      "So sánh hai mentor theo quyết định và outcome mà CampusFlow cần mở khóa.",
      [QUAN_ID, HA_ID],
      [
        "mentor-quan-kizuna-profile",
        "mentor-ha-kizuna-profile",
        "campusflow-venture-brief",
      ],
      "2026-08-01T10:00:00.000Z",
      "2026-08-01T10:16:00.000Z",
      "Chọn mentor theo outcome cần mở khóa, không dựa trên xếp hạng chung.",
    ),
    session(
      CAMPUSFLOW_MENTOR_CONVERSATION_IDS[3],
      ventureId,
      "Chuẩn bị phiên thiết kế pilot 14 ngày",
      "session_preparation",
      "Agenda, tài liệu cần chuẩn bị và outcome cần chốt sau phiên mentoring.",
      [QUAN_ID],
      [
        "campusflow-venture-brief",
        "campusflow-pitch-pages-6-11",
        "campusflow-interview-summary",
      ],
      "2026-07-30T09:30:00.000Z",
      "2026-07-30T09:52:00.000Z",
      "Rời phiên với kế hoạch pilot đủ rõ để bắt đầu.",
    ),
    session(
      CAMPUSFLOW_MENTOR_CONVERSATION_IDS[4],
      ventureId,
      "Câu hỏi cần làm rõ trong buổi gặp mentor",
      "mentor_questions",
      "Các câu hỏi về pilot scope, success metric, evidence và cách thực thi.",
      [QUAN_ID],
      ["campusflow-venture-brief", "campusflow-interview-summary"],
      "2026-07-28T14:00:00.000Z",
      "2026-07-28T14:15:00.000Z",
      "Dùng câu hỏi để buộc phiên mentoring tạo ra quyết định cụ thể.",
    ),
  ];
}

export function ensureCampusFlowMentorConversationHistory(
  state: LongRunWorkspaceState,
): LongRunWorkspaceState {
  if (
    state.ventureId !== "venture-campusflow" &&
    state.ventureId !== "campusflow"
  ) {
    return state;
  }
  const seededSessions = createCampusFlowMentorConversationSessions(
    state.ventureId,
  );
  const seededMessages = createCampusFlowMentorConversationMessages();
  const seededSources = createCampusFlowMentorConversationSources();
  const sessionIds = new Set(state.sessions.map((item) => item.id));
  const sourceIds = new Set(
    (state.conversationSources ?? []).map((item) => item.id),
  );
  const missingSessions = seededSessions.filter(
    (item) => !sessionIds.has(item.id),
  );

  return {
    ...state,
    sessions: [...missingSessions, ...state.sessions],
    messagesByConversation: {
      ...seededMessages,
      ...state.messagesByConversation,
    },
    draftsByConversation: {
      ...Object.fromEntries(seededSessions.map((item) => [item.id, ""])),
      ...state.draftsByConversation,
    },
    attachmentsByConversation: {
      ...Object.fromEntries(seededSessions.map((item) => [item.id, []])),
      ...state.attachmentsByConversation,
    },
    visibleMessageCountByConversation: {
      ...Object.fromEntries(seededSessions.map((item) => [item.id, 20])),
      ...state.visibleMessageCountByConversation,
    },
    conversationSources: [
      ...(state.conversationSources ?? []),
      ...seededSources.filter((item) => !sourceIds.has(item.id)),
    ],
  };
}
