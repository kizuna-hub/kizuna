import IncubationRoadmap from '@/components/founder-workspace/dashboard/incubation-roadmap';
import AIFormFillerCard from '@/components/founder-workspace/dashboard/cards/ai-form-filler';
import AIInsightsCard from '@/components/founder-workspace/dashboard/cards/ai-insights';
import SuggestedMentorsCard from '@/components/founder-workspace/dashboard/cards/suggested-mentor';
import IPLedgerCard from '@/components/founder-workspace/dashboard/cards/ip-ledger';

export default function DashboardPage() {
    return (
        <div className="px-8 py-8 max-w-7xl mx-auto">
            {/* Hero Section */}
            <IncubationRoadmap />

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Left Column - Full Height */}
                <div className="lg:col-span-2 space-y-6">
                    <AIFormFillerCard />
                    <AIInsightsCard />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <SuggestedMentorsCard />
                    <IPLedgerCard />
                </div>
            </div>
        </div>
    );
}
