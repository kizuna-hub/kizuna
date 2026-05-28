import { Activity, ShieldCheck, Search, Link as LinkIcon } from 'lucide-react';

export const IPLedgerStream = () => {
    const activities = [
        { id: 1, type: 'hash', icon: Search, text: 'Dự án TrendEngine vừa mã hóa IP Pitch Deck.', time: 'Vài giây trước', isNew: true },
        { id: 2, type: 'contract', icon: LinkIcon, text: 'SmartContract giữa GreenLogistics & Investor X được ký.', time: '2 phút trước', isNew: false },
        { id: 3, type: 'verify', icon: ShieldCheck, text: 'Hồ sơ DUTCareers đạt chuẩn bảo mật 13/2023/NĐ-CP.', time: '15 phút trước', isNew: false },
        { id: 4, type: 'hash', icon: Search, text: 'Unburden mã hóa bản MVP Source Code lên SpacetimeDB.', time: '1 giờ trước', isNew: false },
    ];

    return (
        <div className="bg-[#ffffff] border border-[#e4e4e7] rounded-3xl p-8 shadow-sm h-full">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-black text-[#18181b] tracking-tighter flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#16452a]" /> IP Ledger Live Stream
                </h2>
                {/* Live Pulse Indicator */}
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16452a] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#16452a]"></span>
                    </span>
                    <span className="text-[10px] font-black text-[#16452a] tracking-widest uppercase">Live</span>
                </div>
            </div>

            <div className="relative">
                {/* Dòng kẻ dọc Timeline */}
                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-[#e4e4e7]" />

                <div className="space-y-6">
                    {activities.map((item) => (
                        <div key={item.id} className="relative flex items-start gap-4 group">
                            {/* Icon / Node */}
                            <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-transform group-hover:scale-110
                                ${item.isNew ? 'bg-[#ffffff] border-[#16452a] text-[#16452a] shadow-sm' : 'bg-[#fafafa] border-[#e4e4e7] text-[#71717a]'}`}>
                                <item.icon className="w-3.5 h-3.5" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 pt-1">
                                <p className={`text-xs font-bold leading-relaxed ${item.isNew ? 'text-[#18181b]' : 'text-[#71717a]'}`}>
                                    {item.text}
                                </p>
                                <p className="text-[10px] font-bold text-[#71717a]/70 mt-1 uppercase tracking-wider">
                                    {item.time}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button className="w-full mt-6 py-2.5 bg-[#fafafa] hover:bg-[#e4e4e7]/50 text-[10px] font-black text-[#18181b] uppercase tracking-widest rounded-xl transition-colors border border-[#e4e4e7]">
                Xem toàn bộ sổ cái
            </button>
        </div>
    );
};