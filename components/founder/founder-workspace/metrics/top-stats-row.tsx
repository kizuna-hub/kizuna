import React from 'react';
import { DollarSign, Users, Activity, Network, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const MiniSparkline = ({ color = "#a1e2b6", isDashed = false }) => (
    <svg width="60" height="24" viewBox="0 0 60 24" className="overflow-visible" preserveAspectRatio="none">
        <path
            d="M0,20 C10,18 15,10 25,12 C35,14 45,5 60,8"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={isDashed ? "4 4" : "none"}
        />
        {/* Glow effect */}
        <path
            d="M0,20 C10,18 15,10 25,12 C35,14 45,5 60,8"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-20"
        />
    </svg>
);

const StatCard = ({ icon: Icon, title, subtitle, value, trend, isPositive }: any) => {
    return (
        <div className="bg-white rounded-3xl border border-[#102c1e]/10 p-5 md:p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-[#102c1e]/20 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                    <Icon size={18} className="text-slate-400" />
                    <h3 className="font-geist font-bold text-[#102c1e] text-sm">{title}</h3>
                </div>
                <div className={`flex items-center gap-1 font-geist font-bold text-xs px-2 py-1 rounded-md ${isPositive ? 'bg-[#a1e2b6]/20 text-[#102c1e]' : 'bg-red-50 text-red-600'}`}>
                    {isPositive ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />}
                    {Math.abs(trend)}%
                </div>
            </div>

            <p className="font-geist text-xs text-slate-400 mb-1">{subtitle}</p>

            <div className="flex justify-between items-end">
                <div className="font-mono font-black text-3xl text-[#102c1e] tracking-tighter">
                    {value}
                </div>
                <div className="mb-1">
                    <MiniSparkline color={isPositive ? "#a1e2b6" : "#fca5a5"} />
                </div>
            </div>
        </div>
    );
};

export function TopStatsRow() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full mb-6">
            <StatCard
                icon={DollarSign}
                title="Doanh thu (MRR)"
                subtitle="Tổng doanh thu định kỳ tháng qua"
                value="$12,743.20"
                trend={12}
                isPositive={true}
            />
            <StatCard
                icon={Users}
                title="Người dùng Active (MAU)"
                subtitle="Số User hoạt động đều đặn"
                value="12,598"
                trend={8}
                isPositive={true}
            />
            <StatCard
                icon={Activity}
                title="Tấm tốc đốt tiền (Burn Rate)"
                subtitle="Chi phí vận hành startup tháng qua"
                value="$8,224.10"
                trend={-3}
                isPositive={false}
            />
            <StatCard
                icon={Network}
                title="Kết nối Ngoại bộ (Matches)"
                subtitle="Số lượt Match với Cố vấn & NĐT"
                value="384"
                trend={8}
                isPositive={true}
            />
        </div>
    );
}