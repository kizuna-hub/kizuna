"use client";

import React, { useEffect } from "react";
import { Link } from "@/i18n/routing"; // Đảm bảo đúng đường dẫn routing của mày
import {
    Search, LayoutGrid, Folder, FileText,
    CreditCard, Link as LinkIcon, MessageSquare,
    File, ArrowUp, ArrowDown, CornerDownLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchOrCreateProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchOrCreateModal({ isOpen, onClose }: SearchOrCreateProps) {
    // Xử lý đóng Modal khi bấm phím ESC
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        // Overlay phủ mờ màn hình (Vẫn giữ nền tối để làm nổi bật White Bento Card)
        <div
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] bg-[#081810]/80 backdrop-blur-sm"
            onClick={onClose}
        >
            {/* Modal Box - Đổi sang White Bento Card (#fafafa) */}
            <div
                className="w-full max-w-2xl rounded-2xl bg-[#fafafa] border border-[#102c1e]/10 shadow-2xl overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()} // Chặn click xuyên qua overlay
            >
                {/* 1. Thanh Search Input */}
                <div className="flex items-center px-4 py-4 border-b border-[#102c1e]/10">
                    <Search className="w-5 h-5 text-[#102c1e]/50" />
                    <input
                        type="text"
                        placeholder="Search workspace..."
                        autoFocus
                        className="flex-1 bg-transparent border-none outline-none text-[#102c1e] placeholder:text-[#102c1e]/40 ml-3 font-sans text-base"
                    />
                </div>

                {/* 2. Tabs */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-[#102c1e]/10 bg-[#102c1e]/5">
                    <div className="flex gap-2">
                        {/* Tab Active: Nền tối chữ sáng */}
                        <span className="px-3 py-1 rounded bg-[#102c1e] text-[#fafafa] text-xs font-bold font-sans shadow-sm">
                            All
                        </span>
                        {/* Tab Inactive */}
                        <span className="px-3 py-1 rounded text-[#102c1e]/50 hover:text-[#102c1e] cursor-pointer transition-colors text-xs font-bold font-sans">
                            Workspace
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-[#102c1e]/40 text-[10px] font-sans">
                        <kbd className="px-1.5 py-0.5 rounded bg-[#102c1e]/10 border border-[#102c1e]/5 font-bold">Tab</kbd>
                        to switch
                    </div>
                </div>

                {/* 3. Danh sách lệnh (Scrollable) */}
                <div className="max-h-[50vh] overflow-y-auto p-2 [&::-webkit-scrollbar]:hidden">

                    {/* Mục Actions */}
                    <div className="px-3 py-2 text-[10px] font-bold text-[#102c1e]/40 uppercase tracking-widest font-sans">
                        Actions
                    </div>

                    <div className="flex flex-col gap-0.5">
                        {/* Gắn link và hàm đóng modal vào đây */}
                        <ActionItem
                            icon={LayoutGrid}
                            label="New Project"
                            shortcut="B"
                            active
                            href="/submit-project"
                            onClick={onClose}
                        />
                        <ActionItem icon={Folder} label="New folder" shortcut="F" />
                        <ActionItem icon={FileText} label="New document" shortcut="D" />
                        <ActionItem icon={CreditCard} label="New card" shortcut="C" modifier="⇧" />
                        <ActionItem icon={LinkIcon} label="Paste link" shortcut="P" />
                        <ActionItem icon={MessageSquare} label="New chat" shortcut="C" />
                    </div>

                    {/* Mục Recent */}
                    <div className="px-3 py-2 mt-2 text-[10px] font-bold text-[#102c1e]/40 uppercase tracking-widest font-sans">
                        Recent
                    </div>

                    <div className="flex flex-col gap-0.5">
                        <RecentItem icon={File} title="Untitled" subtitle="Untitled board" time="17m ago" />
                        <RecentItem icon={LayoutGrid} title="Overview" subtitle="Platform" time="2h ago" />
                    </div>
                </div>

                {/* 4. Footer hướng dẫn phím tắt */}
                <div className="flex justify-end gap-4 px-4 py-3 border-t border-[#102c1e]/10 bg-[#102c1e]/5">
                    <div className="flex items-center gap-1.5 text-[#102c1e]/50 text-[10px] font-sans">
                        <div className="flex items-center gap-0.5">
                            <kbd className="flex h-4 w-4 items-center justify-center rounded bg-[#102c1e]/10 border border-[#102c1e]/5"><ArrowUp className="w-2.5 h-2.5" /></kbd>
                            <kbd className="flex h-4 w-4 items-center justify-center rounded bg-[#102c1e]/10 border border-[#102c1e]/5"><ArrowDown className="w-2.5 h-2.5" /></kbd>
                        </div>
                        navigate
                    </div>
                    <div className="flex items-center gap-1.5 text-[#102c1e]/50 text-[10px] font-sans">
                        <kbd className="flex h-4 w-4 items-center justify-center rounded bg-[#102c1e]/10 border border-[#102c1e]/5"><CornerDownLeft className="w-2.5 h-2.5" /></kbd>
                        run
                    </div>
                </div>

            </div>
        </div>
    );
}

// --- Sub-component cho Action Item (CẬP NHẬT HỖ TRỢ LINK) ---
const ActionItem = ({ icon: Icon, label, shortcut, modifier, active = false, href, onClick }: any) => {
    // Tách phần ruột ra để dùng chung cho cả Link và Div
    const content = (
        <>
            <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span className="font-sans text-sm font-bold">{label}</span>
            </div>
            {shortcut && (
                <kbd className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#102c1e]/5 border border-[#102c1e]/10 text-[#102c1e]/50 group-hover:text-[#102c1e]/80 text-[10px] font-sans font-bold transition-colors">
                    {modifier && <span>{modifier}</span>}
                    <span>{shortcut}</span>
                </kbd>
            )}
        </>
    );

    // Style chung
    const className = cn(
        "flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors group",
        active ? "bg-[#102c1e]/5 text-[#102c1e]" : "text-[#102c1e]/70 hover:bg-[#102c1e]/5 hover:text-[#102c1e]"
    );

    // Nếu có href thì render thẻ Link, ngược lại render thẻ Div bình thường
    if (href) {
        return (
            <Link href={href} onClick={onClick} className={className}>
                {content}
            </Link>
        );
    }

    return (
        <div onClick={onClick} className={className}>
            {content}
        </div>
    );
};

// --- Sub-component cho Recent Item (Đổi màu sang Light Mode) ---
const RecentItem = ({ icon: Icon, title, subtitle, time }: any) => (
    <div className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-[#102c1e]/70 hover:bg-[#102c1e]/5 hover:text-[#102c1e] group">
        <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#102c1e]/5 border border-[#102c1e]/10">
                <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
                <span className="font-sans text-sm font-bold text-[#102c1e]">{title}</span>
                <span className="font-sans text-[10px] font-medium text-[#102c1e]/50">{subtitle}</span>
            </div>
        </div>
        <span className="font-sans text-[10px] text-[#102c1e]/40 group-hover:text-[#102c1e]/60 transition-colors">
            {time}
        </span>
    </div>
);