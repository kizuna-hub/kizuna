import type {
  ExplainableReadinessAssessment,
  ReadinessContribution,
  ReadinessCriterion,
  ReadinessSourceDocument,
} from "../types/readiness.types";
import { calculateOverallReadiness } from "../services/readiness-calculator";

const observedAt = "2026-07-27T11:06:00.000Z";

function contribution(
  value: ReadinessContribution,
): ReadinessContribution {
  return value;
}

export const novaLabsReadinessCriteria: ReadinessCriterion[] = [
  {
    id: "problem_and_user",
    label: "Vấn đề và người dùng",
    description:
      "Mức độ rõ ràng của vấn đề, nhóm người dùng và tác động thực tế.",
    weight: 15,
    score: 82,
    delta: 4,
    confidence: "high",
    contributions: [
      contribution({
        id: "pitch-target-customer",
        criterionId: "problem_and_user",
        type: "positive",
        status: "verified",
        title: "Nhóm khách hàng mục tiêu được mô tả nhất quán",
        interpretation:
          "Pitch deck xác định rõ nhóm vận hành B2B SaaS cần rút ngắn thời gian tạo báo cáo.",
        confidence: "high",
        contributionPoints: 12,
        source: {
          fileName: "PitchDeck-v5.pdf",
          page: 4,
          totalPages: 20,
          section: "Khách hàng mục tiêu",
          quote:
            "Đội vận hành B2B SaaS 20–100 nhân sự đang ghép báo cáo thủ công mỗi tuần.",
        },
        observedAt,
        freshnessDays: 12,
        dedupeKey: "pitch-v5-p4-target-customer",
        canonical: true,
      }),
      contribution({
        id: "feedback-problem-frequency",
        criterionId: "problem_and_user",
        type: "positive",
        status: "verified",
        title: "Tần suất vấn đề được xác nhận",
        interpretation:
          "Tổng hợp phản hồi cho thấy công việc này xuất hiện hàng tuần.",
        confidence: "high",
        contributionPoints: 8,
        source: {
          fileName: "UserFeedback-Summary.md",
          section: "Tần suất vấn đề",
          quote: "15/18 người tham gia thực hiện báo cáo ít nhất mỗi tuần.",
        },
        observedAt,
        freshnessDays: 18,
        dedupeKey: "feedback-frequency-weekly",
      }),
    ],
    missingEvidence: [],
    contradictions: [],
    improvementActions: [
      "Giữ định nghĩa người dùng mục tiêu nhất quán khi thu thập bằng chứng mới.",
    ],
  },
  {
    id: "customer_evidence",
    label: "Bằng chứng khách hàng",
    description:
      "Mức độ có bằng chứng xác thực rằng khách hàng thật sự thấy giá trị.",
    weight: 25,
    score: 42,
    delta: 0,
    confidence: "medium",
    contributions: [
      contribution({
        id: "pitch-interview-claim",
        criterionId: "customer_evidence",
        type: "positive",
        status: "verified",
        title: "Phỏng vấn cho thấy giá trị ban đầu",
        interpretation:
          "Tín hiệu tích cực nhưng mới phản ánh ý kiến, chưa chứng minh sử dụng lặp lại.",
        confidence: "high",
        contributionPoints: 18,
        source: {
          fileName: "PitchDeck-v5.pdf",
          page: 6,
          totalPages: 20,
          section: "Validation từ người dùng",
          quote: "8/10 người được phỏng vấn cho rằng sản phẩm hữu ích.",
          context: "Khảo sát 20 người dùng thử trong 2 tuần.",
        },
        observedAt,
        freshnessDays: 16,
        dedupeKey: "pitch-v5-p6-eight-of-ten",
        canonical: true,
      }),
      contribution({
        id: "funnel-activation",
        criterionId: "customer_evidence",
        type: "negative",
        status: "inferred",
        title: "Activation còn thấp",
        interpretation:
          "Chỉ 18% người onboard chạm tới hành vi giá trị, làm yếu tuyên bố về giá trị.",
        confidence: "medium",
        contributionPoints: -8,
        source: {
          fileName: "FunnelReport-May.pdf",
          page: 4,
          totalPages: 12,
          section: "Activation",
          quote: "Activation sau onboarding: 18%.",
        },
        observedAt,
        freshnessDays: 25,
        dedupeKey: "funnel-may-p4-activation-18",
      }),
      contribution({
        id: "interview-next-step",
        criterionId: "customer_evidence",
        type: "negative",
        status: "inferred",
        title: "Người dùng chưa rõ bước tiếp theo",
        interpretation:
          "Khoảnh khắc giá trị chưa đủ rõ để dẫn tới hành vi lặp lại.",
        confidence: "medium",
        contributionPoints: -5,
        source: {
          fileName: "InterviewBatch-03.docx",
          page: 6,
          totalPages: 14,
          section: "Onboarding",
          quote: "Sau khi kết nối dữ liệu, tôi không rõ cần làm gì tiếp theo.",
        },
        observedAt,
        freshnessDays: 21,
        dedupeKey: "interviews-03-p6-next-step",
      }),
      contribution({
        id: "interview-weekly-cost",
        criterionId: "customer_evidence",
        type: "negative",
        status: "disputed",
        title: "Phản hồi mâu thuẫn về chi phí duy trì",
        interpretation:
          "Một người dùng thấy cập nhật hàng tuần tốn công hơn lợi ích nhận được.",
        confidence: "medium",
        contributionPoints: -10,
        source: {
          fileName: "InterviewBatch-03.docx",
          page: 9,
          totalPages: 14,
          section: "Sử dụng lặp lại",
          quote: "Việc cập nhật dữ liệu hàng tuần vẫn quá tốn công.",
        },
        observedAt,
        freshnessDays: 21,
        dedupeKey: "interviews-03-p9-weekly-cost",
        excluded: true,
      }),
      contribution({
        id: "missing-paid-case-study",
        criterionId: "customer_evidence",
        type: "missing",
        status: "missing",
        title: "Chưa có case study khách hàng trả phí",
        interpretation:
          "Không có số liệu kết quả trước–sau gắn với khách hàng trả phí.",
        confidence: "low",
        contributionPoints: 0,
        source: {
          fileName: "CustomerInterviews.xlsx",
          section: "Paid customers",
        },
        observedAt,
        freshnessDays: 19,
        dedupeKey: "missing-paid-case-study",
        excluded: true,
      }),
      contribution({
        id: "missing-nps",
        criterionId: "customer_evidence",
        type: "missing",
        status: "missing",
        title: "Chưa có NPS/CSAT đáng tin cậy",
        interpretation:
          "Chưa đủ mẫu đánh giá từ đúng nhóm khách hàng mục tiêu.",
        confidence: "low",
        contributionPoints: 0,
        source: {
          fileName: "UserFeedback-Summary.md",
          section: "Satisfaction",
        },
        observedAt,
        freshnessDays: 18,
        dedupeKey: "missing-nps-csat",
        excluded: true,
      }),
    ],
    missingEvidence: [
      "Case study có kết quả đo được từ khách hàng trả phí",
      "Bằng chứng willingness to pay hoặc hợp đồng",
      "NPS/CSAT đáng tin cậy từ đúng nhóm khách hàng mục tiêu",
    ],
    contradictions: [
      "Pitch deck nói sản phẩm hữu ích, trong khi phỏng vấn cho thấy cập nhật hàng tuần vẫn tốn công.",
    ],
    improvementActions: [
      "Chạy pilot 14 ngày với 20 người dùng đã onboarding.",
      "Đo tỷ lệ tạo báo cáo lần thứ hai; ngưỡng thành công ≥25%.",
      "Xác minh kết quả bằng AnalyticsSnapshot thay vì tuyên bố trong deck.",
    ],
  },
  {
    id: "solution_validation",
    label: "Xác thực giải pháp",
    description:
      "Mức độ giải pháp đã được kiểm tra với hành vi và kết quả thực tế.",
    weight: 15,
    score: 58,
    delta: 7,
    confidence: "medium",
    contributions: [
      contribution({
        id: "onboarding-completion",
        criterionId: "solution_validation",
        type: "positive",
        status: "verified",
        title: "Onboarding được hoàn thành",
        interpretation:
          "76% người dùng hoàn tất onboarding, cho thấy flow có thể tiếp cận.",
        confidence: "high",
        contributionPoints: 10,
        source: {
          fileName: "FunnelReport-May.pdf",
          page: 3,
          totalPages: 12,
          quote: "Tỷ lệ hoàn tất onboarding: 76%.",
        },
        observedAt,
        freshnessDays: 25,
        dedupeKey: "funnel-may-p3-onboarding-76",
      }),
    ],
    missingEvidence: ["So sánh treatment và control đã được xác minh"],
    contradictions: [],
    improvementActions: [
      "Xác minh thử nghiệm activation bằng dữ liệu analytics.",
    ],
  },
  {
    id: "traction_and_business_model",
    label: "Traction và mô hình",
    description:
      "Chất lượng của acquisition, activation, retention và tín hiệu doanh thu.",
    weight: 15,
    score: 50,
    delta: 3,
    confidence: "medium",
    cap: {
      maxScore: 60,
      reason:
        "Traction bị giới hạn ở 60 cho tới khi có bằng chứng sử dụng lặp lại.",
      contributionId: "retention-cap",
    },
    contributions: [
      contribution({
        id: "acquisition-1243",
        criterionId: "traction_and_business_model",
        type: "informational",
        status: "inferred",
        title: "Acquisition có tín hiệu",
        interpretation:
          "1.243 lượt đăng ký cho thấy nhu cầu đầu phễu nhưng chưa chứng minh giá trị.",
        confidence: "medium",
        contributionPoints: 4,
        source: {
          fileName: "PitchDeck-v5.pdf",
          page: 8,
          totalPages: 20,
          quote: "1.243 lượt đăng ký trong 30 ngày.",
        },
        observedAt,
        freshnessDays: 16,
        dedupeKey: "pitch-v5-p8-signups-1243",
      }),
      contribution({
        id: "week-two-retention",
        criterionId: "traction_and_business_model",
        type: "negative",
        status: "verified",
        title: "Retention tuần 2 rất yếu",
        interpretation:
          "Chỉ 7% cohort quay lại sau hai tuần; chưa đủ điều kiện để scale.",
        confidence: "high",
        contributionPoints: -12,
        source: {
          fileName: "FunnelReport-May.pdf",
          page: 5,
          totalPages: 12,
          quote: "Retention tuần 2: 7%.",
        },
        observedAt,
        freshnessDays: 25,
        dedupeKey: "funnel-may-p5-retention-7",
      }),
      contribution({
        id: "retention-cap",
        criterionId: "traction_and_business_model",
        type: "cap",
        status: "verified",
        title: "Giới hạn vì chưa có sử dụng lặp lại",
        interpretation:
          "Điểm traction không thể vượt 60 khi retention tuần 2 dưới 15%.",
        confidence: "high",
        contributionPoints: 0,
        source: {
          fileName: "FunnelReport-May.pdf",
          page: 5,
          totalPages: 12,
          quote: "Retention tuần 2: 7%.",
        },
        observedAt,
        freshnessDays: 25,
        dedupeKey: "traction-cap-retention-under-15",
      }),
    ],
    missingEvidence: ["Sử dụng lặp lại", "Willingness to pay đã xác minh"],
    contradictions: [],
    improvementActions: [
      "Chỉ cân nhắc scale khi activation ≥25% và retention tuần 2 ≥15%.",
    ],
  },
  {
    id: "decision_and_execution",
    label: "Quyết định và thực thi",
    description:
      "Khả năng chuyển giả định thành quyết định, thử nghiệm và học hỏi.",
    weight: 10,
    score: 72,
    delta: 8,
    confidence: "high",
    contributions: [
      contribution({
        id: "decision-cycle-history",
        criterionId: "decision_and_execution",
        type: "positive",
        status: "verified",
        title: "Chu kỳ quyết định có owner và metric",
        interpretation:
          "Venture đã chốt action nhỏ, owner và tiêu chí review.",
        confidence: "high",
        contributionPoints: 12,
        source: {
          fileName: "UserFeedback-Summary.md",
          section: "Decision log",
          quote: "Owner và ngưỡng thành công được ghi cho hai thử nghiệm gần nhất.",
        },
        observedAt,
        freshnessDays: 8,
        dedupeKey: "decision-log-two-experiments",
      }),
    ],
    missingEvidence: [],
    contradictions: [],
    improvementActions: ["Hoàn tất review chu kỳ activation hiện tại."],
  },
  {
    id: "team_capability",
    label: "Năng lực đội ngũ",
    description:
      "Khả năng của đội ngũ để thực hiện, đo lường và học hỏi.",
    weight: 10,
    score: 70,
    delta: 0,
    confidence: "high",
    contributions: [
      contribution({
        id: "team-analytics-owner",
        criterionId: "team_capability",
        type: "positive",
        status: "verified",
        title: "Có owner cho product analytics",
        interpretation:
          "Một thành viên chịu trách nhiệm instrument và review funnel.",
        confidence: "high",
        contributionPoints: 10,
        source: {
          fileName: "AnalyticsSnapshot-May.json",
          section: "ownership",
          quote: "\"owner\": \"Product Analytics Lead\"",
        },
        observedAt,
        freshnessDays: 9,
        dedupeKey: "analytics-owner",
      }),
    ],
    missingEvidence: [],
    contradictions: [],
    improvementActions: ["Giữ một owner duy nhất cho pilot 14 ngày."],
  },
  {
    id: "communication_and_materials",
    label: "Truyền đạt và tài liệu",
    description:
      "Mức độ nhất quán, truy xuất được và phù hợp của tài liệu venture.",
    weight: 10,
    score: 76,
    delta: 2,
    confidence: "high",
    contributions: [
      contribution({
        id: "pitch-version-five",
        criterionId: "communication_and_materials",
        type: "positive",
        status: "verified",
        title: "Pitch deck canonical có cấu trúc rõ",
        interpretation:
          "Vấn đề, người dùng và giải pháp được trình bày nhất quán.",
        confidence: "high",
        contributionPoints: 10,
        source: {
          fileName: "PitchDeck-v5.pdf",
          page: 4,
          totalPages: 20,
          section: "Khách hàng mục tiêu",
        },
        observedAt,
        freshnessDays: 16,
        dedupeKey: "pitch-v5-canonical",
        canonical: true,
      }),
      contribution({
        id: "pricing-assumption",
        criterionId: "communication_and_materials",
        type: "informational",
        status: "assumed",
        title: "Pricing chưa được xác minh",
        interpretation:
          "Trang pricing là giả định nội bộ, không phải bằng chứng willingness to pay.",
        confidence: "low",
        contributionPoints: 0,
        source: {
          fileName: "PitchDeck-v5.pdf",
          page: 11,
          totalPages: 20,
          section: "Pricing",
          quote: "Gói Growth dự kiến 299 USD/tháng.",
        },
        observedAt,
        freshnessDays: 16,
        dedupeKey: "pitch-v5-p11-pricing-assumption",
      }),
      contribution({
        id: "outdated-positioning-note",
        criterionId: "communication_and_materials",
        type: "informational",
        status: "outdated",
        title: "Thông điệp định vị đã cũ",
        interpretation:
          "Ghi chú định vị 83 ngày trước không còn được dùng làm context chính.",
        confidence: "low",
        contributionPoints: 0,
        source: {
          fileName: "UserFeedback-Summary.md",
          section: "Legacy positioning",
          quote:
            "Tập trung vào mọi đội nhóm cần tự động hóa báo cáo.",
        },
        observedAt: "2026-05-05T09:00:00.000Z",
        freshnessDays: 83,
        dedupeKey: "legacy-positioning-83-days",
      }),
    ],
    missingEvidence: ["Pricing được xác minh bằng hành vi mua"],
    contradictions: [],
    improvementActions: ["Gắn nhãn giả định cho mọi tuyên bố chưa xác minh."],
  },
];

export const novaLabsReadinessAssessment: ExplainableReadinessAssessment =
  {
    ventureName: "Nova Labs",
    ventureStage: "Prototype",
    businessModel: "B2B SaaS",
    overallScore: calculateOverallReadiness(
      novaLabsReadinessCriteria,
    ),
    previousScore: 54,
    delta: 7,
    label: "Đang tiến triển",
    confidence: "medium",
    rubricVersion: "readiness-v2.0",
    updatedAt: observedAt,
    criteria: novaLabsReadinessCriteria,
    history: [
      {
        id: "readiness-54-61",
        type: "increase",
        previousScore: 54,
        nextScore: 61,
        delta: 7,
        reason:
          "Ba nguồn mới làm rõ vấn đề, funnel và năng lực thực thi.",
        occurredAt: observedAt,
        rubricVersion: "readiness-v2.0",
        evidenceIds: [
          "pitch-target-customer",
          "onboarding-completion",
          "decision-cycle-history",
        ],
      },
      {
        id: "rubric-v1-history",
        type: "rubric_version",
        previousScore: 54,
        nextScore: 54,
        delta: 0,
        reason:
          "Điểm cũ được tính bằng rubric v1.2; chỉ dùng để tham khảo xu hướng.",
        occurredAt: "2026-06-15T09:00:00.000Z",
        rubricVersion: "readiness-v1.2",
        evidenceIds: [],
      },
    ],
    canonicalNotice:
      "PitchDeck-v5.pdf là nguồn canonical; đóng góp từ phiên bản cũ đã được thay thế.",
  };

export const readinessSourceDocuments: ReadinessSourceDocument[] = [
  {
    id: "document-pitch-v5",
    fileName: "PitchDeck-v5.pdf",
    fileType: "pdf",
    totalPages: 20,
    updatedAt: "2026-07-11T09:00:00.000Z",
    availability: "available",
    pages: [
      {
        page: 4,
        title: "2. Khách hàng mục tiêu",
        body:
          "VenturePulse phục vụ đội vận hành B2B SaaS 20–100 nhân sự đang ghép báo cáo thủ công mỗi tuần.",
        highlight:
          "Đội vận hành B2B SaaS 20–100 nhân sự đang ghép báo cáo thủ công mỗi tuần.",
      },
      {
        page: 6,
        title: "3. Validation từ người dùng",
        body:
          "Chúng tôi đã phỏng vấn 20 người dùng thuộc nhóm khách hàng mục tiêu trong 2 tuần thử nghiệm.",
        highlight:
          "8/10 người được phỏng vấn cho rằng sản phẩm hữu ích.",
      },
      {
        page: 8,
        title: "4. Tín hiệu đầu phễu",
        body:
          "Chiến dịch ra mắt thu hút 1.243 lượt đăng ký trong 30 ngày.",
        highlight: "1.243 lượt đăng ký trong 30 ngày.",
      },
      {
        page: 11,
        title: "6. Pricing",
        body:
          "Gói Growth đang được đề xuất cho nhóm khách hàng chính.",
        highlight: "Gói Growth dự kiến 299 USD/tháng.",
      },
    ],
  },
  {
    id: "document-funnel-may",
    fileName: "FunnelReport-May.pdf",
    fileType: "pdf",
    totalPages: 12,
    updatedAt: "2026-07-03T09:00:00.000Z",
    availability: "available",
    pages: [
      {
        page: 3,
        title: "Onboarding",
        body: "76% người đăng ký hoàn tất các bước kết nối dữ liệu.",
        highlight: "Tỷ lệ hoàn tất onboarding: 76%.",
      },
      {
        page: 4,
        title: "Activation",
        body:
          "Activation được định nghĩa là tạo và chia sẻ báo cáo đầu tiên.",
        highlight: "Activation sau onboarding: 18%.",
      },
      {
        page: 5,
        title: "Retention",
        body:
          "Chỉ một nhóm nhỏ quay lại để tạo báo cáo thứ hai.",
        highlight: "Retention tuần 2: 7%.",
      },
    ],
  },
  {
    id: "document-interviews-03",
    fileName: "InterviewBatch-03.docx",
    fileType: "docx",
    totalPages: 14,
    updatedAt: "2026-07-07T09:00:00.000Z",
    availability: "available",
    pages: [
      {
        page: 6,
        title: "Onboarding",
        body:
          "Người tham gia số 03 hoàn tất kết nối nhưng không tạo báo cáo.",
        highlight:
          "Sau khi kết nối dữ liệu, tôi không rõ cần làm gì tiếp theo.",
      },
      {
        page: 9,
        title: "Sử dụng lặp lại",
        body:
          "Người tham gia số 07 đánh giá chi phí duy trì dữ liệu hàng tuần.",
        highlight:
          "Việc cập nhật dữ liệu hàng tuần vẫn quá tốn công.",
      },
    ],
  },
  {
    id: "document-customer-interviews",
    fileName: "CustomerInterviews.xlsx",
    fileType: "xlsx",
    totalPages: 6,
    updatedAt: "2026-07-08T09:00:00.000Z",
    availability: "unavailable",
    pages: [],
  },
  {
    id: "document-user-feedback",
    fileName: "UserFeedback-Summary.md",
    fileType: "md",
    totalPages: 4,
    updatedAt: "2026-07-10T09:00:00.000Z",
    availability: "available",
    pages: [],
  },
  {
    id: "document-analytics-may",
    fileName: "AnalyticsSnapshot-May.json",
    fileType: "json",
    totalPages: 1,
    updatedAt: "2026-07-19T09:00:00.000Z",
    availability: "available",
    pages: [],
  },
];
