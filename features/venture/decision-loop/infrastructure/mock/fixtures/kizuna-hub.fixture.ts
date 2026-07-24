import type {
  VentureBaseline,
  VentureSource,
} from "../../../domain";
import { baselineField } from "./fixture-builders";
import type { DecisionLoopScenarioTemplate } from "../../../application/model/scenario-template";

export const kizunaHubSources: VentureSource[] = [
  {
    id: "source-kizuna-founder-context",
    ventureId: "venture-kizuna-hub",
    title: "Founder venture context",
    kind: "founder-note",
    origin: "founder-authored",
    authorName: "Nguyen Tuan Ngoc",
    summary:
      "Defines Kizuna as a decision and evidence operating layer for early-stage ventures.",
    content:
      "Student founders need a clearer path from mentor feedback to a testable decision and a traceable action cycle.",
    createdAt: "2026-07-10T03:00:00.000Z",
    importedAt: "2026-07-20T03:00:00.000Z",
    freshness: "current",
    reviewStatus: "confirmed",
    visibility: "team",
    aiContribution: "none",
    tags: ["problem", "solution"],
  },
  {
    id: "source-kizuna-program-interviews",
    ventureId: "venture-kizuna-hub",
    title: "University program interviews",
    kind: "customer-interview",
    origin: "customer-evidence",
    authorName: "Nguyen Tuan Ngoc",
    summary:
      "Three program operators confirmed fragmented founder evaluation and mentor follow-up.",
    content:
      "The interviews support the workflow problem but did not establish who owns purchasing authority.",
    createdAt: "2026-07-18T04:30:00.000Z",
    importedAt: "2026-07-20T04:30:00.000Z",
    freshness: "current",
    reviewStatus: "confirmed",
    visibility: "review-ready",
    aiContribution: "none",
    tags: ["customer", "problem", "buyer"],
  },
  {
    id: "source-kizuna-program-brief",
    ventureId: "venture-kizuna-hub",
    title: "University Venture Challenge brief",
    kind: "program-deliverable",
    origin: "program-material",
    authorName: "University Venture Challenge",
    summary:
      "Frames the current module around buyer validation and an interview plan.",
    createdAt: "2026-07-15T02:00:00.000Z",
    importedAt: "2026-07-20T05:00:00.000Z",
    freshness: "current",
    reviewStatus: "confirmed",
    visibility: "team",
    aiContribution: "none",
    tags: ["program", "goal"],
  },
  {
    id: "source-kizuna-mentor-note",
    ventureId: "venture-kizuna-hub",
    title: "Product mentor session note",
    kind: "mentor-note",
    origin: "mentor-feedback",
    authorName: "Mai Tran",
    summary:
      "Recommends separating the active founder user from the institutional buyer.",
    createdAt: "2026-07-23T05:10:00.000Z",
    importedAt: "2026-07-23T05:20:00.000Z",
    freshness: "current",
    reviewStatus: "confirmed",
    visibility: "team",
    aiContribution: "assisted",
    tags: ["buyer", "contradiction"],
  },
];

export const kizunaHubBaseline: VentureBaseline = {
    id: "baseline-kizuna",
    ventureId: "venture-kizuna-hub",
    version: "1",
    problem: baselineField(
      "Early-stage ventures lose decision context across programs, mentors, and execution.",
      ["source-kizuna-founder-context", "source-kizuna-program-interviews"],
      {
        confidence: "strong",
        status: "confirmed",
        confirmed: true,
        confirmedAt: "2026-07-24T08:20:00.000Z",
      },
    ),
    customer: baselineField(
      "Student founders and early venture teams.",
      ["source-kizuna-program-interviews"],
      {
        confidence: "moderate",
        status: "confirmed",
        confirmed: true,
        confirmedAt: "2026-07-24T08:20:00.000Z",
      },
    ),
    buyer: baselineField(
      "University startup programs, subject to budget-owner validation.",
      ["source-kizuna-program-interviews", "source-kizuna-mentor-note"],
      { confidence: "developing", status: "conflicting" },
    ),
    solution: baselineField(
      "A decision and evidence operating layer connecting context, critical decisions, cycles, and proof.",
      ["source-kizuna-founder-context"],
      {
        confidence: "moderate",
        status: "confirmed",
        confirmed: true,
        confirmedAt: "2026-07-24T08:20:00.000Z",
      },
    ),
    stage: baselineField(
      "Pilot / Early users",
      ["source-kizuna-program-brief"],
      { confidence: "strong", status: "confirmed", confirmed: true },
    ),
    businessModel: baselineField(
      "Program-funded B2B SaaS with the purchasing path still unverified.",
      ["source-kizuna-founder-context"],
      { confidence: "developing", status: "needs-review" },
    ),
    evidenceSummary: baselineField(
      "Three program operators confirmed the workflow problem; budget ownership remains unsupported.",
      ["source-kizuna-program-interviews"],
      { confidence: "moderate", status: "confirmed", confirmed: true },
    ),
    currentGoal: baselineField(
      "Identify the buyer role and purchasing workflow.",
      ["source-kizuna-program-brief", "source-kizuna-mentor-note"],
      { confidence: "strong", status: "confirmed", confirmed: true },
    ),
    supportSummary: baselineField(
      "Mai Tran is the active program mentor for product and B2B validation.",
      ["source-kizuna-mentor-note"],
      { confidence: "strong", status: "confirmed", confirmed: true },
    ),
    programSummary: baselineField(
      "University Venture Challenge; current module is Buyer Validation.",
      ["source-kizuna-program-brief"],
      { confidence: "strong", status: "confirmed", confirmed: true },
    ),
    openAssumptions: baselineField(
      "Program operators control budget; founders are users but not buyers; procurement time is acceptable.",
      ["source-kizuna-founder-context", "source-kizuna-mentor-note"],
      { confidence: "developing", status: "needs-review" },
    ),
    confirmedAt: "2026-07-24T08:20:00.000Z",
    updatedAt: "2026-07-24T08:20:00.000Z",
    acknowledgedIncomplete: true,
    status: "confirmed",
  };

export const kizunaHubScenario: DecisionLoopScenarioTemplate = {
    criticalPattern:
      "The active user and the likely buyer are being treated as the same person.",
    challenges: [
      {
        key: "workflow-problem",
        type: "fact",
        title: "Program operators confirmed fragmented founder evaluation.",
        explanation:
          "Three interviews support the workflow problem, but not a purchasing decision.",
        sourceIds: ["source-kizuna-program-interviews"],
        impact: "high",
        uncertainty: "low",
        urgency: "medium",
        controllability: "high",
        confidence: "strong",
      },
      {
        key: "founder-user",
        type: "founder-claim",
        title: "Student founders are the most active users.",
        explanation:
          "Current usage observations indicate activity, but no durable usage dataset is linked.",
        sourceIds: ["source-kizuna-founder-context"],
        impact: "medium",
        uncertainty: "medium",
        urgency: "medium",
        controllability: "high",
        confidence: "developing",
      },
      {
        key: "program-buyer",
        type: "assumption",
        title: "University startup programs control the purchasing budget.",
        explanation:
          "Pricing and sales motion depend on this assumption, which no budget owner has confirmed.",
        sourceIds: [
          "source-kizuna-program-interviews",
          "source-kizuna-mentor-note",
        ],
        impact: "high",
        uncertainty: "high",
        urgency: "high",
        controllability: "high",
        confidence: "developing",
      },
      {
        key: "procurement-simple",
        type: "ai-inference",
        title: "Program adoption implies a simple purchasing path.",
        explanation:
          "This inference is plausible but is not supported by procurement evidence.",
        sourceIds: ["source-kizuna-program-brief"],
        impact: "medium",
        uncertainty: "high",
        urgency: "medium",
        controllability: "medium",
        confidence: "low",
      },
      {
        key: "user-buyer-conflict",
        type: "contradiction",
        title: "Student founders use the product, while programs are assumed to pay.",
        explanation:
          "The current story does not yet connect user value to institutional budget ownership.",
        sourceIds: [
          "source-kizuna-founder-context",
          "source-kizuna-mentor-note",
        ],
        relatedKeys: ["founder-user", "program-buyer"],
        impact: "high",
        uncertainty: "high",
        urgency: "high",
        controllability: "high",
        confidence: "moderate",
      },
      {
        key: "approval-path",
        type: "unknown",
        title: "The approval and procurement path is unknown.",
        explanation:
          "No source identifies the budget owner, approval steps, or purchasing timeframe.",
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
        id: "decision-kizuna-buyer",
        title: "Who owns the budget and final purchasing decision?",
        whyItMatters:
          "Pricing and go-to-market remain speculative without a verified buyer.",
        whyNow:
          "The product problem has initial support, while the purchasing path blocks the next pilot conversation.",
        unlocks: ["Pricing hypothesis", "Pilot sales motion"],
        supportingKeys: ["workflow-problem"],
        contradictingKeys: ["user-buyer-conflict"],
        unknownKeys: ["approval-path"],
        deferredKeys: ["procurement-simple"],
        confidence: "moderate",
        isRecommended: true,
        recommendationRank: 1,
        alternativeHypotheses: [
          {
            id: "hypothesis-kizuna-program",
            title: "Program-funded",
            summary:
              "University programs own budget and purchase the operating layer for cohorts.",
            assumptions: [
              "Program managers experience enough operational pain.",
              "A program budget line can fund the product.",
            ],
            tradeOffs: [
              "Higher contract value",
              "Longer procurement cycle",
            ],
          },
          {
            id: "hypothesis-kizuna-founder",
            title: "Founder-funded",
            summary:
              "Founders pay directly for continuity and mentor readiness.",
            assumptions: [
              "Individual willingness to pay exists.",
              "Founder acquisition can be efficient.",
            ],
            tradeOffs: [
              "Faster validation",
              "Lower likely contract value",
            ],
          },
        ],
        decisionChangingEvidence: [
          "Three budget owners independently describe the same approval path.",
          "Founders demonstrate direct willingness to pay at a viable price.",
        ],
      },
      {
        id: "decision-kizuna-user-segment",
        title: "Which founder cohort experiences the strongest recurring need?",
        whyItMatters:
          "A narrow cohort could improve product relevance and onboarding.",
        whyNow:
          "The segment matters, but buyer ownership blocks commercialization first.",
        unlocks: ["Focused onboarding", "Cohort-specific messaging"],
        supportingKeys: ["founder-user"],
        contradictingKeys: [],
        unknownKeys: [],
        deferredKeys: ["program-buyer", "approval-path"],
        confidence: "developing",
        isRecommended: false,
        recommendationRank: 2,
        alternativeHypotheses: [],
        decisionChangingEvidence: [
          "A cohort shows materially higher repeat usage and decision completion.",
        ],
      },
      {
        id: "decision-kizuna-procurement",
        title: "How much procurement friction can the pilot tolerate?",
        whyItMatters:
          "Procurement affects pilot timing and sales effort.",
        whyNow:
          "The question becomes actionable after a budget owner is identified.",
        unlocks: ["Pilot timeline", "Procurement plan"],
        supportingKeys: ["procurement-simple"],
        contradictingKeys: [],
        unknownKeys: ["approval-path"],
        deferredKeys: ["program-buyer"],
        confidence: "low",
        isRecommended: false,
        recommendationRank: 3,
        alternativeHypotheses: [],
        decisionChangingEvidence: [
          "A confirmed buyer provides an approval timeline and procurement constraints.",
        ],
      },
    ],
    experiment: {
      decisionId: "decision-kizuna-buyer",
      title: "Buyer ownership validation",
      hypothesis:
        "University program managers control or can identify the budget owner for founder-support tooling.",
      method:
        "Interview five university program managers or budget owners using the same purchasing-path questions.",
      expectedSignal:
        "At least three independently confirm the same buyer role and approval path.",
      failureSignal:
        "Program managers value the workflow but cannot allocate or influence budget.",
      timeboxDays: 10,
      evidenceRequirements: [
        {
          id: "requirement-kizuna-buyer-interviews",
          label: "Budget-owner interviews",
          description:
            "Record five interviews with role, budget authority, approval steps, and direct quotations.",
          minimumCount: 5,
          acceptedSourceKinds: ["customer-interview"],
          requiredForExit: true,
        },
      ],
      exitCriteria: [
        "A buyer role and purchasing workflow are identified with sufficient confidence.",
      ],
      stopConditions: [
        "Stop if three consecutive participants cannot identify any plausible budget owner.",
      ],
      whatNotToDo: [
        "Do not finalize pricing before buyer validation.",
        "Do not rewrite the complete pitch deck.",
        "Do not build new mentor-matching features.",
      ],
      tasks: [
        {
          id: "task-kizuna-interview-list",
          title: "Build a list of five program budget owners",
          dueAt: "2026-07-28T10:00:00.000Z",
        },
        {
          id: "task-kizuna-interview-script",
          title: "Prepare purchasing-path interview questions",
          dueAt: "2026-07-29T10:00:00.000Z",
          evidenceRequirementId:
            "requirement-kizuna-buyer-interviews",
        },
        {
          id: "task-kizuna-run-interviews",
          title: "Run and record five interviews",
          dueAt: "2026-08-02T10:00:00.000Z",
          evidenceRequirementId:
            "requirement-kizuna-buyer-interviews",
        },
      ],
    },
  };
