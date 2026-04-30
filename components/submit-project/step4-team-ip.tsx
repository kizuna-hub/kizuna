import { motion } from 'framer-motion';
import { Users, Trash2, Plus, ShieldCheck, Info, UploadCloud, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface Step4Props {
    team: any[];
    formData: any;
    handleTeamChange: (index: number, field: string, value: string) => void;
    addTeamMember: () => void;
    removeTeamMember: (index: number) => void;
    handleToggle: () => void;
    handleInputChange: (e: any) => void;
}

export function Step4TeamIP({ team, formData, handleTeamChange, addTeamMember, removeTeamMember, handleToggle, handleInputChange }: Step4Props) {
    return (
        <div className="space-y-8">
            {/* --- Phần 1: Đội ngũ (Team) --- */}
            <div>
                <div className="flex items-center justify-between mb-1">
                    <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main">
                        <Users className="w-4 h-4 text-kizuna-primary" /> Thành viên dự án
                    </label>
                    <span className="text-xs font-medium text-kizuna-primary bg-kizuna-primary/10 px-2 py-1 rounded-md">
                        {team.length} Thành viên
                    </span>
                </div>
                <p className="text-xs text-kizuna-text-muted mb-4">Các dự án có đủ bộ 3 năng lực (Kỹ thuật - Kinh doanh - Sản phẩm) thường được Mentor đánh giá rất cao.</p>

                <div className="space-y-4">
                    {team.map((member, index) => (
                        <div key={index} className="bg-white border border-zinc-200 rounded-xl p-5 relative transition-all shadow-sm">
                            <div className="flex justify-between items-center mb-5 pb-3 border-b border-zinc-100">
                                <h4 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
                                    {index === 0 ? (
                                        <><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Trưởng nhóm (Founder)</>
                                    ) : (
                                        <><span className="w-2.5 h-2.5 rounded-full bg-zinc-400"></span> Co-founder / Thành viên</>
                                    )}
                                </h4>
                                {team.length > 1 && index !== 0 && (
                                    <button
                                        type="button" // Fix lỗi form tự submit
                                        onClick={() => removeTeamMember(index)}
                                        className="text-zinc-400 hover:text-red-500 transition-colors p-1.5 bg-zinc-50 rounded-md border border-zinc-200 hover:bg-red-50"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>

                            {/* BỐ CỤC 2 CỘT GỌN GÀNG */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Hàng 1 */}
                                <div>
                                    <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Họ và Tên</label>
                                    <input value={member.name} onChange={(e) => handleTeamChange(index, 'name', e.target.value)} placeholder="Ví dụ: Nguyễn Tuấn Ngọc" className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary transition-all" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Mảng Năng Lực Cốt Lõi</label>
                                    <select value={member.core_skill || ''} onChange={(e) => handleTeamChange(index, 'core_skill', e.target.value)} className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary transition-all appearance-none">
                                        <option value="" disabled>Chọn mảng...</option>
                                        <option value="tech">Kỹ thuật & Công nghệ (Hacker)</option>
                                        <option value="biz">Kinh doanh & Vận hành (Hustler)</option>
                                        <option value="design">Thiết kế & Trải nghiệm (Hipster)</option>
                                        <option value="other">Chuyên môn khác</option>
                                    </select>
                                </div>

                                {/* Hàng 2: MSSV và Lớp */}
                                <div>
                                    <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Mã số sinh viên (MSSV)</label>
                                    <input value={member.student_id || ''} onChange={(e) => handleTeamChange(index, 'student_id', e.target.value)} placeholder="Ví dụ: 1022..." className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary transition-all" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Lớp sinh hoạt</label>
                                    <input value={member.class_name || ''} onChange={(e) => handleTeamChange(index, 'class_name', e.target.value)} placeholder="Ví dụ: 22T1" className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary transition-all" />
                                </div>

                                {/* Hàng 3 */}
                                <div>
                                    <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Trường / Tổ chức</label>
                                    <input value={member.school_company} onChange={(e) => handleTeamChange(index, 'school_company', e.target.value)} placeholder="Ví dụ: ĐH Bách Khoa - ĐHĐN" className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary transition-all" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Vai trò cụ thể trong team</label>
                                    <input value={member.role} onChange={(e) => handleTeamChange(index, 'role', e.target.value)} placeholder="Ví dụ: AI Engineer, Marketing..." className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary transition-all" />
                                </div>

                                {/* Hàng 4 */}
                                <div>
                                    <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Email</label>
                                    <input value={member.email} onChange={(e) => handleTeamChange(index, 'email', e.target.value)} placeholder="name@domain.com" className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary transition-all" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Số điện thoại</label>
                                    <input value={member.phone} onChange={(e) => handleTeamChange(index, 'phone', e.target.value)} placeholder="+84..." className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary transition-all" />
                                </div>

                                {/* Hàng 5 (Full width) */}
                                <div className="md:col-span-2">
                                    <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">URL LinkedIn / Portfolio</label>
                                    <input value={member.social_link} onChange={(e) => handleTeamChange(index, 'social_link', e.target.value)} placeholder="https://linkedin.com/in/..." className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary transition-all" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={addTeamMember}
                    className="w-full mt-4 border-dashed border-zinc-300 text-zinc-600 hover:text-kizuna-primary hover:border-kizuna-primary hover:bg-zinc-50 py-6"
                >
                    <Plus className="w-4 h-4 mr-2" /> Thêm thành viên Co-founder
                </Button>
            </div>

            {/* --- Phần 2: Pitch Deck & IP Protection --- */}
            <div className="pt-6 border-t border-zinc-200">
                <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main mb-3">
                    <FileText className="w-4 h-4 text-kizuna-primary" /> Tài liệu cốt lõi (Pitch Deck / Business Plan)
                </label>

                <div className="w-full border-2 border-dashed border-zinc-300 rounded-xl p-8 bg-zinc-50 flex flex-col items-center justify-center text-center hover:bg-zinc-100 hover:border-kizuna-primary transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-zinc-200 mb-3 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-6 h-6 text-kizuna-primary" />
                    </div>
                    <p className="text-sm font-semibold text-zinc-800">Nhấn để tải lên hoặc kéo thả tệp vào đây</p>
                    <p className="text-xs text-zinc-500 mt-1">Hỗ trợ PDF, PPTX (Tối đa 20MB). Tệp này sẽ được dùng để trích xuất Mã băm SHTT.</p>
                </div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5 mt-4 relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl"></div>

                    <div className="flex items-start gap-4 relative z-10">
                        <div className="bg-white p-2 rounded-full shadow-sm border border-emerald-100">
                            <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-emerald-900 mb-1">
                                Cơ chế Zero-Knowledge & Két sắt SpacetimeDB
                            </h3>
                            <p className="text-xs text-emerald-800 mb-4 leading-relaxed">
                                Tệp tài liệu của bạn <strong className="text-emerald-900">không bao giờ rời khỏi trình duyệt</strong>. Hệ thống chỉ trích xuất một Mã băm (Hash SHA-256) duy nhất và ghi vào <strong className="text-emerald-900">Sổ cái SHTT (IP Ledger)</strong> để cấp chứng nhận sở hữu thời gian thực cho nhóm của bạn.
                            </p>
                            <div className="flex items-center justify-between pt-3 border-t border-emerald-200/60">
                                <div>
                                    <label className="text-[13px] font-bold text-emerald-900 block">
                                        Chế độ Ẩn danh (Venture Lock)
                                    </label>
                                    <span className="text-[11px] text-emerald-700">Chỉ hiển thị tài liệu cho Nhà đầu tư đã xác thực.</span>
                                </div>
                                <Switch checked={formData.lockDetails} onCheckedChange={handleToggle} className="data-[state=checked]:bg-emerald-600" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* --- Phần 3: Lời thề danh dự --- */}
            <div className="space-y-4 pt-2">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 items-start">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-blue-900 font-semibold text-sm mb-1">Quy trình thẩm định</h4>
                        <p className="text-blue-800 text-xs leading-relaxed">
                            Hồ sơ sẽ được AI Policy Navigator và đội ngũ Pioneer Mentor quét độc lập trong vòng 48 giờ. Vui lòng đảm bảo các thông tin trên đạt độ chính xác cao nhất để được mở khóa kết nối mảng Venture Connect.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 border border-zinc-200 rounded-xl bg-white hover:bg-zinc-50 transition-colors cursor-pointer">
                    <div className="flex items-center h-5">
                        <input
                            id="commitment"
                            name="isCommitted"
                            type="checkbox"
                            checked={formData.isCommitted || false}
                            onChange={(e) => handleInputChange({ target: { name: 'isCommitted', value: e.target.checked } })}
                            className="w-4 h-4 text-kizuna-primary border-zinc-300 rounded focus:ring-kizuna-primary focus:ring-2 cursor-pointer"
                        />
                    </div>
                    <label htmlFor="commitment" className="text-sm font-medium text-zinc-700 cursor-pointer select-none">
                        Tôi đại diện nhóm cam kết toàn bộ thông tin trên là sự thật, ý tưởng dự án là tài sản trí tuệ gốc của nhóm và tuân thủ các quy chuẩn đạo đức của Kizuna Hub.
                    </label>
                </div>
            </div>
        </div>
    );
}