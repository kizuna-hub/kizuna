import { Metadata } from 'next'
import { HeroSection } from '@/components/event/hero-section'
import { BenefitsBar } from '@/components/event/benefits-bar'
import { CompetitionTimeline } from '@/components/event/competition-timeline'
import { SharksGrid } from '@/components/event/sharks-grid'
import { StickyBottomBar } from '@/components/event/sticky-bottom-bar'

export const metadata: Metadata = {
    title: 'BK SHARK 2026 - NovaHub Competition',
    description: 'Turn your university project into a funded startup. Compete for 500M VND and direct entry to SURF Da Nang.',
}

export default function EventPage({
    params,
}: {
    params: { 'event-slug': string }
}) {
    const eventSlug = params['event-slug']

    return (
        <main className="bg-zinc-950 text-zinc-50 min-h-screen">
            <HeroSection eventSlug={eventSlug} />
            <BenefitsBar />
            <CompetitionTimeline />
            <SharksGrid />
            <StickyBottomBar eventSlug={eventSlug} />
        </main>
    )
}
