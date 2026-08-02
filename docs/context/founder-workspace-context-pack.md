# Founder Workspace Context Pack

## 1. Purpose of This Context Pack

This file is the compact source of truth for future coding agents working on Founder Workspace v1.

Agents should read this file first, then read only task-specific files. Use it to avoid reloading large reports, full rule folders, or unrelated modules unless the task truly requires them.

## 2. Product Goal

Kizuna does not help founders create prettier slides. Kizuna helps founders become mentor-review ready.

The Founder Workspace must answer within 5 seconds: "Is this startup ready to be reviewed by a mentor?"

Every primary surface should expose readiness, blockers, and deterministic next actions.

## 3. Canonical Founder Demo Flow

1. Overview: show readiness, blockers, and next best action.
2. AI Pitch Readiness: open pitch diagnosis and source selection.
3. Upload draft: add an uploaded/pasted draft or use workspace data.
4. Run AI Review: show staged mock review and update results.
5. Fix top 3: improve highest-impact gaps and score.
6. Generate deck: create a local mentor-ready slide deck.
7. Send to Data Room: mark Pitch Deck ready/shared.
8. Open Data Room: confirm required document readiness.
9. Request Mentor Review: send only if gates pass.
10. Back Overview: verify final state and activity.

## 4. Page Responsibilities

### Submit Project

Seeds the Founder Workspace with project data.

### Overview

Command center. Shows total readiness, blockers, next best action, profile completion, milestone progress, document readiness, AI readiness, recent activity, and mentor request state.

### AI Pitch Readiness

Engine. Diagnoses pitch content, scores readiness, fixes gaps, generates deck, and sends the deck to Data Room.

### Data Room

Output vault. Stores share-ready documents, including the AI-generated pitch deck, and supports mock share/revoke behavior.

### Venture Connect / Mentor Match

Conversion step. Shows mentor match context and sends mentor review request when readiness gates pass.

## 5. Current Architecture Summary

- Founder Workspace is feature-first under `features/founder/founder-workspace`.
- Route pages under `app/[locale]/founder/founder-workspace/[projectId]` should stay thin.
- Shared UI primitives live in `features/founder/founder-workspace/workspace-ui.tsx`.
- Shared demo state lives in `features/founder/founder-workspace/demo-state.ts`.
- Overview, AI Pitch, Data Room, and Venture Connect should use `useFounderWorkspaceDemoState(projectId)`.
- The historical main gap was that `submit-project` used React state only, did not create a project id, did not write Founder Workspace localStorage, and redirected to a static products path.
- The intended handoff is localStorage demo state only, not a backend contract.

## 6. Important Files

### Product Docs

- `docs/srs-v1.md`, `docs/workflow/founder-workspace-v1-demo-flow.md`
- `docs/reports/founder-end-to-end-flow-audit.md`, `docs/reports/srs-v1-compare.md`

### Submit Project

- `app/[locale]/submit-project/page.tsx`
- `components/submit-project/index.tsx`
- `components/submit-project/step1-basic.tsx`, `step2-details.tsx`, `step3-finish.tsx`
- `components/submit-project/progress-bar.tsx`, `dynamic-sidebar.tsx`

### Founder Workspace

- `app/[locale]/founder/founder-workspace/[projectId]/layout.tsx`
- `app/[locale]/founder/founder-workspace/[projectId]/page.tsx`
- `features/founder/founder-workspace/overview-screen.tsx`
- `features/founder/founder-workspace/dashboard/workspace-layout.tsx`, `sidebar.tsx`, `header.tsx`
- `features/founder/founder-workspace/workspace-ui.tsx`

### AI Pitch Readiness

- `app/[locale]/founder/founder-workspace/[projectId]/ai-pitch-deck/page.tsx`
- `features/founder/founder-workspace/ai-pitch-deck/ai-pitch-deck-screen.tsx`
- `features/founder/founder-workspace/ai-pitch-deck/slide-preview-modal.tsx`, `paywall-modal.tsx`

### Data Room

- `app/[locale]/founder/founder-workspace/[projectId]/data-room/page.tsx`
- `features/founder/founder-workspace/data-room/data-room-screen.tsx`
- `features/founder/founder-workspace/data-room/access-ledger-expanded.tsx`, `security-presets.tsx`, `types.ts`

### Venture Connect / Mentor Match

- `app/[locale]/founder/founder-workspace/[projectId]/venture-connect/page.tsx`
- `features/founder/founder-workspace/venture-connect/venture-connect-screen.tsx`

### Shared State

- `features/founder/founder-workspace/demo-state.ts`
- `features/founder/founder-dashboard/platform/products/data.ts`, `index.tsx`

## 7. Shared Demo State Direction

Use localStorage-backed deterministic demo state for v1. Do not imply real AI processing, document storage, mentor notification, or production persistence.

Recommended localStorage key:

```txt
kizuna-founder-project-demo-store-v1
```

Recommended store shape:

```ts
type FounderProjectDemoStore = {
  activeProjectId?: string
  projects: Array<{
    id: string
    createdAt: string
    submission: SubmitProjectSubmission
    workspaceState: FounderWorkspaceDemoState
  }>
}
```

## 8. Submit Project Handoff Contract

```txt
submit-project
-> create SubmitProjectSubmission
-> generate deterministic projectId
-> map submission to FounderWorkspaceDemoState
-> save to localStorage demo project store
-> redirect to /[locale]/founder/founder-workspace/[projectId]
```

Field mappings:

- `projectName` -> profile name; `slogan` -> tagline; `categories` -> industry/tags
- `status` -> stage/current milestone; `problem` -> profile problem; `solution` -> profile solution
- `targetAudience` -> target customer; `businessModel` -> business model
- `team` -> team profile and Founder Team Profile readiness
- `traction` -> evidence signal; `gallery` -> Product Screenshots readiness
- `demoLink` -> Prototype/Product Demo readiness; `supportNeed` / `mentorAsk` -> mentor review context

## 9. Readiness Gate Rules

- Profile completion >= 80
- AI readiness >= 85
- Data Room readiness >= 80
- Pitch Deck status is `generated` or `shared`

If missing, CTA must be locked with exact reasons. If ready, CTA opens confirmation modal. If sent, state becomes `Request sent` and persists.

## 10. Button Behavior Rules

No primary CTA may be dead.

A button must navigate, open a modal/drawer, update local mock state, show loading/progress, show feedback, or be disabled with a clear reason.

Important buttons: Submit Project, Edit profile, Run AI Review, Upload draft, Fix top 3 with AI, Improve with AI, Generate Mentor-Ready Deck, Preview slides, Export mock PDF, Send to Data Room, Open Data Room, Request Mentor Review, Back Overview.

## 11. Known Gaps

- Products dashboard may still rely on static products unless connected separately.
- Submit Project traction is still free text, and pitch draft upload starts inside AI Pitch Readiness.
- AI Pitch workspace-data source must avoid Kizuna-only hardcoded output for submitted projects.
- Venture Connect may still have local token UI alongside shared request state.
- Some submit-project copy/styling and repo-wide TypeScript debt remain outside this core flow.

## 12. Scope Boundaries / Do Not Build Yet

Do not build real backend API, real PDF parsing, real document storage, secure data room infrastructure, real AI backend, full Mentor Command Center, full Investor CRM, FAST Ledger, real Cap Table, payment/subscription, or a full redesign of submit-project before the handoff is solved.

## 13. Best Practice Prompt Format for Future Agents

```txt
Context files:
- Read docs/context/founder-workspace-context-pack.md
- Read only the specific report/workflow doc relevant to this task
Task-specific files:
- List only the files that will likely be modified
Do not read:
- unrelated Investor files
- unrelated Mentor files
- Cap Table
- IP Ledger
- SaaS Perks
- payment files
- full .cursor/rules unless the task changes design system rules
Extra file rule:
Only inspect additional files if imports, types, or runtime errors require it.
If extra files are needed, keep them minimal.
Goal:
- Specific implementation goal
Constraints:
- What not to change
Validation:
- Commands to run
- Manual demo flow to verify
Final report:
- Files changed
- Behavior changed
- State/storage changed
- Validation results
- Remaining issues
```

## 14. Recommended Prompt Templates

### Audit Prompt Template

```txt
Read docs/context/founder-workspace-context-pack.md and the relevant report/workflow doc.
Audit only the requested flow. Do not scan the entire repository.
Return findings by severity, file reference, demo risk, and next steps.
```

### Implementation Prompt Template

```txt
Read docs/context/founder-workspace-context-pack.md and these task files: [list files].
Implement [specific goal]. Do not scan the entire repository.
Preserve the active Kizuna design tokens, feature-first architecture, routes, and existing behavior.
Run available validation and report files changed, state/storage changes, and remaining issues.
```

### Bugfix Prompt Template

```txt
Read docs/context/founder-workspace-context-pack.md and the exact files tied to this bug.
Fix only [bug]. Do not scan the entire repository.
Do not redesign UI or refactor unrelated modules.
Run the smallest useful validation and report the result.
```

## 15. How to Use This Context Pack

- For audit tasks: read context pack plus relevant docs/reports.
- For implementation tasks: read context pack plus task-specific files.
- For bugfix tasks: read context pack plus exact files.
- For design-system tasks: only then read globals, Tailwind config, and `.cursor/rules`.

## Missing / Unavailable Context
All required source documents were available: `docs/srs-v1.md`, `docs/workflow/founder-workspace-v1-demo-flow.md`, `docs/reports/founder-end-to-end-flow-audit.md`, and `docs/reports/srs-v1-compare.md`.
