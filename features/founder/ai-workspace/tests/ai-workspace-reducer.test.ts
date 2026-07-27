import assert from "node:assert/strict";
import test from "node:test";

import {
  baselineMentorRecommendation,
  createAiWorkspaceScenarioState,
} from "../demo/demo-scenarios";
import { createMockAiWorkspaceEngine } from "../demo/mock-ai-engine";
import { aiWorkspaceReducer } from "../state/ai-workspace-reducer";

test("chat reducer preserves founder message through typing and streaming", async () => {
  const initial = createAiWorkspaceScenarioState(
    "venture-kizuna-hub",
  );
  const founderMessage = {
    id: "founder-test",
    role: "founder" as const,
    content: "Điểm nghẽn là gì?",
    createdAt: "2026-07-27T02:10:00.000Z",
    status: "complete" as const,
  };
  const typing = aiWorkspaceReducer(initial, {
    type: "user-message",
    message: founderMessage,
    request: {
      message: founderMessage.content,
      retryAttempt: 0,
    },
  });
  assert.equal(typing.generationStatus, "typing");
  assert.equal(typing.messages.at(-1)?.content, founderMessage.content);

  const streaming = aiWorkspaceReducer(typing, {
    type: "stream-start",
    message: {
      id: "assistant-test",
      role: "assistant",
      content: "",
      createdAt: "2026-07-27T02:10:01.000Z",
      status: "streaming",
      thinkingDurationSeconds: 3,
    },
  });
  const withChunk = aiWorkspaceReducer(streaming, {
    type: "stream-chunk",
    messageId: "assistant-test",
    chunk: "Tín hiệu hiện tại",
  });
  assert.equal(
    withChunk.messages.at(-1)?.content,
    "Tín hiệu hiện tại",
  );
  assert.equal(
    withChunk.messages.at(-1)?.thinkingDurationSeconds,
    3,
  );

  const response = await createMockAiWorkspaceEngine({
    timing: "instant",
  }).respond({
    message: founderMessage.content,
    ventureId: initial.ventureId,
    conversationHistory: typing.messages,
    activeScenarioId: initial.activeScenarioId,
    currentState: initial,
    attachedMaterialIds: [],
    retryAttempt: 0,
  });
  const complete = aiWorkspaceReducer(withChunk, {
    type: "response-complete",
    messageId: "assistant-test",
    response,
  });

  assert.equal(complete.generationStatus, "idle");
  assert.equal(complete.messages.at(-1)?.status, "complete");
  assert.equal(
    complete.messages.at(-1)?.thinkingDurationSeconds,
    3,
  );
  assert.equal(
    complete.messages.at(-1)?.structuredResponse?.type,
    "current-focus",
  );
});

test("decision cycle advances one step at a time and keeps completed summaries", () => {
  let state = createAiWorkspaceScenarioState(
    "venture-kizuna-hub",
    "decision-cycle",
  );
  state = aiWorkspaceReducer(state, {
    type: "set-cycle-step",
    step: "decide",
  });
  state = aiWorkspaceReducer(state, {
    type: "set-cycle-step",
    step: "act",
  });

  assert.deepEqual(state.decisionCycle.completedSteps, [
    "understand",
    "decide",
  ]);

  state = aiWorkspaceReducer(state, {
    type: "set-cycle-step",
    step: "understand",
  });
  assert.deepEqual(state.decisionCycle.completedSteps, [
    "understand",
    "decide",
  ]);
});

test("evidence update changes readiness and review unlocks one mentor", () => {
  let state = createAiWorkspaceScenarioState(
    "venture-kizuna-hub",
    "decision-cycle",
  );
  state = aiWorkspaceReducer(state, {
    type: "submit-cycle-evidence",
  });

  assert.equal(state.readiness.currentScore, 61);
  assert.equal(state.readiness.delta, 7);
  assert.equal(state.decisionCycle.currentStep, "review");
  assert.equal(state.decisionCycle.evidenceSubmitted, true);
  assert.ok(
    state.evidenceHealth.every(
      (item) => item.status === "verified",
    ),
  );

  state = aiWorkspaceReducer(state, {
    type: "complete-cycle-review",
    mentor: structuredClone(baselineMentorRecommendation),
  });
  assert.equal(state.decisionCycle.reviewCompleted, true);
  assert.equal(state.mentorRecommendation?.name, "Lan Nguyen");

  state = aiWorkspaceReducer(state, { type: "defer-mentor" });
  assert.equal(state.mentorRecommendation?.status, "deferred");
  assert.equal(
    state.mentorRecommendation?.dismissReason,
    "not_now",
  );

  state = aiWorkspaceReducer(state, {
    type: "set-mentor-status",
    status: "saved",
  });
  assert.equal(state.mentorRecommendation?.status, "saved");

  const preparationItem =
    state.mentorRecommendation?.preparation[3];
  assert.ok(preparationItem);
  state = aiWorkspaceReducer(state, {
    type: "toggle-mentor-preparation",
    itemId: preparationItem.id,
  });
  assert.equal(
    state.mentorRecommendation?.preparation[3]?.completed,
    true,
  );

  state = aiWorkspaceReducer(state, {
    type: "set-mentor-status",
    status: "booked",
  });
  assert.equal(state.mentorRecommendation?.status, "booked");
});

test("scenario reset clears transient conversation error state", () => {
  const initial = createAiWorkspaceScenarioState(
    "venture-kizuna-hub",
    "error",
  );
  const failed = aiWorkspaceReducer(initial, {
    type: "response-error",
    message: "Mock error",
  });
  assert.equal(failed.generationStatus, "error");

  const reset = aiWorkspaceReducer(failed, {
    type: "set-scenario",
    state: createAiWorkspaceScenarioState(
      "venture-kizuna-hub",
      "bottleneck",
    ),
  });
  assert.equal(reset.generationStatus, "idle");
  assert.equal(reset.errorMessage, undefined);
});

test("incomplete AI response preserves streamed text without applying patches", () => {
  const initial = createAiWorkspaceScenarioState(
    "venture-kizuna-hub",
  );
  const streaming = aiWorkspaceReducer(initial, {
    type: "stream-start",
    message: {
      id: "assistant-partial",
      role: "assistant",
      content: "",
      createdAt: "2026-07-27T02:10:01.000Z",
      status: "streaming",
    },
  });
  const withChunk = aiWorkspaceReducer(streaming, {
    type: "stream-chunk",
    messageId: "assistant-partial",
    chunk: "Phần nội dung đã nhận…",
  });
  const incomplete = aiWorkspaceReducer(withChunk, {
    type: "response-incomplete",
    messageId: "assistant-partial",
    message: "Mock partial response",
  });

  assert.equal(incomplete.generationStatus, "error");
  assert.equal(
    incomplete.messages.at(-1)?.content,
    "Phần nội dung đã nhận…",
  );
  assert.equal(
    incomplete.messages.at(-1)?.status,
    "incomplete",
  );
  assert.deepEqual(incomplete.currentFocus, initial.currentFocus);
  assert.deepEqual(incomplete.readiness, initial.readiness);
});

test("message send failure keeps founder text recoverable for retry, edit, or delete", () => {
  const initial = createAiWorkspaceScenarioState(
    "venture-kizuna-hub",
  );
  const message = {
    id: "founder-send-failed",
    role: "founder" as const,
    content: "Lỗi gửi tin nhắn mô phỏng",
    createdAt: "2026-07-27T02:10:00.000Z",
    status: "complete" as const,
  };
  const request = {
    message: message.content,
    retryAttempt: 0,
  };
  const appended = aiWorkspaceReducer(initial, {
    type: "user-message",
    message,
    request,
  });
  const failed = aiWorkspaceReducer(appended, {
    type: "message-send-error",
    messageId: message.id,
  });

  assert.equal(failed.messages.at(-1)?.status, "failed");
  assert.equal(failed.messages.at(-1)?.content, message.content);

  const retrying = aiWorkspaceReducer(failed, {
    type: "retry-start",
    request: { ...request, retryAttempt: 1 },
  });
  assert.equal(
    retrying.messages.at(-1)?.status,
    "complete",
  );

  const removed = aiWorkspaceReducer(failed, {
    type: "remove-message",
    messageId: message.id,
  });
  assert.equal(
    removed.messages.some((item) => item.id === message.id),
    false,
  );
});
