# Workspace Shell

The shell frames role-specific work without becoming a role-specific design system. Founder, Mentor, and Investor may organize navigation differently, but their shells share tokens, interaction behavior, and responsive rules.

## Required regions

- **Navigation:** role-appropriate destinations with a visible current location.
- **Topbar/header:** page identity, project/account context, and a restrained action area.
- **Main region:** a readable max width for forms/content or an intentional full-width treatment for tables and canvases.
- **Overlay layer:** standardized z-index, backdrop, focus, and escape behavior.

## Surface mapping

| Region | Token |
|---|---|
| Root | `workspace-background` |
| Sidebar | `workspace-sidebar` |
| Topbar | `workspace-topbar` |
| Panel/card | `workspace-panel` |
| Raised/selected panel | `workspace-elevated` / `workspace-selected` |
| Dividers | `workspace-border` |

Do not create a green Founder shell, blue Mentor shell, and purple Investor shell. Role identity comes from content, labels, permissions, and IA.

## Navigation behavior

- Current state uses text plus a border, indicator, or background; never hue alone.
- Destinations must exist and preserve locale.
- Desktop sidebars collapse into an accessible sheet/drawer or compact rail on small screens.
- Mobile overlays have a labeled close action, close on destination change, and return focus.
- Navigation groups may differ by role and permission.

## Header behavior

- A page has one primary heading.
- Place at most one visually dominant action in the header decision cluster.
- Project/account selectors preserve context across route changes.
- Search and notifications are controls, not decoration; unavailable actions are hidden or explained.

## Density

- Founder guidance may use wider explanations and next-action cards.
- Mentor review queues favor evidence summary and efficient navigation.
- Investor sourcing/portfolio views may use denser tables and filters.
- Density differences do not justify different tokens or primitive APIs.

## Current migration boundary

The Founder shell already consumes dark semantic tokens. Several Mentor and Investor shells still contain hardcoded light/forest values. They remain functional legacy surfaces and should be migrated route-by-route in a later visual refactor; this foundation task does not restructure their navigation or flows.
