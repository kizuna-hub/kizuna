# Workspace Components

Workspace components compose shared primitives into application patterns. They may know about layout and workflow state, but reusable compositions must stay below role/business logic when practical.

## Layering

```text
Design tokens
  -> components/ui primitives
    -> shared workspace compositions
      -> role feature components
```

Never reverse this direction. A shared primitive must not import a feature. A role feature may import a shared primitive or role-neutral composition.

## Page header

Contains an optional eyebrow/context label, one `h1`, a concise description, and an action cluster. On narrow screens it stacks; actions remain reachable and wrap without overlap.

## Section header

Contains one section heading, optional supporting text, and an optional local action. Use UI typography for dense settings/tables and display typography for major page sections.

## Panel/card

Uses workspace panel, border, and elevation tokens. The header aligns title/description with an optional local action. Avoid nested cards when spacing or a divider communicates grouping.

## Metric

Includes label, value, unit/timeframe, and interpretation or comparison when required. Use tabular numbers. Status/change direction is not conveyed by color alone.

## Filters and search

- Search has a label or accessible name, clear behavior, and a visible empty result state.
- Filter chips use selected semantics and remain keyboard accessible.
- Mobile filter sets move into a sheet/drawer when wrapping obscures content.
- Active filters are summarized and individually removable.

## Tables and lists

- Rows provide one obvious primary interaction.
- Hover is enhancement, not the only affordance.
- Bulk actions appear only after selection and explain scope.
- Sticky headers/columns are tested at target widths.
- Empty, loading, error, and partial-data states follow `workspace-states.md`.

## Forms

- Group fields by decision, not by database schema.
- Put help text next to the field it explains.
- Preserve entered data on recoverable errors.
- Primary submit and secondary cancel/back actions have stable placement.
- Long workflows expose progress and saved state.

## Domain-shared vs global shared

`features/founder/founder-workspace/workspace-ui.tsx` is Founder Workspace shared UI, not a global primitive root. Promote a composition only after it is demonstrably role-neutral and reused; do not move feature-specific state or copy into `components/ui`.
