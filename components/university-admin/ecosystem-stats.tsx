"use client";
import React from "react";
import { Users, ChevronRight, Award, Briefcase } from "lucide-react";

export function EcosystemStats() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Col 1: Lĩnh Vực Trọng Điểm (DONUT CHART) */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col">
                <h3 className="text-lg font-bold text-zinc-900 mb-6">Lĩnh Vực Trọng Điểm</h3>

                <div className="flex-1 flex flex-col items-center justify-center">
                    {/* CSS Donut Chart */}
                    <div className="relative w-40 h-40 rounded-full flex items-center justify-center"
                        style={{ background: `conic-gradient(#102c1e 0% 45%, #10b981 45% 70%, #f59e0b 70% 85%, #d4d4d8 85% 100%)` }}>
                        <div className="w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                            <span className="text-2xl font-bold text-zinc-900">124</span>
                            <span className="text-[10px] text-zinc-500 uppercase">Dự án</span>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="w-full mt-8 space-y-3">
                        <div className="flex items-center justify-between text-sm"><div className="flex items-center"><span className="w-3 h-3 rounded-full bg-kizuna-primary mr-2"></span><span className="font-medium text-zinc-700">AI & DeepTech</span></div><span className="font-bold">45%</span></div>
                        <div className="flex items-center justify-between text-sm"><div className="flex items-center"><span className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></span><span className="font-medium text-zinc-700">EdTech</span></div><span className="font-bold">25%</span></div>
                        <div className="flex items-center justify-between text-sm"><div className="flex items-center"><span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span><span className="font-medium text-zinc-700">AgriTech & Bio</span></div><span className="font-bold">15%</span></div>
                    </div>
                </div>
            </div>

            {/* Col 2: Sinh viên tham gia theo Khoa (GRADIENT BARS) */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-zinc-900">Mật độ theo Khoa</h3>
                    <Users className="w-5 h-5 text-zinc-400" />
                </div>
                <div className="space-y-5">
                    {[
                        { name: "Khoa Công nghệ Thông tin", students: 160, width: "62.5%", color: "from-blue-400 to-kizuna-primary" },
                        { name: "Khoa Cơ khí", students: 80, width: "31.25%", color: "from-zinc-300 to-zinc-500" },
                        { name: "Khoa Môi trường", students: 60, width: "23.44%", color: "from-emerald-300 to-emerald-500" },
                        { name: "Khoa Điện", students: 55, width: "21.48%", color: "from-amber-300 to-amber-500" },
                        { name: "Khoa Điện Tử Viễn Thông", students: 45, width: "17.58%", color: "from-purple-300 to-purple-500" },
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                            <div className="flex justify-between text-xs">
                                <span className="font-medium text-zinc-600">{item.name}</span>
                                <span className="font-bold text-zinc-900">{item.students} sv</span>
                            </div>
                            <div className="h-2.5 bg-zinc-100 rounded-full w-full overflow-hidden">
                                <div className={`h-full bg-gradient-to-r ${item.color} rounded-full`} style={{ width: item.width }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Col 3: Bảng Vàng & Top Mentors */}
            <div className="flex flex-col gap-6">
                {/* Bảng Vàng */}
                <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex-1">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-md font-bold text-zinc-900 flex items-center gap-2"><Award className="w-4 h-4 text-amber-500" /> Bảng Vàng Đầu Tư</h3>
                    </div>
                    <div className="space-y-3">
                        {[
                            { name: "MindGuard AI", raised: "4.5 Tỷ", fund: "VinaCapital Ventures", faculty: "CNTT" },
                            { name: "EcoFarm Plus", raised: "3.2 Tỷ", fund: "Quỹ SHi Đà Nẵng", faculty: "Môi trường" },
                        ].map((project, idx) => (
                            <div key={idx} className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 relative">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                                            {project.name}
                                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700">{project.faculty}</span>
                                        </h4>
                                        <p className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1"><Briefcase className="w-3 h-3" /> {project.fund}</p>
                                    </div>
                                    <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{project.raised}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Mentors */}
                <div className="bg-gradient-to-r from-zinc-900 to-kizuna-primary rounded-2xl p-5 shadow-sm text-white">
                    <h3 className="text-sm font-bold mb-3 flex items-center gap-2">🏆 Cố vấn Tiêu biểu</h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold border border-white/30">TM</div>
                            <div>
                                <p className="text-sm font-bold">TS. Trần Minh</p>
                                <p className="text-[11px] text-zinc-300">Đỡ đầu: 5 dự án thành công</p>
                            </div>
                        </div>
                        <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}