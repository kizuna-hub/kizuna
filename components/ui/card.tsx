import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Card Component — Kizuna Quiet Conviction Design System
 *
 * Source of truth: docs/design/components-and-patterns.md
 *
 * Surface hierarchy:
 *  Card         → standard workspace panel
 *  CardFeatured → elevated/selected workspace panel
 *  CardSpotlight → legacy compatibility only; do not use in new workspace UI
 *
 * Shape:
 *  - rounded-xl  (20px) for standard content cards — pricing-card spec
 *  - rounded-xxl (30px) for atmospheric spotlight panels
 *
 * Elevation (retained light-edge utility names):
 *  - Level 2: 0.5px white top-edge inset + 10px/30px black drop shadow
 *  - Level 2 hover: same + translate-y-1 + deeper shadow
 *  - No role-specific brand tint
 *
 * Typography inside cards:
 *  - Titles   : font-display, text-headline, text-ink
 *  - Body copy: font-body, text-body-framer-sm, text-ink-muted
 */

// ── Card (default — surface-1 charcoal tile) ──────────────────────────────────
function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        // Standard workspace panel surface.
        'bg-surface-1 text-ink',
        // Canonical one-pixel hairline border.
        'border border-hairline',
        // Shape: rounded-xl = 20px (pricing-card radius)
        'rounded-xl',
        // Elevation level 2: white 0.5px top-edge inset + dark drop shadow
        'shadow-framer-edge',
        // Hover: physical lift + shadow step up
        'transition-all duration-300 will-change-transform',
        'hover:-translate-y-1 hover:shadow-framer-edge-lifted',
        className,
      )}
      {...props}
    />
  )
}

// ── CardFeatured (surface-2 — recommended / emphasized) ─────────────────────
function CardFeatured({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-featured"
      className={cn(
        // Elevated surface: one step above the standard panel.
        'bg-surface-2 text-ink',
        'border border-primary/30',
        'rounded-xl',
        'shadow-framer-edge',
        'transition-all duration-300 will-change-transform',
        'hover:-translate-y-1 hover:shadow-framer-edge-lifted',
        className,
      )}
      {...props}
    />
  )
}

// ── CardSpotlight (gradient atmosphere tile) ──────────────────────────────────
/**
 * Legacy gradient spotlight compatibility.
 * Do not use this decorative marketing pattern in new workspace UI.
 *
 * gradient prop:
 *  - "violet"  (default) → #4A00E0 → #6a4cf5
 *  - "magenta"           → #FF007F → #d44df0
 *  - "orange"            → #FF4B2B → #ff7a3d
 *  - "coral"             → #FF7E5F → #ff5577
 */
const spotlightGradients = {
  violet: 'bg-[linear-gradient(135deg,#3b1fa8_0%,#6a4cf5_60%,#a78bfa_100%)]',
  magenta: 'bg-[linear-gradient(135deg,#7c0a5e_0%,#d44df0_60%,#f0abff_100%)]',
  orange: 'bg-[linear-gradient(135deg,#c73a1f_0%,#ff7a3d_60%,#ffa07a_100%)]',
  coral: 'bg-[linear-gradient(135deg,#c42052_0%,#ff5577_60%,#ff8fa3_100%)]',
} as const

type SpotlightGradient = keyof typeof spotlightGradients

function CardSpotlight({
  className,
  gradient = 'violet',
  ...props
}: React.ComponentProps<'div'> & { gradient?: SpotlightGradient }) {
  return (
    <div
      data-slot="card-spotlight"
      data-gradient={gradient}
      className={cn(
        spotlightGradients[gradient],
        'text-ink',
        // Spotlight cards use rounded-xxl (30px) — softer, atmospheric
        'rounded-xxl',
        // Color saturation IS the elevation — no extra shadow needed
        'transition-all duration-300 will-change-transform',
        'hover:-translate-y-1.5',
        className,
      )}
      {...props}
    />
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn('flex flex-col gap-1.5 p-5 md:p-6', className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        // font-display = Geist heading face
        // text-headline = 22px, weight 700, letter-spacing -0.8px
        'font-display text-headline font-medium text-ink tracking-[-0.8px]',
        'transition-colors duration-300',
        className,
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        // Muted Kizuna body text.
        'text-ink-muted text-body-framer-sm leading-relaxed',
        className,
      )}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-5 md:px-6', className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        'flex items-center px-5 pt-4 pb-5 md:px-6 md:pb-6',
        '[&_.border-t]:pt-5',
        className,
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardFeatured,
  CardSpotlight,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
