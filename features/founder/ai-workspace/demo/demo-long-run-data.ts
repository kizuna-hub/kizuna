import type { AiWorkspaceMessage } from "../types/ai-workspace.types";
import type {
  ContextConflict,
  ConversationSession,
  LongRunWorkspaceState,
  MaterialVersion,
  PinnedItemReference,
  ReadinessChange,
  SessionSummary,
  TimelineEvent,
  VentureMemoryItem,
} from "../types/long-run-workspace.types";
import { ensureCampusFlowMentorConversationHistory } from "../conversation-history/data/mentor-conversation-session-seed";

const NOW = "2026-07-27T09:45:00.000Z";

function message(
  id: string,
  role: AiWorkspaceMessage["role"],
  content: string,
  createdAt: string,
): AiWorkspaceMessage {
  return {
    id,
    role,
    content,
    createdAt,
    status: "complete",
    responseKind:
      role === "assistant" ? "conversation" : undefined,
    responseLifecycle:
      role === "assistant" ? "completed" : undefined,
  };
}

function createLongConversationMessages() {
  const turns = [
    [
      "founder",
      "Activation tuần này giảm còn 31%. Tôi nên tập trung vào đâu?",
    ],
    [
      "assistant",
      "Điểm nghẽn nằm sau onboarding: người dùng hoàn tất thiết lập nhưng chưa chạm tới khoảnh khắc giá trị đầu tiên.",
    ],
    [
      "founder",
      "Top-of-funnel vẫn tăng. Có nên tiếp tục acquisition không?",
    ],
    [
      "assistant",
      "Chưa nên mở rộng acquisition. Thêm traffic lúc này sẽ khuếch đại phần thất thoát sau onboarding.",
    ],
    [
      "founder",
      "Dữ liệu nào đang hỗ trợ kết luận đó?",
    ],
    [
      "assistant",
      "Funnel 30 ngày, cohort ngày thứ ba và ba cuộc phỏng vấn đều chỉ về cùng một đoạn rơi.",
    ],
    [
      "founder",
      "Tôi muốn thử onboarding ngắn hơn.",
    ],
    [
      "assistant",
      "Có thể kiểm tra phiên bản ba bước với 20% người dùng mới trong 14 ngày.",
    ],
    [
      "founder",
      "Mục tiêu activation nên đặt bao nhiêu?",
    ],
    [
      "assistant",
      "Dùng mức tăng tương đối 15% làm ngưỡng học hỏi, chưa dùng làm cam kết rollout.",
    ],
    [
      "founder",
      "Đã có hai người dùng nói phần thiết lập quá dài.",
    ],
    [
      "assistant",
      "Đó là bằng chứng định tính hữu ích nhưng chưa đủ để xác minh toàn bộ nguyên nhân.",
    ],
    [
      "founder",
      "Tôi vừa thêm phản hồi thứ ba.",
    ],
    [
      "assistant",
      "Ba phản hồi hiện thống nhất về độ dài onboarding. Mình có thể ghi nhận nó như tín hiệu đã xác minh.",
    ],
    [
      "founder",
      "Cohort thử nghiệm tăng 11%, thấp hơn mục tiêu.",
    ],
    [
      "assistant",
      "Kết quả chưa đạt ngưỡng 15%, nhưng đủ xác nhận onboarding là một phần của điểm nghẽn.",
    ],
    [
      "founder",
      "Readiness thay đổi thế nào?",
    ],
    [
      "assistant",
      "Readiness tăng từ 54 lên 61 nhờ có tín hiệu hành vi và phản hồi trực tiếp, không phải chỉ vì thêm tài liệu.",
    ],
    [
      "founder",
      "Tôi nên chạy thêm cohort hay rollout?",
    ],
    [
      "assistant",
      "Chạy thêm một cohort để kiểm tra tính lặp lại trước khi rollout rộng.",
    ],
    [
      "founder",
      "Chúng ta có cần mentor ngay không?",
    ],
    [
      "assistant",
      "Sau khi review cohort thứ hai, một cố vấn product growth có thể giúp chốt ngưỡng dừng và trade-off rollout.",
    ],
    [
      "founder",
      "Hãy giữ acquisition là ưu tiên sau khi activation ổn định.",
    ],
    [
      "assistant",
      "Đã ghi nhận như hướng tiếp theo, chưa thay thế quyết định hiện tại là ưu tiên activation.",
    ],
    [
      "founder",
      "Tóm tắt phiên làm việc này giúp tôi.",
    ],
    [
      "assistant",
      "Mình đã chuẩn bị checkpoint gồm quyết định, giả định, hành động, bằng chứng còn thiếu và đề xuất cập nhật Venture Memory.",
    ],
  ] as const;

  return turns.map(([role, content], index) =>
    message(
      `long-message-${index + 1}`,
      role,
      content,
      new Date(
        new Date("2026-07-27T02:20:00.000Z").getTime() +
          index * 120_000,
      ).toISOString(),
    ),
  );
}

function createSessions(ventureId: string): ConversationSession[] {
  return [
    {
      id: "conversation-activation",
      ventureId,
      title: "Cuộc trò chuyện mới",
      category: "general",
      createdAt: "2026-07-27T02:20:00.000Z",
      updatedAt: NOW,
      isPinned: false,
      isArchived: false,
      summaryStatus: "draft",
    },
    {
      id: "conversation-pricing",
      ventureId,
      title: "Tôi nên làm gì tiếp theo?",
      category: "decision_cycle",
      relatedDecisionCycleId: "cycle-pricing",
      createdAt: "2026-07-21T03:00:00.000Z",
      updatedAt: "2026-07-21T04:12:00.000Z",
      isPinned: false,
      isArchived: false,
      summaryStatus: "confirmed",
    },
    {
      id: "conversation-pitch",
      ventureId,
      title: "Phân tích pitch deck",
      category: "material_analysis",
      relatedMaterialIds: ["material-pitch-v5"],
      createdAt: "2026-07-16T02:00:00.000Z",
      updatedAt: "2026-07-16T03:05:00.000Z",
      isPinned: false,
      isArchived: false,
      summaryStatus: "none",
    },
    {
      id: "conversation-mentor",
      ventureId,
      title: "Tìm mentor phù hợp",
      category: "mentor_preparation",
      createdAt: "2026-06-28T02:00:00.000Z",
      updatedAt: "2026-06-28T03:00:00.000Z",
      isPinned: true,
      isArchived: false,
      summaryStatus: "memory_updated",
    },
    {
      id: "conversation-opportunity",
      ventureId,
      title: "Đánh giá tín hiệu thị trường",
      category: "opportunity_review",
      createdAt: "2026-05-10T02:00:00.000Z",
      updatedAt: "2026-05-10T03:00:00.000Z",
      isPinned: false,
      isArchived: false,
      summaryStatus: "confirmed",
    },
  ];
}

function createMemory(ventureId: string): VentureMemoryItem[] {
  return [
    {
      id: "memory-activation-priority",
      ventureId,
      type: "decision",
      status: "verified",
      title: "Ưu tiên activation trước acquisition",
      summary:
        "Giữ acquisition ổn định cho tới khi cohort onboarding mới cho tín hiệu lặp lại.",
      sourceIds: ["conversation-activation", "cycle-onboarding-activation"],
      createdAt: "2026-07-27T03:10:00.000Z",
      updatedAt: "2026-07-27T03:10:00.000Z",
      relatedDecisionCycleId: "cycle-onboarding-activation",
      createdBy: "founder",
      history: [
        {
          id: "history-activation-priority",
          status: "verified",
          value: "Ưu tiên activation trước acquisition",
          actor: "Trần Minh",
          createdAt: "2026-07-27T03:10:00.000Z",
          reason: "Founder xác nhận sau review cohort đầu tiên.",
        },
      ],
    },
    {
      id: "memory-target-student",
      ventureId,
      type: "assumption",
      status: "disputed",
      title: "Khách hàng mục tiêu là sinh viên sáng lập",
      summary:
        "Pitch Deck v3 mô tả sinh viên đại học 18–24 tuổi là phân khúc chính.",
      sourceIds: ["material-pitch-v3"],
      createdAt: "2026-04-20T02:00:00.000Z",
      updatedAt: "2026-07-26T02:00:00.000Z",
      observedAt: "2026-04-20T02:00:00.000Z",
      createdBy: "founder",
      history: [
        {
          id: "history-target-student",
          status: "assumed",
          value: "Sinh viên sáng lập",
          actor: "Trần Minh",
          createdAt: "2026-04-20T02:00:00.000Z",
          reason: "Được nêu trong Pitch Deck v3.",
        },
      ],
    },
    {
      id: "memory-target-incubator",
      ventureId,
      type: "assumption",
      status: "inferred",
      title: "Chương trình ươm tạo là hướng mở rộng",
      summary:
        "Pitch Deck v5 đề xuất university incubation programs như buyer mới.",
      sourceIds: ["material-pitch-v5"],
      createdAt: "2026-05-22T02:00:00.000Z",
      updatedAt: "2026-05-22T02:00:00.000Z",
      observedAt: "2026-05-22T02:00:00.000Z",
      createdBy: "ai",
      history: [
        {
          id: "history-target-incubator",
          status: "inferred",
          value: "Chương trình ươm tạo đại học",
          actor: "Kizuna",
          createdAt: "2026-05-22T02:00:00.000Z",
          reason: "AI suy luận từ Pitch Deck v5.",
        },
      ],
    },
    {
      id: "memory-founder-priority",
      ventureId,
      type: "fact",
      status: "verified",
      title: "Founder cá nhân vẫn là ưu tiên hiện tại",
      summary:
        "Founder xác nhận tập trung vào founder cá nhân; trường đại học là hướng tương lai.",
      sourceIds: ["long-message-23"],
      createdAt: "2026-07-27T03:04:00.000Z",
      updatedAt: "2026-07-27T03:04:00.000Z",
      createdBy: "founder",
      history: [
        {
          id: "history-founder-priority",
          status: "verified",
          value: "Founder cá nhân",
          actor: "Trần Minh",
          createdAt: "2026-07-27T03:04:00.000Z",
          reason: "Founder xác nhận trực tiếp trong hội thoại.",
        },
      ],
    },
    {
      id: "memory-mrr",
      ventureId,
      type: "fact",
      status: "outdated",
      title: "MRR là 12,8 nghìn USD",
      summary:
        "Số liệu được cập nhật 83 ngày trước và không nên dùng cho khuyến nghị hiện tại.",
      sourceIds: ["report-traction-april"],
      createdAt: "2026-05-05T02:00:00.000Z",
      updatedAt: "2026-05-05T02:00:00.000Z",
      observedAt: "2026-05-05T02:00:00.000Z",
      validUntil: "2026-06-05T02:00:00.000Z",
      createdBy: "founder",
      history: [
        {
          id: "history-mrr",
          status: "outdated",
          value: "12,8 nghìn USD",
          actor: "Hệ thống",
          createdAt: "2026-07-27T02:00:00.000Z",
          reason: "Dữ liệu đã quá cửa sổ freshness 60 ngày.",
        },
      ],
    },
    {
      id: "memory-team-size",
      ventureId,
      type: "fact",
      status: "outdated",
      title: "Đội ngũ có 5 thành viên",
      summary: "Số liệu nhân sự chưa được xác nhận lại trong 74 ngày.",
      sourceIds: ["material-pitch-v3"],
      createdAt: "2026-05-14T02:00:00.000Z",
      updatedAt: "2026-05-14T02:00:00.000Z",
      createdBy: "founder",
      history: [],
    },
    {
      id: "memory-pricing-model",
      ventureId,
      type: "assumption",
      status: "outdated",
      title: "Gói giá cố định 49 USD/tháng",
      summary:
        "Mô hình giá cũ chưa phản ánh thử nghiệm willingness to pay mới nhất.",
      sourceIds: ["material-pitch-v3", "cycle-pricing"],
      createdAt: "2026-04-20T02:00:00.000Z",
      updatedAt: "2026-06-01T02:00:00.000Z",
      relatedDecisionCycleId: "cycle-pricing",
      createdBy: "founder",
      history: [],
    },
    {
      id: "memory-pricing-evidence",
      ventureId,
      type: "evidence",
      status: "verified",
      title: "5/8 người dùng chấp nhận mức giá 59 USD",
      summary:
        "Phỏng vấn willingness to pay cho thấy tín hiệu tích cực ở phân khúc founder có doanh thu.",
      sourceIds: ["evidence-pricing-interviews"],
      createdAt: "2026-07-21T03:45:00.000Z",
      updatedAt: "2026-07-21T03:45:00.000Z",
      relatedDecisionCycleId: "cycle-pricing",
      createdBy: "founder",
      history: [],
    },
    {
      id: "memory-pricing-decision",
      ventureId,
      type: "decision",
      status: "verified",
      title: "Thử gói pricing 59 USD với founder có doanh thu",
      summary:
        "Giữ gói 49 USD làm control và kiểm tra willingness to pay cho gói 59 USD trong hai tuần.",
      sourceIds: ["cycle-pricing", "evidence-pricing-interviews"],
      createdAt: "2026-07-21T04:00:00.000Z",
      updatedAt: "2026-07-21T04:00:00.000Z",
      relatedDecisionCycleId: "cycle-pricing",
      createdBy: "founder",
      history: [],
    },
    {
      id: "memory-pricing-mentor-advice",
      ventureId,
      type: "mentor_advice",
      status: "verified",
      title: "Định giá theo willingness to pay, không theo chi phí",
      summary:
        "Mentor đề nghị hỏi về trade-off và ngân sách trước khi trình bày mức giá.",
      sourceIds: ["mentor-session-pricing"],
      createdAt: "2026-07-19T03:00:00.000Z",
      updatedAt: "2026-07-19T03:00:00.000Z",
      createdBy: "mentor",
      history: [],
    },
    {
      id: "memory-mentor-advice",
      ventureId,
      type: "mentor_advice",
      status: "verified",
      title: "Đo activation trước khi tăng ngân sách acquisition",
      summary:
        "Mentor đề nghị dùng cohort ngày thứ bảy và giới hạn rollout ở 20%.",
      sourceIds: ["mentor-session-growth"],
      createdAt: "2026-06-28T03:00:00.000Z",
      updatedAt: "2026-06-28T03:00:00.000Z",
      createdBy: "mentor",
      history: [],
    },
    {
      id: "memory-opportunity",
      ventureId,
      type: "opportunity",
      status: "outdated",
      title: "Chương trình LaunchPad 2026",
      summary: "Cơ hội đã hết hạn vào ngày 30/06/2026.",
      sourceIds: ["opportunity-launchpad"],
      createdAt: "2026-05-10T02:00:00.000Z",
      updatedAt: "2026-06-30T16:00:00.000Z",
      createdBy: "system",
      history: [],
    },
  ];
}

function createReadinessHistory(
  ventureId: string,
): ReadinessChange[] {
  return [
    {
      id: "readiness-47-54",
      ventureId,
      previousScore: 47,
      nextScore: 54,
      dimensionChanges: [
        {
          id: "problem-clarity",
          label: "Độ rõ của vấn đề",
          previousScore: 52,
          nextScore: 68,
          reason: "Funnel ban đầu đã được xác nhận.",
        },
      ],
      evidenceAddedIds: ["evidence-initial-funnel"],
      evidenceRemovedIds: [],
      reason: "Làm rõ đoạn rơi đầu tiên trong onboarding.",
      rubricVersion: "readiness-v1.1",
      createdAt: "2026-06-20T04:00:00.000Z",
    },
    {
      id: "readiness-54-61",
      ventureId,
      previousScore: 54,
      nextScore: 61,
      dimensionChanges: [
        {
          id: "customer-evidence",
          label: "Bằng chứng khách hàng",
          previousScore: 38,
          nextScore: 52,
          reason: "Ba phản hồi trực tiếp và cohort activation mới.",
        },
      ],
      evidenceAddedIds: [
        "evidence-activation-cohort",
        "evidence-user-feedback",
      ],
      evidenceRemovedIds: [],
      reason:
        "Activation tăng 11% và ba phản hồi người dùng xác nhận điểm nghẽn onboarding.",
      rubricVersion: "readiness-v1.2",
      createdAt: "2026-07-18T04:00:00.000Z",
    },
    {
      id: "readiness-61-68",
      ventureId,
      previousScore: 61,
      nextScore: 68,
      dimensionChanges: [
        {
          id: "repeat-usage",
          label: "Sử dụng lặp lại",
          previousScore: 30,
          nextScore: 44,
          reason: "Có dữ liệu retention ngày thứ bảy.",
        },
      ],
      evidenceAddedIds: ["evidence-day-seven-retention"],
      evidenceRemovedIds: [],
      reason:
        "Cohort thứ hai cho thấy activation và retention có thể lặp lại.",
      rubricVersion: "readiness-v1.2",
      createdAt: "2026-07-25T04:00:00.000Z",
    },
    {
      id: "readiness-68-68",
      ventureId,
      previousScore: 68,
      nextScore: 68,
      dimensionChanges: [],
      evidenceAddedIds: ["evidence-mentor-notes"],
      evidenceRemovedIds: [],
      reason:
        "Ghi chú mentor bổ sung cách đọc dữ liệu nhưng chưa tạo bằng chứng venture mới.",
      rubricVersion: "readiness-v1.2",
      createdAt: "2026-07-26T04:00:00.000Z",
    },
  ];
}

function createTimeline(ventureId: string): TimelineEvent[] {
  return [
    {
      id: "timeline-readiness-no-change",
      ventureId,
      type: "readiness_changed",
      title: "Readiness giữ nguyên ở mức 68",
      createdAt: "2026-07-26T04:00:00.000Z",
      actor: "Kizuna",
      reason:
        "Ghi chú mentor bổ sung judgment nhưng không thay thế bằng chứng khách hàng.",
      sourceIds: ["evidence-mentor-notes"],
      readinessChangeId: "readiness-68-68",
    },
    {
      id: "timeline-context",
      ventureId,
      type: "context_confirmed",
      title: "Xác nhận founder cá nhân là ưu tiên hiện tại",
      createdAt: "2026-07-27T03:04:00.000Z",
      actor: "Trần Minh",
      reason:
        "Chương trình ươm tạo được giữ như hướng tương lai, không thay thế phân khúc hiện tại.",
      sourceIds: ["long-message-23"],
    },
    {
      id: "timeline-readiness-68",
      ventureId,
      type: "readiness_changed",
      title: "Mức độ sẵn sàng tăng từ 61 lên 68",
      createdAt: "2026-07-25T04:00:00.000Z",
      actor: "Kizuna",
      reason:
        "Retention ngày thứ bảy và cohort thứ hai đã được xác minh.",
      sourceIds: ["evidence-day-seven-retention"],
      relatedDecisionCycleId: "cycle-onboarding-activation",
      readinessChangeId: "readiness-61-68",
    },
    {
      id: "timeline-decision",
      ventureId,
      type: "decision_confirmed",
      title: "Ưu tiên activation trước acquisition",
      createdAt: "2026-07-18T03:40:00.000Z",
      actor: "Trần Minh",
      reason:
        "Funnel và phản hồi người dùng cùng xác nhận đoạn rơi sau onboarding.",
      sourceIds: ["cycle-onboarding-activation"],
      relatedDecisionCycleId: "cycle-onboarding-activation",
    },
    {
      id: "timeline-readiness-61",
      ventureId,
      type: "readiness_changed",
      title: "Mức độ sẵn sàng tăng từ 54 lên 61",
      createdAt: "2026-07-18T04:00:00.000Z",
      actor: "Kizuna",
      reason:
        "Có tín hiệu hành vi và ba phản hồi trực tiếp từ người dùng.",
      sourceIds: [
        "evidence-activation-cohort",
        "evidence-user-feedback",
      ],
      relatedDecisionCycleId: "cycle-onboarding-activation",
      readinessChangeId: "readiness-54-61",
    },
    {
      id: "timeline-mentor",
      ventureId,
      type: "mentor_session_completed",
      title: "Hoàn tất phiên mentor product growth",
      createdAt: "2026-06-28T03:00:00.000Z",
      actor: "Jessica Lin",
      reason:
        "Chốt cách đọc cohort và giới hạn rollout ở 20% người dùng mới.",
      sourceIds: ["mentor-session-growth"],
    },
    {
      id: "timeline-readiness-v11",
      ventureId,
      type: "readiness_changed",
      title: "Mức độ sẵn sàng tăng từ 47 lên 54",
      createdAt: "2026-06-20T04:00:00.000Z",
      actor: "Kizuna",
      reason:
        "Funnel ban đầu đã làm rõ đoạn rơi trong onboarding.",
      sourceIds: ["evidence-initial-funnel"],
      readinessChangeId: "readiness-47-54",
    },
  ];
}

function createMaterials(ventureId: string): MaterialVersion[] {
  return [
    {
      id: "material-pitch-v3",
      ventureId,
      familyId: "pitch-deck",
      name: "PitchDeck-v3.pdf",
      versionLabel: "v3",
      createdAt: "2026-04-20T02:00:00.000Z",
      status: "superseded",
      summary:
        "Định vị founder sinh viên và mô hình giá cố định 49 USD.",
      comparisonNotes: [
        "Phân khúc chính: sinh viên sáng lập.",
        "Pricing: gói cố định 49 USD/tháng.",
      ],
      dependencies: {
        memoryItems: 3,
        readinessDimensions: 1,
        activeDecisionCycles: 0,
      },
    },
    {
      id: "material-pitch-v5",
      ventureId,
      familyId: "pitch-deck",
      name: "PitchDeck-v5.pdf",
      versionLabel: "v5",
      createdAt: "2026-05-22T02:00:00.000Z",
      status: "canonical",
      summary:
        "Mở rộng buyer sang chương trình ươm tạo và bổ sung traction.",
      comparisonNotes: [
        "Bổ sung chương trình ươm tạo như buyer tiềm năng.",
        "Thêm cohort activation nhưng chưa có WTP.",
      ],
      dependencies: {
        memoryItems: 4,
        readinessDimensions: 2,
        activeDecisionCycles: 1,
      },
    },
    {
      id: "material-business-model",
      ventureId,
      familyId: "business-model",
      name: "MoHinhKinhDoanh.docx",
      versionLabel: "Hiện tại",
      createdAt: "2026-07-02T02:00:00.000Z",
      status: "current",
      summary: "Mô hình doanh thu và giả định unit economics.",
      comparisonNotes: ["Không có phiên bản trước để so sánh."],
      dependencies: {
        memoryItems: 2,
        readinessDimensions: 1,
        activeDecisionCycles: 0,
      },
    },
    {
      id: "material-customer-research",
      ventureId,
      familyId: "customer-research",
      name: "NghienCuuKhachHang.pptx",
      versionLabel: "Tháng 7",
      createdAt: "2026-07-20T02:00:00.000Z",
      status: "current",
      summary: "Tám phỏng vấn willingness to pay và onboarding.",
      comparisonNotes: ["Bổ sung năm cuộc phỏng vấn mới."],
      dependencies: {
        memoryItems: 3,
        readinessDimensions: 2,
        activeDecisionCycles: 1,
      },
    },
  ];
}

function createSummary(ventureId: string): SessionSummary {
  return {
    id: "summary-activation-27-07",
    ventureId,
    conversationId: "conversation-activation",
    status: "draft",
    createdAt: NOW,
    updatedAt: NOW,
    proposedMemoryItemIds: [
      "memory-activation-priority",
      "memory-founder-priority",
    ],
    sections: [
      {
        id: "decisions",
        label: "Quyết định đã chốt",
        items: ["Ưu tiên activation trước khi mở rộng acquisition."],
      },
      {
        id: "assumptions",
        label: "Giả định đang kiểm chứng",
        items: [
          "Onboarding ngắn hơn giúp người dùng chạm giá trị sớm hơn.",
        ],
      },
      {
        id: "actions",
        label: "Hành động tiếp theo",
        items: ["Chạy cohort onboarding B thêm 14 ngày."],
      },
      {
        id: "evidence",
        label: "Bằng chứng cần thu thập",
        items: [
          "Activation ngày thứ bảy.",
          "Retention sau 24 giờ và bảy ngày.",
        ],
      },
      {
        id: "disagreements",
        label: "Điểm chưa thống nhất",
        items: [
          "Ngưỡng 11% đã đủ rollout hay cần đạt mục tiêu 15%.",
        ],
      },
      {
        id: "memory",
        label: "Đề xuất cập nhật Venture Memory",
        items: [
          "Activation là ưu tiên hiện tại; acquisition là bước sau.",
        ],
      },
    ],
  };
}

function createConflict(ventureId: string): ContextConflict {
  return {
    id: "conflict-target-customer",
    ventureId,
    title: "Khách hàng mục tiêu đang có ba cách diễn giải",
    description:
      "Nguồn mới hơn không tự động thay thế xác nhận trực tiếp của founder.",
    status: "open",
    values: [
      {
        id: "value-students",
        value: "Sinh viên đại học 18–24 tuổi",
        sourceId: "material-pitch-v3",
        sourceLabel: "PitchDeck-v3.pdf",
        observedAt: "2026-04-20T02:00:00.000Z",
        status: "disputed",
        freshness: "older",
      },
      {
        id: "value-incubators",
        value: "Chương trình ươm tạo đại học",
        sourceId: "material-pitch-v5",
        sourceLabel: "PitchDeck-v5.pdf",
        observedAt: "2026-05-22T02:00:00.000Z",
        status: "inferred",
        freshness: "current",
      },
      {
        id: "value-founders",
        value: "Founder cá nhân có sản phẩm sớm",
        sourceId: "long-message-23",
        sourceLabel: "Tin nhắn mới nhất của founder",
        observedAt: "2026-07-27T03:04:00.000Z",
        status: "verified",
        freshness: "current",
      },
    ],
  };
}

function createPinnedItems(
  ventureId: string,
): PinnedItemReference[] {
  return [
    {
      id: "pin-pricing-evidence",
      ventureId,
      itemType: "evidence",
      sourceId: "memory-pricing-evidence",
      title: "5/8 người dùng chấp nhận mức giá 59 USD",
      sourceLabel: "Bằng chứng phỏng vấn WTP",
      createdAt: "2026-07-21T03:45:00.000Z",
    },
    {
      id: "pin-mentor-advice",
      ventureId,
      itemType: "mentor_advice",
      sourceId: "memory-mentor-advice",
      title: "Đo activation trước acquisition",
      sourceLabel: "Phiên mentor growth",
      createdAt: "2026-06-28T03:00:00.000Z",
    },
  ];
}

export function createLongRunDemoState(
  ventureId: string,
): LongRunWorkspaceState {
  const sessions = createSessions(ventureId);
  const activationMessages = createLongConversationMessages();
  return ensureCampusFlowMentorConversationHistory({
    ventureId,
    stateVersion: 1,
    sessions,
    activeConversationId: sessions[0].id,
    lastConversationId: sessions[0].id,
    messagesByConversation: {
      "conversation-activation": activationMessages,
      "conversation-pricing": [
        message(
          "pricing-founder",
          "founder",
          "Tìm lại quyết định pricing và bằng chứng willingness to pay.",
          "2026-07-21T03:00:00.000Z",
        ),
        message(
          "pricing-assistant",
          "assistant",
          "Quyết định gần nhất là kiểm tra gói 59 USD với founder đã có doanh thu. 5/8 cuộc phỏng vấn cho tín hiệu sẵn sàng chi trả.",
          "2026-07-21T03:02:00.000Z",
        ),
      ],
      "conversation-pitch": [
        message(
          "pitch-assistant",
          "assistant",
          "Pitch Deck v5 thay đổi buyer sang chương trình ươm tạo, nhưng founder chưa xác nhận đây là phân khúc hiện tại.",
          "2026-07-16T03:05:00.000Z",
        ),
      ],
      "conversation-mentor": [
        message(
          "mentor-assistant",
          "assistant",
          "Jessica đề nghị đo activation và retention trước khi tăng acquisition.",
          "2026-06-28T03:00:00.000Z",
        ),
      ],
      "conversation-opportunity": [
        message(
          "opportunity-assistant",
          "assistant",
          "LaunchPad phù hợp về stage nhưng cơ hội đã hết hạn.",
          "2026-05-10T03:00:00.000Z",
        ),
      ],
    },
    draftsByConversation: {
      "conversation-activation": "",
      "conversation-pricing": "So sánh gói 49 USD và 59 USD",
    },
    attachmentsByConversation: {},
    visibleMessageCountByConversation: {
      "conversation-activation": 12,
      "conversation-pricing": 20,
      "conversation-pitch": 20,
      "conversation-mentor": 20,
      "conversation-opportunity": 20,
    },
    scrollTopByConversation: {},
    memory: createMemory(ventureId),
    timeline: createTimeline(ventureId),
    readinessHistory: createReadinessHistory(ventureId),
    pinnedItems: createPinnedItems(ventureId),
    materialVersions: createMaterials(ventureId),
    summaries: [createSummary(ventureId)],
    conflicts: [createConflict(ventureId)],
    conversationSources: [],
  });
}
