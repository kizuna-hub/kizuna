import assert from "node:assert/strict";
import test from "node:test";

import {
  baselineDecisionCycle,
  baselineFocus,
  baselineMentorRecommendation,
  baselineReadiness,
  createAiWorkspaceScenarioState,
} from "../../demo/demo-scenarios";
import { createLongRunDemoState } from "../../demo/demo-long-run-data";
import {
  restoreAiSession,
  toPersistedSession,
} from "../../state/ai-workspace-persistence";
import { aiWorkspaceReducer } from "../../state/ai-workspace-reducer";
import { createWorkspaceLayoutState } from "../../state/workspace-layout-reducer";
import {
  campusFlowMentorEvidence,
  campusFlowMentorVentureContext,
} from "../demo/campusflow-mentor-connection-data";
import { createMockMentorConnectionBriefGenerator } from "../services/mock-mentor-connection-brief-generator";
import {
  refreshMentorConnectionBrief,
  toggleMentorBriefContext,
  toggleMentorBriefDocument,
  toggleMentorBriefEvidence,
  updateMentorBriefSection,
  validateMentorBriefContext,
} from "../state/mentor-connection-state";

function input() {
  return {
    ventureId: "venture-campusflow",
    mentor: structuredClone(
      baselineMentorRecommendation.payload.mentors[0],
    ),
    canonicalVentureContext: campusFlowMentorVentureContext,
    currentFocus: structuredClone(baselineFocus),
    readiness: structuredClone(baselineReadiness),
    activeDecisionCycle: structuredClone(
      baselineDecisionCycle,
    ),
    verifiedEvidence: structuredClone(
      campusFlowMentorEvidence,
    ),
    relevantConversationSummary:
      "Founder muốn chuyển pilot interest thành pilot có phạm vi.",
  };
}

test("generator prioritizes canonical context and excludes unsupported claims", async () => {
  const generator =
    createMockMentorConnectionBriefGenerator({
      latencyMs: 0,
    });
  const result = await generator.generate(input());
  const challenge = result.brief.sections.find(
    (section) => section.id === "current_challenge",
  );
  const message = result.brief.sections.find(
    (section) => section.id === "mentor_message",
  );

  assert.equal(result.missingRequiredContext.length, 0);
  assert.equal(result.confidence, "high");
  assert.equal(
    challenge?.sourceIds[0],
    "current-focus",
  );
  assert.equal(
    challenge?.generationStatus,
    "ai_inferred",
  );
  assert.equal(
    message?.generationStatus,
    "verified_context",
  );
  assert.match(message?.content ?? "", /quan tâm tới pilot/);
  assert.doesNotMatch(
    message?.content ?? "",
    /pilot đã được xác nhận/i,
  );
  assert.equal(
    result.brief.selectedDocumentIds.includes(
      "campusflow-business-plan-v1",
    ),
    false,
  );
  assert.equal(result.brief.selectedEvidenceIds.length, 3);
  assert.equal(
    result.brief.selectedContext.includes("business_plan"),
    false,
  );
  assert.equal(
    result.brief.sources.some(
      (source) => source.label === "Raw chat transcript",
    ),
    false,
  );
});

test("connection remains possible without readiness", async () => {
  const generator =
    createMockMentorConnectionBriefGenerator({
      latencyMs: 0,
    });
  const result = await generator.generate({
    ...input(),
    readiness: undefined,
  });

  assert.equal(result.missingRequiredContext.length, 0);
  assert.equal(
    result.brief.selectedContext.includes(
      "readiness_overview",
    ),
    false,
  );
  assert.equal(result.brief.status, "ready");
});

test("generator asks for at most one essential clarification", async () => {
  const generator =
    createMockMentorConnectionBriefGenerator({
      latencyMs: 0,
    });
  const result = await generator.generate({
    ...input(),
    currentFocus: undefined,
    activeDecisionCycle: undefined,
  });

  assert.deepEqual(result.missingRequiredContext, [
    "connection_goal",
  ]);
});

test("founder edits and selective sharing remain explicit", async () => {
  const generator =
    createMockMentorConnectionBriefGenerator({
      latencyMs: 0,
    });
  const original = (await generator.generate(input())).brief;
  const edited = updateMentorBriefSection(
    original,
    "current_challenge",
    {
      content: "Founder đã chỉnh khó khăn.",
      checklistItems: undefined,
    },
    "2026-07-29T03:20:00.000Z",
  );
  const withoutRequired = toggleMentorBriefContext(
    edited,
    "current_focus",
    "2026-07-29T03:21:00.000Z",
  );
  const withBusinessPlan = toggleMentorBriefDocument(
    withoutRequired,
    "campusflow-business-plan-v1",
    "2026-07-29T03:22:00.000Z",
  );
  const disputed = {
    ...withBusinessPlan,
    evidence: withBusinessPlan.evidence.map((item, index) =>
      index === 0
        ? { ...item, status: "disputed" as const }
        : item,
    ),
  };
  const evidenceAttempt = toggleMentorBriefEvidence(
    disputed,
    disputed.evidence[0].id,
    "2026-07-29T03:23:00.000Z",
  );

  assert.equal(
    validateMentorBriefContext(withoutRequired).valid,
    false,
  );
  assert.equal(
    withBusinessPlan.selectedContext.includes("business_plan"),
    true,
  );
  assert.deepEqual(
    evidenceAttempt.selectedEvidenceIds,
    disputed.selectedEvidenceIds,
  );
});

test("refresh preserves founder edits while updating canonical sections", async () => {
  const generator =
    createMockMentorConnectionBriefGenerator({
      latencyMs: 0,
    });
  const first = (await generator.generate(input())).brief;
  const edited = updateMentorBriefSection(
    first,
    "current_challenge",
    {
      content: "Giữ nguyên câu founder đã duyệt.",
      checklistItems: undefined,
    },
    "2026-07-29T03:20:00.000Z",
  );
  const refreshedResult = await generator.generate({
    ...input(),
    currentFocus: {
      ...baselineFocus,
      id: "focus-updated",
      bottleneck: "Context mới",
    },
  });
  const refreshed = refreshMentorConnectionBrief(
    edited,
    refreshedResult.brief,
  );

  assert.equal(
    refreshed.sections.find(
      (section) => section.id === "current_challenge",
    )?.content,
    "Giữ nguyên câu founder đã duyệt.",
  );
  assert.equal(
    refreshed.contextFingerprint,
    refreshedResult.brief.contextFingerprint,
  );
});

test("venture persistence restores edited brief and selected context", async () => {
  const generator =
    createMockMentorConnectionBriefGenerator({
      latencyMs: 0,
    });
  const generated = (await generator.generate(input())).brief;
  const edited = updateMentorBriefSection(
    generated,
    "expected_outcome",
    {
      content: "Outcome founder đã duyệt.",
      checklistItems: undefined,
    },
    "2026-07-29T03:24:00.000Z",
  );
  const state = aiWorkspaceReducer(
    createAiWorkspaceScenarioState(
      "venture-campusflow",
      "mentor",
    ),
    {
      type: "set-mentor-connection-brief",
      brief: edited,
    },
  );
  const persisted = toPersistedSession(
    state,
    createLongRunDemoState("venture-campusflow"),
    createWorkspaceLayoutState(),
  );
  const restored = restoreAiSession(
    "venture-campusflow",
    persisted,
  );

  assert.equal(
    restored.mentorConnectionBriefs[edited.mentorId].sections.find(
      (section) => section.id === "expected_outcome",
    )?.content,
    "Outcome founder đã duyệt.",
  );
  assert.deepEqual(
    restored.mentorConnectionBriefs[edited.mentorId]
      .selectedContext,
    edited.selectedContext,
  );
});
