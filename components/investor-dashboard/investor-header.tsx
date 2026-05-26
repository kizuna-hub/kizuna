import { Search, Settings, Target, LayoutDashboard, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InvestorHeaderProps {
    viewMode: 'board' | 'list';
    setViewMode: (mode: 'board' | 'list') => void;
}

export const InvestorHeader = ({ viewMode, setViewMode }: InvestorHeaderProps) => (
    <header className="relative z-10 border-b border-kizuna-border bg-white sticky top-0 shadow-sm">
        <div className="px-8 py-4 flex items-center justify-between max-w-[1600px] mx-auto">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#16452a] rounded-lg flex items-center justify-center shadow-sm">
                    <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-kizuna-text-main tracking-tight">Kizuna Hub</h1>
                    <p className="text-kizuna-text-muted text-xs font-medium uppercase tracking-widest">VC Deal Flow Room</p>
                </div>
            </div>

            {/* View Toggles & Search */}
            <div className="flex items-center gap-4 w-full max-w-xl justify-end">
                {/* View Mode Toggle */}
                <div className="flex bg-zinc-100 p-1 rounded-lg border border-kizuna-border/50">
                    <button
                        onClick={() => setViewMode('board')}
                        className={`p-1.5 rounded-md flex items-center gap-2 text-xs font-bold uppercase transition-all ${viewMode === 'board' ? 'bg-white shadow-sm text-kizuna-primary' : 'text-kizuna-text-muted hover:text-kizuna-text-main'}`}
                    >
                        <LayoutDashboard className="w-4 h-4" /> Board
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded-md flex items-center gap-2 text-xs font-bold uppercase transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-kizuna-primary' : 'text-kizuna-text-muted hover:text-kizuna-text-main'}`}
                    >
                        <List className="w-4 h-4" /> List
                    </button>
                </div>

                <div className="h-6 w-px bg-kizuna-border hidden md:block"></div>

                <div className="relative w-64">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-kizuna-text-muted" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm startup, lĩnh vực..."
                        className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-kizuna-border rounded-lg text-sm focus:border-[#16452a] transition-all shadow-sm"
                    />
                </div>
                <Button variant="outline" className="border-kizuna-border font-bold flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Quản lý</span>
                </Button>
            </div>
        </div>
    </header>
);