import type { MentorConversationSource } from "../types/conversation-session.types";

export function createCampusFlowMentorConversationSources(): MentorConversationSource[] {
  return [
    {
      id: "mentor-quan-kizuna-profile",
      title: "Hồ sơ mentor Trần Minh Quân",
      description:
        "Danh tính, vai trò Product Lead và chuyên môn chính đã được Kizuna xác minh trong dữ liệu demo.",
      provenance: "kizuna_verified",
      verificationStatus: "verified",
      capturedAt: "2026-07-28T09:00:00.000Z",
    },
    {
      id: "mentor-quan-self-declared",
      title: "Thông tin mentoring do mentor khai báo",
      description:
        "Availability, cách làm việc và hình thức đồng hành do mentor tự khai báo.",
      provenance: "mentor_self_declared",
      verificationStatus: "self_declared",
      capturedAt: "2026-07-28T09:00:00.000Z",
    },
    {
      id: "mentor-ha-kizuna-profile",
      title: "Hồ sơ mentor Phạm Thu Hà",
      description:
        "Danh tính, vai trò Senior Product Researcher và các lĩnh vực chuyên môn chính.",
      provenance: "kizuna_verified",
      verificationStatus: "verified",
      capturedAt: "2026-07-29T09:00:00.000Z",
    },
    {
      id: "mentor-ha-public-profile",
      title: "Nguồn nghề nghiệp công khai",
      description: "Nguồn công khai chưa được cấu hình trong bản demo.",
      provenance: "public_source",
      verificationStatus: "unverified",
      capturedAt: "2026-07-29T09:00:00.000Z",
    },
    {
      id: "mentor-ha-self-declared",
      title: "Thông tin do Phạm Thu Hà khai báo",
      description:
        "Availability, ngôn ngữ và hình thức đồng hành do mentor tự khai báo.",
      provenance: "mentor_self_declared",
      verificationStatus: "self_declared",
      capturedAt: "2026-07-29T09:00:00.000Z",
    },
    {
      id: "campusflow-venture-brief",
      title: "CampusFlow Venture Brief",
      description:
        "Bối cảnh Prototype, nhu cầu pilot 14 ngày và outcome founder đang cần.",
      provenance: "kizuna_verified",
      verificationStatus: "verified",
      capturedAt: "2026-07-28T08:30:00.000Z",
    },
    {
      id: "mentor-priority-kizuna-inference",
      title: "Lý do ưu tiên mentor",
      description:
        "Phân tích của Kizuna từ nhu cầu hiện tại của CampusFlow; không phải xếp hạng chất lượng mentor.",
      provenance: "kizuna_inference",
      verificationStatus: "inferred",
      capturedAt: "2026-08-03T09:12:00.000Z",
    },
    {
      id: "campusflow-pitch-pages-6-11",
      title: "Pitch Deck · Trang 6–11",
      description:
        "Problem, prototype, tín hiệu từ tester và hai câu lạc bộ quan tâm.",
      provenance: "kizuna_verified",
      verificationStatus: "verified",
      capturedAt: "2026-07-30T09:00:00.000Z",
    },
    {
      id: "campusflow-interview-summary",
      title: "Tổng hợp 12 interview",
      description:
        "Tóm tắt phỏng vấn người dùng phục vụ chuẩn bị pilot và user research.",
      provenance: "kizuna_verified",
      verificationStatus: "verified",
      capturedAt: "2026-07-30T09:00:00.000Z",
    },
  ];
}
