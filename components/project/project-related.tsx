// components/project/project-related.tsx
"use client";

import React from "react";
import { MessageCircle, Flame } from "lucide-react";
import { projectData, relatedProjectsData } from "./data";
import { cn } from "@/lib/utils";

// Component con Render Card Dự Án
const ProjectCard = ({ project }: { project: any }) => (
    <div className="flex gap-4 rounded-[14px] border border-zinc-200 bg-white px-6 py-4 shadow-sm hover:border-zinc-300 hover:shadow-md cursor-pointer transition-all">

        {/* Logo giữ nguyên kích thước h-12 w-12 */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-zinc-100 mt-1 overflow-hidden">
            <img
                src={project.logo}
                alt={`${project.name} Logo`}
                className="h-full w-full object-cover rounded-[11px]"
            />
        </div>

        {/* Nội dung Text */}
        <div className="flex-1 min-w-0">
            {/* Đã bỏ truncate để tiêu đề có thể xuống dòng nếu quá dài, tuy nhiên tên project thường ngắn nên giữ block bình thường là ổn */}
            <h4 className="text-sm font-bold text-[#081810] leading-tight mt-0.5">{project.name}</h4>

            {/* Đã đổi từ line-clamp-1 sang line-clamp-2 để text tự nhiên rớt xuống dòng thứ 2 */}
            <p className="mt-1 text-xs font-medium text-slate-500 line-clamp-2 leading-relaxed pr-2">
                {project.desc}
            </p>

            {/* Stats */}
            <div className="mt-2.5 flex items-center gap-4 text-xs font-bold text-zinc-400">
                <div className="flex items-center gap-1.5 hover:text-orange-500 transition-colors">
                    <Flame className="h-3.5 w-3.5 text-zinc-300" />
                    <span className="font-mono">{project.claps}</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                    <MessageCircle className="h-3.5 w-3.5 text-zinc-300" />
                    <span className="font-mono">{project.comments}</span>
                </div>
            </div>
        </div>
    </div>
);

export function ProjectRelated() {
    return (
        <div className="mt-8 flex flex-col gap-12">

            {/* SECTION 1: More from Maker */}
            <div>
                <h3 className="mb-5 text-lg font-bold text-[#081810]">
                    More from {projectData.maker.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {relatedProjectsData.moreFromMaker.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            </div>

            {/* SECTION 2: Related Products */}
            <div className="border-t border-zinc-200 pt-12">
                <h3 className="mb-5 text-lg font-bold text-[#081810]">
                    Related products
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {relatedProjectsData.relatedProducts.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            </div>

        </div>
    );
}