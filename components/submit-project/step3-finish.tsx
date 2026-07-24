"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Users, Trash2, Plus, Flag, Activity, LinkIcon, TrendingUp, ImagePlus, UserCheck, MessageSquareText } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step3FinishProps {
    formData: any;
    updateFormData: (field: string, value: any) => void;
    updateTeamMember: (index: number, field: string, value: string) => void;
    addTeamMember: () => void;
    removeTeamMember: (index: number) => void;
}

export function Step3Finish({ formData, updateFormData, updateTeamMember, addTeamMember, removeTeamMember }: Step3FinishProps) {

    // Tùy chọn trạng thái dự án
    const statusOptions = [
        { id: 'Idea', label: 'Ý tưởng' },
        { id: 'MVP', label: 'Bản thử nghiệm (MVP)' },
        { id: 'Production', label: 'Đang vận hành' }
    ];

    return (
        <div className="space-y-10">

            {/* 1. Trạng thái dự án */}
            <div>
                <label className="flex items-center gap-2 text-sm font-bold text-[#081810] mb-1.5">
                    <Activity className="w-4 h-4 text-zinc-400" /> Trạng thái hiện tại <span className="text-red-500">*</span>
                </label>
                <p className="text-xs font-medium text-zinc-500 mb-4">Sản phẩm của bạn đang ở giai đoạn nào?</p>
                <div className="flex flex-wrap items-center gap-3">
                    {statusOptions.map((opt) => (
                        <button
                            key={opt.id}
                            type="button"
                            onClick={() => updateFormData('status', opt.id)}
                            className={cn(
                                "rounded-full px-5 py-2 text-sm font-bold transition-all border",
                                formData.status === opt.id
                                    ? "border-[#16452a] bg-[#16452a] text-white shadow-sm"
                                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
                            )}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
                {/* --- Logic hiển thị Động dựa theo Status --- */}
                <AnimatePresence mode="popLayout">
                    {(formData.status === 'MVP' || formData.status === 'Production') && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, y: -10 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -10 }}
                            className="overflow-hidden mt-6"
                        >
                            <div className="space-y-6">
                                {/* Khối Link & Traction */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-5 bg-zinc-50 border border-zinc-200 rounded-xl">
                                    {/* Ô nhập Link (Xuất hiện ở cả MVP và Production) */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-bold text-[#081810] mb-1.5">
                                            <LinkIcon className="w-4 h-4 text-zinc-400" /> Link sản phẩm <span className="text-red-500">*</span>
                                        </label>
                                        <p className="text-[11px] font-medium text-zinc-500 mb-2">Website, App Store, hoặc Figma Demo.</p>
                                        <input
                                            type="url"
                                            value={formData.demoLink || ''}
                                            onChange={(e) => updateFormData('demoLink', e.target.value)}
                                            placeholder="https://..."
                                            className="w-full h-10 bg-white border border-zinc-200 text-slate-900 rounded-lg px-3 text-sm focus:outline-none focus:border-[#16452a] focus:ring-1 focus:ring-[#16452a] transition-all"
                                        />
                                    </div>

                                    {/* Ô nhập Traction (CHỈ Xuất hiện ở Production) */}
                                    {formData.status === 'Production' && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                        >
                                            <label className="flex items-center gap-2 text-sm font-bold text-[#081810] mb-1.5">
                                                <TrendingUp className="w-4 h-4 text-emerald-500" /> Traction hiện tại
                                            </label>
                                            <p className="text-[11px] font-medium text-zinc-500 mb-2">Số liệu tự hào nhất (VD: 5000 users, $1k MRR...)</p>
                                            <input
                                                type="text"
                                                value={formData.traction || ''}
                                                onChange={(e) => updateFormData('traction', e.target.value)}
                                                placeholder="VD: Vừa đạt mốc 10.000 user active..."
                                                className="w-full h-10 bg-white border border-zinc-200 text-slate-900 rounded-lg px-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                            />
                                        </motion.div>
                                    )}
                                </div>

                                {/* Khối Upload Media Gallery */}
                                <div className="p-5 bg-white border border-zinc-200 rounded-xl shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="flex items-center gap-2 text-sm font-bold text-[#081810]">
                                            <ImagePlus className="w-4 h-4 text-zinc-400" /> Hình ảnh minh họa (Media Gallery) <span className="text-red-500">*</span>
                                        </label>
                                        <span className="text-xs font-bold text-zinc-500 bg-zinc-100 px-2 py-1 rounded">
                                            {formData.gallery?.length || 0} / 6
                                        </span>
                                    </div>
                                    <p className="text-xs font-medium text-zinc-500 mb-4">
                                        Tải lên <b>tối đa 6 hình ảnh</b> chụp giao diện (Screenshot) hoặc các tính năng nổi bật của sản phẩm.
                                    </p>

                                    {/* Grid hiển thị ảnh */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {/* Render các ảnh đã chọn */}
                                        {formData.gallery?.map((url: string, idx: number) => (
                                            <div key={idx} className="relative aspect-video rounded-lg border border-zinc-200 bg-zinc-50 overflow-hidden group">
                                                <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newGallery = [...formData.gallery];
                                                            if (newGallery[idx].startsWith('blob:')) URL.revokeObjectURL(newGallery[idx]);
                                                            newGallery.splice(idx, 1);
                                                            updateFormData('gallery', newGallery);
                                                        }}
                                                        className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Nút Add New (Chỉ hiện nếu số ảnh < 6) */}
                                        {(!formData.gallery || formData.gallery.length < 6) && (
                                            <label className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 cursor-pointer hover:border-[#16452a]/50 hover:bg-[#16452a]/5 transition-colors group">
                                                <Plus className="w-6 h-6 text-zinc-400 group-hover:text-[#16452a] mb-2 transition-colors" />
                                                <span className="text-xs font-bold text-zinc-500 group-hover:text-[#16452a] transition-colors">Thêm ảnh</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const files = Array.from(e.target.files || []);
                                                        const currentCount = formData.gallery?.length || 0;

                                                        // Giới hạn chỉ lấy đủ số lượng ảnh để đạt mốc 6
                                                        const allowedFiles = files.slice(0, 6 - currentCount);

                                                        const newUrls = allowedFiles.map(file => URL.createObjectURL(file));
                                                        updateFormData('gallery', [...(formData.gallery || []), ...newUrls]);
                                                    }}
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <hr className="border-zinc-100" />

            {/* 2. Đội ngũ (Team) */}
            {/* 2. Đội ngũ (Team) */}
            <div>
                <div className="flex items-center justify-between mb-1.5">
                    <label className="flex items-center gap-2 text-sm font-bold text-[#081810]">
                        <Users className="w-4 h-4 text-zinc-400" /> Đội ngũ dự án
                    </label>
                    <span className="text-[10px] font-bold text-[#16452a] bg-[#16452a]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {formData.team.length} Thành viên
                    </span>
                </div>
                <p className="text-xs font-medium text-zinc-500 mb-4">Mạng lưới kết nối (Networking) là tài sản lớn nhất của Founder.</p>

                <div className="space-y-4">
                    {formData.team.map((member: any, index: number) => (
                        <div key={index} className="relative rounded-xl border border-zinc-200 bg-white p-5 shadow-sm group">

                            {/* Nút xóa thành viên (Không xóa người đầu tiên) */}
                            {formData.team.length > 1 && index !== 0 && (
                                <button
                                    onClick={() => removeTeamMember(index)}
                                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-zinc-200 text-zinc-400 hover:text-red-500 hover:border-red-200 shadow-sm transition-colors opacity-0 group-hover:opacity-100 z-10"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            )}

                            <div className="space-y-5">
                                {/* Hàng 1: Tên & Vai trò */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Tên / Username */}
                                    <div>
                                        <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                                            Họ và tên <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={member.name}
                                            onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                                            placeholder={index === 0 ? "Tên của bạn..." : "Nhập tên..."}
                                            className="w-full h-10 bg-zinc-50 border border-zinc-200 text-slate-900 rounded-lg px-3 text-sm focus:outline-none focus:border-[#16452a] focus:bg-white transition-all"
                                        />
                                    </div>

                                    {/* Vai trò (Toggle Buttons - Có màu chủ đạo) */}
                                    <div>
                                        <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                                            Năng lực cốt lõi <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center gap-1.5 h-10 bg-zinc-100 p-1 rounded-lg border border-zinc-200">
                                            <button
                                                onClick={() => updateTeamMember(index, 'role', 'Tech')}
                                                className={cn(
                                                    "flex-1 h-full rounded text-[11px] font-bold transition-all",
                                                    member.role === 'Tech'
                                                        ? "bg-blue-500 text-white shadow-sm ring-1 ring-blue-600"
                                                        : "text-zinc-500 hover:text-zinc-700"
                                                )}
                                            >
                                                Hacker (Tech)
                                            </button>
                                            <button
                                                onClick={() => updateTeamMember(index, 'role', 'Biz')}
                                                className={cn(
                                                    "flex-1 h-full rounded text-[11px] font-bold transition-all",
                                                    member.role === 'Biz'
                                                        ? "bg-orange-500 text-white shadow-sm ring-1 ring-orange-600"
                                                        : "text-zinc-500 hover:text-zinc-700"
                                                )}
                                            >
                                                Hustler (Biz)
                                            </button>
                                            <button
                                                onClick={() => updateTeamMember(index, 'role', 'Design')}
                                                className={cn(
                                                    "flex-1 h-full rounded text-[11px] font-bold transition-all",
                                                    member.role === 'Design'
                                                        ? "bg-purple-500 text-white shadow-sm ring-1 ring-purple-600"
                                                        : "text-zinc-500 hover:text-zinc-700"
                                                )}
                                            >
                                                Hipster (Design)
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Bọc Collapse thông tin chi tiết */}
                                <div className="pt-4 border-t border-zinc-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Email */}
                                    <div>
                                        <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                                            Email liên hệ <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={member.email || ''}
                                            onChange={(e) => updateTeamMember(index, 'email', e.target.value)}
                                            placeholder="name@domain.com"
                                            className="w-full h-9 bg-zinc-50 border border-zinc-200 text-slate-900 rounded-md px-3 text-sm focus:outline-none focus:border-[#16452a] focus:bg-white transition-all"
                                        />
                                    </div>

                                    {/* Số điện thoại */}
                                    <div>
                                        <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                                            Số điện thoại
                                        </label>
                                        <input
                                            type="tel"
                                            value={member.phone || ''}
                                            onChange={(e) => updateTeamMember(index, 'phone', e.target.value)}
                                            placeholder="+84..."
                                            className="w-full h-9 bg-zinc-50 border border-zinc-200 text-slate-900 rounded-md px-3 text-sm focus:outline-none focus:border-[#16452a] focus:bg-white transition-all"
                                        />
                                    </div>

                                    {/* LinkedIn / Social */}
                                    <div>
                                        <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                                            LinkedIn / GitHub
                                        </label>
                                        <input
                                            type="url"
                                            value={member.social || ''}
                                            onChange={(e) => updateTeamMember(index, 'social', e.target.value)}
                                            placeholder="https://linkedin.com/in/..."
                                            className="w-full h-9 bg-zinc-50 border border-zinc-200 text-slate-900 rounded-md px-3 text-sm focus:outline-none focus:border-[#16452a] focus:bg-white transition-all"
                                        />
                                    </div>

                                    {/* Nơi công tác */}
                                    <div>
                                        <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                                            Trường / Tổ chức hiện tại
                                        </label>
                                        <input
                                            type="text"
                                            value={member.org || ''}
                                            onChange={(e) => updateTeamMember(index, 'org', e.target.value)}
                                            placeholder="VD: ĐH Bách Khoa, DUT..."
                                            className="w-full h-9 bg-zinc-50 border border-zinc-200 text-slate-900 rounded-md px-3 text-sm focus:outline-none focus:border-[#16452a] focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Nút Thêm thành viên */}
                <button
                    type="button"
                    onClick={addTeamMember}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-4 text-sm font-bold text-zinc-500 hover:border-[#16452a]/30 hover:bg-[#16452a]/5 hover:text-[#16452a] transition-all"
                >
                    <Plus className="h-4 w-4" /> Thêm người đồng hành
                </button>
                <div className="mt-8 p-5 bg-white border border-zinc-200 rounded-xl shadow-sm">
                    <label className="flex items-center gap-2 text-sm font-bold text-[#081810] mb-1.5">
                        <MessageSquareText className="w-4 h-4 text-[#16452a]" /> Mentor ask / support need <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs font-medium text-zinc-500 mb-3">
                        What specific decision or feedback do you want a mentor to review first?
                    </p>
                    <textarea
                        value={formData.supportNeed || ''}
                        onChange={(e) => updateFormData('supportNeed', e.target.value)}
                        placeholder="Example: Help us validate the first customer segment and pricing model before our pilot."
                        className="w-full min-h-[110px] bg-white border border-zinc-200 text-slate-900 rounded-xl p-4 text-sm focus:outline-none focus:border-[#16452a] focus:ring-1 focus:ring-[#16452a] transition-all shadow-sm resize-y"
                    />
                </div>
                {/* --- Phần nhập thông tin Mentor --- */}
                <div className="mt-8 p-5 bg-zinc-50 border border-zinc-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-4">
                        <UserCheck className="w-5 h-5 text-[#16452a]" />
                        <div>
                            <h3 className="text-sm font-bold text-[#081810]">Thông tin Mentor (Tùy chọn)</h3>
                            <p className="text-[11px] font-medium text-zinc-500">Người đã cố vấn và đồng hành cùng dự án của bạn.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Tên Mentor */}
                        <div>
                            <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                                Họ và tên
                            </label>
                            <input
                                type="text"
                                value={formData.mentorName || ''}
                                onChange={(e) => updateFormData('mentorName', e.target.value)}
                                placeholder="VD: TS. Nguyễn Văn A..."
                                className="w-full h-10 bg-white border border-zinc-200 text-slate-900 rounded-lg px-3 text-sm focus:outline-none focus:border-[#16452a] transition-all"
                            />
                        </div>

                        {/* Chức vụ */}
                        <div>
                            <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                                Chức vụ
                            </label>
                            <input
                                type="text"
                                value={formData.mentorRole || ''}
                                onChange={(e) => updateFormData('mentorRole', e.target.value)}
                                placeholder="VD: Giảng viên, CEO..."
                                className="w-full h-10 bg-white border border-zinc-200 text-slate-900 rounded-lg px-3 text-sm focus:outline-none focus:border-[#16452a] transition-all"
                            />
                        </div>

                        {/* Nơi công tác */}
                        <div>
                            <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                                Nơi công tác
                            </label>
                            <input
                                type="text"
                                value={formData.mentorOrg || ''}
                                onChange={(e) => updateFormData('mentorOrg', e.target.value)}
                                placeholder="VD: ĐH Bách Khoa ĐN..."
                                className="w-full h-10 bg-white border border-zinc-200 text-slate-900 rounded-lg px-3 text-sm focus:outline-none focus:border-[#16452a] transition-all"
                            />
                        </div>

                        {/* Email Mentor */}
                        <div>
                            <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                                Email liên hệ
                            </label>
                            <input
                                type="email"
                                value={formData.mentorEmail || ''}
                                onChange={(e) => updateFormData('mentorEmail', e.target.value)}
                                placeholder="mentor@domain.com"
                                className="w-full h-10 bg-white border border-zinc-200 text-slate-900 rounded-lg px-3 text-sm focus:outline-none focus:border-[#16452a] transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <hr className="border-zinc-100" />

            {/* 3. Lời thề danh dự (Cam kết) */}
            <div>
                <div className="flex items-start gap-3 p-4 border border-emerald-100 rounded-xl bg-emerald-50/50 cursor-pointer group" onClick={() => updateFormData('isCommitted', !formData.isCommitted)}>
                    <div className="flex items-center h-5 pt-0.5">
                        <input
                            id="commitment"
                            type="checkbox"
                            checked={formData.isCommitted}
                            readOnly
                            className="w-4 h-4 text-[#16452a] border-zinc-300 rounded focus:ring-[#16452a] cursor-pointer"
                        />
                    </div>
                    <div>
                        <label htmlFor="commitment" className="text-sm font-bold text-[#081810] cursor-pointer group-hover:text-[#16452a] transition-colors flex items-center gap-2">
                            <Flag className="w-4 h-4 text-emerald-600" /> Lời thề danh dự (Honor Pledge)
                        </label>
                        <p className="text-xs font-medium text-emerald-800 mt-1.5 leading-relaxed">
                            Tôi cam kết thông tin dự án là chính xác và không vi phạm tài sản trí tuệ của bên thứ ba. Tôi hiểu rằng dự án có thể bị gỡ bỏ nếu vi phạm nguyên tắc cộng đồng của Kizuna Hub.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}
