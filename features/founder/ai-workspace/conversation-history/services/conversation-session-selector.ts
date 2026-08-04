import type { ConversationSession } from "../../types/long-run-workspace.types";
import type { SecondaryPaneMode } from "../../types/workspace-layout.types";
import {
  conversationSessionTypeLabels,
  type ConversationSessionFilter,
  type FounderConversationSessionType,
} from "../types/conversation-session.types";

const mentorNames: Record<string, string> = {
  "mentor-tran-minh-quan": "Trần Minh Quân",
  "mentor-pham-thu-ha": "Phạm Thu Hà",
};

export function getConversationMentorNames(
  session: ConversationSession,
) {
  return (session.mentorIds ?? []).map(
    (mentorId) => mentorNames[mentorId] ?? mentorId,
  );
}

export function normalizeVietnameseSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLocaleLowerCase("vi")
    .trim();
}

export function selectMentorConversationSessions(
  sessions: ConversationSession[],
) {
  return sessions
    .filter(
      (session) =>
        !session.isArchived && Boolean(session.historyType),
    )
    .sort((left, right) => {
      if (left.isPinned !== right.isPinned) {
        return left.isPinned ? -1 : 1;
      }
      return right.updatedAt.localeCompare(left.updatedAt);
    });
}

export function filterMentorConversationSessions(
  sessions: ConversationSession[],
  query: string,
  filter: ConversationSessionFilter,
) {
  const normalizedQuery = normalizeVietnameseSearch(query);
  return selectMentorConversationSessions(sessions).filter(
    (session) => {
      if (filter !== "all" && session.historyType !== filter) {
        return false;
      }
      if (!normalizedQuery) return true;
      const category = session.historyType
        ? conversationSessionTypeLabels[session.historyType]
        : "";
      const searchable = normalizeVietnameseSearch(
        [
          session.title,
          session.preview ?? "",
          session.contextSnapshot?.ventureName ?? "",
          category,
          ...getConversationMentorNames(session),
        ].join(" "),
      );
      return searchable.includes(normalizedQuery);
    },
  );
}

export function formatConversationSessionTime(value: string) {
  const labels: Record<string, string> = {
    "2026-08-03": "Hôm qua",
    "2026-08-02": "2 ngày trước",
    "2026-08-01": "3 ngày trước",
    "2026-07-30": "5 ngày trước",
    "2026-07-28": "1 tuần trước",
  };
  const date = value.slice(0, 10);
  if (labels[date]) return labels[date];
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function getConversationPlaceholder(
  type?: FounderConversationSessionType,
) {
  switch (type) {
    case "mentor_matching":
      return "Hỏi thêm về lý do matching…";
    case "mentor_profile":
      return "Hỏi thêm về hồ sơ chị Hà…";
    case "mentor_comparison":
      return "Hỏi thêm về hai mentor…";
    case "session_preparation":
      return "Hỏi thêm về buổi gặp với anh Quân…";
    case "mentor_questions":
      return "Hỏi thêm về các câu hỏi cần chuẩn bị…";
    default:
      return "Mô tả điều bạn đang cần làm rõ…";
  }
}

export function getConversationSuggestedPrompts(
  type?: FounderConversationSessionType,
) {
  switch (type) {
    case "mentor_matching":
      return [
        "Chị Hà phù hợp cho outcome nào?",
        "Nguồn nào hỗ trợ lý do matching?",
      ];
    case "mentor_profile":
      return [
        "Thông tin nào đã được xác minh?",
        "Vì sao chị Hà phù hợp với CampusFlow?",
      ];
    case "mentor_comparison":
      return [
        "Chuẩn bị yêu cầu gửi anh Quân",
        "Ai phù hợp đồng hành dài hạn?",
      ];
    case "session_preparation":
      return [
        "Rút gọn agenda còn 30 phút",
        "Tài liệu nào quan trọng nhất?",
      ];
    case "mentor_questions":
      return [
        "Chọn 5 câu quan trọng nhất",
        "Nhóm câu hỏi theo outcome",
      ];
    default:
      return [];
  }
}

export function getConversationHistoryPaneMode(
  type: FounderConversationSessionType,
): SecondaryPaneMode {
  switch (type) {
    case "mentor_matching":
      return "mentor_fit";
    case "mentor_profile":
      return "mentor_sources";
    case "mentor_comparison":
      return "mentor_comparison";
    case "session_preparation":
      return "session_preparation";
    case "mentor_questions":
      return "mentor_questions";
  }
}
