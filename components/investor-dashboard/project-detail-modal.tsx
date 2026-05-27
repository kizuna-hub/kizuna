"use client";

import { X, Lock, Target, TrendingUp, UserCircle, Database, ShieldCheck, Mail, Phone, ExternalLink } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';

export const ProjectDetailModal = ({ project, onClose, userTier, onTriggerPaywall }: any) => {
    if (!project) return null;

    const isLocked = project.isLocked;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />

            {/* Main Modal (Bento Container) */}
            <div className="bg-zinc-100 rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-in zoom-in-95 duration-200 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                {/* Header dính (Tích hợp luôn Data Room vào đây) */}
                <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-zinc-200 px-8 py-5 flex items-center justify-between z-20 rounded-t-[2rem]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-zinc-200 shrink-0">
                            {isLocked ? <Lock className="w-5 h-5 text-zinc-400" /> : project.logo}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-zinc-900 flex items-center gap-2">
                                {isLocked ? `Locked Deal #${project.id}` : project.name}
                                {!isLocked && project.ipSecured && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                            </h2>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                                {project.industry} <span className="mx-1">•</span> {project.stage}
                            </p>
                        </div>
                    </div>

                    {/* Cụm Action bên phải Header */}
                    <div className="flex items-center gap-3 shrink-0">
                        <Button
                            onClick={isLocked ? onTriggerPaywall : undefined}
                            className={cn(
                                "h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all flex items-center gap-2",
                                isLocked
                                    ? "bg-zinc-900 hover:bg-black text-white"
                                    : "bg-[#102c1e] hover:bg-[#16452a] text-white"
                            )}
                        >
                            {isLocked ? (
                                <><Lock className="w-3.5 h-3.5" /> Yêu Cầu Mở Khóa</>
                            ) : (
                                <><Database className="w-3.5 h-3.5 text-emerald-400" /> Data Room <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" /></>
                            )}
                        </Button>
                        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl transition-colors group">
                            <X className="w-4 h-4 text-zinc-500 group-hover:text-zinc-900" />
                        </button>
                    </div>
                </div>

                {/* Bento Grid Layout Nội dung */}
                <div className="p-6">
                    {/* Grid chia 12 cột, vừa vặn không dư khoảng trống thừa */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

                        {/* --- KHỐI 1: NỖI ĐAU & GIẢI PHÁP (Chiếm 7 cột) --- */}
                        <div className="md:col-span-7 bg-white rounded-3xl p-7 shadow-sm border border-zinc-200 relative overflow-hidden flex flex-col h-full">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2 shrink-0">
                                <Target className="w-4 h-4 text-[#102c1e]" /> Problem & Solution
                            </h3>
                            <div className={cn("flex-1 space-y-6", isLocked && "blur-[5px] select-none opacity-60")}>
                                <div>
                                    <h4 className="text-sm font-bold text-zinc-900 mb-2">Nỗi đau thị trường (Pain Points)</h4>
                                    <p className="text-xs font-medium text-zinc-600 leading-relaxed text-justify">
                                        {isLocked ? "Nội dung bị ẩn do chế độ Venture Lock. Vui lòng mở khóa để xem chi tiết thị trường." : "Hiện nay, các doanh nghiệp SME đang phải gồng gánh chi phí vận hành khổng lồ do quy trình quản lý hoàn toàn thủ công. Hơn 60% dữ liệu bị phân mảnh giữa các phòng ban, dẫn đến độ trễ trong việc ra quyết định. Sự thiếu hụt một luồng thông tin xuyên suốt khiến doanh nghiệp thất thoát trung bình 15% - 20% doanh thu mỗi tháng. Thêm vào đó, nhân sự phải dành quá nhiều thời gian cho các tác vụ lặp đi lặp lại."}
                                    </p>
                                </div>
                                <div className="h-px w-full bg-zinc-100" />
                                <div>
                                    <h4 className="text-sm font-bold text-zinc-900 mb-2">Giải pháp (Our Solution)</h4>
                                    <p className="text-xs font-medium text-zinc-600 leading-relaxed text-justify">
                                        {isLocked ? "Nội dung bị ẩn do chế độ Venture Lock. Vui lòng mở khóa để xem chi tiết giải pháp." : "Chúng tôi xây dựng một hệ sinh thái SaaS All-in-one, tự động hóa luồng công việc bằng AI. Cốt lõi của nền tảng là Data Lake tập trung, giúp đồng bộ hóa dữ liệu real-time. Hệ thống cung cấp dashboard báo cáo động, cho phép C-level ra quyết định tức thì. Với kiến trúc linh hoạt, giải pháp dễ dàng tích hợp với các ERP/CRM hiện có, giúp tiết kiệm 40% chi phí vận hành và tăng 30% hiệu suất."}
                                    </p>
                                </div>
                            </div>
                            {isLocked && (
                                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/40">
                                    <Lock className="w-10 h-10 text-zinc-800 mb-3" />
                                    <span className="text-xs font-black text-zinc-900 uppercase tracking-widest bg-white/80 px-4 py-2 rounded-lg backdrop-blur-sm border border-zinc-200">Đã khóa bởi Founder</span>
                                </div>
                            )}
                        </div>

                        {/* --- CỘT PHẢI: Gồm 2 khối xếp chồng lên nhau --- */}
                        <div className="md:col-span-5 flex flex-col gap-4 h-full">

                            {/* Khối 2: Traction (Row 1) */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-200 relative overflow-hidden flex-1 flex flex-col justify-center">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-emerald-600" /> Traction & Ask
                                </h3>
                                <div className={cn("space-y-4", isLocked && "blur-[4px] select-none opacity-60")}>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">MRR / Users</p>
                                            <h4 className="text-2xl font-black text-emerald-600">{project.metrics}</h4>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                                        <div>
                                            <p className="text-[9px] font-bold text-zinc-500 uppercase mb-1">The Ask</p>
                                            <p className="text-lg font-black text-[#102c1e]">{project.ask}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-bold text-zinc-500 uppercase mb-1">Cổ phần</p>
                                            <p className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">{project.equity}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Khối 3: Founder (Row 2) */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-200 relative overflow-hidden flex items-center gap-4 shrink-0">
                                <img src={project.founder?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.id}`} alt="Founder" className={cn("w-16 h-16 rounded-full border-2 border-zinc-100 bg-zinc-50 shrink-0", (isLocked || userTier === 'Free') && "blur-sm")} />
                                <div className={cn("flex-1 min-w-0", (isLocked || userTier === 'Free') && "blur-[4px] select-none opacity-60")}>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1 flex items-center gap-1.5"><UserCircle className="w-3.5 h-3.5 text-blue-600" /> Founder</p>
                                    <h4 className="text-base font-black text-zinc-900 truncate">{project.founder?.name || 'Ẩn danh'}</h4>

                                    <div className="flex items-center gap-2 mt-3">
                                        <Button variant="outline" size="sm" className="h-7 px-3 text-[10px] font-bold rounded-lg border-zinc-200 flex-1"><Mail className="w-3.5 h-3.5 mr-1.5" /> Email</Button>
                                        <Button variant="outline" size="sm" className="h-7 px-3 text-[10px] font-bold rounded-lg border-zinc-200 flex-1"><Phone className="w-3.5 h-3.5 mr-1.5" /> Gọi</Button>
                                    </div>
                                </div>
                                {!isLocked && userTier === 'Free' && (
                                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/50 backdrop-blur-[2px]">
                                        <Button onClick={onTriggerPaywall} className="bg-zinc-900 hover:bg-black text-white text-[10px] font-bold rounded-xl shadow-lg h-9 px-4">
                                            <Lock className="w-3 h-3 mr-2" /> Mở khóa Contact
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};