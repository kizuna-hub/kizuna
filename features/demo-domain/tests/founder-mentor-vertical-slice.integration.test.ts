import assert from "node:assert/strict";
import test from "node:test";

import {
  authenticateDemoUser,
  DEMO_PASSWORD,
} from "@/features/auth/services/demo-auth-repository";
import {
  createMockAiWorkspaceEngine,
  detectAiWorkspaceIntent,
  getCanonicalQuestionId,
} from "@/features/founder/ai-workspace/demo/mock-ai-engine";
import { createAiWorkspaceScenarioState } from "@/features/founder/ai-workspace/demo/demo-scenarios";
import { createSharedMentorWorkspaceRepository } from "@/features/mentor/workspace/services/shared-mentor-workspace-repository";

import { createBrowserDemoDomainRepository } from "../services/demo-domain-repository";
import type {
  ConnectionBriefSnapshot,
  DemoDomainVenture,
} from "../types/demo-domain.types";

function createStorage(): Storage {
  const values = new Map<string, string>();
  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => {
      values.delete(key);
    },
    setItem: (key, value) => {
      values.set(key, value);
    },
  };
}

test("canonical Founder to Mentor vertical slice survives reload", async (t) => {
  const founder = authenticateDemoUser({
    email: "founder@demo.kizuna.vn",
    password: DEMO_PASSWORD,
    role: "founder",
  });
  const storage = createStorage();
  const founderDomain =
    createBrowserDemoDomainRepository({ storage });
  t.after(() => founderDomain.destroy());
  const venture: DemoDomainVenture = {
    id: "venture-campusflow",
    ownerId: founder.id,
    name: "CampusFlow",
    stage: "prototype",
    teamSummary: "3 student founders",
    productSummary:
      "Nền tảng onboarding cho câu lạc bộ sinh viên.",
    tags: ["EdTech", "B2B", "SaaS"],
    documentIds: ["campusflow-deck", "campusflow-plan"],
    evidenceIds: ["interviews", "prototype", "pilot"],
    readiness: {
      overallScore: 65,
      strongestDimension: {
        id: "problem_and_user_understanding",
        label: "Hiểu vấn đề và người dùng",
        score: 78,
      },
      biggestGap: {
        id: "market_signal_and_commitment",
        label: "Tín hiệu thị trường và commitment",
        score: 45,
      },
    },
    canonicalQuestionIds: [],
    updatedAt: "2026-07-30T03:00:00.000Z",
  };
  founderDomain.bootstrapCampusFlow(venture, [], []);

  const engine = createMockAiWorkspaceEngine({
    timing: "instant",
  });
  const state = createAiWorkspaceScenarioState(
    venture.id,
    "materials",
  );
  const questions = [
    "Phân tích Pitch Deck và cách cải thiện",
    "Tôi nên làm gì tiếp theo?",
    "Đánh giá traction hiện tại",
    "Tìm mentor phù hợp",
    "Customer discovery đang ở đâu?",
    "Tín hiệu thị trường và commitment có đủ không?",
  ];
  const responses = [];
  for (const question of questions) {
    const intent = detectAiWorkspaceIntent(question);
    founderDomain.recordCanonicalQuestion(
      venture.id,
      getCanonicalQuestionId(question),
    );
    responses.push(
      await engine.respond({
        message: question,
        ventureId: venture.id,
        conversationHistory: state.messages,
        activeScenarioId: state.activeScenarioId,
        currentState: state,
        attachedMaterialIds: [],
        retryAttempt: 0,
      }),
    );
  }
  assert.equal(responses[0].responseKind, "artifact_preview");
  assert.equal(responses[3].responseKind, "mentor_recommendation_grid");
  assert.equal(
    founderDomain.getSnapshot().ventures[0]
      .canonicalQuestionIds.length,
    6,
  );

  const brief: ConnectionBriefSnapshot = {
    id: "brief-snapshot-campusflow",
    version: 1,
    capturedAt: "2026-07-30T03:10:00.000Z",
    founder: {
      id: founder.id,
      name: founder.name,
      institution: "Nhóm sinh viên đại học",
    },
    venture,
    mentor: {
      id: "mentor-tran-minh-quan",
      name: "Trần Minh Quân",
      role: "Product Lead",
      organization: "VNPay",
      fitScore: 92,
    },
    currentChallenge:
      "Chưa có phạm vi, lịch và success metric cho pilot.",
    supportNeeded: [
      "Chọn phạm vi pilot 14 ngày",
      "Chốt success metric và evidence",
    ],
    expectedOutcome:
      "Kế hoạch pilot đủ rõ để team triển khai ngay.",
    founderMessage:
      "Mong anh giúp team chốt pilot đầu tiên.",
    evidence: [],
    sharedDocuments: [],
  };
  const sent = founderDomain.createConnectionRequest(brief);
  assert.equal(sent.status, "pending");

  const mentor = authenticateDemoUser({
    email: "mentor@demo.kizuna.vn",
    password: DEMO_PASSWORD,
    role: "mentor",
  });
  const mentorDomain =
    createBrowserDemoDomainRepository({ storage });
  t.after(() => mentorDomain.destroy());
  const mentorWorkspace =
    createSharedMentorWorkspaceRepository({
      domain: mentorDomain,
    });
  const inbox = await mentorWorkspace.listRequests();
  assert.equal(inbox.length, 1);
  assert.equal(inbox[0].venture.name, "CampusFlow");

  const accepted = await mentorWorkspace.acceptRequest({
    requestId: sent.id,
    mentorId: mentor.id,
    message:
      "Anh đã xem brief của CampusFlow. Em liên hệ với anh qua Zalo để mình thống nhất lịch và trao đổi kỹ hơn nhé.",
    contactMethod: "zalo",
    contactValue: "0901234567",
    meetingPreference: "coordinate_later",
    saveAsDefault: true,
  });
  assert.equal(accepted.status, "accepted");

  const reloadedFounder =
    createBrowserDemoDomainRepository({ storage });
  t.after(() => reloadedFounder.destroy());
  const reflected =
    reloadedFounder.getSnapshot().connectionRequests[0];
  assert.equal(reflected.status, "accepted");
  assert.equal(
    reflected.acceptance?.contactValue,
    "0901234567",
  );
  assert.match(
    reflected.acceptance?.message ?? "",
    /CampusFlow/,
  );

});
