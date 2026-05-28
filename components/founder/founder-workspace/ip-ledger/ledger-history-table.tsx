import { Search, FileText, FileArchive, Copy, Check, Eye, MoreHorizontal } from 'lucide-react';

export const LedgerHistoryTable = ({ handleCopy, copiedHash }: { handleCopy: (h: string) => void, copiedHash: string | null }) => (
    <section className="mt-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
            <div>
                <h2 className="text-xl font-semibold text-zinc-900 mb-1">Lịch sử Tài sản đã Bảo mật</h2>
                <div className="relative mt-3">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm trong sổ cái..."
                        className="pl-9 pr-4 py-2 border border-zinc-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#16452a] w-64 text-zinc-900"
                    />
                </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-600 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-full shadow-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Đã đồng bộ thời gian thực
            </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-50 border-b border-zinc-200">
                            <th className="px-6 py-4 text-sm font-medium text-zinc-500">Tên Tài sản</th>
                            <th className="px-6 py-4 text-sm font-medium text-zinc-500">Mã băm mã hóa</th>
                            <th className="px-6 py-4 text-sm font-medium text-zinc-500">Dấu thời gian</th>
                            <th className="px-6 py-4 text-sm font-medium text-zinc-500 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                        {/* Hàng mẫu - Bạn có thể map data từ SpacetimeDB ở đây */}
                        <tr className="hover:bg-zinc-50/50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-zinc-400" />
                                    <span className="font-medium text-zinc-900 text-sm">Kizuna_PitchDeck_v2.pdf</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2 group cursor-pointer" onClick={() => handleCopy('0x4b2c...9f1a')}>
                                    <span className="font-mono text-xs text-zinc-600 bg-zinc-100 px-2 py-1 rounded border border-zinc-200">0x4b2c...9f1a</span>
                                    <div className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {copiedHash === '0x4b2c...9f1a' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-zinc-500">Apr 28, 2026, 09:12:54 PM</td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button className="inline-flex items-center gap-2 border border-zinc-200 bg-white text-zinc-900 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-zinc-50 shadow-sm">
                                        <Eye className="w-4 h-4 text-zinc-500" /> Xem Chứng chỉ
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="bg-zinc-50 border-t border-zinc-200 px-6 py-3 flex items-center justify-between">
                <span className="text-sm text-zinc-500">Đang hiển thị 2 tài sản đã bảo mật</span>
            </div>
        </div>
    </section>
);