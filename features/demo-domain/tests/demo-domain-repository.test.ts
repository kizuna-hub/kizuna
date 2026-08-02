import assert from "node:assert/strict";
import test from "node:test";

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

function fixture() {
  const venture: DemoDomainVenture = {
    id: "venture-campusflow",
    ownerId: "founder-nguyen-tuan-ngoc",
    name: "CampusFlow",
    stage: "prototype",
    teamSummary: "3 student founders",
    productSummary: "Student club onboarding platform",
    tags: ["EdTech"],
    documentIds: ["deck"],
    evidenceIds: ["interviews"],
    readiness: {
      overallScore: 65,
      strongestDimension: {
        id: "problem",
        label: "Problem",
        score: 78,
      },
      biggestGap: {
        id: "market",
        label: "Market",
        score: 45,
      },
    },
    canonicalQuestionIds: [],
    updatedAt: "2026-07-30T00:00:00.000Z",
  };
  const brief: ConnectionBriefSnapshot = {
    id: "brief-campusflow",
    version: 1,
    capturedAt: "2026-07-30T03:10:00.000Z",
    founder: {
      id: "founder-nguyen-tuan-ngoc",
      name: "Nguyễn Tuấn Ngọc",
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
    currentChallenge: "Chốt pilot 14 ngày",
    supportNeeded: ["Pilot scope"],
    expectedOutcome: "Kế hoạch pilot rõ ràng",
    evidence: [],
    sharedDocuments: [],
  };
  return { venture, brief };
}

test("one canonical request persists, snapshots, and accepts once", () => {
  const storage = createStorage();
  const founderRepository =
    createBrowserDemoDomainRepository({ storage });
  const { venture, brief } = fixture();
  founderRepository.bootstrapCampusFlow(venture, [], []);
  const sent = founderRepository.createConnectionRequest(brief);

  brief.currentChallenge = "mutated after send";
  assert.equal(sent.id, "request-campusflow");
  assert.equal(
    founderRepository
      .getSnapshot()
      .connectionRequests[0].briefSnapshot.currentChallenge,
    "Chốt pilot 14 ngày",
  );
  assert.throws(
    () => founderRepository.createConnectionRequest(brief),
    /đã được gửi/i,
  );

  const mentorRepository =
    createBrowserDemoDomainRepository({ storage });
  const accepted = mentorRepository.acceptRequest(sent.id, {
    message:
      "Anh đã xem brief của CampusFlow. Em liên hệ với anh qua Zalo nhé.",
    contactMethod: "zalo",
    contactValue: "0901234567",
    meetingPreference: "coordinate_later",
  });
  const duplicate = mentorRepository.acceptRequest(sent.id, {
    message: "ignored",
    contactMethod: "zalo",
    contactValue: "000000000",
    meetingPreference: "coordinate_later",
  });

  assert.equal(accepted.status, "accepted");
  assert.equal(accepted.acceptance?.contactValue, "0901234567");
  assert.equal(duplicate.acceptance?.id, accepted.acceptance?.id);
  assert.equal(
    founderRepository
      .getSnapshot()
      .connectionRequests[0].status,
    "accepted",
  );
  assert.ok(
    founderRepository.getSnapshot().revision >= 3,
  );
  founderRepository.destroy();
  mentorRepository.destroy();
});

test("separate repository instances receive cross-tab revisions", async () => {
  const storage = createStorage();
  const founder = createBrowserDemoDomainRepository({
    storage,
    enableCrossContextSync: true,
  });
  const mentor = createBrowserDemoDomainRepository({
    storage,
    enableCrossContextSync: true,
  });
  const { venture } = fixture();
  const update = new Promise<number>((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error("cross-tab update timed out")),
      1_000,
    );
    mentor.subscribe((state) => {
      if (state.ventures.some((item) => item.id === venture.id)) {
        clearTimeout(timeout);
        resolve(state.revision);
      }
    });
  });

  founder.bootstrapCampusFlow(venture, [], []);
  assert.ok((await update) >= 1);
  founder.destroy();
  mentor.destroy();
});
