export const InvestorMetricRibbon = () => (
    <div className="grid grid-cols-4 gap-4 mb-6">
        {[
            { label: 'Deals đang chạy', val: '24', color: 'text-kizuna-text-main' },
            { label: 'Tổng khối lượng gọi vốn', val: '$4.2M', color: 'text-kizuna-text-main' },
            { label: 'AI Khuyên dùng', val: '12', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Đã bảo mật IP', val: '8', color: 'text-kizuna-text-main' },
        ].map((m, i) => (
            <div key={i} className={`${m.bg || 'bg-white'} rounded-xl border border-kizuna-border p-4 shadow-sm`}>
                <span className={`text-[10px] font-black ${m.color.includes('emerald') ? 'text-emerald-700' : 'text-kizuna-text-muted'} uppercase tracking-widest`}>
                    {m.label}
                </span>
                <div className={`text-2xl font-black ${m.color} mt-1`}>{m.val}</div>
            </div>
        ))}
    </div>
);