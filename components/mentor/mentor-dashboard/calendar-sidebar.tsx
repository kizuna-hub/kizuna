import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CalendarSidebar = () => (
    <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
        <h2 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2 mb-6">
            <Calendar className="w-4 h-4 text-[#004D40]" /> Lịch hẹn sắp tới
        </h2>
        <div className="flex flex-col items-center justify-center py-12 text-center bg-[#F8F9FA] rounded-2xl border border-dashed border-zinc-200">
            <div className="text-5xl mb-4 opacity-20 grayscale">📅</div>
            <p className="text-xs font-bold text-zinc-500 tracking-wide leading-relaxed">
                Bạn chưa có lịch hẹn nào <br /> cho ngày hôm nay.
            </p>
            <Button variant="link" className="text-[#00BFA5] hover:text-[#004D40] text-xs font-black uppercase mt-2">
                Đồng bộ Google Calendar
            </Button>
        </div>
    </div>
);