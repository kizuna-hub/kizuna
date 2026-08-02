# Foundations

The Kizuna workspace uses the landing site's **Quiet Conviction** foundation: calm, credible, ambitious, and human. The active token registry is `app/globals.css`; this file explains intent rather than duplicating every declaration.

## Brand palette

| Role | Token/class | Value |
|---|---|---|
| Canvas | `canvas` / `bg-canvas` | `#0B0A09` |
| Panel | `surface-1` / `bg-surface-1` | `#151311` |
| Elevated panel | `surface-2` / `bg-surface-2` | `#1E1B18` |
| High-contrast panel | `surface-3` / `bg-surface-3` | `#262320` |
| Primary text | `ink` / `text-ink` | `#F7F5F2` |
| Muted text | `ink-muted` / `text-ink-muted` | `#A39D96` |
| Border | `hairline` / `border-hairline` | `#2B2825` |
| Subtle border | `hairline-soft` / `border-hairline-soft` | `#1D1B19` |
| Primary signal | `primary` / `text-primary` | `#CC785C` |
| Primary soft | `primary-soft` / `bg-primary-soft` | `#2A1A15` |
| Primary border | `primary-border` / `border-primary-border` | `#704233` |
| Filled action | `primary-action` / `bg-primary-action` | `#B65B44` |
| Text on filled action | `on-primary` / `text-on-primary` | `#FFFFFF` |

The active application foundation is dark. `styles/globals.css` is a stale scaffold and is not a second theme source.

## Kizuna Clay semantics

Use Clay for meaningful state:

- The highest-priority action in a task cluster or page header.
- Active navigation and selected options, accompanied by shape, border, text, or an indicator.
- Focus rings and keyboard-visible interaction.
- Progress/readiness signals where the state is neither success nor danger.
- One short phrase of editorial emphasis in a heading when that improves comprehension.

Do not use Clay as ambient decoration, on every icon, on every border, or as a substitute for information hierarchy.

`accent-blue` is a compatibility name only. It resolves to Kizuna Clay so existing feature classes migrate safely without a page-wide rewrite. New code uses `primary`, `ring`, or a workspace semantic token.

## Workspace semantic layer

The workspace aliases describe purpose rather than paint:

| Purpose | CSS variable | Tailwind token |
|---|---|---|
| App background | `--workspace-background` | `workspace-background` |
| Sidebar | `--workspace-sidebar-background` | `workspace-sidebar` |
| Topbar | `--workspace-topbar-background` | `workspace-topbar` |
| Standard panel | `--workspace-panel-background` | `workspace-panel` |
| Elevated panel | `--workspace-elevated-background` | `workspace-elevated` |
| Border/divider | `--workspace-border` | `workspace-border` |
| Row hover | `--workspace-row-hover` | `workspace-row-hover` |
| Selected state | `--workspace-selected` | `workspace-selected` |
| Focus | `--workspace-focus-ring` | `workspace-focus-ring` |
| Secondary text | `--workspace-muted-text` | `workspace-muted-text` |
| Success/warning/danger | `--workspace-*-*` | `workspace-success`, `workspace-warning`, `workspace-danger` and soft variants |

These aliases exist because shell surfaces, rows, selections, focus, and status feedback recur in all three roles. Role names and page names do not belong in foundation tokens.

## Typography

| Role | Family | Usage |
|---|---|---|
| Display/heading | Geist Sans via `font-heading` / `font-display` | Page titles, section titles, editorial emphasis. |
| Body/UI | Geist Sans via `font-body` / `font-sans` | Forms, navigation, table text, descriptions, controls. |
| Mono | Loaded Geist Mono via `font-mono` | IDs, timestamps, compact metadata, code, and tabular evidence. |

Application page titles normally use `text-display-md`; reserve larger display sizes for sparse onboarding or major milestone moments. Dense tables and forms use the UI scale, not marketing display type.

Text hierarchy should come from size, spacing, surface, and tone before extreme weight. Avoid `font-black` as a default UI hierarchy tool.

The localized root loads both Geist families with `latin` and `latin-ext`; the compiled Latin Extended face covers Vietnamese diacritics.

### Founder operational scale

Founder Workspace operational surfaces use the application-scoped compositions in `app/globals.css` rather than changing public display tokens:

| Role | Mobile / desktop | Class |
|---|---|---|
| Page title | 23px / 24px | `workspace-page-title` |
| Critical decision | 19px / 20px | `workspace-decision-title` |
| Section title | 16px / 16px | `workspace-section-title` |
| Card/project title | 14px / 14px | `workspace-card-title` |
| Body | 14px / 13px | `workspace-body` |
| Supporting copy | 13px / 12px | `workspace-supporting` |
| Metadata | 12px / 11px | `workspace-meta` |
| Eyebrow | 10px / 10px | `workspace-eyebrow` |
| Project identity | 14px / 14px | `workspace-project-identity` |
| Buttons/navigation | 14px / 13px | `workspace-control-text` |
| Inputs | 16px / 13px | `workspace-input-text` |

These classes belong inside a `workspace-density` application surface. They do not shrink landing-page or public editorial typography.

## Spacing and density

- Use the existing shared scale; do not add page-named spacing tokens.
- Standard operational panel padding: `p-3.5` or `p-4`.
- Dense row padding: `px-3 py-2.5` to `px-3.5 py-3`, while maintaining usable targets.
- Founder page gutters: `px-4` mobile, `px-5` tablet, and `px-6` desktop.
- Founder page rails: `max-w-6xl` for wide operational pages and `max-w-5xl` for focused work.
- Desktop operational controls use a 34–36px visual height; touch layouts retain a 40–44px target.
- Major page regions use a 20px rhythm; card and compact-row gaps use 10–12px.
- Separate major page regions with space before introducing extra borders or shadows.

## Radius, borders, and elevation

| Pattern | Standard |
|---|---|
| Pill action/filter | `rounded-pill` |
| Input/control | `rounded-md` |
| Standard card/panel | `rounded-xl` |
| Large modal/drawer | `rounded-xl` or `rounded-2xl` |
| Avatar/status dot | `rounded-full` |
| Default separation | One-pixel `border-hairline` |
| Floating overlay | `shadow-framer-edge` |

Use elevation to explain containment and stacking. Avoid heavy glows, multiple nested shadows, or gradient spotlight cards in routine workspace UI.

## Accessibility foundation

- Visible keyboard focus is mandatory and uses the primary/workspace focus token.
- State must not be communicated by color alone.
- Filled Clay surfaces use `text-on-primary`.
- Disabled controls remain legible and explain blocking conditions when the user needs to act.
- Respect `prefers-reduced-motion`; the global reduced-motion safeguard is a fallback, not permission to add unnecessary motion.

## Prohibited patterns

- New hardcoded brand hex values in components.
- New saturated blue, violet, magenta, or orange brand accents.
- Separate Founder, Mentor, or Investor palettes.
- Light/forest styling as the target for new workspace UI; existing occurrences are migration debt.
- Global page/feature selectors that leak into unrelated routes.
- Decorative continuous animation, neon glow, or crypto/AI spotlight aesthetics.
