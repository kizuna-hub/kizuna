"use client";

import React, { useState } from 'react';
import { Shield, FileCheck2, Fingerprint, Building2 } from 'lucide-react';

export default function SecurityPresets() {
    const [nda, setNda] = useState(true);
    const [watermark, setWatermark] = useState(true);
    const [domain, setDomain] = useState(false);

    const Toggle = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
        <button
            onClick={onClick}
            className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${active ? 'bg-[#a1e2b6]' : 'bg-slate-200'}`}
        >
            <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${active ? 'translate-x-4 border border-[#a1e2b6]' : 'translate-x-0.5 border border-slate-300'}`} />
        </button>
    );

    return (
        <div className="bg-white border border-[#102c1e]/10 shadow-sm rounded-3xl p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-[#102c1e]/5 rounded-xl text-[#102c1e]">
                    <Shield className="h-4 w-4" />
                </div>
                <h3 className="font-outfit font-bold text-[#102c1e] text-lg tracking-tight">Access Controls</h3>
            </div>

            <div className="flex-1 flex flex-col gap-5">
                <label className="flex items-start justify-between gap-4 group cursor-pointer">
                    <div className="flex gap-3">
                        <FileCheck2 className="h-4 w-4 text-[#102c1e]/40 mt-0.5" />
                        <div>
                            <div className="font-geist font-bold text-sm text-[#102c1e]">Enforce NDA Gate</div>
                            <p className="font-inter text-xs text-slate-500 mt-1 leading-relaxed">Block access until digital NDA is checked and signed by the counterparty.</p>
                        </div>
                    </div>
                    <Toggle active={nda} onClick={() => setNda(!nda)} />
                </label>

                <div className="h-px w-full bg-[#102c1e]/5" />

                <label className="flex items-start justify-between gap-4 group cursor-pointer">
                    <div className="flex gap-3">
                        <Fingerprint className="h-4 w-4 text-[#102c1e]/40 mt-0.5" />
                        <div>
                            <div className="font-geist font-bold text-sm text-[#102c1e]">Dynamic Email Watermark</div>
                            <p className="font-inter text-xs text-slate-500 mt-1 leading-relaxed">Stamps reader's email onto the canvas to heavily deter physical or digital leaks.</p>
                        </div>
                    </div>
                    <Toggle active={watermark} onClick={() => setWatermark(!watermark)} />
                </label>

                <div className="h-px w-full bg-[#102c1e]/5" />

                <label className="flex items-start justify-between gap-4 group cursor-pointer">
                    <div className="flex gap-3">
                        <Building2 className="h-4 w-4 text-[#102c1e]/40 mt-0.5" />
                        <div>
                            <div className="font-geist font-bold text-sm text-[#102c1e]">Restrict to Corporate Domains</div>
                            <p className="font-inter text-xs text-slate-500 mt-1 leading-relaxed">Blocks generic emails (@gmail.com, @yahoo.com) from authenticating.</p>
                        </div>
                    </div>
                    <Toggle active={domain} onClick={() => setDomain(!domain)} />
                </label>
            </div>
        </div>
    );
}