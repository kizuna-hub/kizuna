# Kizuna Frontend Architecture — Feature-First Structure

## 1. Purpose

This document defines the frontend architecture standard for Kizuna, especially for the Founder Workspace area.

The current issue is that feature modules such as `founder-workspace`, `ai-pitch-deck`, `data-room`, `cap-table`, `saas-perks`, `stakeholder-studio`, and `venture-connect` are currently placed under `components/`. This makes `components/` behave like a product-domain folder instead of a reusable UI layer.

Going forward, Kizuna should use a **feature-first architecture**:

- `app/` is for routing.
- `features/` is for product/domain modules.
- `components/ui/` is for reusable design-system primitives.
- `components/` may contain shared non-domain components only.
- `lib/` is for global utilities.
- `types/` is for global shared types only.

The goal is to make the codebase easier to scale, easier for agents to edit safely, and easier for humans to understand.

---

## 2. Core Rule

`page.tsx` should be a thin route entry file, not the place where an entire product feature is implemented.

A route file should usually do only three things:

1. Read route params/search params.
2. Fetch or prepare page-level data if needed.
3. Render the corresponding feature screen component.

Example:

```tsx
import { AiPitchDeckScreen } from '@/features/founder-workspace/ai-pitch-deck/ai-pitch-deck-screen';

export default async function Page({ params }: { params: { projectId: string } }) {
  return <AiPitchDeckScreen projectId={params.projectId} />;
}
```

Avoid putting large JSX trees, local mock data, modal logic, editor logic, tables, charts, or complex state directly inside `page.tsx`.

---

## 3. Target Folder Structure

```txt
app/
  [locale]/
    founder/
      founder-dashboard/
        page.tsx
      founder-workspace/
        [projectId]/
          layout.tsx
          page.tsx
          ai-pitch-deck/
            page.tsx
          data-room/
            page.tsx
          cap-table/
            page.tsx
          ip-ledger/
            page.tsx
          metrics/
            page.tsx
          saas-perks/
            page.tsx
          stakeholder-studio/
            page.tsx
          venture-connect/
            page.tsx

features/
  auth/
    auth-config.ts
    auth-page.tsx

  founder/
    founder-dashboard/
      founder-dashboard-screen.tsx
      components/
      hooks/
      lib/
      server/
      types.ts

    founder-workspace/
      workspace-shell.tsx
      workspace-ui.tsx
      dashboard-sidebar.tsx
      components/
      hooks/
      lib/
      server/
      types.ts

      ai-pitch-deck/
        ai-pitch-deck-screen.tsx
        components/
          ai-navigator-sidebar.tsx
          endorsement-manager.tsx
          paywall-modal.tsx
          pitch-deck-editor.tsx
          slide-preview-modal.tsx
        hooks/
        lib/
        server/
        types.ts

      data-room/
        data-room-screen.tsx
        components/
          access-ledger-expanded.tsx
          analytics-chart.tsx
          analytics-funnel.tsx
          data-room-header.tsx
          live-activity-takeover.tsx
          security-presets.tsx
        hooks/
        lib/
        server/
        types.ts

      cap-table/
        cap-table-screen.tsx
        components/
        hooks/
        lib/
        server/
        types.ts

      ip-ledger/
        ip-ledger-screen.tsx
        components/
        hooks/
        lib/
        server/
        types.ts

      metrics/
        metrics-screen.tsx
        components/
        hooks/
        lib/
        server/
        types.ts

      saas-perks/
        saas-perks-screen.tsx
        components/
        hooks/
        lib/
        server/
        types.ts

      stakeholder-studio/
        stakeholder-studio-screen.tsx
        components/
        hooks/
        lib/
        server/
        types.ts

      venture-connect/
        venture-connect-screen.tsx
        components/
        hooks/
        lib/
        server/
        types.ts

components/
  ui/
    button.tsx
    card.tsx
    dialog.tsx
    input.tsx
    tabs.tsx
    tooltip.tsx

  shared/
    app-logo.tsx
    empty-state.tsx
    error-state.tsx
    loading-state.tsx

lib/
  cn.ts
  formatters.ts
  constants.ts

types/
  common.ts
```

---

## 4. Folder Responsibilities

### `app/`

The `app/` folder is the Next.js routing layer.

Allowed in `app/`:

- `page.tsx`
- `layout.tsx`
- `loading.tsx`
- `error.tsx`
- `not-found.tsx`
- route groups
- dynamic routes
- metadata configuration

Avoid in `app/`:

- long UI sections
- business logic
- feature-specific components
- feature-specific mock data
- large client components
- modals/editors/charts/tables implemented inline

---

### `features/`

The `features/` folder contains product modules. A feature is a business/domain area, not a generic UI component.

Examples of Kizuna features:

- `features/founder/founder-dashboard`
- `features/founder/founder-workspace`
- `features/founder/founder-workspace/ai-pitch-deck`
- `features/founder/founder-workspace/data-room`
- `features/founder/founder-workspace/cap-table`
- `features/founder/founder-workspace/ip-ledger`
- `features/founder/founder-workspace/metrics`
- `features/founder/founder-workspace/saas-perks`
- `features/founder/founder-workspace/stakeholder-studio`
- `features/founder/founder-workspace/venture-connect`

Each feature can contain:

```txt
feature-name/
  feature-name-screen.tsx
  components/
  hooks/
  lib/
  server/
  types.ts
```

Recommended meanings:

- `*-screen.tsx`: the main screen component rendered by the route.
- `components/`: feature-specific UI sections.
- `hooks/`: client-side behavior for that feature.
- `lib/`: feature-specific utilities, constants, mappers, and mock data.
- `server/`: server actions, queries, data access, and mutations.
- `types.ts`: feature-specific TypeScript types.

---

### `components/ui/`

`components/ui/` is for reusable design-system primitives only.

Good examples:

- `button.tsx`
- `card.tsx`
- `dialog.tsx`
- `input.tsx`
- `textarea.tsx`
- `tabs.tsx`
- `tooltip.tsx`
- `dropdown-menu.tsx`
- `avatar.tsx`
- `badge.tsx`

Bad examples:

- `pitch-deck-editor.tsx`
- `data-room-header.tsx`
- `endorsement-manager.tsx`
- `security-presets.tsx`
- `workspace-ui.tsx`

Those are domain components and should live inside `features/`.

---

### `components/shared/`

`components/shared/` is for non-domain reusable application components.

Examples:

- `app-logo.tsx`
- `empty-state.tsx`
- `error-state.tsx`
- `loading-state.tsx`
- `page-header.tsx`

Do not place Founder Workspace-specific components here.

---

### `lib/`

Global `lib/` is only for reusable utilities that are not tied to one feature.

Examples:

- `cn.ts`
- `formatters.ts`
- `date.ts`
- `constants.ts`

Feature-specific utilities should stay inside the feature:

```txt
features/founder/founder-workspace/data-room/lib/data-room-utils.ts
```

---

### `types/`

Global `types/` is only for types used across multiple domains.

Feature-specific types should stay close to the feature:

```txt
features/founder/founder-workspace/ai-pitch-deck/types.ts
```

---

## 5. Server and Client Component Rules

Default to Server Components.

Only add `'use client'` when the component needs:

- `useState`
- `useEffect`
- event handlers
- browser APIs
- interactive modals
- drag and drop
- client-only charts
- local UI state

Do not add `'use client'` to `page.tsx` unless absolutely necessary.

Preferred pattern:

```txt
app route page.tsx
  -> Server Component
  -> renders feature screen
  -> feature screen composes server/client children
```

For interactive sections, isolate the client boundary:

```tsx
// ai-pitch-deck-screen.tsx
import { PitchDeckEditor } from './components/pitch-deck-editor';

export function AiPitchDeckScreen() {
  return <PitchDeckEditor />;
}
```

```tsx
// components/pitch-deck-editor.tsx
'use client';

export function PitchDeckEditor() {
  // client state and interactions here
}
```

---

## 6. Import Rules

Use absolute imports from project root when crossing feature boundaries:

```tsx
import { Button } from '@/components/ui/button';
import { AiPitchDeckScreen } from '@/features/founder/founder-workspace/ai-pitch-deck/ai-pitch-deck-screen';
```

Use relative imports inside the same feature:

```tsx
import { PitchDeckEditor } from './components/pitch-deck-editor';
import { mapSlides } from './lib/pitch-deck-utils';
import type { PitchDeckSlide } from './types';
```

Avoid deep imports into another feature's internal components:

```tsx
// Avoid this
import { SecurityPresets } from '@/features/founder/founder-workspace/data-room/components/security-presets';
```

If another feature needs something, extract it to:

- `components/shared/` if it is app-shared UI
- `components/ui/` if it is a primitive
- `features/founder/founder-workspace/components/` if it is shared only within Founder Workspace

---

## 7. Migration Plan

### Step 1 — Create `features/`

Create the new folder:

```txt
features/
  founder/
    founder-workspace/
```

### Step 2 — Move domain modules out of `components/`

Move these from:

```txt
components/founder/founder-workspace/*
```

to:

```txt
features/founder/founder-workspace/*
```

Move these from:

```txt
components/founder/founder-dashboard/*
```

to:

```txt
features/founder/founder-dashboard/*
```

Move auth domain files from:

```txt
components/auth/*
```

to:

```txt
features/auth/*
```

Only keep truly reusable UI primitives under `components/ui/`.

### Step 3 — Create screen entry files

For each feature route, create a screen component:

```txt
features/founder/founder-workspace/ai-pitch-deck/ai-pitch-deck-screen.tsx
features/founder/founder-workspace/data-room/data-room-screen.tsx
features/founder/founder-workspace/cap-table/cap-table-screen.tsx
features/founder/founder-workspace/ip-ledger/ip-ledger-screen.tsx
features/founder/founder-workspace/metrics/metrics-screen.tsx
features/founder/founder-workspace/saas-perks/saas-perks-screen.tsx
features/founder/founder-workspace/stakeholder-studio/stakeholder-studio-screen.tsx
features/founder/founder-workspace/venture-connect/venture-connect-screen.tsx
```

### Step 4 — Simplify `page.tsx`

Each route `page.tsx` should import and render the matching feature screen.

Example:

```tsx
import { DataRoomScreen } from '@/features/founder/founder-workspace/data-room/data-room-screen';

export default function Page() {
  return <DataRoomScreen />;
}
```

### Step 5 — Update imports

Update all imports from old paths:

```tsx
@/components/founder/founder-workspace/...
```

to new paths:

```tsx
@/features/founder/founder-workspace/...
```

And from:

```tsx
@/components/auth/...
```

to:

```tsx
@/features/auth/...
```

### Step 6 — Validate

Run:

```bash
npm run lint
npm run typecheck
npm run build
```

If the project does not have one of these scripts, run the available equivalent scripts from `package.json`.

---

## 8. Naming Rules

Use kebab-case for file names:

```txt
ai-pitch-deck-screen.tsx
pitch-deck-editor.tsx
data-room-header.tsx
security-presets.tsx
```

Use PascalCase for React component names:

```tsx
export function AiPitchDeckScreen() {}
export function PitchDeckEditor() {}
export function DataRoomHeader() {}
```

Use `types.ts` for feature types.

Use `*-utils.ts`, `*-constants.ts`, `*-mappers.ts`, or `*-mock-data.ts` inside feature `lib/` when needed.

---

## 9. Refactor Safety Rules

This migration is a structural refactor, not a redesign.

The agent must preserve:

- existing UI
- existing copy
- existing behavior
- existing route URLs
- existing animations
- existing responsive layout
- existing client interactions

The agent may change:

- file location
- import paths
- component boundaries
- naming when needed for consistency
- placement of mock data/constants/types

The agent must not:

- redesign UI
- remove features
- flatten all modules into one component
- move domain components into `components/ui/`
- add unnecessary abstractions
- put `'use client'` at the route level unless strictly required

---

## 10. Definition of Done

The refactor is complete when:

- `components/founder/*` no longer contains feature modules.
- `components/auth/*` no longer contains domain auth screens/config.
- Founder Workspace modules live under `features/founder/founder-workspace/*`.
- Founder Dashboard lives under `features/founder/founder-dashboard/*`.
- Auth domain files live under `features/auth/*`.
- `components/ui/` contains only reusable UI primitives.
- Route `page.tsx` files are thin and readable.
- Imports are updated and no old broken paths remain.
- The app builds successfully.
- The visual UI remains unchanged.

---

# Agent Refactor Prompt

Use this prompt when asking an AI coding agent to perform the migration.

```txt
You are working on the Kizuna codebase. Refactor the frontend architecture to follow the feature-first structure defined in this document.

Current problem:
Feature/domain modules are incorrectly placed under components/, especially:
- components/auth
- components/founder/founder-dashboard
- components/founder/founder-workspace
- components/founder/founder-workspace/ai-pitch-deck
- components/founder/founder-workspace/data-room
- components/founder/founder-workspace/cap-table
- components/founder/founder-workspace/ip-ledger
- components/founder/founder-workspace/metrics
- components/founder/founder-workspace/saas-perks
- components/founder/founder-workspace/stakeholder-studio
- components/founder/founder-workspace/venture-connect

Target architecture:
- app/ must remain the routing layer only.
- features/ must contain domain/product modules.
- components/ui/ must contain reusable UI primitives only.
- components/shared/ may contain app-level shared non-domain components.

Required migration:
1. Create a top-level features/ directory if it does not exist.
2. Move components/auth/* to features/auth/*.
3. Move components/founder/founder-dashboard/* to features/founder/founder-dashboard/*.
4. Move components/founder/founder-workspace/* to features/founder/founder-workspace/*.
5. Preserve the internal subfolders of Founder Workspace, including ai-pitch-deck, data-room, cap-table, ip-ledger, metrics, saas-perks, stakeholder-studio, and venture-connect.
6. Update every import path from @/components/founder/... to @/features/founder/...
7. Update every import path from @/components/auth/... to @/features/auth/...
8. Keep generic reusable primitives in components/ui only.
9. Do not move shadcn/ui-style primitives or generic components into features/.
10. Do not change route URLs.
11. Do not redesign the UI.
12. Do not remove existing behavior.
13. Do not introduce new libraries.
14. Keep page.tsx files thin. A route page should only import and render the corresponding feature screen, plus minimal route param handling or server data loading if needed.
15. Avoid placing 'use client' in page.tsx unless absolutely required. Keep client boundaries at interactive feature components.
16. After moving files, run the available validation scripts from package.json, such as lint, typecheck, and build.

Also improve feature boundaries where it is safe:
- If a route page currently contains large UI code, extract it into a {feature-name}-screen.tsx file inside the matching feature folder.
- If a file contains local mock data, constants, or helper functions, move them to the feature's lib/ folder when it improves readability.
- If a file contains feature-specific types, move them to the feature's types.ts file.
- If a component is used only by one feature, keep it inside that feature's components/ folder.
- If a component is reused by multiple Founder Workspace modules, place it under features/founder/founder-workspace/components/.
- If a component is a generic UI primitive, keep it under components/ui/.

Important constraints:
- This is a refactor, not a redesign.
- Preserve current visual output and behavior.
- Make the smallest safe changes needed to reach the target architecture.
- Prefer clear structure over clever abstraction.
- Do not over-engineer.

At the end, create or update docs/reports/feature-first-refactor-report.md with:
1. Summary of what changed.
2. Files/folders moved.
3. Import paths updated.
4. page.tsx files simplified.
5. Any components intentionally left in components/ and why.
6. Validation commands run and their results.
7. Remaining technical debt or follow-up recommendations.
```
