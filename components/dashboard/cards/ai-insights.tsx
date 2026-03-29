'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Lightbulb } from 'lucide-react';

const insights = [
    {
        id: 1,
        title: 'Market Opportunity',
        description: 'AI-powered SaaS market growing at 45% YoY',
        type: 'positive',
    },
    {
        id: 2,
        title: 'Competitive Landscape',
        description: '12 direct competitors identified in your niche',
        type: 'neutral',
    },
    {
        id: 3,
        title: 'Customer Demand',
        description: 'High search volume for your target keywords',
        type: 'positive',
    },
];

export default function AIInsightsCard() {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-lg font-bold text-zinc-50">Recent AI Insights</h3>
            </div>

            <div className="space-y-3">
                {insights.map((insight) => (
                    <div
                        key={insight.id}
                        className="p-3 rounded-lg bg-zinc-800/40 border border-zinc-800/50 hover:bg-zinc-800/60 transition-colors"
                    >
                        <div className="flex items-start gap-3">
                            {insight.type === 'positive' ? (
                                <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            ) : insight.type === 'neutral' ? (
                                <Lightbulb className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                            ) : (
                                <TrendingDown className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                                <p className="font-medium text-zinc-50 text-sm">
                                    {insight.title}
                                </p>
                                <p className="text-xs text-zinc-400 mt-1">
                                    {insight.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
