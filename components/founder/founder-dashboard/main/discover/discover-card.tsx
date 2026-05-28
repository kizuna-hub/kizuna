"use client";

import React from "react";
import { Heart, MessageCircle, Share2, Bookmark, BarChart3, MoreHorizontal } from "lucide-react";

export function DiscoverCard({ post }: { post: any }) {
    return (
        <div className="break-inside-avoid flex flex-col rounded-2xl bg-white border border-[#102c1e]/10 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">

            {/* Header: Author & Options */}
            <div className="p-5 pb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <img src={post.author.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover border border-slate-100" />
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="font-geist text-sm font-bold text-[#102c1e]">{post.author.name}</span>
                            <span className="font-geist text-xs text-slate-400">{post.time}</span>
                        </div>
                        <span className="font-geist text-[11px] text-slate-500">{post.author.handle}</span>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-[#102c1e] transition-colors p-1">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            {/* Text Content */}
            <div className="px-5 pb-4">
                <p className="font-inter text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                </p>
            </div>

            {/* Media & Visual Anchor */}
            {post.image && (
                <div className="relative w-full">
                    <img src={post.image} alt="post media" className="w-full h-auto object-cover max-h-[300px]" />
                    {post.highlight && (
                        <div className="absolute bottom-3 right-3 rounded-full bg-[#a1e2b6] px-2.5 py-1 font-geist text-[10px] font-black text-[#102c1e] shadow-lg border border-[#102c1e]/10">
                            {post.highlight}
                        </div>
                    )}
                </div>
            )}

            {/* Text-only Visual Anchor */}
            {!post.image && post.highlight && (
                <div className="px-5 pb-4">
                    <span className="inline-block rounded-full bg-[#a1e2b6]/20 border border-[#a1e2b6]/50 px-2.5 py-1 font-geist text-[10px] font-black text-[#102c1e]">
                        {post.highlight}
                    </span>
                </div>
            )}

            {/* Footer Metrics */}
            <div className="px-5 py-4 border-t border-[#102c1e]/5 flex items-center justify-between bg-[#fafafa]/50">
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1.5 text-slate-500 hover:text-[#102c1e] transition-colors group/btn">
                        <Heart className="w-4 h-4 group-hover/btn:fill-[#102c1e]/10" />
                        <span className="font-geist text-xs font-medium">{post.metrics.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-slate-500 hover:text-[#102c1e] transition-colors group/btn">
                        <MessageCircle className="w-4 h-4 group-hover/btn:fill-[#102c1e]/10" />
                        <span className="font-geist text-xs font-medium">{post.metrics.comments}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-slate-500 hover:text-[#102c1e] transition-colors">
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-slate-400 font-geist text-xs">
                        <BarChart3 className="w-3.5 h-3.5" /> {post.metrics.views}
                    </span>
                    <button className="text-slate-400 hover:text-[#102c1e] transition-colors">
                        <Bookmark className="w-4 h-4" />
                    </button>
                </div>
            </div>

        </div>
    );
}