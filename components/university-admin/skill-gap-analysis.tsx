"use client";
import React from "react";
import { Radar, AlertTriangle, Lightbulb } from "lucide-react";

export function SkillGapAnalysis() {
    const skills = [
        { name: "Phát triển Sản phẩm (MVP)", actual: 85, expected: 70, color: "bg-emerald-500" },
        { name: "Mô hình Kinh doanh", actual: 60, expected: 75, color: "bg-amber-500" },
        { name: "Pitching & Thuyết trình", actual: 75, expected: 80, color: "bg-blue-500" },
        { name: "Kế hoạch Tài chính", actual: 35, expected: 80, color: "bg-red-500" },
        { name: "Pháp lý & IP", actual: 40, expected: 70, color: "bg-orange-500" },
    ];

    return (
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-zinc-900">Lỗ hổng Năng lực (Skill-Gap)</h3>
                    <p className="text-sm text-zinc-500 mt-1">Đánh giá trung bình từ AI Policy Navigator</p>
                </div>
                <div className="p-2 bg-kizuna-primary/10 rounded-lg text-kizuna-primary">
                    <Radar className="w-5 h-5" />
                </div>
            </div>

            <div className="space-y-4 flex-1">
                {skills.map((skill, idx) => (
                    <div key={idx} className="relative">
                        <div className="flex justify-between text-xs font-medium mb-1">
                            <span className="text-zinc-700">{skill.name}</span>
                            <span className={`${skill.actual < skill.expected ? 'text-red-600 font-bold' : 'text-zinc-600'}`}>
                                {skill.actual}/100
                            </span>
                        </div>
                        <div className="h-2.5 w-full bg-zinc-100 rounded-full relative overflow-hidden">
                            {/* Vạch kỳ vọng (Target) */}
                            <div
                                className="absolute top-0 bottom-0 border-r-2 border-zinc-400 z-10"
                                style={{ width: `${skill.expected}%` }}
                                title={`Kỳ vọng: ${skill.expected}`}
                            ></div>
                            {/* Thanh thực tế (Actual) */}
                            <div
                                className={`h-full ${skill.color} rounded-full`}
                                style={{ width: `${skill.actual}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-900 leading-relaxed">
                    <span className="font-bold">Cảnh báo Đỏ:</span> Sinh viên cực kỳ yếu ở mảng <span className="underline">Tài chính</span> và <span className="underline">Pháp lý</span>. Đề xuất Đoàn trường phối hợp với Khoa Kinh tế tổ chức Workshop gấp.
                </p>
            </div>
        </div>
    );
}