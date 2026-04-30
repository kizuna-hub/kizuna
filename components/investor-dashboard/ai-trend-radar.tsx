import { PieChart, Cpu, Flame, Database } from 'lucide-react';

export const AITrendRadar = () => {
    return (
        <section className="bg-zinc-50 border border-kizuna-border rounded-3xl p-8 my-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-kizuna-primary rounded-xl flex items-center justify-center shadow-sm">
                    <PieChart className="w-5 h-5 text-white" />
                </div>
                <div>
                    {/* FIX: Đồng bộ text-lg font-black tracking-tighter */}
                    <h2 className="text-lg font-black text-kizuna-text-main tracking-tighter">AI Trend Radar</h2>
                    <p className="text-kizuna-text-muted text-[11px] font-black tracking-widest mt-0.5">Xu hướng công nghệ & Khởi nghiệp học đường (Q2/2026)</p>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-5 bg-white border border-kizuna-border rounded-2xl p-6 shadow-sm">
                    <h3 className="text-[10px] font-black text-kizuna-text-muted tracking-widest mb-4 flex items-center gap-2">
                        <Flame className="w-4 h-4 text-amber-500" /> Ngành nộp vào nhiều nhất
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm font-black text-kizuna-text-main mb-1">
                                <span>AI / DeepTech</span>
                                <span>45%</span>
                            </div>
                            <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '45%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm font-black text-kizuna-text-main mb-1">
                                <span>EdTech</span>
                                <span>20%</span>
                            </div>
                            <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '20%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm font-black text-kizuna-text-main mb-1">
                                <span>Web3 / Crypto</span>
                                <span>15%</span>
                            </div>
                            <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-300 rounded-full" style={{ width: '15%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-7 bg-white border border-kizuna-border rounded-2xl p-6 shadow-sm">
                    <h3 className="text-[10px] font-black text-kizuna-text-muted tracking-widest mb-4 flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-blue-500" /> Công nghệ ưu chuộng
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                            <Database className="w-8 h-8 text-[#16452a] mb-2" />
                            <span className="text-[11px] font-black text-kizuna-text-main tracking-tight">SpacetimeDB</span>
                            <span className="text-[9px] font-black text-emerald-600 tracking-widest mt-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Top 1 Backend</span>
                        </div>
                        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                            <svg className="w-8 h-8 text-black mb-2" viewBox="0 0 128 128" fill="currentColor"><path d="M64 128C99.3462 128 128 99.3462 128 64C128 28.6538 99.3462 0 64 0C28.6538 0 0 28.6538 0 64C0 99.3462 28.6538 128 64 128ZM44.1378 86.8795L30.1557 69.3082V40.2315H36.3159V65.6264L50.4137 83.3323L44.1378 86.8795ZM85.5776 40.2315V88.8899H79.4174V45.2447L43.8341 88.8899H36.386L79.4174 36.1417H85.5776V40.2315Z"></path></svg>
                            <span className="text-[11px] font-black text-kizuna-text-main tracking-tight">Next.js App</span>
                            <span className="text-[9px] font-black text-emerald-600 tracking-widest mt-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Khuyên dùng</span>
                        </div>
                        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                            <span className="text-3xl mb-2">✨</span>
                            <span className="text-[11px] font-black text-kizuna-text-main tracking-tight">Gemini Pro</span>
                            <span className="text-[9px] font-black text-emerald-600 tracking-widest mt-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Tích hợp AI</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};