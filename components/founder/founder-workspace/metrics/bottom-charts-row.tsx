import React from 'react';
import { ChevronDown, ArrowUpRight, Users, Globe2, Plus, Minus } from 'lucide-react';

const CustomerGrowthChart = () => {
    return (
        <div className="bg-white rounded-3xl border border-[#102c1e]/10 p-6 shadow-sm col-span-1 md:col-span-6 flex flex-col hover:border-[#102c1e]/20 transition-all">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="font-geist font-bold text-[#102c1e] text-sm flex items-center gap-2">
                        <Users size={16} />
                        Đường cong Tăng trưởng (Traction)
                    </h3>
                    <p className="font-geist text-xs text-slate-400 mt-1">Gia tốc mở rộng quy mô người dùng (Traction)</p>
                </div>
                <button className="flex items-center gap-2 border border-[#102c1e]/10 px-3 py-1.5 rounded-xl text-xs font-geist font-bold text-[#102c1e] hover:bg-[#102c1e]/5">
                    Theo tháng <ChevronDown size={14} />
                </button>
            </div>

            <div className="flex-1 w-full relative flex flex-col justify-end mt-4">
                {/* SVG Area Chart */}
                <div className="relative w-full h-[180px]">
                    <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="growthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#102c1e" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#102c1e" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        {/* Area */}
                        <path
                            d="M0,120 C40,115 60,110 80,105 C120,95 140,120 180,80 C200,60 220,10 240,40 C270,80 300,90 340,60 C370,40 380,30 400,20 L400,150 L0,150 Z"
                            fill="url(#growthGradient)"
                        />
                        {/* Line */}
                        <path
                            d="M0,120 C40,115 60,110 80,105 C120,95 140,120 180,80 C200,60 220,10 240,40 C270,80 300,90 340,60 C370,40 380,30 400,20"
                            fill="none"
                            stroke="#102c1e"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        />
                    </svg>

                    {/* Tooltip Target (Approx at x=240, y=40 area) */}
                    <div className="absolute left-[54%] top-[15%] flex flex-col items-center">
                        {/* Tooltip box */}
                        <div className="bg-white border border-[#102c1e]/10 shadow-lg rounded-2xl p-3 mb-2 translate-y-[-100%] translate-x-[20%] w-max">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#102c1e]"></div>
                                <span className="text-[10px] font-geist text-slate-500 uppercase tracking-widest">Tháng 4, 2025</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono font-black text-[#102c1e] text-lg">3,943</span>
                                <div className="flex items-center font-geist font-bold text-[10px] uppercase tracking-wider px-1.5 py-[1px] rounded bg-[#a1e2b6]/20 text-[#102c1e]">
                                    <ArrowUpRight size={10} strokeWidth={3} className="mr-0.5" />
                                    5%
                                </div>
                            </div>
                        </div>
                        {/* Vertical dashed line */}
                        <div className="h-[120px] w-px border-l border-[#102c1e]/30 border-dashed absolute top-0 -z-10"></div>
                        {/* Point dot */}
                        <div className="w-3 h-3 bg-white border-2 border-[#102c1e] rounded-full shadow-[0_0_0_4px_rgba(16,44,30,0.1)] absolute top-[-6px]"></div>
                    </div>
                </div>

                <div className="flex justify-between w-full text-xs font-mono text-slate-400 mt-2 px-2 border-t border-[#102c1e]/5 pt-4">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span className="font-black text-[#102c1e]">Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                </div>
            </div>
        </div>
    );
};

const CountryProgress = ({ label, code, percent }: { label: string, code: string, percent: number }) => (
    <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
                <span className="text-lg leading-none">{code}</span>
                <span className="font-geist font-bold text-sm text-[#102c1e]">{label}</span>
            </div>
            <span className="font-mono text-xs text-slate-500">{percent}%</span>
        </div>
        <div className="w-full bg-[#102c1e]/5 rounded-full h-2">
            <div className="bg-[#102c1e] h-2 rounded-full" style={{ width: `${percent}%` }}></div>
        </div>
    </div>
);

const RegionalSalesChart = () => {
    return (
        <div className="bg-white rounded-3xl border border-[#102c1e]/10 p-6 shadow-sm col-span-1 md:col-span-6 flex flex-col hover:border-[#102c1e]/20 transition-all">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-geist font-bold text-[#102c1e] text-sm flex items-center gap-2">
                        <Globe2 size={16} />
                        Phân bố Nhân lực (Demographics)
                    </h3>
                    <p className="font-geist text-xs text-slate-400 mt-1">Sự phân bổ địa lý của người dùng / nhân tài</p>
                </div>
                <button className="flex items-center gap-2 border border-[#102c1e]/10 px-3 py-1.5 rounded-xl text-xs font-geist font-bold text-[#102c1e] hover:bg-[#102c1e]/5">
                    Quốc gia <ChevronDown size={14} />
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 mt-2 h-full items-center">
                {/* Abstract Stylized Map Area */}
                <div className="flex-1 w-full relative bg-[#102c1e]/[0.02] rounded-2xl p-4 flex items-center justify-center min-h-[160px] overflow-hidden">
                    <div className="absolute top-2 left-2 flex flex-col gap-1 bg-white border border-[#102c1e]/10 rounded-lg p-1 shadow-sm">
                        <button className="p-1 hover:bg-[#102c1e]/5 rounded"><Plus size={14} className="text-slate-500" /></button>
                        <button className="p-1 hover:bg-[#102c1e]/5 rounded"><Minus size={14} className="text-slate-500" /></button>
                    </div>

                    {/* Simplified SVG Map Path representation */}
                    <svg viewBox="0 0 100 60" className="w-[120%] h-auto opacity-30 fill-[#102c1e]">
                        <path d="M10,15 Q15,10 20,15 T30,20 Q35,10 40,25 T50,30 Q45,40 30,45 T10,15 Z" />
                        <path d="M45,25 Q55,15 65,25 T80,20 Q85,15 90,30 T75,45 Q60,50 45,25 Z" className="opacity-40" />
                        <path d="M70,40 Q80,35 85,45 T75,55 Q65,50 70,40 Z" className="opacity-20" />
                        <path d="M20,35 Q25,30 30,40 T25,50 Q15,45 20,35 Z" className="opacity-20" />
                    </svg>

                    {/* Target Tooltip Pin */}
                    <div className="absolute top-1/3 left-1/3">
                        <div className="absolute w-12 h-12 bg-[#a1e2b6]/30 rounded-full animate-ping -left-5 -top-5"></div>
                        <div className="w-2 h-2 bg-[#102c1e] rounded-full shadow-[0_0_0_4px_rgba(16,44,30,0.2)]"></div>
                        <div className="absolute -top-14 -left-12 bg-white border border-[#102c1e]/10 shadow-lg rounded-xl p-2 w-[110px] flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#102c1e]/5 flex items-center justify-center text-[#102c1e] font-bold text-xs font-mono">20%</div>
                            <div className="flex flex-col">
                                <span className="font-geist text-[10px] font-bold">Nhật Bản</span>
                                <span className="font-mono text-[9px] text-slate-500">5,243 Users</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Country Progress List */}
                <div className="w-full lg:w-[40%] flex flex-col justify-center">
                    <CountryProgress label="Việt Nam" code="🇻🇳" percent={30} />
                    <CountryProgress label="Hoa Kỳ" code="🇺🇸" percent={26} />
                    <CountryProgress label="Singapore" code="🇸🇬" percent={24} />
                    <CountryProgress label="Nhật Bản" code="🇯🇵" percent={20} />
                </div>
            </div>
        </div>
    );
};

export function BottomChartsRow() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 w-full mb-10">
            <CustomerGrowthChart />
            <RegionalSalesChart />
        </div>
    );
}