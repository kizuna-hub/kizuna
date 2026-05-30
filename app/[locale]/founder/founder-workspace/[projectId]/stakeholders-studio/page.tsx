import React from 'react';
import { StudioHeader } from '@/components/founder/founder-workspace/stakeholder-studio/studio-header';
import { SmartEditor } from '@/components/founder/founder-workspace/stakeholder-studio/smart-editor';
import { MetricPalette } from '@/components/founder/founder-workspace/stakeholder-studio/metric-palette';
import { EngagementHeatmap } from '@/components/founder/founder-workspace/stakeholder-studio/engagement-heatmap';

export default function InvestorUpdatesPage() {
    return (
        <div className="bg-[#fafafa] min-h-screen p-6 md:p-8 w-full font-geist selection:bg-[#a1e2b6]/30 selection:text-[#102c1e]">
            <div className="max-w-[1400px] mx-auto space-y-6 md:space-y-8">

                {/* Header Section */}
                <StudioHeader />

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                    {/* The Editor takes up the majority of the space */}
                    <div className="lg:col-span-8 h-full">
                        <SmartEditor />
                    </div>

                    {/* The Palette is on the right */}
                    <div className="lg:col-span-4 h-full">
                        <MetricPalette />
                    </div>
                </div>

                {/* Bottom Heatmap */}
                <EngagementHeatmap />

            </div>
        </div>
    );
}