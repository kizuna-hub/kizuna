import React from 'react';
import DataRoomHeader from '@/components/founder/founder-workspace/data-room/data-room-header';
import AnalyticsChart from '@/components/founder/founder-workspace/data-room/analytics-chart';
import AnalyticsFunnel from '@/components/founder/founder-workspace/data-room/analytics-funnel';
import SecurityPresets from '@/components/founder/founder-workspace/data-room/security-presets';
import LiveActivityTakeover from '@/components/founder/founder-workspace/data-room/live-activity-takeover';
import AccessLedgerExpanded from '@/components/founder/founder-workspace/data-room/access-ledger-expanded';

export default function DataRoomPage() {
    return (
        <div className="w-full">
            <DataRoomHeader />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                {/* Row 1: Funnel & Security Presets */}
                <div className="lg:col-span-8">
                    <AnalyticsFunnel />
                </div>
                <div className="lg:col-span-4">
                    <SecurityPresets />
                </div>

                {/* Row 2: Slides Analytics & Takeover Live Stream */}
                <div className="lg:col-span-7">
                    <AnalyticsChart />
                </div>
                <div className="lg:col-span-5">
                    <LiveActivityTakeover />
                </div>

                {/* Row 3: Deep Ledger */}
                <div className="lg:col-span-12">
                    <AccessLedgerExpanded />
                </div>
            </div>
        </div>
    );
}