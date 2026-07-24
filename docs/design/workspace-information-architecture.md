# Founder Workspace Information Architecture

## Vocabulary

- The interface says **Project**.
- Domain code says **Venture**.
- **Workspace** is the project-scoped operating environment.
- **Overview** is the default project destination.

Launchpad, Product, Startup, and Venture Connect are not interchangeable navigation labels.

## Canonical routes

All routes are localized through the existing `next-intl` navigation layer.

```text
/founder                         state-aware entry resolver
/founder/home                    cross-project continuity
/founder/projects                project portfolio
/founder/projects/[ventureId]    project Overview
/founder/projects/[ventureId]/context
/founder/projects/[ventureId]/cycle
/founder/projects/[ventureId]/evidence
/founder/projects/[ventureId]/sessions
/founder/projects/[ventureId]/outputs
/founder/projects/[ventureId]/timeline
/founder/programs                later-phase placeholder
/founder/opportunities           later-phase placeholder
/founder/library                 restrained placeholder
/submit-project                  New Project compatibility entry
```

## Global navigation

Active Phase 1 destinations:

1. Home
2. Projects

Later destinations appear below the active work and clearly state their status:

3. Programs
4. Opportunities
5. Library

New Project is a Projects action, not persistent navigation.

Home is a cross-project continuity and attention surface. It cannot duplicate an active project Overview or become a portfolio dashboard.

## Home continuity hierarchy

For a returning founder, Home follows this order:

1. contextual greeting;
2. one dominant continuation block for the valid last-active project;
3. up to three context-aware quick actions limited to Phase 2 context, decision, and cycle destinations;
4. a compact, urgency-sorted attention list derived from incomplete setup, scheduled sessions, and active program deadlines;
5. up to five meaningful recent activity rows, newest first;
6. an optional lightweight list of other active projects.

The continuation block shows project identity, stage and phase, the canonical current decision, the selector-derived next action, and one primary continuation destination. Project Overview remains a quiet secondary link.

Home adapts without introducing Home-specific persisted state:

- no accessible project shows one focused first-project action;
- an incomplete last-active project shows a three-step setup journey with only the current step expanded;
- one active project shows returning-founder continuity;
- multiple active projects add a bounded secondary-project list after activity;
- no urgent items hides the attention list and uses one calm inline status instead of a large empty-state card.

Quick actions and attention rows are links, never nested interactive cards. Evidence-review and mentor-feedback actions remain absent until their owning phases. Unsupported imports, invented metrics, passive page-view activity, and later-phase workflows do not appear.

## Project workspace navigation

```text
All Projects
Project switcher
Stage / status

Overview
Current Cycle
Evidence
Sessions
Outputs
Timeline
```

Overview, Venture Context, and Current Cycle are active. Evidence, Sessions, Outputs, and Timeline expose only current summaries or honest phase boundaries. Outputs links to the existing AI Pitch and Data Room compatibility routes without presenting them as the product center.

## Founder Decision Loop

Venture Context owns source provenance/review and the editable baseline. Draft fields save directly to canonical venture state. Confirmation is explicit and is the only transition that makes a baseline eligible for a scan.

Current Cycle is one guided four-step workspace. It uses a stepper rather than equal-weight tabs; completed steps may be reopened and every blocked step shows the requirement that unlocks it.

1. **Review** — understand what is supported, claimed, assumed, contradictory, or unknown; critical findings are expanded first and raw priority scores remain hidden.
2. **Compare** — compare no more than three candidates and persist the founder rationale for one choice.
3. **Explore** — inspect genuinely competing hypotheses, distinguishing evidence, and editable change-my-mind criteria.
4. **Plan** — define one falsifiable experiment, evidence targets, owner, timebox, tasks, stopping rules, and scope guard; then explicitly commit it.

Every step includes a compact provenance strip that describes context coverage without presenting it as evidence strength.

After commitment, **Active Cycle** replaces the workflow-first hierarchy and shows the selected decision, founder rationale, hypothesis, experiment, signals, evidence targets, task progress, exit criteria, and next action. The earlier reasoning remains available through a quiet, read-only **Review reasoning** destination.

Overview shows only the current review/decision state or committed cycle summary, owner, timebox, evidence-target count, next action, and experiment hypothesis. It does not duplicate the full reasoning workflow.

## Entry routing

The deterministic resolver applies this order:

1. No accessible ventures -> New Project intake.
2. One incomplete-setup venture -> that venture’s context/setup preview.
3. One active venture -> valid last-visited path or Overview.
4. Multiple ventures with a valid last-active venture -> its valid last-visited path or Overview.
5. Multiple ventures without valid continuity -> Projects.
6. Archived or invalid active venture -> Projects with a notice.

Browser persistence is treated as a hint and validated against canonical state. Valid direct project links remain valid. Invalid IDs render a recovery state rather than redirecting to unrelated content.

## Project switching

The switcher:

- lists active projects and marks the current project;
- disambiguates duplicate names with stage;
- updates canonical active and last-visited state;
- preserves the equivalent canonical subsection when it exists;
- preserves AI Pitch/Data Room only when switching between compatible legacy output routes;
- otherwise opens the target Overview;
- excludes archived projects from the normal menu;
- links to View all projects and Create new project.

Phase 2 baseline and experiment drafts autosave to canonical state. Switching ventures therefore does not lose edits and no synthetic leave warning is shown.

## Legacy mapping

| Legacy destination | Phase 1 treatment |
|---|---|
| Founder Launchpad | State-aware `/founder` entry |
| My Projects | `/founder/projects` |
| Submit Project | `/submit-project`, entered from Projects |
| Founder Workspace Overview | Canonical project Overview |
| AI Pitch Deck | Outputs compatibility |
| Secure Data Room | Outputs compatibility |
| Venture Connect | Deferred; Sessions shows existing support only |
| Discover | Opportunities placeholder |
| Future tools | Removed from active navigation |
| Mentor/Investor workspaces | Unchanged and deferred |

## Page hierarchy

Projects prioritizes name, stage, current phase, critical decision, next action, and updated time. Each row has one concise primary next-action button and one secondary Open overview link. The full selector-derived next action remains visible as supporting copy rather than being repeated inside the button.

Overview prioritizes:

1. project identity and phase;
2. blocked decision, rationale, and primary next action;
3. current support coverage.

Cycle, activity, program, and outputs summaries follow below the fold. Scores remain secondary.

## Mobile behavior

- The persistent sidebar becomes a labeled Sheet.
- The desktop shell uses a floating 248px sidebar with an 8px viewport inset and no redundant topbar.
- Project identity and switcher remain available at the top of the drawer.
- The primary page action remains visible in normal document flow.
- Project rows stack without nested interactive containers.
- Secondary workspace actions use quiet links or overflow.
- Menus and drawers close on navigation and retain visible focus behavior.
