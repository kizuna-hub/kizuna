'use client';

import React from 'react';
import { Shield, CheckCircle2 } from 'lucide-react';

export default function IPLedgerCard() {
    const timestamp = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div className="bg-white border border-kizuna-border shadow-sm rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-zinc-50 rounded-lg">
                    <Shield className="w-5 h-5 text-kizuna-primary" />
                </div>
                <h3 className="text-lg font-bold text-kizuna-text-main">IP Protection</h3>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-5">
                <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-kizuna-primary flex-shrink-0 mt-1" />
                    <div>
                        <p className="font-medium text-kizuna-text-main text-sm mb-1">
                            Core Idea Secured
                        </p>
                        <p className="text-xs text-kizuna-text-muted mb-3">
                            Your core business idea has been cryptographically secured and timestamped.
                        </p>
                        <p className="text-xs text-kizuna-primary font-medium">
                            Secured on {timestamp}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-4 p-4 bg-zinc-50 rounded-lg border border-zinc-100">
                <p className="text-xs text-kizuna-text-muted font-medium mb-2">
                    Document Hash:
                </p>
                <p className="text-xs font-mono text-kizuna-text-main bg-white p-2 rounded break-all border border-zinc-100">
                    0xA7F3E9C2B4D8F1E6A9C2B4D8F1E6A9C2
                </p>
            </div>
        </div>
    );
}
