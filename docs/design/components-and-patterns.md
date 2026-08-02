# Components and Patterns

`components/ui/` is the single role-neutral primitive layer. Extend a compatible primitive before creating another version. Shared primitives never import Founder, Mentor, Investor, route, subscription, or product-domain modules.

## Button

Canonical component: `components/ui/button.tsx`.

| Variant | Purpose |
|---|---|
| `default` | Highest-priority Kizuna Clay action. |
| `secondary` | Supporting action on a standard panel. |
| `translucent` | Action over a complex dark surface, used sparingly. |
| `outline` | Lower-weight bordered action. |
| `ghost` | Compact local or icon action. |
| `destructive` | Irreversible or dangerous action. |
| `link` | Inline navigation/action link. |

Rules:

- Preserve the public variants, sizes, `asChild`, refs/slot behavior, disabled behavior, and accessible button semantics.
- Default and large buttons meet a 44px minimum target; small/icon variants need surrounding context and adequate effective target area on touch screens.
- A page may contain many actions, but only one should visually dominate each decision cluster.
- Icon-only buttons require an accessible name.
- Loading actions keep their width, expose a busy state, and prevent duplicate submission.

## Card

Canonical component: `components/ui/card.tsx`.

- Standard cards use workspace panel, border, and text tokens.
- Featured cards use surface elevation, not unrelated brand colors.
- Legacy spotlight variants remain for compatibility but are not a workspace composition pattern.
- Cards do not become clickable containers unless the entire semantic region has one clear destination and keyboard behavior.

## Badge and status

Canonical base: `components/ui/badge.tsx`.

- Prefer semantic state names such as success, warning, danger, active, pending, or neutral.
- Do not add palette-named variants such as emerald or orange.
- A future `StatusBadge` must extend or wrap the canonical badge rather than establish a second token/API system.
- Status meaning includes readable text or an accessible label; color alone is insufficient.

## Form controls

Inputs, textareas, selects, checkboxes, radio groups, switches, and form fields use the canonical `components/ui` implementation.

- Every control has a programmatic label.
- Placeholder text is not a label.
- Error text identifies the problem and a recovery action when possible.
- Disabled and read-only are distinct states.
- Focus, invalid, checked, and selected states use semantic tokens.

## Overlays

Dialogs, alert dialogs, sheets, drawers, popovers, dropdown menus, tooltips, command menus, and toasts preserve Radix/underlying-library keyboard and focus behavior.

- Dialogs trap focus, close predictably, label title/description, and return focus.
- Sheets/drawers are for contextual tasks, not a substitute for navigable pages.
- Tooltips supplement visible labels and never contain essential interactive content.
- Destructive confirmation uses `AlertDialog` or an equivalent explicit confirmation flow.

## Data display

Tables, progress, charts, skeletons, empty states, and pagination must work inside dense application layouts.

- Tables have a mobile strategy before implementation: priority columns, horizontal scrolling, stacked rows, or a detail drill-in.
- Charts include text summaries or accessible labels and do not rely on hue alone.
- Skeleton geometry approximates final content and does not animate under reduced motion.
- Progress communicates a value and what completes it.

## Landing helpers

`PrimaryCta`, `SecondaryCta`, `MarketingSection`, `ProductFrame`, `ProofChip`, and `SectionEyebrow` from the landing repository are not copied directly. Their useful token and interaction rules are represented by `Button`, `Badge`, application composition docs, and shared tokens.
