"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Briefcase, Star, Radar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { INDUSTRIES } from './investor-dashboard/data';

interface SidebarProps {
    // Đã bỏ activeMenu vì giờ Sidebar tự đọc URL để biết đang ở tab nào
    activeIndustry: string;
    setActiveIndustry: (id: string) => void;
}

export const InvestorSidebar = ({ activeIndustry, setActiveIndustry }: SidebarProps) => {
    const pathname = usePathname();

    // Tự động lấy ngôn ngữ (locale) từ đường dẫn hiện tại
    const locale = pathname.split('/')[1] || 'en';
    const basePath = `/${locale}/investor`;

    // Cấu hình Link thực tế cho từng tab
    const menuItems = [
        { id: 'deal-flow', icon: LayoutDashboard, label: 'Deal Flow CRM', href: `${basePath}/deal-flow` },
        { id: 'portfolio', icon: Briefcase, label: 'Portfolio Command', href: `${basePath}/portfolio` },
        { id: 'sourcing', icon: Radar, label: 'AI Sourcing Radar', href: `${basePath}/sourcing` },
        { id: 'saved', icon: Star, label: 'Đã lưu', href: `${basePath}/saved` },
    ];

    return (
        <aside className="w-[280px] h-full shrink-0 border-r border-zinc-200/60 bg-white flex flex-col p-6 overflow-y-auto hidden md:flex [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#102c1e] to-[#16452a] rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-white font-black text-xl">K</span>
                </div>
                <span className="text-xl font-black text-zinc-900 tracking-tight">Kizuna<span className="text-zinc-400">Hub</span></span>
            </div>

            <div className="space-y-8 flex-1">
                {/* Menu Điều Hướng (ĐÃ ĐỔI SANG THẺ LINK ĐỂ NAVIGATE) */}
                <div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 px-2">Menu</p>
                    <nav className="space-y-1">
                        {menuItems.map((item) => {
                            // Tự động kiểm tra xem URL hiện tại có chứa href của tab này không
                            const isActive = pathname.includes(item.href);

                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all relative group",
                                        isActive
                                            ? "bg-zinc-100 text-[#102c1e]"
                                            : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                                    )}
                                >
                                    <item.icon className={cn("w-5 h-5", isActive ? "text-[#102c1e]" : "text-zinc-400 group-hover:text-zinc-600")} />
                                    {item.label}
                                    {isActive && (
                                        <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#102c1e] shadow-[0_0_8px_#102c1e]" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* AI Radar Filters (Giữ nguyên giao diện của mày) */}
                <div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 px-2">AI Radar Filters</p>
                    <div className="px-2 space-y-7">
                        <div>
                            <div className="flex flex-wrap gap-2">
                                {INDUSTRIES.map(i => (
                                    <button
                                        key={i} onClick={() => setActiveIndustry(i)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border",
                                            activeIndustry === i
                                                ? "bg-[#102c1e] border-[#102c1e] text-white shadow-md"
                                                : "bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-300"
                                        )}
                                    >
                                        {i}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Slider Mức gọi vốn */}
                        <div className="group">
                            <label className="text-[10px] font-bold text-zinc-500 mb-3 flex justify-between items-center">
                                Mức gọi vốn (Ask)
                                <span className="text-[#102c1e] font-black bg-zinc-100 px-2 py-0.5 rounded-md border border-zinc-200 transition-colors group-hover:border-[#102c1e]/30">
                                    &gt; 100M
                                </span>
                            </label>
                            <input type="range" className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#102c1e] hover:accent-[#16452a] transition-all" />
                        </div>

                        {/* Slider Độ khớp AI */}
                        <div className="group">
                            <label className="text-[10px] font-bold text-zinc-500 mb-3 flex justify-between items-center">
                                Độ khớp AI (Match)
                                <span className="text-[#102c1e] font-black bg-zinc-100 px-2 py-0.5 rounded-md border border-zinc-200 transition-colors group-hover:border-[#102c1e]/30">
                                    90%
                                </span>
                            </label>
                            <input type="range" className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#102c1e] hover:accent-[#16452a] transition-all" />
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};