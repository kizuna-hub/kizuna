import { Filter } from 'lucide-react';

export const VentureHeader = () => (
    <div className="space-y-4 flex-1">
        <h1 className="text-4xl font-light tracking-tight text-kizuna-text-main">
            Venture Connect
        </h1>
        <p className="text-kizuna-text-muted text-lg">
            Mở rộng mạng lưới. Chốt deal chiến lược. Khai phá tiềm năng khởi nghiệp.
        </p>

        {/* AI Matching Tuner */}
        <div className="flex items-center gap-3 mt-6 p-2 bg-kizuna-canvas/70 backdrop-blur-md rounded-2xl shadow-sm border border-kizuna-border w-fit">
            <span className="pl-3 text-kizuna-text-muted"><Filter size={18} /></span>
            <select className="bg-transparent border-none focus:ring-0 text-sm font-medium text-kizuna-text-main w-full cursor-pointer outline-none py-2 pr-4">
                <option>Mục tiêu: Cần tìm Co-founder kỹ thuật</option>
                <option>Mục tiêu: Cần gọi vốn Seed</option>
                <option>Mục tiêu: Cần Mentor chính sách (NQ54)</option>
            </select>
        </div>
    </div>
);