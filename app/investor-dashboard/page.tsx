'use client';

import { useState } from 'react';
import {
    TrendingUp,
    TrendingDown,
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
    Search,
    FileText,
    Activity,
    AlertCircle
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
    Area,
    AreaChart,
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
        matchScore: 94,
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
        matchScore: 78,
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
        matchScore: 89,
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
        matchScore: 72,
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
        matchScore: 92,
    },
];

// Radar alerts
const alerts = [
    { id: 1, text: 'MarketOS just uploaded their Financial Plan', time: '2 mins ago', type: 'deck' },
    { id: 2, text: 'StudySync reached 1,000 users milestone', time: '15 mins ago', type: 'milestone' },
    { id: 3, text: 'New deal matched: GrowthLabs + AI focus', time: '1 hour ago', type: 'match' },
    { id: 4, text: 'AgriChain disclosed $2M ARR', time: '3 hours ago', type: 'update' },
];

// Ecosystem health stats
const stats = [
    {
        label: 'Total Deal Flow',
        value: '342',
        icon: Target,
        color: 'from-orange-500/20 to-orange-600/20',
        trend: { change: '+12%', direction: 'up', time: 'from last month' },
    },
    {
        label: 'Post-MVP Stage',
        value: '89',
        icon: CheckCircle2,
        color: 'from-green-500/20 to-green-600/20',
        trend: { change: '+8%', direction: 'up', time: 'from last month' },
    },
    {
        label: 'Ecosystem Capital',
        value: '$4.2B',
        icon: Zap,
        color: 'from-blue-500/20 to-blue-600/20',
        trend: { change: '-3%', direction: 'down', time: 'from last month' },
    },
    {
        label: 'Pending Deck Requests',
        value: '12',
        icon: FileIcon,
        color: 'from-purple-500/20 to-purple-600/20',
        badge: true,
        trend: { change: '+24%', direction: 'up', time: 'from last week' },
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
        <AreaChart width={60} height={30} data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
            </defs>
            <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#colorValue)"
                isAnimationActive={false}
            />
        </AreaChart>
    );
}

export default function InvestorDashboard() {
    const [requestedDecks, setRequestedDecks] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [industryFilter, setIndustryFilter] = useState('All');
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
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="border-b border-border bg-background/50 backdrop-blur sticky top-0 z-50">
                <div className="px-8 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                            <Target className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">FUNDGO Investment Radar</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
                            <Bell className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                            <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                        </button>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <Settings className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                        </button>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2">
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
                        const isTrendPositive = stat.trend?.direction === 'up';
                        return (
                            <Card
                                key={stat.label}
                                className="bg-card border-border hover:border-primary/50 transition-all duration-300 p-6 group cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 rounded-lg bg-primary/10 group-hover:scale-110 transition-transform">
                                        <Icon className="w-5 h-5 text-primary" />
                                    </div>
                                    {stat.badge && (
                                        <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                                    )}
                                </div>
                                <p className="text-muted-foreground text-sm font-medium mb-2">{stat.label}</p>
                                <p className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                                    {stat.value}
                                </p>
                                {stat.trend && (
                                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                                        {isTrendPositive ? (
                                            <TrendingUp className="w-4 h-4 text-primary" />
                                        ) : (
                                            <TrendingDown className="w-4 h-4 text-destructive" />
                                        )}
                                        <span className={`text-sm font-medium ${isTrendPositive ? 'text-primary' : 'text-destructive'}`}>
                                            {stat.trend.change}
                                        </span>
                                        <span className="text-xs text-muted-foreground">{stat.trend.time}</span>
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Deal Sourcing Table */}
                    <div className="lg:col-span-2">
                        <Card className="bg-card border-border overflow-hidden">
                            <div className="p-6 border-b border-border">
                                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-primary" />
                                    Curated Startups
                                </h2>
                                <p className="text-muted-foreground text-sm mt-1">High-potential deals matching your criteria</p>
                            </div>

                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-border hover:bg-transparent">
                                            <TableHead className="text-muted-foreground font-semibold">Project</TableHead>
                                            <TableHead className="text-muted-foreground font-semibold">Match Score</TableHead>
                                            <TableHead className="text-muted-foreground font-semibold">Stage</TableHead>
                                            <TableHead className="text-muted-foreground font-semibold">Team</TableHead>
                                            <TableHead className="text-muted-foreground font-semibold">Capital</TableHead>
                                            <TableHead className="text-muted-foreground font-semibold">Growth Trend</TableHead>
                                            <TableHead className="text-muted-foreground font-semibold text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {startups.map((startup) => (
                                            <TableRow
                                                key={startup.id}
                                                className="border-border hover:bg-muted/50 transition-all duration-200 group cursor-pointer"
                                            >
                                                {/* Project */}
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-2xl">{startup.logo}</div>
                                                        <div>
                                                            <p className="font-semibold text-foreground">{startup.name}</p>
                                                            <Badge variant="secondary" className="mt-1 bg-muted text-primary border-primary/30">
                                                                {startup.industry}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                {/* Match Score */}
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-primary font-bold text-sm">{startup.matchScore}% Match</span>
                                                    </div>
                                                </TableCell>

                                                {/* Stage & NQ-54 */}
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            variant="outline"
                                                            className="border-border bg-primary/10 text-primary"
                                                        >
                                                            {startup.stage}
                                                        </Badge>
                                                        {startup.nq54 && (
                                                            <div className="group/tooltip relative">
                                                                <Shield className="w-4 h-4 text-primary" />
                                                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none">
                                                                    NQ-54 Certified
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>

                                                {/* Team Size */}
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <Users className="w-4 h-4 text-primary" />
                                                        {startup.teamSize}
                                                    </div>
                                                </TableCell>

                                                {/* Capital */}
                                                <TableCell>
                                                    <p className="text-muted-foreground text-sm font-mono">{startup.capital}</p>
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
                                                            className="border-primary text-primary hover:bg-primary/10"
                                                        >
                                                            <Eye className="w-4 h-4 mr-1" />
                                                            View Deck
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => toggleDeckRequest(startup.id)}
                                                            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all duration-200"
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
                        <Card className="bg-card border-border p-6">
                            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                <Search className="w-5 h-5 text-primary" />
                                Filter Deals
                            </h3>
                            <div className="space-y-4">
                                {/* Search Input */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search startups or founders..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>

                                {/* Industry Dropdown */}
                                <div className="relative group">
                                    <button className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground text-left flex items-center justify-between hover:border-primary focus:outline-none focus:border-primary transition-colors">
                                        <span className="text-sm">{industryFilter}</span>
                                        <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                                    </button>
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-muted border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                        {['All', 'AI', 'EdTech', 'SaaS', 'FinTech'].map((industry) => (
                                            <button
                                                key={industry}
                                                onClick={() => setIndustryFilter(industry)}
                                                className={`w-full px-4 py-2 text-left text-sm hover:bg-card transition-colors first:rounded-t-lg last:rounded-b-lg ${industryFilter === industry ? 'bg-primary/20 text-primary' : 'text-muted-foreground'
                                                    }`}
                                            >
                                                {industry}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Toggle Filters */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors group cursor-pointer">
                                        <label className="text-sm font-medium text-muted-foreground cursor-pointer group-hover:text-foreground">
                                            Revenue Generating
                                        </label>
                                        <Switch
                                            checked={filters.revenueGenerating}
                                            onCheckedChange={(checked) =>
                                                setFilters({ ...filters, revenueGenerating: checked })
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors group cursor-pointer">
                                        <label className="text-sm font-medium text-muted-foreground cursor-pointer group-hover:text-foreground">
                                            B2B Only
                                        </label>
                                        <Switch
                                            checked={filters.b2bOnly}
                                            onCheckedChange={(checked) =>
                                                setFilters({ ...filters, b2bOnly: checked })
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors group cursor-pointer">
                                        <label className="text-sm font-medium text-muted-foreground cursor-pointer group-hover:text-foreground">
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
                            </div>
                        </Card>

                        {/* Radar Alerts */}
                        <Card className="bg-card border-border p-6">
                            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                <Bell className="w-5 h-5 text-primary" />
                                Radar Alerts
                            </h3>
                            <div className="space-y-3 max-h-80 overflow-y-auto">
                                {alerts.map((alert) => {
                                    let AlertIcon = Activity;
                                    let iconColor = 'text-primary';

                                    if (alert.type === 'deck') {
                                        AlertIcon = FileText;
                                        iconColor = 'text-primary';
                                    } else if (alert.type === 'milestone') {
                                        AlertIcon = Activity;
                                        iconColor = 'text-blue-500';
                                    } else if (alert.type === 'match') {
                                        AlertIcon = Target;
                                        iconColor = 'text-green-500';
                                    } else if (alert.type === 'update') {
                                        AlertIcon = AlertCircle;
                                        iconColor = 'text-purple-500';
                                    }

                                    return (
                                        <div
                                            key={alert.id}
                                            className="p-3 rounded-lg bg-muted/50 border border-border hover:border-primary/30 transition-all group cursor-pointer"
                                        >
                                            <div className="flex gap-3">
                                                <AlertIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${iconColor}`} />
                                                <div className="flex-1">
                                                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                                        {alert.text}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-2">{alert.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>

                        {/* Deck Requests Summary */}
                        <Card className="bg-primary/5 border-primary/30 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FileIcon className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-bold text-foreground">Requested Decks</h3>
                            </div>
                            <p className="text-3xl font-bold text-primary mb-2">
                                {requestedDecks.length}
                            </p>
                            <p className="text-sm text-muted-foreground">
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
