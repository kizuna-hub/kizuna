import assert from "node:assert/strict";
import test from "node:test";

import { createAiWorkspaceScenarioState } from "../demo/demo-scenarios";
import {
  createMockAiWorkspaceEngine,
  detectAiWorkspaceIntent,
} from "../demo/mock-ai-engine";

const questions = [
  "Giải thích vấn đề và người dùng",
  "Customer discovery đang ở đâu?",
  "Prototype và learning được chấm thế nào?",
  "Tín hiệu thị trường và commitment có đủ không?",
  "Kỷ luật thử nghiệm hiện tại thế nào?",
  "Năng lực đội ngũ được đánh giá ra sao?",
  "Pitch Deck tăng readiness bao nhiêu?",
] as const;

test("all seven readiness dimensions have deterministic answers", async () => {
  const engine = createMockAiWorkspaceEngine({
    timing: "instant",
  });
  const state = createAiWorkspaceScenarioState(
    "venture-campusflow",
    "materials",
  );
  const responses: string[] = [];

  for (const question of questions) {
    assert.equal(
      detectAiWorkspaceIntent(question),
      "explain-readiness-dimension",
    );
    const response = await engine.respond({
      message: question,
      ventureId: state.ventureId,
      conversationHistory: state.messages,
      activeScenarioId: state.activeScenarioId,
      currentState: state,
      attachedMaterialIds: [],
      retryAttempt: 0,
    });
    responses.push(response.assistantMessage);
  }

  assert.equal(new Set(responses).size, 7);
  assert.match(responses[0], /78\/100/);
  assert.match(responses[1], /62\/100/);
  assert.match(responses[2], /58\/100/);
  assert.match(responses[3], /45\/100/);
  assert.match(responses[4], /72\/100/);
  assert.match(responses[5], /65\/100/);
  assert.match(responses[6], /1–2 điểm/);
});

test("four canonical Founder questions route to distinct product answers", async () => {
  const engine = createMockAiWorkspaceEngine({
    timing: "instant",
  });
  const state = createAiWorkspaceScenarioState(
    "venture-campusflow",
    "materials",
  );
  const ask = (message: string) =>
    engine.respond({
      message,
      ventureId: state.ventureId,
      conversationHistory: state.messages,
      activeScenarioId: state.activeScenarioId,
      currentState: state,
      attachedMaterialIds: [],
      retryAttempt: 0,
    });

  const [pitch, action, market, mentor] = await Promise.all([
    ask("Phân tích Pitch Deck và cách cải thiện"),
    ask("Tôi nên làm gì tiếp theo?"),
    ask("Đánh giá traction hiện tại"),
    ask("Tìm mentor phù hợp"),
  ]);

  assert.equal(pitch.intent, "analyze-materials");
  assert.equal(action.intent, "suggest-action");
  assert.equal(market.intent, "assess-traction");
  assert.equal(mentor.intent, "recommend-mentor");
  assert.match(pitch.assistantMessage, /evidence/i);
  assert.match(action.assistantMessage, /14 ngày/i);
  assert.match(market.assistantMessage, /chưa phải traction/i);
  assert.equal(
    mentor.structuredResponse?.type,
    "mentor-recommendation-grid",
  );
});
