import { Crown, BadgeCheck } from 'lucide-react';
import { fundingLeaderboard } from '../../../app/[locale]/mentor/dashboard/mock-data';

export const FundingLeaderboard = () => {
    return (
        <div className="bg-[#ffffff] border border-[#e4e4e7] rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-lg font-black text-[#18181b] tracking-tighter flex items-center gap-2">
                        <Crown className="w-5 h-5 text-amber-500" /> Bảng Vàng Gọi Vốn
                    </h2>
                    <p className="text-xs font-bold text-[#71717a] mt-1">Top 3 dự án sinh viên nhận tài trợ cao nhất tuần qua.</p>
                </div>
            </div>

            <div className="space-y-6">
                {fundingLeaderboard.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-4">
                        <div className="text-xl font-black text-[#e4e4e7] w-6">{index + 1}</div>

                        <div className="w-48">
                            <h4 className="text-sm font-black text-[#18181b]">{item.name}</h4>
                            <p className="text-[10px] font-bold text-[#71717a] uppercase tracking-widest">{item.sector}</p>
                        </div>

                        <div className="flex-1 flex items-center gap-3">
                            <div className="w-full h-3 bg-[#fafafa] rounded-full overflow-hidden border border-[#e4e4e7]">
                                <div
                                    className="h-full bg-gradient-to-r from-[#16452a] to-emerald-500 rounded-full"
                                    style={{ width: `${(item.funding / item.max) * 100}%` }}
                                />
                            </div>
                            <span className="text-xs font-black text-[#16452a] w-16 whitespace-nowrap">{item.funding} Tr</span>
                        </div>

                        <div className="flex items-center gap-2 bg-[#fafafa] border border-[#e4e4e7] px-3 py-1.5 rounded-xl min-w-[160px]">
                            <img src={item.investorAvatar} alt={item.investor} className="w-6 h-6 rounded-full border border-[#e4e4e7]" />
                            <div>
                                <p className="text-[9px] font-bold text-[#71717a] uppercase tracking-widest flex items-center gap-1">
                                    Lead Investor <BadgeCheck className="w-3 h-3 text-[#16452a]" />
                                </p>
                                <p className="text-xs font-black text-[#18181b]">{item.investor}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};