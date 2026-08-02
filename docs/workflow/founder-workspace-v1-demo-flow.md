# Founder Workspace v1 Demo Flow

## 1. Purpose

This document is the source of truth for the Kizuna Hub Founder Workspace v1 live demo flow.

It exists to keep future implementation passes focused on the same product story: a founder moves from an incomplete startup profile to a mentor-review-ready workspace through AI pitch readiness, data room preparation, and mentor request gating.

This is a workflow contract, not a redesign brief. Future coding agents should preserve the existing Framer dark token system, existing route structure, feature-first architecture, and shared workspace primitives unless a later requirement explicitly changes them.

## 2. Product Principle

The Founder Workspace must answer this question within 5 seconds:

> Is my startup ready to be reviewed by a mentor?

Every primary surface should support that answer through clear readiness signals, concrete missing work, and deterministic next actions.

The v1 experience should feel like a polished SaaS demo for student founders:

- Clear enough for a first-time founder to understand what to do next.
- Trustworthy enough for judges, mentors, and university stakeholders.
- Interactive enough that every primary CTA either navigates, opens a modal, updates local state, shows loading and success feedback, or is intentionally disabled with a visible reason.
- Mock-only enough to avoid fake backend claims, fake integrations, or v2 infrastructure.

## 3. Canonical v1 Demo Flow

The canonical live demo flow is:

1. Overview
2. AI Pitch Readiness
3. Upload draft
4. Run AI Review
5. Fix top 3
6. Generate deck
7. Send to Data Room
8. Open Data Room
9. Request Mentor Review
10. Back Overview

This is the default path presenters should use. Other routes may exist, but they should not distract from this v1 story.

## 4. Step-by-Step Workflow Specification

### Step 1 - Overview

- User intent: Understand whether the startup is ready for mentor review and what is blocking readiness.
- UI entry point: `/en/founder/founder-workspace/[projectId]`.
- Expected UI state: The page shows startup profile completion, AI readiness score, data room readiness, pitch deck status, current milestone, mentor readiness gate, recent activity, and the next best action.
- UI components involved: Workspace shell, overview readiness header, profile completion card, AI readiness card, milestone tracker, data room document summary, mentor match preview, recent activity list.
- Primary CTA: Continue next best action, usually `Run AI Review`, `Complete profile`, `Generate deck`, `Send to Data Room`, or `Request Mentor Review` depending on readiness.
- Secondary CTA: Edit startup profile, open AI Pitch Readiness, open Data Room, open Venture Connect.
- Mock state changes: Editing profile updates `profileCompletion`, missing fields, checklist state, milestone progress, and readiness gates.
- Recent activity update: Add a concise activity such as `Startup profile updated` or `Next best action changed`.
- Success feedback: Toast or inline success message confirms profile/readiness state changed.
- Failure/locked state if relevant: Mentor request stays locked until profile, AI, data room, and pitch deck gates are met; locked state must explain exact missing gates.
- Acceptance criteria: A founder can understand readiness status, blockers, and next action without opening another route.

### Step 2 - AI Pitch Readiness

- User intent: Diagnose whether the pitch can survive mentor review.
- UI entry point: Overview CTA, sidebar AI Pitch Deck item, or `/en/founder/founder-workspace/[projectId]/ai-pitch-deck`.
- Expected UI state: The page opens with a readiness-first hero, score, status, mentor verdict, confidence, next best action, and setup paths before manual editing.
- UI components involved: AI readiness hero, setup path cards, review progress panel, scoring breakdown, slide diagnosis accordion, quick wins, mentor risk questions, deck actions.
- Primary CTA: `Run AI Readiness Review` when enough source content exists; otherwise the primary CTA guides the founder to generate from workspace data, upload draft, paste draft, or start AI interview.
- Secondary CTA: Analyze existing draft, build with AI interview, edit manually.
- Mock state changes: Selecting a source updates `aiPitch.source`, review readiness, and activity context.
- Recent activity update: Add `Pitch readiness workspace opened` only if this is the first meaningful pitch action in the session.
- Success feedback: Selected setup path shows active state and clear next step.
- Failure/locked state if relevant: Review is disabled until a source is selected or workspace profile data is sufficient; disabled explanation must be visible.
- Acceptance criteria: The page is readiness-first, not editor-first, and the founder knows how the AI review will be powered.

### Step 3 - Upload Draft

- User intent: Bring an existing pitch draft into the readiness workflow.
- UI entry point: AI Pitch Readiness setup path `Analyze existing draft` or upload control.
- Expected UI state: Founder sees supported mock upload/paste options, selected file or pasted content summary, and readiness review CTA.
- UI components involved: Upload draft panel, pasted draft textarea, source selector, mock file status row, review CTA.
- Primary CTA: `Analyze draft` or `Use this draft`.
- Secondary CTA: Paste draft manually, switch to workspace data, switch to AI interview.
- Mock state changes: Set `aiPitch.source` to `uploaded_draft` or `pasted_draft`; store a safe local draft summary, not raw sensitive file contents.
- Recent activity update: Add `Pitch draft added for AI review`.
- Success feedback: Inline status confirms the draft is ready for AI review.
- Failure/locked state if relevant: Unsupported file state is mocked with a helpful message; no real PDF parsing is claimed.
- Acceptance criteria: The founder can proceed to Run AI Review without a dead upload state.

### Step 4 - Run AI Review

- User intent: Get a clear diagnosis of mentor readiness.
- UI entry point: AI Pitch Readiness primary CTA.
- Expected UI state: Staged loading appears with progress bar, current step copy, disabled duplicate submit, and stable layout.
- UI components involved: Review progress panel, readiness score hero, scoring breakdown, diagnosis result panels, DemoToast.
- Primary CTA: `Run AI Readiness Review`.
- Secondary CTA: Cancel or keep editing should be disabled or de-emphasized during the staged review.
- Mock state changes: Update `aiReadinessScore`, `aiPitch.overallScore`, `aiPitch.projectedScore`, `aiPitch.reviewHasRun`, strengths, gaps, quick wins, mentor risk questions, readiness timeline, and slide diagnoses.
- Recent activity update: Add `AI readiness review completed`.
- Success feedback: Score and diagnosis update visibly, with a success toast and clear next best action.
- Failure/locked state if relevant: If inputs are missing, show required source/profile blockers instead of starting the review.
- Acceptance criteria: The review feels deterministic and credible without claiming a real AI backend.

### Step 5 - Fix Top 3

- User intent: Improve the highest-impact pitch weaknesses quickly.
- UI entry point: AI Pitch Readiness diagnosis result after a completed review.
- Expected UI state: Top gaps are visible with quick wins and improvement actions.
- UI components involved: Top gaps panel, quick wins list, slide diagnosis accordion, score projection, DemoToast.
- Primary CTA: `Fix top 3 with AI`.
- Secondary CTA: `Improve with AI` on individual slide diagnoses, `Edit manually`.
- Mock state changes: Mark the top three gaps improved, increase `aiReadinessScore` and projected score within a realistic cap, update affected slide diagnosis statuses, and append improved copy snippets.
- Recent activity update: Add `Top pitch gaps improved with AI`.
- Success feedback: Score delta, improved status badges, and toast confirm the change.
- Failure/locked state if relevant: Fix actions stay disabled until a review has run; explanation says `Run AI Review first`.
- Acceptance criteria: The founder sees a visible before/after improvement in readiness state.

### Step 6 - Generate Deck

- User intent: Create a mentor-ready pitch deck from reviewed content.
- UI entry point: AI Pitch Readiness deck action area after review or after Fix Top 3.
- Expected UI state: Deck generation CTA is visible with required readiness context and slide outline.
- UI components involved: Deck generation card, slide outline, preview modal, export action, DemoToast.
- Primary CTA: `Generate Mentor-Ready Deck`.
- Secondary CTA: Preview slides, export mock PDF, edit manually.
- Mock state changes: Set `pitchDeckStatus` to `generated`, `aiPitch.deckGenerated` to true, and populate `generatedSlides`.
- Recent activity update: Add `Mentor-ready pitch deck generated`.
- Success feedback: Preview opens or success toast confirms deck generation.
- Failure/locked state if relevant: Deck generation is disabled until review has run; if score is low, allow generation with warning or explain the recommended fix first.
- Acceptance criteria: Generated deck state persists locally and unlocks preview/export/send actions.

### Step 7 - Send to Data Room

- User intent: Make the generated pitch deck available in the data room for mentor review.
- UI entry point: AI Pitch Readiness deck action area after deck generation.
- Expected UI state: Send action appears enabled once deck is generated.
- UI components involved: Deck action card, Data Room document readiness state, DemoToast, optional confirmation modal.
- Primary CTA: `Send to Data Room`.
- Secondary CTA: Open Data Room, preview slides, export mock PDF.
- Mock state changes: Set `aiPitch.deckSentToDataRoom` to true, update `pitchDeckStatus` to `shared`, update the Pitch Deck document status to `ready` or `shared`, and recalculate `dataRoomReadiness`.
- Recent activity update: Add `Pitch deck sent to Data Room`.
- Success feedback: Toast confirms the deck is now in Data Room and offers `Open Data Room`.
- Failure/locked state if relevant: Disabled until `deckGenerated` is true with visible reason.
- Acceptance criteria: Opening Data Room after this step shows Pitch Deck readiness updated.

### Step 8 - Open Data Room

- User intent: Confirm required mentor-review documents are ready and shareable.
- UI entry point: AI Pitch success CTA, Overview Data Room card, sidebar Data Room item, or `/en/founder/founder-workspace/[projectId]/data-room`.
- Expected UI state: Required document list is visible, including Pitch Deck, Business Model Canvas, Financial Snapshot, Product Screenshots, Founder Team Profile, and any SRS-required equivalents.
- UI components involved: Data Room screen, document readiness list, share link controls, revoke modal, activity/access panels.
- Primary CTA: Generate/share mentor review link or continue to mentor review when readiness passes.
- Secondary CTA: Mock upload missing document, revoke link, copy link, open Venture Connect.
- Mock state changes: Mock uploads update document statuses and `dataRoomReadiness`; sharing creates local link state; revoke uses branded modal and updates local link state.
- Recent activity update: Add `Data Room prepared for mentor review` or document-specific update.
- Success feedback: Toast or inline banner confirms document/link action.
- Failure/locked state if relevant: Missing documents show visible required actions; no native `window.confirm()` is allowed.
- Acceptance criteria: Data Room clearly shows document readiness and never hides a blocked mentor request behind vague copy.

### Step 9 - Request Mentor Review

- User intent: Send the startup package to a mentor when it is ready.
- UI entry point: Overview mentor match preview, Venture Connect mentor CTA, or Data Room completion CTA.
- Expected UI state: Best mentor match, match score, reason, required gates, and request status are visible.
- UI components involved: Mentor match preview, request modal, Venture Connect mentor card, readiness gate banner, DemoToast.
- Primary CTA: `Request Mentor Review`.
- Secondary CTA: View mentor details, open Data Room, improve pitch, return to Overview.
- Mock state changes: If gates pass, set `mentorRequestStatus` to `sent`; if not, keep `locked` and expose missing gates.
- Recent activity update: Add `Mentor review request sent` when sent.
- Success feedback: Branded modal or toast confirms request sent and status changes to `Request sent`.
- Failure/locked state if relevant: Locked state lists exact blockers: profile completion, AI readiness, data room readiness, or pitch deck generated/shared status.
- Acceptance criteria: Mentor request cannot feel fake or dead; it either sends visibly or explains why it is locked.

### Step 10 - Back Overview

- User intent: Confirm the workspace now reflects the completed mentor-readiness journey.
- UI entry point: Back Overview CTA after mentor request or sidebar Overview item.
- Expected UI state: Overview shows updated profile, AI score, data room readiness, pitch deck status, mentor request status, current milestone, and recent activity.
- UI components involved: Overview readiness header, next best action, mentor match preview, milestone tracker, recent activity.
- Primary CTA: If request is sent, primary CTA changes to review status or next milestone; if still locked, it points to the highest-impact missing gate.
- Secondary CTA: Open AI Pitch Readiness, open Data Room, open Venture Connect.
- Mock state changes: No new state required unless a final confirmation activity is added.
- Recent activity update: Optional `Returned to Overview after mentor request`.
- Success feedback: Overview should make progress obvious without requiring narration.
- Failure/locked state if relevant: If any gate regressed or remains incomplete, next best action must identify it.
- Acceptance criteria: The founder can see that the startup is mentor-review-ready or exactly why it is not.

## 5. Shared Demo State Contract

Founder Workspace v1 should use a lightweight shared demo state, preferably localStorage-backed, so progress persists across Overview, AI Pitch Readiness, Data Room, and Venture Connect during a demo session.

The state should be easy to replace with backend data later. It must not claim real persistence, real AI processing, real document storage, or real mentor notification.

```ts
type FounderWorkspaceDemoState = {
  projectId: string;
  projectName: string;
  profileCompletion: number;
  aiReadinessScore: number;
  dataRoomReadiness: number;
  pitchDeckStatus: "missing" | "draft" | "reviewed" | "generated" | "shared";
  mentorRequestStatus: "locked" | "ready" | "sent";
  currentMilestone: {
    id: string;
    title: string;
    status: "locked" | "active" | "complete";
    progress: number;
    targetPeriod: string;
    nextAction: string;
  };
  documents: Array<{
    id: string;
    title: string;
    status: "missing" | "needs_update" | "ready" | "shared";
    required: boolean;
    source?: "workspace" | "upload" | "ai_pitch" | "demo";
  }>;
  aiPitch: {
    source?: PitchInputSource;
    reviewHasRun: boolean;
    overallScore: number;
    projectedScore: number;
    status: PitchReadinessStatus;
    deckGenerated: boolean;
    deckSentToDataRoom: boolean;
    strengths: string[];
    gaps: string[];
    quickWins: string[];
    mentorRiskQuestions: string[];
    slideDiagnosis: Array<{
      id: string;
      title: string;
      status: SlideDiagnosisStatus;
      score: number;
      issue: string;
      recommendation: string;
      improved: boolean;
    }>;
  };
  recentActivity: Array<{
    id: string;
    type:
      | "profile"
      | "ai_review"
      | "pitch_deck"
      | "data_room"
      | "mentor_request"
      | "milestone";
    label: string;
    timestamp: string;
  }>;
};

type PitchInputSource =
  | "workspace_data"
  | "uploaded_draft"
  | "pasted_draft"
  | "ai_interview";

type PitchReadinessStatus =
  | "not_started"
  | "needs_work"
  | "almost_ready"
  | "mentor_ready";

type SlideDiagnosisStatus =
  | "missing"
  | "weak"
  | "needs_polish"
  | "ready";
```

State updates should be deterministic and local. Avoid random values in demo-critical scores unless they are seeded and stable for a project.

## 6. Readiness Gate Rules

Mentor review readiness is gated by these v1 rules:

- Profile completion must be at least 80.
- AI readiness score must be at least 85.
- Data Room readiness must be at least 80.
- Pitch Deck status must be `generated` or `shared`.

CTA behavior:

- If any gate is missing, `Request Mentor Review` is locked and must show the exact reasons.
- If all gates pass, `Request Mentor Review` opens a branded request modal.
- If request is submitted, `mentorRequestStatus` becomes `sent` and the CTA changes to `Request sent`.
- A sent request should not resend silently. It should show status, confirmation, or next review milestone.

The gate is product guidance for v1. If implementation uses a slightly different existing threshold, future work should align it to this contract unless a product decision changes it.

## 7. Button Behavior Rules

No primary CTA in Founder Workspace v1 may be visually dead.

- Edit profile: Opens a branded profile modal or editor, validates required fields, saves to local state, updates completion score, and shows success feedback.
- Run AI Review: Requires a valid pitch source, shows staged loading/progress, updates readiness results, and prevents duplicate submits while running.
- Upload draft: Opens or reveals mock upload/paste controls, stores a draft source state, and enables AI review.
- Fix top 3 with AI: Requires a completed review, updates top gaps, improves scores/statuses, and shows before/after feedback.
- Improve with AI: Improves one slide diagnosis or section, updates local state, and shows targeted success feedback.
- Generate Mentor-Ready Deck: Requires review context, generates local slide data, updates pitch deck status, and enables preview/export/send.
- Preview slides: Opens a slide preview modal with next/previous controls and disabled states at boundaries.
- Export mock PDF: Shows loading or toast feedback and produces a mock export confirmation. It must not silently do nothing.
- Send to Data Room: Requires generated deck, updates Data Room Pitch Deck document readiness, persists state, and offers Open Data Room.
- Open Data Room: Navigates to Data Room route.
- Request Mentor Review: Opens request modal if gates pass; otherwise displays locked reasons. Sent state must be visible.
- Back Overview: Navigates to Overview and reflects the latest shared demo state.

Secondary icon buttons, menu items, table rows, and event rows must also either navigate, open details, update state, show toast, or be explicitly disabled with helper text.

## 8. Source Data Mapping

The submit-project flow should seed the Founder Workspace where available.

Submit-project fields that can map into workspace profile and AI pitch context:

- Project name
- One-line description
- Industry
- Stage
- Problem
- Solution
- Target customer
- Team
- Traction
- Mentor ask or support need

AI Pitch Readiness can use these sources:

- Submitted project data
- Uploaded draft metadata
- Pasted draft text
- AI interview answers
- Workspace metrics
- Data Room document status

Allowed mock data:

- Stable founder/project examples.
- Stable mentor names, match scores, and reasons.
- Stable AI diagnosis output.
- Stable document readiness statuses.
- Stable recent activity timestamps expressed as relative demo text.

Do not expose raw OTPs, raw uploaded document contents, private credentials, or fake production logs in the UI.

## 9. Page Responsibilities

Overview:

- Owns the 5-second readiness answer.
- Shows profile completion, AI readiness, pitch deck status, data room readiness, current milestone, mentor match preview, recent activity, and next best action.
- Allows profile edits and mentor request entry point.

AI Pitch Readiness:

- Owns pitch diagnosis and improvement workflow.
- Supports workspace-data generation, uploaded/pasted draft analysis, and AI interview setup.
- Runs staged mock AI review.
- Shows scoring breakdown, slide diagnosis, strengths, gaps, quick wins, risk questions, timeline, and projected score.
- Generates mentor-ready deck and sends it to Data Room.

Data Room:

- Owns required document readiness and sharing state.
- Shows document list, statuses, source, mock upload/update actions, share link actions, and revoke flow.
- Uses branded modal patterns for destructive actions.
- Reflects pitch deck state after Send to Data Room.

Venture Connect / Mentor Match:

- Owns mentor match preview/detail and request behavior.
- Displays match score, mentor fit reason, relevant expertise, and readiness gate status.
- Sends mentor request only when gates pass.
- Shows event details or visible feedback for event rows; no event row should be dead.

## 10. Out of Scope for v1

Do not implement these in Founder Workspace v1 demo work unless a future requirement explicitly changes scope:

- Real AI backend.
- Real PDF parsing.
- Real document storage.
- Real secure data room infrastructure.
- Real mentor notification.
- Full Mentor Command Center.
- Full Investor CRM.
- FAST Ledger.
- Real Cap Table.
- Payment or subscription infrastructure.

V1 may display mock representations of some concepts, but the UI must not imply they are production integrations.

## 11. Demo Acceptance Criteria

The v1 demo is acceptable when:

- Opening Overview answers mentor readiness within 5 seconds.
- Startup profile completion is visible and editable through local state.
- AI Pitch Readiness starts with readiness, not a blank editor.
- Upload/paste/generate-from-workspace paths lead to a runnable AI review.
- Run AI Review shows staged loading and updates diagnosis results.
- Fix top 3 visibly improves score, gaps, and slide diagnosis.
- Generate Mentor-Ready Deck creates previewable local slide data.
- Preview slides supports next/previous and clear disabled boundary states.
- Export mock PDF gives visible feedback.
- Send to Data Room updates Pitch Deck document readiness.
- Data Room reflects required document readiness and supports mock share/revoke without native browser confirm.
- Request Mentor Review is gated by profile, AI, data room, and deck readiness.
- Sent mentor request status persists when returning to Overview.
- Every visible primary CTA works, opens a modal, updates state, navigates, or shows a disabled reason.
- No `window.alert()` or native `window.confirm()` appears in Founder Workspace.
- No mojibake/corrupted copy appears in active Founder Workspace UI.
- Mobile and desktop layouts avoid horizontal overflow in the main demo path.

## 12. Future v2 Notes

Post-v1 improvements can include real AI review APIs, real document ingestion, secure data room infrastructure, mentor-side review workflows, investor CRM, advanced cap table/legal workflows, payments, and deeper analytics.

Those should remain v2 until the v1 mentor-readiness journey is stable, easy to demo, and fully understandable to a student founder.
