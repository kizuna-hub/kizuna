import assert from "node:assert/strict";
import test from "node:test";

import { mentorConnectionRequests } from "../data/mentor-connection-mock-data";
import { filterMentorConnections } from "../model/mentor-connection-selectors";
import {
  getMentorConnectionDashboard,
  getMentorConnectionRequest,
} from "../repository/mentor-connection-repository";

test("mentor connection repository exposes unique operational request ids", () => {
  const dashboard = getMentorConnectionDashboard();

  assert.equal(dashboard.requests.length, 8);
  assert.equal(
    new Set(dashboard.requests.map((request) => request.id)).size,
    dashboard.requests.length,
  );
  assert.equal(dashboard.funnel.at(-1)?.count, dashboard.metrics.accepted);
  assert.notStrictEqual(dashboard.requests, mentorConnectionRequests);
});

test("mentor connection filters isolate overdue operational requests", () => {
  const result = filterMentorConnections(mentorConnectionRequests, {
    query: "",
    status: "all",
    expertise: "all",
    venture: "all",
    waitingTime: "over-72",
  });

  assert.deepEqual(
    result.map((request) => request.id),
    [
      "connection-agriconnect-tung",
      "connection-eduai-minh-anh",
      "connection-saferide-hoang-nam",
    ],
  );
});

test("mentor connection detail lookup does not fall through to another domain", () => {
  assert.equal(
    getMentorConnectionRequest("connection-eduai-minh-anh")
      ?.ventureName,
    "EduAI",
  );
  assert.equal(getMentorConnectionRequest("nguyen-thanh-tung"), null);
});
