import { X, Target, Activity, TrendingUp, Briefcase, ArrowUpRight, Lock, UserCircle, GraduationCap, Mail, Phone, Linkedin, Github, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DrawerProps {
    project: any | null;
    onClose: () => void;
}

export const ProjectDetailDrawer = ({ project, onClose }: DrawerProps) => {
    if (!project) return null;

    const isLocked = project.isLocked;
    const founder = project.founder;

    return (
        <>
            {/* GIỮ NGUYÊN: Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity animate-in fade-in"
                onClick={onClose}
            />

            {/* GIỮ NGUYÊN: Drawer */}
            <div className="fixed top-0 right-0 h-full w-[450px] bg-white shadow-2xl z-50 p-8 overflow-y-auto transform transition-transform duration-300 flex flex-col border-l border-kizuna-border animate-in slide-in-from-right">

                {/* GIỮ NGUYÊN: Header */}
                <div className="flex items-center justify-between mb-8 shrink-0">
                    <Badge variant="outline" className={`${isLocked ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-zinc-50 text-kizuna-text-muted border-kizuna-border'} font-bold uppercase text-[10px] tracking-widest`}>
                        {isLocked ? '🔒 Venture Lock' : 'Xem nhanh'}
                    </Badge>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-kizuna-text-muted hover:bg-zinc-100 hover:text-kizuna-text-main transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* GIỮ NGUYÊN: Hero Section */}
                <div className={`text-center mb-8 shrink-0 ${isLocked ? 'blur-[3px] select-none' : ''}`}>
                    <div className="w-20 h-20 mx-auto bg-zinc-50 rounded-2xl flex items-center justify-center text-4xl border border-kizuna-border shadow-sm mb-4">
                        {isLocked ? <Lock className="w-8 h-8 text-zinc-400" /> : project.logo}
                    </div>
                    <h2 className="text-2xl font-black text-kizuna-text-main mb-1 uppercase tracking-tighter">
                        {isLocked ? `Dự án #${project.id.padStart(4, '0')}` : project.name}
                    </h2>
                    <div className="flex items-center justify-center gap-2 text-xs text-kizuna-text-muted font-bold uppercase tracking-widest mb-3">
                        <span>{project.industry}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                        <span>{project.stage}</span>
                    </div>
                    <p className="text-kizuna-text-muted text-sm leading-relaxed max-w-sm mx-auto font-medium">
                        {isLocked ? 'Thông tin đang bị ẩn.' : project.description}
                    </p>
                </div>

                {/* GIỮ NGUYÊN: Wrapper nội dung chính */}
                <div className="space-y-6 flex-1 relative">

                    {/* THÊM MỚI 1: Section Founder */}
                    <div className="bg-white border border-kizuna-border rounded-xl p-5 shadow-sm">
                        <h4 className="text-kizuna-text-main text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                            <UserCircle className="w-4 h-4 text-kizuna-primary" /> Đội ngũ sáng lập
                        </h4>

                        <div className="flex items-center gap-4">
                            <div className={`relative shrink-0 ${isLocked ? 'blur-[3px]' : ''}`}>
                                <img src={founder?.avatar} alt="Avatar" className="w-16 h-16 rounded-full border border-zinc-200 object-cover bg-zinc-50" />
                                {isLocked && <div className="absolute inset-0 flex items-center justify-center text-xl">🕵️</div>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h5 className="text-sm font-black text-kizuna-text-main uppercase tracking-tight truncate">
                                    {isLocked ? 'Đã ẩn (Venture Lock)' : founder?.name}
                                </h5>
                                <p className="text-xs font-bold text-kizuna-primary mt-0.5">{founder?.role}</p>
                                <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold text-kizuna-text-muted uppercase tracking-widest truncate">
                                    <GraduationCap className="w-3 h-3 shrink-0" />
                                    <span className="truncate">{founder?.school}</span>
                                </div>
                            </div>
                        </div>

                        {!isLocked && (
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-100">
                                <Button variant="outline" size="icon" className="w-8 h-8 rounded-full border-zinc-200 text-zinc-600 hover:text-kizuna-primary hover:border-kizuna-primary hover:bg-emerald-50"><Mail className="w-3.5 h-3.5" /></Button>
                                <Button variant="outline" size="icon" className="w-8 h-8 rounded-full border-zinc-200 text-zinc-600 hover:text-kizuna-primary hover:border-kizuna-primary hover:bg-emerald-50"><Phone className="w-3.5 h-3.5" /></Button>
                                <Button variant="outline" size="icon" className="w-8 h-8 rounded-full border-zinc-200 text-zinc-600 hover:text-[#0077b5] hover:border-[#0077b5] hover:bg-blue-50"><Linkedin className="w-3.5 h-3.5" /></Button>
                                <Button variant="outline" size="icon" className="w-8 h-8 rounded-full border-zinc-200 text-zinc-600 hover:text-black hover:border-black hover:bg-zinc-100"><Github className="w-3.5 h-3.5" /></Button>
                            </div>
                        )}
                    </div>

                    {/* THÊM MỚI 2: Đánh giá AI */}
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5 shadow-sm">
                        <h4 className="text-emerald-800 text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-emerald-600" /> AI Đánh giá ({project.aiMatchScore}%)
                        </h4>
                        <div className="flex items-start gap-2.5 text-sm font-medium text-kizuna-text-main">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>Khớp ngành <strong>{project.industry}</strong>.</span>
                        </div>
                    </div>

                    {/* VÙNG BỊ KHÓA: Nếu isLocked = true, phủ Overlay lên 3 block gốc */}
                    <div className="relative">
                        {isLocked && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-[4px] bg-white/50 rounded-xl border border-white/50">
                                <Lock className="w-8 h-8 text-zinc-800 mb-2" />
                                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest">Locked Deal</h3>
                            </div>
                        )}

                        <div className={`space-y-6 ${isLocked ? 'opacity-20 pointer-events-none blur-[2px]' : ''}`}>
                            {/* GIỮ NGUYÊN: Problem/Solution của sếp */}
                            <div className="bg-zinc-50 border border-kizuna-border rounded-xl p-5 shadow-sm">
                                <h4 className="text-kizuna-text-main text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Target className="w-4 h-4 text-kizuna-primary" /> Vấn đề & Giải pháp
                                </h4>
                                <p className="text-kizuna-text-muted text-sm leading-relaxed">
                                    <strong className="text-kizuna-text-main">Vấn đề:</strong> Legacy systems create huge operational overhead and poor UX for growing Gen-Z base. <br /><br />
                                    <strong className="text-kizuna-text-main">Giải pháp:</strong> A unified, API-first architecture providing scalable infrastructure and pristine front-end integrations.
                                </p>
                            </div>

                            {/* GIỮ NGUYÊN: Traction của sếp */}
                            <div className="bg-white border border-kizuna-border rounded-xl p-5 shadow-sm">
                                <h4 className="text-kizuna-text-main text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-kizuna-primary" /> Traction
                                </h4>
                                <div className="flex items-center gap-2 mb-3">
                                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                                    <p className="text-kizuna-text-main font-semibold">{project.metrics}</p>
                                </div>
                                <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-kizuna-primary w-[65%]" />
                                </div>
                            </div>

                            {/* GIỮ NGUYÊN: The Ask của sếp */}
                            <div className="bg-zinc-50 border border-kizuna-border rounded-xl p-5 shadow-sm">
                                <h4 className="text-kizuna-text-main text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-kizuna-primary" /> The Ask
                                </h4>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black text-kizuna-text-main">{project.ask.split(/ cho | for /i)[0]}</span>
                                    <span className="text-kizuna-text-muted font-medium text-sm">cho {project.ask.split(/ cho | for /i)[1] || project.ask}</span>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <div className="bg-white rounded-lg p-3 border border-kizuna-border shadow-sm">
                                        <p className="text-[10px] text-kizuna-text-muted font-black uppercase tracking-widest mb-1">Valuation</p>
                                        <p className="text-sm font-bold text-kizuna-text-main">$1.2M Pre</p>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 border border-kizuna-border shadow-sm">
                                        <p className="text-[10px] text-kizuna-text-muted font-black uppercase tracking-widest mb-1">Closing</p>
                                        <p className="text-sm font-bold text-kizuna-text-main">Next 30 Days</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* GIỮ NGUYÊN: Sticky CTA Footer (Có đổi Text nếu bị Lock) */}
                <div className="mt-6 pt-6 border-t border-kizuna-border shrink-0">
                    <Button className={`w-full h-11 text-sm font-black text-white transition-none shadow-sm flex items-center gap-2 uppercase tracking-widest ${isLocked ? 'bg-zinc-900 hover:bg-black' : 'bg-kizuna-primary hover:bg-kizuna-primary/90'}`}>
                        {isLocked ? (
                            <><Lock className="w-4 h-4" /> Yêu Cầu Mở Khóa</>
                        ) : (
                            <>Vào Data Room <ArrowUpRight className="w-4 h-4" /></>
                        )}
                    </Button>
                </div>
            </div>
        </>
    );
};