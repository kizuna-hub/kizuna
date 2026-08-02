export type MentorConnectionStatus =
  | "Draft"
  | "Đã gửi"
  | "Mentor đã mở"
  | "Đang chờ phản hồi"
  | "Cần thêm context"
  | "Đã chấp nhận"
  | "Đã từ chối"
  | "Hết hạn";

export interface UniversityMentorConnectionSummary {
  id: string;
  ventureId: string;
  ventureName: string;
  ventureMark: string;
  mentorId: string;
  mentorName: string;
  mentorAvatarUrl: string;
  objective: string;
  expertise: string[];
  status: MentorConnectionStatus;
  createdAt: string;
  openedAt?: string;
  respondedAt?: string;
  waitingHours: number;
  responseHours?: number;
  needsContext?: boolean;
  mentorOverloaded?: boolean;
}

export interface MentorConnectionFunnelStep {
  id: string;
  label: string;
  count: number;
}

export interface MentorSupplyGap {
  expertise: string;
  ventureDemand: number;
  availableMentors: number;
  severity: "high" | "medium" | "healthy";
}

export interface MentorConnectionTimelineItem {
  label: string;
  time: string;
  complete: boolean;
}

