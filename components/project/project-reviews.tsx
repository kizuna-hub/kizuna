"use client";
import React from "react";
import { Star } from "lucide-react";

export function ProjectReviews() {
    return (
        <div className="mb-16">
            <h2 className="mb-6 text-xl font-bold text-[#081810]">Reviews & comments</h2>

            {/* Empty Review Box */}
            <div className="mb-6 flex flex-col items-center justify-center rounded-card border border-zinc-200 bg-white py-10 shadow-sm">
                <div className="flex text-zinc-300 mb-2">
                    <Star className="h-6 w-6" /><Star className="h-6 w-6" /><Star className="h-6 w-6" /><Star className="h-6 w-6" /><Star className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-zinc-500 mb-4">No reviews yet</p>
                <button className="rounded-full border border-zinc-200 bg-white px-5 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-zinc-50">
                    Write the first review
                </button>
            </div>

            {/* Comment Input */}
            <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-zinc-200" />
                <div className="flex-1 rounded-[14px] border border-zinc-200 bg-white p-3 shadow-sm">
                    <textarea
                        placeholder="Write your comment..."
                        className="w-full resize-none bg-transparent text-sm font-medium outline-none placeholder:text-zinc-400"
                        rows={2}
                    />
                    <div className="flex justify-end mt-2">
                        <button className="rounded-full bg-zinc-100 px-4 py-1.5 text-xs font-bold text-zinc-400 transition-colors hover:bg-[#16452a] hover:text-white">
                            Post comment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}