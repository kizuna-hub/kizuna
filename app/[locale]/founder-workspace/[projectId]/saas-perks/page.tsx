"use client";

import React, { useState } from 'react';
import { PerksHeader } from '@/components/founder-workspace/saas-perks/perks-header';
import { FilterBar } from '@/components/founder-workspace/saas-perks/filter-bar';
import { PerkCard } from '@/components/founder-workspace/saas-perks/perk-card';
import { SidebarWidgets } from '@/components/founder-workspace/saas-perks/sidebar-widgets';

const perks = [
    { id: 1, provider: 'AWS Activate', logo: 'AWS', category: 'infrastructure', title: 'Credit $10.000 (2 năm)', description: 'Hỗ trợ hạ tầng chuyên dụng cho startup.', badge: 'Chỉ dự án có MVP', claimed: false },
    { id: 2, provider: 'Stripe', logo: 'STR', category: 'infrastructure', title: 'Miễn phí $50.000 đầu', description: 'Xử lý thanh toán không mất phí giao dịch.', badge: 'Chỉ doanh nghiệp', claimed: true },
    { id: 3, provider: 'Notion', logo: 'NOT', category: 'productivity', title: 'Miễn phí 6 tháng Plus', description: 'Không gian cộng tác không giới hạn.', badge: 'Tất cả thành viên', claimed: false },
    { id: 4, provider: 'HubSpot', logo: 'HUB', category: 'marketing', title: 'Giảm 30% năm đầu', description: 'Bộ công cụ CRM và Marketing chuyên sâu.', badge: 'Tất cả thành viên', claimed: false },
    { id: 5, provider: 'OpenAI', logo: 'OAI', category: 'ai-tools', title: 'Credit API $2.500', description: 'Mở rộng tính năng AI với GPT-4 trợ giá.', badge: 'Xác thực IP Ledger', claimed: false },
    { id: 6, provider: 'Clerky', logo: 'CLK', category: 'legal', title: 'Miễn phí Xét duyệt Hồ sơ', description: 'Xem xét tài liệu bởi luật sư startup hàng đầu.', badge: 'Startup Mỹ', claimed: false }
];

export default function SaaSPerksPage() {
    const [activeFilter, setActiveFilter] = useState('all');

    const filteredPerks = activeFilter === 'all'
        ? perks
        : perks.filter(p => p.category === activeFilter);

    return (
        <div className="max-w-6xl mx-auto pt-10 px-4 md:px-8 pb-16 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Cột trái: Nội dung chính */}
                <div className="lg:col-span-8">
                    <PerksHeader />
                    <FilterBar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        {filteredPerks.map((perk) => (
                            <PerkCard key={perk.id} perk={perk} />
                        ))}
                        {filteredPerks.length === 0 && (
                            <div className="md:col-span-2 p-10 text-center text-kizuna-text-muted text-xs border-2 border-dashed border-kizuna-border rounded-xl bg-white">
                                Không tìm thấy ưu đãi nào trong danh mục này.
                            </div>
                        )}
                    </div>
                </div>

                {/* Cột phải: Sidebar Widgets */}
                <div className="lg:col-span-4">
                    <SidebarWidgets />
                </div>
            </div>
        </div>
    );
}