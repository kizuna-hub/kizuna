'use client'

import { Toaster as Sonner, ToasterProps } from 'sonner'
import { useKizunaTheme } from '@/components/theme-provider'

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedAppearance } = useKizunaTheme()

  return (
    <Sonner
      theme={resolvedAppearance}
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
