"use client";

import React from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PitchDeckEditorProps {
    sections: any[];
    activeSection: string;
    content: Record<string, string>;
    onContentChange: (id: string, value: string) => void;
    onAIPolish: (id: string) => void;
    isPolishing: boolean;
}

export function PitchDeckEditor({
    sections,
    activeSection,
    content,
    onContentChange,
    onAIPolish,
    isPolishing
}: PitchDeckEditorProps) {
    return (
        <div className="flex flex-col gap-6">
            {sections.map((section) => (
                <div
                    key={section.id}
                    id={section.id}
                    className={cn(
                        "rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300",
                        activeSection === section.id ? "border-[#16452a] ring-1 ring-[#16452a]/10 shadow-md" : "border-zinc-200"
                    )}
                >
                    <div className="flex items-center gap-2.5 mb-4">
                        <div className={cn(
                            "p-2 rounded-xl transition-colors",
                            activeSection === section.id ? "bg-[#16452a]/10 text-[#16452a]" : "bg-zinc-100 text-zinc-500"
                        )}>
                            <section.icon className="w-4.5 h-4.5" />
                        </div>
                        <h2 className="text-base font-bold text-[#081810]">{section.title}</h2>
                    </div>

                    <textarea
                        value={content[section.id] || ""}
                        onChange={(e) => onContentChange(section.id, e.target.value)}
                        placeholder={section.placeholder}
                        className="w-full min-h-[160px] p-4 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-slate-700 outline-none focus:border-[#16452a] focus:bg-white resize-none transition-all shadow-inner leading-relaxed"
                    />

                    <div className="mt-4 flex items-center justify-end border-t border-zinc-100 pt-3.5">
                        <button
                            onClick={() => onAIPolish(section.id)}
                            disabled={isPolishing}
                            /* Đã xóa disabled:cursor-wait và thay bằng disabled:cursor-not-allowed */
                            className="group relative flex items-center gap-1.5 px-4 h-9 rounded-full bg-gradient-to-r from-emerald-700 to-[#16452a] text-white text-xs font-bold shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed overflow-hidden"
                        >
                            <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                                {isPolishing && activeSection === section.id ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin absolute" />
                                ) : (
                                    <Sparkles className="w-3.5 h-3.5 absolute transition-transform group-hover:scale-110" />
                                )}
                            </div>
                            <span>
                                {isPolishing && activeSection === section.id ? 'Đang gọt giũa...' : 'AI Polish'}
                            </span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}