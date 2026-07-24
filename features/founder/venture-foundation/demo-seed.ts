import type { DemoWorkspaceState } from "./types";
import { createDecisionLoopSeedCollections } from "../../venture/decision-loop/infrastructure";

export const DEMO_WORKSPACE_STORAGE_VERSION = 2;
export const DEMO_WORKSPACE_STORAGE_KEY =
  "kizuna-founder-demo-workspace-v2";
export const LEGACY_DEMO_WORKSPACE_STORAGE_KEY =
  "kizuna-founder-demo-workspace-v1";

const decisionLoopSeed = createDecisionLoopSeedCollections();

const deterministicSeed: DemoWorkspaceState = {
  currentUser: {
    id: "user-founder-ngoc",
    name: "Nguyen Tuan Ngoc",
    avatarUrl: "https://i.pravatar.cc/150?u=kizuna-founder",
    activeVentureId: "venture-kizuna-hub",
    lastVisitedVentureId: "venture-kizuna-hub",
    lastVisitedPathByVenture: {
      "venture-kizuna-hub": "/founder/projects/venture-kizuna-hub",
    },
  },
  ventures: [
    {
      id: "venture-kizuna-hub",
      name: "Kizuna Hub",
      slug: "kizuna-hub",
      oneLineDescription:
        "A decision and evidence operating layer for early-stage ventures.",
      stage: "pilot",
      status: "active",
      tags: ["B2B SaaS", "Founder tooling"],
      currentPhase: "buyer-validation",
      activeDecisionId: "decision-kizuna-buyer",
      activeCycleId: "cycle-kizuna-buyer-validation",
      overallProgress: {
        confidence: "moderate",
        recentChange:
          "Three university programs confirmed the workflow problem.",
        unresolvedGap:
          "The purchasing owner and budget path are still unverified.",
        cycleStatus: "draft",
      },
      supportSummary: {
        status: "covered",
        activeRelationshipCount: 1,
        summary: "Program mentor active",
      },
      lastUpdatedAt: "2026-07-24T08:20:00.000Z",
      createdAt: "2026-02-10T03:00:00.000Z",
    },
    {
      id: "venture-snapmoney",
      name: "SnapMoney",
      slug: "snapmoney",
      oneLineDescription:
        "A receipt-powered spending coach for young professionals.",
      stage: "mvp",
      status: "setup",
      tags: ["FinTech", "Consumer"],
      currentPhase: "venture-context",
      activeDecisionId: "decision-snapmoney-compliance",
      overallProgress: {
        confidence: "developing",
        recentChange: "A banking integration path has been shortlisted.",
        unresolvedGap:
          "Compliance constraints and specialist coverage are unknown.",
      },
      supportSummary: {
        status: "uncovered",
        activeRelationshipCount: 0,
        summary: "No active support relationship",
        gap: "FinTech compliance expertise",
      },
      lastUpdatedAt: "2026-07-23T06:45:00.000Z",
      createdAt: "2026-04-04T02:30:00.000Z",
    },
    {
      id: "venture-edubridge",
      name: "EduBridge",
      slug: "edubridge",
      oneLineDescription:
        "A guided transition platform connecting graduates with first-job pathways.",
      stage: "mvp",
      status: "active",
      tags: ["EdTech", "Career"],
      currentPhase: "decision-framing",
      activeDecisionId: "decision-edubridge-buyer",
      overallProgress: {
        confidence: "developing",
        recentChange: "Two advisors supplied opposing go-to-market advice.",
        unresolvedGap:
          "The first buyer segment has not been selected for validation.",
      },
      supportSummary: {
        status: "partial",
        activeRelationshipCount: 2,
        summary: "Two active advisors with conflicting recommendations",
        gap: "A decision rule for reconciling buyer advice",
      },
      lastUpdatedAt: "2026-07-22T09:10:00.000Z",
      createdAt: "2026-03-18T04:00:00.000Z",
    },
    {
      id: "venture-caremind",
      name: "CareMind",
      slug: "caremind",
      oneLineDescription:
        "A care coordination workspace for families and support providers.",
      stage: "prototype",
      status: "active",
      tags: ["HealthTech", "Care"],
      currentPhase: "evidence-review",
      activeDecisionId: "decision-caremind-family-workflow",
      overallProgress: {
        confidence: "low",
        recentChange: "Eight end-user interviews were synthesized.",
        unresolvedGap:
          "No family-side or support-provider evidence has been collected.",
      },
      supportSummary: {
        status: "uncovered",
        activeRelationshipCount: 0,
        summary: "No active support relationship",
        gap: "Family-care workflow review",
      },
      lastUpdatedAt: "2026-07-21T11:35:00.000Z",
      createdAt: "2026-05-02T01:15:00.000Z",
    },
    {
      id: "call-to-cash-risk-copilot",
      name: "Call-to-Cash Risk Copilot",
      shortName: "Call-to-Cash",
      teamName: "NPN",
      slug: "call-to-cash-risk-copilot",
      oneLineDescription:
        "A conversation-AI transaction workflow that turns phone bookings into structured agreements, controlled deposits, verified payment records, and Trust Receipts.",
      stage: "functional-demo",
      displayStage: "Hackathon MVP",
      status: "active",
      tags: ["Conversation AI", "Service operations"],
      currentPhase: "buyer-validation",
      overallProgress: {
        confidence: "low",
        recentChange:
          "A 22-page founder artifact was imported for structured review.",
        unresolvedGap:
          "The beachhead service vertical and real economic buyer remain unvalidated.",
      },
      supportSummary: {
        status: "covered",
        activeRelationshipCount: 1,
        summary: "Hackathon mentor active",
      },
      lastUpdatedAt: "2026-06-30T08:00:00.000Z",
      createdAt: "2026-06-30T08:00:00.000Z",
    },
  ],
  sources: decisionLoopSeed.sources,
  baselines: decisionLoopSeed.baselines,
  challengeScans: decisionLoopSeed.challengeScans,
  challengeItems: decisionLoopSeed.challengeItems,
  decisions: [
    {
      id: "decision-kizuna-buyer",
      ventureId: "venture-kizuna-hub",
      title: "Who owns the budget and final purchasing decision?",
      whyItMatters:
        "Pricing and go-to-market remain speculative without a verified buyer.",
      status: "blocked",
      priority: "critical",
      nextAction: {
        id: "next-kizuna-cycle",
        label: "Review and commit the buyer-validation cycle",
        description:
          "Confirm the interview targets, evidence threshold, and owner for this cycle.",
        targetPath:
          "/founder/projects/venture-kizuna-hub/cycle",
        kind: "open-cycle",
      },
      blockedBy: [
        "Budget ownership has not been verified with a paying institution.",
      ],
      unlocks: ["Pricing hypothesis", "Pilot sales motion"],
      createdAt: "2026-07-14T04:00:00.000Z",
      updatedAt: "2026-07-24T08:20:00.000Z",
    },
    {
      id: "decision-snapmoney-compliance",
      ventureId: "venture-snapmoney",
      title:
        "Is the planned banking integration feasible under current compliance constraints?",
      whyItMatters:
        "The product architecture and launch sequence depend on knowing what financial data can be accessed and processed.",
      status: "blocked",
      priority: "critical",
      nextAction: {
        id: "next-snapmoney-context",
        label:
          "Complete venture context before requesting specialist support",
        description:
          "Document the integration scope and current compliance assumptions first.",
        targetPath:
          "/founder/projects/venture-snapmoney/cycle",
        kind: "continue-setup",
      },
      blockedBy: [
        "Integration scope is incomplete.",
        "FinTech compliance expertise is not covered.",
      ],
      unlocks: ["Integration architecture", "Specialist review brief"],
      createdAt: "2026-07-18T02:00:00.000Z",
      updatedAt: "2026-07-23T06:45:00.000Z",
    },
    {
      id: "decision-edubridge-buyer",
      ventureId: "venture-edubridge",
      title: "Which buyer segment should be validated first?",
      whyItMatters:
        "Conflicting advice is splitting the team between university sales and founder-direct monetization.",
      status: "open",
      priority: "critical",
      nextAction: {
        id: "next-edubridge-decision",
        label: "Open the decision context",
        description:
          "Review the two recommendations and the evidence each one assumes.",
        targetPath:
          "/founder/projects/venture-edubridge/cycle",
        kind: "review-feedback",
      },
      blockedBy: ["Two active advisors recommend different buyers."],
      unlocks: ["Beachhead validation plan", "Go-to-market focus"],
      createdAt: "2026-07-16T05:00:00.000Z",
      updatedAt: "2026-07-22T09:10:00.000Z",
    },
    {
      id: "decision-caremind-family-workflow",
      ventureId: "venture-caremind",
      title: "Should family communication be a core workflow?",
      whyItMatters:
        "Making family communication core would reshape onboarding, permissions, and the first prototype test.",
      status: "blocked",
      priority: "critical",
      nextAction: {
        id: "next-caremind-evidence",
        label: "Review the current evidence gap",
        description:
          "Separate what end-user interviews support from what still requires family-side validation.",
        targetPath:
          "/founder/projects/venture-caremind/evidence",
        kind: "add-evidence",
      },
      blockedBy: [
        "Existing interviews cover end users only.",
        "No family-side or support-provider validation exists.",
      ],
      unlocks: ["Core workflow scope", "Prototype permissions model"],
      createdAt: "2026-07-12T03:30:00.000Z",
      updatedAt: "2026-07-21T11:35:00.000Z",
    },
    ...decisionLoopSeed.decisions,
  ],
  experiments: decisionLoopSeed.experiments,
  evidenceRequirements: decisionLoopSeed.evidenceRequirements,
  cycleTasks: decisionLoopSeed.cycleTasks,
  actionCycles: [
    {
      id: "cycle-kizuna-buyer-validation",
      ventureId: "venture-kizuna-hub",
      title: "Buyer ownership validation",
      status: "draft",
      progress: 0,
      decisionId: "decision-kizuna-buyer",
      ownerId: "user-founder-ngoc",
      experimentId: "experiment-kizuna-buyer",
      taskIds: decisionLoopSeed.cycleTasks.map((task) => task.id),
      evidenceRequirementIds: [
        "requirement-kizuna-buyer-interviews",
      ],
      hypothesis:
        decisionLoopSeed.experiments[0]?.hypothesis,
      expectedSignal:
        decisionLoopSeed.experiments[0]?.expectedSignal,
      failureSignal:
        decisionLoopSeed.experiments[0]?.failureSignal,
      timeboxDays: decisionLoopSeed.experiments[0]?.timeboxDays,
      reviewerRelationshipId: "support-kizuna-mai",
      exitCriteria: decisionLoopSeed.experiments[0]?.exitCriteria,
      stopConditions: decisionLoopSeed.experiments[0]?.stopConditions,
      whatNotToDo: decisionLoopSeed.experiments[0]?.whatNotToDo,
      dueAt: "2026-08-02T10:00:00.000Z",
    },
  ],
  supportRelationships: [
    {
      id: "support-kizuna-mai",
      ventureId: "venture-kizuna-hub",
      personName: "Mai Tran",
      role: "program-mentor",
      source: "program",
      expertise: ["Product strategy", "B2B validation"],
      status: "active",
      nextSessionAt: "2026-07-31T03:00:00.000Z",
    },
    {
      id: "support-edubridge-linh",
      ventureId: "venture-edubridge",
      personName: "Linh Pham",
      role: "advisor",
      source: "existing-network",
      expertise: ["University partnerships"],
      status: "active",
    },
    {
      id: "support-edubridge-daniel",
      ventureId: "venture-edubridge",
      personName: "Daniel Ho",
      role: "advisor",
      source: "warm-introduction",
      expertise: ["Founder-led growth"],
      status: "active",
    },
    {
      id: "support-call-to-cash-ryan",
      ventureId: "call-to-cash-risk-copilot",
      personName: "Ryan Tran",
      role: "program-mentor",
      source: "program",
      expertise: ["Hackathon mentorship"],
      status: "active",
    },
  ],
  programs: [
    {
      id: "program-kizuna-competition",
      name: "University Venture Challenge",
      ventureId: "venture-kizuna-hub",
      status: "active",
      assignedMentorRelationshipId: "support-kizuna-mai",
      currentModule: "Buyer Validation",
      nextDeliverable: "Buyer interview plan",
      nextDeadlineAt: "2026-08-02T10:00:00.000Z",
    },
    {
      id: "program-call-to-cash-convo-ai",
      name: "Convo AI Hackathon",
      ventureId: "call-to-cash-risk-copilot",
      status: "active",
      assignedMentorRelationshipId: "support-call-to-cash-ryan",
      currentModule: "Buyer Validation",
      nextDeliverable: "Beachhead buyer evidence",
    },
  ],
  evidence: [
    {
      id: "evidence-caremind-end-users",
      ventureId: "venture-caremind",
      decisionId: "decision-caremind-family-workflow",
      title: "End-user interview synthesis",
      summary:
        "Eight care recipients described coordination friction, but family members and support providers were not interviewed.",
      sourceType: "interview",
      status: "accepted",
      collectedAt: "2026-07-19T08:00:00.000Z",
    },
  ],
  feedback: [
    {
      id: "feedback-edubridge-university",
      ventureId: "venture-edubridge",
      decisionId: "decision-edubridge-buyer",
      supportRelationshipId: "support-edubridge-linh",
      authorName: "Linh Pham",
      summary:
        "Validate university career centers as the first institutional buyer.",
      status: "unreviewed",
      conflictsWithFeedbackId: "feedback-edubridge-founder-direct",
      createdAt: "2026-07-21T04:00:00.000Z",
    },
    {
      id: "feedback-edubridge-founder-direct",
      ventureId: "venture-edubridge",
      decisionId: "decision-edubridge-buyer",
      supportRelationshipId: "support-edubridge-daniel",
      authorName: "Daniel Ho",
      summary:
        "Start with founder-direct monetization to shorten the learning loop.",
      status: "unreviewed",
      conflictsWithFeedbackId: "feedback-edubridge-university",
      createdAt: "2026-07-21T07:30:00.000Z",
    },
  ],
  outcomes: [],
  readinessDeltas: [],
  opportunities: [],
  activities: [
    {
      id: "activity-kizuna-cycle",
      ventureId: "venture-kizuna-hub",
      type: "cycle",
      message: "Buyer-validation cycle drafted with three interview targets.",
      occurredAt: "2026-07-24T08:20:00.000Z",
    },
    {
      id: "activity-kizuna-mentor",
      ventureId: "venture-kizuna-hub",
      type: "support",
      message: "Mai Tran confirmed the next product-strategy session.",
      occurredAt: "2026-07-23T05:10:00.000Z",
    },
    {
      id: "activity-snapmoney-context",
      ventureId: "venture-snapmoney",
      type: "project",
      message: "Banking integration was marked as the current feasibility gap.",
      occurredAt: "2026-07-23T06:45:00.000Z",
    },
    {
      id: "activity-edubridge-feedback",
      ventureId: "venture-edubridge",
      type: "support",
      message: "Two advisor recommendations were recorded as conflicting.",
      occurredAt: "2026-07-22T09:10:00.000Z",
    },
    {
      id: "activity-caremind-evidence",
      ventureId: "venture-caremind",
      type: "evidence",
      message: "End-user interviews accepted; family-side evidence remains missing.",
      occurredAt: "2026-07-21T11:35:00.000Z",
    },
    {
      id: "activity-call-to-cash-source",
      ventureId: "call-to-cash-risk-copilot",
      type: "evidence",
      message:
        "Private founder artifact imported; product context is strong while market evidence remains limited.",
      occurredAt: "2026-06-30T08:00:00.000Z",
    },
  ],
  uiPreferences: {
    storageVersion: DEMO_WORKSPACE_STORAGE_VERSION,
    projectsQuery: "",
    projectsStageFilter: "all",
  },
};

export function createDemoWorkspaceSeed(): DemoWorkspaceState {
  return JSON.parse(JSON.stringify(deterministicSeed)) as DemoWorkspaceState;
}
