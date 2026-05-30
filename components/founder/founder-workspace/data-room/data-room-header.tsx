"use client";

import React, { useState } from 'react';
import { ChevronDown, Lock, Link as LinkIcon } from 'lucide-react';
import { DocumentSpace } from './types';

export default function DataRoomHeader() {
    const [isOpen, setIsOpen] = useState(false);
    const currentSpace: DocumentSpace = { id: '1', name: 'Seed Round Pitch Deck', type: 'deck', updatedAt: '2 days ago' };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-4 border-b border-[#102c1e]/5 mb-6">
            <div className="flex flex-col gap-1">
                <h1 className="font-outfit font-black text-2xl text-[#102c1e] tracking-tight">Secure Data Room</h1>

                {/* Document Vault Switcher */}
                <div className="relative mt-2">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#102c1e]/10 bg-white hover:bg-[#fafafa] transition-colors shadow-sm"
                    >
                        <div className="p-1 rounded bg-[#102c1e]/5 text-[#102c1e]">
                            <Lock className="h-3.5 w-3.5" />
                        </div>
                        <span className="font-geist font-bold text-sm text-[#102c1e]">{currentSpace.name}</span>
                        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    </button>

                    {isOpen && (
                        <div className="absolute top-full left-0 mt-1 w-64 rounded-xl border border-[#102c1e]/10 bg-white shadow-sm z-10 py-1">
                            <div className="px-3 py-2 border-b border-[#102c1e]/5">
                                <span className="font-geist text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Vault</span>
                            </div>
                            <button className="w-full text-left px-3 py-2 hover:bg-[#fafafa] flex items-center justify-between group">
                                <span className="font-geist font-medium text-sm text-[#102c1e]">Seed Round Pitch Deck</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#102c1e]/5 text-[#102c1e] font-geist font-bold scale-0 group-hover:scale-100 transition-transform">Active</span>
                            </button>
                            <button className="w-full text-left px-3 py-2 hover:bg-[#fafafa] flex items-center justify-between">
                                <span className="font-geist font-medium text-sm text-slate-600">SpacetimeDB Tech Architecture</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <button className="flex items-center gap-2 bg-[#102c1e] text-[#fafafa] font-geist font-bold rounded-xl px-4 py-2.5 text-sm hover:bg-[#102c1e]/90 transition-colors shadow-sm">
                <LinkIcon className="h-4 w-4" />
                + Generate Magic Link
            </button>
        </div>
    );
}