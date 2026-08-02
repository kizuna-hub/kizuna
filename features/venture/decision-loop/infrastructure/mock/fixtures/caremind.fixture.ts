import type {
  VentureBaseline,
  VentureSource,
} from "../../../domain";
import { baselineField } from "./fixture-builders";
import type { DecisionLoopScenarioTemplate } from "../../../application/model/scenario-template";

export const careMindSources: VentureSource[] = [
  {
    id: "source-caremind-end-user-interviews",
    ventureId: "venture-caremind",
    title: "End-user interview synthesis",
    kind: "customer-interview",
    origin: "customer-evidence",
    authorName: "Nguyen Tuan Ngoc",
    summary:
      "Eight care recipients described coordination friction; no family or support provider participated.",
    createdAt: "2026-07-19T08:00:00.000Z",
    importedAt: "2026-07-20T08:00:00.000Z",
    freshness: "current",
    reviewStatus: "confirmed",
    visibility: "review-ready",
    aiContribution: "assisted",
    tags: ["customer", "evidence", "scope"],
  },
  {
    id: "source-caremind-concept",
    ventureId: "venture-caremind",
    title: "Family communication concept note",
    kind: "document",
    origin: "team-authored",
    summary:
      "Describes family communication as a proposed core workflow and raises consent questions.",
    createdAt: "2026-07-10T08:00:00.000Z",
    importedAt: "2026-07-20T08:10:00.000Z",
    freshness: "current",
    reviewStatus: "confirmed",
    visibility: "team",
    aiContribution: "none",
    tags: ["solution", "assumption", "family"],
  },
];

export const careMindBaseline: VentureBaseline = {
    id: "baseline-caremind",
    ventureId: "venture-caremind",
    version: "1",
    problem: baselineField(
      "Care recipients experience coordination friction across their support network.",
      ["source-caremind-end-user-interviews"],
      { confidence: "moderate", status: "confirmed", confirmed: true },
    ),
    customer: baselineField(
      "Care recipients; family members and support providers remain unvalidated participants.",
      ["source-caremind-end-user-interviews"],
      { confidence: "developing", status: "needs-review" },
    ),
    buyer: baselineField("", [], { confidence: "low", status: "missing" }),
    solution: baselineField(
      "A care coordination workspace with a proposed family communication workflow.",
      ["source-caremind-concept"],
      { confidence: "developing", status: "needs-review" },
    ),
    stage: baselineField(
      "Prototype",
      ["source-caremind-concept"],
      { confidence: "strong", status: "confirmed", confirmed: true },
    ),
    businessModel: baselineField("", [], {
      confidence: "low",
      status: "missing",
    }),
    evidenceSummary: baselineField(
      "Eight end-user interviews support coordination friction but do not prove family-side demand.",
      ["source-caremind-end-user-interviews"],
      { confidence: "moderate", status: "confirmed", confirmed: true },
    ),
    currentGoal: baselineField(
      "Decide whether family communication belongs in the first product scope.",
      ["source-caremind-concept"],
      { confidence: "strong", status: "confirmed", confirmed: true },
    ),
    supportSummary: baselineField(
      "No active support relationship.",
      [],
      { confidence: "strong", status: "confirmed", confirmed: true },
    ),
    programSummary: baselineField("", [], {
      confidence: "low",
      status: "missing",
    }),
    openAssumptions: baselineField(
      "Family members need and will consent to a shared communication workflow.",
      ["source-caremind-concept"],
      { confidence: "low", status: "needs-review" },
    ),
    confirmedAt: "2026-07-21T11:35:00.000Z",
    updatedAt: "2026-07-21T11:35:00.000Z",
    acknowledgedIncomplete: true,
    status: "confirmed",
  };

export const careMindScenario: DecisionLoopScenarioTemplate = {
    criticalPattern:
      "End-user evidence is being stretched to support an untested family-side workflow.",
    challenges: [
      {
        key: "coordination-friction",
        type: "fact",
        title: "End users reported coordination friction.",
        explanation:
          "Eight end-user interviews support the problem for care recipients.",
        sourceIds: ["source-caremind-end-user-interviews"],
        impact: "high",
        uncertainty: "low",
        urgency: "medium",
        controllability: "high",
        confidence: "strong",
      },
      {
        key: "family-core",
        type: "founder-claim",
        title: "Family communication should be a core workflow.",
        explanation:
          "The concept note proposes this direction, but it is not customer evidence.",
        sourceIds: ["source-caremind-concept"],
        impact: "high",
        uncertainty: "high",
        urgency: "high",
        controllability: "high",
        confidence: "developing",
      },
      {
        key: "family-demand",
        type: "assumption",
        title: "Families need and will use the shared workflow.",
        explanation:
          "No family-side participant has confirmed need, consent expectations, or likely usage.",
        sourceIds: ["source-caremind-concept"],
        impact: "high",
        uncertainty: "high",
        urgency: "high",
        controllability: "high",
        confidence: "low",
      },
      {
        key: "evidence-overreach",
        type: "contradiction",
        title: "End-user interviews do not prove family-side demand.",
        explanation:
          "The existing source supports coordination pain for one participant group only.",
        sourceIds: [
          "source-caremind-end-user-interviews",
          "source-caremind-concept",
        ],
        relatedKeys: ["coordination-friction", "family-demand"],
        impact: "high",
        uncertainty: "high",
        urgency: "high",
        controllability: "high",
        confidence: "strong",
      },
      {
        key: "consent",
        type: "unknown",
        title: "Consent and support-provider expectations are unknown.",
        explanation:
          "No source covers family permissions, professional boundaries, or expected usage.",
        sourceIds: [],
        impact: "high",
        uncertainty: "high",
        urgency: "high",
        controllability: "medium",
        confidence: "strong",
      },
    ],
    decisions: [
      {
        id: "decision-caremind-family-workflow",
        title:
          "Should family communication remain a core workflow in the first product scope?",
        whyItMatters:
          "Making it core reshapes onboarding, permissions, and the first prototype test.",
        whyNow:
          "The team is about to commit prototype scope without family-side validation.",
        unlocks: ["Core workflow scope", "Prototype permissions model"],
        supportingKeys: ["coordination-friction"],
        contradictingKeys: ["evidence-overreach"],
        unknownKeys: ["consent"],
        deferredKeys: [],
        confidence: "moderate",
        isRecommended: true,
        recommendationRank: 1,
        alternativeHypotheses: [
          {
            id: "hypothesis-caremind-core",
            title: "Family communication is core",
            summary:
              "Family participants need a shared workflow in the first product.",
            assumptions: [
              "Families perceive recurring coordination pain.",
              "Consent and permissions can be made acceptable.",
            ],
            tradeOffs: [
              "Broader value proposition",
              "Higher privacy and onboarding complexity",
            ],
          },
          {
            id: "hypothesis-caremind-defer",
            title: "Family communication is deferred",
            summary:
              "The first product should focus on the validated end-user workflow.",
            assumptions: [
              "End-user coordination value stands independently.",
            ],
            tradeOffs: [
              "Narrower scope",
              "Less network coordination initially",
            ],
          },
        ],
        decisionChangingEvidence: [
          "Family or professional support participants confirm recurring need, acceptable consent, and expected usage.",
        ],
      },
      {
        id: "decision-caremind-permissions",
        title: "What permission model would family participation require?",
        whyItMatters:
          "Permissions determine feasibility and trust.",
        whyNow:
          "The permission model matters only if family demand is real.",
        unlocks: ["Permissions prototype"],
        supportingKeys: [],
        contradictingKeys: [],
        unknownKeys: ["consent"],
        deferredKeys: ["family-demand"],
        confidence: "low",
        isRecommended: false,
        recommendationRank: 2,
        alternativeHypotheses: [],
        decisionChangingEvidence: [
          "Participants identify concrete sharing boundaries and consent expectations.",
        ],
      },
    ],
    experiment: {
      decisionId: "decision-caremind-family-workflow",
      title: "Family-side workflow validation",
      hypothesis:
        "Family or professional support participants experience recurring communication needs and accept a bounded shared workflow.",
      method:
        "Interview five family-side or professional support participants about need, consent, and expected usage.",
      expectedSignal:
        "At least three describe recurring need and an acceptable permission boundary.",
      failureSignal:
        "Participants reject the workflow, cannot identify recurring need, or consider consent unacceptable.",
      timeboxDays: 10,
      evidenceRequirements: [
        {
          id: "requirement-caremind-family-interviews",
          label: "Family-side or provider interviews",
          description:
            "Record needs, consent concerns, and expected usage from five relevant participants.",
          minimumCount: 5,
          acceptedSourceKinds: ["customer-interview"],
          requiredForExit: true,
        },
      ],
      exitCriteria: [
        "Family communication is kept, narrowed, or removed from first scope using participant evidence.",
      ],
      stopConditions: [
        "Stop prototype expansion if consent boundaries remain unacceptable.",
      ],
      whatNotToDo: [
        "Do not treat end-user notes as proof of family demand.",
        "Do not expand permissions before validating need.",
      ],
      tasks: [
        {
          id: "task-caremind-participants",
          title: "Recruit five family or professional support participants",
        },
        {
          id: "task-caremind-consent-script",
          title: "Prepare need and consent interview questions",
        },
        {
          id: "task-caremind-interviews",
          title: "Run and record five interviews",
          evidenceRequirementId:
            "requirement-caremind-family-interviews",
        },
      ],
    },
  };
