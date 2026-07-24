# Kizuna Hub SRS v1 — Founder Workspace MVP

## 1. Document Purpose

This document defines the focused Version 1 scope for Kizuna Hub.

The purpose of `srs-v1.md` is to prevent scope creep and help engineering agents, designers, and product contributors prioritize the most essential Founder Workspace experience before expanding into Mentor Command Center, Investor Deal Flow CRM, FAST Ledger, Pro-Rata modeling, and full Subscription infrastructure.

Kizuna Hub v1 must feel like a polished, interactive, and credible live demo for a startup competition.

The core v1 goal is:

> Help a student founder transform a raw startup idea into a structured, review-ready startup profile with AI assistance, visible progress, basic traction metrics, a demo-ready data room, and mentor matching signals.

---

## 2. Product Positioning for v1

Kizuna Hub is not a static startup marketplace.

For v1, Kizuna Hub should be positioned as:

> A digital incubation workspace for student founders, designed to standardize startup ideas, improve pitch readiness, and prepare early-stage projects for mentor review.

The v1 product should communicate three ideas clearly:

1. The founder knows what to do next.
2. The startup profile becomes more complete over time.
3. AI and mentor signals help the founder prepare a stronger startup submission.

Kizuna Hub v1 is not yet a full investment platform.

---

## 3. Primary User Persona

### Student Founder

A student founder is a university student or young builder who has an early-stage startup idea and needs help turning it into a structured project profile.

The founder may not yet understand:

* How to structure a pitch deck
* What information mentors or investors expect
* How to measure traction
* How to explain problem, solution, market, business model, and team
* How to prepare a professional data room
* What the next milestone should be

The Founder Workspace must guide this user step by step.

---

## 4. v1 Product Goal

The v1 product goal is to make the Founder Workspace feel like a real SaaS dashboard where a founder can:

1. View startup health at a glance
2. Understand profile completion status
3. Use mock AI actions to improve pitch readiness
4. Track milestones and traction
5. Manage a basic data room
6. View mentor matching recommendations
7. Navigate through all visible UI actions without dead buttons

---

## 5. v1 North Star Experience

When a user enters the Founder Workspace, they should immediately understand:

* What startup/project they are working on
* How complete their profile is
* What the AI readiness score is
* What needs to be improved next
* Whether the pitch deck/data room is ready
* Whether mentor matching is available
* What action they should take first

The dashboard should answer:

> “Is my startup ready to be reviewed by a mentor?”

---

## 6. Core v1 Scope

### 6.1 Must Have

The following modules are required for v1.

#### A. Founder Workspace Dashboard

The dashboard is the main landing page for the founder.

It must include:

* Welcome/header section
* Startup identity summary
* Profile completion status
* AI readiness score
* Startup health indicators
* Next recommended actions
* Milestone progress
* Traction snapshot
* Pitch/Data Room status
* Mentor matching preview
* Recent activity

The dashboard must not feel static. It should include real interactions, mock state changes, modals, drawers, tabs, or route navigation where appropriate.

---

#### B. Startup Profile Overview

The founder should be able to view and edit a basic startup profile.

Required fields:

* Startup name
* One-line description
* Industry
* Stage
* Problem statement
* Solution summary
* Target customer
* Business model
* Team summary
* Current traction
* Funding goal or support need

For v1, data can be mock/local state. Backend integration is not required.

---

#### C. AI Pitch Readiness

The product should simulate AI-assisted evaluation.

Required elements:

* AI Pitch Score
* Completeness score
* Key strengths
* Missing information
* Suggested next improvements
* Mock “Run AI Review” action
* Loading state while AI review is running
* Updated mock result after completion

The AI must not be presented as making final investment decisions. It should be framed as an assistant that helps prepare the profile for human review.

---

#### D. Founder Onboarding Checklist

The workspace should include a checklist that helps the founder understand their progress.

Suggested checklist items:

* Create startup profile
* Complete problem and solution
* Add target customer
* Add traction metrics
* Upload or generate pitch deck
* Prepare data room
* Run AI readiness review
* Request mentor review

Checklist items should visually show completed, active, and locked states.

At least some checklist interactions should work in demo mode.

---

#### E. Traction and Startup Health Snapshot

The Founder Workspace should show a basic traction/health section.

Required metrics:

* Users or early adopters
* Monthly revenue or mock MRR
* Burn rate
* Runway
* Milestone completion
* Pitch readiness

For v1, these values can be realistic mock data.

The UI must explain metrics clearly enough for student founders.

---

#### F. Milestone Progress

The founder should see a lightweight incubation progress section.

Required milestone examples:

* Idea validation
* Customer discovery
* Prototype/MVP
* Early traction
* Mentor review
* Pitch readiness

Each milestone should have:

* Status
* Progress indicator
* Due date or target period
* Next action

---

#### G. Secure Data Room — Basic Demo Version

The data room should exist in v1, but only as a demo-safe version.

Required features:

* Data room status card
* List of documents
* Document type/status
* Mock upload action
* Mock generate/share link action
* Mock revoke link action
* Basic access state

Required document examples:

* Pitch Deck
* Business Model Canvas
* Financial Snapshot
* Product Screenshots
* Founder Team Profile

Do not implement real secure file infrastructure in v1 unless already available.

No dead buttons are allowed. If an action is not truly implemented, it must show a modal, toast, disabled state, or demo explanation.

---

#### H. Mentor Matching Preview

The Founder Workspace should include a mentor matching preview.

Required elements:

* Suggested mentors
* Match score
* Area of expertise
* Why this mentor matches
* CTA to request mentor review
* Mock request state

For v1, this is only a founder-side preview. A full Mentor Command Center is not required.

---

#### I. Recent Activity

The dashboard should include recent activity to make the demo feel alive.

Example activities:

* AI reviewed pitch profile
* Data room link generated
* Mentor match updated
* Profile completeness increased
* Milestone marked as completed
* Pitch deck uploaded

Activity items can be mock data.

---

#### J. Demo-Ready Navigation

All visible navigation items inside Founder Workspace must work.

If a page is not fully implemented, create a polished placeholder page with:

* Feature title
* Short explanation
* Current demo status
* Coming next section
* Back/navigation support

No sidebar item, tab, CTA, or primary button should silently fail.

---

## 7. Explicitly Out of Scope for v1

The following features are not required in v1 and should not be prioritized unless the existing code already has stable implementations.

### 7.1 Out of Scope

* Full Mentor Command Center
* Full Investor Deal Flow CRM
* FAST Ledger
* Legal advisor-founder equity agreements
* Electronic signing
* Pro-Rata Simulator
* Full Cap Table engine
* Real subscription billing
* Payment gateway integration
* Real investor due diligence workflow
* Real-time portfolio dashboard for investors
* Advanced AI Agents using autonomous ReAct loops
* Production-grade secure document infrastructure
* Complex notification system
* Mobile app implementation

### 7.2 Allowed as Placeholder

These features may appear as teaser cards or placeholder pages:

* Mentor Command Center
* Investor CRM
* FAST Ledger
* Subscription plans
* Pro-Rata Simulator
* Advanced Data Room Analytics

However, placeholders must be clearly labeled as upcoming or demo-preview features.

---

## 8. v1 Information Architecture

Suggested Founder Workspace structure:

```txt
components/founder/founder-workspace/
```

Alternative route names may be used if the project already has a different structure, but navigation must remain clear and consistent.

---

## 9. v1 UI/UX Requirements

### 9.1 Overall Experience

The UI should feel:

* Premium
* Calm
* Founder-focused
* SaaS-like
* Clean
* Structured
* Demo-ready
* Trustworthy

It should not feel like:

* A static mockup
* A random admin template
* A generic student project UI
* An overcomplicated VC platform
* A page with beautiful cards but no real interaction

---

### 9.2 Visual Hierarchy

The dashboard should prioritize:

1. Current startup status
2. Next best action
3. AI readiness
4. Profile completion
5. Data room readiness
6. Mentor match suggestions
7. Recent activity

Primary CTAs should be visually obvious.

Secondary actions should not compete with primary actions.

---

### 9.3 Founder Guidance

The UI must guide the founder.

Use clear labels such as:

* “Complete your startup profile”
* “Run AI pitch review”
* “Prepare your data room”
* “Request mentor feedback”
* “Improve your traction section”
* “Generate share link”

Avoid vague CTAs such as:

* “Continue”
* “Start”
* “Explore”
* “Manage”
* “Go”

unless the surrounding context is very clear.

---

### 9.4 Empty States

Every empty state should explain:

* What is missing
* Why it matters
* What the founder should do next

Example:

> No pitch deck uploaded yet. Upload your pitch deck or use AI to generate a structured first draft before requesting mentor review.

---

### 9.5 Loading States

Any mock AI action should include a realistic loading state.

Examples:

* “Analyzing problem-solution clarity…”
* “Checking pitch completeness…”
* “Matching mentor expertise…”
* “Generating readiness summary…”

---

### 9.6 Disabled States

If a feature is locked or unavailable, the UI must explain why.

Example:

> Mentor request is locked until your startup profile reaches 70% completion.

---

### 9.7 Responsive Design

Founder Workspace must work on:

* Desktop
* Tablet
* Mobile

At minimum:

* Cards should stack correctly on smaller screens
* Sidebar/navigation should remain usable
* Tables should not overflow badly
* Primary actions should remain visible
* Text should not become cramped

---

## 10. v1 Interaction Requirements

Every visible interactive element must do one of the following:

1. Navigate to a route
2. Open a modal
3. Open a drawer
4. Toggle UI state
5. Trigger a mock action
6. Show a toast/notification
7. Be disabled with clear explanation

No dead buttons are allowed.

### Required Demo Interactions

#### Run AI Review

When clicked:

1. Show loading state
2. Simulate review progress
3. Display updated AI readiness result
4. Show strengths and improvement suggestions

#### Update Profile

When clicked:

1. Open edit form or navigate to profile page
2. Allow demo-safe editing
3. Save to local state if possible
4. Show success feedback

#### Generate Data Room Link

When clicked:

1. Open modal or inline panel
2. Generate mock share link
3. Show expiration/access state
4. Allow revoke action

#### Request Mentor Review

When clicked:

1. Check whether profile readiness is sufficient
2. If sufficient, show confirmation state
3. If not sufficient, show what must be completed first

#### Mark Milestone Progress

When clicked:

1. Update milestone status or open milestone detail
2. Show progress feedback

---

## 11. v1 Functional Requirements

### FR-001 Founder Dashboard

The system shall display a founder dashboard summarizing startup profile, AI readiness, progress, traction, data room, mentor match, and recent activity.

Priority: P0

Acceptance Criteria:

* Dashboard loads without errors
* Founder can understand current startup state within 5 seconds
* Primary CTA is visible above the fold
* At least 5 core status cards are shown
* Dashboard is responsive

---

### FR-002 Startup Profile Completion

The system shall display a startup profile completion score based on required startup fields.

Priority: P0

Acceptance Criteria:

* Completion score is visible
* Missing fields are listed
* CTA allows user to continue editing
* Empty/missing data state is handled

---

### FR-003 AI Pitch Readiness Review

The system shall provide a mock AI pitch readiness review.

Priority: P0

Acceptance Criteria:

* User can trigger AI review
* Loading state appears
* AI readiness score is shown
* Strengths and weaknesses are shown
* Suggestions are actionable
* AI is framed as advisory, not final decision-making

---

### FR-004 Founder Checklist

The system shall provide an onboarding/progress checklist for founders.

Priority: P0

Acceptance Criteria:

* Checklist shows completed, active, and locked states
* Each item has a clear label
* At least one checklist item is interactive
* Checklist supports the main founder journey

---

### FR-005 Traction Snapshot

The system shall show key startup traction and health metrics.

Priority: P0

Acceptance Criteria:

* Metrics are visible and readable
* Burn rate/runway are explained or labeled clearly
* Values use realistic mock data
* Responsive layout works

---

### FR-006 Milestone Tracker

The system shall show incubation milestone progress.

Priority: P0

Acceptance Criteria:

* Milestones have status labels
* Milestones show progress
* User can open or interact with milestone items
* Next milestone is clearly identified

---

### FR-007 Basic Data Room

The system shall provide a demo-ready data room interface.

Priority: P0

Acceptance Criteria:

* Document list is visible
* Document states are visible
* Generate link action works in demo mode
* Revoke link action works in demo mode
* Upload action has demo-safe behavior
* No real backend upload is required for v1

---

### FR-008 Mentor Match Preview

The system shall show suggested mentors and match reasoning.

Priority: P1

Acceptance Criteria:

* Suggested mentors are visible
* Match scores are visible
* Match explanation is visible
* Request mentor review action works in demo mode

---

### FR-009 Recent Activity

The system shall show recent founder workspace activity.

Priority: P1

Acceptance Criteria:

* At least 5 activity items are visible
* Activity items look realistic
* Activity section supports the feeling of a live system

---

### FR-010 Demo Navigation

The system shall ensure every visible navigation item works.

Priority: P0

Acceptance Criteria:

* No primary navigation item fails silently
* Placeholder pages exist for unfinished sections
* Back navigation or layout navigation remains consistent
* Active route state is visible

---

## 12. Non-Functional Requirements

### NFR-001 Design System Compliance

The implementation must follow:

* `.cursor/rules/**/*.md`
* `app/globals.css`
* `tailwind.config.ts`

The agent must read these files before refactoring.

Do not invent a new visual language.

---

### NFR-002 Code Quality

The implementation must:

* Use TypeScript correctly
* Avoid unnecessary dependencies
* Avoid duplicated components when reusable components are appropriate
* Keep mock data organized
* Avoid hardcoded design values when tokens/utilities already exist
* Avoid hydration errors
* Respect Next.js server/client component boundaries

---

### NFR-003 Accessibility

The implementation must include:

* Semantic HTML where possible
* Accessible buttons
* Focus-visible states
* Clear labels
* Reasonable color contrast
* Keyboard-friendly interaction for core controls

---

### NFR-004 Performance

The Founder Workspace should feel fast.

Avoid:

* Heavy unnecessary animation
* Large client bundles
* Expensive computation in render
* Unoptimized repeated components

---

### NFR-005 Demo Reliability

The demo must not break during presentation.

Required:

* No runtime errors
* No dead CTAs
* No broken routes
* No obvious placeholder lorem ipsum
* No inconsistent visual system
* No confusing locked states

---

## 13. Suggested Mock Data

Use realistic mock data such as:

### Startup

```ts
const startup = {
  name: "Kizuna Hub",
  tagline: "AI-powered digital incubation workspace for student founders.",
  industry: "AI / EdTech / Startup Infrastructure",
  stage: "Pre-seed",
  location: "Da Nang, Vietnam",
  profileCompletion: 72,
  aiReadinessScore: 81,
  runwayMonths: 6,
  burnRate: 5000000,
  earlyUsers: 120,
  mentorMatches: 4,
}
```

### AI Suggestions

```ts
const aiSuggestions = [
  "Clarify the target customer segment for the first pilot cohort.",
  "Add evidence from student startup competitions or club partnerships.",
  "Strengthen the revenue model by separating student, university, and investor segments.",
  "Add measurable traction milestones for the next 30 days."
]
```

### Mentor Match

```ts
const mentorMatches = [
  {
    name: "Pioneer Founder",
    expertise: "SaaS, Fundraising, Startup Operations",
    matchScore: 92,
    reason: "Strong match for early-stage SaaS positioning and mentor-led incubation."
  }
]
```

---

## 14. v1 Acceptance Criteria

Kizuna Hub Founder Workspace v1 is considered complete when:

1. The Founder Workspace dashboard is visually polished and responsive.
2. The founder can understand their startup status immediately.
3. AI readiness review works as a demo interaction.
4. Startup profile completion is visible and actionable.
5. Onboarding checklist guides the next actions.
6. Data Room has demo-ready interactions.
7. Mentor matching preview is visible and interactive.
8. Milestones and traction metrics are displayed clearly.
9. Every visible button/CTA/navigation item works or is intentionally disabled with explanation.
10. The UI follows existing project rules, global CSS, and Tailwind config.
11. Lint/typecheck/build pass after changes.
12. The demo can be presented confidently without backend dependency.

---

## 15. v1 Engineering Agent Instructions

Before editing code, the agent must:

1. Read all `.md` files inside `.cursor/rules`
2. Read `app/globals.css`
3. Read `tailwind.config.ts`
4. Inspect current Founder Workspace routes, pages, layouts, and components
5. Identify current UI/UX gaps
6. Identify dead buttons and broken navigation
7. Plan the refactor according to this `srs-v1.md`

The agent must not:

* Refactor the entire app unnecessarily
* Build full Mentor Command Center
* Build full Investor CRM
* Build payment/subscription infrastructure
* Build legal FAST contract features
* Build Pro-Rata or advanced Cap Table engines
* Invent a new design system
* Leave dead buttons
* Create fake backend integrations

The agent should:

* Prioritize Founder Workspace
* Make the demo interactive
* Use local/mock state where needed
* Add placeholder routes only when necessary
* Keep the product polished and coherent
* Validate with available project commands

---

## 16. v1 Definition of Done

Founder Workspace v1 is done when it satisfies the following checklist:

### Product

* [ ] Founder can see project status
* [ ] Founder can see AI readiness
* [ ] Founder can see next best action
* [ ] Founder can manage basic profile
* [ ] Founder can view traction snapshot
* [ ] Founder can track milestones
* [ ] Founder can use basic Data Room demo
* [ ] Founder can view mentor match preview

### UI/UX

* [ ] Layout follows project design system
* [ ] Visual hierarchy is clear
* [ ] Cards are consistent
* [ ] Buttons are meaningful
* [ ] Empty states are helpful
* [ ] Loading states exist for AI/demo actions
* [ ] Responsive behavior is acceptable
* [ ] Accessibility basics are handled

### Demo

* [ ] No dead primary CTA
* [ ] No broken Founder Workspace route
* [ ] Mock AI interaction works
* [ ] Mock Data Room link interaction works
* [ ] Mentor request interaction works or is clearly gated
* [ ] Placeholder pages are polished if needed

### Engineering

* [ ] TypeScript passes
* [ ] Lint passes
* [ ] Build passes
* [ ] No hydration errors
* [ ] No unnecessary dependencies
* [ ] Mock data is organized
* [ ] Components remain maintainable

---

## 17. Future Scope for `srs-v2.md`

The following should be considered for v2 after v1 is complete:

* Full Mentor Command Center
* Mentor review inbox
* Async annotations on documents
* Warm Intro Hub
* Investor Deal Flow CRM
* Investor appetite settings
* Due Diligence Vault
* Data Room analytics and heatmaps
* Cap Table engine
* FAST Ledger
* Pro-Rata Simulator
* Subscription billing
* Advanced AI Policy Navigator with RAG citations
* AI Deal Scorer
* AI Matchmaker improvements
* Admin dashboard
* Organization/cohort management
* Real backend persistence
* Real document security layer
* Notification system
* Mobile app alignment

v2 should only start after v1 Founder Workspace is polished, interactive, and demo-ready.
