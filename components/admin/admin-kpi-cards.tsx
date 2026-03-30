'use client';

import { TrendingUp } from 'lucide-react';

interface KPICardProps {
    label: string;
    value: string | number;
    subtitle?: string;
    trend?: number;
}

function KPICard({ label, value, subtitle, trend }: KPICardProps) {
    return (
        <div className="rounded-lg p-6 border bg-card border-border flex flex-col justify-between">
            <div>
                <p className="text-sm font-medium text-muted-foreground">
                    {label}
                </p>
                <p className="text-3xl font-bold mt-2 text-foreground">
                    {value}
                </p>
            </div>
            <div className="mt-4 flex items-center justify-between">
                {subtitle && (
                    <p className="text-xs text-muted-foreground">
                        {subtitle}
                    </p>
                )}
                {trend !== undefined && (
                    <div className="flex items-center gap-1 text-primary">
                        <TrendingUp size={16} />
                        <span className="text-sm font-medium">{trend}%</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export function AdminKPICards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
                label="Total Submissions"
                value="124"
                subtitle="Last 30 days"
                trend={12}
            />
            <KPICard
                label="Eligible Applications"
                value="45"
                subtitle="36% of total"
                trend={8}
            />
            <KPICard
                label="Available Funding"
                value="$150K"
                subtitle="Allocated budget"
                trend={5}
            />
            <KPICard
                label="Active Mentors"
                value="32"
                subtitle="Verified mentors"
                trend={15}
            />
        </div>
    );
}
