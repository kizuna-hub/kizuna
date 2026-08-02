import assert from "node:assert/strict";
import test from "node:test";

import { createLongRunDemoState } from "../../demo/demo-long-run-data";
import { createAiWorkspaceScenarioState } from "../../demo/demo-scenarios";
import {
  restoreAiSession,
  toPersistedSession,
} from "../../state/ai-workspace-persistence";
import { aiWorkspaceReducer } from "../../state/ai-workspace-reducer";
import { createWorkspaceLayoutState } from "../../state/workspace-layout-reducer";
import { createCampusFlowMentorRecommendation } from "../demo/campusflow-mentor-recommendations";
import { MockMentorRecommendationService } from "../services/mock-mentor-recommendation-service";
import {
  formatMentorPricing,
  selectMentorMatch,
  selectPrimaryMentor,
} from "../state/mentor-recommendation-selectors";
import type { AiWorkspaceState } from "../../types/ai-workspace.types";

test("canonical recommendation exposes three positive outcome paths", async () => {
  const service = new MockMentorRecommendationService();
  const payload = await service.recommend({
    ventureId: "venture-campusflow",
    ventureName: "CampusFlow",
    ventureStage: "Prototype",
    blocker: "Chưa có pilot trong workflow thật",
  });

  assert.equal(payload.mentors.length, 3);
  assert.equal(payload.primaryMentorId, "mentor-tran-minh-quan");
  assert.deepEqual(
    payload.mentors.map((mentor) => mentor.fit.score),
    [92, 84, 79],
  );
  assert.ok(
    payload.mentors.every(
      (mentor) =>
        mentor.profile.avatarSrc?.startsWith(
          "/images/mentors/",
        ) &&
        mentor.relevantExpertise.length <= 4 &&
        mentor.expectedOutcomes.length > 0,
    ),
  );
  assert.doesNotMatch(
    JSON.stringify(payload),
    /weakness|limitation|tradeOff|negativeComparison/i,
  );
});

test("primary selection and pricing labels come from the shared canonical payload", () => {
  const recommendation = createCampusFlowMentorRecommendation(
    "venture-campusflow",
    "cycle-campusflow-pilot",
    "focus-campusflow",
  );
  const primary = selectPrimaryMentor(recommendation);

  assert.equal(primary?.profile.name, "Trần Minh Quân");
  assert.equal(primary?.fit.isPrimary, true);
  assert.equal(
    formatMentorPricing(primary!.pricing),
    "Miễn phí cho sinh viên",
  );
  assert.equal(
    formatMentorPricing(
      recommendation.payload.mentors[1].pricing,
    ),
    "300.000đ / phiên",
  );
});

test("saved mentor state toggles and persists per venture and mentor", () => {
  const initial = createAiWorkspaceScenarioState(
    "venture-campusflow",
    "mentor",
  );
  const mentorId =
    initial.mentorRecommendation!.payload.mentors[1].mentorId;
  const saved = aiWorkspaceReducer(initial, {
    type: "toggle-save-mentor",
    mentorId,
  });
  const restored = restoreAiSession(
    "venture-campusflow",
    toPersistedSession(
      saved,
      createLongRunDemoState("venture-campusflow"),
      createWorkspaceLayoutState(),
    ),
  );

  assert.deepEqual(
    restored.mentorRecommendation?.savedMentorIds,
    [mentorId],
  );
  const unsaved = aiWorkspaceReducer(restored, {
    type: "toggle-save-mentor",
    mentorId,
  });
  assert.deepEqual(
    unsaved.mentorRecommendation?.savedMentorIds,
    [],
  );
});

test("legacy mentor state without a payload fails safe and restores canonical matches", () => {
  const initial = createAiWorkspaceScenarioState(
    "venture-campusflow",
    "mentor",
  );
  const legacyRecommendation = {
    id: "mentor-tran-minh-quan",
    status: "saved",
  } as unknown as AiWorkspaceState["mentorRecommendation"];
  const legacyState = {
    ...initial,
    mentorRecommendation: legacyRecommendation,
  };

  assert.equal(
    selectMentorMatch(legacyRecommendation),
    undefined,
  );
  assert.doesNotThrow(() =>
    aiWorkspaceReducer(legacyState, {
      type: "toggle-save-mentor",
      mentorId: "mentor-tran-minh-quan",
    }),
  );

  const restored = restoreAiSession(
    "venture-campusflow",
    toPersistedSession(
      legacyState,
      createLongRunDemoState("venture-campusflow"),
      createWorkspaceLayoutState(),
    ),
  );

  assert.equal(
    restored.mentorRecommendation?.payload.mentors.length,
    3,
  );
  assert.deepEqual(
    restored.mentorRecommendation?.savedMentorIds,
    ["mentor-tran-minh-quan"],
  );
});
