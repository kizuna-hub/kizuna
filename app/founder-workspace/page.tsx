import DashboardLayout from '@/components/dashboard/dashboard-layout';
import IncubationRoadmap from '@/components/dashboard/incubation-roadmap';
import AIFormFillerCard from '@/components/dashboard/cards/ai-form-filler';
import AIInsightsCard from '@/components/dashboard/cards/ai-insights';
import SuggestedMentorsCard from '@/components/dashboard/cards/suggested-mentor';
import IPLedgerCard from '@/components/dashboard/cards/ip-ledger';

export default function DashboardPage() {
    return (
        <DashboardLayout>
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
        </DashboardLayout>
    );
}
