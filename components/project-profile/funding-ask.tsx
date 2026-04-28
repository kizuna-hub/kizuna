'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface FundingAskCardProps {
    slug: string;
}

export function FundingAskCard({ slug }: FundingAskCardProps) {
    const target = 15000000; // $15M
    const raised = 6000000; // $6M raised so far
    const progress = (raised / target) * 100;

    return (
        <Card className="bg-kizuna-surface border border-kizuna-border rounded-2xl shadow-sm mb-6">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-kizuna-text-main">Funding Goal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <div className="flex justify-between items-baseline mb-2">
                        <span className="text-sm text-kizuna-text-muted">Raised</span>
                        <span className="text-2xl font-semibold text-kizuna-text-main">$6M</span>
                    </div>
                    <div className="flex justify-between items-baseline mb-3">
                        <span className="text-xs text-kizuna-text-muted">Target</span>
                        <span className="text-sm text-kizuna-text-main">$15M Series A</span>
                    </div>
                    <div className="relative">
                        <Progress value={progress} className="h-2 bg-zinc-200 [&>div]:bg-kizuna-primary" />
                        <div
                            className="absolute top-1/2 -translate-y-1/2 transition-all duration-300"
                            style={{ left: `${progress}%` }}
                        >
                            <div className="w-3 h-3 bg-kizuna-primary rounded-full relative -left-1.5" />
                        </div>
                    </div>
                    <p className="text-xs text-kizuna-text-muted mt-2">{Math.round(progress)}% funded</p>
                </div>

                <div className="space-y-2">
                    <Button className="w-full bg-kizuna-primary text-white font-semibold">
                        Contact Investors
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full border-kizuna-border text-kizuna-text-muted"
                    >
                        View Deal Terms
                    </Button>
                </div>

                <div className="space-y-3 pt-4 border-t border-kizuna-border">
                    <div>
                        <p className="text-xs text-kizuna-text-muted mb-1">Use of Funds</p>
                        <ul className="text-xs text-kizuna-text-muted space-y-1">
                            <li>• Product Development: 40%</li>
                            <li>• Sales & Marketing: 35%</li>
                            <li>• Operations: 25%</li>
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
