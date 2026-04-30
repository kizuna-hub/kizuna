import { X, Target, Activity, TrendingUp, Briefcase, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DrawerProps {
    project: any | null;
    onClose: () => void;
}

export const ProjectDetailDrawer = ({ project, onClose }: DrawerProps) => {
    if (!project) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity animate-in fade-in"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed top-0 right-0 h-full w-[450px] bg-white shadow-2xl z-50 p-8 overflow-y-auto transform transition-transform duration-300 flex flex-col border-l border-kizuna-border animate-in slide-in-from-right">
                <div className="flex items-center justify-between mb-8 shrink-0">
                    <Badge variant="outline" className="bg-zinc-50 text-kizuna-text-muted border-kizuna-border font-bold uppercase text-[10px] tracking-widest">
                        Xem nhanh
                    </Badge>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-kizuna-text-muted hover:bg-zinc-100 hover:text-kizuna-text-main transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="text-center mb-8 shrink-0">
                    <div className="w-20 h-20 mx-auto bg-zinc-50 rounded-2xl flex items-center justify-center text-4xl border border-kizuna-border shadow-sm mb-4">
                        {project.logo}
                    </div>
                    <h2 className="text-2xl font-black text-kizuna-text-main mb-1 uppercase tracking-tighter">{project.name}</h2>
                    <div className="flex items-center justify-center gap-2 text-xs text-kizuna-text-muted font-bold uppercase tracking-widest mb-3">
                        <span>{project.industry}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                        <span>{project.stage}</span>
                    </div>
                    <p className="text-kizuna-text-muted text-sm leading-relaxed max-w-sm mx-auto font-medium">{project.description}</p>
                </div>

                <div className="space-y-6 flex-1">
                    {/* Problem/Solution */}
                    <div className="bg-zinc-50 border border-kizuna-border rounded-xl p-5 shadow-sm">
                        <h4 className="text-kizuna-text-main text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Target className="w-4 h-4 text-kizuna-primary" /> Vấn đề & Giải pháp
                        </h4>
                        <div className="text-kizuna-text-muted text-sm leading-relaxed space-y-3 font-medium">
                            <p><strong className="text-kizuna-text-main">Vấn đề:</strong> Các hệ thống cũ gây ra gánh nặng vận hành lớn và trải nghiệm kém cho tệp khách hàng Gen-Z đang tăng trưởng mạnh.</p>
                            <p><strong className="text-kizuna-text-main">Giải pháp:</strong> Kiến trúc ưu tiên API thống nhất, cung cấp hạ tầng có khả năng mở rộng và tích hợp giao diện hiện đại.</p>
                        </div>
                    </div>

                    {/* Traction */}
                    <div className="bg-white border border-kizuna-border rounded-xl p-5 shadow-sm">
                        <h4 className="text-kizuna-text-main text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-kizuna-primary" /> Chỉ số tăng trưởng
                        </h4>
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-5 h-5 text-emerald-600" />
                            <p className="text-kizuna-text-main font-black text-lg">{project.metrics}</p>
                        </div>
                        <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                            <div className="h-full bg-kizuna-primary w-[65%] rounded-full" />
                        </div>
                    </div>

                    {/* Ask Details */}
                    <div className="bg-zinc-50 border border-kizuna-border rounded-xl p-5 shadow-sm">
                        <h4 className="text-kizuna-text-main text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-kizuna-primary" /> Thông tin gọi vốn
                        </h4>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-kizuna-text-main">{project.ask.split(' for ')[0]}</span>
                            <span className="text-kizuna-text-muted font-bold text-xs uppercase tracking-tighter">
                                cho {project.ask.split(' for ')[1] || project.ask}
                            </span>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="bg-white rounded-lg p-3 border border-kizuna-border shadow-sm">
                                <p className="text-[10px] text-kizuna-text-muted font-black uppercase tracking-widest mb-1">Định giá</p>
                                <p className="text-sm font-black text-kizuna-text-main">$1.2M Pre-money</p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-kizuna-border shadow-sm">
                                <p className="text-[10px] text-kizuna-text-muted font-black uppercase tracking-widest mb-1">Dự kiến đóng</p>
                                <p className="text-sm font-black text-kizuna-text-main">Trong 30 ngày tới</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sticky CTA Footer */}
                <div className="mt-6 pt-6 border-t border-kizuna-border shrink-0">
                    <Button className="w-full h-12 text-sm font-black bg-kizuna-primary text-white hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-widest">
                        Yêu cầu Full Data Room
                        <ArrowUpRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </>
    );
};