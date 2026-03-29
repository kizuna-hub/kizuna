'use client';

import { useState } from 'react';
import {
    TrendingUp,
    Bell,
    Settings,
    Download,
    Eye,
    Lock,
    Shield,
    Users,
    Zap,
    Target,
    CheckCircle2,
    ChevronDown,
    Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    LineChart,
    Line,
    ResponsiveContainer,
    Area,
    AreaChart,
    YAxis,
    XAxis,
    Tooltip,
} from 'recharts';

// Mock data for sparklines
const generateSparklineData = () => {
    return Array.from({ length: 7 }, (_, i) => ({
        value: Math.random() * 100 + 50,
        x: i,
    }));
};

// Mock startup data
const startups = [
    {
        id: 1,
        name: 'MarketOS',
        logo: '🎯',
        industry: 'AI',
        stage: 'MVP',
        nq54: true,
        teamSize: 4,
        capital: '$25k Seed',
        revenue: 12000,
        trend: generateSparklineData(),
        deckRequested: false,
    },
    {
        id: 2,
        name: 'StudySync',
        logo: '📚',
        industry: 'EdTech',
        stage: 'Traction',
        nq54: false,
        teamSize: 6,
        capital: 'Bootstrapped',
        revenue: 45000,
        trend: generateSparklineData(),
        deckRequested: false,
    },
    {
        id: 3,
        name: 'GrowthLabs',
        logo: '📈',
        industry: 'SaaS',
        stage: 'MVP',
        nq54: true,
        teamSize: 3,
        capital: '$50k Seed',
        revenue: 8500,
        trend: generateSparklineData(),
        deckRequested: true,
    },
    {
        id: 4,
        name: 'AgriChain',
        logo: '🌾',
        industry: 'AgriTech',
        stage: 'Traction',
        nq54: false,
        teamSize: 8,
        capital: '$200k Series A',
        revenue: 125000,
        trend: generateSparklineData(),
        deckRequested: false,
    },
    {
        id: 5,
        name: 'FinFlow',
        logo: '💳',
        industry: 'FinTech',
        stage: 'MVP',
        nq54: true,
        teamSize: 5,
        capital: '$75k Seed',
        revenue: 32000,
        trend: generateSparklineData(),
        deckRequested: false,
    },
];

// Radar alerts
const alerts = [
    { id: 1, text: 'MarketOS just uploaded their Financial Plan', time: '2 mins ago' },
    { id: 2, text: 'StudySync reached 1,000 users milestone', time: '15 mins ago' },
    { id: 3, text: 'New deal matched: GrowthLabs + AI focus', time: '1 hour ago' },
    { id: 4, text: 'AgriChain disclosed $2M ARR', time: '3 hours ago' },
];

// Ecosystem health stats
const stats = [
    {
        label: 'Total Deal Flow',
        value: '342',
        icon: Target,
        color: 'from-orange-500/20 to-orange-600/20',
    },
    {
        label: 'Post-MVP Stage',
        value: '89',
        icon: CheckCircle2,
        color: 'from-green-500/20 to-green-600/20',
    },
    {
        label: 'Ecosystem Capital',
        value: '$4.2B',
        icon: Zap,
        color: 'from-blue-500/20 to-blue-600/20',
    },
    {
        label: 'Pending Deck Requests',
        value: '12',
        icon: FileIcon,
        color: 'from-purple-500/20 to-purple-600/20',
        badge: true,
    },
];

function FileIcon(props: any) {
    return (
        <svg
            {...props}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
        </svg>
    );
}

function SparklineChart({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width={60} height={30}>
            <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#ff6b35" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#ff6b35"
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    isAnimationActive={false}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

export default function InvestorDashboard() {
    const [requestedDecks, setRequestedDecks] = useState<number[]>([]);
    const [filters, setFilters] = useState({
        revenueGenerating: false,
        b2bOnly: false,
        seekingAbove50k: false,
    });

    const toggleDeckRequest = (id: number) => {
        setRequestedDecks((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50">
            {/* Header */}
            <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur sticky top-0 z-50">
                <div className="px-8 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                            <Target className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">FUNDGO Investment Radar</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                            <Bell className="w-5 h-5 text-zinc-400 hover:text-orange-500 transition-colors" />
                            <div className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
                        </button>
                        <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                            <Settings className="w-5 h-5 text-zinc-400 hover:text-orange-500 transition-colors" />
                        </button>
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export Data
                        </Button>
                    </div>
                </div>
            </header>

            <main className="px-8 py-8">
                {/* Ecosystem Health Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card
                                key={stat.label}
                                className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 transition-all duration-300 p-6 group cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-5 h-5 text-orange-400" />
                                    </div>
                                    {stat.badge && (
                                        <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                                    )}
                                </div>
                                <p className="text-zinc-400 text-sm font-medium mb-2">{stat.label}</p>
                                <p className="text-3xl font-bold text-white group-hover:text-orange-400 transition-colors">
                                    {stat.value}
                                </p>
                            </Card>
                        );
                    })}
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Deal Sourcing Table */}
                    <div className="lg:col-span-2">
                        <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
                            <div className="p-6 border-b border-zinc-800">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-orange-500" />
                                    Curated Startups
                                </h2>
                                <p className="text-zinc-400 text-sm mt-1">High-potential deals matching your criteria</p>
                            </div>

                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-zinc-800 hover:bg-transparent">
                                            <TableHead className="text-zinc-400 font-semibold">Project</TableHead>
                                            <TableHead className="text-zinc-400 font-semibold">Stage</TableHead>
                                            <TableHead className="text-zinc-400 font-semibold">Team</TableHead>
                                            <TableHead className="text-zinc-400 font-semibold">Capital</TableHead>
                                            <TableHead className="text-zinc-400 font-semibold">Growth Trend</TableHead>
                                            <TableHead className="text-zinc-400 font-semibold text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {startups.map((startup) => (
                                            <TableRow
                                                key={startup.id}
                                                className="border-zinc-800 hover:bg-zinc-800/50 transition-all duration-200 group cursor-pointer"
                                            >
                                                {/* Project */}
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-2xl">{startup.logo}</div>
                                                        <div>
                                                            <p className="font-semibold text-white">{startup.name}</p>
                                                            <Badge variant="secondary" className="mt-1 bg-zinc-800 text-orange-400 border-orange-500/30">
                                                                {startup.industry}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                {/* Stage & NQ-54 */}
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            variant="outline"
                                                            className={`border-zinc-700 ${startup.stage === 'MVP'
                                                                    ? 'bg-blue-500/10 text-blue-400'
                                                                    : 'bg-green-500/10 text-green-400'
                                                                }`}
                                                        >
                                                            {startup.stage}
                                                        </Badge>
                                                        {startup.nq54 && (
                                                            <div className="group/tooltip relative">
                                                                <Shield className="w-4 h-4 text-orange-500" />
                                                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-orange-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none">
                                                                    NQ-54 Certified
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>

                                                {/* Team Size */}
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-zinc-300">
                                                        <Users className="w-4 h-4 text-orange-500" />
                                                        {startup.teamSize}
                                                    </div>
                                                </TableCell>

                                                {/* Capital */}
                                                <TableCell>
                                                    <p className="text-zinc-300 text-sm font-mono">{startup.capital}</p>
                                                </TableCell>

                                                {/* Growth Trend */}
                                                <TableCell>
                                                    <SparklineChart data={startup.trend} />
                                                </TableCell>

                                                {/* Action Button */}
                                                <TableCell className="text-right">
                                                    {requestedDecks.includes(startup.id) ? (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="border-orange-500 text-orange-400 hover:bg-orange-500/10"
                                                        >
                                                            <Eye className="w-4 h-4 mr-1" />
                                                            View Deck
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => toggleDeckRequest(startup.id)}
                                                            className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-all duration-200"
                                                        >
                                                            Request Deck
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    </div>

                    {/* Right Sidebar - Filters & Alerts */}
                    <div className="space-y-6">
                        {/* Quick Filters */}
                        <Card className="bg-zinc-900 border-zinc-800 p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Search className="w-5 h-5 text-orange-500" />
                                Filter Deals
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-800 transition-colors group cursor-pointer">
                                    <label className="text-sm font-medium text-zinc-300 cursor-pointer">
                                        Revenue Generating
                                    </label>
                                    <Switch
                                        checked={filters.revenueGenerating}
                                        onCheckedChange={(checked) =>
                                            setFilters({ ...filters, revenueGenerating: checked })
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-800 transition-colors group cursor-pointer">
                                    <label className="text-sm font-medium text-zinc-300 cursor-pointer">
                                        B2B Only
                                    </label>
                                    <Switch
                                        checked={filters.b2bOnly}
                                        onCheckedChange={(checked) =>
                                            setFilters({ ...filters, b2bOnly: checked })
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-800 transition-colors group cursor-pointer">
                                    <label className="text-sm font-medium text-zinc-300 cursor-pointer">
                                        Seeking {`>`} $50k
                                    </label>
                                    <Switch
                                        checked={filters.seekingAbove50k}
                                        onCheckedChange={(checked) =>
                                            setFilters({ ...filters, seekingAbove50k: checked })
                                        }
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* Radar Alerts */}
                        <Card className="bg-zinc-900 border-zinc-800 p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Bell className="w-5 h-5 text-orange-500" />
                                Radar Alerts
                            </h3>
                            <div className="space-y-3 max-h-80 overflow-y-auto">
                                {alerts.map((alert) => (
                                    <div
                                        key={alert.id}
                                        className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:border-orange-500/30 transition-all group cursor-pointer"
                                    >
                                        <p className="text-sm text-zinc-300 group-hover:text-zinc-100 transition-colors">
                                            {alert.text}
                                        </p>
                                        <p className="text-xs text-zinc-500 mt-2">{alert.time}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Deck Requests Summary */}
                        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/30 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FileIcon className="w-5 h-5 text-orange-500" />
                                <h3 className="text-lg font-bold text-white">Requested Decks</h3>
                            </div>
                            <p className="text-3xl font-bold text-orange-400 mb-2">
                                {requestedDecks.length}
                            </p>
                            <p className="text-sm text-zinc-300">
                                {requestedDecks.length === 0
                                    ? 'Start requesting pitch decks'
                                    : `${requestedDecks.length} deck${requestedDecks.length !== 1 ? 's' : ''} pending`}
                            </p>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
