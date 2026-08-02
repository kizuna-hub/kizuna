import type { MentorConnectionBrief } from "../../../founder/ai-workspace/mentor-connection/public";

import type {
  MentorConnectionRequest,
  MentorPersona,
} from "../types/mentor-workspace.types";

export const canonicalMentorPersona: MentorPersona = {
  id: "mentor-tran-minh-quan",
  name: "Trần Minh Quân",
  role: "Product & Growth Mentor",
  organization: "VNPay",
  experience: "10+ năm xây dựng sản phẩm số",
  mentoringBackground: "Đã hỗ trợ 28 đội early-stage",
  expertise: [
    "Product validation",
    "Pilot design",
    "Community products",
    "Student startups",
  ],
  verificationLabel: "Verified Mentor",
  avatarSrc: "/images/mentors/tran-minh-quan.png",
  profileCompletion: 92,
};

function section(
  brief: MentorConnectionBrief,
  id:
    | "current_challenge"
    | "support_needed"
    | "expected_outcome"
    | "mentor_message",
) {
  return brief.sections.find((item) => item.id === id);
}

export function createCampusFlowMentorRequest(
  brief: MentorConnectionBrief,
): MentorConnectionRequest {
  const supportSection = section(brief, "support_needed");
  return {
    id: "request-campusflow",
    founder: {
      id: "founder-nguyen-tuan-ngoc",
      name: "Nguyễn Tuấn Ngọc",
      institution: "Nhóm sinh viên đại học",
    },
    venture: {
      id: brief.ventureId,
      name: "CampusFlow",
      stage: "prototype",
      teamSummary: "3 student founders",
      productSummary:
        "Nền tảng giúp các câu lạc bộ đại học onboarding, hỗ trợ và theo dõi thành viên mới.",
      tags: ["EdTech", "B2B", "SaaS"],
    },
    brief: {
      currentChallenge:
        section(brief, "current_challenge")?.content ??
        "Team cần làm rõ phạm vi pilot đầu tiên.",
      supportNeeded:
        supportSection?.checklistItems ??
        [supportSection?.content].filter(
          (item): item is string => Boolean(item),
        ),
      expectedOutcome:
        section(brief, "expected_outcome")?.content ??
        "Một kế hoạch pilot đủ rõ để bắt đầu trong tuần tiếp theo.",
      founderMessage:
        section(brief, "mentor_message")?.content,
      founderConfirmed: true,
    },
    evidence: brief.evidence.map((item) => ({
      id: item.id,
      label: item.label,
      value: item.detail,
      sourceLabel: item.sourceLabel,
    })),
    sharedDocuments: brief.documents
      .filter((item) =>
        brief.selectedDocumentIds.includes(item.id),
      )
      .map((item) => ({
        id: item.id,
        name: item.name,
        type: "pdf" as const,
        selectedPageLabels: ["Trang 6", "Trang 8", "Trang 11"],
        available: item.availability === "available",
      })),
    status: "new",
    fitScore: 96,
    expiresAt: "2026-08-04T16:59:00.000Z",
    createdAt: "2026-07-29T01:30:00.000Z",
    updatedAt: brief.updatedAt,
    briefVersion: 1,
  };
}

export function createSecondaryMentorRequests(): MentorConnectionRequest[] {
  return [
    {
      id: "request-studymate",
      founder: {
        id: "founder-le-mai-anh",
        name: "Lê Mai Anh",
        institution: "Sinh viên năm nhất",
      },
      venture: {
        id: "venture-studymate",
        name: "StudyMate",
        stage: "idea",
        teamSummary: "2 student founders",
        productSummary:
          "Công cụ giúp sinh viên năm nhất hình thành và duy trì nhóm học tập.",
        tags: ["EdTech", "Productivity"],
      },
      brief: {
        currentChallenge:
          "Team chưa xác định rõ vấn đề cấp thiết nhất của sinh viên năm nhất.",
        supportNeeded: [
          "Kiểm chứng vấn đề cốt lõi",
          "Ưu tiên phân khúc người dùng",
          "Chọn một hướng MVP đầu tiên",
        ],
        expectedOutcome:
          "Một problem statement rõ và một hướng MVP để kiểm chứng.",
        founderMessage:
          "Bọn em cần một góc nhìn thực tế để tránh xây quá rộng ngay từ đầu.",
        founderConfirmed: true,
      },
      evidence: [
        {
          id: "studymate-interviews",
          label: "8 phỏng vấn",
          value: "8 sinh viên năm nhất đã chia sẻ workflow học nhóm.",
        },
        {
          id: "studymate-concepts",
          label: "3 concept test",
          value: "Ba concept đã được test ở mức mô tả.",
        },
      ],
      sharedDocuments: [],
      status: "new",
      fitScore: 88,
      expiresAt: "2026-08-06T16:59:00.000Z",
      createdAt: "2026-07-28T08:15:00.000Z",
      updatedAt: "2026-07-28T08:15:00.000Z",
      briefVersion: 1,
    },
    {
      id: "request-ecotrack",
      founder: {
        id: "founder-pham-hoang-nam",
        name: "Phạm Hoàng Nam",
        institution: "Đại học Bách Khoa",
      },
      venture: {
        id: "venture-ecotrack",
        name: "EcoTrack",
        stage: "prototype",
        teamSummary: "4 thành viên",
        productSummary:
          "Ứng dụng giúp sinh viên theo dõi và cải thiện thói quen tiêu dùng bền vững.",
        tags: ["GreenTech", "B2C", "Mobile"],
      },
      brief: {
        currentChallenge:
          "Team đã có prototype nhưng chưa có go-to-market experiment đầu tiên.",
        supportNeeded: [
          "Chọn kênh acquisition đầu tiên",
          "Xác định early-adopter segment",
          "Thiết kế một GTM experiment nhỏ",
        ],
        expectedOutcome:
          "Một go-to-market experiment có thể chạy trong 14 ngày.",
        founderMessage:
          "Team mong anh giúp chọn một thử nghiệm đủ nhỏ để học nhanh.",
        founderConfirmed: true,
      },
      evidence: [
        {
          id: "ecotrack-interviews",
          label: "15 phỏng vấn",
          value: "15 sinh viên đã tham gia discovery interview.",
        },
        {
          id: "ecotrack-testers",
          label: "6 prototype tester",
          value: "6 người đã dùng thử prototype.",
        },
        {
          id: "ecotrack-partners",
          label: "3 community interest",
          value: "Ba cộng đồng quan tâm tới một thử nghiệm nhỏ.",
        },
      ],
      sharedDocuments: [],
      status: "viewed",
      fitScore: 81,
      expiresAt: "2026-08-03T16:59:00.000Z",
      createdAt: "2026-07-27T10:00:00.000Z",
      updatedAt: "2026-07-27T10:00:00.000Z",
      briefVersion: 1,
      viewedBriefVersion: 1,
    },
    {
      id: "request-launchpad",
      founder: {
        id: "founder-do-thu-trang",
        name: "Đỗ Thu Trang",
        institution: "Young Founders Network",
      },
      venture: {
        id: "venture-launchpad",
        name: "LaunchPad",
        stage: "pilot",
        teamSummary: "3 thành viên",
        productSummary:
          "Không gian thực hành giúp sinh viên biến ý tưởng thành thử nghiệm có evidence.",
        tags: ["EdTech", "Community"],
      },
      brief: {
        currentChallenge:
          "Pilot đầu tiên có engagement tốt nhưng tiêu chí chuyển đổi còn mơ hồ.",
        supportNeeded: [
          "Chốt activation event",
          "Rà lại pilot evidence",
        ],
        expectedOutcome:
          "Một activation definition dùng được cho vòng pilot tiếp theo.",
        founderMessage:
          "Cảm ơn anh đã đồng ý đồng hành cùng team.",
        founderConfirmed: true,
      },
      evidence: [
        {
          id: "launchpad-pilot",
          label: "1 pilot",
          value: "Một pilot với 24 sinh viên.",
        },
      ],
      sharedDocuments: [],
      status: "accepted",
      fitScore: 84,
      expiresAt: "2026-08-01T16:59:00.000Z",
      createdAt: "2026-07-24T09:00:00.000Z",
      updatedAt: "2026-07-27T04:30:00.000Z",
      briefVersion: 1,
      viewedBriefVersion: 1,
      acceptance: {
        id: "acceptance-launchpad",
        requestId: "request-launchpad",
        mentorId: canonicalMentorPersona.id,
        message:
          "Anh đã xem brief của LaunchPad. Em liên hệ với anh qua email để mình thống nhất lịch nhé.",
        contactMethod: "email",
        contactValue: "minhquan.mentor@example.com",
        meetingPreference: "google_meet",
        acceptedAt: "2026-07-27T04:30:00.000Z",
      },
    },
  ];
}
