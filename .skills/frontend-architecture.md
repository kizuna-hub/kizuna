# KIZUNA HUB - FRONTEND ARCHITECTURE GUIDELINES

Rules for structuring the Next.js (App Router) frontend application.

## 1. React Server Components (RSC) vs Client
- **Default to RSC:** Every component in `app/` is a Server Component. Do NOT add `'use client'` unless necessary.
- **Client Boundary:** Only use `'use client'` at the leaf nodes (components requiring `useState`, `useEffect`, or DOM events like `onClick`).
- Never wrap massive layouts or pages in `'use client'` if they only display static data.

## 2. Directory Structure
- `app/`: Only contains routing files (`page.tsx`, `layout.tsx`). Keep UI logic OUT of here.
- `components/ui/`: Dumb, reusable, primitive components (Buttons, Inputs, Dialogs).
- `components/[feature]/`: Smart components or domain-specific UI (e.g., `components/public/main-feed.tsx`).
- `lib/`: Pure utility functions (`cn` for Tailwind, formatters).
- `types/`: Global TypeScript interfaces.

## 3. Tech Stack & Practices
- **Framework:** Next.js 14+ App Router.
- **Language:** TypeScript strictly typed. No `any`.
- **Icons:** Use `lucide-react`.
- **Backend Sync (Future-proofing):** The backend will be NestJS + PostgreSQL. Prepare frontend components to eventually accept data via props or SWR/React Query hooks. For now, isolate mock data in `data.ts` files alongside their components.