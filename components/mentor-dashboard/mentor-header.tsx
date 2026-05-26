import { Bell, Sparkles, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const MentorHeader = () => (
    <header className="border-b border-zinc-200 bg-white sticky top-0 z-50 px-8 py-3">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-black text-zinc-900 tracking-tighter leading-tight">Kizuna Mentor</h1>
                    <p className="text-[10px] font-bold text-emerald-600 tracking-widest uppercase">Nurturing Excellence</p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* Nút màu vàng dịu (Amber-50) kết hợp chữ và viền Amber-600, trông rất VIP mà không bị chói */}
                <Button className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold text-xs px-5 h-10 rounded-xl transition-all flex items-center gap-2">
                    <Coins className="w-4 h-4" /> Trở thành Nhà đầu tư
                </Button>

                <div className="flex items-center gap-5 border-l border-zinc-200 pl-6">
                    <button className="relative text-zinc-400 hover:text-emerald-600 transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <div className="flex items-center gap-3 cursor-pointer group">
                        <div className="text-right">
                            <p className="text-sm font-black text-zinc-900 group-hover:text-emerald-600 transition-colors">TS. Lê Minh Trí</p>
                            <p className="text-[10px] font-bold text-zinc-500 tracking-wide uppercase">Phù thủy SpacetimeDB</p>
                        </div>
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=TriLe" className="w-10 h-10 rounded-full border border-zinc-200 bg-zinc-50" alt="Avatar" />
                    </div>
                </div>
            </div>
        </div>
    </header>
);