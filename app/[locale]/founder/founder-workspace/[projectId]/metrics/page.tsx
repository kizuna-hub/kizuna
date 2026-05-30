import React from 'react';
import { Filter, Plus } from 'lucide-react';
import { TopStatsRow } from '@/components/founder/founder-workspace/metrics/top-stats-row';
import { MiddleChartsRow } from '@/components/founder/founder-workspace/metrics/middle-charts-row';
import { BottomChartsRow } from '@/components/founder/founder-workspace/metrics/bottom-charts-row';

export default function SurvivalMatrixPage() {
    return (
        <div className="p-6 md:p-8 lg:p-10 w-full bg-[#fafafa] min-h-screen flex flex-col items-center">
            <div className="w-full max-w-6xl">

                {/* Header exact match to reference image */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 w-full gap-4">
                    <div>
                        <h1 className="font-outfit font-black text-[#102c1e] text-3xl tracking-tight">Chào mừng quay lại, Nhà sáng lập</h1>
                        <p className="font-geist text-slate-500 mt-1 font-medium">
                            Bạn có <span className="text-[#dc2626] font-bold">2</span> thông báo hệ thống chưa đọc
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 bg-white text-[#102c1e] font-geist font-bold text-sm px-4 py-2 rounded-xl border border-[#102c1e]/10 hover:border-[#102c1e]/30 hover:shadow-sm transition-all">
                            <Filter size={16} />
                            Bộ lọc
                        </button>
                        <button className="flex items-center gap-2 bg-[#102c1e] text-[#fafafa] font-geist font-bold text-sm px-4 py-2 rounded-xl hover:bg-[#102c1e]/90 hover:shadow-md transition-all">
                            <Plus size={16} />
                            Thêm Widget
                        </button>
                    </div>
                </div>

                {/* Dashboard Grid Layout following exactly the reference structure */}
                <TopStatsRow />
                <MiddleChartsRow />
                <BottomChartsRow />

            </div>
        </div>
    );
}