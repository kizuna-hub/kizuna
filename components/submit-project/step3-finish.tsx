"use client";

import React from "react";
import { Users, Trash2, Plus, Flag, Activity } from "lucide-react";
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
            </div>

            <hr className="border-zinc-100" />

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
                <p className="text-xs font-medium text-zinc-500 mb-4">Thêm những người đồng hành cùng bạn (Tùy chọn).</p>

                <div className="space-y-4">
                    {formData.team.map((member: any, index: number) => (
                        <div key={index} className="relative rounded-xl border border-zinc-200 bg-white p-5 shadow-sm group">

                            {/* Nút xóa thành viên (Không xóa người đầu tiên) */}
                            {formData.team.length > 1 && index !== 0 && (
                                <button
                                    onClick={() => removeTeamMember(index)}
                                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-zinc-200 text-zinc-400 hover:text-red-500 hover:border-red-200 shadow-sm transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Tên / Username */}
                                <div>
                                    <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                                        Tên hiển thị / Username
                                    </label>
                                    <input
                                        type="text"
                                        value={member.name}
                                        onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                                        placeholder={index === 0 ? "Tên của bạn..." : "Nhập tên..."}
                                        className="w-full h-10 bg-zinc-50 border border-zinc-200 text-slate-900 rounded-lg px-3 text-sm focus:outline-none focus:border-[#16452a] focus:bg-white transition-all"
                                    />
                                </div>

                                {/* Vai trò (Toggle Buttons) */}
                                <div>
                                    <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                                        Năng lực cốt lõi
                                    </label>
                                    <div className="flex items-center gap-1.5 h-10 bg-zinc-100 p-1 rounded-lg border border-zinc-200">
                                        <button
                                            onClick={() => updateTeamMember(index, 'role', 'Tech')}
                                            className={cn("flex-1 h-full rounded text-[11px] font-bold transition-all", member.role === 'Tech' ? "bg-white text-[#081810] shadow-sm" : "text-zinc-500 hover:text-zinc-700")}
                                        >
                                            Hacker (Tech)
                                        </button>
                                        <button
                                            onClick={() => updateTeamMember(index, 'role', 'Biz')}
                                            className={cn("flex-1 h-full rounded text-[11px] font-bold transition-all", member.role === 'Biz' ? "bg-white text-[#081810] shadow-sm" : "text-zinc-500 hover:text-zinc-700")}
                                        >
                                            Hustler (Biz)
                                        </button>
                                        <button
                                            onClick={() => updateTeamMember(index, 'role', 'Design')}
                                            className={cn("flex-1 h-full rounded text-[11px] font-bold transition-all", member.role === 'Design' ? "bg-white text-[#081810] shadow-sm" : "text-zinc-500 hover:text-zinc-700")}
                                        >
                                            Hipster (Design)
                                        </button>
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