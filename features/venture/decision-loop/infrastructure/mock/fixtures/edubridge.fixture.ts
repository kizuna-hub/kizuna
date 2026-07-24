import type {
  VentureBaseline,
  VentureSource,
} from "../../../domain";
import { baselineField } from "./fixture-builders";
import type { DecisionLoopScenarioTemplate } from "../../../application/model/scenario-template";

export const eduBridgeSources: VentureSource[] = [
  {
    id: "source-edubridge-founder-context",
    ventureId: "venture-edubridge",
    title: "EduBridge founder context",
    kind: "founder-note",
    origin: "founder-authored",
    authorName: "Nguyen Tuan Ngoc",
    summary:
      "Frames graduate transition support as the core problem and buyer selection as the current goal.",
    createdAt: "2026-07-14T03:00:00.000Z",
    importedAt: "2026-07-20T03:00:00.000Z",
    freshness: "current",
    reviewStatus: "confirmed",
    visibility: "team",
    aiContribution: "none",
    tags: ["problem", "goal"],
  },
  {
    id: "source-edubridge-university-advice",
    ventureId: "venture-edubridge",
    title: "University-first advisor note",
    kind: "mentor-note",
    origin: "mentor-feedback",
    authorName: "Linh Pham",
    summary:
      "Recommends validating university career centers as the institutional buyer.",
    createdAt: "2026-07-21T04:00:00.000Z",
    importedAt: "2026-07-21T04:10:00.000Z",
    freshness: "current",
    reviewStatus: "confirmed",
    visibility: "team",
    aiContribution: "none",
    tags: ["buyer", "advice"],
  },
  {
    id: "source-edubridge-founder-direct-advice",
    ventureId: "venture-edubridge",
    title: "Founder-direct advisor note",
    kind: "mentor-note",
    origin: "mentor-feedback",
    authorName: "Daniel Ho",
    summary:
      "Recommends direct founder monetization to shorten the learning loop.",
    createdAt: "2026-07-21T07:30:00.000Z",
    importedAt: "2026-07-21T07:40:00.000Z",
    freshness: "current",
    reviewStatus: "confirmed",
    visibility: "team",
    aiContribution: "none",
    tags: ["buyer", "advice", "contradiction"],
  },
];

export const eduBridgeBaseline: VentureBaseline = {
    id: "baseline-edubridge",
    ventureId: "venture-edubridge",
    version: "1",
    problem: baselineField(
      "Graduates struggle to navigate credible first-job pathways.",
      ["source-edubridge-founder-context"],
      { confidence: "moderate", status: "confirmed", confirmed: true },
    ),
    customer: baselineField(
      "Graduates and student founders entering their first career transition.",
      ["source-edubridge-founder-context"],
      { confidence: "moderate", status: "confirmed", confirmed: true },
    ),
    buyer: baselineField(
      "Either university career programs or individual founders; current advice conflicts.",
      [
        "source-edubridge-university-advice",
        "source-edubridge-founder-direct-advice",
      ],
      { confidence: "developing", status: "conflicting" },
    ),
    solution: baselineField(
      "A guided transition platform connecting graduates with first-job pathways.",
      ["source-edubridge-founder-context"],
      { confidence: "moderate", status: "confirmed", confirmed: true },
    ),
    stage: baselineField(
      "Prototype / MVP",
      ["source-edubridge-founder-context"],
      { confidence: "strong", status: "confirmed", confirmed: true },
    ),
    businessModel: baselineField(
      "Institutional or founder-direct pricing remains undecided.",
      [
        "source-edubridge-university-advice",
        "source-edubridge-founder-direct-advice",
      ],
      { confidence: "low", status: "conflicting" },
    ),
    evidenceSummary: baselineField(
      "Two expert opinions exist; neither substitutes for buyer interviews.",
      [
        "source-edubridge-university-advice",
        "source-edubridge-founder-direct-advice",
      ],
      { confidence: "developing", status: "needs-review" },
    ),
    currentGoal: baselineField(
      "Choose which buyer segment should be validated first.",
      ["source-edubridge-founder-context"],
      { confidence: "strong", status: "confirmed", confirmed: true },
    ),
    supportSummary: baselineField(
      "Two active advisors provide conflicting recommendations.",
      [
        "source-edubridge-university-advice",
        "source-edubridge-founder-direct-advice",
      ],
      { confidence: "strong", status: "confirmed", confirmed: true },
    ),
    programSummary: baselineField("", [], {
      confidence: "low",
      status: "missing",
    }),
    openAssumptions: baselineField(
      "Institutions own budget, or founders will pay directly; neither path is validated.",
      [
        "source-edubridge-university-advice",
        "source-edubridge-founder-direct-advice",
      ],
      { confidence: "developing", status: "conflicting" },
    ),
    confirmedAt: "2026-07-22T09:10:00.000Z",
    updatedAt: "2026-07-22T09:10:00.000Z",
    acknowledgedIncomplete: true,
    status: "confirmed",
  };

export const eduBridgeScenario: DecisionLoopScenarioTemplate = {
    criticalPattern:
      "Conflicting advisor recommendations encode different buyer assumptions, not different levels of authority.",
    challenges: [
      {
        key: "problem-context",
        type: "founder-claim",
        title: "Graduates need guided first-job pathways.",
        explanation:
          "The founder context states the problem, but no linked customer interviews verify its priority.",
        sourceIds: ["source-edubridge-founder-context"],
        impact: "high",
        uncertainty: "medium",
        urgency: "medium",
        controllability: "high",
        confidence: "developing",
      },
      {
        key: "university-buyer",
        type: "assumption",
        title: "Universities own budget for the transition problem.",
        explanation:
          "The university-first recommendation assumes institutional pain and purchasing authority.",
        sourceIds: ["source-edubridge-university-advice"],
        impact: "high",
        uncertainty: "high",
        urgency: "high",
        controllability: "high",
        confidence: "developing",
      },
      {
        key: "founder-pays",
        type: "assumption",
        title: "Founders will pay directly for shorter learning loops.",
        explanation:
          "The founder-direct recommendation assumes individual willingness to pay and reachable distribution.",
        sourceIds: ["source-edubridge-founder-direct-advice"],
        impact: "high",
        uncertainty: "high",
        urgency: "high",
        controllability: "high",
        confidence: "developing",
      },
      {
        key: "advisor-conflict",
        type: "contradiction",
        title: "Two advisors recommend different first buyers.",
        explanation:
          "Neither recommendation includes direct buyer evidence, so authority cannot resolve the conflict.",
        sourceIds: [
          "source-edubridge-university-advice",
          "source-edubridge-founder-direct-advice",
        ],
        relatedKeys: ["university-buyer", "founder-pays"],
        impact: "high",
        uncertainty: "high",
        urgency: "high",
        controllability: "high",
        confidence: "strong",
      },
      {
        key: "willingness-to-pay",
        type: "unknown",
        title: "Willingness to pay is unknown for both segments.",
        explanation:
          "No customer source compares problem priority, budget, or purchase intent.",
        sourceIds: [],
        impact: "high",
        uncertainty: "high",
        urgency: "high",
        controllability: "high",
        confidence: "strong",
      },
    ],
    decisions: [
      {
        id: "decision-edubridge-buyer",
        title: "Which buyer segment should be validated first?",
        whyItMatters:
          "Conflicting advice is splitting the team between university sales and founder-direct monetization.",
        whyNow:
          "A shared evidence rule is needed before product and go-to-market work diverge further.",
        unlocks: ["Beachhead validation plan", "Go-to-market focus"],
        supportingKeys: ["problem-context"],
        contradictingKeys: ["advisor-conflict"],
        unknownKeys: ["willingness-to-pay"],
        deferredKeys: [],
        confidence: "moderate",
        isRecommended: true,
        recommendationRank: 1,
        alternativeHypotheses: [
          {
            id: "hypothesis-edubridge-university",
            title: "University-first",
            summary:
              "Institutions experience the strongest pain and can fund the workflow.",
            assumptions: [
              "Institutions own budget.",
              "Procurement delay is acceptable.",
              "Program operators experience the strongest pain.",
            ],
            tradeOffs: [
              "Higher contract potential",
              "Longer sales cycle",
            ],
          },
          {
            id: "hypothesis-edubridge-founder",
            title: "Founder-direct",
            summary:
              "Individuals will pay directly and can be reached efficiently.",
            assumptions: [
              "Individual willingness to pay exists.",
              "Distribution reaches founders efficiently.",
            ],
            tradeOffs: [
              "Faster learning",
              "Lower revenue per customer",
            ],
          },
        ],
        decisionChangingEvidence: [
          "One segment shows materially stronger problem priority and willingness to pay under the same interview standard.",
        ],
      },
      {
        id: "decision-edubridge-distribution",
        title: "Which channel can reach the first learning cohort?",
        whyItMatters: "Distribution affects interview access.",
        whyNow:
          "The channel should follow the selected buyer segment.",
        unlocks: ["Recruitment plan"],
        supportingKeys: [],
        contradictingKeys: ["advisor-conflict"],
        unknownKeys: ["willingness-to-pay"],
        deferredKeys: ["university-buyer", "founder-pays"],
        confidence: "low",
        isRecommended: false,
        recommendationRank: 2,
        alternativeHypotheses: [],
        decisionChangingEvidence: [
          "A channel recruits qualified participants at a repeatable cost.",
        ],
      },
    ],
    experiment: {
      decisionId: "decision-edubridge-buyer",
      title: "Parallel buyer-segment interviews",
      hypothesis:
        "One segment will show materially stronger problem priority and willingness to pay under the same interview standard.",
      method:
        "Run parallel problem and willingness-to-pay interviews with three university operators and three founders.",
      expectedSignal:
        "One segment produces at least two consistent budget-backed purchase signals.",
      failureSignal:
        "Neither segment demonstrates sufficient problem priority or willingness to pay.",
      timeboxDays: 10,
      evidenceRequirements: [
        {
          id: "requirement-edubridge-comparison",
          label: "Comparable buyer interviews",
          description:
            "Record three interviews per segment using the same decision questions.",
          minimumCount: 6,
          acceptedSourceKinds: ["customer-interview"],
          requiredForExit: true,
        },
      ],
      exitCriteria: [
        "A first buyer segment is selected or both current paths are rejected.",
      ],
      stopConditions: [
        "Stop if interview participants cannot describe the problem as a current priority.",
      ],
      whatNotToDo: [
        "Do not choose an advisor based on title or seniority.",
        "Do not build separate products for both segments.",
      ],
      tasks: [
        {
          id: "task-edubridge-script",
          title: "Prepare one comparable interview script",
        },
        {
          id: "task-edubridge-university",
          title: "Interview three university operators",
          evidenceRequirementId:
            "requirement-edubridge-comparison",
        },
        {
          id: "task-edubridge-founders",
          title: "Interview three founders",
          evidenceRequirementId:
            "requirement-edubridge-comparison",
        },
      ],
    },
  };
