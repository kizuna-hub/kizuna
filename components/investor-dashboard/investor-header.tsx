import { Search, Settings, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const InvestorHeader = () => (
    <header className="relative z-10 border-b border-kizuna-border bg-white sticky top-0 shadow-sm">
        <div className="px-8 py-4 flex items-center justify-between max-w-[1600px] mx-auto">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#16452a] rounded-lg flex items-center justify-center shadow-sm">
                    <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-kizuna-text-main tracking-tight">Kizuna Hub</h1>
                    <p className="text-kizuna-text-muted text-xs font-medium uppercase tracking-widest">VC Deal Flow Room</p>
                </div>
            </div>

            <div className="flex items-center gap-4 w-full max-w-md">
                <div className="relative flex-1">
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