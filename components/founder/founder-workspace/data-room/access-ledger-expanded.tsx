"use client";
import React, { useState } from 'react';
import { Eye, Mail, XOctagon, ChevronDown, ChevronRight, Monitor, Smartphone, Globe, Clock, History } from 'lucide-react';

interface LinkSession {
    id: string;
    duration: string;
    device: 'desktop' | 'mobile';
    browser: string;
    location: string;
    activity: string;
}

interface InvestorLink {
    id: string;
    recipient: string;
    fund: string;
    initial: string;
    views: number;
    completion: string;
    requiresEmail: boolean;
    isActive: boolean;
    sessions: LinkSession[];
}

export default function AccessLedgerExpanded() {
    const [expandedRowId, setExpandedRowId] = useState<string | null>('1');

    const [links, setLinks] = useState<InvestorLink[]>([
        {
            id: '1', recipient: 'Takeru Hishinuma', fund: 'Kizuna Ventures', initial: 'TH', views: 12, completion: '85%', requiresEmail: true, isActive: true,
            sessions: [
                { id: 's1', duration: '4m 20s', device: 'desktop', browser: 'Mac Safari', location: 'Singapore', activity: 'Spent 90s on Slide 4 (SpacetimeDB)' },
                { id: 's2', duration: '0m 12s', device: 'mobile', browser: 'iPhone iOS', location: 'Da Nang', activity: 'Bounced on Slide 1' }
            ]
        },
        {
            id: '2', recipient: 'John Doe', fund: 'Sequoia Capital', initial: 'JD', views: 3, completion: '100%', requiresEmail: false, isActive: true,
            sessions: [
                { id: 's3', duration: '15m 10s', device: 'desktop', browser: 'Windows Chrome', location: 'San Francisco', activity: 'Downloaded Financial Model' }
            ]
        },
        {
            id: '3', recipient: 'Jane Smith', fund: 'Angel Investor', initial: 'JS', views: 0, completion: '0%', requiresEmail: true, isActive: false,
            sessions: []
        },
    ]);

    const toggleLink = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setLinks(links.map(link => link.id === id ? { ...link, isActive: !link.isActive } : link));
    };

    const toggleRow = (id: string) => {
        setExpandedRowId(expandedRowId === id ? null : id);
    };

    return (
        <div className="border border-[#102c1e]/10 bg-white shadow-sm rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-outfit font-bold text-[#102c1e] text-lg">Deep Access Ledger</h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[#102c1e]/5">
                            <th className="pb-3 w-8"></th>
                            <th className="pb-3 text-[10px] font-geist font-bold text-[#102c1e]/50 uppercase tracking-widest pl-2">Recipient / Fund</th>
                            <th className="pb-3 text-[10px] font-geist font-bold text-[#102c1e]/50 uppercase tracking-widest text-center">Security</th>
                            <th className="pb-3 text-[10px] font-geist font-bold text-[#102c1e]/50 uppercase tracking-widest text-right">Views</th>
                            <th className="pb-3 text-[10px] font-geist font-bold text-[#102c1e]/50 uppercase tracking-widest text-right">Completion</th>
                            <th className="pb-3 text-[10px] font-geist font-bold text-[#102c1e]/50 uppercase tracking-widest pl-4 text-center">Status</th>
                            <th className="pb-3 text-[10px] font-geist font-bold text-[#102c1e]/50 uppercase tracking-widest text-right pr-2">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#102c1e]/5">
                        {links.map((link) => (
                            <React.Fragment key={link.id}>
                                <tr onClick={() => toggleRow(link.id)} className="hover:bg-[#fafafa] transition-colors group cursor-pointer">
                                    <td className="py-4 pl-2">
                                        {expandedRowId === link.id ? (
                                            <ChevronDown className="h-4 w-4 text-[#102c1e]" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#102c1e]" />
                                        )}
                                    </td>
                                    <td className="py-4 font-geist text-sm pl-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[#102c1e]/5 text-[#102c1e] border border-[#102c1e]/10 flex items-center justify-center font-geist font-black text-[11px] shrink-0">
                                                {link.initial}
                                            </div>
                                            <div>
                                                <div className="font-bold text-[#102c1e]">{link.recipient}</div>
                                                <div className="text-slate-400 text-[11px] mt-0.5">{link.fund}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 font-geist text-sm text-center">
                                        {link.requiresEmail ? (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#102c1e]/5 text-[#102c1e]">
                                                <Mail className="h-3 w-3" /> Email Req
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-500">
                                                Open Link
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4">
                                        <span className="flex items-center justify-end gap-1.5 font-mono font-medium text-[#102c1e] text-sm">
                                            <Eye className="h-3.5 w-3.5 text-slate-400" /> {link.views}
                                        </span>
                                    </td>
                                    <td className="py-4 font-mono font-bold text-[#102c1e] text-right text-sm">{link.completion}</td>
                                    <td className="py-4 font-geist text-center pl-4">
                                        <label className="relative inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                                            <input type="checkbox" className="sr-only peer" checked={link.isActive} onChange={(e) => toggleLink(link.id, e as any)} />
                                            <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#102c1e]"></div>
                                        </label>
                                    </td>
                                    <td className="py-4 text-right pr-2">
                                        <button className="bg-red-50 text-red-600 px-2.5 py-1 text-xs rounded-lg font-geist font-bold hover:bg-red-100 transition-colors inline-flex items-center gap-1.5 focus:outline-none" onClick={(e) => e.stopPropagation()}>
                                            <XOctagon className="h-3 w-3" /> Revoke
                                        </button>
                                    </td>
                                </tr>
                                {/* Expandable Row Content: Inspector Sub-Grid */}
                                {expandedRowId === link.id && (
                                    <tr className="bg-[#fafafa]">
                                        <td colSpan={7} className="py-4 px-6 border-b border-[#102c1e]/5">
                                            <div className="rounded-xl border border-[#102c1e]/10 bg-white p-4 shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)]">
                                                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#102c1e]/5">
                                                    <History className="h-4 w-4 text-[#102c1e]/50" />
                                                    <span className="font-geist font-bold text-xs text-[#102c1e]">Session Inspector</span>
                                                </div>
                                                {link.sessions.length > 0 ? (
                                                    <div className="space-y-3">
                                                        {link.sessions.map((session) => (
                                                            <div key={session.id} className="grid grid-cols-12 gap-4 items-center bg-[#fdfdfd] border border-[#102c1e]/5 p-2.5 rounded-lg hover:border-[#102c1e]/10 transition-colors">
                                                                <div className="col-span-2 flex items-center justify-end gap-2 text-slate-500 font-mono text-xs">
                                                                    <Clock className="h-3.5 w-3.5 opacity-50" />
                                                                    <span className="w-full text-right">{session.duration}</span>
                                                                </div>
                                                                <div className="col-span-3 flex items-center gap-2 text-slate-500 font-mono text-xs border-l border-[#102c1e]/5 pl-4">
                                                                    {session.device === 'desktop' ? <Monitor className="h-3.5 w-3.5 opacity-50" /> : <Smartphone className="h-3.5 w-3.5 opacity-50" />}
                                                                    {session.browser}
                                                                </div>
                                                                <div className="col-span-2 flex items-center gap-2 text-slate-500 font-mono text-xs border-l border-[#102c1e]/5 pl-4">
                                                                    <Globe className="h-3.5 w-3.5 opacity-50" />
                                                                    {session.location}
                                                                </div>
                                                                <div className="col-span-5 flex items-center text-slate-600 font-inter text-xs border-l border-[#102c1e]/5 pl-4 truncate">
                                                                    {session.activity}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="py-4 text-center font-inter text-xs text-slate-400">
                                                        No sessions recorded yet.
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}