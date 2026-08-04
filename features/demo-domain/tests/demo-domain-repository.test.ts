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

test("accepted connection seeds one mentorship journey and preserves it across reload", () => {
  const storage = createStorage();
  const repository = createBrowserDemoDomainRepository({ storage });
  const { venture, brief } = fixture();
  repository.bootstrapCampusFlow(venture, [], []);
  const request = repository.createConnectionRequest(brief);
  repository.acceptRequest(request.id, {
    message: "Anh đã xem brief của CampusFlow.",
    contactMethod: "zalo",
    contactValue: "0901234567",
    meetingPreference: "coordinate_later",
  });

  assert.equal(repository.getSnapshot().version, 2);
  assert.equal(repository.getSnapshot().mentorshipJourneys.length, 1);
  assert.equal(
    repository.listMentorshipCheckpoints(venture.id).length,
    3,
  );
  repository.acceptRequest(request.id, {
    message: "ignored",
    contactMethod: "email",
    contactValue: "ignored@example.com",
    meetingPreference: "google_meet",
  });
  assert.equal(repository.getSnapshot().mentorshipJourneys.length, 1);
  assert.equal(
    repository.listMentorshipCheckpoints(venture.id).length,
    3,
  );
  repository.destroy();

  const reloaded = createBrowserDemoDomainRepository({ storage });
  assert.equal(reloaded.getMentorshipJourney(venture.id)?.mentorId, "mentor-tran-minh-quan");
  assert.equal(reloaded.listMentorshipCheckpoints(venture.id).length, 3);
  reloaded.destroy();
});

test("checkpoint, evidence, edited pre-read, and immutable sent snapshot share one repository", () => {
  const storage = createStorage();
  const repository = createBrowserDemoDomainRepository({ storage });
  const { venture, brief } = fixture();
  repository.bootstrapCampusFlow(venture, [], []);
  const request = repository.createConnectionRequest(brief);
  repository.acceptRequest(request.id, {
    message: "Anh đã xem brief của CampusFlow.",
    contactMethod: "zalo",
    contactValue: "0901234567",
    meetingPreference: "coordinate_later",
  });

  const input = {
    ventureId: venture.id,
    decision: "Chưa phát triển thêm dashboard.",
    founderCommitment: "Phỏng vấn đại diện tại ba trường.",
    nextReviewQuestion: "Stakeholder map đã đủ chưa?",
    idempotencyKey: "demo-live-loop",
  };
  const created = repository.createMentorshipCheckpoint(input);
  const duplicate = repository.createMentorshipCheckpoint(input);
  assert.equal(duplicate.id, created.id);
  assert.equal(
    repository
      .listMentorshipCheckpoints(venture.id)
      .filter((item) => item.id === created.id).length,
    1,
  );

  const result = repository.updateMentorshipCheckpointResult({
    checkpointId: created.id,
    executionStatus: "result_ready",
    resultSummary: "Đã ghi nhận bốn luồng mua.",
    changedAssumption: "Phòng đào tạo khởi đầu nhu cầu.",
    blockerSummary: "Chưa tiếp cận bộ phận tài chính.",
    evidence: [
      {
        id: "evidence-a",
        filename: "Interview notes – Trường A.docx",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        sizeBytes: 184_320,
        source: "founder_submitted",
      },
      {
        id: "evidence-map",
        filename: "Stakeholder map v1.1.pdf",
        mimeType: "application/pdf",
        sizeBytes: 426_000,
        source: "founder_submitted",
      },
      {
        id: "evidence-email",
        filename: "Email follow-up – Trường B.eml",
        mimeType: "message/rfc822",
        sizeBytes: 82_000,
        source: "founder_submitted",
      },
    ],
  });
  assert.equal(result.evidenceIds.length, 3);
  assert.equal(repository.getMentorshipEvidence(created.id).length, 3);

  const edited = repository.createOrUpdateMentorshipPreRead({
    checkpointId: created.id,
    previousDecision: created.decision,
    founderCommitment: created.founderCommitment,
    resultSummary: "Founder đã chỉnh nội dung kết quả.",
    newInsight: result.changedAssumption ?? "",
    incompleteSummary: result.blockerSummary ?? "",
    mentorReviewQuestion: created.nextReviewQuestion,
    evidenceIds: [...result.evidenceIds],
  });
  const sent = repository.sendMentorshipPreRead(edited.id);
  const duplicateSend = repository.sendMentorshipPreRead(edited.id);
  assert.equal(duplicateSend.sentAt, sent.sentAt);
  assert.equal(
    sent.sentSnapshot?.resultSummary,
    "Founder đã chỉnh nội dung kết quả.",
  );

  repository.updateMentorshipCheckpointResult({
    checkpointId: created.id,
    executionStatus: "commitment_changed",
    resultSummary: "Kết quả thay đổi sau khi gửi.",
    changedAssumption: "Giả định mới.",
  });
  assert.equal(
    repository.getMentorshipPreRead(created.id)?.sentSnapshot
      ?.resultSummary,
    "Founder đã chỉnh nội dung kết quả.",
  );
  repository.destroy();
});

test("version one state migrates without losing accepted request data", () => {
  const storage = createStorage();
  const repository = createBrowserDemoDomainRepository({ storage });
  const { venture, brief } = fixture();
  repository.bootstrapCampusFlow(venture, [], []);
  const request = repository.createConnectionRequest(brief);
  repository.acceptRequest(request.id, {
    message: "Accepted",
    contactMethod: "zalo",
    contactValue: "0901234567",
    meetingPreference: "coordinate_later",
  });
  const current = repository.getSnapshot();
  repository.destroy();
  const legacy = { ...current } as Record<string, unknown>;
  legacy.version = 1;
  delete legacy.mentorshipJourneys;
  delete legacy.mentorshipCheckpoints;
  delete legacy.mentorshipEvidence;
  delete legacy.mentorshipPreReads;
  storage.setItem("kizuna:demo-domain:v1", JSON.stringify(legacy));

  const migrated = createBrowserDemoDomainRepository({ storage });
  const snapshot = migrated.getSnapshot();
  assert.equal(snapshot.version, 2);
  assert.equal(snapshot.connectionRequests[0].status, "accepted");
  assert.equal(snapshot.connectionRequests[0].acceptance?.contactValue, "0901234567");
  assert.equal(snapshot.mentorshipJourneys.length, 1);
  assert.equal(snapshot.mentorshipCheckpoints.length, 3);
  migrated.destroy();
});
