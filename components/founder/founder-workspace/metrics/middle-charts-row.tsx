import React from 'react';
import { ChevronDown, ArrowUpRight } from 'lucide-react';
import {
    SiX,
    SiTelegram,
    SiInstagram,
    SiFacebook,
    SiGoogle,
    SiTiktok,
    SiYoutube
} from '@icons-pack/react-simple-icons'; // Assuming an icon pack, fallback to text if not installed, but let's use standard Lucide or simple SVG for safety. 

// Simple SVG Icons block to replace missing simple-icons
const Icons = {
    x: () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M4 4l16 16m0-16L4 20" /></svg>,
    telegram: () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>,
    instagram: () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
    facebook: () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>,
    google: () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4h4a4 4 0 0 0-4-8"></path></svg>,
    tiktok: () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>,
    youtube: () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.13 1 12 1 12s0 3.87.46 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.87 23 12 23 12s0-3.87-.46-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>
};

const SegmentedColumn = ({ segments, icon: PlatformIcon }: { segments: number, icon: any }) => (
    <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col-reverse justify-start gap-1 h-[140px]">
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className={`w-10 rounded-[4px] transition-all duration-300 ${i < segments ? 'bg-[#102c1e]' : 'bg-[#102c1e]/5'}`}
                    style={{
                        height: '20px',
                        opacity: i < segments ? 1 - (i * 0.15) : 1
                    }}
                />
            ))}
        </div>
        <div className="text-slate-400 mt-2">
            <PlatformIcon />
        </div>
    </div>
);

const TrafficSourcesChart = () => {
    return (
        <div className="bg-white rounded-3xl border border-[#102c1e]/10 p-6 shadow-sm col-span-1 md:col-span-4 h-full flex flex-col hover:border-[#102c1e]/20 transition-all">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-geist font-bold text-[#102c1e] text-sm flex items-center gap-2">
                        <Icons.facebook />
                        Kênh Thu hút (Acquisition)
                    </h3>
                    <p className="font-geist text-xs text-slate-400 mt-1">Các nguồn đem lại nhiều User/Nhân tài nhất</p>
                </div>
            </div>

            <div className="mb-6">
                <div className="flex items-end gap-3">
                    <span className="font-mono font-black text-4xl text-[#102c1e] tracking-tighter">149K</span>
                    <div className="flex items-center gap-1 font-geist font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#a1e2b6]/20 text-[#102c1e] mb-1.5">
                        <ArrowUpRight size={12} strokeWidth={3} />
                        12%
                    </div>
                </div>
                <p className="font-geist text-xs text-slate-400 mt-1">Lượt Traffic truy cập tháng trước</p>
            </div>

            <div className="flex justify-between items-end mt-auto px-2">
                <SegmentedColumn segments={2} icon={Icons.x} />
                <SegmentedColumn segments={3} icon={Icons.telegram} />
                <SegmentedColumn segments={5} icon={Icons.instagram} />
                <SegmentedColumn segments={6} icon={Icons.facebook} />
                <SegmentedColumn segments={4} icon={Icons.google} />
                <SegmentedColumn segments={3} icon={Icons.tiktok} />
                <SegmentedColumn segments={2} icon={Icons.youtube} />
            </div>
        </div>
    );
};

const SalesTrendsChart = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Abstract heights modeling the reference image
    const data = [
        { d: 50, w: 20 }, { d: 60, w: 25 }, { d: 45, w: 20 }, { d: 55, w: 30 },
        { d: 60, w: 25 }, { d: 55, w: 20 }, { d: 80, w: 25, active: true }, { d: 40, w: 15 },
        { d: 35, w: 10 }, { d: 70, w: 25 }, { d: 55, w: 25 }, { d: 75, w: 15 }
    ];

    return (
        <div className="bg-white rounded-3xl border border-[#102c1e]/10 p-6 shadow-sm col-span-1 md:col-span-8 flex flex-col hover:border-[#102c1e]/20 transition-all">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="font-geist font-bold text-[#102c1e] text-sm flex items-center gap-2">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                        Xu hướng Tăng trưởng (Growth)
                    </h3>
                    <p className="font-geist text-xs text-slate-400 mt-1">Biểu đồ đánh giá tốc độ phát triển người dùng hàng tháng</p>
                </div>
                <button className="flex items-center gap-2 border border-[#102c1e]/10 px-3 py-1.5 rounded-xl text-xs font-geist font-bold text-[#102c1e] hover:bg-[#102c1e]/5">
                    Tháng trước <ChevronDown size={14} />
                </button>
            </div>

            <div className="flex flex-1 items-end relative h-[250px]">
                {/* Y-axis Labels */}
                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs font-mono text-slate-400">
                    <span>10k</span>
                    <span>8k</span>
                    <span>6k</span>
                    <span>4k</span>
                    <span>2k</span>
                    <span>0</span>
                </div>

                {/* Chart Area */}
                <div className="flex justify-between items-end ml-10 w-full mb-[1.75rem] h-full relative">
                    {/* Horizontal Grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                        {[0, 1, 2, 3, 4, 5].map(i => <div key={i} className="border-b border-[#102c1e] border-dashed w-full h-[1px]"></div>)}
                    </div>

                    {data.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-2 z-10 group relative">
                            {/* Hover Tooltip (Shown specifically for active Jul) */}
                            {item.active && (
                                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white border border-[#102c1e]/10 shadow-lg rounded-xl p-3 z-20 w-max pointer-events-none">
                                    <div className="flex gap-4 items-center justify-between mb-1">
                                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-sm bg-[#a1e2b6]"></div><span className="text-xs font-geist text-slate-500">Users Tiềm năng</span></div>
                                        <span className="font-mono text-xs font-bold text-[#102c1e]">2,345</span>
                                    </div>
                                    <div className="flex gap-4 items-center justify-between">
                                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-sm bg-[#102c1e]"></div><span className="text-xs font-geist text-slate-500">Users Trả phí</span></div>
                                        <span className="font-mono text-xs font-bold text-[#102c1e]">9,323</span>
                                    </div>
                                </div>
                            )}

                            {/* Stacked Bar */}
                            <div className="flex flex-col-reverse items-center justify-start w-10 md:w-12 transition-transform duration-300 group-hover:-translate-y-1 cursor-pointer">
                                <div
                                    className={`w-8 md:w-10 rounded-b-[6px] rounded-t-sm transition-all duration-300 ${item.active ? 'bg-[#102c1e]' : 'bg-[#102c1e]/10'}`}
                                    style={{ height: `${item.d * 2}px` }}
                                />
                                <div
                                    className={`w-8 md:w-10 rounded-t-[6px] rounded-b-sm mb-1 transition-all duration-300 ${item.active ? 'bg-[#a1e2b6]' : 'bg-[#a1e2b6]/30'}`}
                                    style={{ height: `${item.w * 2}px` }}
                                />
                            </div>
                            <span className={`text-[11px] font-geist absolute -bottom-7 ${item.active ? 'text-[#102c1e] font-black' : 'text-slate-400 font-medium'}`}>{months[idx]}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export function MiddleChartsRow() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 w-full mb-6">
            <TrafficSourcesChart />
            <SalesTrendsChart />
        </div>
    );
}