import { Clock, CheckCircle2, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const UpcomingEvents = () => (
    <section className="space-y-6">
        <h2 className="text-2xl font-medium tracking-tight text-kizuna-text-main">Sự kiện Sắp tới</h2>
        <div className="bg-kizuna-canvas rounded-3xl p-6 shadow-sm border border-kizuna-border space-y-6">
            <div className="flex gap-4">
                <div className="flex flex-col items-center min-w-[3rem]">
                    <span className="text-xs text-kizuna-text-muted font-semibold uppercase tracking-wider">Th 10</span>
                    <span className="text-2xl font-light text-kizuna-text-main">24</span>
                </div>
                <div className="flex-1 bg-kizuna-surface p-4 rounded-2xl border border-kizuna-border space-y-3">
                    <div className="flex justify-between items-start gap-4">
                        <h4 className="font-medium text-sm text-kizuna-text-main leading-tight">1:1 Call với Elena Rodriguez</h4>
                        <span className="text-xs text-kizuna-text-muted flex items-center gap-1 shrink-0"><Clock size={12} /> 10:00 Sáng</span>
                    </div>
                    <div className="bg-kizuna-canvas p-3 rounded-xl border border-kizuna-border shadow-sm">
                        <p className="text-xs font-semibold text-kizuna-text-muted mb-2">Chuẩn bị trước cuộc họp:</p>
                        <div className="flex items-center gap-2 text-xs text-kizuna-text-muted hover:text-kizuna-text-main transition-colors cursor-pointer">
                            <CheckCircle2 size={14} className="text-kizuna-primary shrink-0" />
                            <span className="underline decoration-kizuna-border underline-offset-2">Tài liệu đính kèm: AI Pitch Deck v2.1</span>
                        </div>
                    </div>
                    <Button className="w-full flex items-center justify-center gap-2 bg-kizuna-primary text-white rounded-xl h-9 text-xs shadow-sm hover:opacity-90 transition-all">
                        <Video className="w-3.5 h-3.5" />
                        Tham gia cuộc gọi
                    </Button>
                </div>
            </div>
        </div>
    </section>
);