# Workspace States

Every workflow must deliberately handle loading, empty, partial, error, disabled, gated, and success states. A visually complete happy path is not a complete workspace.

## Loading

- Use a skeleton when final geometry is known and a spinner for a small bounded action.
- Keep the initiating label visible when helpful: "Analyzing readiness..." is better than an unexplained spinner.
- Set `aria-busy` where appropriate and prevent duplicate submission.
- Do not simulate loading for decorative effect.

## Empty

An empty state answers:

1. What is missing?
2. Why does it matter?
3. What can the user do next?

Avoid celebratory illustration or large copy when the user needs a compact table/list recovery action.

## Error

- Explain the failed operation in user terms.
- Preserve recoverable input and context.
- Offer retry, edit, back, or support only when those actions work.
- Field errors appear near fields; page errors appear in the affected region.
- Destructive errors use the danger semantic token, not arbitrary red utilities.

## Disabled and read-only

- Disabled means the action cannot be taken now.
- Read-only means the data is visible but cannot be edited by this role.
- Explain important gates inline or through accessible supporting text.
- Do not use disabled controls as the only explanation of permissions.

## Gated/upgrade

Gating identifies the capability, why it is unavailable, what tier/permission enables it, and a real next action. It does not interrupt unrelated browsing or imitate an error.

## Success

- Confirm the result and any state transition.
- Toasts are appropriate for lightweight confirmation; durable results also update the page.
- Do not rely on a disappearing toast for critical information.

## Demo and mock state

Mock/local behavior is allowed where the existing product scope uses it, but the interface must not imply a production backend, real security, live verification, or an autonomous AI decision. Demo controls still need functional transitions and recovery behavior.
