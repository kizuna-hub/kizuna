'use client';

import React from 'react';
import { Shareholder } from './types';

// Map shareholder type → donut segment color
const TYPE_COLORS: Record<Shareholder['type'], string> = {
    founder: '#102c1e',
    investor: '#a1e2b6',
    advisor: '#4a7c5f',
    esop: '#8ab4a0',
    employee: '#c8ddd5',
};

const TYPE_LABELS: Record<Shareholder['type'], string> = {
    founder: 'Founders',
    investor: 'Investors',
    advisor: 'Advisors',
    esop: 'ESOP Pool',
    employee: 'Employees',
};

interface CapTableChartProps {
    shareholders: Shareholder[];
    totalShares: number;
    optionPoolPercent: number;
}

export function CapTableChart({ shareholders, totalShares, optionPoolPercent }: CapTableChartProps) {
    // Group by type and sum percentages
    const grouped = shareholders.reduce<Record<string, number>>((acc, s) => {
        acc[s.type] = (acc[s.type] || 0) + s.percentage;
        return acc;
    }, {});

    const segments = Object.entries(grouped).map(([type, pct]) => ({
        type: type as Shareholder['type'],
        pct,
        color: TYPE_COLORS[type as Shareholder['type']],
        label: TYPE_LABELS[type as Shareholder['type']],
    }));

    // Build SVG donut paths
    const cx = 100, cy = 100, r = 72, innerR = 48;
    const gap = 2; // degrees gap between segments

    let cumulativeAngle = -90; // Start from top

    const paths = segments.map(seg => {
        const startAngle = cumulativeAngle + gap / 2;
        const sweep = (seg.pct / 100) * 360 - gap;
        cumulativeAngle += (seg.pct / 100) * 360;
        const endAngle = startAngle + sweep;

        const toRad = (deg: number) => (deg * Math.PI) / 180;
        const x1 = cx + r * Math.cos(toRad(startAngle));
        const y1 = cy + r * Math.sin(toRad(startAngle));
        const x2 = cx + r * Math.cos(toRad(endAngle));
        const y2 = cy + r * Math.sin(toRad(endAngle));
        const ix1 = cx + innerR * Math.cos(toRad(startAngle));
        const iy1 = cy + innerR * Math.sin(toRad(startAngle));
        const ix2 = cx + innerR * Math.cos(toRad(endAngle));
        const iy2 = cy + innerR * Math.sin(toRad(endAngle));

        const largeArc = sweep > 180 ? 1 : 0;

        const d = [
            `M ${x1} ${y1}`,
            `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
            `L ${ix2} ${iy2}`,
            `A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix1} ${iy1}`,
            'Z',
        ].join(' ');

        return { ...seg, d };
    });

    return (
        <div className="flex flex-col gap-6">
            {/* Donut Chart */}
            <div className="relative flex items-center justify-center">
                <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-sm">
                    {paths.map((seg, i) => (
                        <path
                            key={i}
                            d={seg.d}
                            fill={seg.color}
                            className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                        />
                    ))}
                    {/* Center label */}
                    <text x="100" y="94" textAnchor="middle" className="font-mono" fill="#102c1e" fontSize="11" fontWeight="700" fontFamily="monospace">
                        {totalShares.toLocaleString()}
                    </text>
                    <text x="100" y="110" textAnchor="middle" fill="#102c1e" fontSize="8" fontWeight="600" fontFamily="monospace" opacity="0.5">
                        TOTAL SHARES
                    </text>
                </svg>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-2">
                {segments.map((seg, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-default">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: seg.color }} />
                            <span className="font-geist text-xs font-bold text-[#102c1e]">{seg.label}</span>
                        </div>
                        <span className="font-mono text-xs font-bold text-[#102c1e]/70">
                            {seg.pct.toFixed(1)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
