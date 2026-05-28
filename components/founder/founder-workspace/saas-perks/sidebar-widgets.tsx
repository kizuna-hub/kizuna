import { Headset } from 'lucide-react';

export const SidebarWidgets = () => (
    <div className="flex flex-col gap-5 sticky top-10">
        {/* Value Vault */}
        <div className="bg-white border border-kizuna-border rounded-xl p-5 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-kizuna-surface rounded-full blur-2xl opacity-50"></div>
            <h2 className="text-sm font-bold text-kizuna-text-main uppercase tracking-wider">Kho Giá trị</h2>
            <p className="text-2xl font-black text-kizuna-primary mt-1 tracking-tighter">$12,500</p>
            <p className="text-[10px] text-kizuna-text-muted mt-1 font-medium">Giá trị đã nhận từ các đối tác</p>
            <div className="w-full bg-zinc-100 rounded-full h-1.5 mt-3 overflow-hidden border border-zinc-200/50">
                <div className="bg-kizuna-primary h-full rounded-full transition-all duration-1000" style={{ width: '5%' }}></div>
            </div>
        </div>

        {/* Concierge */}
        <div className="bg-kizuna-surface border border-kizuna-border rounded-xl p-5">
            <Headset className="w-5 h-5 text-kizuna-primary" />
            <h3 className="text-[13px] font-bold text-kizuna-text-main mt-3">Cần hỗ trợ nhận ưu đãi?</h3>
            <p className="text-[11px] text-kizuna-text-muted mt-2 leading-relaxed">
                Bạn gặp khó khăn khi xác thực với AWS hoặc Stripe? Nhóm <strong>Partner Success</strong> sẽ giúp đẩy nhanh quy trình này.
            </p>
            <button className="w-full mt-4 px-3 py-2 rounded-lg text-[11px] font-bold border border-kizuna-border bg-white text-kizuna-text-main hover:bg-zinc-50 transition-all">
                Liên hệ Hỗ trợ
            </button>
        </div>

        {/* Offer a Perk */}
        <div className="border-2 border-dashed border-zinc-200 rounded-xl p-5 bg-transparent text-center group hover:border-kizuna-primary/30 transition-colors">
            <p className="text-[10px] text-kizuna-text-muted mb-2 font-medium">
                Bạn là nhà cung cấp giải pháp SaaS? Hãy đồng hành cùng sinh viên.
            </p>
            <button className="text-[11px] font-bold text-kizuna-primary hover:underline">
                Gửi Đề xuất Hợp tác
            </button>
        </div>
    </div>
);