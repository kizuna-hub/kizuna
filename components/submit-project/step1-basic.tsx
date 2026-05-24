"use client";

import React from "react";
import { User, Telescope, Box, Mic, ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step1BasicProps {
    formData: any;
    updateFormData: (field: string, value: any) => void;
}

export function Step1Basic({ formData, updateFormData }: Step1BasicProps) {
    return (
        <div className="space-y-10">

            {/* 1. Chọn Vai trò (Role Selection) */}
            <div>
                <label className="text-sm font-bold text-[#081810] mb-4 block">
                    Vai trò của bạn trong dự án này là gì? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Card: Founder */}
                    <div
                        onClick={() => updateFormData('role', 'founder')}
                        className={cn(
                            "cursor-pointer rounded-2xl border-2 p-5 transition-all",
                            formData.role === 'founder'
                                ? "border-[#16452a] bg-[#16452a]/5 shadow-sm"
                                : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                        )}
                    >
                        <div className="flex items-start gap-4">
                            <div className={cn(
                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
                                formData.role === 'founder' ? "bg-[#16452a] text-white" : "bg-zinc-100 text-zinc-500"
                            )}>
                                <User className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className={cn("text-sm font-bold mb-1", formData.role === 'founder' ? "text-[#081810]" : "text-slate-700")}>
                                    Tôi là Tác giả (Maker)
                                </h3>
                                <p className="text-xs font-medium text-slate-500 leading-relaxed">
                                    Tôi là người sáng lập hoặc nằm trong đội ngũ phát triển sản phẩm này.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card: Hunter */}
                    <div
                        onClick={() => updateFormData('role', 'hunter')}
                        className={cn(
                            "cursor-pointer rounded-2xl border-2 p-5 transition-all",
                            formData.role === 'hunter'
                                ? "border-[#16452a] bg-[#16452a]/5 shadow-sm"
                                : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                        )}
                    >
                        <div className="flex items-start gap-4">
                            <div className={cn(
                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
                                formData.role === 'hunter' ? "bg-[#16452a] text-white" : "bg-zinc-100 text-zinc-500"
                            )}>
                                <Telescope className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className={cn("text-sm font-bold mb-1", formData.role === 'hunter' ? "text-[#081810]" : "text-slate-700")}>
                                    Tôi là Người đề cử (Hunter)
                                </h3>
                                <p className="text-xs font-medium text-slate-500 leading-relaxed">
                                    Tôi thấy sản phẩm này rất thú vị và muốn chia sẻ nó với cộng đồng.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="border-zinc-100" />

            {/* 2. Tên & Slogan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Tên dự án */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-[#081810] mb-1.5">
                        <Box className="w-4 h-4 text-zinc-400" /> Tên dự án <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs font-medium text-zinc-500 mb-3">Tên sản phẩm hoặc startup của bạn.</p>
                    <input
                        type="text"
                        value={formData.projectName}
                        onChange={(e) => updateFormData('projectName', e.target.value)}
                        placeholder="VD: Kizuna Hub"
                        className="w-full h-11 bg-white border border-zinc-200 text-slate-900 rounded-xl px-4 text-sm focus:outline-none focus:border-[#16452a] focus:ring-1 focus:ring-[#16452a] transition-all shadow-sm"
                    />
                </div>

                {/* Slogan */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="flex items-center gap-2 text-sm font-bold text-[#081810]">
                            <Mic className="w-4 h-4 text-zinc-400" /> Slogan (Elevator Pitch) <span className="text-red-500">*</span>
                        </label>
                        <span className={cn(
                            "text-[10px] font-bold",
                            formData.slogan.length > 80 ? "text-red-500" : "text-zinc-400"
                        )}>
                            {formData.slogan.length}/80
                        </span>
                    </div>
                    <p className="text-xs font-medium text-zinc-500 mb-3">Một câu ngắn gọn mô tả giá trị cốt lõi.</p>
                    <input
                        type="text"
                        maxLength={80}
                        value={formData.slogan}
                        onChange={(e) => updateFormData('slogan', e.target.value)}
                        placeholder="VD: Mạng lưới kết nối Founder & Mentor số 1 Việt Nam"
                        className={cn(
                            "w-full h-11 bg-white border text-slate-900 rounded-xl px-4 text-sm focus:outline-none transition-all shadow-sm",
                            formData.slogan.length > 80
                                ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                : "border-zinc-200 focus:border-[#16452a] focus:ring-1 focus:ring-[#16452a]"
                        )}
                    />
                </div>
            </div>

            {/* 3. Logo/Thumbnail */}
            {/* 3. Logo/Thumbnail */}
            <div>
                <label className="flex items-center gap-2 text-sm font-bold text-[#081810] mb-1.5">
                    <ImagePlus className="w-4 h-4 text-zinc-400" /> Logo sản phẩm
                </label>
                <p className="text-xs font-medium text-zinc-500 mb-4">Dùng ảnh vuông (1:1), định dạng JPG/PNG. Tối đa 2MB.</p>

                <div className="flex items-start gap-6">
                    {/* Thumbnail Preview */}
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[18px] border-2 border-dashed border-zinc-300 bg-zinc-50 overflow-hidden relative group">
                        {formData.logoUrl ? (
                            <>
                                <img src={formData.logoUrl} alt="Logo preview" className="h-full w-full object-cover" />
                                {/* Overlay mờ đi khi di chuột vào để hiện nút Xóa */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            // Xóa URL preview để giải phóng bộ nhớ
                                            if (formData.logoUrl.startsWith('blob:')) {
                                                URL.revokeObjectURL(formData.logoUrl);
                                            }
                                            updateFormData('logoUrl', '');
                                        }}
                                        className="text-white text-xs font-bold hover:underline"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </>
                        ) : (
                            <ImagePlus className="h-6 w-6 text-zinc-300" />
                        )}
                    </div>

                    {/* Nút Upload Thực tế */}
                    <div className="flex-1 pt-2">
                        {/* Thẻ label này hoạt động như một nút bấm. 
                          Thuộc tính htmlFor="logo-upload" sẽ liên kết nó với cái thẻ <input type="file"> đang bị ẩn ở dưới.
                        */}
                        <label
                            htmlFor="logo-upload"
                            className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:bg-zinc-50 hover:text-[#081810]"
                        >
                            Tải ảnh lên
                        </label>
                        <input
                            id="logo-upload"
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                            className="hidden" // Ẩn cái input xấu xí mặc định của trình duyệt đi
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    // Kiểm tra dung lượng (Ví dụ: < 2MB)
                                    if (file.size > 2 * 1024 * 1024) {
                                        alert("File quá lớn. Vui lòng chọn ảnh dưới 2MB.");
                                        return;
                                    }

                                    // Tạo một URL tạm thời trong trình duyệt để preview ảnh ngay lập tức
                                    const previewUrl = URL.createObjectURL(file);

                                    // Ở đây tao lưu cái previewUrl vào formData.logoUrl để hiển thị.
                                    // TRONG THỰC TẾ (khi call API): Mày sẽ cần lưu cả cái object `file` này vào một state khác (ví dụ: formData.logoFile) 
                                    // để sau này bắn cái file vật lý đó lên Supabase/AWS S3.
                                    updateFormData('logoUrl', previewUrl);
                                }
                            }}
                        />
                        <p className="mt-2 text-[11px] font-medium text-zinc-400">
                            Ảnh sẽ được bo góc tự động khi hiển thị.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}