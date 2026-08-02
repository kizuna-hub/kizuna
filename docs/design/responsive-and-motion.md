# Responsive and Motion

## Review widths

| Width | Purpose |
|---|---|
| 375px | Constrained mobile baseline. |
| 768px | Tablet/small laptop transition. |
| 1024px | Standard laptop workspace. |
| 1440px | Wide desktop and dense data review. |

## Responsive principles

- Recompose instead of shrinking desktop UI.
- Fix the source of horizontal overflow; do not hide it at the root as a default.
- Preserve readable labels and an effective 44px touch target for primary mobile interactions.
- Do not force desktop sticky regions onto mobile.
- Popovers, menus, and tooltips remain within the viewport and are not clipped by accidental overflow.

## Motion principles

Motion serves hierarchy, feedback, orientation, or a real state transition.

Allowed patterns include short color/border transitions, restrained hover lift, overlay enter/exit, accordion height/opacity, and progress tied to real work.

Avoid continuous floating/pulsing decoration, background particle systems, neon glow, large parallax, heavy blur animation, or fake progress.

## Reduced motion

- Respect `prefers-reduced-motion` in CSS and `useReducedMotion()` for transform-heavy React motion.
- Under reduced motion, prefer instant state changes or short opacity transitions.
- Loading indicators may continue when they communicate real waiting, but decorative loops stop.
- The global stylesheet provides a safety fallback; interactive components remain responsible for correct behavior.
