import type { VentureId } from "../../../core";
import type { VentureBaseline } from "../../domain";
import type { DecisionLoopScenarioTemplate } from "../model/scenario-template";
import type { VentureWorkspaceState } from "../model/venture-workspace-state";
import { getReviewedSourcesForVenture } from "../queries/source-and-baseline-queries";
import { getVenture } from "./workspace-state-utils";

export function createChallengeScenario(
  state: VentureWorkspaceState,
  ventureId: VentureId,
  baseline: VentureBaseline,
): DecisionLoopScenarioTemplate {
  const sourceIds = getReviewedSourcesForVenture(
    state,
    ventureId,
  ).map((source) => source.id);
  const venture = getVenture(state, ventureId);
  const decisionId =
    venture?.activeDecisionId ??
    `decision-${ventureId.replace(/^venture-/, "")}-critical`;

  return {
    criticalPattern:
      "The current direction contains an important assumption that has not been separated from evidence.",
    challenges: [
      {
        key: "current-claim",
        type: "founder-claim",
        title:
          baseline.currentGoal.value ||
          "The current venture direction is founder-provided context.",
        explanation:
          "Founder context is useful, but it remains a claim until linked evidence supports it.",
        sourceIds,
        impact: "high",
        uncertainty: "medium",
        urgency: "high",
        controllability: "high",
        confidence: "developing",
      },
      {
        key: "critical-assumption",
        type: "assumption",
        title:
          baseline.openAssumptions.value ||
          "The highest-leverage assumption has not been stated.",
        explanation:
          "The next action cycle should test one assumption that can change the current decision.",
        sourceIds: baseline.openAssumptions.sourceIds,
        impact: "high",
        uncertainty: "high",
        urgency: "high",
        controllability: "high",
        confidence: "low",
      },
      {
        key: "missing-proof",
        type: "unknown",
        title: "Decision-changing evidence is not yet defined.",
        explanation:
          "A useful cycle needs an observable signal and an explicit exit criterion.",
        sourceIds: [],
        impact: "high",
        uncertainty: "high",
        urgency: "medium",
        controllability: "high",
        confidence: "strong",
      },
    ],
    decisions: [
      {
        id: decisionId,
        title:
          baseline.currentGoal.value ||
          "Which uncertainty must be resolved before the next commitment?",
        whyItMatters:
          "The venture needs one decision that can be changed by a focused experiment.",
        whyNow:
          "The baseline is confirmed and the next execution commitment requires a clear decision.",
        unlocks: ["Focused action cycle"],
        supportingKeys: ["current-claim"],
        contradictingKeys: [],
        unknownKeys: ["missing-proof"],
        deferredKeys: ["critical-assumption"],
        confidence: "developing",
        isRecommended: true,
        recommendationRank: 1,
        alternativeHypotheses: [
          {
            id: `hypothesis-${ventureId}-current`,
            title: "Current direction",
            summary:
              baseline.openAssumptions.value ||
              "The current direction is correct.",
            assumptions: [
              baseline.openAssumptions.value ||
                "The current assumption is valid.",
            ],
            tradeOffs: ["Fast continuity", "Risk of confirmation bias"],
          },
        ],
        decisionChangingEvidence: [
          "A direct customer or operational signal clearly supports or weakens the current direction.",
        ],
      },
    ],
    experiment: {
      decisionId,
      title: "Critical assumption test",
      hypothesis:
        baseline.openAssumptions.value ||
        "The current critical assumption is true.",
      method:
        "Run a bounded customer or operational test that can weaken the hypothesis.",
      expectedSignal:
        "A repeated observable signal supports the hypothesis.",
      failureSignal:
        "The expected signal does not appear or participants contradict the hypothesis.",
      timeboxDays: 7,
      evidenceRequirements: [
        {
          id: `requirement-${ventureId}-critical-signal`,
          label: "Decision-changing signal",
          description:
            "Record the minimum source-backed signal needed to make the exit decision.",
          acceptedSourceKinds: [
            "customer-interview",
            "research",
            "document",
          ],
          requiredForExit: true,
        },
      ],
      exitCriteria: [
        "The decision is supported, rejected, or narrowed using the required signal.",
      ],
      stopConditions: [
        "Stop if the method cannot produce decision-changing evidence.",
      ],
      whatNotToDo: [
        "Do not expand the cycle into unrelated product work.",
      ],
      tasks: [
        {
          id: `task-${ventureId}-prepare`,
          title: "Prepare the decision test",
        },
        {
          id: `task-${ventureId}-run`,
          title: "Run and record the test",
          evidenceRequirementId: `requirement-${ventureId}-critical-signal`,
        },
      ],
    },
  };
}
