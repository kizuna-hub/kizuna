import type {
  VentureBaseline,
  VentureSource,
} from "../../../domain";
import { baselineField } from "./fixture-builders";
import type { DecisionLoopScenarioTemplate } from "../../../application/model/scenario-template";

export const snapMoneySources: VentureSource[] = [
  {
    id: "source-snapmoney-prototype",
    ventureId: "venture-snapmoney",
    title: "Prototype integration notes",
    kind: "prototype-link",
    origin: "founder-authored",
    authorName: "Nguyen Tuan Ngoc",
    summary:
      "Describes a receipt-led spending coach with a proposed direct bank-data connection.",
    createdAt: "2026-07-17T02:00:00.000Z",
    importedAt: "2026-07-22T02:00:00.000Z",
    freshness: "current",
    reviewStatus: "confirmed",
    visibility: "private",
    aiContribution: "none",
    tags: ["solution", "integration"],
  },
  {
    id: "source-snapmoney-api-research",
    ventureId: "venture-snapmoney",
    title: "Banking API research",
    kind: "research",
    origin: "external-research",
    summary:
      "Lists potential data providers but does not resolve licensing or compliance obligations.",
    createdAt: "2026-05-12T02:00:00.000Z",
    importedAt: "2026-07-22T02:10:00.000Z",
    freshness: "possibly-stale",
    reviewStatus: "needs-update",
    visibility: "team",
    aiContribution: "none",
    tags: ["feasibility", "compliance"],
  },
  {
    id: "source-snapmoney-ai-brief",
    ventureId: "venture-snapmoney",
    title: "AI-generated product brief",
    kind: "ai-conversation",
    origin: "ai-generated",
    summary:
      "Suggests that direct banking integration is feasible for an MVP.",
    createdAt: "2026-07-20T02:00:00.000Z",
    importedAt: "2026-07-22T02:20:00.000Z",
    freshness: "unknown",
    reviewStatus: "unreviewed",
    visibility: "private",
    aiContribution: "generated",
    tags: ["assumption", "ai"],
  },
];

export const snapMoneyBaseline: VentureBaseline = {
    id: "baseline-snapmoney",
    ventureId: "venture-snapmoney",
    version: "1",
    problem: baselineField(
      "Young professionals lack timely awareness of everyday spending.",
      ["source-snapmoney-prototype"],
      { confidence: "developing", status: "needs-review" },
    ),
    customer: baselineField(
      "Young professionals managing personal spending.",
      ["source-snapmoney-prototype"],
      { confidence: "developing", status: "needs-review" },
    ),
    buyer: baselineField("", [], { status: "missing", confidence: "low" }),
    solution: baselineField(
      "A receipt-powered spending coach with a proposed bank-data connection.",
      ["source-snapmoney-prototype"],
      { confidence: "developing", status: "needs-review" },
    ),
    stage: baselineField(
      "Prototype / MVP",
      ["source-snapmoney-prototype"],
      { confidence: "strong", status: "confirmed", confirmed: true },
    ),
    businessModel: baselineField("", [], {
      status: "missing",
      confidence: "low",
    }),
    evidenceSummary: baselineField(
      "Prototype notes exist; compliance feasibility is not evidenced.",
      ["source-snapmoney-prototype", "source-snapmoney-api-research"],
      { confidence: "low", status: "possibly-stale" },
    ),
    currentGoal: baselineField(
      "Determine whether the integration can be tested safely without regulated infrastructure.",
      ["source-snapmoney-prototype"],
      { confidence: "strong", status: "confirmed", confirmed: true },
    ),
    supportSummary: baselineField(
      "No active support relationship.",
      [],
      { confidence: "strong", status: "confirmed", confirmed: true },
    ),
    programSummary: baselineField("", [], {
      status: "missing",
      confidence: "low",
    }),
    openAssumptions: baselineField(
      "Direct bank integration is feasible and necessary for an early MVP.",
      ["source-snapmoney-ai-brief"],
      { confidence: "low", status: "needs-review" },
    ),
    updatedAt: "2026-07-23T06:45:00.000Z",
    acknowledgedIncomplete: false,
    status: "draft",
  };

export const snapMoneyScenario: DecisionLoopScenarioTemplate = {
    criticalPattern:
      "The proposed MVP architecture assumes regulated access before compliance boundaries are known.",
    challenges: [
      {
        key: "prototype-exists",
        type: "fact",
        title: "A receipt-led prototype exists.",
        explanation:
          "The current prototype can test coaching value without proving direct bank integration.",
        sourceIds: ["source-snapmoney-prototype"],
        impact: "medium",
        uncertainty: "low",
        urgency: "medium",
        controllability: "high",
        confidence: "strong",
      },
      {
        key: "integration-required",
        type: "assumption",
        title: "Direct banking integration is required for the first MVP.",
        explanation:
          "A lower-risk transaction-data or receipt path may test the same user value.",
        sourceIds: [
          "source-snapmoney-prototype",
          "source-snapmoney-ai-brief",
        ],
        impact: "high",
        uncertainty: "high",
        urgency: "high",
        controllability: "high",
        confidence: "low",
      },
      {
        key: "ai-feasibility",
        type: "ai-inference",
        title: "The AI brief treats integration feasibility as established.",
        explanation:
          "AI-generated copy has no regulatory provenance and cannot verify feasibility.",
        sourceIds: ["source-snapmoney-ai-brief"],
        impact: "high",
        uncertainty: "high",
        urgency: "medium",
        controllability: "medium",
        confidence: "low",
      },
      {
        key: "stale-research",
        type: "contradiction",
        title: "Possibly stale API research is being used for a current architecture decision.",
        explanation:
          "Provider access and compliance requirements may have changed since the research was created.",
        sourceIds: ["source-snapmoney-api-research"],
        impact: "high",
        uncertainty: "high",
        urgency: "high",
        controllability: "high",
        confidence: "moderate",
      },
      {
        key: "licensing",
        type: "unknown",
        title: "Compliance and licensing requirements are unknown.",
        explanation:
          "No reviewed source defines what data may be accessed, stored, or processed.",
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
        id: "decision-snapmoney-compliance",
        title:
          "Can the proposed integration be tested safely without regulated infrastructure?",
        whyItMatters:
          "The MVP architecture depends on a safe and legal learning path.",
        whyNow:
          "Building direct integration before mapping constraints could create avoidable rework and risk.",
        unlocks: ["MVP architecture", "Compliance research scope"],
        supportingKeys: ["prototype-exists"],
        contradictingKeys: ["stale-research"],
        unknownKeys: ["licensing"],
        deferredKeys: ["ai-feasibility"],
        confidence: "moderate",
        isRecommended: true,
        recommendationRank: 1,
        alternativeHypotheses: [
          {
            id: "hypothesis-snapmoney-direct",
            title: "Direct integration",
            summary:
              "A compliant provider makes direct transaction access feasible.",
            assumptions: [
              "Provider terms permit the intended data use.",
              "Licensing obligations fit the MVP stage.",
            ],
            tradeOffs: ["Richer data", "Higher compliance risk"],
          },
          {
            id: "hypothesis-snapmoney-lower-risk",
            title: "Lower-risk data path",
            summary:
              "Receipt or user-provided transaction data can test coaching value first.",
            assumptions: [
              "Manual data still produces useful coaching signals.",
            ],
            tradeOffs: ["Faster learning", "More user friction"],
          },
        ],
        decisionChangingEvidence: [
          "Current provider terms and a compliance map confirm a safe integration path.",
          "A lower-risk prototype demonstrates equivalent learning value.",
        ],
      },
      {
        id: "decision-snapmoney-coaching",
        title: "Which coaching insight creates repeat value?",
        whyItMatters: "The product needs a repeatable user outcome.",
        whyNow:
          "This can be tested after selecting a safe data path.",
        unlocks: ["Retention experiment"],
        supportingKeys: ["prototype-exists"],
        contradictingKeys: [],
        unknownKeys: [],
        deferredKeys: ["licensing"],
        confidence: "developing",
        isRecommended: false,
        recommendationRank: 2,
        alternativeHypotheses: [],
        decisionChangingEvidence: [
          "Users repeatedly act on one coaching insight.",
        ],
      },
    ],
    experiment: {
      decisionId: "decision-snapmoney-compliance",
      title: "Safe integration feasibility map",
      hypothesis:
        "The coaching value can be tested using a lower-risk data path before regulated infrastructure.",
      method:
        "Map current compliance requirements and compare direct integration with receipt and user-provided alternatives.",
      expectedSignal:
        "One lower-risk method can test the core coaching value without regulated data access.",
      failureSignal:
        "Every useful test requires regulated access or prohibited data handling.",
      timeboxDays: 7,
      evidenceRequirements: [
        {
          id: "requirement-snapmoney-compliance-map",
          label: "Current compliance map",
          description:
            "Document current data-access constraints and the provenance of each requirement.",
          acceptedSourceKinds: ["research", "document"],
          requiredForExit: true,
        },
      ],
      exitCriteria: [
        "A safe MVP data path is selected with explicit constraints.",
      ],
      stopConditions: [
        "Stop architecture work if the legal basis for data processing remains unknown.",
      ],
      whatNotToDo: [
        "Do not request a mentor automatically.",
        "Do not build direct bank integration before constraints are mapped.",
      ],
      tasks: [
        {
          id: "task-snapmoney-refresh-research",
          title: "Refresh provider and compliance research",
          evidenceRequirementId:
            "requirement-snapmoney-compliance-map",
        },
        {
          id: "task-snapmoney-compare-paths",
          title: "Compare direct, receipt, and user-provided data paths",
        },
      ],
    },
  };
