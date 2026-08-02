export type LecturerMentorAvailability =
  | "Rảnh"
  | "Bận nhẹ"
  | "Bận"
  | "Tạm ngưng nhận request";

export type LecturerMentorStatus =
  | "Đang hoạt động"
  | "Tạm ngưng"
  | "Chưa kích hoạt"
  | "Đã rời chương trình";

export interface UniversityLecturerMentorSummary {
  id: string;
  name: string;
  avatarUrl: string;
  academicTitle: string;
  faculty: string;
  department?: string;
  expertise: string[];
  activeRequestCount: number;
  medianResponseHours: number;
  acceptanceRate: number;
  availability: LecturerMentorAvailability;
  status: LecturerMentorStatus;
  supportedVentures: string[];
  recentActivity: string;
  demandLevel: "Cao" | "Trung bình" | "Ổn định";
}

export interface LecturerExpertiseDemand {
  label: string;
  value: number;
}

