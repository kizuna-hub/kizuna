import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import '../globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { DemoWorkspaceProvider } from '@/features/founder/venture-foundation/demo-workspace-provider'

const geistSans = Geist({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-geist-sans',
  weight: 'variable',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-geist-mono',
  weight: 'variable',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Kizuna Hub - University Startup Ecosystem',
  description: 'Discover the next big thing from university students. A premium hub for startups, mentorship, and innovation.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png',  media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }
  const messages = await getMessages()

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable}`} data-scroll-behavior="smooth">
      <body className="font-body bg-canvas text-ink antialiased min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <DemoWorkspaceProvider>
            {children}
          </DemoWorkspaceProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  )
}
