import React from 'react';
import { Eye, Clock, MousePointerClick, MailOpen, AlertCircle } from 'lucide-react';

const EngagementRow = ({ 
    investor, 
    status, 
    readTime, 
    score, 
    action 
}: { 
    investor: string, 
    status: 'opened' | 'delivered' | 'bounced', 
    readTime: string, 
    score: number, 
    action: string 
}) => {
    return (
        <tr className="border-b border-[#102c1e]/5 hover:bg-[#fafafa]/50 transition-colors group">
            <td className="py-4 pl-6 pr-2">
                <div className="font-geist text-sm font-bold text-[#102c1e]">{investor}</div>
            </td>
            <td className="py-4 px-2">
                {status === 'opened' && <span className="inline-flex items-center gap-1.5 font-geist text-[10px] font-bold text-[#102c1e] bg-[#a1e2b6]/30 px-2.5 py-1 rounded-full uppercase tracking-wider"><MailOpen size={12}/> Opened</span>}
                {status === 'delivered' && <span className="inline-flex items-center gap-1.5 font-geist text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider"><Eye size={12}/> Delivered</span>}
                {status === 'bounced' && <span className="inline-flex items-center gap-1.5 font-geist text-[10px] font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full uppercase tracking-wider"><AlertCircle size={12}/> Bounced</span>}
            </td>
            <td className="py-4 px-2 text-right">
                <div className="font-mono text-sm font-black text-[#102c1e] flex items-center justify-end gap-1.5">
                    {readTime !== '-' && <Clock size={14} className="text-slate-400" />}
                    {readTime}
                </div>
            </td>
            <td className="py-4 px-6 w-[200px]">
                <div className="flex items-center gap-2">
                    <div className="w-full bg-[#102c1e]/5 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-[#a1e2b6] rounded-full transition-all duration-1000" style={{ width: `${score}%` }}></div>
                    </div>
                    <span className="font-mono text-[10px] font-bold text-slate-500 w-8 text-right">{score}%</span>
                </div>
            </td>
            <td className="py-4 pr-6 pl-2">
                <div className="font-geist text-xs text-slate-600 flex items-center gap-2">
                    {action !== '-' && <MousePointerClick size={12} className="text-[#102c1e]/40" />}
                    {action}
                </div>
            </td>
        </tr>
    );
};

export function EngagementHeatmap() {
    return (
        <div className="bg-white rounded-3xl border border-[#102c1e]/10 pt-6 pb-2 shadow-sm overflow-hidden w-full">
            <div className="px-6 mb-6 flex justify-between items-end">
                <div>
                    <h3 className="font-outfit text-xl font-bold text-[#102c1e] flex items-center gap-2">
                        Engagement Heatmap
                    </h3>
                    <p className="font-geist text-xs text-slate-400 mt-1">Real-time tracking of investor read times and interactions.</p>
                </div>
                <div className="px-3 py-1.5 bg-[#a1e2b6]/20 border border-[#a1e2b6]/50 rounded-lg flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#102c1e] animate-pulse"></div>
                    <span className="font-mono text-[10px] font-bold text-[#102c1e] uppercase tracking-widest">Live</span>
                </div>
            </div>

            <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="border-y border-[#102c1e]/5 bg-[#fafafa]">
                            <th className="py-3 pl-6 pr-2 font-geist text-[10px] uppercase font-bold text-slate-400 tracking-widest w-[25%]">Investor</th>
                            <th className="py-3 px-2 font-geist text-[10px] uppercase font-bold text-slate-400 tracking-widest w-[15%]">Status</th>
                            <th className="py-3 px-2 font-geist text-[10px] uppercase font-bold text-slate-400 tracking-widest text-right w-[15%]">Read Time</th>
                            <th className="py-3 px-6 font-geist text-[10px] uppercase font-bold text-slate-400 tracking-widest w-[20%]">Attention Score</th>
                            <th className="py-3 pr-6 pl-2 font-geist text-[10px] uppercase font-bold text-slate-400 tracking-widest w-[25%]">Last Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <EngagementRow investor="Kizuna Ventures" status="opened" readTime="4m 12s" score={95} action="Clicked Data Room Link" />
                        <EngagementRow investor="Sequoia Capital" status="opened" readTime="1m 05s" score={45} action="Viewed Financial Model" />
                        <EngagementRow investor="a16z" status="delivered" readTime="-" score={0} action="-" />
                        <EngagementRow investor="Angel Syndicate" status="opened" readTime="2m 30s" score={72} action="Forwarded email" />
                        <EngagementRow investor="Old Lead DB" status="bounced" readTime="-" score={0} action="-" />
                    </tbody>
                </table>
            </div>
        </div>
    );
}