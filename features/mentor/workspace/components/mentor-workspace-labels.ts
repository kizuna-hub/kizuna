import type {
  MentorConnectionRequestStatus,
  MentorContactMethod,
  MentorMeetingPreference,
  MentorRequestStage,
} from "../types/mentor-workspace.types";

export const stageLabels: Record<MentorRequestStage, string> = {
  idea: "Idea",
  prototype: "Prototype",
  pilot: "Pilot",
  launched: "Đã ra mắt",
};

export const statusLabels: Record<
  MentorConnectionRequestStatus,
  string
> = {
  new: "Mới",
  viewed: "Đang xem",
  needs_more_context: "Chờ bổ sung",
  accepted: "Đã chấp nhận",
  declined: "Đã từ chối",
  cancelled: "Founder đã hủy",
};

export const contactMethodLabels: Record<
  MentorContactMethod,
  string
> = {
  zalo: "Zalo",
  phone: "Số điện thoại",
  email: "Email",
  messenger: "Messenger",
  mentor_will_contact: "Tôi sẽ chủ động liên hệ",
};

export const meetingPreferenceLabels: Record<
  MentorMeetingPreference,
  string
> = {
  google_meet: "Google Meet",
  in_person: "Gặp trực tiếp",
  coordinate_later: "Trao đổi để thống nhất sau",
};

export function relativeRequestTime(timestamp: string) {
  const labels: Record<string, string> = {
    "2026-07-29": "2 giờ trước",
    "2026-07-28": "Hôm qua",
    "2026-07-27": "2 ngày trước",
    "2026-07-24": "5 ngày trước",
  };
  return labels[timestamp.slice(0, 10)] ?? "Gần đây";
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase("vi");
}
