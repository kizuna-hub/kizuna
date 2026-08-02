# Visual QA Baseline

This is a review checklist, not evidence that review has occurred.

## Representative routes

Inspect at least one implemented route for each role:

- Founder workspace overview or dashboard.
- Mentor dashboard/request surface.
- Investor dashboard/deal-flow surface.

Use a real project/deal identifier when a dynamic route requires one. Record redirects, missing data, or runtime blockers rather than claiming a pass.

## Widths

Review at 375px, 768px, 1024px, and 1440px where tooling permits.

## Foundation checklist

- [ ] Global CSS and fonts load without flashes or missing variables.
- [ ] Shared tokenized surfaces use warm canvas/panel values.
- [ ] Legacy `accent-blue` classes render as Kizuna Clay, not saturated blue.
- [ ] Filled Clay actions use white text.
- [ ] Focus rings are visible.
- [ ] Selected state has a non-color cue.
- [ ] Panels, borders, radii, and shadows are internally consistent.
- [ ] No new landing-only spotlight/marketing composition appears in a workspace.

## Interaction checklist

- [ ] Keyboard navigation reaches primary controls in logical order.
- [ ] Icon-only controls have accessible names.
- [ ] Forms retain focus, label, invalid, disabled, and loading behavior.
- [ ] Dialogs, sheets, menus, and tooltips preserve focus and escape behavior.
- [ ] Visible actions navigate, change state, open UI, or explain why unavailable.
- [ ] No new hydration or browser console errors are introduced.

## Responsive checklist

- [ ] No accidental horizontal page overflow at 375px/768px.
- [ ] Sidebar/navigation remains accessible.
- [ ] Header actions wrap or recompose without overlap.
- [ ] Tables use an intentional narrow-screen strategy.
- [ ] Forms collapse cleanly and errors remain adjacent to fields.
- [ ] Overlays stay within the viewport and expose their close action.

## Reduced motion checklist

- [ ] Transform-heavy motion checks the user preference.
- [ ] Decorative continuous motion is absent or disabled.
- [ ] Loading feedback remains understandable without animation.

## Evidence

Record route, viewport, console result, interaction state, and a PASS/MINOR/FAIL outcome. Do not mark visual QA complete without executed runtime evidence.
