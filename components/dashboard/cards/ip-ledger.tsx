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
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Shield className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-lg font-bold text-zinc-50">IP Protection</h3>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-5">
                <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                    <div>
                        <p className="font-medium text-zinc-50 text-sm mb-1">
                            Core Idea Secured
                        </p>
                        <p className="text-xs text-zinc-400 mb-3">
                            Your core business idea has been cryptographically secured and timestamped.
                        </p>
                        <p className="text-xs text-orange-500 font-medium">
                            Secured on {timestamp}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-4 p-4 bg-zinc-800/40 rounded-lg border border-zinc-800/50">
                <p className="text-xs text-zinc-400 font-medium mb-2">
                    Document Hash:
                </p>
                <p className="text-xs font-mono text-zinc-50 bg-zinc-950/50 p-2 rounded break-all">
                    0xA7F3E9C2B4D8F1E6A9C2B4D8F1E6A9C2
                </p>
            </div>
        </div>
    );
}
