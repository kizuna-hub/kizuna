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
        <Card className="border-zinc-800 bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 backdrop-blur-sm mb-6 sticky top-8">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg text-zinc-50">Funding Goal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <div className="flex justify-between items-baseline mb-2">
                        <span className="text-sm text-zinc-400">Raised</span>
                        <span className="text-2xl font-bold text-orange-500">$6M</span>
                    </div>
                    <div className="flex justify-between items-baseline mb-3">
                        <span className="text-xs text-zinc-500">Target</span>
                        <span className="text-sm text-zinc-400">$15M Series A</span>
                    </div>
                    <div className="relative">
                        <Progress value={progress} className="h-2 bg-zinc-800" />
                        <div
                            className="absolute top-1/2 -translate-y-1/2 transition-all duration-300"
                            style={{ left: `${progress}%` }}
                        >
                            <div className="w-3 h-3 bg-orange-600 rounded-full shadow-lg shadow-orange-600/50 relative -left-1.5" />
                        </div>
                    </div>
                    <p className="text-xs text-zinc-500 mt-2">{Math.round(progress)}% funded</p>
                </div>

                <div className="space-y-2">
                    <Button className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold shadow-lg shadow-orange-600/30">
                        Contact Investors
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800/50 hover:text-zinc-50"
                    >
                        View Deal Terms
                    </Button>
                </div>

                <div className="space-y-3 pt-4 border-t border-zinc-800">
                    <div>
                        <p className="text-xs text-zinc-500 mb-1">Use of Funds</p>
                        <ul className="text-xs text-zinc-400 space-y-1">
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
