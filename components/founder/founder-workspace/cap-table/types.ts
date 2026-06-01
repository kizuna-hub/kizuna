export interface Shareholder {
    id: string;
    name: string;
    type: 'founder' | 'investor' | 'advisor' | 'esop' | 'employee';
    shares: number;
    percentage: number;
    investedAmount?: number;
    round?: string;
    date?: string;
    notes?: string;
    vestingSchedule?: {
        totalMonths: number;
        cliffMonths: number;
        vestedPercent: number;
    };
}

export interface CapTableStats {
    totalShares: number;
    fullyDilutedShares: number;
    optionPoolShares: number;
    optionPoolPercent: number;
    postMoneyValuation?: number;
    pricePerShare?: number;
    lastRound?: string;
}
