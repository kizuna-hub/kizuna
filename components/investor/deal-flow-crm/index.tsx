'use client';

import React, { useState } from 'react';
import { Sparkles, Send, GripHorizontal, FileText, Lock, Unlock, CheckCircle2, ChevronRight, Activity, ArrowRight, Eye, MoreHorizontal, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- THÊM TYPE DEFINITION ---
export type Deal = {
    id: string;
    startup: string;
    vertical: string;
    founder: string;
    ask: string;
    stage: string;
    matchScore?: number;       // Sử dụng ? để báo cho TS biết trường này có thể bị undefined
    source: string;
    col: string;
    abstract: string;
    hasDataRoom: boolean;
    dataRoomStatus?: 'locked' | 'unlocked'; // Sử dụng ? cho dataRoomStatus
};

// --- MOCK DATA ---
const COLUMNS = [
    { id: 'inbound', title: 'Inbound Match', count: 3, icon: Sparkles, iconColor: 'text-[#a1e2b6]' },
    { id: 'warm-intros', title: 'Warm Intros', count: 2, icon: Send, iconColor: 'text-[#102c1e]' },
    { id: 'screening', title: 'Screening', count: 4 },
    { id: 'due-diligence', title: 'Due Diligence', count: 1, action: 'Auto-unlock Data Room' },
    { id: 'term-sheet', title: 'Term Sheet / Closed', count: 1 }
];

// Định danh kiểu cho Mảng INITIAL_DEALS
const INITIAL_DEALS: Deal[] = [
    {
        id: 'deal-1',
        startup: 'Kizuna Hub',
        vertical: 'SaaS / B2B',
        founder: 'Hoàng Trần',
        ask: '$500K',
        stage: 'Seed',
        matchScore: 94,
        source: 'AI Engine',
        col: 'inbound',
        abstract: 'Nền tảng kết nối Founder, Mentor & Investor chuyên biệt.',
        hasDataRoom: true,
        dataRoomStatus: 'locked'
    },
    {
        id: 'deal-2',
        startup: 'Dietfit AI',
        vertical: 'HealthTech',
        founder: 'Minh Nguyễn',
        ask: '$250K',
        stage: 'Pre-Seed',
        matchScore: 88,
        source: 'AI Engine',
        col: 'inbound',
        abstract: 'AI cá nhân hóa thực đơn ăn kiêng theo chu kỳ gym.',
        hasDataRoom: false,
        // dataRoomStatus bị bỏ trống ở đây sẽ không báo lỗi nhờ dấu ?
    },
    {
        id: 'deal-3',
        startup: 'SnapMoney',
        vertical: 'FinTech',
        founder: 'Lê Bảo',
        ask: '$1M',
        stage: 'Series A',
        source: 'Warm Intro - Tuấn (Mentor)',
        col: 'warm-intros',
        abstract: 'Vay siêu tốc P2P qua định danh Social Media.',
        hasDataRoom: true,
        dataRoomStatus: 'locked'
    },
    {
        id: 'deal-4',
        startup: 'EcoDeliver',
        vertical: 'Logistics',
        founder: 'Văn A',
        ask: '$300K',
        stage: 'Pre-Seed',
        matchScore: 75,
        source: 'AI Engine',
        col: 'screening',
        abstract: 'Giao hàng chặng cuối 100% xe điện.',
        hasDataRoom: true,
        dataRoomStatus: 'locked'
    },
    {
        id: 'deal-5',
        startup: 'Nexus AI',
        vertical: 'Enterprise AI',
        founder: 'Trần B',
        ask: '$2M',
        stage: 'Series A',
        source: 'Tự tìm kiếm',
        col: 'due-diligence',
        abstract: 'Tự động hóa CSKH bằng LLM Agent.',
        hasDataRoom: true,
        dataRoomStatus: 'unlocked'
    }
];

export default function DealFlowCRM() {
    // ÉP KIỂU TYPE RÕ RÀNG VÀO USESTATE
    const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
    const [draggedDealId, setDraggedDealId] = useState<string | null>(null);

    // --- DRAG & DROP LOGIC ---
    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggedDealId(id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetColId: string) => {
        e.preventDefault();
        if (!draggedDealId) return;

        setDeals((prev) =>
            prev.map((deal) => {
                if (deal.id === draggedDealId) {
                    const newStatus = targetColId === 'due-diligence' && deal.hasDataRoom ? 'unlocked' : deal.dataRoomStatus;
                    return { ...deal, col: targetColId, dataRoomStatus: newStatus };
                }
                return deal;
            })
        );
        setDraggedDealId(null);
    };


    return (
        <div className="mx-auto flex flex-col max-w-7xl h-[calc(100vh-2rem)] bg-[#fafafa]">

            {/* Header */}
            <header className="pt-6 pb-4 border-b border-[#102c1e]/10 mb-6 flex items-baseline justify-between gap-6 px-6">
                <div>
                    <h1 className="font-outfit font-black text-[#102c1e] text-4xl tracking-tight flex items-center gap-3">
                        Deal Flow CRM
                        <span className="bg-white border flex items-center gap-1.5 border-[#102c1e]/10 px-3 py-1 rounded-full text-sm font-geist font-bold shadow-sm">
                            <Activity className="w-4 h-4 text-[#a1e2b6]" /> {deals.length} Active Deals
                        </span>
                    </h1>
                    <p className="font-inter text-slate-600 mt-2 text-base">
                        Săn deal chủ động. Kéo thả sang "Due Diligence" để hệ thống tự động mở khóa Data Room của Startup.
                    </p>
                </div>
            </header>

            {/* Kanban Board Container */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden px-6 pb-6">
                <div className="flex h-full gap-5 items-start w-max">
                    {COLUMNS.map((column) => {
                        const colDeals = deals.filter(d => d.col === column.id);

                        return (
                            <div
                                key={column.id}
                                className="flex flex-col w-[320px] h-full rounded-3xl border border-[#102c1e]/5 bg-slate-50/50"
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, column.id)}
                            >
                                {/* Column Header */}
                                <div className="p-4 border-b border-[#102c1e]/5 flex justify-between items-center bg-white/50 backdrop-blur-sm rounded-t-3xl">
                                    <h3 className="font-geist font-bold text-[#102c1e] flex items-center gap-2 text-sm tracking-tight uppercase">
                                        {column.icon && <column.icon className={cn("w-4 h-4", column.iconColor)} />}
                                        {column.title}
                                    </h3>
                                    <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                                        {colDeals.length}
                                    </span>
                                </div>

                                {column.action && (
                                    <div className="mx-4 mt-3 py-1.5 px-3 bg-[#a1e2b6]/10 border border-[#a1e2b6]/30 rounded-lg flex items-center justify-center gap-2">
                                        <Unlock className="w-3 h-3 text-[#102c1e]" />
                                        <span className="font-geist text-[10px] uppercase font-bold text-[#102c1e] tracking-widest">{column.action}</span>
                                    </div>
                                )}

                                {/* Card List */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3 [&::-webkit-scrollbar]:hidden">
                                    {colDeals.map((deal) => (
                                        <div
                                            key={deal.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, deal.id)}
                                            className={cn(
                                                "group relative bg-white p-5 rounded-2xl border border-[#102c1e]/10 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing",
                                                draggedDealId === deal.id && "opacity-50 ring-2 ring-[#a1e2b6] scale-95",
                                                deal.col === 'warm-intros' && "border-l-4 border-l-[#102c1e]",
                                                deal.dataRoomStatus === 'unlocked' && "bg-[#fafafa]"
                                            )}
                                        >
                                            {/* Top Meta */}
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <span className="font-geist text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                                                        {deal.vertical}
                                                    </span>
                                                    <h4 className="font-outfit font-black text-xl text-[#102c1e] leading-none mb-1">
                                                        {deal.startup}
                                                    </h4>
                                                </div>

                                                {deal.matchScore && (
                                                    <div className="bg-[#a1e2b6]/20 border border-[#a1e2b6]/50 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                                                        <Sparkles className="w-3 h-3 text-[#102c1e]" />
                                                        <span className="font-mono text-xs font-bold text-[#102c1e]">{deal.matchScore}%</span>
                                                    </div>
                                                )}

                                                {deal.col === 'warm-intros' && !deal.matchScore && (
                                                    <div className="bg-[#102c1e] px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                                                        <Send className="w-3 h-3 text-[#a1e2b6]" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Abstract */}
                                            <p className="font-inter text-xs text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                                                {deal.abstract}
                                            </p>

                                            {/* Funding Ask & Stage */}
                                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#102c1e]/5">
                                                <div>
                                                    <p className="font-geist text-[10px] text-slate-400 font-bold uppercase">Raise Ask</p>
                                                    <p className="font-mono text-sm font-bold text-[#102c1e]">{deal.ask}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-geist text-[10px] text-slate-400 font-bold uppercase">Stage</p>
                                                    <p className="font-geist text-sm font-bold text-[#102c1e]">{deal.stage}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-geist text-[10px] text-slate-400 font-bold uppercase">Founder</p>
                                                    <p className="font-inter text-xs text-slate-600">{deal.founder}</p>
                                                </div>
                                            </div>

                                            {/* Data Room Status & Source */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {deal.hasDataRoom ? (
                                                        <div className={cn(
                                                            "flex items-center gap-1.5 px-2 py-1 rounded-md border font-geist text-[10px] font-bold uppercase tracking-wider transition-colors",
                                                            deal.dataRoomStatus === 'unlocked'
                                                                ? "bg-[#a1e2b6]/20 border-[#a1e2b6]/50 text-[#102c1e]"
                                                                : "bg-slate-50 border-slate-200 text-slate-400"
                                                        )}>
                                                            {deal.dataRoomStatus === 'unlocked' ? (
                                                                <><Unlock className="w-3 h-3" /> DD Unlocked</>
                                                            ) : (
                                                                <><Lock className="w-3 h-3" /> Locked</>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="font-geist text-[10px] text-slate-300">N/A</span>
                                                    )}
                                                </div>

                                                {/* Hover Action / Drag Gripper */}
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <GripHorizontal className="w-4 h-4 text-slate-300" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}