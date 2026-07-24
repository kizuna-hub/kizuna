import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * Button Component — Kizuna Quiet Conviction Design System
 *
 * Source of truth: docs/design/components-and-patterns.md
 *
 * Variant spec:
 *  default      → primary action    : Kizuna Clay with white text
 *  secondary    → button-secondary  : Charcoal pill for secondary actions
 *                 bg-surface-1 (#141414) + text-ink (#fff)
 *  translucent  → button-translucent: Frosted pill over busy/image backgrounds
 *                 bg-surface-2/70 + backdrop-blur-sm
 *  ghost        → Text-only bare action, no fill
 *  destructive  → Danger / error action
 *  link         → Inline Kizuna Clay hyperlink
 *  outline      → Bordered secondary on canvas
 *
 * Size spec:
 *  default → h-11 (44px) — minimum touch target
 *  sm      → h-9  (36px)
 *  lg      → h-12 (48px)
 *  card    → h-11 rounded-xl (for buttons inside card/bento contexts)
 *  icon    → 40px circle
 *
 * RULE: Preserve this public variant and size API across all role workspaces.
 */
const buttonVariants = cva(
  // ── Base — shared across ALL variants ──────────────────────────────────────
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'font-body text-btn font-medium',           // Geist Sans, 14px, weight 500
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
    'disabled:pointer-events-none disabled:opacity-40',
    '[&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 shrink-0 [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        /**
         * Primary action — Kizuna Clay with white on-primary text.
         */
        default:
          'bg-primary-action text-on-primary shadow-framer-edge hover:bg-primary-action-hover hover:shadow-framer-edge-lifted hover:-translate-y-0.5 active:bg-primary-action-active active:scale-[0.97]',

        /**
         * button-secondary — Charcoal pill.
         * bg-surface-1 = #141414 | text-ink = #ffffff
         * Used for: "Log In", "Sign in", "Talk to sales"
         */
        secondary:
          'bg-surface-1 text-ink border border-hairline hover:bg-surface-2 active:scale-[0.97]',

        /**
         * button-translucent — Frosted lifted pill.
         * For use on: CTA mosaic bg, gradient spotlight cards, busy image backdrops.
         * bg-surface-2/70 with backdrop-blur for the glass effect.
         */
        translucent:
          'bg-surface-2/70 text-ink backdrop-blur-sm border border-hairline/60 hover:bg-surface-2/90 active:scale-[0.97]',

        /**
         * Destructive — error / danger action.
         */
        destructive:
          'bg-destructive text-ink shadow-sm hover:bg-destructive/90 focus-visible:ring-destructive/30 active:scale-[0.97]',

        /**
         * Ghost — bare text action, no fill, no border.
         * text-ink-muted on rest, text-ink on hover with subtle tint.
         */
        ghost:
          'text-ink-muted hover:text-ink hover:bg-surface-1/60 active:scale-[0.97]',

        /**
         * Link — inline Kizuna Clay action/navigation treatment.
         */
        link:
          'text-primary underline-offset-4 hover:underline p-0 h-auto',

        /**
         * Outline — border + canvas bg. Hairline border, ink text.
         */
        outline:
          'border border-hairline bg-canvas text-ink hover:bg-surface-1 hover:border-hairline-soft active:scale-[0.97]',
      },

      size: {
        /**
         * Default pill — 44px touch target, pill radius (100px).
         * Kizuna default: h-11 with pill radius and stable horizontal padding.
         */
        default: 'h-11 px-5 rounded-pill',

        /**
         * Small pill — 36px height, still usable for inline/secondary contexts.
         */
        sm: 'h-9 px-4 rounded-pill text-caption',

        /**
         * Large pill — 48px generous CTA.
         */
        lg: 'h-12 px-7 rounded-pill',

        /**
         * Card-radius — embedded in card/bento context (rounded-xl, not pill).
         */
        card: 'h-11 px-5 rounded-xl',

        /**
         * Icon circle buttons.
         */
        icon: 'size-10 rounded-full',
        'icon-sm': 'size-9 rounded-full',
        'icon-lg': 'size-11 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
