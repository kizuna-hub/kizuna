"use client";

import React from "react";
import {
  AlertCircle,
  ArrowLeft,
  Bot,
  CheckCircle2,
  ChevronDown,
  FileText,
  FileUp,
  Gauge,
  Loader2,
  MessageSquareText,
  PenLine,
  Sparkles,
  Upload,
  Wand2,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  DemoToast,
  type DemoToastState,
  WorkspaceActionModal,
  WorkspaceCard,
  WorkspacePageHeader,
} from "@/features/founder/founder-workspace/workspace-ui";
import {
  addUniqueActivity,
  calculateDataRoomReadiness,
  type FounderWorkspaceDemoState,
  type PitchInputSource,
  type PitchReadinessDemoState,
  type StartupProfile,
  useFounderWorkspaceDemoState,
} from "@/features/founder/founder-workspace/demo-state";
import { SlidePreviewModal } from "@/features/founder/founder-workspace/ai-pitch-deck/slide-preview-modal";
import { cn } from "@/lib/utils";

const reviewSteps = [
  "Reading project submission...",
  "Checking pitch structure...",
  "Checking problem-solution clarity...",
  "Scoring target customer focus...",
  "Looking for traction evidence...",
  "Checking business model logic...",
  "Matching mentor-review rubric...",
  "Preparing slide-by-slide diagnosis...",
];

const deckSteps = [
  "Structuring pitch narrative...",
  "Creating 10-slide outline...",
  "Applying mentor-review rubric...",
  "Writing slide content...",
  "Preparing speaker notes...",
  "Preparing preview...",
];

const uploadAnalyzeSteps = [
  "Uploading file...",
  "Extracting pitch sections...",
  "Detecting slide structure...",
  "Checking mentor-review requirements...",
  "Updating readiness diagnosis...",
];

const pasteAnalyzeSteps = [
  "Reading pasted draft...",
  "Extracting pitch sections...",
  "Detecting slide structure...",
  "Checking mentor-review requirements...",
  "Updating readiness diagnosis...",
];

const topFixSteps = [
  "Prioritizing highest-impact gaps...",
  "Rewriting customer focus...",
  "Adding traction proof...",
  "Clarifying pricing logic...",
  "Updating readiness score...",
];

const interviewQuestions = [
  "Who is your first target user?",
  "What painful problem do they face?",
  "How are they solving it today?",
  "What makes your solution better?",
  "What proof do you already have?",
  "What do you need from a mentor?",
];

const allowedDraftExtensions = [".pdf", ".docx", ".pptx", ".txt"];

const suggestedRiskAnswers: Record<string, string> = {
  "Who exactly is your first customer segment?":
    "University startup club founders preparing for incubator review in Da Nang, because they have a fixed review deadline and can be reached through club coordinators.",
  "What proof shows this problem is painful?":
    "Discovery notes and the waitlist show founders ask for mentor-review templates before they ask for fundraising help, which suggests readiness confusion happens early.",
  "Why would users choose your solution instead of current alternatives?":
    "Kizuna measures readiness against a mentor rubric, while generic editors only help create isolated documents.",
  "How will you reach the first 100 users?":
    "Start with three university startup clubs, run a 20-founder pilot, then ask club leads to invite teams preparing for incubator review.",
  "What do you need from a mentor right now?":
    "We need feedback on beachhead customer focus and first cohort pricing before expanding the pilot.",
};

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function addPitchActivity(pitch: PitchReadinessDemoState, message: string, type = "pitch") {
  return [
    { id: `${type}-${Date.now()}`, message, timestamp: "Just now", type },
    ...pitch.activity,
  ].slice(0, 8);
}

function getStatusLabel(score: number) {
  if (score >= 90) return "Mentor-ready";
  if (score >= 80) return "Strong fit - minor optimization needed";
  if (score >= 65) return "Promising - needs clearer evidence";
  if (score >= 50) return "Good start - structure needs work";
  return "Early draft - AI will guide you";
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileExtension(fileName: string) {
  const match = fileName.toLowerCase().match(/\.[a-z0-9]+$/);
  return match?.[0] ?? "";
}

function getDraftTypeLabel(type?: string, name?: string) {
  const fromName = name ? getFileExtension(name).replace(".", "").toUpperCase() : "";
  if (fromName) return fromName;
  if (!type) return "DRAFT";
  if (type.includes("pdf")) return "PDF";
  if (type.includes("presentation")) return "PPTX";
  if (type.includes("word")) return "DOCX";
  if (type.includes("text")) return "TXT";
  return "DRAFT";
}

function getRecommendedSource(state: FounderWorkspaceDemoState): PitchInputSource {
  if (state.pitchDraft?.name) return "uploaded_draft";
  if (state.profileCompletion >= 60 || state.profile.name || state.profile.problem || state.profile.solution) return "workspace_data";
  return "ai_interview";
}

function getSourceLabel(source: PitchInputSource) {
  const labels: Record<PitchInputSource, string> = {
    workspace_data: "Workspace data",
    uploaded_draft: "Uploaded draft",
    pasted_draft: "Pasted draft",
    imported_draft: "Imported draft",
    ai_interview: "AI interview",
  };
  return labels[source];
}

function getStageMode(stage: string) {
  const normalized = stage.toLowerCase();
  if (normalized.includes("idea")) {
    return {
      label: "Idea-stage mentor readiness",
      note: "No traction yet is acceptable for idea stage. Add a validation plan before mentor review.",
      tone: "Validation plan over revenue proof",
    };
  }
  if (normalized.includes("pilot") || normalized.includes("early")) {
    return {
      label: "Pilot-stage mentor readiness",
      note: "Kizuna expects stronger customer evidence and usage signals because real users are involved.",
      tone: "Evidence quality and usage signals",
    };
  }
  if (normalized.includes("launch")) {
    return {
      label: "Launched-stage mentor readiness",
      note: "Kizuna looks for traction credibility, go-to-market clarity, and business model logic.",
      tone: "Traction credibility and GTM",
    };
  }
  return {
    label: "Prototype-stage mentor readiness",
    note: "Kizuna scores the prototype story around customer clarity, testability, and next validation steps.",
    tone: "Prototype proof and next test",
  };
}

function getWorkspaceFieldStatus(value: string, kind?: "traction" | "business") {
  if (!value.trim()) return kind === "traction" ? "Assumption" : "Missing";
  if (value.trim().length < 28) return "Weak";
  return "Ready";
}

function getStageAwareScoringBreakdown(
  scoringBreakdown: PitchReadinessDemoState["scoringBreakdown"],
  stage: string,
  traction: string
) {
  const normalized = stage.toLowerCase();
  const ideaStage = normalized.includes("idea");
  const pilotStage = normalized.includes("pilot") || normalized.includes("early") || normalized.includes("launch");
  const ideaLabels: Record<string, string> = {
    problem: "Problem clarity",
    solution: "Solution hypothesis",
    customer: "Customer specificity",
    evidence: "Validation plan",
    business: "Business model assumption",
    competition: "Alternative awareness",
    team: "Founder fit",
    roadmap: "Next experiment",
    ask: "Mentor ask clarity",
  };
  const pilotLabels: Record<string, string> = {
    problem: "Customer evidence",
    solution: "Usage signal",
    customer: "Reachable segment",
    evidence: "Traction credibility",
    business: "Business model logic",
    competition: "Go-to-market clarity",
    team: "Execution credibility",
    roadmap: "Pilot roadmap",
    ask: "Mentor ask clarity",
  };

  return scoringBreakdown.map((item) => {
    if (ideaStage) {
      return {
        ...item,
        label: ideaLabels[item.id] ?? item.label,
        statusLabel: item.id === "evidence" && !traction.trim() ? "Acceptable for idea stage" : item.statusLabel,
        aiNote:
          item.id === "evidence" && !traction.trim()
            ? "No traction yet is not a failure at idea stage. Add interview targets, validation plan, and the next proof you will collect."
            : item.aiNote,
      };
    }
    if (pilotStage) {
      return {
        ...item,
        label: pilotLabels[item.id] ?? item.label,
      };
    }
    return item;
  });
}

function getSlideActivityName(slideId: string) {
  const labels: Record<string, string> = {
    problem: "Problem clarity",
    solution: "Solution workflow",
    market: "Customer focus",
    traction: "Traction proof",
    business: "Pricing logic",
    competition: "Differentiation",
    roadmap: "Roadmap realism",
    team: "Team credibility",
    "mentor-ask": "Mentor ask",
  };
  return labels[slideId] ?? "Pitch section";
}

function getSlideImprovementStep(slideId: string) {
  const labels: Record<string, string> = {
    problem: "Adding a sharper founder pain moment...",
    solution: "Clarifying first-session workflow...",
    market: "Improving market focus...",
    traction: "Adding traction proof...",
    business: "Clarifying pricing logic...",
    competition: "Strengthening differentiation...",
    roadmap: "Anchoring the 30-day pilot...",
    team: "Adding execution proof...",
    "mentor-ask": "Clarifying mentor review ask...",
  };
  return labels[slideId] ?? "Improving pitch section...";
}

function relatedQuickWinIds(slideId: string) {
  const map: Record<string, string[]> = {
    problem: ["user-example"],
    market: ["user-example"],
    traction: ["waitlist-proof"],
    business: ["simple-pricing"],
    "mentor-ask": ["simple-pricing"],
  };
  return map[slideId] ?? [];
}

function createGeneratedSlides(pitch: PitchReadinessDemoState, profile: StartupProfile) {
  const sectionLine = (slideId: string) => {
    const slide = pitch.slideDiagnosis.find((item) => item.id === slideId);
    return slide?.content || slide?.suggestedFix.exampleRewrite || slide?.exampleRewrite || "";
  };

  return [
    {
      id: "title",
      title: profile.name || "Untitled Startup",
      subtitle: profile.tagline || "Mentor-ready startup story",
      bullets: [
        profile.industry ? `Category: ${profile.industry}` : "Category still being refined",
        profile.stage ? `Current stage: ${profile.stage}` : "Stage to confirm before mentor review",
      ],
      speakerNote: "Open with the submitted startup identity and the mentor-readiness goal.",
    },
    {
      id: "problem",
      title: "Problem",
      subtitle: profile.problem || "Problem statement needs sharper evidence",
      bullets: [profile.problem || "State the painful customer moment", "Mentors need structured evidence before giving useful feedback", "The review should clarify what is missing"],
      speakerNote: sectionLine("problem"),
    },
    {
      id: "solution",
      title: "Solution",
      subtitle: profile.solution || "Solution summary needs one clear workflow",
      bullets: [profile.solution || "Describe the first successful customer workflow", "Show how the solution removes the problem", "Connect the product to the mentor review outcome"],
      speakerNote: sectionLine("solution") || "Explain the solution as a workflow, not only a feature list.",
    },
    {
      id: "market",
      title: "Customer / Market",
      subtitle: profile.targetCustomer || "First beachhead customer to confirm",
      bullets: [profile.targetCustomer || "Name the first reachable customer segment", "Explain urgency before mentor review", "Show the first repeatable acquisition path"],
      speakerNote: sectionLine("market") || "Use the focused ICP from the AI fix.",
    },
    {
      id: "product",
      title: "Product",
      subtitle: profile.solution || "Product experience that solves the stated problem",
      bullets: ["Show the core workflow", "Explain the moment of value", "Tie the product to the next milestone"],
      speakerNote: "Anchor the product story around the submitted startup data.",
    },
    {
      id: "traction",
      title: "Traction",
      subtitle: profile.traction || "Validation signal to strengthen",
      bullets: [profile.traction || "Add one metric, source, and time period", "Explain what the signal proves", "Name the next validation metric"],
      speakerNote: sectionLine("traction") || "Mention source, cohort, and next metric.",
    },
    {
      id: "business",
      title: "Business Model",
      subtitle: profile.businessModel || "First revenue path needs clarity",
      bullets: [profile.businessModel || "Choose who pays first", "Explain why this buyer has urgency", "Keep pricing logic simple for mentor review"],
      speakerNote: sectionLine("business") || "Keep pricing logic simple for mentor review.",
    },
    {
      id: "roadmap",
      title: "Roadmap",
      subtitle: "30-day pilot to mentor-ready workflow",
      bullets: ["Week 1: profile and AI review completion", "Week 2: data room readiness and mentor matching", "Week 4: demo-day pitch packet export"],
      speakerNote: "Show near-term validation, not v2 infrastructure.",
    },
    {
      id: "team",
      title: "Team",
      subtitle: profile.team || "Team credibility to complete",
      bullets: [profile.team || "Add founder names, roles, and proof", "Show why this team can validate quickly", "Name any capability gaps mentors can help with"],
      speakerNote: "Founder-market fit is the credibility point.",
    },
    {
      id: "mentor-ask",
      title: "Mentor Ask",
      subtitle: profile.supportNeed || "Support need to focus before review",
      bullets: [profile.supportNeed || "Ask for feedback on one decision", "State what evidence mentors should review", "Define the next action after feedback"],
      speakerNote: sectionLine("mentor-ask") || "End with a concrete ask mentors can answer.",
    },
  ];
}

export function AiPitchDeckScreen({ projectId }: { projectId?: string }) {
  const { state, setState } = useFounderWorkspaceDemoState(projectId);
  const pitch = state.pitchReadiness;
  const recommendedSource = React.useMemo(() => getRecommendedSource(state), [state]);
  const [toast, setToast] = React.useState<DemoToastState>(null);
  const [selectedSource, setSelectedSource] = React.useState<PitchInputSource>(recommendedSource);
  const [progress, setProgress] = React.useState(0);
  const [currentStep, setCurrentStep] = React.useState("");
  const [reviewing, setReviewing] = React.useState(false);
  const [generatingDeck, setGeneratingDeck] = React.useState(false);
  const [importOpen, setImportOpen] = React.useState(false);
  const [interviewOpen, setInterviewOpen] = React.useState(false);
  const [fixOpen, setFixOpen] = React.useState(false);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [expandedSlide, setExpandedSlide] = React.useState<string | null>("market");
  const [manualSlide, setManualSlide] = React.useState<string | null>(null);
  const [manualContent, setManualContent] = React.useState("");
  const [draftText, setDraftText] = React.useState("We help student founders prepare for mentor review with AI readiness scoring and a demo-safe data room.");
  const [importTab, setImportTab] = React.useState<"upload" | "paste">("upload");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [fileError, setFileError] = React.useState("");
  const [dragActive, setDragActive] = React.useState(false);
  const [analyzingDraft, setAnalyzingDraft] = React.useState(false);
  const [fixingTop3, setFixingTop3] = React.useState(false);
  const [improvingSlideId, setImprovingSlideId] = React.useState<string | null>(null);
  const [improveStep, setImproveStep] = React.useState("");
  const [openRiskAnswers, setOpenRiskAnswers] = React.useState<Record<string, boolean>>({});
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [displayScore, setDisplayScore] = React.useState(pitch.overallScore);
  const sourceTouchedRef = React.useRef(false);

  React.useEffect(() => {
    if (sourceTouchedRef.current || pitch.reviewHasRun) return;
    setSelectedSource(recommendedSource);
  }, [pitch.reviewHasRun, recommendedSource]);

  React.useEffect(() => {
    if (displayScore === pitch.overallScore) return;
    const direction = pitch.overallScore > displayScore ? 1 : -1;
    const timer = window.setInterval(() => {
      setDisplayScore((value) => {
        if (value === pitch.overallScore) {
          window.clearInterval(timer);
          return value;
        }
        const next = value + direction;
        if ((direction > 0 && next >= pitch.overallScore) || (direction < 0 && next <= pitch.overallScore)) {
          window.clearInterval(timer);
          return pitch.overallScore;
        }
        return next;
      });
    }, 18);
    return () => window.clearInterval(timer);
  }, [displayScore, pitch.overallScore]);

  const updatePitch = (updater: (pitch: PitchReadinessDemoState) => PitchReadinessDemoState, activityMessage?: string, activityType = "pitch") => {
    setState((current) => {
      const nextPitch = updater(current.pitchReadiness);
      return {
        ...current,
        aiReadinessScore: nextPitch.overallScore,
        pitchDeckStatus: nextPitch.deckSentToDataRoom
          ? "shared"
          : nextPitch.deckGenerated
            ? "generated"
            : nextPitch.reviewHasRun
              ? "reviewed"
              : current.pitchDeckStatus,
        pitchReadiness: nextPitch,
        recentActivity: activityMessage ? addUniqueActivity(current, activityType, activityMessage) : current.recentActivity,
      };
    });
  };

  const selectSource = (source: PitchInputSource) => {
    sourceTouchedRef.current = true;
    setSelectedSource(source);
    updatePitch((current) => ({
      ...current,
      source,
      nextBestAction: source === "uploaded_draft" ? "Analyze draft, then run AI readiness review" : "Run AI readiness review",
    }));
  };

  const handleDraftFile = (file?: File) => {
    if (!file) return;
    const extension = getFileExtension(file.name);
    if (!allowedDraftExtensions.includes(extension)) {
      setSelectedFile(null);
      setFileError("Upload a PDF, DOCX, PPTX, or TXT pitch draft for this demo analysis.");
      return;
    }
    setSelectedFile(file);
    setFileError("");
  };

  const updateDraftAnalysisResult = (
    current: PitchReadinessDemoState,
    source: PitchInputSource,
    activityMessage: string,
    score: number,
  ): PitchReadinessDemoState => ({
    ...current,
    source,
    overallScore: score,
    projectedScore: Math.max(score + 10, 88),
    status: score >= 80 ? "strong_fit" : "promising",
    confidence: source === "uploaded_draft" ? "medium_high" : "medium",
    nextBestAction: "Run AI readiness review",
    mentorVerdict:
      source === "uploaded_draft"
        ? "Uploaded draft has a strong outline. Add proof, not more text: tighten the customer slide, cite traction source, and make the mentor ask explicit."
        : "Pasted draft is usable, but the readiness engine found weak traction context and a broad customer segment.",
    scoringBreakdown: current.scoringBreakdown.map((item) => {
      if (item.id === "customer") {
        return { ...item, score: source === "uploaded_draft" ? 72 : 70, statusLabel: "Needs focus", aiNote: "The draft names student founders, but the first reachable segment needs a sharper boundary." };
      }
      if (item.id === "evidence") {
        return { ...item, score: source === "uploaded_draft" ? 66 : 64, statusLabel: "Needs evidence", aiNote: "The draft mentions waitlist demand but needs source, time period, and intent quality." };
      }
      if (item.id === "ask") {
        return { ...item, score: source === "uploaded_draft" ? 68 : 65, statusLabel: "Needs clarity", aiNote: "The mentor ask is present, but it should name the decision mentors can help with." };
      }
      return item;
    }),
    slideDiagnosis: current.slideDiagnosis.map((slide) => {
      if (["market", "traction", "mentor-ask"].includes(slide.id)) {
        return {
          ...slide,
          score: Math.max(slide.score, slide.id === "market" ? 64 : slide.id === "traction" ? 66 : 68),
          status: slide.id === "traction" ? "needs_evidence" : "needs_focus",
          aiNote:
            slide.id === "market"
              ? "The imported draft has a market slide, but it still reads like a broad audience statement."
              : slide.id === "traction"
                ? "The imported draft has traction language, but the proof source and next activation metric are not clear enough."
                : "The imported draft asks for feedback, but the mentor decision should be more explicit.",
        };
      }
      return slide;
    }),
    activity: addPitchActivity(current, activityMessage, "ai"),
  });

  const chooseSource = async (source: PitchInputSource) => {
    selectSource(source);
    setCurrentStep("Generating pitch draft from workspace data...");
    setProgress(30);
    await wait(500);
    setProgress(100);
    updatePitch((current) => ({
      ...current,
      source,
      nextBestAction: "Run AI readiness review",
      activity: addPitchActivity(current, source === "workspace_data" ? "Draft refreshed from workspace data." : "Draft input updated."),
    }), "Pitch draft refreshed from workspace data.");
    setToast({ tone: "success", title: "Draft refreshed", description: `${state.profile.name || "This startup"} was rebuilt from workspace data.` });
    setProgress(0);
    setCurrentStep("");
  };

  const analyzeUploadedDraft = async () => {
    if (!selectedFile || analyzingDraft) return;
    setSelectedSource("uploaded_draft");
    setAnalyzingDraft(true);
    for (let index = 0; index < uploadAnalyzeSteps.length; index += 1) {
      setCurrentStep(uploadAnalyzeSteps[index]);
      setProgress(Math.round(((index + 1) / uploadAnalyzeSteps.length) * 100));
      await wait(430);
    }
    const activityMessage = `Uploaded draft analyzed: ${selectedFile.name}`;
    updatePitch(
      (current) => updateDraftAnalysisResult(current, "uploaded_draft", activityMessage, 78),
      activityMessage,
    );
    setImportOpen(false);
    setAnalyzingDraft(false);
    setProgress(0);
    setCurrentStep("");
    setToast({
      tone: "success",
      title: "Uploaded draft analyzed",
      description: `${selectedFile.name} is now driving the readiness diagnosis.`,
    });
  };

  const analyzeStoredDraft = async () => {
    if (!state.pitchDraft || analyzingDraft) return;
    setSelectedSource("uploaded_draft");
    setAnalyzingDraft(true);
    for (let index = 0; index < uploadAnalyzeSteps.length; index += 1) {
      setCurrentStep(uploadAnalyzeSteps[index]);
      setProgress(Math.round(((index + 1) / uploadAnalyzeSteps.length) * 100));
      await wait(380);
    }
    const activityMessage = `Submit Project draft analyzed: ${state.pitchDraft.name}`;
    updatePitch(
      (current) => updateDraftAnalysisResult(current, "uploaded_draft", activityMessage, 78),
      activityMessage,
    );
    setAnalyzingDraft(false);
    setProgress(0);
    setCurrentStep("");
    setToast({
      tone: "success",
      title: "Submitted draft analyzed",
      description: `${state.pitchDraft.name} is now driving the readiness diagnosis.`,
    });
  };

  const analyzePastedDraft = async () => {
    if (analyzingDraft) return;
    if (draftText.trim().length < 40) {
      setFileError("Paste at least a short problem, solution, customer, or traction draft before analysis.");
      return;
    }
    setFileError("");
    setSelectedSource("pasted_draft");
    setAnalyzingDraft(true);
    for (let index = 0; index < pasteAnalyzeSteps.length; index += 1) {
      setCurrentStep(pasteAnalyzeSteps[index]);
      setProgress(Math.round(((index + 1) / pasteAnalyzeSteps.length) * 100));
      await wait(390);
    }
    const activityMessage = "Pasted draft analyzed: customer focus and traction proof gaps detected.";
    updatePitch(
      (current) => updateDraftAnalysisResult(current, "pasted_draft", activityMessage, 76),
      "Pasted pitch draft analyzed.",
    );
    setImportOpen(false);
    setAnalyzingDraft(false);
    setProgress(0);
    setCurrentStep("");
    setToast({ tone: "success", title: "Pasted draft analyzed", description: "The diagnosis now reflects the imported text." });
  };

  const generateFromInterview = async () => {
    setSelectedSource("ai_interview");
    setCurrentStep("Building a pitch draft from interview answers...");
    setProgress(35);
    await wait(700);
    setProgress(100);
    updatePitch((current) => ({
      ...current,
      source: "ai_interview",
      overallScore: 79,
      projectedScore: 90,
      status: "promising",
      nextBestAction: "Run AI readiness review",
      slideDiagnosis: current.slideDiagnosis.map((slide) =>
        slide.id === "mentor-ask"
          ? { ...slide, score: 70, status: "good", content: answers["What do you need from a mentor?"] || slide.content }
          : slide
      ),
      activity: addPitchActivity(current, "AI interview generated a pitch draft."),
    }), "AI interview generated a pitch draft.");
    setInterviewOpen(false);
    setProgress(0);
    setCurrentStep("");
    setToast({ tone: "success", title: "Interview draft created", description: "Your answers improved the mentor ask and pitch input." });
  };

  const runReview = async () => {
    if (reviewing) return;
    setReviewing(true);
    for (let index = 0; index < reviewSteps.length; index += 1) {
      setCurrentStep(reviewSteps[index]);
      setProgress(Math.round(((index + 1) / reviewSteps.length) * 100));
      await wait(430);
    }
    updatePitch((current) => ({
      ...current,
      source: selectedSource,
      overallScore: 84,
      projectedScore: 92,
      status: "strong_fit",
      confidence: "medium_high",
      reviewHasRun: true,
      mentorVerdict: "Your pitch has a strong foundation and is close to mentor-ready. Add clearer customer evidence and traction proof before sending it.",
      estimatedTimeToReady: "20-30 minutes",
      nextBestAction: "Fix top 3 gaps with AI",
      strengths: [
        "Clear student problem",
        "Simple and understandable solution",
        "Strong founder-market fit from university context",
      ],
      activity: addPitchActivity(current, "AI readiness review completed at 84%.", "ai"),
    }), "AI readiness review completed.", "ai_review_completed");
    setReviewing(false);
    setProgress(0);
    setCurrentStep("");
    setToast({ tone: "success", title: "Readiness review complete", description: "Score, diagnosis, gaps, and quick wins have been updated." });
  };

  const applyTopFixes = async () => {
    if (fixingTop3) return;
    setFixingTop3(true);
    for (let index = 0; index < topFixSteps.length; index += 1) {
      setCurrentStep(topFixSteps[index]);
      setProgress(Math.round(((index + 1) / topFixSteps.length) * 100));
      await wait(430);
    }
    updatePitch((current) => ({
      ...current,
      overallScore: 91,
      projectedScore: 95,
      status: "mentor_ready",
      confidence: "high",
      nextBestAction: "Generate mentor-ready deck",
      mentorVerdict: "Your pitch is mentor-ready for a v1 review. The top gaps now have clearer customer focus, traction proof, and pricing logic.",
      estimatedTimeToReady: "Ready now",
      criticalGaps: current.criticalGaps.map((gap) => ({ ...gap, completed: true })),
      quickWins: current.quickWins.map((win) => ({ ...win, completed: true })),
      scoringBreakdown: current.scoringBreakdown.map((item) =>
        ["customer", "evidence", "business", "ask"].includes(item.id)
          ? { ...item, score: Math.min(92, item.score + 18), statusLabel: item.id === "business" ? "Strong fit" : "Mentor-ready" }
          : item
      ),
      slideDiagnosis: current.slideDiagnosis.map((slide) =>
        ["market", "traction", "business", "mentor-ask"].includes(slide.id)
          ? {
              ...slide,
              score: Math.min(93, slide.score + slide.estimatedGain + 5),
              status: "strong",
              priority: "low",
              content: slide.suggestedFix.exampleRewrite,
              suggestedFix: {
                ...slide.suggestedFix,
                whatToChange: "Completed by AI: the high-impact gap has been rewritten into mentor-review language.",
                expectedMentorImpact: "Mentors can now evaluate the decision instead of asking for basic context first.",
              },
            }
          : slide
      ),
      activity: addPitchActivity(current, "Top 3 AI fixes applied: customer focus, traction proof, and pricing logic now read mentor-ready.", "ai"),
    }), "Top 3 pitch gaps improved.", "ai_review_completed");
    setFixOpen(false);
    setFixingTop3(false);
    setProgress(0);
    setCurrentStep("");
    setToast({ tone: "success", title: "Top gaps fixed", description: "Readiness score improved and quick wins are marked complete." });
  };

  const improveSlide = async (slideId: string) => {
    if (improvingSlideId) return;
    setImprovingSlideId(slideId);
    setImproveStep(getSlideImprovementStep(slideId));
    await wait(650);
    setImproveStep("Updating score and mentor-risk diagnosis...");
    await wait(420);
    const relatedWins = relatedQuickWinIds(slideId);
    const activityName = getSlideActivityName(slideId);
    updatePitch((current) => ({
      ...current,
      overallScore: Math.min(95, current.overallScore + (["market", "traction", "business", "mentor-ask"].includes(slideId) ? 3 : 2)),
      projectedScore: Math.min(97, Math.max(current.projectedScore + 1, current.overallScore + 8)),
      quickWins: current.quickWins.map((win) =>
        relatedWins.includes(win.id) ? { ...win, completed: true } : win
      ),
      criticalGaps: current.criticalGaps.map((gap) =>
        (slideId === "market" && gap.id === "customer-focus") ||
        (slideId === "traction" && gap.id === "traction-proof") ||
        (slideId === "business" && gap.id === "pricing-logic")
          ? { ...gap, completed: true }
          : gap
      ),
      scoringBreakdown: current.scoringBreakdown.map((item) =>
        (slideId === "market" && item.id === "customer") ||
        (slideId === "traction" && item.id === "evidence") ||
        (slideId === "business" && item.id === "business") ||
        (slideId === "mentor-ask" && item.id === "ask")
          ? {
              ...item,
              score: Math.min(94, item.score + 12),
              statusLabel: item.score + 12 >= 88 ? "Mentor-ready" : "Strong fit",
              aiNote: `${activityName} now includes a clearer decision signal for mentor review.`,
            }
          : item
      ),
      slideDiagnosis: current.slideDiagnosis.map((slide) =>
        slide.id === slideId
          ? {
              ...slide,
              score: Math.min(95, slide.score + 10),
              status: slide.score + 10 >= 90 ? "mentor_ready" : "strong",
              priority: slide.score + 10 >= 86 ? "low" : slide.priority,
              content: slide.suggestedFix.exampleRewrite,
              aiNote: `${activityName} was rewritten to answer the likely mentor objection with a concrete proof point.`,
              suggestedFix: {
                ...slide.suggestedFix,
                whatToChange: "Completed by AI: this section now has a tighter mentor-review version.",
                howToImprove: "Use the rewritten line in the generated deck, then validate the proof with a real pilot note.",
                expectedMentorImpact: "Reduces follow-up clarification and helps mentors move directly into strategic feedback.",
              },
            }
          : slide
      ),
      activity: addPitchActivity(current, `${activityName} improved with AI: score, suggested fix, and example rewrite updated.`, "ai"),
    }), `${activityName} improved with AI.`);
    setImprovingSlideId(null);
    setImproveStep("");
    setToast({ tone: "success", title: "Section improved", description: `${activityName} now has stronger mentor-review evidence.` });
  };

  const openManualEdit = (slideId: string) => {
    const slide = pitch.slideDiagnosis.find((item) => item.id === slideId);
    setManualSlide(slideId);
    setManualContent(slide?.content ?? "");
  };

  const saveManualEdit = () => {
    if (!manualSlide) return;
    updatePitch((current) => ({
      ...current,
      overallScore: Math.min(95, current.overallScore + 1),
      slideDiagnosis: current.slideDiagnosis.map((slide) =>
        slide.id === manualSlide ? { ...slide, content: manualContent, score: Math.min(95, slide.score + 3) } : slide
      ),
      activity: addPitchActivity(current, "Manual slide edit saved.", "pitch"),
    }), "Manual pitch edit saved.");
    setManualSlide(null);
    setToast({ tone: "success", title: "Manual edit saved", description: "The section score increased slightly in demo state." });
  };

  const generateDeck = async () => {
    if (generatingDeck) return;
    setGeneratingDeck(true);
    for (let index = 0; index < deckSteps.length; index += 1) {
      setCurrentStep(deckSteps[index]);
      setProgress(Math.round(((index + 1) / deckSteps.length) * 100));
      await wait(420);
    }
    updatePitch((current) => ({
      ...current,
      generatedSlides: createGeneratedSlides(current, state.profile),
      deckGenerated: true,
      nextBestAction: "Preview slides and send to Data Room",
      activity: addPitchActivity(current, "Mentor-ready pitch deck generated.", "deck"),
    }), "Mentor-ready pitch deck generated.", "deck_generated");
    setGeneratingDeck(false);
    setProgress(0);
    setCurrentStep("");
    setPreviewOpen(true);
    setToast({ tone: "success", title: "Deck generated", description: "A 10-slide mentor-ready deck is ready to preview." });
  };

  const exportPdf = async () => {
    await wait(650);
    updatePitch((current) => ({
      ...current,
      activity: addPitchActivity(current, "Mock PDF prepared from the latest mentor-ready deck.", "deck"),
    }), "Mock PDF export prepared.", "deck_generated");
    setToast({ tone: "success", title: "Mock PDF prepared", description: "No file was downloaded; the demo activity log was updated." });
  };

  const sendToDataRoom = async () => {
    await wait(700);
    setState((current) => {
      const documents = current.documents.map((document) =>
        document.id === "pitch-deck"
          ? {
              ...document,
              status: "shared" as const,
              source: "ai_pitch" as const,
              sourceLabel: "Generated by AI Pitch Readiness",
              lastUpdated: new Date().toISOString(),
            }
          : document
      );
      const pitchReadiness = {
        ...current.pitchReadiness,
        deckSentToDataRoom: true,
        activity: addPitchActivity(current.pitchReadiness, "Mentor-ready deck sent to Data Room and marked shared.", "data-room"),
      };
      return {
        ...current,
        documents,
        dataRoomReadiness: calculateDataRoomReadiness(documents),
        pitchDeckStatus: "shared",
        pitchReadiness,
        recentActivity: addUniqueActivity(current, "deck_shared", "Pitch Deck sent to Data Room."),
      };
    });
    setToast({ tone: "success", title: "Sent to Data Room", description: "Pitch Deck is now marked shared in the workspace demo state." });
  };

  const remainingQuickWins = pitch.quickWins.filter((win) => !win.completed).length;
  const allQuickWinsComplete = remainingQuickWins === 0;
  const afterQuickFixScore = allQuickWinsComplete
    ? Math.max(pitch.overallScore, pitch.projectedScore)
    : Math.max(pitch.projectedScore, pitch.overallScore + 6);
  const afterMentorScore = Math.min(98, afterQuickFixScore + (allQuickWinsComplete ? 4 : 5));
  const fixesAwayLabel = allQuickWinsComplete
    ? "One mentor review away"
    : remainingQuickWins === 1
      ? "One fix away"
      : `${remainingQuickWins} fixes away`;
  const activeStepList = reviewing
    ? reviewSteps
    : generatingDeck
      ? deckSteps
      : analyzingDraft
        ? importTab === "upload"
          ? uploadAnalyzeSteps
          : pasteAnalyzeSteps
        : fixingTop3
          ? topFixSteps
          : null;
  const activeProgressTitle = reviewing
    ? "AI review in progress"
    : generatingDeck
      ? "Generating mentor-ready deck"
      : analyzingDraft
        ? "Analyzing draft"
        : fixingTop3
          ? "Fixing top 3 gaps"
          : "Updating pitch package";
  const stageMode = getStageMode(state.profile.stage);
  const scoringItems = getStageAwareScoringBreakdown(pitch.scoringBreakdown, state.profile.stage, state.profile.traction);
  const submittedDraft = state.pitchDraft;
  const activeDraft = selectedFile
    ? {
        name: selectedFile.name,
        type: getDraftTypeLabel(selectedFile.type, selectedFile.name),
        size: selectedFile.size,
        sourceLabel: "Replacement draft selected",
      }
    : submittedDraft
      ? {
          name: submittedDraft.name,
          type: getDraftTypeLabel(submittedDraft.type, submittedDraft.name),
          size: submittedDraft.size,
          sourceLabel: "Draft found from Submit Project",
        }
      : null;
  const workspaceDataRows: Array<{ label: string; value: string; kind?: "traction" | "business" }> = [
    { label: "Project name", value: state.profile.name },
    { label: "One-line description", value: state.profile.tagline },
    { label: "Problem", value: state.profile.problem },
    { label: "Solution", value: state.profile.solution },
    { label: "Target customer", value: state.profile.targetCustomer },
    { label: "Business model", value: state.profile.businessModel, kind: "business" },
    { label: "Evidence / traction", value: state.profile.traction, kind: "traction" },
    { label: "Team", value: state.profile.team },
    { label: "Mentor ask", value: state.profile.supportNeed },
  ];
  const sourceOptions: Array<{
    id: PitchInputSource;
    label: string;
    helper: string;
    icon: React.ElementType;
  }> = [
    {
      id: "uploaded_draft",
      label: "Upload draft",
      helper: "PDF, DOCX, PPTX, TXT, or a draft from another tool.",
      icon: Upload,
    },
    {
      id: "workspace_data",
      label: "Workspace data",
      helper: "Submitted profile, team, traction, and document signals.",
      icon: Sparkles,
    },
    {
      id: "ai_interview",
      label: "AI interview",
      helper: "Five guided answers when the pitch is still fuzzy.",
      icon: MessageSquareText,
    },
  ];

  return (
    <div className="pb-20">
      <WorkspacePageHeader
        eyebrow="AI pitch readiness"
        title="Is your pitch ready for mentor review?"
        description="This is not a generic slide generator. Kizuna builds your deck from your startup workspace and checks whether it is ready for mentor review."
        actions={
          <>
            <Button variant="secondary" asChild>
              <Link href="../">
                <ArrowLeft className="size-4" />
                Back to dashboard
              </Link>
            </Button>
            <Button onClick={runReview} disabled={reviewing}>
              <Bot className="size-4" />
              {reviewing ? "Reviewing..." : pitch.reviewHasRun ? "Run again" : "Run AI Readiness Review"}
            </Button>
          </>
        }
      />

      <WorkspaceCard className="mb-5 bg-surface-2">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_1fr]">
          <div className="rounded-xl border border-hairline bg-surface-1 p-5 text-center">
            <p className="font-mono text-6xl font-bold text-ink">{displayScore}%</p>
            <p className="mt-2 text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">Pitch Readiness</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-ink transition-all" style={{ width: `${pitch.overallScore}%` }} />
            </div>
          </div>
          <div className="flex flex-col justify-between gap-5">
            <div>
              <p className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">Status</p>
              <h2 className="mt-2 text-display-md text-ink">{getStatusLabel(pitch.overallScore)}</h2>
              <p className="mt-3 max-w-3xl text-body-framer text-ink-muted">{pitch.mentorVerdict}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex rounded-full border border-accent-blue/30 bg-accent-blue/10 px-3 py-1 text-caption font-bold text-accent-blue">
                  Review mode: {stageMode.label}
                </span>
                <span className="inline-flex rounded-full border border-hairline bg-surface-1 px-3 py-1 text-caption font-bold text-ink">
                  Source: {getSourceLabel(selectedSource)}
                </span>
                <span className="inline-flex rounded-full border border-hairline bg-surface-1 px-3 py-1 text-caption font-bold text-ink">
                  {fixesAwayLabel} - add proof, not more text.
                </span>
              </div>
              <p className="mt-3 max-w-3xl text-caption text-ink-muted">
                Kizuna scores this pitch for the current startup stage. {stageMode.note}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-hairline bg-surface-1 p-4">
                <p className="text-caption text-ink-muted">Confidence</p>
                <p className="mt-1 text-body-framer-sm font-bold text-ink">{pitch.confidence.replace("_", "-")}</p>
              </div>
              <div className="rounded-xl border border-hairline bg-surface-1 p-4">
                <p className="text-caption text-ink-muted">Time to ready</p>
                <p className="mt-1 text-body-framer-sm font-bold text-ink">{pitch.estimatedTimeToReady}</p>
              </div>
              <div className="rounded-xl border border-hairline bg-surface-1 p-4">
                <p className="text-caption text-ink-muted">Projected after fixes</p>
                <p className="mt-1 font-mono text-body-framer-sm font-bold text-ink">{pitch.projectedScore}%</p>
              </div>
            </div>
          </div>
        </div>
      </WorkspaceCard>

      <WorkspaceCard
        className="mb-5"
        title="Current review source"
        description="Pick what Kizuna should use for the next readiness review. Only the selected source expands."
      >
        <div className="grid grid-cols-1 gap-2 rounded-xl border border-hairline bg-surface-2 p-2 lg:grid-cols-3">
          {sourceOptions.map((option) => {
            const SourceIcon = option.icon;
            const active = selectedSource === option.id;
            const recommended = recommendedSource === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => selectSource(option.id)}
                className={cn(
                  "rounded-xl border border-transparent bg-surface-1 p-3 text-left transition hover:border-hairline hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/60",
                  active && "border-accent-blue/60 bg-accent-blue/10 text-ink shadow-framer-focus"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-body-framer-sm font-bold text-ink">
                    <SourceIcon className={cn("size-4 text-ink-muted", active && "text-accent-blue")} />
                    {option.label}
                  </span>
                  {recommended ? (
                    <span className="rounded-full border border-accent-blue/30 bg-accent-blue/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-accent-blue">
                      Recommended
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-caption text-ink-muted">{option.helper}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-xl border border-hairline bg-surface-2 p-4">
          {selectedSource === "uploaded_draft" ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-body-framer-sm font-bold text-ink">Upload or analyze your draft</p>
                <p className="mt-1 text-caption text-ink-muted">
                  Kizuna reads mock metadata only in this demo. Raw file contents are not stored.
                </p>
                {activeDraft ? (
                  <div className="mt-3 rounded-xl border border-hairline bg-surface-1 p-3">
                    <p className="text-caption font-bold uppercase tracking-[0.14em] text-accent-blue">
                      {activeDraft.sourceLabel}
                    </p>
                    <p className="mt-1 text-body-framer-sm font-bold text-ink">{activeDraft.name}</p>
                    <p className="mt-1 text-caption text-ink-muted">
                      {activeDraft.type} - {formatFileSize(activeDraft.size)}
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 rounded-xl border border-hairline bg-surface-1 p-3 text-caption text-ink-muted">
                    Add a draft when you already have a PDF, DOCX, PPTX, TXT, ChatGPT, or Gemini version to analyze.
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-start gap-2 lg:justify-end">
                <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-pill border border-hairline bg-surface-1 px-4 text-body-framer-sm font-bold text-ink transition hover:border-accent-blue/50 hover:text-accent-blue">
                  <FileUp className="size-4" />
                  {activeDraft ? "Replace file" : "Upload draft"}
                  <input
                    className="sr-only"
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                    onChange={(event) => {
                      handleDraftFile(event.target.files?.[0]);
                      event.currentTarget.value = "";
                    }}
                  />
                </label>
                <Button onClick={selectedFile ? analyzeUploadedDraft : analyzeStoredDraft} disabled={!activeDraft || analyzingDraft}>
                  {analyzingDraft ? <Loader2 className="size-4 animate-spin" /> : <FileText className="size-4" />}
                  {analyzingDraft ? "Analyzing..." : "Analyze this draft"}
                </Button>
                <Button variant="secondary" onClick={() => selectSource("workspace_data")}>
                  Use workspace data
                </Button>
              </div>
            </div>
          ) : null}

          {selectedSource === "workspace_data" ? (
            <div className="space-y-4">
              <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-start">
                <div>
                  <p className="text-body-framer-sm font-bold text-ink">Workspace data review</p>
                  <p className="mt-1 max-w-2xl text-caption text-ink-muted">
                    Kizuna will use these submitted fields to frame the review before asking you to polish slides.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => chooseSource("workspace_data")} disabled={analyzingDraft}>
                    <Sparkles className="size-4" />
                    Generate review from workspace data
                  </Button>
                  <Button variant="secondary" asChild>
                    <Link href="../">Edit startup profile</Link>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                {workspaceDataRows.map((row) => {
                  const status = getWorkspaceFieldStatus(row.value, row.kind);
                  return (
                    <div key={row.label} className="rounded-xl border border-hairline bg-surface-1 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-caption font-bold uppercase tracking-[0.12em] text-ink-muted">{row.label}</p>
                        <span
                          className={cn(
                            "rounded-full border border-hairline px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]",
                            status === "Ready" && "border-semantic-success/30 text-semantic-success",
                            status === "Weak" && "border-gradient-orange/30 text-gradient-orange",
                            status === "Assumption" && "border-accent-blue/30 text-accent-blue"
                          )}
                        >
                          {status}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-3 text-caption text-ink-muted">
                        {row.value || "Not added yet"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {selectedSource === "ai_interview" ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-body-framer-sm font-bold text-ink">AI Interview - 5 questions</p>
                <p className="mt-1 text-caption text-ink-muted">
                  Best when the idea is early and you need structure before a full deck exists.
                </p>
                <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                  {[
                    "Who has the problem?",
                    "What painful moment happens?",
                    "What are you building?",
                    "Who can try it first?",
                    "What do you want a mentor to help with?",
                  ].map((question, index) => (
                    <div key={question} className="rounded-xl border border-hairline bg-surface-1 p-3">
                      <p className="text-caption font-bold uppercase tracking-[0.12em] text-ink-muted">Question {index + 1}</p>
                      <p className="mt-1 text-body-framer-sm text-ink">{question}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap items-start gap-2 lg:justify-end">
                <Button onClick={() => setInterviewOpen(true)}>
                  <MessageSquareText className="size-4" />
                  Start 5-minute interview
                </Button>
                <Button variant="secondary" onClick={() => selectSource("workspace_data")}>
                  Use workspace data
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </WorkspaceCard>

      {currentStep ? (
        <WorkspaceCard className="mb-5" title={activeProgressTitle}>
          <div className="flex items-center justify-between gap-4">
            <p className="flex items-center gap-2 text-body-framer-sm font-bold text-ink">
              <Loader2 className="size-4 animate-spin" />
              {currentStep}
            </p>
            <span className="font-mono text-body-framer-sm font-bold text-ink-muted">{progress}%</span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full rounded-full bg-ink transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          {activeStepList ? (
            <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
              {activeStepList.map((step) => {
                const active = step === currentStep;
                const done = activeStepList.indexOf(step) < activeStepList.indexOf(currentStep);
                return (
                  <div
                    key={step}
                    className={cn(
                      "rounded-xl border border-hairline bg-surface-2 px-3 py-2 text-caption text-ink-muted",
                      active && "bg-ink text-inverse-ink",
                      done && "text-ink"
                    )}
                  >
                    {step}
                  </div>
                );
              })}
            </div>
          ) : null}
        </WorkspaceCard>
      ) : null}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <WorkspaceCard className="xl:col-span-4" title="Top strengths">
          <div className="space-y-3">
            {pitch.strengths.map((strength) => (
              <div key={strength} className="flex gap-3 rounded-xl border border-hairline bg-surface-2 p-3">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-semantic-success" />
                <p className="text-body-framer-sm text-ink">{strength}</p>
              </div>
            ))}
          </div>
        </WorkspaceCard>
        <WorkspaceCard className="xl:col-span-4" title="Critical gaps">
          <div className="space-y-3">
            {pitch.criticalGaps.map((gap) => (
              <div key={gap.id} className={cn("rounded-xl border border-hairline bg-surface-2 p-3", gap.completed && "opacity-60")}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-body-framer-sm font-bold text-ink">{gap.label}</p>
                  <span className="font-mono text-caption font-bold text-ink-muted">+{gap.estimatedGain}%</span>
                </div>
                <p className="mt-1 text-caption text-ink-muted">{gap.completed ? "Completed by AI fix" : `${gap.effortMinutes} min fix`}</p>
              </div>
            ))}
          </div>
        </WorkspaceCard>
        <WorkspaceCard
          className="xl:col-span-4"
          title="Quick wins"
          description={allQuickWinsComplete ? "Top fixes are complete. Generate the deck or ask a mentor for review." : "The highest-impact actions are ready for AI-assisted cleanup."}
          action={<Button size="sm" onClick={() => setFixOpen(true)} disabled={fixingTop3 || allQuickWinsComplete}><Wand2 className="size-4" />Fix top 3 with AI</Button>}
        >
          <div className="space-y-3">
            {pitch.quickWins.map((win) => (
              <div key={win.id} className="flex items-center justify-between gap-3 rounded-xl border border-hairline bg-surface-2 p-3">
                <p className={cn("text-body-framer-sm text-ink", win.completed && "text-ink-muted line-through")}>{win.label}</p>
                <span className="font-mono text-caption font-bold text-ink-muted">+{win.estimatedGain}%</span>
              </div>
            ))}
          </div>
        </WorkspaceCard>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-12">
        <WorkspaceCard
          className="xl:col-span-8"
          title="Stage-aware scoring breakdown"
          description={`Weighted ${stageMode.label.toLowerCase()} rubric. ${stageMode.tone}.`}
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {scoringItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-hairline bg-surface-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-body-framer-sm font-bold text-ink">{item.label}</p>
                    <p className="mt-1 text-caption text-ink-muted">Weight {item.weight}% - {item.statusLabel}</p>
                  </div>
                  <span className="font-mono text-body-framer-sm font-bold text-ink">{item.score}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-1">
                  <div className="h-full rounded-full bg-ink transition-all" style={{ width: `${item.score}%` }} />
                </div>
                <p className="mt-3 text-caption text-ink-muted">{item.aiNote}</p>
                <p className="mt-2 text-caption font-bold text-ink">{item.improvementHint}</p>
              </div>
            ))}
          </div>
        </WorkspaceCard>
        <WorkspaceCard className="xl:col-span-4" title="Mentor risk questions" description="Questions the founder should be ready to answer.">
          <div className="space-y-3">
            {pitch.mentorRiskQuestions.map((question, index) => (
              <div key={question} className="rounded-xl border border-hairline bg-surface-2 p-3">
                <p className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">Question {index + 1}</p>
                <p className="mt-1 text-body-framer-sm text-ink">{question}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 px-0"
                  onClick={() => setOpenRiskAnswers((current) => ({ ...current, [question]: !current[question] }))}
                >
                  {openRiskAnswers[question] ? "Hide suggested answer" : "Show suggested answer"}
                </Button>
                {openRiskAnswers[question] ? (
                  <p className="mt-2 rounded-xl border border-hairline bg-surface-1 p-3 text-caption text-ink-muted">
                    {suggestedRiskAnswers[question] ?? "Draft a concrete answer with one customer segment, one proof point, and one decision you need help with."}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </WorkspaceCard>
      </div>

      <WorkspaceCard className="mt-5" title="Slide-by-slide diagnosis" description="Expand a slide to see mentor risk, suggested fix, and example rewrite.">
        <div className="space-y-3">
          {pitch.slideDiagnosis.map((slide) => {
            const expanded = expandedSlide === slide.id;
            return (
              <div key={slide.id} className="rounded-xl border border-hairline bg-surface-2">
                <button
                  onClick={() => setExpandedSlide(expanded ? null : slide.id)}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left"
                >
                  <div>
                    <p className="text-body-framer-sm font-bold text-ink">{slide.name}</p>
                    <p className="mt-1 text-caption text-ink-muted">{slide.status.replace("_", " ")} - {slide.effort} - +{slide.estimatedGain}%</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-body-framer-sm font-bold text-ink">{slide.score}%</span>
                    <ChevronDown className={cn("size-4 text-ink-muted transition-transform", expanded && "rotate-180")} />
                  </div>
                </button>
                {expanded ? (
                  <div className="border-t border-hairline p-4">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      {slide.breakdown.map((item) => (
                        <div key={item.label} className="rounded-xl border border-hairline bg-surface-1 p-3">
                          <p className="text-caption text-ink-muted">{item.label}</p>
                          <p className="mt-1 text-body-framer-sm font-bold text-ink">{item.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <div className="rounded-xl border border-hairline bg-surface-1 p-4">
                        <p className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">AI note</p>
                        <p className="mt-2 text-body-framer-sm text-ink-muted">{slide.aiNote}</p>
                      </div>
                      <div className="rounded-xl border border-hairline bg-surface-1 p-4">
                        <p className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">Mentor risk</p>
                        <p className="mt-2 text-body-framer-sm text-ink-muted">{slide.mentorRisk}</p>
                      </div>
                    </div>
                    <div className="mt-4 rounded-xl border border-hairline bg-surface-1 p-4">
                      <p className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">Suggested fix</p>
                      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
                        {[
                          ["What to change", slide.suggestedFix.whatToChange],
                          ["Why this matters", slide.suggestedFix.whyThisMatters],
                          ["How to improve it", slide.suggestedFix.howToImprove],
                          ["Expected mentor impact", slide.suggestedFix.expectedMentorImpact],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-xl border border-hairline bg-surface-2 p-3">
                            <p className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">{label}</p>
                            <p className="mt-2 text-body-framer-sm text-ink-muted">{value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 rounded-xl border border-hairline bg-surface-2 p-3">
                        <p className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">Example rewrite</p>
                        <p className="mt-2 text-body-framer-sm text-ink">{slide.suggestedFix.exampleRewrite}</p>
                      </div>
                    </div>
                    {improvingSlideId === slide.id ? (
                      <div className="mt-4 rounded-xl border border-hairline bg-surface-1 p-3">
                        <p className="flex items-center gap-2 text-caption font-bold text-ink">
                          <Loader2 className="size-3.5 animate-spin" />
                          {improveStep}
                        </p>
                      </div>
                    ) : null}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button onClick={() => improveSlide(slide.id)} disabled={Boolean(improvingSlideId)}>
                        {improvingSlideId === slide.id ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                        {improvingSlideId === slide.id ? "Improving..." : "Improve with AI"}
                      </Button>
                      <Button variant="secondary" onClick={() => openManualEdit(slide.id)}>
                        <PenLine className="size-4" />
                        Edit manually
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </WorkspaceCard>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1fr]">
        <WorkspaceCard className="bg-surface-2" title="Readiness timeline">
          <div className="space-y-3">
            {[
              ["Now", `${pitch.overallScore}%`, getStatusLabel(pitch.overallScore)],
              [allQuickWinsComplete ? "Quick fixes applied" : "After quick fixes", `${afterQuickFixScore}%`, getStatusLabel(afterQuickFixScore)],
              ["After mentor feedback", `${afterMentorScore}%`, "Demo-ready"],
            ].map(([label, value, status]) => (
              <div key={label} className="flex items-center justify-between rounded-xl border border-hairline bg-surface-1 p-3">
                <div>
                  <p className="text-body-framer-sm font-bold text-ink">{label}</p>
                  <p className="text-caption text-ink-muted">{status}</p>
                </div>
                <p className="font-mono text-body-framer-sm font-bold text-ink">{value}</p>
              </div>
            ))}
          </div>
        </WorkspaceCard>
        <WorkspaceCard title="Create review-ready pitch deck" description="Generate a 10-slide mentor package from the latest diagnosis.">
          <div className="flex flex-wrap gap-3">
            <Button onClick={generateDeck} disabled={generatingDeck}>
              <FileText className="size-4" />
              {generatingDeck ? "Generating..." : "Generate Mentor-Ready Deck"}
            </Button>
            <Button variant="secondary" onClick={() => setPreviewOpen(true)} disabled={!pitch.deckGenerated}>
              <Gauge className="size-4" />
              Preview slides
            </Button>
          </div>
          <div className="mt-5 space-y-3">
            {pitch.activity.slice(0, 4).map((activity) => (
              <div key={activity.id} className="rounded-xl border border-hairline bg-surface-2 p-3">
                <p className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">{activity.timestamp}</p>
                <p className="mt-1 text-body-framer-sm text-ink">{activity.message}</p>
              </div>
            ))}
          </div>
        </WorkspaceCard>
      </div>

      <WorkspaceActionModal
        open={importOpen}
        onClose={() => {
          if (!analyzingDraft) setImportOpen(false);
        }}
        title="Analyze existing draft"
        description="Upload a mock PDF, DOCX, PPTX, or TXT draft, or paste text from another tool."
        footer={
          <>
            <Button variant="secondary" onClick={() => setImportOpen(false)} disabled={analyzingDraft}>Cancel</Button>
            {importTab === "upload" ? (
              <Button onClick={analyzeUploadedDraft} disabled={!selectedFile || analyzingDraft}>
                {analyzingDraft ? <Loader2 className="size-4 animate-spin" /> : <FileUp className="size-4" />}
                {analyzingDraft ? "Analyzing..." : "Analyze uploaded draft"}
              </Button>
            ) : (
              <Button onClick={analyzePastedDraft} disabled={analyzingDraft || draftText.trim().length < 40}>
                {analyzingDraft ? <Loader2 className="size-4 animate-spin" /> : <FileText className="size-4" />}
                {analyzingDraft ? "Analyzing..." : "Analyze pasted draft"}
              </Button>
            )}
          </>
        }
      >
        <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl border border-hairline bg-surface-2 p-1">
          {[
            ["upload", "Upload file"],
            ["paste", "Paste text"],
          ].map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setImportTab(tab as "upload" | "paste");
                setFileError("");
              }}
              className={cn(
                "rounded-lg px-3 py-2 text-caption font-bold text-ink-muted transition-colors",
                importTab === tab && "bg-ink text-inverse-ink"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {importTab === "upload" ? (
          <div className="space-y-3">
            <label
              onDragEnter={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragActive(false);
                handleDraftFile(event.dataTransfer.files?.[0]);
              }}
              className={cn(
                "flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-hairline bg-surface-2 p-6 text-center transition-colors",
                dragActive && "border-accent-blue bg-surface-1"
              )}
            >
              <input
                type="file"
                accept=".pdf,.docx,.pptx,.txt"
                className="sr-only"
                onChange={(event) => handleDraftFile(event.target.files?.[0])}
              />
              <div className="flex size-12 items-center justify-center rounded-full border border-hairline bg-surface-1 text-ink">
                <Upload className="size-5" />
              </div>
              <p className="mt-4 text-body-framer-sm font-bold text-ink">Drop a pitch draft here or browse</p>
              <p className="mt-1 text-caption text-ink-muted">PDF, DOCX, PPTX, or TXT. Demo analysis only, no backend upload.</p>
            </label>

            {selectedFile ? (
              <div className="rounded-xl border border-hairline bg-surface-2 p-3">
                <p className="text-body-framer-sm font-bold text-ink">{selectedFile.name}</p>
                <p className="mt-1 text-caption text-ink-muted">
                  {formatFileSize(selectedFile.size)} - {getFileExtension(selectedFile.name).replace(".", "").toUpperCase() || "DRAFT"}
                </p>
              </div>
            ) : null}
          </div>
        ) : (
          <textarea
            value={draftText}
            onChange={(event) => {
              setDraftText(event.target.value);
              setFileError("");
            }}
            className="min-h-40 w-full resize-none rounded-xl border border-hairline bg-surface-2 p-4 text-body-framer-sm text-ink outline-none focus:shadow-framer-focus"
          />
        )}

        {fileError ? (
          <div className="mt-3 flex gap-2 rounded-xl border border-hairline bg-surface-2 p-3 text-caption text-ink-muted">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-accent-blue" />
            <p>{fileError}</p>
          </div>
        ) : null}
      </WorkspaceActionModal>

      <WorkspaceActionModal
        open={interviewOpen}
        onClose={() => setInterviewOpen(false)}
        title="Build with AI interview"
        description="Answer a few short prompts and Kizuna will create a pitch draft."
        footer={
          <>
            <Button variant="secondary" onClick={() => setInterviewOpen(false)}>Cancel</Button>
            <Button onClick={generateFromInterview}>Generate pitch draft</Button>
          </>
        }
      >
        <div className="max-h-[58vh] space-y-4 overflow-y-auto pr-1">
          {interviewQuestions.map((question) => (
            <label key={question} className="block space-y-2">
              <span className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">{question}</span>
              <input
                value={answers[question] ?? ""}
                onChange={(event) => setAnswers((current) => ({ ...current, [question]: event.target.value }))}
                className="w-full rounded-xl border border-hairline bg-surface-2 p-3 text-body-framer-sm text-ink outline-none focus:shadow-framer-focus"
              />
            </label>
          ))}
        </div>
      </WorkspaceActionModal>

      <WorkspaceActionModal
        open={fixOpen}
        onClose={() => setFixOpen(false)}
        title="Fix top 3 with AI"
        description="Apply concrete mentor-readiness improvements to the highest-impact gaps."
        footer={
          <>
            <Button variant="secondary" onClick={() => setFixOpen(false)} disabled={fixingTop3}>Cancel</Button>
            <Button onClick={applyTopFixes} disabled={fixingTop3 || allQuickWinsComplete}>
              {fixingTop3 ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
              {fixingTop3 ? "Applying..." : "Apply AI improvements"}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          {allQuickWinsComplete ? (
            <div className="rounded-xl border border-hairline bg-surface-2 p-3">
              <p className="text-body-framer-sm font-bold text-ink">Top fixes already applied</p>
              <p className="mt-1 text-caption text-ink-muted">Generate the mentor-ready deck or send it to the Data Room.</p>
            </div>
          ) : null}
          {pitch.criticalGaps.slice(0, 3).map((gap) => (
            <div key={gap.id} className="rounded-xl border border-hairline bg-surface-2 p-3">
              <p className="text-body-framer-sm font-bold text-ink">{gap.label}</p>
              <p className="mt-1 text-caption text-ink-muted">AI will improve this section for an estimated +{gap.estimatedGain}% readiness gain.</p>
            </div>
          ))}
        </div>
      </WorkspaceActionModal>

      <WorkspaceActionModal
        open={Boolean(manualSlide)}
        onClose={() => setManualSlide(null)}
        title="Edit slide manually"
        description="Manual edits stay secondary but still improve the local diagnosis state."
        footer={
          <>
            <Button variant="secondary" onClick={() => setManualSlide(null)}>Cancel</Button>
            <Button onClick={saveManualEdit}>Save edit</Button>
          </>
        }
      >
        <textarea
          value={manualContent}
          onChange={(event) => setManualContent(event.target.value)}
          className="min-h-40 w-full resize-none rounded-xl border border-hairline bg-surface-2 p-4 text-body-framer-sm text-ink outline-none focus:shadow-framer-focus"
        />
      </WorkspaceActionModal>

      <SlidePreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        generatedSlides={pitch.generatedSlides}
        onExportPdf={exportPdf}
        onSendToDataRoom={sendToDataRoom}
        sentToDataRoom={pitch.deckSentToDataRoom}
      />

      <DemoToast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
