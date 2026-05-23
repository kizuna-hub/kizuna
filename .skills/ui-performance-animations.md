# KIZUNA HUB - PERFORMANCE & ANIMATION RULES

Guidelines to ensure the UI remains blazing fast, lightweight, and professional.

## 1. Animation Philosophy (Framer Motion)
- **Minimalist Motion:** Animations must be subtle, professional, and purpose-driven. Avoid bouncy, cartoonish, or overly complex multi-stage animations.
- **Approved Effects:**
  - Fade-ins (`opacity: 0` to `1`).
  - Slight vertical lifts on hover (`y: -2px` or `scale: 1.02`).
  - Smooth layout transitions (`layoutId` in Framer Motion for shared elements).
- **Reduced Motion:** Always respect accessibility. Use Framer Motion's `useReducedMotion` hook to disable heavy animations for users who prefer it.

## 2. Image Optimization
- NEVER use standard `<img>` tags for static assets.
- Always use Next.js `<Image />` (`next/image`) for automatic WebP conversion, lazy loading, and correct sizing.
- Prevent Cumulative Layout Shift (CLS) by always explicitly defining `width` and `height`, or using `fill` with a relative parent container.

## 3. Bundle Size & Code Splitting
- **Dynamic Imports:** For heavy UI components that are not immediately visible (e.g., complex charts, modals, or heavy interactive maps), use `next/dynamic` to lazy load them.
- Example: `const HeavyChart = dynamic(() => import('./heavy-chart'), { ssr: false });`
- **Icon Imports:** Import specifically what you need from `lucide-react` to keep chunk sizes small.

## 4. Render Optimization
- Use React `memo`, `useMemo`, and `useCallback` only when identifying actual render bottlenecks. Do not prematurely optimize every component.
- Keep mapping functions clean. Always provide unique, stable `key` props (never use array indexes as keys if the array can change).