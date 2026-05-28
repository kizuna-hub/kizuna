"use client";

import React from "react";
import { Crown, X } from "lucide-react";

interface PaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
}

export function PaywallModal({ isOpen, onClose, title, description }: PaywallModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200 border border-zinc-100">
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 transition-colors">
                    <X className="w-5 h-5" />
                </button>
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6 mx-auto shadow-inner">
                    <Crown className="w-8 h-8 text-amber-500" />
                </div>
                <h2 className="text-2xl font-black text-center text-[#081810] tracking-tight mb-2">{title}</h2>
                <p className="text-sm text-center text-slate-500 mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: description }} />
                <button className="w-full py-3.5 bg-[#16452a] hover:bg-[#0a1c13] text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98]">
                    Nâng cấp Premium Ngay
                </button>
            </div>
        </div>
    );
}