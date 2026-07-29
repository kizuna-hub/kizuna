import { campusFlowMentorMatches } from "../mentor-recommendation/demo/campusflow-mentor-recommendations";
import {
  campusFlowMentorEvidence,
  campusFlowMentorVentureContext,
} from "./demo/campusflow-mentor-connection-data";
import { createMockMentorConnectionBriefGenerator } from "./services/mock-mentor-connection-brief-generator";

export type {
  MentorConnectionBrief,
  MentorConnectionBriefSection,
  MentorConnectionDocument,
  MentorConnectionEvidence,
} from "./types/mentor-connection.types";

export async function createCanonicalCampusFlowMentorBrief() {
  const generator = createMockMentorConnectionBriefGenerator({
    latencyMs: 0,
  });
  const result = await generator.generate({
    ventureId: "venture-campusflow",
    mentor: structuredClone(campusFlowMentorMatches[0]),
    canonicalVentureContext: structuredClone(
      campusFlowMentorVentureContext,
    ),
    currentFocus: {
      id: "campusflow-pilot-focus",
      label: "Thiết kế pilot đầu tiên",
      bottleneck:
        "Hai câu lạc bộ đã quan tâm tới pilot, nhưng team chưa chốt phạm vi, success metric, nhóm tham gia và kế hoạch thu thập evidence.",
      whyItMatters:
        "Một pilot thiếu ranh giới sẽ tạo tín hiệu khó diễn giải và làm chậm quyết định tiếp theo.",
      nextAction:
        "Chốt một kế hoạch pilot 14 ngày đủ rõ để bắt đầu trong tuần tiếp theo.",
      sourceStatus: "verified",
    },
    verifiedEvidence: structuredClone(campusFlowMentorEvidence),
    clarification:
      "Thiết kế pilot 14 ngày với phạm vi, participant count, primary metric và evidence plan rõ ràng.",
  });

  return result.brief;
}
