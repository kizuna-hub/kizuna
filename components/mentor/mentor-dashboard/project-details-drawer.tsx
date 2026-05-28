import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Code, DollarSign, Users, GraduationCap, Target, Mail, Phone, Linkedin, Github, Building2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export const ProjectDetailsDrawer = ({ isOpen, onClose, project }: { isOpen: boolean, onClose: () => void, project: any }) => {
    const [activeTab, setActiveTab] = useState('team');

    if (!project) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-[#18181b]/50 backdrop-blur-sm z-[100]"
                    />

                    <motion.div
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full md:w-[600px] bg-[#ffffff] shadow-2xl z-[101] flex flex-col border-l border-[#e4e4e7]"
                    >
                        {/* Header Drawer */}
                        <div className="px-8 py-6 border-b border-[#e4e4e7] flex items-start justify-between bg-[#fafafa]">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl border border-[#e4e4e7] shadow-sm">
                                    {project.logo}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-[#18181b] tracking-tight">{project.projectName}</h2>
                                    <p className="text-xs font-bold text-[#16452a] uppercase tracking-widest mt-1">Yêu cầu cố vấn</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-[#e4e4e7] rounded-full transition-colors text-[#71717a]">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-[#e4e4e7] px-8 bg-white">
                            {[
                                { id: 'team', label: 'Founder & Team', icon: Users },
                                { id: 'tech', label: 'Tech & Pitch', icon: Code },
                                { id: 'finance', label: 'Financial', icon: DollarSign },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 py-4 px-4 text-xs font-black uppercase tracking-widest border-b-2 transition-colors ${activeTab === tab.id ? 'border-[#16452a] text-[#16452a]' : 'border-transparent text-[#71717a] hover:text-[#18181b]'
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" /> {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white">
                            {/* TAB TEAM: NÂNG CẤP XÁC MINH DANH TÍNH CHI TIẾT */}
                            {activeTab === 'team' && (
                                <div className="space-y-8">
                                    <section>
                                        <h3 className="text-sm font-black text-[#18181b] uppercase tracking-widest border-b border-[#e4e4e7] pb-2 mb-4">Về chúng tôi</h3>
                                        <p className="text-sm text-[#71717a] leading-relaxed font-medium bg-[#fafafa] p-4 rounded-2xl border border-[#e4e4e7]">{project.details?.bio}</p>
                                    </section>

                                    <section>
                                        <h3 className="text-sm font-black text-[#18181b] uppercase tracking-widest border-b border-[#e4e4e7] pb-2 mb-4">Danh tính đội ngũ</h3>
                                        <div className="space-y-6">
                                            {project.founders?.map((f: any, idx: number) => (
                                                <div key={idx} className="border border-[#e4e4e7] rounded-2xl p-5 bg-white shadow-sm hover:border-[#16452a]/30 transition-all">
                                                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-[#e4e4e7]/60">
                                                        <img src={f.avatar} alt={f.name} className="w-14 h-14 rounded-full border-2 border-[#fafafa]" />
                                                        <div>
                                                            <p className="text-base font-black text-[#18181b]">{f.name}</p>
                                                            <p className="text-[11px] font-bold text-[#16452a] uppercase tracking-widest mt-0.5">{f.role}</p>
                                                        </div>
                                                    </div>

                                                    {/* Khu vực thông tin liên hệ cực kỳ rõ ràng */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-2 text-xs">
                                                        <div className="flex items-center gap-2 text-[#71717a]">
                                                            <Building2 className="w-3.5 h-3.5 text-[#18181b]" /> <span className="font-semibold">{f.university}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[#71717a]">
                                                            <GraduationCap className="w-3.5 h-3.5 text-[#18181b]" /> <span className="font-semibold">{f.major}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[#71717a]">
                                                            <Mail className="w-3.5 h-3.5 text-[#18181b]" /> <span className="font-semibold">{f.email}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[#71717a]">
                                                            <Phone className="w-3.5 h-3.5 text-[#18181b]" /> <span className="font-semibold">{f.phone}</span>
                                                        </div>
                                                    </div>

                                                    {/* Social Links */}
                                                    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[#e4e4e7]/40">
                                                        <a href={`https://${f.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[10px] font-bold text-[#71717a] hover:text-[#0077b5] transition-colors bg-[#fafafa] px-2.5 py-1.5 rounded-lg border border-[#e4e4e7]">
                                                            <Linkedin className="w-3 h-3" /> LinkedIn
                                                        </a>
                                                        <a href={`https://${f.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[10px] font-bold text-[#71717a] hover:text-[#18181b] transition-colors bg-[#fafafa] px-2.5 py-1.5 rounded-lg border border-[#e4e4e7]">
                                                            <Github className="w-3 h-3" /> GitHub
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            )}

                            {activeTab === 'tech' && (
                                <div className="space-y-6">
                                    <h3 className="text-sm font-black text-[#18181b] uppercase tracking-widest border-b border-[#e4e4e7] pb-2">Tech Stack Core</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.details?.techStack.split(',').map((tech: string, i: number) => (
                                            <span key={i} className="px-3 py-1.5 bg-[#16452a]/5 text-[#16452a] font-bold text-xs rounded-lg border border-[#16452a]/10">
                                                {tech.trim()}
                                            </span>
                                        ))}
                                    </div>

                                    <h3 className="text-sm font-black text-[#18181b] uppercase tracking-widest border-b border-[#e4e4e7] pb-2 mt-8">Pitch Deck Preview</h3>
                                    <div className="w-full h-48 bg-[#fafafa] border-2 border-dashed border-[#e4e4e7] rounded-2xl flex flex-col items-center justify-center text-[#71717a]">
                                        <FileText className="w-8 h-8 mb-2 opacity-50" />
                                        <p className="text-xs font-bold uppercase tracking-widest">PDF Preview.pdf</p>
                                        <Button variant="link" className="text-[#16452a] text-xs font-black uppercase">Mở toàn màn hình</Button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'finance' && (
                                <div className="space-y-6">
                                    <h3 className="text-sm font-black text-[#18181b] uppercase tracking-widest border-b border-[#e4e4e7] pb-2">Nhu cầu gọi vốn sinh viên</h3>
                                    <div className="bg-[#16452a] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                                        <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
                                        <p className="text-[10px] font-bold text-[#00BFA5] uppercase tracking-widest mb-2 relative z-10">Mục tiêu gọi vốn & Đổi lấy</p>
                                        <p className="text-2xl font-black relative z-10 leading-tight">{project.details?.ask}</p>
                                    </div>

                                    <div className="bg-[#fafafa] border border-[#e4e4e7] rounded-2xl p-6">
                                        <p className="text-[10px] font-bold text-[#71717a] uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <Target className="w-3.5 h-3.5" /> Điểm hòa vốn (Traction cần đạt)
                                        </p>
                                        <p className="text-sm font-black text-[#18181b]">{project.details?.breakEven}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer - Fixed CTAs */}
                        <div className="p-6 border-t border-[#e4e4e7] bg-white grid grid-cols-2 gap-4 shrink-0">
                            <Button className="w-full h-12 bg-[#16452a] hover:bg-[#0f2e1c] text-white font-black text-sm rounded-xl transition-all active:scale-95">
                                Chấp nhận Cố vấn
                            </Button>
                            <Button variant="outline" onClick={onClose} className="w-full h-12 border-[#e4e4e7] text-[#71717a] hover:text-[#18181b] hover:bg-[#fafafa] font-bold text-sm rounded-xl transition-all active:scale-95">
                                Đóng
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};