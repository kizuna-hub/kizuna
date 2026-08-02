'use client'

import type { ThemeProviderProps } from 'next-themes'

import {
  ThemeProvider as KizunaThemeProvider,
  useKizunaTheme,
} from '@/features/theme/providers/theme-provider'

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <KizunaThemeProvider>
      {children}
    </KizunaThemeProvider>
  )
}

export { useKizunaTheme }
