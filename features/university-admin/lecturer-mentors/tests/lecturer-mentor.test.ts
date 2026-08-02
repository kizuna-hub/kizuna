import assert from "node:assert/strict";
import test from "node:test";

import { universityLecturerMentors } from "../data/lecturer-mentor-mock-data";
import { filterUniversityLecturerMentors } from "../model/lecturer-mentor-selectors";
import {
  getLecturerMentorDirectoryDashboard,
  getUniversityLecturerMentor,
} from "../repository/lecturer-mentor-repository";

test("lecturer mentor repository exposes unique directory ids and capacity data", () => {
  const dashboard = getLecturerMentorDirectoryDashboard();

  assert.equal(dashboard.mentors.length, 8);
  assert.equal(
    new Set(dashboard.mentors.map((mentor) => mentor.id)).size,
    dashboard.mentors.length,
  );
  assert.ok(
    dashboard.mentors.every(
      (mentor) =>
        mentor.activeRequestCount >= 0 &&
        mentor.acceptanceRate >= 0 &&
        mentor.acceptanceRate <= 100,
    ),
  );
  assert.notStrictEqual(dashboard.mentors, universityLecturerMentors);
});

test("lecturer mentor filters search directory fields independently", () => {
  const result = filterUniversityLecturerMentors(
    universityLecturerMentors,
    {
      query: "dữ liệu",
      faculty: "Khoa CNTT",
      expertise: "all",
      availability: "all",
      status: "Đang hoạt động",
    },
  );

  assert.deepEqual(
    result.map((mentor) => mentor.id),
    ["nguyen-thanh-tung"],
  );
});

test("lecturer mentor detail lookup does not accept connection request ids", () => {
  assert.equal(
    getUniversityLecturerMentor("nguyen-thanh-tung")?.faculty,
    "Khoa CNTT",
  );
  assert.equal(
    getUniversityLecturerMentor("connection-agriconnect-tung"),
    null,
  );
});
