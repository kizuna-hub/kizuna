import type {
  MentorMatch,
  MentorRecommendationGridPayload,
  MentorRecommendationState,
} from "../types/mentor-recommendation.types";

const GENERATED_AT = "2026-07-29T03:16:00.000Z";

export const campusFlowMentorMatches: MentorMatch[] = [
  {
    mentorId: "mentor-tran-minh-quan",
    profile: {
      name: "Trần Minh Quân",
      avatarSrc: "/images/mentors/tran-minh-quan.png",
      role: "Product Lead",
      organization: "VNPay",
      shortBio:
        "10+ năm xây dựng sản phẩm số. Đã hỗ trợ 28 đội early-stage chuyển prototype thành pilot có phạm vi và metric rõ ràng.",
    },
    availability: {
      status: "available",
      label: "Đang nhận kết nối",
      nextSlots: ["Thứ Năm · 10:00", "Thứ Sáu · 14:30"],
      meetingMethods: ["google_meet", "in_person"],
    },
    fit: {
      score: 92,
      level: "excellent",
      label: "Rất phù hợp",
      isPrimary: true,
    },
    relevantExpertise: [
      "Pilot design",
      "Product validation",
      "Community products",
      "Student startups",
    ],
    relevantExperience: [
      {
        id: "quan-early-stage",
        label: "Đội early-stage đã hỗ trợ",
        value: "28",
      },
      {
        id: "quan-community-pilots",
        label: "Community hoặc organization pilot",
        value: "9",
      },
      {
        id: "quan-stage",
        label: "Venture ở Idea–Prototype",
        value: "12",
      },
      {
        id: "quan-student-programs",
        label: "Chương trình hỗ trợ sinh viên",
        value: "4",
      },
    ],
    fitReasons: [
      {
        id: "quan-stage-fit",
        title: "Đúng giai đoạn",
        description:
          "CampusFlow đang ở Prototype và chuẩn bị thử nghiệm trong workflow thật.",
      },
      {
        id: "quan-need-fit",
        title: "Đúng nhu cầu",
        description:
          "Team cần chuyển pilot interest thành một pilot có phạm vi, metric và người phụ trách rõ.",
      },
      {
        id: "quan-domain-fit",
        title: "Đúng bối cảnh",
        description:
          "Kinh nghiệm với community products và student startups khớp với nhóm người dùng hiện tại.",
      },
      {
        id: "quan-outcome-fit",
        title: "Đúng outcome",
        description:
          "Phiên hỗ trợ tập trung vào thiết kế pilot và evidence cần thu thập, không mở rộng sang tư vấn chung.",
      },
    ],
    recommendedFor:
      "Thiết kế pilot có phạm vi, metric và evidence cụ thể.",
    expectedOutcomes: [
      "Câu lạc bộ phù hợp cho pilot đầu tiên",
      "Phạm vi thử nghiệm trong 14 ngày",
      "Số thành viên tham gia và primary success metric",
      "Evidence cần thu thập",
      "Người phụ trách từng phần",
    ],
    pricing: {
      type: "free",
      label: "Miễn phí cho sinh viên",
    },
    durationMinutes: 45,
  },
  {
    mentorId: "mentor-pham-thu-ha",
    profile: {
      name: "Phạm Thu Hà",
      avatarSrc: "/images/mentors/pham-thu-ha.png",
      role: "Senior Product Researcher",
      organization: "MoMo",
      shortBio:
        "Chuyên hỗ trợ đội early-stage xác định đúng user segment và biến prototype feedback thành insight có thể hành động.",
    },
    availability: {
      status: "available",
      label: "Đang nhận kết nối",
      nextSlots: ["Thứ Tư · 19:00", "Thứ Bảy · 09:30"],
      meetingMethods: ["google_meet"],
    },
    fit: {
      score: 84,
      level: "strong",
      label: "Phù hợp",
      isPrimary: false,
    },
    relevantExpertise: [
      "Customer discovery",
      "User research",
      "Prototype testing",
      "Problem validation",
    ],
    relevantExperience: [
      {
        id: "ha-startups",
        label: "Startup đã hỗ trợ",
        value: "19",
      },
      {
        id: "ha-research",
        label: "Phiên user research",
        value: "34",
      },
      {
        id: "ha-validation",
        label: "Dự án prototype validation",
        value: "11",
      },
      {
        id: "ha-student-teams",
        label: "Đội startup sinh viên",
        value: "6",
      },
    ],
    fitReasons: [
      {
        id: "ha-stage-fit",
        title: "Đúng giai đoạn học hỏi",
        description:
          "CampusFlow đã có prototype feedback nhưng vẫn cần làm rõ nhóm user ưu tiên.",
      },
      {
        id: "ha-research-fit",
        title: "Đúng nhu cầu nghiên cứu",
        description:
          "Kinh nghiệm customer discovery giúp team tách tín hiệu thật khỏi phản hồi chung chung.",
      },
      {
        id: "ha-prototype-fit",
        title: "Đúng loại bằng chứng",
        description:
          "Chuyên môn prototype testing phù hợp để thiết kế vòng validation tiếp theo.",
      },
    ],
    recommendedFor:
      "Làm rõ user segment và kế hoạch prototype validation tiếp theo.",
    expectedOutcomes: [
      "Nhóm user ưu tiên cho vòng validation tiếp theo",
      "Interview questions cần bổ sung",
      "Prototype assumption cần kiểm tra",
      "Success signal cho lần test tiếp theo",
    ],
    pricing: {
      type: "paid",
      amount: 300_000,
      currency: "VND",
      unit: "session",
      durationMinutes: 60,
      label: "300.000đ / phiên",
    },
    durationMinutes: 60,
  },
  {
    mentorId: "mentor-nguyen-hoang-long",
    profile: {
      name: "Nguyễn Hoàng Long",
      avatarSrc: "/images/mentors/nguyen-hoang-long.png",
      role: "Community Program Lead",
      organization: "DNES",
      shortBio:
        "Có kinh nghiệm triển khai chương trình với câu lạc bộ, cộng đồng sinh viên và các chương trình ươm tạo.",
    },
    availability: {
      status: "available",
      label: "Đang nhận kết nối",
      nextSlots: ["Thứ Sáu · 16:00", "Chủ Nhật · 10:00"],
      meetingMethods: ["google_meet", "in_person"],
    },
    fit: {
      score: 79,
      level: "good",
      label: "Phù hợp",
      isPrimary: false,
    },
    relevantExpertise: [
      "Community operations",
      "University programs",
      "Pilot operations",
      "Partnership outreach",
    ],
    relevantExperience: [
      {
        id: "long-student-teams",
        label: "Đội sinh viên đã hỗ trợ",
        value: "35",
      },
      {
        id: "long-community",
        label: "Chương trình cộng đồng",
        value: "14",
      },
      {
        id: "long-university",
        label: "University pilot program",
        value: "8",
      },
      {
        id: "long-workshops",
        label: "Partnership workshop",
        value: "12",
      },
    ],
    fitReasons: [
      {
        id: "long-community-fit",
        title: "Đúng hệ sinh thái",
        description:
          "CampusFlow cần thử nghiệm trong cộng đồng sinh viên và câu lạc bộ.",
      },
      {
        id: "long-operations-fit",
        title: "Đúng nhu cầu vận hành",
        description:
          "Kinh nghiệm pilot operations giúp team xác định stakeholder và quy trình phối hợp thực tế.",
      },
      {
        id: "long-partner-fit",
        title: "Đúng outcome đối tác",
        description:
          "Phiên hỗ trợ hướng tới chọn đơn vị pilot và cách tiếp cận phù hợp.",
      },
    ],
    recommendedFor:
      "Chọn đối tác pilot và xác định cách vận hành thử nghiệm trong cộng đồng sinh viên.",
    expectedOutcomes: [
      "Câu lạc bộ hoặc đơn vị phù hợp để pilot",
      "Stakeholder cần liên hệ",
      "Quy trình phối hợp trong 14 ngày",
      "Cách thu thập feedback từ cộng đồng",
    ],
    pricing: {
      type: "free",
      label: "Miễn phí",
    },
    durationMinutes: 30,
  },
];

export function createCampusFlowMentorPayload(
  ventureId: string,
): MentorRecommendationGridPayload {
  return {
    ventureId,
    contextSummary:
      "CampusFlow đang ở Prototype, cần chuyển tín hiệu quan tâm thành một pilot có phạm vi và bằng chứng rõ ràng.",
    primaryMentorId: "mentor-tran-minh-quan",
    mentors: structuredClone(campusFlowMentorMatches),
    generatedAt: GENERATED_AT,
  };
}

export function createCampusFlowMentorRecommendation(
  ventureId: string,
  decisionCycleId: string,
  blockerId: string,
): MentorRecommendationState {
  const payload = createCampusFlowMentorPayload(ventureId);
  return {
    payload,
    selectedMentorId: payload.primaryMentorId,
    savedMentorIds: [],
    status: "recommended",
    decisionCycleId,
    blockerId,
    recommendationVersion: 1,
  };
}
