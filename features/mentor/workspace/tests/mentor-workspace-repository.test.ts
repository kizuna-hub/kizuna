import assert from "node:assert/strict";
import test from "node:test";

import type { WorkspaceStorage } from "../../../venture/core/infrastructure";
import {
  createMockMentorWorkspaceRepository,
  DuplicateMentorAcceptanceError,
  validateMentorContact,
} from "../services/mentor-workspace-repository";

function createMemoryStorage(): WorkspaceStorage {
  let value: string | null = null;
  return {
    load: () => value,
    save: (serialized) => {
      value = serialized;
    },
    clear: () => {
      value = null;
    },
  };
}

test("mentor inbox reuses the canonical CampusFlow founder brief", async () => {
  const repository = createMockMentorWorkspaceRepository({
    latencyMs: 0,
    mutationLatencyMs: 0,
  });
  const campusFlow = await repository.getRequest(
    "request-campusflow",
  );

  assert.equal(campusFlow?.venture.name, "CampusFlow");
  assert.equal(campusFlow?.founder.name, "Nguyễn Tuấn Ngọc");
  assert.equal(campusFlow?.brief.founderConfirmed, true);
  assert.equal(campusFlow?.evidence.length, 4);
  assert.deepEqual(
    campusFlow?.sharedDocuments[0]?.selectedPageLabels,
    ["Trang 6", "Trang 8", "Trang 11"],
  );
});

test("filters and sorting update the deterministic request list", async () => {
  const repository = createMockMentorWorkspaceRepository({
    latencyMs: 0,
  });
  const newRequests = await repository.listRequests({
    filter: "new",
    sort: "best_fit",
  });
  const accepted = await repository.listAcceptedConnections();

  assert.deepEqual(
    newRequests.map((request) => request.id),
    ["request-campusflow", "request-studymate"],
  );
  assert.equal(accepted.length, 1);
  assert.equal(accepted[0].id, "request-launchpad");
});

test("acceptance creates one record and persists the contact preference", async () => {
  const storage = createMemoryStorage();
  const repository = createMockMentorWorkspaceRepository({
    storage,
    latencyMs: 0,
    mutationLatencyMs: 0,
  });
  const input = {
    requestId: "request-campusflow",
    mentorId: "mentor-tran-minh-quan",
    message:
      "Anh đã xem brief của CampusFlow và đồng ý hỗ trợ.",
    contactMethod: "zalo" as const,
    contactValue: "0901234567",
    meetingPreference: "coordinate_later" as const,
    saveAsDefault: true,
  };
  const [first, second] = await Promise.all([
    repository.acceptRequest(input),
    repository.acceptRequest(input),
  ]);

  assert.equal(first.acceptance?.id, second.acceptance?.id);
  assert.equal(first.status, "accepted");
  assert.equal(
    (await repository.getContactPreference())?.contactValue,
    "0901234567",
  );
  await assert.rejects(
    () => repository.acceptRequest(input),
    DuplicateMentorAcceptanceError,
  );

  const restored = createMockMentorWorkspaceRepository({
    storage,
    latencyMs: 0,
    mutationLatencyMs: 0,
  });
  assert.equal(
    (await restored.getRequest("request-campusflow"))?.status,
    "accepted",
  );
});

test("more-context and decline preserve processed requests", async () => {
  const repository = createMockMentorWorkspaceRepository({
    latencyMs: 0,
    mutationLatencyMs: 0,
  });
  const needsContext = await repository.requestMoreContext({
    requestId: "request-studymate",
    selectedTopics: ["current_challenge", "evidence"],
    note: "Bổ sung primary question.",
  });
  const declined = await repository.declineRequest({
    requestId: "request-ecotrack",
    reason: "no_time",
  });

  assert.equal(needsContext.status, "needs_more_context");
  assert.equal(needsContext.moreContext?.selectedTopics.length, 2);
  assert.equal(declined.status, "declined");
  assert.equal(
    (await repository.getRequest("request-ecotrack"))?.id,
    "request-ecotrack",
  );
});

test("contact validation enforces channel requirements", () => {
  assert.equal(validateMentorContact("email", "bad").valid, false);
  assert.equal(
    validateMentorContact("phone", "0901234567").valid,
    true,
  );
  assert.equal(
    validateMentorContact("mentor_will_contact").valid,
    true,
  );
});
