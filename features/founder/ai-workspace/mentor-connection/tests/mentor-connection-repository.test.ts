import assert from "node:assert/strict";
import test from "node:test";

import {
  baselineDecisionCycle,
  baselineFocus,
  baselineMentorRecommendation,
  baselineReadiness,
  createAiWorkspaceScenarioState,
} from "../../demo/demo-scenarios";
import { aiWorkspaceReducer } from "../../state/ai-workspace-reducer";
import {
  campusFlowMentorEvidence,
  campusFlowMentorVentureContext,
} from "../demo/campusflow-mentor-connection-data";
import { createMockMentorConnectionBriefGenerator } from "../services/mock-mentor-connection-brief-generator";
import { createMockMentorConnectionRepository } from "../services/mock-mentor-connection-repository";
import { DuplicateMentorConnectionError } from "../services/mentor-connection-repository";

async function createBrief(mentorId = "mentor-tran-minh-quan") {
  const generator =
    createMockMentorConnectionBriefGenerator({
      latencyMs: 0,
    });
  const result = await generator.generate({
    ventureId: "venture-campusflow",
    mentor: {
      ...structuredClone(
        baselineMentorRecommendation.payload.mentors[0],
      ),
      mentorId,
    },
    canonicalVentureContext: campusFlowMentorVentureContext,
    currentFocus: structuredClone(baselineFocus),
    readiness: structuredClone(baselineReadiness),
    activeDecisionCycle: structuredClone(
      baselineDecisionCycle,
    ),
    verifiedEvidence: structuredClone(
      campusFlowMentorEvidence,
    ),
  });
  return result.brief;
}

test("drafts restore separately by mentor", async () => {
  const repository = createMockMentorConnectionRepository({
    saveLatencyMs: 0,
  });
  const primary = await createBrief();
  const alternative = await createBrief("mentor-alternative");

  await repository.saveDraft({
    ...primary,
    sections: primary.sections.map((section) =>
      section.id === "current_challenge"
        ? { ...section, content: "Nháp cho mentor chính" }
        : section,
    ),
  });
  await repository.saveDraft({
    ...alternative,
    sections: alternative.sections.map((section) =>
      section.id === "current_challenge"
        ? { ...section, content: "Nháp cho mentor khác" }
        : section,
    ),
  });

  assert.equal(
    (
      await repository.getDraft(
        primary.ventureId,
        primary.mentorId,
      )
    )?.sections[0].content,
    "Nháp cho mentor chính",
  );
  assert.equal(
    (
      await repository.getDraft(
        alternative.ventureId,
        alternative.mentorId,
      )
    )?.sections[0].content,
    "Nháp cho mentor khác",
  );
});

test("double send creates one deterministic request", async () => {
  let sends = 0;
  const repository = createMockMentorConnectionRepository({
    sendLatencyMs: 0,
    onSendRequest: () => {
      sends += 1;
    },
  });
  const brief = await createBrief();
  const [first, second] = await Promise.all([
    repository.sendRequest({ brief }),
    repository.sendRequest({ brief }),
  ]);

  assert.equal(first.id, second.id);
  assert.equal(first.status, "pending");
  assert.equal(sends, 1);
  assert.equal(
    (
      await repository.getExistingRequest(
        brief.ventureId,
        brief.mentorId,
      )
    )?.id,
    first.id,
  );
  await assert.rejects(
    () => repository.sendRequest({ brief }),
    DuplicateMentorConnectionError,
  );
});

test("send failure keeps the draft available for retry", async () => {
  const brief = await createBrief();
  const failing = createMockMentorConnectionRepository({
    saveLatencyMs: 0,
    sendLatencyMs: 0,
    failSend: true,
  });
  await failing.saveDraft(brief);

  await assert.rejects(() =>
    failing.sendRequest({ brief }),
  );
  assert.equal(
    (
      await failing.getDraft(
        brief.ventureId,
        brief.mentorId,
      )
    )?.mentorId,
    brief.mentorId,
  );
});

test("recording a mentor request does not mutate readiness or create a cycle", async () => {
  const brief = await createBrief();
  const repository = createMockMentorConnectionRepository({
    sendLatencyMs: 0,
  });
  const request = await repository.sendRequest({ brief });
  const initial = createAiWorkspaceScenarioState(
    "venture-campusflow",
  );
  const next = aiWorkspaceReducer(initial, {
    type: "set-mentor-connection-request",
    request,
  });

  assert.equal(
    next.readiness.currentScore,
    initial.readiness.currentScore,
  );
  assert.equal(
    next.decisionCycleLifecycle,
    initial.decisionCycleLifecycle,
  );
  assert.equal(next.decisionCycleLifecycle, "not_created");
});
