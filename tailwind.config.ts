import type { Config } from 'tailwindcss'

/**
 * Kizuna Hub — Quiet Conviction Design System — Tailwind Config
 *
 * Source of truth: app/globals.css @theme block
 *
 * Architecture:
 *   All colors reference --color-* CSS variables from globals.css @theme block.
 *   Tailwind v4 reads @theme and auto-generates utilities — this config adds
 *   the non-@theme extensions (fontFamily, fontSize, boxShadow, spacing, zIndex).
 *
 * RULE: NEVER use bg-[#hex] / text-[#hex] in components. Use semantic tokens.
 */
const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './config/**/*.{js,ts,jsx,tsx,mdx}',
    './entities/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './shared/**/*.{js,ts,jsx,tsx,mdx}',
    './types/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  darkMode: 'class',

  theme: {
    extend: {
      // ─────────────────────────────────────────────────────────────────
      // COLORS — all reference CSS variables from globals.css @theme
      // ─────────────────────────────────────────────────────────────────
      colors: {
        // ── Kizuna core palette ────────────────────────────────────────
        canvas: 'var(--color-canvas)',
        'surface-1': 'var(--color-surface-1)',
        'surface-2': 'var(--color-surface-2)',
        'surface-3': 'var(--color-surface-3)',
        ink: 'var(--color-ink)',
        'ink-muted': 'var(--color-ink-muted)',
        hairline: 'var(--color-hairline)',
        'hairline-soft': 'var(--color-hairline-soft)',
        'inverse-canvas': 'var(--color-inverse-canvas)',
        'inverse-ink': 'var(--color-inverse-ink)',
        'on-primary': 'var(--color-on-primary)',

        // Compatibility only: the legacy name resolves to Kizuna Clay.
        'accent-blue': 'var(--color-accent-blue)',

        // ── Gradient Spotlight Anchors (solid base colors) ─────────────
        'gradient-violet': 'var(--color-gradient-violet)',  // #6a4cf5
        'gradient-magenta': 'var(--color-gradient-magenta)', // #d44df0
        'gradient-orange': 'var(--color-gradient-orange)',  // #ff7a3d
        'gradient-coral': 'var(--color-gradient-coral)',   // #ff5577

        // ── Semantic ───────────────────────────────────────────────────
        'semantic-success': 'var(--color-semantic-success)',
        'semantic-warning': 'var(--color-semantic-warning)',
        'semantic-info': 'var(--color-semantic-info)',
        'semantic-verified': 'var(--color-semantic-verified)',
        'semantic-pending': 'var(--color-semantic-pending)',
        'confidence-high': 'var(--color-confidence-high)',
        'confidence-medium': 'var(--color-confidence-medium)',
        'confidence-low': 'var(--color-confidence-low)',

        // ── Shadcn/Tailwind semantic aliases ──────────────────────────
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        card: {
          DEFAULT: 'var(--color-card)',
          foreground: 'var(--color-card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--color-popover)',
          foreground: 'var(--color-popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-primary-foreground)',
          hover: 'var(--color-primary-hover)',
          active: 'var(--color-primary-active)',
          soft: 'var(--color-primary-soft)',
          muted: 'var(--color-primary-muted)',
          'muted-hover': 'var(--color-primary-muted-hover)',
          'muted-foreground': 'var(--color-primary-muted-foreground)',
          border: 'var(--color-primary-border)',
          text: 'var(--color-primary-text)',
        },
        'primary-action': {
          DEFAULT: 'var(--color-primary-action)',
          hover: 'var(--color-primary-action-hover)',
          active: 'var(--color-primary-action-active)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          foreground: 'var(--color-secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--color-muted)',
          foreground: 'var(--color-muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          foreground: 'var(--color-accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)',
          foreground: 'var(--color-destructive-foreground)',
        },
        border: 'var(--color-border)',
        input: 'var(--color-input)',
        ring: 'var(--color-ring)',
        overlay: 'var(--color-overlay)',

        // ── Kizuna aliases ────────────────────────────────────────────
        'kizuna-primary': 'var(--color-kizuna-primary)',
        'kizuna-canvas': 'var(--color-kizuna-canvas)',
        'kizuna-surface': 'var(--color-kizuna-surface)',
        'kizuna-text-main': 'var(--color-kizuna-text-main)',
        'kizuna-text-muted': 'var(--color-kizuna-text-muted)',
        'kizuna-border': 'var(--color-kizuna-border)',

        sidebar: {
          DEFAULT: 'var(--color-sidebar)',
          foreground: 'var(--color-sidebar-foreground)',
          primary: 'var(--color-sidebar-primary)',
          'primary-foreground': 'var(--color-sidebar-primary-foreground)',
          accent: 'var(--color-sidebar-accent)',
          'accent-foreground': 'var(--color-sidebar-accent-foreground)',
          border: 'var(--color-sidebar-border)',
          ring: 'var(--color-sidebar-ring)',
        },

        // ── Workspace semantic aliases ────────────────────────────────
        'workspace-background': 'var(--color-workspace-background)',
        'workspace-sidebar': 'var(--color-workspace-sidebar)',
        'workspace-topbar': 'var(--color-workspace-topbar)',
        'workspace-panel': 'var(--color-workspace-panel)',
        'workspace-elevated': 'var(--color-workspace-elevated)',
        'workspace-border': 'var(--color-workspace-border)',
        'workspace-row-hover': 'var(--color-workspace-row-hover)',
        'workspace-selected': 'var(--color-workspace-selected)',
        'workspace-focus-ring': 'var(--color-workspace-focus-ring)',
        'workspace-muted-text': 'var(--color-workspace-muted-text)',
        'workspace-success': 'var(--color-workspace-success)',
        'workspace-success-soft': 'var(--color-workspace-success-soft)',
        'workspace-warning': 'var(--color-workspace-warning)',
        'workspace-warning-soft': 'var(--color-workspace-warning-soft)',
        'workspace-danger': 'var(--color-workspace-danger)',
        'workspace-danger-soft': 'var(--color-workspace-danger-soft)',
      },

      // ─────────────────────────────────────────────────────────────────
      // FONT FAMILIES
      // ─────────────────────────────────────────────────────────────────
      fontFamily: {
        /**
         * display / heading — Geist Sans, shared with the landing foundation.
         */
        display: ['var(--font-display)', 'Geist Sans', 'Geist', 'sans-serif'],
        heading: ['var(--font-display)', 'Geist Sans', 'Geist', 'sans-serif'],

        /**
         * body / sans — Geist Sans Variable.
         */
        body: ['var(--font-body)', 'Geist Sans', 'Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'Geist Sans', 'Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],

        /**
         * mono — Geist Mono. Only for code, IDs, tokens.
         */
        mono: ['var(--font-mono)', 'Geist Mono', 'Consolas', 'monospace'],

        // Aliases retained for legacy call sites.
        serif: ['var(--font-display)', 'Geist Sans', 'Geist', 'sans-serif'],
      },

      // ─────────────────────────────────────────────────────────────────
      // FONT SIZES — KIZUNA QUIET CONVICTION
      // ─────────────────────────────────────────────────────────────────
      fontSize: {
        // Editorial display scale. Use the larger sizes sparingly in workspaces.
        'display-2xl': ['6.875rem', { lineHeight: '0.85', fontWeight: '560', letterSpacing: '-5.5px' }],
        'display-xl': ['5.3125rem', { lineHeight: '0.92', fontWeight: '560', letterSpacing: '-4.25px' }],
        'display-lg': ['3.875rem', { lineHeight: '0.97', fontWeight: '560', letterSpacing: '-3.1px' }],
        'display-md': ['2rem', { lineHeight: '1.05', fontWeight: '560', letterSpacing: '-1.0px' }],

        // UI scale (Geist Sans Variable)
        'headline': ['1.375rem', { lineHeight: '1.20', fontWeight: '700', letterSpacing: '-0.8px' }],   // 22px
        'subhead': ['1.5rem', { lineHeight: '1.30', fontWeight: '400', letterSpacing: '-0.01px' }],  // 24px
        'body-framer': ['0.9375rem', { lineHeight: '1.30', fontWeight: '400', letterSpacing: '-0.15px' }],  // 15px
        'body-framer-sm': ['0.875rem', { lineHeight: '1.40', fontWeight: '500', letterSpacing: '-0.14px' }],  // 14px
        'caption': ['0.8125rem', { lineHeight: '1.20', fontWeight: '500', letterSpacing: '-0.13px' }],  // 13px
        'micro': ['0.75rem', { lineHeight: '1.20', fontWeight: '400', letterSpacing: '-0.12px' }],  // 12px
        'btn': ['0.875rem', { lineHeight: '1.0', fontWeight: '500', letterSpacing: '-0.14px' }],  // 14px
        'eyebrow': ['0.6875rem', { lineHeight: '1.0', fontWeight: '600', letterSpacing: '0.12em' }],  // 11px

        // Backward-compat aliases for existing components
        'body-lg': ['1.125rem', { lineHeight: '1.52', fontWeight: '400', letterSpacing: '-0.018em' }],
        'body-md': ['1rem', { lineHeight: '1.58', fontWeight: '400', letterSpacing: '-0.01em' }],
        'body-sm': ['0.875rem', { lineHeight: '1.40', fontWeight: '400', letterSpacing: '-0.14px' }],
        'text-btn': ['0.875rem', { lineHeight: '1.0', fontWeight: '500', letterSpacing: '-0.14px' }],
      },

      // ─────────────────────────────────────────────────────────────────
      // BORDER RADIUS — KIZUNA GRANULAR SCALE
      // xs:4 sm:6 md:10 lg:15 xl:20 xxl:30 pill:100 full:9999
      // ─────────────────────────────────────────────────────────────────
      borderRadius: {
        'xs': '4px',     // utility chips, tiny inline tags
        'sm': '6px',     // subtle rounding
        'md': '10px',    // inputs, modals, dropdowns
        'lg': '15px',    // template cards
        'xl': '20px',    // pricing cards, mockup tiles, feature cards
        '2xl': '24px',    // (Tailwind default 2xl kept for compatibility)
        'xxl': '30px',    // gradient spotlight atmospheric cards
        '3xl': '30px',    // alias for xxl
        '4xl': '40px',    // very large containers
        'pill': '100px',   // ALL primary CTA buttons — non-negotiable
        'full': '9999px',  // circles: avatars, status dots

        // Aliases retained for existing call sites.
        'framer-xl': '20px',
        'framer-xxl': '30px',
      },

      // ─────────────────────────────────────────────────────────────────
      // BOX SHADOWS
      // ─────────────────────────────────────────────────────────────────
      boxShadow: {
        /**
         * framer-edge — retained name for Kizuna level-2 elevation.
         * Use for: floating cards, modal tiles, pill buttons.
         */
        'framer-edge': '0 0.5px 0 0 rgba(247,245,242,0.08) inset, 0 10px 30px 0 rgba(0,0,0,0.30)',

        /**
         * framer-edge-lifted — Hover state of framer-edge.
         */
        'framer-edge-lifted': '0 0.5px 0 0 rgba(247,245,242,0.14) inset, 0 16px 48px 0 rgba(0,0,0,0.50)',

        /**
         * framer-focus — retained name for the Kizuna Clay focus ring.
         * ONLY for focused inputs and selected option indicators.
         */
        'framer-focus': '0 0 0 1px color-mix(in srgb, var(--color-ring) 28%, transparent)',

        // Generic dark shadows (neutral)
        'sm': '0 1px 3px rgba(0,0,0,0.20)',
        'md': '0 4px 16px rgba(0,0,0,0.30)',
        'lg': '0 8px 32px rgba(0,0,0,0.40)',
        'xl': '0 16px 64px rgba(0,0,0,0.50)',
        '2xl': '0 24px 96px rgba(0,0,0,0.55)',
      },

      // ─────────────────────────────────────────────────────────────────
      // SPACING — COMPATIBLE BASE-5 SCALE
      // ─────────────────────────────────────────────────────────────────
      spacing: {
        // Legacy names retained for existing call sites.
        'framer-hair': '1px',
        'framer-xxs': '4px',
        'framer-xs': '8px',
        'framer-sm': '12px',
        'framer-md': '15px',  // horizontal padding for pill buttons
        'framer-lg': '20px',
        'framer-xl': '30px',  // spotlight card interior padding
        'framer-xxl': '40px',
        'framer-section': '96px',  // vertical section rhythm

        // Page layout gutter
        'page': '1.5rem',   // 24px — mobile content gutter
        'page-lg': '2.5rem',   // 40px — desktop content gutter
      },

      // ─────────────────────────────────────────────────────────────────
      // Z-INDEX
      // ─────────────────────────────────────────────────────────────────
      zIndex: {
        'hide': 'var(--z-hide)',
        'base': 'var(--z-base)',
        'raised': 'var(--z-raised)',
        'header': 'var(--z-header)',
        'dropdown': 'var(--z-dropdown)',
        'overlay': 'var(--z-overlay)',
        'modal': 'var(--z-modal)',
        'popover': 'var(--z-popover)',
        'toast': 'var(--z-toast)',
        'tooltip': 'var(--z-tooltip)',
      },
    },
  },
} satisfies Config

export default config
