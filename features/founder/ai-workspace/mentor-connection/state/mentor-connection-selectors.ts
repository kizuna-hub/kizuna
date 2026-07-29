import type {
  MentorConnectionBrief,
  MentorConnectionRequest,
  MentorShareableContext,
} from "../types/mentor-connection.types";

export const mentorContextLabels: Record<
  MentorShareableContext,
  string
> = {
  venture_summary: "Venture summary",
  venture_stage: "Stage hiện tại",
  current_focus: "Current blocker",
  readiness_overview: "Readiness overview",
  selected_evidence: "Evidence đã chọn",
  pitch_deck: "Pitch Deck",
  business_plan: "Business Plan",
  active_decision_cycle: "Decision Cycle đang hoạt động",
};

export function getMentorConnectionBrief(
  briefs: Record<string, MentorConnectionBrief>,
  mentorId?: string,
) {
  return mentorId ? briefs[mentorId] : undefined;
}

export function getMentorConnectionCardState(
  brief?: MentorConnectionBrief,
  request?: MentorConnectionRequest,
) {
  if (request?.status === "pending") return "pending" as const;
  if (brief) return "draft" as const;
  return "idle" as const;
}

export function isMentorConnectionContextStale(
  brief: MentorConnectionBrief | undefined,
  currentFingerprint: string,
) {
  return Boolean(
    brief &&
      brief.contextFingerprint !== currentFingerprint &&
      brief.status !== "sent",
  );
}

