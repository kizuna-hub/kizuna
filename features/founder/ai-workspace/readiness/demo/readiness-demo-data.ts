import { calculateOverallReadiness } from "../services/readiness-calculator";
import type {
  ExplainableReadinessAssessment,
  ReadinessConfidence,
  ReadinessContribution,
  ReadinessCriterion,
  ReadinessCriterionId,
  ReadinessSourceDocument,
} from "../types/readiness.types";

const observedAt = "2026-07-27T11:06:00.000Z";
const pitch = "CampusFlow-PitchDeck-v2.pdf";
const plan = "CampusFlow-BusinessPlan-v1.pdf";

function contribution({
  criterionId,
  id,
  title,
  interpretation,
  fileName,
  page,
  quote,
  confidence,
}: {
  criterionId: ReadinessCriterionId;
  id: string;
  title: string;
  interpretation: string;
  fileName: string;
  page: number;
  quote: string;
  confidence: ReadinessConfidence;
}): ReadinessContribution {
  return {
    id,
    criterionId,
    type: "positive",
    status: confidence === "high" ? "verified" : "inferred",
    title,
    interpretation,
    confidence,
    contributionPoints: confidence === "high" ? 12 : 9,
    source: {
      fileName,
      page,
      totalPages: fileName === pitch ? 14 : 18,
      quote,
    },
    observedAt,
    freshnessDays: 1,
    dedupeKey: id,
    canonical: true,
  };
}

function criterion({
  id,
  label,
  description,
  weight,
  score,
  delta,
  confidence,
  evidence,
  gaps,
  unlock,
}: {
  id: ReadinessCriterionId;
  label: string;
  description: string;
  weight: number;
  score: number;
  delta: number;
  confidence: ReadinessConfidence;
  evidence: Omit<
    Parameters<typeof contribution>[0],
    "criterionId" | "confidence"
  >;
  gaps: string[];
  unlock: string;
}): ReadinessCriterion {
  return {
    id,
    label,
    description,
    weight,
    score,
    delta,
    confidence,
    contributions: [
      contribution({
        ...evidence,
        criterionId: id,
        confidence,
      }),
    ],
    missingEvidence: gaps,
    contradictions: [],
    improvementActions: [unlock],
  };
}

export const novaLabsReadinessCriteria: ReadinessCriterion[] = [
  criterion({
    id: "problem_and_user_understanding",
    label: "Hiểu vấn đề và người dùng",
    description:
      "Độ rõ của vấn đề, hai nhóm người dùng và workflow onboarding hiện tại.",
    weight: 20,
    score: 78,
    delta: 4,
    confidence: "high",
    evidence: {
      id: "campusflow-problem-page-4",
      title: "Workflow onboarding hiện tại bị phân tán",
      interpretation:
        "Google Forms và nhóm chat tạo ra khoảng trống theo dõi rõ ràng.",
      fileName: pitch,
      page: 4,
      quote:
        "Các câu lạc bộ đang dùng Google Forms và nhóm chat để onboarding thành viên mới, khiến tiến độ khó theo dõi.",
    },
    gaps: [
      "Tách rõ nhu cầu của trưởng câu lạc bộ và thành viên mới.",
    ],
    unlock: "Chốt một primary user cho pilot đầu tiên.",
  }),
  criterion({
    id: "customer_discovery_and_evidence",
    label: "Customer discovery và bằng chứng",
    description:
      "Chất lượng phỏng vấn, quan sát workflow và bằng chứng từ người dùng.",
    weight: 20,
    score: 62,
    delta: 3,
    confidence: "medium",
    evidence: {
      id: "campusflow-discovery-page-6",
      title: "12 cuộc phỏng vấn cho vòng khám phá đầu tiên",
      interpretation:
        "8/12 xác nhận workflow phân tán; đây vẫn là interview evidence, chưa phải usage thật.",
      fileName: pitch,
      page: 6,
      quote:
        "8/12 người được phỏng vấn xác nhận quy trình onboarding hiện tại bị phân tán và thiếu người chịu trách nhiệm theo dõi.",
    },
    gaps: [
      "Evidence từ pilot thật.",
      "Repeat usage trong workflow thật.",
    ],
    unlock:
      "Quan sát một câu lạc bộ dùng CampusFlow trong 14 ngày.",
  }),
  criterion({
    id: "prototype_and_learning",
    label: "Prototype và học hỏi",
    description:
      "Khả năng hoàn thành core flow, quay lại và bài học phản ánh vào prototype.",
    weight: 20,
    score: 58,
    delta: 5,
    confidence: "medium",
    evidence: {
      id: "campusflow-prototype-page-8",
      title: "Core flow đã được dùng thử",
      interpretation:
        "4/5 hoàn thành và 3/5 quay lại là tín hiệu tích cực, nhưng chưa diễn ra trong workflow thật.",
      fileName: pitch,
      page: 8,
      quote:
        "5 người dùng thử prototype, 4 người hoàn thành core flow và 3 người quay lại cho lần test thứ hai.",
    },
    gaps: [
      "Điểm vướng cụ thể và thay đổi được tạo ra sau mỗi test.",
    ],
    unlock:
      "Đo ít nhất 3/5 thành viên quay lại core flow trong pilot.",
  }),
  criterion({
    id: "market_signal_and_commitment",
    label: "Tín hiệu thị trường và commitment",
    description:
      "Mức độ chuyển từ quan tâm sang cam kết thử nghiệm có phạm vi.",
    weight: 10,
    score: 45,
    delta: 2,
    confidence: "medium",
    evidence: {
      id: "campusflow-pilot-page-11",
      title: "Hai câu lạc bộ quan tâm tới pilot",
      interpretation:
        "Đây mới là pilot interest, chưa phải pilot có lịch và phạm vi xác nhận.",
      fileName: plan,
      page: 11,
      quote:
        "2 câu lạc bộ đồng ý trao đổi về pilot trong học kỳ tới.",
    },
    gaps: [
      "Chưa có usage trong workflow thật.",
      "Chưa có pilot có lịch, phạm vi và owner xác nhận.",
    ],
    unlock: "Chạy pilot 14 ngày với 1 câu lạc bộ.",
  }),
  criterion({
    id: "experiment_and_execution_discipline",
    label: "Kỷ luật thử nghiệm và thực thi",
    description:
      "Khả năng đặt giả định, chạy vòng học hỏi và thay đổi theo evidence.",
    weight: 15,
    score: 72,
    delta: 6,
    confidence: "high",
    evidence: {
      id: "campusflow-execution-page-8",
      title: "Hai decision cycle đã hoàn thành",
      interpretation:
        "Một giả định bị bác bỏ và prototype đã được sửa sau feedback.",
      fileName: pitch,
      page: 8,
      quote:
        "Nhóm đã hoàn thành 2 vòng thử nghiệm và cập nhật prototype sau phản hồi.",
    },
    gaps: ["Success metric cho pilot chưa được khóa."],
    unlock: "Gắn owner và success metric cho pilot 14 ngày.",
  }),
  criterion({
    id: "team_capability_and_resource_access",
    label: "Năng lực đội ngũ và nguồn lực",
    description:
      "Năng lực thực thi của ba student founders và quyền tiếp cận câu lạc bộ.",
    weight: 10,
    score: 65,
    delta: 3,
    confidence: "medium",
    evidence: {
      id: "campusflow-team-page-3",
      title: "Team có quyền tiếp cận câu lạc bộ",
      interpretation:
        "Team đã tuyển được interviewee, tester và mở trao đổi pilot với hai câu lạc bộ.",
      fileName: plan,
      page: 11,
      quote:
        "2 câu lạc bộ đồng ý trao đổi về pilot trong học kỳ tới.",
    },
    gaps: ["Owner vận hành pilot chưa được xác nhận."],
    unlock: "Chỉ định một founder làm pilot owner.",
  }),
  criterion({
    id: "communication_and_materials",
    label: "Trình bày và material",
    description:
      "Khả năng truyền đạt vấn đề, evidence, learning và đề xuất pilot.",
    weight: 5,
    score: 74,
    delta: 4,
    confidence: "high",
    evidence: {
      id: "campusflow-material-page-4",
      title: "Problem statement dễ hiểu",
      interpretation:
        "Deck mô tả rõ workflow phân tán nhưng chưa liên kết đủ claim với bài học sau test.",
      fileName: pitch,
      page: 4,
      quote:
        "Các câu lạc bộ đang dùng Google Forms và nhóm chat để onboarding thành viên mới, khiến tiến độ khó theo dõi.",
    },
    gaps: [
      "Prototype slide chưa thể hiện rõ team đã học và thay đổi gì.",
    ],
    unlock: "Bổ sung learning và pilot scope vào deck.",
  }),
];

export const novaLabsReadinessAssessment: ExplainableReadinessAssessment =
  {
    ventureName: "CampusFlow",
    ventureStage: "Prototype",
    businessModel: "Student venture · Community product",
    overallScore: calculateOverallReadiness(
      novaLabsReadinessCriteria,
    ),
    previousScore: 61,
    delta: 4,
    label: "Đang tiến triển",
    confidence: "medium",
    rubricVersion: "student-prototype-v1",
    updatedAt: observedAt,
    criteria: novaLabsReadinessCriteria,
    projection: {
      label: "Dự kiến · Chưa cập nhật điểm hiện tại",
      overallRange: [68, 71],
      criterionId: "market_signal_and_commitment",
      criterionRange: [52, 57],
      assumptions: [
        "Một câu lạc bộ xác nhận phạm vi pilot 14 ngày.",
        "Ít nhất 3/5 thành viên quay lại dùng core flow.",
      ],
    },
    history: [
      {
        id: "campusflow-readiness-65",
        type: "increase",
        previousScore: 61,
        nextScore: 65,
        delta: 4,
        reason:
          "Prototype test và hai vòng học hỏi đã được xác minh.",
        occurredAt: observedAt,
        rubricVersion: "student-prototype-v1",
        evidenceIds: [
          "campusflow-prototype-page-8",
          "campusflow-execution-page-8",
        ],
      },
    ],
    canonicalNotice:
      "Ở Prototype stage, Kizuna không yêu cầu doanh thu. Điểm phản ánh mức độ sẵn sàng cho bước kiểm chứng tiếp theo, không đánh giá startup tốt hay kém.",
  };

export const readinessSourceDocuments: ReadinessSourceDocument[] = [
  {
    id: "campusflow-pitch-deck-v2",
    fileName: pitch,
    fileType: "pdf",
    totalPages: 14,
    updatedAt: observedAt,
    availability: "available",
    pages: [
      {
        page: 4,
        title: "Vấn đề hiện tại",
        body: "Workflow onboarding thành viên mới đang bị phân tán giữa nhiều công cụ.",
        highlight:
          "Các câu lạc bộ đang dùng Google Forms và nhóm chat để onboarding thành viên mới, khiến tiến độ khó theo dõi.",
      },
      {
        page: 6,
        title: "Customer discovery",
        body: "12 cuộc phỏng vấn gồm 6 trưởng câu lạc bộ và 6 thành viên mới.",
        highlight:
          "8/12 người được phỏng vấn xác nhận quy trình onboarding hiện tại bị phân tán và thiếu người chịu trách nhiệm theo dõi.",
      },
      {
        page: 8,
        title: "Prototype validation",
        body: "Kết quả của vòng test prototype đầu tiên.",
        highlight:
          "5 người dùng thử prototype, 4 người hoàn thành core flow và 3 người quay lại cho lần test thứ hai.",
      },
    ],
  },
  {
    id: "campusflow-business-plan-v1",
    fileName: plan,
    fileType: "pdf",
    totalPages: 18,
    updatedAt: observedAt,
    availability: "available",
    pages: [
      {
        page: 11,
        title: "Pilot plan",
        body: "Hai câu lạc bộ quan tâm tới việc thử CampusFlow trong học kỳ tới.",
        highlight:
          "2 câu lạc bộ đồng ý trao đổi về pilot trong học kỳ tới.",
      },
    ],
  },
];
