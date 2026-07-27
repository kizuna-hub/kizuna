import assert from "node:assert/strict";
import test from "node:test";

import {
  baselineMentorRecommendation,
  createAiWorkspaceScenarioState,
} from "../demo/demo-scenarios";
import { createMockAiWorkspaceEngine } from "../demo/mock-ai-engine";
import { aiWorkspaceReducer } from "../state/ai-workspace-reducer";
import type {
  AiWorkspaceMessage,
  AiWorkspaceResponse,
  AiWorkspaceState,
} from "../types/ai-workspace.types";

function addCompletedResponse(
  state: AiWorkspaceState,
  id: string,
  response: AiWorkspaceResponse,
) {
  const streaming = aiWorkspaceReducer(state, {
    type: "stream-start",
    message: {
      id,
      role: "assistant",
      content: response.assistantMessage,
      createdAt: "2026-07-27T02:10:01.000Z",
      status: "streaming",
      responseKind: response.responseKind,
      responseLifecycle: "active",
      thinkingDurationSeconds: 3,
    },
  });
  return aiWorkspaceReducer(streaming, {
    type: "response-complete",
    messageId: id,
    response,
  });
}

async function respond(
  state: AiWorkspaceState,
  message: string,
) {
  return createMockAiWorkspaceEngine({
    timing: "instant",
  }).respond({
    message,
    ventureId: state.ventureId,
    conversationHistory: state.messages,
    activeScenarioId: state.activeScenarioId,
    currentState: state,
    attachedMaterialIds: [],
    retryAttempt: 0,
  });
}

test("chat reducer preserves founder message through typing and streaming", async () => {
  const initial = createAiWorkspaceScenarioState(
    "venture-kizuna-hub",
  );
  const founderMessage: AiWorkspaceMessage = {
    id: "founder-test",
    role: "founder",
    content: "Điểm nghẽn là gì?",
    createdAt: "2026-07-27T02:10:00.000Z",
    status: "complete",
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
  assert.equal(
    typing.messages.at(-1)?.content,
    founderMessage.content,
  );

  const streaming = aiWorkspaceReducer(typing, {
    type: "stream-start",
    message: {
      id: "assistant-test",
      role: "assistant",
      content: "",
      createdAt: "2026-07-27T02:10:01.000Z",
      status: "streaming",
      responseKind: "insight",
      responseLifecycle: "active",
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

  const response = await respond(initial, founderMessage.content);
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
  assert.equal(
    complete.messages.at(-1)?.responseLifecycle,
    "active",
  );
});

test("confirming an action creates one cycle and collapses the proposal", async () => {
  let state = createAiWorkspaceScenarioState(
    "venture-kizuna-hub",
    "onboarding-case-study",
  );
  const response = await respond(
    state,
    "Có hướng thử nghiệm nào khác?",
  );
  state = addCompletedResponse(
    state,
    "assistant-action-proposal",
    response,
  );

  state = aiWorkspaceReducer(state, {
    type: "confirm-action-proposal",
    messageId: "assistant-action-proposal",
  });

  assert.equal(state.decisionCycleLifecycle, "active");
  assert.equal(state.view, "decision-cycle");
  assert.equal(
    state.messages.find(
      (message) => message.id === "assistant-action-proposal",
    )?.responseLifecycle,
    "completed",
  );

  const duplicate = aiWorkspaceReducer(state, {
    type: "confirm-action-proposal",
    messageId: "assistant-action-proposal",
  });
  assert.strictEqual(duplicate, state);
});

test("new insight supersedes the previous active insight", async () => {
  let state = createAiWorkspaceScenarioState(
    "venture-kizuna-hub",
    "onboarding-case-study",
  );
  state = addCompletedResponse(
    state,
    "insight-one",
    await respond(state, "Điểm nghẽn hiện tại là gì?"),
  );
  state = addCompletedResponse(
    state,
    "insight-two",
    await respond(
      state,
      "Tăng trưởng người dùng đang chững lại",
    ),
  );

  assert.equal(
    state.messages.find(
      (message) => message.id === "insight-one",
    )?.responseLifecycle,
    "superseded",
  );
  assert.equal(
    state.messages.find(
      (message) => message.id === "insight-two",
    )?.responseLifecycle,
    "active",
  );
});

test("booking a mentor is idempotent and creates one compact session state", async () => {
  let state = createAiWorkspaceScenarioState(
    "venture-kizuna-hub",
    "onboarding-case-study",
  );
  state.decisionCycleLifecycle = "active";
  state = addCompletedResponse(
    state,
    "mentor-intervention",
    await respond(state, "Đề xuất cố vấn phù hợp"),
  );

  assert.equal(state.mentorRecommendation?.name, "Jessica Lin");
  assert.equal(
    state.messages.at(-1)?.responseKind,
    "mentor_intervention",
  );

  state = aiWorkspaceReducer(state, {
    type: "book-mentor",
  });
  const firstSession = state.mentorSession;

  assert.equal(state.mentorRecommendation?.status, "booked");
  assert.equal(firstSession?.displayTime, "10:00, Thứ Năm");
  assert.equal(
    state.messages.at(-1)?.responseLifecycle,
    "completed",
  );

  const duplicate = aiWorkspaceReducer(state, {
    type: "book-mentor",
  });
  assert.strictEqual(duplicate, state);
  assert.strictEqual(duplicate.mentorSession, firstSession);
});

test("deferring a mentor dismisses the intervention for the current cycle", async () => {
  let state = createAiWorkspaceScenarioState(
    "venture-kizuna-hub",
    "onboarding-case-study",
  );
  state.decisionCycleLifecycle = "active";
  state = addCompletedResponse(
    state,
    "mentor-dismiss",
    await respond(state, "Đề xuất cố vấn phù hợp"),
  );
  state = aiWorkspaceReducer(state, {
    type: "defer-mentor",
    reason: "try_first",
  });

  assert.equal(state.mentorRecommendation?.status, "deferred");
  assert.equal(
    state.mentorRecommendation?.dismissReason,
    "try_first",
  );
  assert.equal(
    state.messages.at(-1)?.responseLifecycle,
    "dismissed",
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

test("evidence update changes readiness and review unlocks Jessica", () => {
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
  assert.equal(state.decisionCycleLifecycle, "completed");
  assert.equal(state.mentorRecommendation?.name, "Jessica Lin");

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
      "onboarding-case-study",
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
      responseKind: "conversation",
      responseLifecycle: "active",
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
  assert.equal(
    incomplete.messages.at(-1)?.responseLifecycle,
    "failed",
  );
  assert.deepEqual(incomplete.currentFocus, initial.currentFocus);
  assert.deepEqual(incomplete.readiness, initial.readiness);
});

test("message send failure keeps founder text recoverable for retry, edit, or delete", () => {
  const initial = createAiWorkspaceScenarioState(
    "venture-kizuna-hub",
  );
  const message: AiWorkspaceMessage = {
    id: "founder-send-failed",
    role: "founder",
    content: "Lỗi gửi tin nhắn mô phỏng",
    createdAt: "2026-07-27T02:10:00.000Z",
    status: "complete",
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
  assert.equal(retrying.messages.at(-1)?.status, "complete");

  const removed = aiWorkspaceReducer(failed, {
    type: "remove-message",
    messageId: message.id,
  });
  assert.equal(
    removed.messages.some((item) => item.id === message.id),
    false,
  );
});
