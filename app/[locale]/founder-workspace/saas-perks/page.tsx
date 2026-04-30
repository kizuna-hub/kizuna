'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { LayoutGrid, Server, Zap, Megaphone, Scale, BrainCircuit, CheckCircle2, Headset } from 'lucide-react';

const categories = [
    { id: 'all', label: 'Tất cả', icon: LayoutGrid },
    { id: 'infrastructure', label: 'Hạ tầng', icon: Server },
    { id: 'productivity', label: 'Tính hiệu quả', icon: Zap },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
    { id: 'legal', label: 'Pháp lý', icon: Scale },
    { id: 'ai-tools', label: 'Công cụ AI', icon: BrainCircuit },
];

const perks = [
    {
        id: 1,
        provider: 'AWS Activate',
        logo: 'AWS',
        category: 'infrastructure',
        title: 'Credit $10.000 trong 2 năm',
        description: 'Hỗ trợ startup chuyên dụng và hướng dẫn cấu trúc hạ tầng.',
        badge: 'Chỉ dự án có MVP',
        claimed: false,
    },
    {
        id: 2,
        provider: 'Stripe',
        logo: 'STR',
        category: 'infrastructure',
        title: 'Miễn phí giao dịch cho $50.000 đầu tiên',
        description: 'Xử lý 50.000 USD thanh toán đầu tiên mà không mất phí giao dịch từ Stripe.',
        badge: 'Chỉ công ty đã thành lập',
        claimed: true,
    },
    {
        id: 3,
        provider: 'Notion',
        logo: 'NOT',
        category: 'productivity',
        title: 'Miễn phí 6 tháng (Gói Plus)',
        description: 'Không gian làm việc cộng tác không giới hạn cho toàn bộ đội ngũ startup.',
        badge: 'Tất cả thành viên',
        claimed: false,
    },
    {
        id: 4,
        provider: 'HubSpot',
        logo: 'HUB',
        category: 'marketing',
        title: 'Giảm 30% cho Năm đầu tiên',
        description: 'Truy cập bộ công cụ CRM và marketing tĩnh với mức chiết khấu khủng.',
        badge: 'Tất cả thành viên',
        claimed: false,
    },
    {
        id: 5,
        provider: 'OpenAI',
        logo: 'OAI',
        category: 'ai-tools',
        title: 'Credit API trị giá $2.500',
        description: 'Mở rộng tính năng hệ thống AI với quyền sử dụng API GPT-4 được trợ giá.',
        badge: 'Đã xác thực IP Ledger',
        claimed: false,
    },
    {
        id: 6,
        provider: 'Clerky',
        logo: 'CLK',
        category: 'legal',
        title: 'Miễn phí Xét duyệt Hồ sơ thành lập',
        description: 'Được đội ngũ luật sư startup hàng đầu xem xét tài liệu sau khi thành lập.',
        badge: 'Doanh nghiệp tại Mỹ',
        claimed: false,
    }
];

export default function SaaSPerksPage() {
    const [activeFilter, setActiveFilter] = useState('all');

    const filteredPerks = activeFilter === 'all'
        ? perks
        : perks.filter(p => p.category === activeFilter);

    return (
        <div className="px-8 py-8 max-w-7xl mx-auto space-y-8">

            {/* 1. Top Section: Header */}
            <div>
                <h1 className="text-2xl font-bold text-kizuna-text-main">
                    SaaS Perks & Ưu đãi
                </h1>
                <p className="text-sm text-kizuna-text-muted mt-1">
                    Mở khóa các khoản giảm giá và credit độc quyền dành cho việc phát triển không gian hạ tầng của startup.
                </p>
            </div>

            {/* Main Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Column: Content */}
                <div className="lg:col-span-8 space-y-6">

                    {/* 2. Filter Bar (Category Pills) */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map((category) => {
                            const Icon = category.icon;
                            const isActive = activeFilter === category.id;
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveFilter(category.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${isActive
                                            ? 'bg-kizuna-primary text-white'
                                            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {category.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* 3. The Perk Rows (2-Column Brand Grid) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredPerks.map((perk) => (
                            <div key={perk.id} className="bg-white border border-kizuna-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">

                                {/* Card Layout (Top) */}
                                <div className="flex items-start justify-between">
                                    <div className="w-12 h-12 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center justify-center font-bold text-zinc-400 text-sm">
                                        {perk.logo}
                                    </div>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-600 uppercase tracking-wider border border-zinc-200">
                                        {perk.badge}
                                    </span>
                                </div>

                                {/* Card Layout (Middle) */}
                                <div className="flex-1 mt-4">
                                    <h3 className="text-lg font-semibold text-kizuna-text-main">
                                        {perk.provider}
                                    </h3>
                                    <p className="text-2xl font-bold text-kizuna-primary mt-1">
                                        {perk.title}
                                    </p>
                                    <p className="text-sm text-kizuna-text-muted mt-2 mb-6">
                                        {perk.description}
                                    </p>
                                </div>

                                {/* Card Layout (Bottom) */}
                                <div>
                                    {perk.claimed ? (
                                        <button className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-emerald-50 text-kizuna-primary cursor-default">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Đã nhận ưu đãi
                                        </button>
                                    ) : (
                                        <button className="w-full rounded-lg px-4 py-2 text-sm font-medium bg-kizuna-primary text-white">
                                            Nhận ưu đãi này
                                        </button>
                                    )}
                                </div>

                            </div>
                        ))}
                        {filteredPerks.length === 0 && (
                            <div className="md:col-span-2 p-8 text-center text-kizuna-text-muted text-sm border-2 border-dashed border-kizuna-border rounded-2xl bg-white">
                                Không tìm thấy ưu đãi nào trong danh mục này.
                            </div>
                        )}
                    </div>

                </div>

                {/* Right Column: Sidebar Widgets */}
                <div className="lg:col-span-4 flex flex-col gap-6 sticky top-6">

                    {/* Widget 1: Your Value Vault */}
                    <div className="bg-white border border-kizuna-border rounded-2xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-kizuna-text-main">Kho Giá trị của Bạn</h2>
                        <p className="text-3xl font-bold text-kizuna-primary mt-2">$12,500</p>
                        <div className="flex justify-between items-center mt-1">
                            <p className="text-sm text-kizuna-text-muted">Giá trị đã nhận</p>
                            <p className="text-xs text-kizuna-text-muted">trong tổng mức tiềm năng hơn $250.000+</p>
                        </div>
                        {/* Visual Progress Bar */}
                        <div className="w-full bg-zinc-100 rounded-full h-2 mt-4 overflow-hidden">
                            <div className="bg-kizuna-primary h-full rounded-full" style={{ width: '5%' }}></div>
                        </div>
                    </div>

                    {/* Widget 2: Kizuna Concierge */}
                    <div className="bg-kizuna-surface border border-kizuna-border rounded-2xl p-6">
                        <Headset className="w-6 h-6 text-kizuna-primary" />
                        <h3 className="text-md font-semibold text-kizuna-text-main mt-3">Cần hỗ trợ nhận ưu đãi?</h3>
                        <p className="text-sm text-kizuna-text-muted mt-2">
                            Bạn đang gặp khó khăn trong việc xác thực startup của mình để nhận AWS hoặc Stripe? Nhóm Đối tác Thành công (Partner Success) của chúng tôi có thể giúp đẩy nhanh quy trình này.
                        </p>
                        <button className="w-full mt-4 px-4 py-2 rounded-lg text-sm font-medium border border-kizuna-border bg-white text-kizuna-text-main">
                            Liên hệ Hỗ trợ
                        </button>
                    </div>

                    {/* Widget 3: Offer a Perk */}
                    <div className="border-2 border-dashed border-zinc-300 rounded-2xl p-6 bg-transparent text-center">
                        <p className="text-sm text-kizuna-text-muted mb-3">
                            Bạn là nhà cung cấp các gói dịch vụ này? Hãy hợp tác với nền tảng Kizuna Hub.
                        </p>
                        <button className="text-sm font-medium text-kizuna-primary hover:underline">
                            Gửi Đề xuất Hợp tác
                        </button>
                    </div>

                </div>

            </div>

        </div>
    );
}
