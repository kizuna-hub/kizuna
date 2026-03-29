'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GatedFinancialsProps {
    slug: string;
}

export function GatedFinancials({ slug }: GatedFinancialsProps) {
    const [isUnlocked, setIsUnlocked] = useState(false);

    return (
        <Card className="border-zinc-800 bg-gradient-to-br from-zinc-900/60 to-zinc-900/20 backdrop-blur-sm sticky top-96">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg text-zinc-50">Financial Details</CardTitle>
            </CardHeader>
            <CardContent>
                {!isUnlocked ? (
                    <div className="space-y-4 text-center py-6">
                        <div className="text-sm text-zinc-400 space-y-2">
                            <p>Detailed financial projections and metrics</p>
                            <p className="text-xs text-zinc-500">Available for investors and partners</p>
                        </div>
                        <Button
                            onClick={() => setIsUnlocked(true)}
                            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold shadow-lg shadow-orange-600/30"
                        >
                            Unlock Access
                        </Button>
                        <p className="text-xs text-zinc-600">Sign in with your investor account</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-zinc-400">ARR</span>
                                <span className="text-lg font-bold text-orange-500">$2.3M</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-zinc-400">MRR Growth</span>
                                <span className="text-lg font-bold text-orange-500">18%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-zinc-400">Burn Rate</span>
                                <span className="text-lg font-bold text-orange-500">$180K</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-zinc-400">Runway</span>
                                <span className="text-lg font-bold text-orange-500">24 months</span>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800/50"
                            onClick={() => setIsUnlocked(false)}
                        >
                            Lock Details
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
