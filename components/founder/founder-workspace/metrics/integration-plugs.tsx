import React from 'react';
import { Database, TrendingUp, CreditCard } from 'lucide-react';

const IntegrationCard = ({ name, status, time, icon: Icon }: { name: string, status: string, time: string, icon: any }) => {
    const isConnected = status === "Connected";
    return (
        <div className="bg-[#fafafa] border border-[#102c1e]/10 rounded-2xl p-4 flex items-center justify-between hover:-translate-y-0.5 hover:shadow-md hover:border-[#102c1e]/30 transition-all duration-300">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#102c1e]/5 flex items-center justify-center text-[#102c1e]">
                    <Icon size={18} strokeWidth={2.5} />
                </div>
                <div>
                    <h4 className="font-geist font-bold text-[#102c1e] text-sm">{name}</h4>
                    <p className="font-geist text-slate-400 text-[11px] mt-0.5">{time}</p>
                </div>
            </div>
            {isConnected ? (
                <div className="flex items-center gap-2 bg-white border border-[#102c1e]/5 px-3 py-1.5 rounded-full">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a1e2b6] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#a1e2b6]"></span>
                    </span>
                    <span className="font-geist text-[10px] font-bold text-[#102c1e] uppercase tracking-wider">{status}</span>
                </div>
            ) : (
                <button className="bg-white border border-[#102c1e]/10 text-slate-400 font-geist text-xs px-3 py-1.5 rounded-full hover:bg-[#102c1e]/5 hover:text-[#102c1e] transition-colors">
                    Connect
                </button>
            )}
        </div>
    );
};

export function IntegrationPlugs() {
    return (
        <div className="col-span-1 md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 pt-4">
            <IntegrationCard
                name="Stripe"
                status="Connected"
                time="Last synced 2m ago"
                icon={CreditCard}
            />
            <IntegrationCard
                name="Google Analytics"
                status="Connected"
                time="Last synced 5m ago"
                icon={TrendingUp}
            />
            <IntegrationCard
                name="PostHog"
                status="Disconnected"
                time="Not connected"
                icon={Database}
            />
        </div>
    );
}