import React from 'react';

const AreaChart = () => (
    <svg
        viewBox="0 0 100 30"
        className="w-full h-12 overflow-visible mt-2"
        preserveAspectRatio="none"
    >
        <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#a1e2b6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#a1e2b6" stopOpacity="0" />
            </linearGradient>
        </defs>
        <polygon
            points="0,25 10,25 15,20 22,23 30,26 35,10 45,15 55,20 60,5 70,8 80,11 90,0 100,2 100,30 0,30"
            fill="url(#areaGradient)"
        />
        <path
            d="M0,25 C10,25 15,20 22,23 C30,26 35,10 45,15 C55,20 60,5 70,8 C80,11 90,0 100,2"
            fill="none"
            stroke="#a1e2b6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const MetricCard = ({ title, value, label, trend, isPositive }: { title: string, value: string, label: string, trend: string, isPositive: boolean }) => (
    <div className="bg-white rounded-2xl border border-[#102c1e]/10 shadow-sm pt-5 px-5 hover:shadow-md hover:border-[#102c1e]/30 transition-all duration-300 flex flex-col justify-between overflow-hidden">
        <div className="flex justify-between items-start mb-4">
            <h3 className="font-geist font-bold text-[#102c1e] text-[10px] uppercase tracking-widest text-slate-400">
                {title}
            </h3>
            <div className={`font-geist font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md ${isPositive ? 'bg-[#a1e2b6]/20 text-[#102c1e]' : 'bg-[#102c1e]/5 text-[#102c1e]'}`}>
                {trend}
            </div>
        </div>

        <div>
            <div className="font-mono text-4xl md:text-5xl font-black text-[#102c1e] tracking-tighter mb-1">
                {value}
            </div>
            <div className="font-geist text-xs text-slate-400">
                {label}
            </div>
        </div>

        <div className="mt-4 border-t border-[#102c1e]/5 pt-2 -mx-5 -mb-2 px-5">
            <AreaChart />
        </div>
    </div>
);

export function CoreMetricsGrid() {
    return (
        <div className="col-span-1 md:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6">
            <MetricCard
                title="MRR"
                value="$12,450"
                label="Monthly Recurring Revenue"
                trend="+14% MoM"
                isPositive={true}
            />
            <MetricCard
                title="CAC"
                value="$145.20"
                label="Customer Acquisition Cost"
                trend="-5% MoM"
                isPositive={true}
            />
            <MetricCard
                title="Active Users"
                value="4,208"
                label="30-day active users"
                trend="+2.1% WoW"
                isPositive={true}
            />
        </div>
    );
}