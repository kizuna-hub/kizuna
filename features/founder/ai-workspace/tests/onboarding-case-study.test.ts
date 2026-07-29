import assert from "node:assert/strict";
import test from "node:test";

import { createAiWorkspaceScenarioState } from "../demo/demo-scenarios";
import { createMockAiWorkspaceEngine } from "../demo/mock-ai-engine";
import { aiWorkspaceReducer } from "../state/ai-workspace-reducer";
import type {
  AiWorkspaceResponse,
  AiWorkspaceState,
} from "../types/ai-workspace.types";

const engine = createMockAiWorkspaceEngine({
  timing: "instant",
});

async function ask(
  state: AiWorkspaceState,
  message: string,
) {
  return engine.respond({
    message,
    ventureId: state.ventureId,
    conversationHistory: state.messages,
    activeScenarioId: state.activeScenarioId,
    currentState: state,
    attachedMaterialIds: [],
    retryAttempt: 0,
  });
}

function appendAssistant(
  state: AiWorkspaceState,
  id: string,
  response: AiWorkspaceResponse,
) {
  state = aiWorkspaceReducer(state, {
    type: "stream-start",
    message: {
      id,
      role: "assistant",
      content: response.assistantMessage,
      createdAt: "2026-07-27T03:00:00.000Z",
      status: "streaming",
      responseKind: response.responseKind,
      responseLifecycle: "active",
      thinkingDurationSeconds: 3,
    },
  });
  return aiWorkspaceReducer(state, {
    type: "response-complete",
    messageId: id,
    response,
  });
}

test("CampusFlow moves from diagnosis to one booked mentor session", async () => {
  let state = createAiWorkspaceScenarioState(
    "venture-kizuna-hub",
    "onboarding-case-study",
  );

  const diagnosis = await ask(
    state,
    "Tăng trưởng người dùng đang chững lại. Tôi nên tập trung vào đâu?",
  );
  assert.equal(diagnosis.responseKind, "insight");
  state = appendAssistant(state, "diagnosis", diagnosis);
  assert.equal(
    state.currentFocus.label,
    "Chuyển pilot interest thành pilot thật",
  );

  const alternatives = await ask(
    state,
    "Có hướng thử nghiệm nào khác?",
  );
  assert.equal(alternatives.responseKind, "action_proposal");
  state = appendAssistant(
    state,
    "action-proposal",
    alternatives,
  );
  state = aiWorkspaceReducer(state, {
    type: "confirm-action-proposal",
    messageId: "action-proposal",
  });
  assert.equal(state.decisionCycleLifecycle, "active");
  assert.equal(
    state.messages.at(-1)?.responseLifecycle,
    "completed",
  );

  const risk = await ask(
    state,
    "Điểm yếu lớn nhất của thử nghiệm này là gì?",
  );
  assert.equal(risk.responseKind, "conversation");
  assert.equal(risk.structuredResponse, undefined);

  const mentor = await ask(
    state,
    "Có cần mentor review thử nghiệm này không?",
  );
  assert.equal(
    mentor.responseKind,
    "mentor_recommendation_grid",
  );
  state = appendAssistant(state, "mentor", mentor);
  assert.equal(
    state.mentorRecommendation?.payload.mentors[0].profile
      .name,
    "Trần Minh Quân",
  );

  state = aiWorkspaceReducer(state, {
    type: "book-mentor",
  });
  assert.equal(state.mentorSession?.status, "booked");
  assert.equal(
    state.mentorSession?.goal,
    "Thiết kế pilot 14 ngày cho CampusFlow.",
  );
  assert.equal(
    state.messages.at(-1)?.responseLifecycle,
    "completed",
  );
});
