import React from 'react';
import { GripVertical, Activity, Users, Wallet, Zap, Fingerprint } from 'lucide-react';

const DraggableWidget = ({ icon: Icon, title, value, trend, trendUp = true }: { icon: any, title: string, value: string, trend: string, trendUp?: boolean }) => (
    <div className="bg-white border border-[#102c1e]/10 rounded-2xl p-4 flex items-center justify-between shadow-sm cursor-grab hover:-translate-y-0.5 hover:shadow-md hover:border-[#102c1e]/30 transition-all active:cursor-grabbing group">
        <div className="flex items-center gap-3">
            <div className="text-slate-300 group-hover:text-[#102c1e]/50 transition-colors">
                <GripVertical size={16} />
            </div>
            <div className="w-8 h-8 rounded-full bg-[#fafafa] flex items-center justify-center text-[#102c1e]">
                <Icon size={14} />
            </div>
            <div>
                <div className="font-geist text-xs font-bold text-[#102c1e]">{title}</div>
                <div className="font-mono text-sm font-black text-[#102c1e] mt-0.5">{value}</div>
            </div>
        </div>
        <div className={`font-mono text-[10px] font-bold px-2 py-1 rounded-md ${trendUp ? 'bg-[#a1e2b6]/20 text-[#102c1e]' : 'bg-red-50 text-red-600'}`}>
            {trend}
        </div>
    </div>
);

export function MetricPalette() {
    return (
        <div className="bg-[#fafafa] rounded-3xl p-6 border border-[#102c1e]/5 h-max sticky top-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-outfit text-lg font-bold text-[#102c1e] flex items-center gap-2">
                        <Activity size={18} />
                        Live Data Widgets
                    </h3>
                    <p className="font-geist text-xs text-slate-500 mt-1">Drag and drop directly into your update</p>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <DraggableWidget icon={Wallet} title="MRR" value="$124,500" trend="+24%" />
                <DraggableWidget icon={Zap} title="Runway" value="11.4 Months" trend="-0.2" trendUp={false} />
                <DraggableWidget icon={Users} title="Active Users (MAU)" value="14,204" trend="+12%" />
                <DraggableWidget icon={Activity} title="Product Velocity" value="44 Commits" trend="+5%" />
                <DraggableWidget icon={Fingerprint} title="Matches Made" value="384" trend="+40%" />
            </div>

            <div className="mt-8 pt-6 border-t border-[#102c1e]/10">
                <h4 className="font-geist text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Custom Connections</h4>
                <button className="w-full py-3 border-2 border-dashed border-[#102c1e]/20 rounded-xl font-geist text-xs font-bold text-slate-500 hover:text-[#102c1e] hover:border-[#102c1e]/40 hover:bg-white transition-all flex items-center justify-center gap-2">
                    + Connect New Data Source
                </button>
            </div>
        </div>
    );
}