"use client";

import React from "react";

export type ChecklistStatus = "completed" | "active" | "locked";
export type DocumentStatus = "missing" | "draft" | "needs_update" | "ready" | "generated" | "shared";
export type DocumentSource = "submit_project" | "ai_pitch" | "workspace_data" | "manual_mock" | "missing";
export type MilestoneStatus = "completed" | "active" | "locked";
export type MentorRequestStatus = "locked" | "ready" | "sent";
export type PitchDeckStatus = "missing" | "draft" | "reviewed" | "generated" | "shared";
export type PitchInputSource = "workspace_data" | "uploaded_draft" | "pasted_draft" | "imported_draft" | "ai_interview";
export type PitchReadinessStatus = "early_draft" | "good_start" | "promising" | "strong_fit" | "mentor_ready";
export type SlideDiagnosisStatus =
  | "mentor_ready"
  | "strong"
  | "good"
  | "needs_evidence"
  | "needs_clarity"
  | "needs_focus"
  | "missing_proof";

export type SlideSuggestedFix = {
  whatToChange: string;
  whyThisMatters: string;
  howToImprove: string;
  exampleRewrite: string;
  expectedMentorImpact: string;
};

export type StartupProfile = {
  name: string;
  tagline: string;
  industry: string;
  stage: string;
  problem: string;
  solution: string;
  targetCustomer: string;
  businessModel: string;
  team: string;
  traction: string;
  supportNeed: string;
};

export type SubmitProjectTeamMember = {
  name: string;
  role: string;
  email?: string;
  phone?: string;
  social?: string;
  org?: string;
};

export type SubmitProjectMedia = {
  name: string;
  url?: string;
  type?: string;
};

export type SubmitProjectSubmission = {
  id: string;
  createdAt: string;
  projectName: string;
  slogan: string;
  categories: string[];
  stage: string;
  problem: string;
  solution: string;
  targetAudience: string;
  businessModel: string;
  team: SubmitProjectTeamMember[];
  evidenceSignals?: string[];
  traction?: string;
  currentMilestone?: string;
  demoLink?: string;
  gallery?: SubmitProjectMedia[];
  logoUrl?: string;
  pitchDraft?: {
    name: string;
    type: string;
    size: number;
  };
  supportNeeds?: string[];
  supportNeed?: string;
  mentorAsk?: string;
};

export type DataRoomShareLinkState = {
  enabled: boolean;
  url: string;
  accessLevel: string;
  expiresIn: string;
  lastUpdated: string;
};

export type MentorReadinessBlocker = {
  id: "profile" | "ai" | "data_room" | "pitch_deck" | "mentor_ask";
  label: string;
  current?: string;
  required?: string;
  actionLabel: string;
  route: "" | "ai-pitch-deck" | "data-room";
};

export type MentorReadinessGate = {
  status: MentorRequestStatus;
  canRequest: boolean;
  blockers: MentorReadinessBlocker[];
};

export type FounderWorkspaceDemoState = {
  submission?: SubmitProjectSubmission;
  profile: StartupProfile;
  profileCompletion: number;
  aiReadinessScore: number;
  dataRoomReadiness: number;
  pitchDeckStatus: PitchDeckStatus;
  pitchDraft?: SubmitProjectSubmission["pitchDraft"];
  mentorRequestStatus: MentorRequestStatus;
  dataRoomShareLink?: DataRoomShareLinkState;
  checklistItems: Array<{
    id: string;
    label: string;
    status: ChecklistStatus;
    reason?: string;
  }>;
  documents: Array<{
    id: string;
    name: string;
    status: DocumentStatus;
    description?: string;
    required?: boolean;
    source?: DocumentSource;
    sourceLabel?: string;
    lastUpdated?: string;
    actionLabel?: string;
    route?: "" | "ai-pitch-deck" | "data-room";
    metadata?: {
      fileName?: string;
      fileType?: string;
      fileSize?: number;
      detail?: string;
    };
  }>;
  milestones: Array<{
    id: string;
    name: string;
    status: MilestoneStatus;
    progress: number;
    targetPeriod: string;
    nextAction: string;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
  }>;
  pitchReadiness: PitchReadinessDemoState;
};

export type FounderProjectDemoStore = {
  activeProjectId?: string;
  projects: Array<{
    id: string;
    createdAt: string;
    submission: SubmitProjectSubmission;
    workspaceState: FounderWorkspaceDemoState;
  }>;
};

export type PitchReadinessDemoState = {
  source: PitchInputSource;
  overallScore: number;
  projectedScore: number;
  status: PitchReadinessStatus;
  confidence: "low" | "medium" | "medium_high" | "high";
  mentorVerdict: string;
  estimatedTimeToReady: string;
  nextBestAction: string;
  strengths: string[];
  criticalGaps: Array<{
    id: string;
    label: string;
    impact: "high" | "medium" | "low";
    effortMinutes: number;
    estimatedGain: number;
    completed: boolean;
  }>;
  quickWins: Array<{
    id: string;
    label: string;
    estimatedGain: number;
    completed: boolean;
  }>;
  mentorRiskQuestions: string[];
  scoringBreakdown: Array<{
    id: string;
    label: string;
    weight: number;
    score: number;
    statusLabel: string;
    aiNote: string;
    improvementHint: string;
  }>;
  slideDiagnosis: Array<{
    id: string;
    name: string;
    score: number;
    status: SlideDiagnosisStatus;
    priority: "high" | "medium" | "low";
    effort: string;
    estimatedGain: number;
    breakdown: Array<{ label: string; value: string }>;
    aiNote: string;
    mentorRisk: string;
    suggestedFix: SlideSuggestedFix;
    exampleRewrite: string;
    content: string;
  }>;
  generatedSlides: Array<{
    id: string;
    title: string;
    subtitle: string;
    bullets: string[];
    speakerNote: string;
  }>;
  deckGenerated: boolean;
  deckSentToDataRoom: boolean;
  reviewHasRun: boolean;
  activity: Array<{
    id: string;
    message: string;
    timestamp: string;
    type: string;
  }>;
};

export const requiredProfileFields: Array<{ key: keyof StartupProfile; label: string }> = [
  { key: "name", label: "Startup name" },
  { key: "tagline", label: "One-line description" },
  { key: "industry", label: "Industry" },
  { key: "stage", label: "Stage" },
  { key: "problem", label: "Problem statement" },
  { key: "solution", label: "Solution summary" },
  { key: "targetCustomer", label: "Target customer" },
  { key: "businessModel", label: "Business model" },
  { key: "team", label: "Team summary" },
  { key: "traction", label: "Current traction" },
  { key: "supportNeed", label: "Support need" },
];

export const defaultPitchReadinessState: PitchReadinessDemoState = {
  source: "workspace_data",
  overallScore: 72,
  projectedScore: 84,
  status: "promising",
  confidence: "medium",
  mentorVerdict: "Your pitch has a promising foundation, but mentors will need clearer customer evidence, traction proof, and revenue logic before review.",
  estimatedTimeToReady: "30-40 minutes",
  nextBestAction: "Run AI readiness review",
  strengths: [
    "Clear student-founder problem",
    "Simple workspace-based solution",
    "Strong founder-market fit from university context",
  ],
  criticalGaps: [
    { id: "customer-focus", label: "Target customer is still too broad", impact: "high", effortMinutes: 10, estimatedGain: 7, completed: false },
    { id: "traction-proof", label: "Traction proof needs one concrete signal", impact: "high", effortMinutes: 12, estimatedGain: 6, completed: false },
    { id: "pricing-logic", label: "Revenue model needs clearer pricing assumptions", impact: "medium", effortMinutes: 8, estimatedGain: 5, completed: false },
  ],
  quickWins: [
    { id: "user-example", label: "Add one real user example", estimatedGain: 7, completed: false },
    { id: "waitlist-proof", label: "Add prototype or waitlist proof", estimatedGain: 6, completed: false },
    { id: "simple-pricing", label: "Add simple pricing logic", estimatedGain: 5, completed: false },
  ],
  mentorRiskQuestions: [
    "Who exactly is your first customer segment?",
    "What proof shows this problem is painful?",
    "Why would users choose your solution instead of current alternatives?",
    "How will you reach the first 100 users?",
    "What do you need from a mentor right now?",
  ],
  scoringBreakdown: [
    { id: "problem", label: "Problem clarity", weight: 15, score: 78, statusLabel: "Promising", aiNote: "The problem is understandable and student-specific.", improvementHint: "Add one painful moment from a founder interview." },
    { id: "solution", label: "Solution clarity", weight: 15, score: 76, statusLabel: "Promising", aiNote: "The workflow is clear, but the first use case needs tighter framing.", improvementHint: "Explain the first workflow a founder completes." },
    { id: "customer", label: "Target customer focus", weight: 15, score: 68, statusLabel: "Needs focus", aiNote: "The audience is broad across student founders.", improvementHint: "Define one beachhead user group." },
    { id: "evidence", label: "Evidence / traction", weight: 15, score: 62, statusLabel: "Needs evidence", aiNote: "Waitlist signal exists but needs context.", improvementHint: "Add source, time period, and conversion intent." },
    { id: "business", label: "Business model logic", weight: 10, score: 58, statusLabel: "Needs clarity", aiNote: "Pricing assumptions are not yet visible.", improvementHint: "State who pays first and why." },
    { id: "competition", label: "Competitive differentiation", weight: 10, score: 74, statusLabel: "Good", aiNote: "The mentor-workspace angle is differentiated.", improvementHint: "Contrast against generic document tools." },
    { id: "team", label: "Team credibility", weight: 10, score: 82, statusLabel: "Strong", aiNote: "The team context supports founder-market fit.", improvementHint: "Add one execution proof point." },
    { id: "roadmap", label: "Roadmap realism", weight: 5, score: 72, statusLabel: "Good", aiNote: "The next milestone is plausible.", improvementHint: "Attach target dates to the pilot plan." },
    { id: "ask", label: "Mentor ask clarity", weight: 5, score: 60, statusLabel: "Needs clarity", aiNote: "The mentor ask is implied but not explicit.", improvementHint: "Name the feedback you need this week." },
  ],
  slideDiagnosis: [
    {
      id: "problem",
      name: "Problem",
      score: 78,
      status: "good",
      priority: "medium",
      effort: "8 minutes",
      estimatedGain: 4,
      breakdown: [
        { label: "Pain clarity", value: "Strong" },
        { label: "Specificity", value: "Medium" },
        { label: "Evidence", value: "Needs one example" },
      ],
      aiNote: "The student-founder pain is clear, but the slide should show one concrete moment where founders get stuck.",
      mentorRisk: "A mentor may ask: what evidence proves this is painful enough to solve now?",
      suggestedFix: {
        whatToChange: "Replace the broad pain statement with one observed founder moment.",
        whyThisMatters: "Mentors trust a problem more when they can picture the exact workflow breaking down.",
        howToImprove: "Add a short quote, interview note, or before/after workflow from a student founder preparing for review.",
        exampleRewrite: "Student founders lose momentum when their profile, pitch, documents, and mentor feedback live in separate tools.",
        expectedMentorImpact: "Shows the problem is real, urgent, and grounded in discovery rather than an abstract platform idea.",
      },
      exampleRewrite: "Student founders lose momentum when their profile, pitch, documents, and mentor feedback live in separate tools.",
      content: "Student founders struggle to turn raw ideas into mentor-ready startup profiles.",
    },
    {
      id: "solution",
      name: "Solution",
      score: 76,
      status: "good",
      priority: "medium",
      effort: "8 minutes",
      estimatedGain: 4,
      breakdown: [
        { label: "Workflow clarity", value: "Medium" },
        { label: "Outcome", value: "Strong" },
        { label: "Differentiation", value: "Medium" },
      ],
      aiNote: "The solution is understandable, but the slide should name the first successful user action.",
      mentorRisk: "A mentor may ask: what does a founder complete in their first session?",
      suggestedFix: {
        whatToChange: "Turn the solution from a feature list into a guided readiness path.",
        whyThisMatters: "Mentors need to understand the product outcome, not only the modules inside the workspace.",
        howToImprove: "Describe the first successful session: profile completion, AI diagnosis, data room prep, then mentor request.",
        exampleRewrite: "Kizuna turns startup notes into a structured mentor-review packet: profile, AI readiness, milestones, data room, and mentor match.",
        expectedMentorImpact: "Makes the product feel usable in one sitting and easier to evaluate during a live demo.",
      },
      exampleRewrite: "Kizuna turns startup notes into a structured mentor-review packet: profile, AI readiness, milestones, data room, and mentor match.",
      content: "A guided workspace combines profile completion, AI review, milestones, data room prep, and mentor matching.",
    },
    {
      id: "market",
      name: "Customer / Market",
      score: 58,
      status: "needs_evidence",
      priority: "high",
      effort: "10 minutes",
      estimatedGain: 7,
      breakdown: [
        { label: "ICP clarity", value: "Medium" },
        { label: "Market size logic", value: "Weak" },
        { label: "Reachability", value: "Medium" },
        { label: "Willingness to pay", value: "Unclear" },
      ],
      aiNote: "Your market section describes a broad audience, but mentors need a focused first segment you can reach.",
      mentorRisk: "Who exactly will use this first, and how will you reach them?",
      suggestedFix: {
        whatToChange: "Narrow the customer from all student founders to one reachable beachhead segment.",
        whyThisMatters: "A broad market claim makes mentors worry the team cannot find or learn from users quickly enough.",
        howToImprove: "Name the first user group, why they have urgency, where they gather, and how Kizuna will reach them.",
        exampleRewrite: "Our first target segment is university startup club founders preparing for incubator review in Da Nang.",
        expectedMentorImpact: "Clarifies go-to-market focus and answers the highest-risk mentor question about reachability.",
      },
      exampleRewrite: "Our first target segment is university startup club founders preparing for incubator review in Da Nang.",
      content: "University founders preparing for incubators, demo days, and early mentor review.",
    },
    {
      id: "traction",
      name: "Traction",
      score: 62,
      status: "missing_proof",
      priority: "high",
      effort: "12 minutes",
      estimatedGain: 6,
      breakdown: [
        { label: "User proof", value: "Medium" },
        { label: "Time period", value: "Missing" },
        { label: "Intent quality", value: "Unclear" },
      ],
      aiNote: "The waitlist is useful, but mentors need to know where it came from and whether users intend to try the product.",
      mentorRisk: "What proof shows users will return after the first demo?",
      suggestedFix: {
        whatToChange: "Add source, time period, and intent quality to the traction claim.",
        whyThisMatters: "A raw waitlist number sounds weak unless mentors know where it came from and what users asked for.",
        howToImprove: "Pair the waitlist with a pilot cohort, a request signal, and the next activation metric you will measure.",
        exampleRewrite: "120 founders joined the waitlist from three startup clubs; 34 requested early mentor-review templates.",
        expectedMentorImpact: "Turns traction from a vanity metric into early evidence that founders want the workflow.",
      },
      exampleRewrite: "120 founders joined the waitlist from three startup clubs; 34 requested early mentor-review templates.",
      content: "120 founders waitlisted across three university startup clubs.",
    },
    {
      id: "business",
      name: "Business Model",
      score: 58,
      status: "needs_clarity",
      priority: "high",
      effort: "8 minutes",
      estimatedGain: 5,
      breakdown: [
        { label: "Buyer", value: "Unclear" },
        { label: "Pricing", value: "Missing" },
        { label: "Expansion path", value: "Medium" },
      ],
      aiNote: "The value is clear, but the first paying customer is not explicit.",
      mentorRisk: "Who pays first: founder, university, or sponsor?",
      suggestedFix: {
        whatToChange: "State who pays first and the simplest v1 pricing logic.",
        whyThisMatters: "Mentors will challenge whether the product has a buyer, not only whether founders like it.",
        howToImprove: "Pick one buyer for the first phase, name the budget reason, and avoid complex pricing tiers.",
        exampleRewrite: "Universities pay per cohort to standardize founder readiness before mentor office hours.",
        expectedMentorImpact: "Reduces business-model uncertainty and makes the pilot easier to discuss.",
      },
      exampleRewrite: "Universities pay per cohort to standardize founder readiness before mentor office hours.",
      content: "",
    },
    {
      id: "competition",
      name: "Competition / Differentiation",
      score: 74,
      status: "good",
      priority: "medium",
      effort: "10 minutes",
      estimatedGain: 4,
      breakdown: [
        { label: "Alternatives", value: "Medium" },
        { label: "Difference", value: "Strong" },
        { label: "Defensibility", value: "Medium" },
      ],
      aiNote: "The workspace position is differentiated, but mention why generic tools are not enough.",
      mentorRisk: "Why not just use Notion, Canva, or ChatGPT?",
      suggestedFix: {
        whatToChange: "Explain why generic tools do not solve readiness as a workflow.",
        whyThisMatters: "Mentors will compare Kizuna against Notion, Canva, and ChatGPT unless the differentiation is explicit.",
        howToImprove: "Contrast document creation with measurable mentor-readiness, missing-field detection, and data room preparation.",
        exampleRewrite: "Unlike generic editors, Kizuna measures mentor-readiness and turns missing fields into guided fixes.",
        expectedMentorImpact: "Makes the differentiation defendable without overclaiming technical defensibility.",
      },
      exampleRewrite: "Unlike generic editors, Kizuna measures mentor-readiness and turns missing fields into guided fixes.",
      content: "Kizuna is built around mentor-readiness, not isolated document creation.",
    },
    {
      id: "roadmap",
      name: "Roadmap",
      score: 72,
      status: "good",
      priority: "low",
      effort: "6 minutes",
      estimatedGain: 3,
      breakdown: [
        { label: "Milestones", value: "Good" },
        { label: "Timing", value: "Needs dates" },
        { label: "Risk", value: "Medium" },
      ],
      aiNote: "The roadmap is realistic, but date anchors would make it easier to judge.",
      mentorRisk: "What will be true in 30 days that is not true today?",
      suggestedFix: {
        whatToChange: "Anchor the roadmap to one 30-day pilot milestone and metric.",
        whyThisMatters: "Mentors need to judge whether the next step is realistic and measurable.",
        howToImprove: "Name the pilot size, timeline, and three metrics that prove the workflow is working.",
        exampleRewrite: "Within 30 days, run a 20-founder pilot and measure profile completion, AI review runs, and mentor requests.",
        expectedMentorImpact: "Signals execution discipline and makes the next mentor follow-up concrete.",
      },
      exampleRewrite: "Within 30 days, run a 20-founder pilot and measure profile completion, AI review runs, and mentor requests.",
      content: "Prototype sprint, pilot cohort, mentor review, then university cohort rollout.",
    },
    {
      id: "team",
      name: "Team",
      score: 82,
      status: "strong",
      priority: "low",
      effort: "5 minutes",
      estimatedGain: 2,
      breakdown: [
        { label: "Founder-market fit", value: "Strong" },
        { label: "Execution proof", value: "Medium" },
        { label: "Gaps", value: "Clear" },
      ],
      aiNote: "Team credibility is strong because the university context is direct.",
      mentorRisk: "What can this team build or validate faster than others?",
      suggestedFix: {
        whatToChange: "Add one concrete execution artifact from the team.",
        whyThisMatters: "Founder-market fit is stronger when mentors see the team can already build or validate.",
        howToImprove: "Mention a prototype, user workflow, club partnership, or discovery process already completed.",
        exampleRewrite: "The team has built founder-facing workflows and runs direct discovery through university startup clubs.",
        expectedMentorImpact: "Improves confidence that this team can run the pilot without waiting for a larger organization.",
      },
      exampleRewrite: "The team has built founder-facing workflows and runs direct discovery through university startup clubs.",
      content: "Two student founders with product, design, and community-building experience.",
    },
    {
      id: "mentor-ask",
      name: "Mentor Ask",
      score: 60,
      status: "needs_focus",
      priority: "high",
      effort: "6 minutes",
      estimatedGain: 5,
      breakdown: [
        { label: "Ask clarity", value: "Needs focus" },
        { label: "Urgency", value: "Medium" },
        { label: "Review scope", value: "Unclear" },
      ],
      aiNote: "The deck should ask for a specific mentor review, not general feedback.",
      mentorRisk: "What exact decision do you want the mentor to help with?",
      suggestedFix: {
        whatToChange: "Turn the ask from general feedback into one decision mentors can help make.",
        whyThisMatters: "A specific ask makes mentor review useful and prevents the session from becoming vague advice.",
        howToImprove: "Name the review topic, the decision deadline, and what kind of feedback would change the plan.",
        exampleRewrite: "We need mentor feedback on beachhead customer focus and the first university cohort pricing model.",
        expectedMentorImpact: "Gives mentors a clear place to help and makes the founder look prepared.",
      },
      exampleRewrite: "We need mentor feedback on beachhead customer focus and the first university cohort pricing model.",
      content: "",
    },
  ],
  generatedSlides: [],
  deckGenerated: false,
  deckSentToDataRoom: false,
  reviewHasRun: false,
  activity: [
    { id: "pitch-a1", message: "First pitch draft created from workspace data.", timestamp: "10:30", type: "pitch" },
  ],
};

export const defaultFounderWorkspaceDemoState: FounderWorkspaceDemoState = {
  profile: {
    name: "Kizuna Hub",
    tagline: "AI-powered incubation workspace for student founders.",
    industry: "AI / EdTech / Startup Infrastructure",
    stage: "Pre-seed",
    problem: "Student founders struggle to turn raw ideas into mentor-ready startup profiles.",
    solution: "A guided workspace combines profile completion, AI readiness review, milestones, data room prep, and mentor matching.",
    targetCustomer: "University founders preparing for incubators, demo days, and early mentor review.",
    businessModel: "",
    team: "Two student founders with product, design, and community-building experience.",
    traction: "120 founders waitlisted across three university startup clubs.",
    supportNeed: "",
  },
  profileCompletion: 82,
  aiReadinessScore: 78,
  dataRoomReadiness: 60,
  pitchDeckStatus: "draft",
  mentorRequestStatus: "locked",
  checklistItems: [
    { id: "profile", label: "Complete startup profile", status: "active", reason: "Business model and support need are still missing." },
    { id: "ai", label: "Run AI pitch review", status: "active" },
    { id: "documents", label: "Prepare data room documents", status: "active" },
    { id: "milestone", label: "Advance current milestone", status: "active" },
    { id: "mentor", label: "Request mentor feedback", status: "locked", reason: "Reach 80% profile, 85% AI readiness, 80% data room readiness, a generated deck, and a clear mentor ask first." },
  ],
  documents: [
    { id: "pitch-deck", name: "Pitch Deck", status: "ready", required: true, source: "ai_pitch", sourceLabel: "Generated by AI Pitch Readiness" },
    { id: "business-model", name: "Business Model Canvas", status: "missing", required: true, source: "missing", sourceLabel: "Missing from startup intake" },
    { id: "financial-snapshot", name: "Financial Snapshot", status: "draft", required: false, source: "workspace_data", sourceLabel: "Created from traction notes" },
    { id: "product-screenshots", name: "Product Screenshots", status: "ready", required: true, source: "manual_mock", sourceLabel: "Added manually / mock upload" },
    { id: "founder-team", name: "Founder Team Profile", status: "missing", required: true, source: "missing", sourceLabel: "Missing team details" },
  ],
  milestones: [
    { id: "idea", name: "Idea validation", status: "completed", progress: 100, targetPeriod: "Completed", nextAction: "Use validation notes in the pitch deck." },
    { id: "customer", name: "Customer discovery", status: "completed", progress: 100, targetPeriod: "Completed", nextAction: "Summarize interview patterns." },
    { id: "prototype", name: "Prototype / MVP", status: "active", progress: 65, targetPeriod: "This week", nextAction: "Attach product screenshots and MVP scope." },
    { id: "traction", name: "Early traction", status: "locked", progress: 25, targetPeriod: "Next 30 days", nextAction: "Add pilot metrics after MVP review." },
    { id: "mentor", name: "Mentor review", status: "locked", progress: 0, targetPeriod: "After readiness gate", nextAction: "Request review when profile, AI, and data room are ready." },
    { id: "pitch", name: "Pitch readiness", status: "locked", progress: 0, targetPeriod: "Demo day", nextAction: "Use mentor feedback to finalize the deck." },
  ],
  recentActivity: [
    { id: "a1", type: "ai", message: "AI flagged missing support need and revenue model details.", timestamp: "10:42" },
    { id: "a2", type: "mentor", message: "Mentor match updated: Dr. Alex Chen is the strongest fit.", timestamp: "09:18" },
    { id: "a3", type: "data-room", message: "Pitch Deck and Product Screenshots marked ready.", timestamp: "Yesterday" },
    { id: "a4", type: "milestone", message: "Prototype / MVP milestone moved to 65%.", timestamp: "Yesterday" },
    { id: "a5", type: "profile", message: "Startup profile completion reached 82%.", timestamp: "2 days ago" },
  ],
  pitchReadiness: defaultPitchReadinessState,
};

export const founderWorkspaceStorageKey = "kizuna-founder-workspace-demo-state-v1";
export const founderProjectDemoStoreKey = "kizuna-founder-project-demo-store-v1";
const supportedStaticProjectIds = new Set(["p1", "p2", "p3"]);

function cloneDefaultWorkspaceState(): FounderWorkspaceDemoState {
  return JSON.parse(JSON.stringify(defaultFounderWorkspaceDemoState)) as FounderWorkspaceDemoState;
}

export function isSupportedStaticDemoProjectId(projectId?: string) {
  return Boolean(projectId && supportedStaticProjectIds.has(projectId));
}

function createMissingProjectState(projectId?: string): FounderWorkspaceDemoState {
  const missingState = cloneDefaultWorkspaceState();

  return applyReadinessGates({
    ...missingState,
    profile: {
      name: "Project workspace not found",
      tagline: projectId ? `No demo workspace exists for "${projectId}".` : "Create a startup intake to open a workspace.",
      industry: "",
      stage: "",
      problem: "",
      solution: "",
      targetCustomer: "",
      businessModel: "",
      team: "",
      traction: "",
      supportNeed: "",
    },
    profileCompletion: 0,
    aiReadinessScore: 0,
    dataRoomReadiness: 0,
    pitchDeckStatus: "missing",
    mentorRequestStatus: "locked",
    documents: missingState.documents.map((document) => ({ ...document, status: "missing" as const, source: "missing" as const })),
    recentActivity: [
      {
        id: "missing-project",
        type: "system",
        message: "No workspace state was found for this project id.",
        timestamp: "Just now",
      },
    ],
    pitchReadiness: {
      ...missingState.pitchReadiness,
      overallScore: 0,
      projectedScore: 0,
      status: "early_draft",
      generatedSlides: [],
      deckGenerated: false,
      deckSentToDataRoom: false,
      reviewHasRun: false,
    },
  });
}

function isReadyLikeDocumentStatus(status: DocumentStatus) {
  return status === "ready" || status === "generated" || status === "shared";
}

function isManualDocumentStatus(status?: DocumentStatus) {
  return status === "ready" || status === "generated" || status === "shared";
}

function mergeDocumentState(
  base: FounderWorkspaceDemoState["documents"][number],
  existing?: FounderWorkspaceDemoState["documents"][number],
  options?: { forceStatus?: boolean }
): FounderWorkspaceDemoState["documents"][number] {
  if (!existing) return base;
  const preserveManual =
    !options?.forceStatus &&
    isManualDocumentStatus(existing.status) &&
    !isReadyLikeDocumentStatus(base.status);

  return {
    ...base,
    ...existing,
    name: base.name,
    description: base.description,
    required: base.required,
    status: preserveManual ? existing.status : base.status,
    source: preserveManual ? existing.source ?? "manual_mock" : base.source,
    sourceLabel: preserveManual ? existing.sourceLabel ?? "Added manually / mock upload" : base.sourceLabel,
    actionLabel: base.actionLabel,
    route: base.route,
    metadata: {
      ...(base.metadata ?? {}),
      ...(existing.metadata ?? {}),
    },
  };
}

export function normalizeDataRoomDocuments(state: FounderWorkspaceDemoState): FounderWorkspaceDemoState["documents"] {
  const existingById = new Map(state.documents.map((document) => [document.id, document]));
  const submission = state.submission;
  const pitchDeckShared =
    state.pitchDeckStatus === "shared" ||
    state.pitchReadiness.deckSentToDataRoom ||
    existingById.get("pitch-deck")?.status === "shared";
  const pitchDeckGenerated =
    pitchDeckShared ||
    state.pitchDeckStatus === "generated" ||
    state.pitchReadiness.deckGenerated ||
    state.pitchReadiness.generatedSlides.length > 0 ||
    existingById.get("pitch-deck")?.status === "generated";
  const hasProblemBrief = Boolean(state.profile.problem.trim() && state.profile.solution.trim() && state.profile.targetCustomer.trim());
  const businessModel = state.profile.businessModel.trim();
  const businessModelKnown = Boolean(businessModel && businessModel.toLowerCase() !== "not sure yet");
  const demoLink = submission?.demoLink?.trim();
  const hasGallery = (submission?.gallery?.length ?? 0) > 0;
  const hasTeam = Boolean(state.profile.team.trim() || (submission?.team?.length ?? 0) > 0);
  const pitchDraft = state.pitchDraft ?? submission?.pitchDraft;

  const baseDocuments: FounderWorkspaceDemoState["documents"] = [
    {
      id: "pitch-deck",
      name: "Pitch Deck",
      description: pitchDeckShared
        ? "Mentor-ready deck is in the Data Room."
        : pitchDeckGenerated
          ? "Generated by AI Pitch Readiness and ready to share."
          : "No mentor-ready deck yet. Generate one in AI Pitch Readiness, then send it here.",
      status: pitchDeckShared ? "shared" : pitchDeckGenerated ? "generated" : state.pitchReadiness.reviewHasRun ? "draft" : "missing",
      required: true,
      source: pitchDeckGenerated ? "ai_pitch" : "missing",
      sourceLabel: pitchDeckGenerated ? "Generated by AI Pitch Readiness" : "Missing from AI Pitch",
      actionLabel: pitchDeckGenerated ? "Open AI Pitch" : "Generate deck",
      route: "ai-pitch-deck",
    },
    {
      id: "founder-team",
      name: "Founder Team Profile",
      description: hasTeam
        ? "Team context is complete enough for mentor review."
        : "Add at least one founder name and role in the startup profile.",
      status: hasTeam ? "ready" : "missing",
      required: true,
      source: hasTeam ? "submit_project" : "missing",
      sourceLabel: hasTeam ? "Seeded from Submit Project" : "Missing team details",
      actionLabel: hasTeam ? "Review team info" : "Add team info",
      route: "",
    },
    {
      id: "business-model",
      name: "Business Model Canvas",
      description: businessModelKnown
        ? "Business model assumption is ready for mentor discussion."
        : businessModel
          ? "Business model is still an assumption. That is acceptable early, but mentors will ask what you plan to validate."
          : "Add a first business model assumption.",
      status: businessModelKnown ? "ready" : businessModel ? "draft" : "missing",
      required: true,
      source: businessModel ? "submit_project" : "missing",
      sourceLabel: businessModel ? "Seeded from startup intake" : "Missing from startup intake",
      actionLabel: "Review business model",
      route: "",
    },
    {
      id: "problem-solution",
      name: "Problem-Solution Brief",
      description: hasProblemBrief
        ? "Problem, solution, and target customer are available from the workspace profile."
        : "Add problem, solution, and target customer before mentor review.",
      status: hasProblemBrief ? "ready" : state.profile.problem || state.profile.solution ? "draft" : "missing",
      required: true,
      source: hasProblemBrief ? "workspace_data" : "missing",
      sourceLabel: hasProblemBrief ? "Created from workspace profile" : "Missing profile fields",
      actionLabel: "Review profile",
      route: "",
    },
    {
      id: "product-demo",
      name: "Prototype Demo",
      description: demoLink
        ? "Prototype/demo link was captured during Submit Project."
        : state.profile.stage.toLowerCase().includes("idea")
          ? "Prototype Demo is optional for idea stage. A clear problem-solution brief matters more right now."
          : "Prototype Demo is missing. A demo link helps mentors evaluate product progress.",
      status: demoLink ? "ready" : "missing",
      required: true,
      source: demoLink ? "submit_project" : "missing",
      sourceLabel: demoLink ? "Linked from Submit Project" : "Missing from current intake",
      actionLabel: demoLink ? "Open demo context" : "Add mock demo link",
      route: "",
      metadata: demoLink ? { detail: demoLink } : undefined,
    },
    {
      id: "product-screenshots",
      name: "Product Screenshots",
      description: hasGallery
        ? "Screenshots were supplied during Submit Project."
        : state.profile.stage.toLowerCase().includes("idea")
          ? "Screenshots are optional for now. They can be prepared later when the prototype is clearer."
          : "Product Screenshots are missing. They help mentors understand the product faster.",
      status: hasGallery ? "ready" : "missing",
      required: true,
      source: hasGallery ? "submit_project" : "missing",
      sourceLabel: hasGallery ? "Seeded from Submit Project gallery" : "Missing from current intake",
      actionLabel: "Add mock screenshot",
      route: "",
      metadata: hasGallery ? { detail: `${submission?.gallery?.length ?? 0} screenshot asset(s)` } : undefined,
    },
    {
      id: "financial-snapshot",
      name: "Financial Snapshot",
      description: state.profile.traction
        ? "Optional financial/traction note exists but may need a cleaner snapshot later."
        : "Optional until revenue or cost assumptions are clearer.",
      status: state.profile.traction ? "draft" : "missing",
      required: false,
      source: state.profile.traction ? "workspace_data" : "missing",
      sourceLabel: state.profile.traction ? "Created from traction notes" : "Optional later",
      actionLabel: "Prepare later",
      route: "",
    },
    {
      id: "market-research",
      name: "Market Research Notes",
      description: state.profile.targetCustomer ? "Target customer context is available as a starter note." : "Optional research notes can be added later.",
      status: state.profile.targetCustomer ? "draft" : "missing",
      required: false,
      source: state.profile.targetCustomer ? "workspace_data" : "missing",
      sourceLabel: state.profile.targetCustomer ? "Created from workspace profile" : "Optional later",
      actionLabel: "Prepare later",
      route: "",
    },
    {
      id: "pitch-draft",
      name: "Pitch Draft",
      description: pitchDraft
        ? "Pitch draft metadata is available. Raw file contents are not stored in this demo."
        : "Optional source material for AI Pitch Readiness.",
      status: pitchDraft ? "draft" : "missing",
      required: false,
      source: pitchDraft ? "submit_project" : "missing",
      sourceLabel: pitchDraft ? "Metadata from Submit Project" : "No draft metadata",
      actionLabel: pitchDraft ? "Open AI Pitch" : "Add in AI Pitch",
      route: "ai-pitch-deck",
      metadata: pitchDraft
        ? { fileName: pitchDraft.name, fileType: pitchDraft.type, fileSize: pitchDraft.size }
        : undefined,
    },
    {
      id: "user-interviews",
      name: "User Interview Notes",
      description: state.profile.traction.toLowerCase().includes("interview")
        ? "Interview signal appears in traction notes."
        : "Optional notes can be added after more customer discovery.",
      status: state.profile.traction.toLowerCase().includes("interview") ? "draft" : "missing",
      required: false,
      source: state.profile.traction.toLowerCase().includes("interview") ? "workspace_data" : "missing",
      sourceLabel: state.profile.traction.toLowerCase().includes("interview") ? "Created from traction notes" : "Optional later",
      actionLabel: "Prepare later",
      route: "",
    },
  ];

  return baseDocuments.map((document) =>
    mergeDocumentState(document, existingById.get(document.id), {
      forceStatus: document.id === "pitch-deck",
    })
  );
}

function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 42);
}

function stableHash(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash.toString(36).slice(0, 5);
}

export function createSubmitProjectId(projectName: string) {
  const normalizedName = projectName.trim() || "untitled-startup";
  return `${toSlug(normalizedName) || "startup"}-${stableHash(normalizedName)}`;
}

function summarizeTeam(team: SubmitProjectTeamMember[]) {
  const visibleMembers = team
    .filter((member) => member.name.trim() || member.role.trim())
    .map((member) => [member.name.trim(), member.role.trim()].filter(Boolean).join(" - "));

  return visibleMembers.length > 0 ? visibleMembers.join("; ") : "";
}

function inferMilestones(stage: string): FounderWorkspaceDemoState["milestones"] {
  const normalizedStage = stage.toLowerCase();
  const isProduction = normalizedStage.includes("production");
  const isMvp = normalizedStage.includes("mvp") || isProduction;

  return [
    {
      id: "idea",
      name: "Idea validation",
      status: "completed",
      progress: 100,
      targetPeriod: "Completed",
      nextAction: "Use the submitted problem and solution in the pitch review.",
    },
    {
      id: "customer",
      name: "Customer discovery",
      status: isMvp ? "completed" : "active",
      progress: isMvp ? 100 : 45,
      targetPeriod: isMvp ? "Completed" : "This week",
      nextAction: isMvp ? "Summarize target-customer evidence." : "Interview 3 target customers before mentor review.",
    },
    {
      id: "prototype",
      name: "Prototype / MVP",
      status: isMvp ? "active" : "locked",
      progress: isProduction ? 85 : isMvp ? 65 : 15,
      targetPeriod: isMvp ? "This week" : "After customer discovery",
      nextAction: isMvp ? "Attach product screenshots and demo link." : "Define the smallest prototype scope.",
    },
    {
      id: "traction",
      name: "Early traction",
      status: isProduction ? "active" : "locked",
      progress: isProduction ? 55 : 0,
      targetPeriod: isProduction ? "Next 30 days" : "After MVP validation",
      nextAction: "Add one metric, source, and time period for mentor review.",
    },
    {
      id: "mentor",
      name: "Mentor review",
      status: "locked",
      progress: 0,
      targetPeriod: "After readiness gate",
      nextAction: "Request review when profile, AI, deck, and data room are ready.",
    },
    {
      id: "pitch",
      name: "Pitch readiness",
      status: "locked",
      progress: 0,
      targetPeriod: "Demo day",
      nextAction: "Run AI readiness review and generate the deck.",
    },
  ];
}

function milestoneNameFromSubmission(value?: string) {
  const map: Record<string, string> = {
    idea_validation: "Idea validation",
    customer_discovery: "Customer discovery",
    prototype: "Prototype / MVP",
    pilot: "Pilot / early users",
    mentor_review: "Mentor review",
  };
  return value ? map[value] ?? value : undefined;
}

function scoreFromField(value: string, presentScore: number, missingScore: number) {
  return value.trim().length > 0 ? presentScore : missingScore;
}

function buildPitchReadinessFromSubmission(
  submission: SubmitProjectSubmission,
  profile: StartupProfile,
  seededScore: number
): PitchReadinessDemoState {
  const targetCustomer = profile.targetCustomer || "the first reachable customer segment";
  const businessModel = profile.businessModel || "the first revenue path";
  const traction = profile.traction || "early validation evidence";
  const supportNeed = profile.supportNeed || "a focused mentor review ask";

  const scoringBreakdown: PitchReadinessDemoState["scoringBreakdown"] = [
    {
      id: "problem",
      label: "Problem clarity",
      weight: 15,
      score: scoreFromField(profile.problem, 80, 42),
      statusLabel: profile.problem ? "Submitted" : "Missing",
      aiNote: profile.problem ? "The submitted problem gives the review a starting point." : "The problem statement needs to be separated from the general description.",
      improvementHint: "State the painful moment and who experiences it.",
    },
    {
      id: "solution",
      label: "Solution clarity",
      weight: 15,
      score: scoreFromField(profile.solution, 78, 42),
      statusLabel: profile.solution ? "Submitted" : "Missing",
      aiNote: profile.solution ? "The solution can be turned into a workflow slide." : "The solution summary is missing.",
      improvementHint: "Describe the first action a customer completes.",
    },
    {
      id: "customer",
      label: "Target customer focus",
      weight: 15,
      score: scoreFromField(profile.targetCustomer, 76, 45),
      statusLabel: profile.targetCustomer ? "Focused" : "Needs focus",
      aiNote: profile.targetCustomer ? `The first customer is framed as ${targetCustomer}.` : "Mentors will need a specific beachhead customer.",
      improvementHint: "Name one reachable segment before expanding.",
    },
    {
      id: "evidence",
      label: "Evidence / traction",
      weight: 15,
      score: scoreFromField(profile.traction, 70, 45),
      statusLabel: profile.traction ? "Has signal" : "Needs evidence",
      aiNote: profile.traction ? "The traction note can support a credibility slide." : "Add one validation signal before asking for review.",
      improvementHint: "Include metric, source, and time period.",
    },
    {
      id: "business",
      label: "Business model logic",
      weight: 10,
      score: scoreFromField(profile.businessModel, 72, 40),
      statusLabel: profile.businessModel ? "Submitted" : "Needs clarity",
      aiNote: profile.businessModel ? `The submitted model is ${businessModel}.` : "The buyer and pricing path are not yet clear.",
      improvementHint: "State who pays first and why.",
    },
    {
      id: "competition",
      label: "Competitive differentiation",
      weight: 10,
      score: 66,
      statusLabel: "Needs compare",
      aiNote: "The submission does not yet include a clear alternative/comparison story.",
      improvementHint: "Contrast against the current workaround customers use.",
    },
    {
      id: "team",
      label: "Team credibility",
      weight: 10,
      score: scoreFromField(profile.team, 74, 42),
      statusLabel: profile.team ? "Submitted" : "Missing",
      aiNote: profile.team ? "Team details are available for a credibility slide." : "Team summary is required for mentor review.",
      improvementHint: "Show each member's role and relevant proof.",
    },
    {
      id: "roadmap",
      label: "Roadmap realism",
      weight: 5,
      score: profile.stage ? 68 : 45,
      statusLabel: profile.stage ? "Stage set" : "Needs stage",
      aiNote: profile.stage ? `The project stage is ${profile.stage}.` : "Stage is missing, so the next milestone is unclear.",
      improvementHint: "Anchor the next 30-day milestone.",
    },
    {
      id: "ask",
      label: "Mentor ask clarity",
      weight: 5,
      score: scoreFromField(profile.supportNeed, 74, 38),
      statusLabel: profile.supportNeed ? "Submitted" : "Needs ask",
      aiNote: profile.supportNeed ? `The support need is: ${supportNeed}` : "Mentor ask is not explicit yet.",
      improvementHint: "Ask for feedback on one decision.",
    },
  ];

  const slideDiagnosis = defaultPitchReadinessState.slideDiagnosis.map((slide) => {
    const contentMap: Record<string, string> = {
      problem: profile.problem,
      solution: profile.solution,
      market: profile.targetCustomer,
      traction: profile.traction,
      business: profile.businessModel,
      team: profile.team,
      "mentor-ask": profile.supportNeed,
    };
    const seededContent = contentMap[slide.id] ?? slide.content;
    const hasContent = seededContent.trim().length > 0;

    return {
      ...slide,
      score: hasContent ? Math.max(slide.score, 70) : Math.min(slide.score, 48),
      status: hasContent ? slide.status : ("needs_clarity" as const),
      content: seededContent || slide.content,
      aiNote: hasContent
        ? `Seeded from the submitted ${submission.projectName} intake. ${slide.aiNote}`
        : `This section needs input from the submitted project before mentor review.`,
    };
  });

  return {
    ...defaultPitchReadinessState,
    source: "workspace_data",
    overallScore: seededScore,
    projectedScore: Math.min(92, seededScore + 14),
    status: seededScore >= 84 ? "strong_fit" : seededScore >= 72 ? "promising" : "good_start",
    confidence: seededScore >= 78 ? "medium_high" : "medium",
    mentorVerdict: `${submission.projectName || "This startup"} has enough intake data to begin AI review. Mentors will still expect clearer evidence, business logic, and a focused ask before the review request is sent.`,
    estimatedTimeToReady: seededScore >= 78 ? "20-30 minutes" : "35-45 minutes",
    nextBestAction: "Run AI readiness review",
    strengths: [
      profile.problem ? "Problem statement was captured during project submission." : "Startup identity was captured during project submission.",
      profile.solution ? "Solution summary is ready to convert into slides." : "Submission can be expanded into a solution narrative.",
      profile.targetCustomer ? "Target customer context is available for mentor matching." : "The workspace can guide customer focus next.",
    ],
    criticalGaps: [
      {
        id: "traction-proof",
        label: profile.traction ? "Traction proof needs source and time period" : "Add one traction or validation signal",
        impact: "high",
        effortMinutes: 12,
        estimatedGain: 6,
        completed: false,
      },
      {
        id: "mentor-ask",
        label: profile.supportNeed ? "Make the mentor ask more decision-focused" : "Add a mentor ask / support need",
        impact: "high",
        effortMinutes: 6,
        estimatedGain: 5,
        completed: false,
      },
      {
        id: "business-logic",
        label: profile.businessModel ? "Clarify first buyer and pricing logic" : "Choose the first business model",
        impact: "medium",
        effortMinutes: 8,
        estimatedGain: 5,
        completed: false,
      },
    ],
    quickWins: [
      { id: "customer-example", label: `Add one example from ${targetCustomer}`, estimatedGain: 6, completed: false },
      { id: "traction-context", label: `Turn "${traction}" into metric + source + period`, estimatedGain: 6, completed: false },
      { id: "mentor-decision", label: `Convert "${supportNeed}" into one mentor decision`, estimatedGain: 5, completed: false },
    ],
    mentorRiskQuestions: [
      `Who exactly experiences the problem for ${submission.projectName}?`,
      "What proof shows this problem is painful now?",
      `Why is ${businessModel} the first viable revenue path?`,
      "What can a mentor decide or challenge in the next session?",
      "Which document should mentors read first in the data room?",
    ],
    scoringBreakdown,
    slideDiagnosis,
    generatedSlides: [],
    deckGenerated: false,
    deckSentToDataRoom: false,
    reviewHasRun: false,
    activity: [
      { id: "pitch-submission-seed", message: "Pitch draft created from submitted project data.", timestamp: "Just now", type: "pitch" },
    ],
  };
}

export function createFounderWorkspaceStateFromSubmission(submission: SubmitProjectSubmission): FounderWorkspaceDemoState {
  const teamSummary = summarizeTeam(submission.team);
  const evidenceSummary = [
    ...(submission.evidenceSignals ?? []),
    submission.traction?.trim() ?? "",
  ].filter(Boolean).join("; ");
  const supportNeed = [
    ...(submission.supportNeeds ?? []),
    submission.supportNeed?.trim() ?? "",
    submission.mentorAsk?.trim() ?? "",
  ].filter(Boolean).join("; ");
  const profile: StartupProfile = {
    name: submission.projectName.trim(),
    tagline: submission.slogan.trim(),
    industry: submission.categories.filter(Boolean).join(" / "),
    stage: submission.stage.trim(),
    problem: submission.problem.trim(),
    solution: submission.solution.trim(),
    targetCustomer: submission.targetAudience.trim(),
    businessModel: submission.businessModel.trim(),
    team: teamSummary,
    traction: evidenceSummary,
    supportNeed,
  };

  const profileCompletion = calculateProfileCompletion(profile);
  const aiReadinessScore = Math.max(58, Math.min(82, profileCompletion - 8 + (profile.traction ? 4 : 0)));

  const milestones = inferMilestones(profile.stage);
  const submittedMilestone = milestoneNameFromSubmission(submission.currentMilestone);

  const state: FounderWorkspaceDemoState = {
    ...cloneDefaultWorkspaceState(),
    submission,
    profile,
    profileCompletion,
    aiReadinessScore,
    dataRoomReadiness: 0,
    pitchDeckStatus: "missing",
    pitchDraft: submission.pitchDraft,
    mentorRequestStatus: "locked",
    checklistItems: [
      { id: "profile", label: "Complete startup profile", status: profileCompletion >= 90 ? "completed" : "active" },
      { id: "ai", label: "Run AI pitch review", status: "active" },
      { id: "documents", label: "Prepare data room documents", status: "active" },
      { id: "milestone", label: "Advance current milestone", status: "active" },
      { id: "mentor", label: "Request mentor feedback", status: "locked", reason: "Complete profile, AI, deck, data room, and mentor ask gates first." },
    ],
    documents: [],
    milestones: submittedMilestone
      ? milestones.map((milestone) =>
          milestone.name === submittedMilestone
            ? { ...milestone, status: "active" as const, progress: Math.max(milestone.progress, 50), nextAction: "Use this as the first mentor-review milestone." }
            : milestone
        )
      : milestones,
    recentActivity: [
      { id: "submission-created", type: "profile", message: "Project submitted and workspace created.", timestamp: "Just now" },
      { id: "submission-profile", type: "profile", message: `Startup profile seeded for ${profile.name}.`, timestamp: "Just now" },
      ...cloneDefaultWorkspaceState().recentActivity.slice(0, 3),
    ],
    pitchReadiness: buildPitchReadinessFromSubmission(submission, profile, aiReadinessScore),
  };

  const documents = normalizeDataRoomDocuments(state);
  return applyReadinessGates({
    ...state,
    documents,
    dataRoomReadiness: calculateDataRoomReadiness(documents),
  });
}

export function calculateProfileCompletion(profile: StartupProfile) {
  const completed = requiredProfileFields.filter(({ key }) => profile[key].trim().length > 0).length;
  return Math.round((completed / requiredProfileFields.length) * 100);
}

export function calculateDataRoomReadiness(documents: FounderWorkspaceDemoState["documents"]) {
  const requiredDocuments = documents.filter((document) => document.required !== false);
  const totalRequired = requiredDocuments.length || documents.length || 1;
  const score = (requiredDocuments.length ? requiredDocuments : documents).reduce((total, document) => {
    if (isReadyLikeDocumentStatus(document.status)) return total + 1;
    return total;
  }, 0);
  return Math.round((score / totalRequired) * 100);
}

export function getMissingProfileFields(profile: StartupProfile) {
  return requiredProfileFields.filter(({ key }) => !profile[key].trim()).map(({ label }) => label);
}

export function addActivity(
  state: FounderWorkspaceDemoState,
  type: string,
  message: string
): FounderWorkspaceDemoState["recentActivity"] {
  if (state.recentActivity[0]?.type === type && state.recentActivity[0]?.message === message) {
    return state.recentActivity;
  }
  return [
    { id: `${type}-${Date.now()}`, type, message, timestamp: "Just now" },
    ...state.recentActivity.filter((activity) => !(activity.type === type && activity.message === message)),
  ].slice(0, 8);
}

export function addUniqueActivity(
  state: FounderWorkspaceDemoState,
  type: string,
  message: string
): FounderWorkspaceDemoState["recentActivity"] {
  const alreadyExists = state.recentActivity.some((activity) => activity.type === type && activity.message === message);
  return alreadyExists ? state.recentActivity : addActivity(state, type, message);
}

export function markMentorReviewRequestSent(
  state: FounderWorkspaceDemoState,
  mentorName?: string
): FounderWorkspaceDemoState {
  const message = "Mentor review request sent.";
  return {
    ...state,
    mentorRequestStatus: "sent",
    recentActivity: addUniqueActivity(state, "mentor_request", message),
    pitchReadiness: {
      ...state.pitchReadiness,
      activity: [
        {
          id: `mentor-request-${Date.now()}`,
          message: mentorName ? `Mentor packet sent to ${mentorName}.` : message,
          timestamp: "Just now",
          type: "mentor_request",
        },
        ...state.pitchReadiness.activity.filter((activity) => activity.message !== message),
      ].slice(0, 8),
    },
  };
}

function readProjectDemoStore(): FounderProjectDemoStore {
  if (typeof window === "undefined") return { projects: [] };

  try {
    const stored = window.localStorage.getItem(founderProjectDemoStoreKey);
    if (!stored) return { projects: [] };
    const parsed = JSON.parse(stored) as Partial<FounderProjectDemoStore>;
    return {
      activeProjectId: parsed.activeProjectId,
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
    };
  } catch {
    return { projects: [] };
  }
}

function writeProjectDemoStore(store: FounderProjectDemoStore) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(founderProjectDemoStoreKey, JSON.stringify(store));
}

export function loadFounderProjectDemoStore() {
  return readProjectDemoStore();
}

export function saveFounderProjectDemoStore(store: FounderProjectDemoStore) {
  writeProjectDemoStore(store);
}

export function upsertFounderDemoProject(project: FounderProjectDemoStore["projects"][number]) {
  const store = readProjectDemoStore();
  const projects = [
    project,
    ...store.projects.filter((item) => item.id !== project.id),
  ].slice(0, 12);

  writeProjectDemoStore({
    activeProjectId: project.id,
    projects,
  });
}

export function getFounderWorkspaceStateByProjectId(projectId: string) {
  const project = readProjectDemoStore().projects.find((item) => item.id === projectId);
  return project?.workspaceState;
}

export function updateFounderWorkspaceStateByProjectId(projectId: string, workspaceState: FounderWorkspaceDemoState) {
  const store = readProjectDemoStore();
  const projects = store.projects.map((project) =>
    project.id === projectId
      ? { ...project, workspaceState, createdAt: project.createdAt }
      : project
  );

  if (projects.some((project) => project.id === projectId)) {
    writeProjectDemoStore({ ...store, activeProjectId: projectId, projects });
  }
}

function normalizePitchReadiness(pitch?: Partial<PitchReadinessDemoState>): PitchReadinessDemoState {
  const merged = {
    ...defaultPitchReadinessState,
    ...(pitch ?? {}),
  } as PitchReadinessDemoState;

  const slideDiagnosis = defaultPitchReadinessState.slideDiagnosis.map((defaultSlide) => {
    const storedSlide = pitch?.slideDiagnosis?.find((slide) => slide.id === defaultSlide.id);
    if (!storedSlide) return defaultSlide;

    const storedSuggestedFix = storedSlide.suggestedFix as unknown;
    const suggestedFix =
      typeof storedSuggestedFix === "string"
        ? defaultSlide.suggestedFix
        : {
            ...defaultSlide.suggestedFix,
            ...(typeof storedSuggestedFix === "object" && storedSuggestedFix
              ? (storedSuggestedFix as Partial<SlideSuggestedFix>)
              : {}),
          };

    return {
      ...defaultSlide,
      ...storedSlide,
      suggestedFix,
    };
  });

  return {
    ...merged,
    source: merged.source === "imported_draft" ? "pasted_draft" : merged.source,
    slideDiagnosis,
  };
}

export function getMentorReadinessGate(state: FounderWorkspaceDemoState): MentorReadinessGate {
  const pitchReadiness = normalizePitchReadiness(state.pitchReadiness);
  const deckReady =
    state.pitchDeckStatus === "generated" ||
    state.pitchDeckStatus === "shared" ||
    pitchReadiness.deckGenerated ||
    pitchReadiness.deckSentToDataRoom ||
    pitchReadiness.generatedSlides.length > 0;
  const hasMentorAsk = state.profile.supportNeed.trim().length > 0;
  const blockers: MentorReadinessBlocker[] = [];

  if (state.profileCompletion < 80) {
    blockers.push({
      id: "profile",
      label: "Complete startup profile",
      current: `${state.profileCompletion}%`,
      required: "80%",
      actionLabel: "Edit profile",
      route: "",
    });
  }

  if (state.aiReadinessScore < 85) {
    blockers.push({
      id: "ai",
      label: "Run AI Pitch Readiness Review",
      current: `${state.aiReadinessScore}%`,
      required: "85%",
      actionLabel: "Open AI Pitch",
      route: "ai-pitch-deck",
    });
  }

  if (state.dataRoomReadiness < 80) {
    blockers.push({
      id: "data_room",
      label: "Prepare Data Room documents",
      current: `${state.dataRoomReadiness}%`,
      required: "80%",
      actionLabel: "Open Data Room",
      route: "data-room",
    });
  }

  if (!deckReady) {
    blockers.push({
      id: "pitch_deck",
      label: "Generate mentor-ready pitch deck",
      current: state.pitchDeckStatus,
      required: "generated or shared",
      actionLabel: "Generate deck",
      route: "ai-pitch-deck",
    });
  }

  if (!hasMentorAsk) {
    blockers.push({
      id: "mentor_ask",
      label: "Add mentor ask / support need",
      current: "missing",
      required: "clear ask",
      actionLabel: "Edit profile",
      route: "",
    });
  }

  const status = state.mentorRequestStatus === "sent" ? "sent" : blockers.length === 0 ? "ready" : "locked";

  return {
    status,
    canRequest: status === "ready",
    blockers,
  };
}

export function applyReadinessGates(state: FounderWorkspaceDemoState): FounderWorkspaceDemoState {
  const normalizedPitchReadiness = normalizePitchReadiness(state.pitchReadiness);
  const documents = normalizeDataRoomDocuments({
    ...state,
    pitchReadiness: normalizedPitchReadiness,
  });
  const normalizedState = {
    ...state,
    pitchReadiness: normalizedPitchReadiness,
    documents,
    dataRoomReadiness: calculateDataRoomReadiness(documents),
  };
  const gate = getMentorReadinessGate(normalizedState);

  const checklistItems = normalizedState.checklistItems.map((item) => {
    if (item.id === "profile") {
      return normalizedState.profileCompletion >= 80
        ? { ...item, status: "completed" as const, reason: undefined }
        : { ...item, status: "active" as const, reason: "Complete the remaining startup profile fields." };
    }
    if (item.id === "ai") {
      return normalizedState.aiReadinessScore >= 85
        ? { ...item, status: "completed" as const, reason: undefined }
        : { ...item, status: "active" as const };
    }
    if (item.id === "documents") {
      return normalizedState.dataRoomReadiness >= 80
        ? { ...item, status: "completed" as const, reason: undefined }
        : { ...item, status: "active" as const, reason: "Prepare missing documents before sharing." };
    }
    if (item.id === "mentor") {
      if (gate.status === "sent") return { ...item, status: "completed" as const, reason: undefined };
      return gate.canRequest
        ? { ...item, status: "active" as const, reason: undefined }
        : { ...item, status: "locked" as const, reason: `Locked: ${gate.blockers.map((blocker) => blocker.label).join(", ")}.` };
    }
    return item;
  });

  return {
    ...normalizedState,
    mentorRequestStatus: gate.status,
    checklistItems,
  };
}

export function useFounderWorkspaceDemoState(projectId?: string) {
  const [state, setState] = React.useState<FounderWorkspaceDemoState>(() => cloneDefaultWorkspaceState());
  const [loaded, setLoaded] = React.useState(false);
  const [projectFound, setProjectFound] = React.useState(true);

  React.useEffect(() => {
    try {
      const projectState = projectId ? getFounderWorkspaceStateByProjectId(projectId) : undefined;
      if (projectState) {
        setProjectFound(true);
        setState(applyReadinessGates({ ...cloneDefaultWorkspaceState(), ...projectState }));
      } else if (projectId && !isSupportedStaticDemoProjectId(projectId)) {
        setProjectFound(false);
        setState(createMissingProjectState(projectId));
      } else if (projectId && isSupportedStaticDemoProjectId(projectId)) {
        setProjectFound(true);
        setState(applyReadinessGates(cloneDefaultWorkspaceState()));
      } else {
        setProjectFound(true);
        const stored = window.localStorage.getItem(founderWorkspaceStorageKey);
        if (stored) {
          setState(applyReadinessGates({ ...cloneDefaultWorkspaceState(), ...JSON.parse(stored) }));
        } else {
          setState(applyReadinessGates(cloneDefaultWorkspaceState()));
        }
      }
    } catch {
      setProjectFound(!projectId || isSupportedStaticDemoProjectId(projectId));
      setState(applyReadinessGates(cloneDefaultWorkspaceState()));
    } finally {
      setLoaded(true);
    }
  }, [projectId]);

  React.useEffect(() => {
    if (!loaded) return;
    if (!projectFound) return;
    if (!projectId) window.localStorage.setItem(founderWorkspaceStorageKey, JSON.stringify(state));
    if (projectId) updateFounderWorkspaceStateByProjectId(projectId, state);
  }, [loaded, projectFound, projectId, state]);

  const updateState = React.useCallback((updater: (state: FounderWorkspaceDemoState) => FounderWorkspaceDemoState) => {
    setState((current) => applyReadinessGates(updater(current)));
  }, []);

  return { state, setState: updateState, loaded, projectFound };
}
