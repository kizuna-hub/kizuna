import assert from "node:assert/strict";
import test from "node:test";

import {
  getMockDocumentOutcomes,
  needsStageConfirmation,
  validateStartupDocument,
} from "../services/document-validation";

const pitchFile = {
  name: "CampusFlow-PitchDeck-v2.pdf",
  size: 2_840_000,
  type: "application/pdf",
};

test("one supported document is valid", () => {
  const result = validateStartupDocument(
    pitchFile,
    "pitch_deck",
    [],
  );
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.document.extension, "pdf");
    assert.equal(result.document.role, "pitch_deck");
  }
});

test("two different document roles are valid", () => {
  const pitch = validateStartupDocument(
    pitchFile,
    "pitch_deck",
    [],
  );
  assert.equal(pitch.ok, true);
  if (!pitch.ok) return;
  const plan = validateStartupDocument(
    {
      name: "CampusFlow-BusinessPlan-v1.docx",
      size: 1_486_000,
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
    "business_plan",
    [pitch.document],
  );
  assert.equal(plan.ok, true);
});

test("duplicate selection across roles is rejected", () => {
  const pitch = validateStartupDocument(
    pitchFile,
    "pitch_deck",
    [],
  );
  assert.equal(pitch.ok, true);
  if (!pitch.ok) return;
  const duplicate = validateStartupDocument(
    pitchFile,
    "business_plan",
    [pitch.document],
  );
  assert.equal(duplicate.ok, false);
  if (!duplicate.ok) {
    assert.match(duplicate.message, /đã được chọn/i);
  }
});

test("unsupported document format is rejected", () => {
  const result = validateStartupDocument(
    {
      name: "campusflow-notes.txt",
      size: 512,
      type: "text/plain",
    },
    "pitch_deck",
    [],
  );
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.message, /PDF, PPTX hoặc DOCX/);
  }
});

test("partial-file and uncertain-stage demo states are deterministic", () => {
  const pitch = validateStartupDocument(
    pitchFile,
    "pitch_deck",
    [],
  );
  const plan = validateStartupDocument(
    {
      name: "CampusFlow-BusinessPlan-corrupt.pdf",
      size: 1_000,
      type: "application/pdf",
    },
    "business_plan",
    [],
  );
  assert.equal(pitch.ok, true);
  assert.equal(plan.ok, true);
  if (!pitch.ok || !plan.ok) return;
  const outcomes = getMockDocumentOutcomes([
    pitch.document,
    plan.document,
  ]);
  assert.equal(outcomes[0]?.status, "ready");
  assert.equal(outcomes[1]?.status, "failed");

  assert.equal(
    needsStageConfirmation([
      {
        ...pitch.document,
        name: "CampusFlow-unknown-stage.pdf",
      },
    ]),
    true,
  );
});
