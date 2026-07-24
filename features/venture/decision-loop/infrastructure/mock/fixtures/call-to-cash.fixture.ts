import type {
  ChallengeTemplate,
  DecisionLoopScenarioTemplate,
} from "../../../application/model/scenario-template";
import type {
  VentureBaseline,
  VentureSource,
} from "../../../domain";
import { baselineField } from "./fixture-builders";

export const CALL_TO_CASH_VENTURE_ID =
  "call-to-cash-risk-copilot";
export const CALL_TO_CASH_SOURCE_ID =
  "source-call-to-cash-project-document";

export const callToCashSources: VentureSource[] = [
  {
    id: CALL_TO_CASH_SOURCE_ID,
    ventureId: CALL_TO_CASH_VENTURE_ID,
    title: "NPN_Call_to_Cash.pdf",
    kind: "document",
    origin: "ai-assisted",
    authorName: "NPN",
    summary:
      "Hackathon submission describing a conversation-to-transaction product concept, technical architecture, demo workflow, and known implementation gaps.",
    createdAt: "2026-06-01T00:00:00.000Z",
    importedAt: "2026-06-30T08:00:00.000Z",
    freshness: "current",
    reviewStatus: "unreviewed",
    visibility: "private",
    aiContribution: "assisted",
    provenance: {
      artifactType: "AI-assisted founder artifact",
      purpose:
        "Hackathon submission and technical concept documentation",
      pageCount: 22,
      currentAsOf: "June 2026",
      personalDataDetected: true,
      personalDataNotice:
        "Names and personal email addresses were detected. Contact details remain private and are omitted from shared summaries.",
      productContext: "high",
      technicalContext: "high",
      marketEvidence: "low",
      commercialEvidence: "none",
    },
    tags: [
      "private",
      "hackathon",
      "product-context",
      "technical-context",
      "personal-data",
    ],
  },
];

export const callToCashBaseline: VentureBaseline = {
  id: "baseline-call-to-cash",
  ventureId: CALL_TO_CASH_VENTURE_ID,
  version: "1",
  problem: baselineField(
    "Service businesses receiving bookings by phone may lose or misinterpret booking details, reopen customer conversations, and face deposit disputes.",
    [CALL_TO_CASH_SOURCE_ID],
    { confidence: "moderate", status: "needs-review" },
  ),
  customer: baselineField(
    "Small and medium service businesses that receive bookings by phone and collect deposits; candidate segments include intercity bus operators, tour operators, spas, clinics, and small resorts.",
    [CALL_TO_CASH_SOURCE_ID],
    { confidence: "low", status: "needs-review" },
  ),
  buyer: baselineField("Unknown", [CALL_TO_CASH_SOURCE_ID], {
    confidence: "low",
    status: "missing",
  }),
  solution: baselineField(
    "A voice-based transaction copilot that structures booking information, evaluates risk, requests explicit confirmation, controls deposit access, verifies payment, and produces an auditable Trust Receipt.",
    [CALL_TO_CASH_SOURCE_ID],
    { confidence: "strong", status: "needs-review" },
  ),
  stage: baselineField(
    "Functional hackathon MVP and technical demonstration; repository, executable demo, automated tests, and deployment claims remain unverified.",
    [CALL_TO_CASH_SOURCE_ID],
    { confidence: "moderate", status: "needs-review" },
  ),
  businessModel: baselineField(
    "Missing",
    [CALL_TO_CASH_SOURCE_ID],
    { confidence: "low", status: "missing" },
  ),
  evidenceSummary: baselineField(
    "A detailed product document, architecture diagram, deterministic Payment Gate rules, demo workflow, implementation claims, edge-case catalogue, and technical references. No customer, pilot, pricing, or willingness-to-pay evidence is present.",
    [CALL_TO_CASH_SOURCE_ID],
    { confidence: "moderate", status: "needs-review" },
  ),
  currentGoal: baselineField(
    "Identify one beachhead service vertical and validate a real economic buyer for the first pilot.",
    [CALL_TO_CASH_SOURCE_ID],
    { confidence: "strong", status: "needs-review" },
  ),
  supportSummary: baselineField(
    "Ryan Tran is identified as the Convo AI Hackathon mentor; this is not customer, partner, investor, or market-demand evidence.",
    [CALL_TO_CASH_SOURCE_ID],
    { confidence: "moderate", status: "needs-review" },
  ),
  programSummary: baselineField(
    "Convo AI Hackathon, team NPN.",
    [CALL_TO_CASH_SOURCE_ID],
    { confidence: "strong", status: "needs-review" },
  ),
  openAssumptions: baselineField(
    "The buyer, pain frequency, first vertical, pilot willingness, pricing, autonomous-voice demand, and need for blockchain-backed proof are unverified.",
    [CALL_TO_CASH_SOURCE_ID],
    { confidence: "low", status: "needs-review" },
  ),
  updatedAt: "2026-06-30T08:00:00.000Z",
  acknowledgedIncomplete: true,
  status: "reviewed",
};

function finding(
  input: Pick<
    ChallengeTemplate,
    | "key"
    | "type"
    | "title"
    | "explanation"
    | "whyItMatters"
    | "whatSupportsIt"
    | "whatIsMissing"
    | "reviewPriority"
    | "confidence"
  >,
): ChallengeTemplate {
  const critical = input.reviewPriority === "critical";
  const important = input.reviewPriority === "important";
  return {
    ...input,
    sourceIds: [CALL_TO_CASH_SOURCE_ID],
    impact: critical ? "high" : important ? "medium" : "low",
    uncertainty: critical || important ? "high" : "medium",
    urgency: critical ? "high" : important ? "medium" : "low",
    controllability: critical ? "high" : "medium",
  };
}

export const callToCashScenario: DecisionLoopScenarioTemplate = {
  criticalPattern:
    "This is a strong product artifact, but it is not yet strong market evidence.",
  challenges: [
    finding({
      key: "no-validated-buyer",
      type: "unknown",
      reviewPriority: "critical",
      title: "No validated buyer or paid pain",
      explanation:
        "The document does not identify a verified economic buyer, paid pilot, pricing signal, or willingness to pay.",
      whyItMatters:
        "Without a real buyer and costly recurring pain, pricing, sales motion, pilot design, and first-product scope remain speculative.",
      whatSupportsIt: [
        "Possible service-business contexts are identified.",
        "The technical transaction workflow is well described.",
      ],
      whatIsMissing: [
        "Buyer interviews",
        "Pilot commitment",
        "Pricing feedback",
        "Willingness to pay",
        "Operational pain baseline",
      ],
      confidence: "strong",
    }),
    finding({
      key: "tech-driven-scope",
      type: "assumption",
      reviewPriority: "critical",
      title: "The product scope may be driven by hackathon technologies",
      explanation:
        "Agora and Solana are central to the proposed implementation, but buyer demand for autonomous voice handling and blockchain-backed proof has not been demonstrated.",
      whyItMatters:
        "The team may be validating the technology stack instead of the smallest valuable customer outcome.",
      whatSupportsIt: [
        "Agora and Solana are emphasized in the hackathon context.",
        "The document defines both technologies in depth.",
      ],
      whatIsMissing: [
        "Buyer demand for autonomous voice",
        "Buyer demand for cryptographic proof",
        "Comparison with operator-assist workflows",
        "Comparison with ordinary audit logs",
      ],
      confidence: "moderate",
    }),
    finding({
      key: "broad-segments",
      type: "assumption",
      reviewPriority: "important",
      title: "The first customer segment is too broad",
      explanation:
        "Bus operators, tour operators, spas, clinics, and small resorts are possible customers, but no beachhead segment has been validated.",
      confidence: "strong",
    }),
    finding({
      key: "risk-thresholds",
      type: "founder-claim",
      reviewPriority: "important",
      title: "Risk thresholds are not empirically calibrated",
      explanation:
        "The Payment Gate thresholds are deterministic demo rules, not thresholds derived from observed booking or dispute outcomes.",
      confidence: "strong",
    }),
    finding({
      key: "ai-positioning",
      type: "contradiction",
      reviewPriority: "important",
      title: "AI Revenue Operator positioning exceeds current intelligence",
      explanation:
        "The product is positioned as an AI Revenue Operator while real LLM extraction is explicitly listed as not implemented.",
      confidence: "strong",
    }),
    finding({
      key: "commercial-readiness",
      type: "contradiction",
      reviewPriority: "important",
      title: "Technical completion and commercial readiness are being mixed",
      explanation:
        "The document describes an end-to-end MVP while commercial payment, production deployment, customer validation, and complete access controls remain absent.",
      confidence: "strong",
    }),
    finding({
      key: "workflow-defined",
      type: "founder-claim",
      reviewPriority: "supporting",
      title: "The intended transaction workflow is clearly defined",
      explanation:
        "The artifact consistently describes Messy Voice to Risk Score, Agreement, Payment Gate, Solana Proof, and Trust Receipt.",
      confidence: "strong",
    }),
    finding({
      key: "explicit-confirmation",
      type: "founder-claim",
      reviewPriority: "supporting",
      title: "Payment is gated by explicit confirmation",
      explanation:
        "The proposed flow prevents payment access before the customer confirms the structured agreement.",
      confidence: "moderate",
    }),
    finding({
      key: "privacy-separation",
      type: "founder-claim",
      reviewPriority: "supporting",
      title: "Private conversation and proof data are separated",
      explanation:
        "The design distinguishes private conversation content from minimal proof records.",
      confidence: "moderate",
    }),
    finding({
      key: "mismatch-states",
      type: "founder-claim",
      reviewPriority: "supporting",
      title: "Mismatch and manual-review states are considered",
      explanation:
        "Payment mismatch, proof mismatch, tamper detection, and manual review appear in the artifact.",
      confidence: "moderate",
    }),
    finding({
      key: "implementation-boundaries",
      type: "founder-claim",
      reviewPriority: "supporting",
      title: "Implemented, simulated, and missing capabilities are distinguished",
      explanation:
        "The document explicitly lists real, mock, and incomplete parts of the demonstration.",
      confidence: "strong",
    }),
  ],
  decisions: [
    {
      id: "decision-call-to-cash-buyer",
      title:
        "Which single service vertical and economic buyer should become the first paid pilot?",
      whyItMatters:
        "The first product, pilot, pricing discovery, integrations, and sales motion depend on a real buyer with recurring pain.",
      whyNow:
        "The product is technically detailed, but the first buyer, pain frequency, and willingness to pilot remain unverified.",
      unlocks: [
        "Beachhead customer profile",
        "Buyer workflow",
        "Pilot design",
        "First-product scope",
        "Pricing discovery",
        "Relevant integrations",
      ],
      confidence: "moderate",
      isRecommended: true,
      recommendationRank: 1,
      supportingKeys: ["workflow-defined", "explicit-confirmation"],
      contradictingKeys: ["commercial-readiness"],
      unknownKeys: ["no-validated-buyer", "broad-segments"],
      deferredKeys: ["risk-thresholds", "tech-driven-scope"],
      distinguishingEvidence: [
        "Phone bookings per day",
        "Bookings requiring deposits",
        "Incorrect or incomplete booking frequency",
        "Callback and rework cost",
        "Deposit-dispute frequency",
        "No-show and cancellation losses",
        "Existing tools and workarounds",
        "Workflow owner",
        "Economic buyer",
        "Pilot willingness",
        "Willingness to pay",
        "Need for blockchain proof versus a normal audit trail",
      ],
      alternativeHypotheses: [
        {
          id: "hypothesis-call-to-cash-transport",
          title: "Intercity bus and tour operators",
          summary:
            "Frequent phone bookings and deposit workflows create recurring operational pain an operations owner will pay to reduce.",
          assumptions: ["Phone booking volume is frequent"],
          tradeOffs: ["Operators may have limited software budget"],
          strengths: [
            "Frequent booking calls",
            "Clear route, time, passenger, and deposit fields",
            "Demo context already exists",
          ],
          risks: [
            "Manual workflows may be considered acceptable",
            "Low trust in autonomous voice agents",
          ],
          evidenceNeeded: [
            "Booking volume",
            "Rework cost",
            "Buyer and pilot willingness",
          ],
        },
        {
          id: "hypothesis-call-to-cash-clinics",
          title: "Spas and clinics",
          summary:
            "Higher appointment value and no-show cost create stronger willingness to pay for confirmation and deposit control.",
          assumptions: ["Deposits materially reduce no-shows"],
          tradeOffs: ["Privacy and medical-data constraints"],
          strengths: [
            "Higher-value appointments",
            "Potentially measurable no-show cost",
          ],
          risks: [
            "Existing scheduling software",
            "Different conversation structures",
          ],
          evidenceNeeded: [
            "No-show losses",
            "Privacy constraints",
            "Current scheduling workflow",
          ],
        },
        {
          id: "hypothesis-call-to-cash-resorts",
          title: "Small resorts",
          summary:
            "Complex policies and higher transaction value make confirmation and deposit verification valuable.",
          assumptions: ["Direct phone bookings remain meaningful"],
          tradeOffs: ["Longer integrations and sales cycles"],
          strengths: [
            "Higher-value bookings",
            "Policy and guest-count changes",
          ],
          risks: [
            "Seasonal volume",
            "Existing OTA or property-management systems",
          ],
          evidenceNeeded: [
            "Direct booking volume",
            "Dispute cost",
            "Integration constraints",
          ],
        },
        {
          id: "hypothesis-call-to-cash-null",
          title: "No compelling beachhead exists",
          summary:
            "Existing booking software, payment links, and manual confirmation may solve the problem well enough.",
          assumptions: ["Current workarounds are acceptable"],
          tradeOffs: ["The project may remain a hackathon demonstration"],
          risks: ["Further building may not produce commercial value"],
          evidenceNeeded: [
            "Evidence that current workarounds fail often and expensively",
          ],
          isNull: true,
        },
      ],
      decisionChangingEvidence: [
        "A different vertical reports materially higher pain frequency.",
        "The assumed buyer does not control the budget.",
        "Existing booking software already resolves the workflow.",
        "Businesses reject autonomous voice but accept operator-assist.",
        "No interviewed business values cryptographic proof.",
      ],
      changeMyMindCriteria: [
        {
          id: "criterion-call-to-cash-higher-pain",
          text: "A different vertical reports materially higher pain frequency.",
          selected: true,
          founderCreated: false,
        },
        {
          id: "criterion-call-to-cash-budget",
          text: "The assumed buyer does not control the budget.",
          selected: true,
          founderCreated: false,
        },
        {
          id: "criterion-call-to-cash-existing-tools",
          text: "Existing booking software already resolves the workflow.",
          selected: true,
          founderCreated: false,
        },
        {
          id: "criterion-call-to-cash-operator-assist",
          text: "Businesses reject autonomous voice but accept operator-assist.",
          selected: true,
          founderCreated: false,
        },
        {
          id: "criterion-call-to-cash-proof",
          text: "No interviewed business values cryptographic proof.",
          selected: true,
          founderCreated: false,
        },
      ],
    },
    {
      id: "decision-call-to-cash-assist-mode",
      title:
        "Should the first product be an operator-assist copilot or a fully autonomous voice agent?",
      whyItMatters:
        "The choice changes safety, latency, trust, integration, and pilot complexity.",
      whyNow:
        "A narrower operator-assist workflow may reach customer value with lower implementation and adoption risk.",
      unlocks: [
        "MVP scope",
        "Human-in-the-loop design",
        "Technical requirements",
        "Pilot safety model",
      ],
      confidence: "moderate",
      isRecommended: false,
      recommendationRank: 2,
      supportingKeys: ["ai-positioning"],
      contradictingKeys: [],
      unknownKeys: ["tech-driven-scope"],
      deferredKeys: ["no-validated-buyer"],
      alternativeHypotheses: [],
      decisionChangingEvidence: [
        "Operators reject autonomous handling but accept assisted workflows.",
      ],
    },
    {
      id: "decision-call-to-cash-proof",
      title:
        "Does the first buyer require blockchain-backed proof, or is a standard auditable receipt sufficient?",
      whyItMatters:
        "The answer changes proof architecture, customer experience, compliance scope, and infrastructure cost.",
      whyNow:
        "Solana may provide technical differentiation, but current buyer value is unverified.",
      unlocks: [
        "Proof architecture",
        "Customer experience",
        "Compliance scope",
        "Infrastructure cost",
      ],
      confidence: "low",
      isRecommended: false,
      recommendationRank: 3,
      supportingKeys: ["privacy-separation", "mismatch-states"],
      contradictingKeys: [],
      unknownKeys: ["tech-driven-scope"],
      deferredKeys: ["no-validated-buyer"],
      alternativeHypotheses: [],
      decisionChangingEvidence: [
        "Buyers value a normal auditable receipt as much as cryptographic proof.",
      ],
    },
  ],
  experiment: {
    decisionId: "decision-call-to-cash-buyer",
    title: "Beachhead Buyer Validation Sprint",
    hypothesis:
      "Independent intercity bus and tour operators with frequent phone bookings and mandatory deposits experience enough booking rework and payment disputes that an operations owner will agree to pilot a risk-controlled booking workflow.",
    method:
      "Conduct structured discovery across three candidate verticals, compare pain frequency and buyer access, then run one concierge workflow test with the highest-signal segment.",
    expectedSignal:
      "One vertical shows recurring weekly pain, a clear economic buyer, two businesses willing to test, and one business willing to provide anonymized examples.",
    failureSignal:
      "No segment reports recurring costly pain, no buyer owns the problem, or businesses prefer existing manual and payment-link workflows.",
    timeboxDays: 14,
    evidenceRequirements: [
      {
        id: "requirement-call-to-cash-interviews",
        label: "Structured buyer interview notes",
        description: "Minimum 12 across the candidate verticals.",
        minimumCount: 12,
        acceptedSourceKinds: ["customer-interview"],
        requiredForExit: true,
      },
      {
        id: "requirement-call-to-cash-workflow-maps",
        label: "Current booking and deposit workflow maps",
        description: "Minimum 3 documented business workflows.",
        minimumCount: 3,
        acceptedSourceKinds: ["customer-interview", "document"],
        requiredForExit: true,
      },
      {
        id: "requirement-call-to-cash-examples",
        label: "Anonymized call or booking examples",
        description: "Minimum 3 examples with personal data removed.",
        minimumCount: 3,
        acceptedSourceKinds: ["customer-interview", "document"],
        requiredForExit: false,
      },
      {
        id: "requirement-call-to-cash-baseline",
        label: "Booking-error or dispute baseline",
        description: "Frequency and cost estimates from 3 businesses.",
        minimumCount: 3,
        acceptedSourceKinds: ["customer-interview", "founder-note"],
        requiredForExit: true,
      },
      {
        id: "requirement-call-to-cash-pilot",
        label: "Written pilot-interest confirmation",
        description: "Minimum 1 written signal; not a paid-pilot claim.",
        minimumCount: 1,
        acceptedSourceKinds: ["document", "customer-interview"],
        requiredForExit: true,
      },
    ],
    tasks: [
      {
        id: "task-call-to-cash-guide",
        title: "Prepare a neutral discovery interview guide",
      },
      {
        id: "task-call-to-cash-recruit",
        title: "Recruit four businesses from each candidate vertical",
      },
      {
        id: "task-call-to-cash-interviews",
        title: "Conduct twelve buyer and workflow interviews",
        evidenceRequirementId:
          "requirement-call-to-cash-interviews",
      },
      {
        id: "task-call-to-cash-map",
        title: "Map booking, deposit, and dispute workflows",
        evidenceRequirementId:
          "requirement-call-to-cash-workflow-maps",
      },
      {
        id: "task-call-to-cash-compare",
        title: "Compare pain frequency, buyer access, and pilot willingness",
      },
      {
        id: "task-call-to-cash-concierge",
        title: "Run one concierge workflow test with the strongest segment",
      },
    ],
    exitCriteria: [
      "One beachhead vertical is selected with documented evidence.",
      "One economic buyer role is identified.",
      "At least one business confirms pilot interest.",
      "The first product workflow is narrowed to one measurable customer outcome.",
    ],
    stopConditions: [
      "No candidate segment reports recurring costly pain.",
      "No economic buyer owns the workflow.",
      "Existing tools solve the problem sufficiently.",
      "Businesses reject both autonomous and operator-assist approaches.",
    ],
    whatNotToDo: [
      "Do not add more vertical-specific features.",
      "Do not implement production LLM extraction.",
      "Do not move Solana payments to mainnet.",
      "Do not build a universal pricing model.",
      "Do not add advanced analytics.",
      "Do not redesign the complete voice experience.",
      "Do not claim reduced disputes without baseline evidence.",
    ],
  },
};
