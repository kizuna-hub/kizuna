"use client";

import React, { useState } from 'react';
import { SecureLink } from './types';
import { Eye, Mail, XOctagon } from 'lucide-react';

export default function AccessLedger() {
    const [links, setLinks] = useState<SecureLink[]>([
        { id: '1', recipient: 'Takeru Hishinuma', fund: 'Kizuna Ventures', initial: 'TH', views: 12, completion: '85%', requiresEmail: true, expiresAt: '2026-06-30', isActive: true },
        { id: '2', recipient: 'John Doe', fund: 'Sequoia Capital', initial: 'JD', views: 3, completion: '100%', requiresEmail: false, expiresAt: '2026-06-15', isActive: true },
        { id: '3', recipient: 'Jane Smith', fund: 'Angel Investor', initial: 'JS', views: 0, completion: '0%', requiresEmail: true, expiresAt: '2026-06-10', isActive: false },
    ]);

    const toggleLink = (id: string) => {
        setLinks(links.map(link => link.id === id ? { ...link, isActive: !link.isActive } : link));
    };

    return (
        <div className="border border-[#102c1e]/10 bg-white shadow-sm rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-outfit font-bold text-[#102c1e] text-lg">Active Links Ledger</h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[#102c1e]/5">
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
                            <tr key={link.id} className="hover:bg-[#fafafa] transition-colors group">
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
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={link.isActive} onChange={() => toggleLink(link.id)} />
                                        <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#102c1e]"></div>
                                    </label>
                                </td>
                                <td className="py-4 text-right pr-2">
                                    <button className="bg-red-50 text-red-600 px-2.5 py-1 text-xs rounded-lg font-geist font-bold hover:bg-red-100 transition-colors inline-flex items-center gap-1.5 opacity-0 group-hover:opacity-100 focus:opacity-100">
                                        <XOctagon className="h-3 w-3" /> Revoke
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}