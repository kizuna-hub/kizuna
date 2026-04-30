"use client";
import React from "react";
import { Activity, Layers, Lightbulb, Info } from "lucide-react";
import {
    AreaChart,
    Area,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export function StartupTrends() {
    // Dữ liệu mô phỏng: current = Năm nay (Đường chính), previous = Mục tiêu/Năm ngoái (Đường nét đứt)
    const data = [
        { month: "T1", current: 30, previous: 40 },
        { month: "T2", current: 45, previous: 55 },
        { month: "T3", current: 80, previous: 65 },
        { month: "T4", current: 100, previous: 70 }, // Đỉnh điểm sự kiện
        { month: "T5", current: 60, previous: 50 },
        { month: "T6", current: 50, previous: 60 },
        { month: "T7", current: 65, previous: 55 },
        { month: "T8", current: 90, previous: 75 },
    ];

    // Custom Tooltip cho biểu đồ an toàn 100%
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            // Tìm đúng dataKey thay vì dùng index [0] hay [1] dễ gây crash
            const currentData = payload.find((item: any) => item.dataKey === 'current');
            const previousData = payload.find((item: any) => item.dataKey === 'previous');

            return (
                <div className="bg-white p-3 border border-zinc-200 rounded-lg shadow-lg">
                    <p className="font-bold text-zinc-900 mb-2">{label}</p>
                    <div className="space-y-1">
                        {/* Render an toàn khi tìm thấy data */}
                        {currentData && (
                            <p className="text-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-kizuna-primary"></span>
                                <span className="text-zinc-600">Thực tế:</span>
                                <span className="font-bold text-zinc-900">{currentData.value}</span>
                            </p>
                        )}

                        {previousData && (
                            <p className="text-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-zinc-400"></span>
                                <span className="text-zinc-600">Kỳ vọng:</span>
                                <span className="font-bold text-zinc-900">{previousData.value}</span>
                            </p>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 mb-8">
            {/* Left: Trend Area Chart (60%) */}
            <div className="lg:col-span-6 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-zinc-900">Biểu đồ Điểm Chạm Khởi Nghiệp</h3>
                        <p className="text-sm text-zinc-500 mt-1">Xu hướng tham gia theo thời gian thực</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center text-xs font-medium text-zinc-600">
                            <div className="w-2 h-2 rounded-full bg-zinc-400 mr-2"></div> Kỳ vọng
                        </span>
                        <span className="flex items-center text-xs font-medium text-zinc-900">
                            <div className="w-2 h-2 rounded-full bg-kizuna-primary mr-2"></div> Thực tế
                        </span>
                    </div>
                </div>

                {/* Recharts Implementation */}
                <div className="flex-1 w-full min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#102c1e" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#102c1e" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#f4f4f5" />

                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#a1a1aa', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#a1a1aa', fontSize: 12 }}
                            />

                            <Tooltip content={<CustomTooltip />} />

                            {/* Đường nét đứt (Kỳ vọng / Năm ngoái) */}
                            <Line
                                type="monotone"
                                dataKey="previous"
                                stroke="#a1a1aa"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                dot={false}
                                activeDot={false}
                            />

                            {/* Đường Area chính (Thực tế) */}
                            <Area
                                type="monotone"
                                dataKey="current"
                                stroke="#102c1e"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorCurrent)"
                                activeDot={{ r: 6, fill: "#ffffff", stroke: "#102c1e", strokeWidth: 2 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Actionable Insight */}
                <div className="mt-6 p-4 bg-kizuna-primary/5 border border-kizuna-primary/10 rounded-xl flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-kizuna-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-zinc-700 leading-relaxed">
                        <span className="font-semibold text-kizuna-primary">Phân tích:</span> Đỉnh điểm Tháng 4 chứng tỏ sức hút cực lớn của sự kiện offline. Đề xuất tung ngay gói "Ươm mầm Server" vào đầu Tháng 5 để giữ nhiệt cho các team bị loại.
                    </p>
                </div>
            </div>

            {/* Right: The TRUE Funnel (40%) */}
            <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-zinc-900">Phễu Chuyển Đổi Startup</h3>
                    <Layers className="w-5 h-5 text-zinc-400" />
                </div>

                <div className="flex-1 flex flex-col items-center justify-center space-y-2">
                    {/* Step 1 */}
                    <div className="w-full bg-zinc-100 border-l-4 border-zinc-400 rounded-r-lg p-3 flex justify-between items-center shadow-sm relative group">
                        <div>
                            <p className="text-xs font-medium text-zinc-500">Tầng 1</p>
                            <h4 className="text-sm font-bold text-zinc-800">Ý tưởng thô</h4>
                        </div>
                        <span className="text-xl font-bold text-zinc-900">500</span>
                    </div>

                    {/* Step 2 */}
                    <div className="w-[85%] bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-3 flex justify-between items-center shadow-sm">
                        <div>
                            <p className="text-xs font-medium text-blue-600/70">Tầng 2</p>
                            <h4 className="text-sm font-bold text-blue-900">Đã có MVP</h4>
                        </div>
                        <span className="text-xl font-bold text-blue-900">150</span>
                    </div>

                    {/* Step 3 */}
                    <div className="w-[70%] bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-3 flex justify-between items-center shadow-sm relative group">
                        <div>
                            <p className="text-xs font-medium text-amber-700/70">Tầng 3</p>
                            <h4 className="text-sm font-bold text-amber-900">Nhận Mentor</h4>
                        </div>
                        <div className="flex items-center gap-2">
                            <Info className="w-4 h-4 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                            <span className="text-xl font-bold text-amber-900">50</span>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="w-[55%] bg-gradient-to-r from-emerald-50 to-emerald-100 border-l-4 border-emerald-500 rounded-r-lg p-3 flex justify-between items-center shadow-md">
                        <div>
                            <p className="text-xs font-medium text-emerald-700/70">Thành quả</p>
                            <h4 className="text-sm font-bold text-emerald-900">Gọi Vốn Thành Công</h4>
                        </div>
                        <span className="text-xl font-bold text-emerald-900">10</span>
                    </div>
                </div>

                <div className="mt-4 text-center">
                    <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                        Tỷ lệ thành công (Win-rate): 2.0%
                    </span>
                </div>
            </div>
        </div>
    );
}