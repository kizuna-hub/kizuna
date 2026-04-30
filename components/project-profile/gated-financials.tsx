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
        <Card className="bg-kizuna-surface border border-kizuna-border rounded-2xl shadow-sm">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-kizuna-text-main">Financial Details</CardTitle>
            </CardHeader>
            <CardContent>
                {!isUnlocked ? (
                    <div className="space-y-4 text-center py-6">
                        <div className="text-sm text-kizuna-text-muted space-y-2">
                            <p>Detailed financial projections and metrics</p>
                            <p className="text-xs text-kizuna-text-muted">Available for investors and partners</p>
                        </div>
                        <Button
                            onClick={() => setIsUnlocked(true)}
                            className="w-full bg-kizuna-primary text-white font-semibold"
                        >
                            Unlock Access
                        </Button>
                        <p className="text-xs text-kizuna-text-muted">Sign in with your investor account</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-white border border-kizuna-border rounded-lg p-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-kizuna-text-muted">ARR</span>
                                <span className="text-lg font-semibold text-kizuna-text-main">$2.3M</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-kizuna-text-muted">MRR Growth</span>
                                <span className="text-lg font-semibold text-kizuna-text-main">18%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-kizuna-text-muted">Burn Rate</span>
                                <span className="text-lg font-semibold text-kizuna-text-main">$180K</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-kizuna-text-muted">Runway</span>
                                <span className="text-lg font-semibold text-kizuna-text-main">24 months</span>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full border-kizuna-border text-kizuna-text-muted"
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
