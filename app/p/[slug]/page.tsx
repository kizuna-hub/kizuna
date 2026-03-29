import { ProjectHero } from '@/components/project-profile/hero';
import { PitchVideo } from '@/components/project-profile/pitch-video';
import { ProblemSolution } from '@/components/project-profile/problem-solution';
import { Timeline } from '@/components/project-profile/timeline';
import { TeamSection } from '@/components/project-profile/team';
import { FundingAskCard } from '@/components/project-profile/funding-ask';
import { MentorEndorsements } from '@/components/project-profile/mentor-endorsements';
import { GatedFinancials } from '@/components/project-profile/gated-financials';

export default function ProjectPage({ params }: { params: { slug: string } }) {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 px-4 md:px-8 py-8 max-w-7xl mx-auto">
                {/* Left Column - Main Content */}
                <main className="space-y-12">
                    <ProjectHero slug={params.slug} />
                    <PitchVideo slug={params.slug} />
                    <ProblemSolution slug={params.slug} />
                    <Timeline slug={params.slug} />
                    <TeamSection slug={params.slug} />
                    <MentorEndorsements slug={params.slug} />
                </main>

                {/* Right Column - Sticky Sidebar */}
                <aside className="lg:sticky lg:top-8 lg:h-fit">
                    <FundingAskCard slug={params.slug} />
                    <GatedFinancials slug={params.slug} />
                </aside>
            </div>
        </div>
    );
}
