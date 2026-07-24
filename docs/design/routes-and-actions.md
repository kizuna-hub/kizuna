# Routes and Actions

The workspace uses localized routes under `app/[locale]/`. Internal navigation must preserve the active locale, using the existing i18n helpers where appropriate.

## Verified route groups

- Founder: `/[locale]/founder/founder-dashboard/**` and `/[locale]/founder/founder-workspace/[projectId]/**`.
- Mentor: `/[locale]/mentor/dashboard/**`, `/[locale]/mentor/reputation`, and `/[locale]/mentor-profile/[id]`.
- Investor: `/[locale]/investor/dashboard`, `/deal-flow/**`, `/sourcing`, `/portfolio`, `/mentor-network`, `/intro/[token]`, and profile setup.
- Shared: localized auth, pricing, project profile, profile setup, submit project, and university admin routes.

Route files are the authority. Do not document or link a destination because a sidebar label implies it exists.

## Action integrity

Every visible action must do one of the following:

1. Navigate to an implemented route.
2. Open a functional dialog, sheet, menu, or detail view.
3. Trigger a real or clearly labeled demo state change.
4. Submit/update data with loading, error, and success feedback.
5. Be unavailable with an explanation and valid next step.

Do not use bare `href="#"`, `javascript:void(0)`, empty click handlers, fake upload/play controls, or silent dead buttons.

## Action hierarchy

- One visually dominant action per decision cluster.
- Supporting actions use secondary, outline, ghost, or menu treatment.
- Destructive actions are separated from routine actions and confirmed when recovery is difficult.
- Route transitions preserve the current project/deal/review context when required.

## Landing separation

Landing routes, unlocalized public navigation, external conversion URLs, section anchors, and SEO/analytics behavior are not workspace contracts.
