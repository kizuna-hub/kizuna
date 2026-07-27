import type {
  DemoWorkspaceState,
} from "../../venture-foundation/types";

import type {
  PendingMentorSession,
} from "../../entry/types/entry.types";

export interface MentorPreparationSession
  extends PendingMentorSession {
  mentorName: string;
  expertise: string[];
  goal: string;
  currentContext: string;
  questions: string[];
  evidenceToPrepare: string[];
  expectedOutcome: string;
}

export const mentorPreparationSessions: MentorPreparationSession[] =
  [
    {
      id: "mentor-session-growth",
      ventureId: "venture-kizuna-hub",
      relationshipId: "support-kizuna-mai",
      conversationId: "conversation-mentor",
      startsAt: "2026-07-27T04:00:00.000Z",
      mentorName: "Mai Tran",
      expertise: ["Product strategy", "B2B validation"],
      goal: "Chốt cách kiểm chứng activation trước khi mở rộng acquisition.",
      currentContext:
        "Activation sau onboarding đang là điểm nghẽn chính; cohort thứ hai chưa đủ bằng chứng để rollout.",
      questions: [
        "Ngưỡng activation nào đủ để tiếp tục rollout?",
        "Bằng chứng nào nên ưu tiên trong hai tuần tới?",
        "Khi nào nên dừng tối ưu onboarding và chuyển sang acquisition?",
      ],
      evidenceToPrepare: [
        "Funnel onboarding theo từng bước",
        "Phản hồi của cohort người dùng gần nhất",
        "Kết quả thử nghiệm activation hiện tại",
      ],
      expectedOutcome:
        "Một ngưỡng quyết định rõ ràng và 2–3 hành động có thể thử trong hai tuần.",
    },
  ];

export function getMentorPreparationSession(
  sessionId: string | undefined,
) {
  return mentorPreparationSessions.find(
    (session) => session.id === sessionId,
  );
}

export function getPendingMentorSession(
  state: DemoWorkspaceState,
  now = new Date(),
) {
  return mentorPreparationSessions.find((session) => {
    const venture = state.ventures.find(
      (item) => item.id === session.ventureId,
    );
    const relationship = state.supportRelationships.find(
      (item) =>
        item.id === session.relationshipId &&
        item.status === "active" &&
        item.nextSessionAt,
    );
    const startsAt = relationship?.nextSessionAt
      ? new Date(relationship.nextSessionAt).getTime()
      : Number.NaN;
    const timeUntilStart = startsAt - now.getTime();
    const scheduledSoon =
      Number.isFinite(timeUntilStart) &&
      timeUntilStart >= 0 &&
      timeUntilStart <= 60 * 60 * 1000;
    return Boolean(
      venture &&
        venture.status === "active" &&
        relationship &&
        scheduledSoon &&
        !state.uiPreferences.dismissedMentorSessionIds?.includes(
          session.id,
        ),
    );
  });
}
