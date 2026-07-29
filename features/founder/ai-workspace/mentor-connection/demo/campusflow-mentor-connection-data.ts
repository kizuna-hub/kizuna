import type {
  MentorConnectionDocument,
  MentorConnectionEvidence,
  VentureContextForMentorConnection,
} from "../types/mentor-connection.types";

export const campusFlowMentorVentureContext: VentureContextForMentorConnection =
  {
    ventureName: "CampusFlow",
    ventureStage: "Prototype",
    teamSummary: "3 student founders",
    ventureSummary:
      "Nền tảng giúp câu lạc bộ trong trường onboarding và hỗ trợ thành viên mới.",
  };

export const campusFlowMentorEvidence: MentorConnectionEvidence[] = [
  {
    id: "campusflow-interviews",
    label: "12 cuộc phỏng vấn khách hàng",
    detail:
      "12 người đã chia sẻ workflow onboarding hiện tại; đây là interview evidence, chưa phải usage thật.",
    sourceLabel: "CampusFlow-PitchDeck-v2.pdf · Trang 6",
    status: "verified",
  },
  {
    id: "campusflow-prototype-testers",
    label: "5 người test prototype",
    detail:
      "5 người dùng thử prototype và 4 người hoàn thành core flow.",
    sourceLabel: "CampusFlow-PitchDeck-v2.pdf · Trang 8",
    status: "verified",
  },
  {
    id: "campusflow-repeat-testers",
    label: "3 người quay lại test",
    detail:
      "3/5 người quay lại cho lần test thứ hai; chưa diễn ra trong workflow thật.",
    sourceLabel: "CampusFlow-PitchDeck-v2.pdf · Trang 8",
    status: "verified",
  },
  {
    id: "campusflow-pilot-interest",
    label: "2 câu lạc bộ quan tâm pilot",
    detail:
      "Hai câu lạc bộ đồng ý trao đổi; đây là pilot interest, chưa phải pilot đã xác nhận.",
    sourceLabel: "CampusFlow-BusinessPlan-v1.pdf · Trang 11",
    status: "verified",
  },
];

export const campusFlowMentorDocuments: MentorConnectionDocument[] = [
  {
    id: "campusflow-pitch-deck-v2",
    name: "CampusFlow-PitchDeck-v2.pdf",
    detail: "Customer discovery và prototype validation",
    updatedAt: "2026-07-27T11:06:00.000Z",
    availability: "available",
  },
  {
    id: "campusflow-business-plan-v1",
    name: "CampusFlow-BusinessPlan-v1.pdf",
    detail: "Pilot interest · Không được chọn mặc định",
    updatedAt: "2026-07-27T11:06:00.000Z",
    availability: "available",
  },
];

