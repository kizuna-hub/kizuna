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
import type {
  AiWorkspaceInput,
  AiWorkspaceResponse,
  StructuredResponse,
} from "../types/ai-workspace.types";

const intentCases = [
  ["Tăng trưởng người dùng đang chững lại", "growth-stalled"],
  ["Điểm nghẽn hiện tại là gì?", "find-bottleneck"],
  ["Có hướng thử nghiệm nào khác?", "compare-experiments"],
  ["Điểm yếu lớn nhất của thử nghiệm này là gì?", "experiment-risk"],
  ["Cần theo dõi metric nào?", "experiment-metrics"],
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
  scenarioId: AiWorkspaceInput["activeScenarioId"] =
    "onboarding-case-study",
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

function requireStructured(
  response: AiWorkspaceResponse,
): StructuredResponse {
  assert.ok(
    response.structuredResponse,
    "Expected a structured response",
  );
  return response.structuredResponse;
}

test("keyword mapping recognizes all required AI workspace intents", () => {
  for (const [message, expected] of intentCases) {
    assert.equal(detectAiWorkspaceIntent(message), expected);
  }
});

test("the onboarding case study starts from the required founder baseline", () => {
  const state = createAiWorkspaceScenarioState(
    "venture-kizuna-hub",
    "onboarding-case-study",
  );

  assert.equal(state.readiness.currentScore, 61);
  assert.equal(state.readiness.delta, 7);
  assert.equal(state.currentFocus.label, "Chưa xác định");
  assert.equal(
    state.evidenceHealth.filter(
      (item) => item.status === "verified",
    ).length,
    3,
  );
  assert.equal(
    state.evidenceHealth.filter(
      (item) => item.status === "missing",
    ).length,
    2,
  );
  assert.equal(state.decisionCycleLifecycle, "not_created");
  assert.equal(state.mentorRecommendation, undefined);
});

test("mock AI engine is deterministic and returns a compact insight for stalled growth", async () => {
  const engine = createMockAiWorkspaceEngine({
    timing: "instant",
  });
  const input = createInput(
    "Tăng trưởng người dùng đang chững lại. Tôi nên tập trung vào đâu?",
  );

  const first = await engine.respond(input);
  const second = await engine.respond(input);

  assert.deepEqual(first, second);
  assert.equal(first.responseKind, "insight");
  assert.equal(first.lifecycle, "active");
  assert.equal(first.simulatedLatencyMs, 650);
  assert.equal(first.sourceReferences.length, 4);
  assert.match(first.assistantMessage, /Top-of-funnel vẫn ổn/i);
  assert.equal(requireStructured(first).type, "current-focus");
});

test("experiment alternatives become an action proposal without duplicating the CTA in prompts", async () => {
  const response = await createMockAiWorkspaceEngine({
    timing: "instant",
  }).respond(createInput("Có hướng thử nghiệm nào khác?"));

  assert.equal(response.responseKind, "action_proposal");
  assert.match(response.assistantMessage, /1\. Rút onboarding/i);
  assert.equal(
    requireStructured(response).type,
    "suggested-action",
  );
  assert.equal(
    response.suggestedPrompts.some((prompt) =>
      /tạo|mở chu kỳ quyết định/i.test(prompt),
    ),
    false,
  );
});

test("experiment risk and metric follow-ups stay conversational", async () => {
  const engine = createMockAiWorkspaceEngine({
    timing: "instant",
  });
  const risk = await engine.respond(
    createInput(
      "Điểm yếu lớn nhất của thử nghiệm này là gì?",
    ),
  );
  const metrics = await engine.respond(
    createInput("Cần theo dõi metric nào?"),
  );

  assert.equal(risk.responseKind, "conversation");
  assert.equal(risk.structuredResponse, undefined);
  assert.match(risk.assistantMessage, /Rủi ro lớn nhất/i);
  assert.equal(metrics.responseKind, "conversation");
  assert.equal(metrics.structuredResponse, undefined);
  assert.match(metrics.assistantMessage, /metric chính/i);
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
  const structured = requireStructured(response);

  assert.equal(response.responseKind, "artifact_preview");
  assert.equal(structured.type, "material-analysis");
  if (structured.type !== "material-analysis") {
    assert.fail("Expected material analysis response");
  }
  assert.deepEqual(structured.payload.fileNames, [
    "PitchDeck.pdf",
  ]);
  assert.equal(
    structured.payload.findings.find(
      (finding) => finding.id === "customer-proof",
    )?.status,
    "missing",
  );
});

test("evidence submission produces an explainable +7 readiness patch", async () => {
  const response = await createMockAiWorkspaceEngine({
    timing: "instant",
  }).respond(
    createInput("Nộp bằng chứng mới", "decision-cycle"),
  );

  assert.equal(
    requireStructured(response).type,
    "evidence-review",
  );
  assert.equal(response.proposedPatches.readiness?.currentScore, 61);
  assert.equal(response.proposedPatches.readiness?.delta, 7);
  assert.match(
    response.proposedPatches.readiness?.explanation ?? "",
    /không phải chỉ vì một file/i,
  );
});

test("mentor intervention is gated, then recommends Jessica after a cycle is active", async () => {
  const engine = createMockAiWorkspaceEngine({
    timing: "instant",
  });
  const notReady = await engine.respond(
    createInput("Đề xuất cố vấn phù hợp"),
  );
  const notReadyStructured = requireStructured(notReady);
  assert.equal(notReady.responseKind, "conversation");
  assert.equal(notReadyStructured.type, "mentor-recommendation");
  if (notReadyStructured.type === "mentor-recommendation") {
    assert.equal(notReadyStructured.payload, null);
  }

  const readyInput = createInput(
    "Đề xuất cố vấn phù hợp",
    "onboarding-case-study",
  );
  readyInput.currentState.decisionCycleLifecycle = "active";
  const ready = await engine.respond(readyInput);
  const readyStructured = requireStructured(ready);

  assert.equal(ready.responseKind, "mentor_intervention");
  assert.equal(readyStructured.type, "mentor-recommendation");
  if (readyStructured.type !== "mentor-recommendation") {
    assert.fail("Expected mentor response");
  }
  assert.equal(readyStructured.payload?.name, "Jessica Lin");
  assert.match(ready.assistantMessage, /kinh nghiệm product thực tế/i);
  assert.equal(
    ready.suggestedPrompts.includes("Tiếp tục với AI"),
    false,
  );
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
  const structured = requireStructured(response);

  assert.equal(response.responseKind, "conversation");
  assert.equal(structured.type, "mentor-recommendation");
  if (structured.type === "mentor-recommendation") {
    assert.equal(structured.payload, null);
  }
  assert.match(response.assistantMessage, /không lặp lại/i);
});

test("reviewing submitted evidence completes the cycle and unlocks one mentor", async () => {
  const input = createInput(
    "Review kết quả hiện tại",
    "decision-cycle",
  );
  input.currentState.decisionCycle.evidenceSubmitted = true;

  const response = await createMockAiWorkspaceEngine({
    timing: "instant",
  }).respond(input);

  assert.equal(
    response.proposedPatches.decisionCycle?.reviewCompleted,
    true,
  );
  assert.equal(
    response.proposedPatches.mentorRecommendation?.name,
    "Jessica Lin",
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
  assert.equal(requireStructured(retry).type, "current-focus");
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

  const response = await createMockAiWorkspaceEngine({
    timing: "instant",
  }).respond(input);
  const structured = requireStructured(response);

  assert.match(response.assistantMessage, /founder/i);
  assert.equal(structured.type, "current-focus");
  if (structured.type === "current-focus") {
    assert.equal(structured.payload.sourceStatus, "verified");
  }
});
