import assert from "node:assert/strict";
import test from "node:test";

import {
  baselineMentorRecommendation,
  createAiWorkspaceScenarioState,
  sampleMaterials,
} from "../demo/demo-scenarios";
import {
  createMockAiWorkspaceEngine,
  detectAiWorkspaceIntent,
  MockAiWorkspaceError,
} from "../demo/mock-ai-engine";
import type { AiWorkspaceInput } from "../types/ai-workspace.types";

const intentCases = [
  ["Tăng trưởng người dùng đang chững lại", "growth-stalled"],
  ["Điểm nghẽn hiện tại là gì?", "find-bottleneck"],
  ["Vì sao readiness đang thấp?", "explain-readiness"],
  ["Phân tích PitchDeck.pdf", "analyze-materials"],
  ["Đề xuất hành động tiếp theo", "suggest-action"],
  ["Tạo chu kỳ quyết định", "create-decision-cycle"],
  ["Tôi có cần cố vấn không?", "recommend-mentor"],
  ["Tôi muốn phản biện cách AI hiểu startup", "challenge-interpretation"],
  ["Nộp bằng chứng mới", "submit-evidence"],
  ["Review kết quả hiện tại", "review-results"],
] as const;

function createInput(
  message: string,
  scenarioId: AiWorkspaceInput["activeScenarioId"] = "bottleneck",
  retryAttempt = 0,
): AiWorkspaceInput {
  const currentState = createAiWorkspaceScenarioState(
    "venture-kizuna-hub",
    scenarioId,
  );
  return {
    message,
    ventureId: currentState.ventureId,
    conversationHistory: currentState.messages,
    activeScenarioId: scenarioId,
    currentState,
    attachedMaterialIds: [],
    retryAttempt,
  };
}

test("keyword mapping recognizes all required AI workspace intents", () => {
  for (const [message, expected] of intentCases) {
    assert.equal(detectAiWorkspaceIntent(message), expected);
  }
});

test("mock AI engine is deterministic for the same input", async () => {
  const engine = createMockAiWorkspaceEngine({
    timing: "instant",
  });
  const input = createInput(
    "Tăng trưởng người dùng đang chững lại",
  );

  const first = await engine.respond(input);
  const second = await engine.respond(input);

  assert.deepEqual(first, second);
  assert.equal(first.structuredResponse.type, "current-focus");
  assert.equal(first.simulatedLatencyMs, 650);
});

test("material analysis uses selected metadata without reading file content", async () => {
  const engine = createMockAiWorkspaceEngine({
    timing: "instant",
  });
  const input = createInput(
    "Phân tích PitchDeck.pdf",
    "materials",
  );
  input.currentState.attachments = [
    {
      ...sampleMaterials[0],
      origin: "sample",
      status: "ready",
    },
  ];

  const response = await engine.respond(input);

  assert.equal(response.structuredResponse.type, "material-analysis");
  if (response.structuredResponse.type !== "material-analysis") {
    assert.fail("Expected material analysis response");
  }
  assert.deepEqual(
    response.structuredResponse.payload.fileNames,
    ["PitchDeck.pdf"],
  );
  assert.equal(
    response.structuredResponse.payload.findings.find(
      (finding) => finding.id === "customer-proof",
    )?.status,
    "missing",
  );
});

test("evidence submission produces an explainable +7 readiness patch", async () => {
  const engine = createMockAiWorkspaceEngine({
    timing: "instant",
  });
  const response = await engine.respond(
    createInput("Nộp bằng chứng mới", "decision-cycle"),
  );

  assert.equal(response.structuredResponse.type, "evidence-review");
  assert.equal(response.proposedPatches.readiness?.currentScore, 61);
  assert.equal(response.proposedPatches.readiness?.delta, 7);
  assert.match(
    response.proposedPatches.readiness?.explanation ?? "",
    /không phải chỉ vì một file/i,
  );
});

test("mentor recommendation remains gated until evidence exists", async () => {
  const engine = createMockAiWorkspaceEngine({
    timing: "instant",
  });
  const notReady = await engine.respond(
    createInput("Đề xuất cố vấn phù hợp"),
  );
  assert.equal(
    notReady.structuredResponse.type === "mentor-recommendation"
      ? notReady.structuredResponse.payload
      : undefined,
    null,
  );

  const readyInput = createInput(
    "Đề xuất cố vấn phù hợp",
    "decision-cycle",
  );
  readyInput.currentState.decisionCycle.evidenceSubmitted = true;
  readyInput.currentState.decisionCycle.reviewCompleted = true;
  const ready = await engine.respond(readyInput);

  assert.equal(ready.structuredResponse.type, "mentor-recommendation");
  if (ready.structuredResponse.type !== "mentor-recommendation") {
    assert.fail("Expected mentor response");
  }
  assert.equal(ready.structuredResponse.payload?.name, "Lan Nguyen");
});

test("dismissed mentor is not recommended again in the same decision cycle", async () => {
  const engine = createMockAiWorkspaceEngine({
    timing: "instant",
  });
  const input = createInput(
    "Đề xuất cố vấn phù hợp",
    "decision-cycle",
  );
  input.currentState.decisionCycle.evidenceSubmitted = true;
  input.currentState.decisionCycle.reviewCompleted = true;
  input.currentState.mentorRecommendation = {
    ...structuredClone(baselineMentorRecommendation),
    status: "deferred",
    dismissReason: "try_first",
  };

  const response = await engine.respond(input);

  assert.equal(response.structuredResponse.type, "mentor-recommendation");
  if (response.structuredResponse.type !== "mentor-recommendation") {
    assert.fail("Expected mentor response");
  }
  assert.equal(response.structuredResponse.payload, null);
  assert.match(response.assistantMessage, /không lặp lại/i);

  const reviewInput = createInput(
    "Review kết quả hiện tại",
    "decision-cycle",
  );
  reviewInput.currentState.decisionCycle.evidenceSubmitted = true;
  reviewInput.currentState.mentorRecommendation =
    structuredClone(input.currentState.mentorRecommendation);
  const reviewResponse = await engine.respond(reviewInput);
  assert.equal(
    reviewResponse.proposedPatches.mentorRecommendation?.status,
    "deferred",
  );
});

test("reviewing submitted evidence completes the cycle and unlocks one mentor", async () => {
  const engine = createMockAiWorkspaceEngine({
    timing: "instant",
  });
  const input = createInput(
    "Review kết quả hiện tại",
    "decision-cycle",
  );
  input.currentState.decisionCycle.evidenceSubmitted = true;

  const response = await engine.respond(input);

  assert.equal(
    response.proposedPatches.decisionCycle?.reviewCompleted,
    true,
  );
  assert.equal(
    response.proposedPatches.mentorRecommendation?.name,
    "Lan Nguyen",
  );
});

test("error scenario preserves deterministic retry recovery", async () => {
  const engine = createMockAiWorkspaceEngine({
    timing: "instant",
  });
  const firstAttempt = createInput(
    "Phân tích điểm nghẽn của startup",
    "error",
  );

  await assert.rejects(
    engine.respond(firstAttempt),
    MockAiWorkspaceError,
  );

  const retry = await engine.respond({
    ...firstAttempt,
    retryAttempt: 1,
  });
  assert.equal(retry.structuredResponse.type, "current-focus");
});

test("partial response preserves text and never proposes venture patches", async () => {
  const engine = createMockAiWorkspaceEngine({
    timing: "instant",
  });
  const input = createInput(
    "Hãy mô phỏng phản hồi một phần về điểm nghẽn",
  );

  const partial = await engine.respond(input);
  assert.equal(partial.completionStatus, "incomplete");
  assert.ok(partial.assistantMessage.length > 0);
  assert.deepEqual(partial.proposedPatches, {});

  const retry = await engine.respond({
    ...input,
    retryAttempt: 1,
  });
  assert.equal(retry.completionStatus, "complete");
  assert.ok(retry.proposedPatches.currentFocus);
});

test("resolved canonical memory guides later mock recommendations", async () => {
  const engine = createMockAiWorkspaceEngine({
    timing: "instant",
  });
  const input = createInput(
    "Khách hàng mục tiêu hiện tại là ai?",
    "context-conflict",
  );
  input.contextSummary = {
    confirmedMemory: [
      "Founder cá nhân vẫn là ưu tiên hiện tại: Founder xác nhận tập trung vào founder cá nhân.",
    ],
    excludedSourceIds: ["memory-target-student"],
  };

  const response = await engine.respond(input);
  assert.match(response.assistantMessage, /founder/i);
  assert.equal(response.structuredResponse.type, "current-focus");
  if (response.structuredResponse.type === "current-focus") {
    assert.equal(
      response.structuredResponse.payload.sourceStatus,
      "verified",
    );
  }
});
