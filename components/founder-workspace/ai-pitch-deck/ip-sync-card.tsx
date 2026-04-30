import { Fingerprint, Lock } from "lucide-react";

export const IPSyncCard = () => (
    <div className="mt-10 bg-white border border-kizuna-border rounded-2xl p-8 text-center flex flex-col items-center justify-center shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-kizuna-surface rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="w-16 h-16 bg-kizuna-surface rounded-full border border-kizuna-border flex items-center justify-center mb-4 shadow-inner relative z-10">
            <Fingerprint className="w-8 h-8 text-[#102c1e]" />
        </div>
        <h2 className="text-xl font-bold text-[#102c1e] mb-2 relative z-10">Bảo mật & Đồng bộ Ledger</h2>
        <p className="text-xs font-medium text-kizuna-text-muted max-w-md mb-6 relative z-10 leading-relaxed">
            Sau khi hồ sơ được chuẩn hóa, hãy đồng bộ vào IP Ledger để tạo mã băm sở hữu dữ liệu bất biến.
        </p>
        <button className="px-6 py-3 bg-[#102c1e] hover:bg-[#16452a] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-[0.98] relative z-10">
            <Lock className="w-4 h-4" /> Bảo mật & Đồng bộ ngay
        </button>
    </div>
);