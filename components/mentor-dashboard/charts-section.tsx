import {
    LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts';
import { valuationData, skillData } from '../../app/[locale]/mentor-dashboard/mock-data';
import { TrendingUp, Target } from 'lucide-react';

export const ChartsSection = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Biểu đồ 1: Portfolio Growth (CẬP NHẬT GIAO DIỆN LINE CHUẨN) */}
            <div className="lg:col-span-8 bg-[#ffffff] border border-[#e4e4e7] rounded-3xl p-8 shadow-sm">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-lg font-black text-[#18181b] tracking-tighter flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[#16452a]" /> Tăng trưởng định giá (Portfolio)
                        </h2>
                        <p className="text-xs font-bold text-[#71717a] mt-1">Tổng định giá các dự án sinh viên đang dẫn dắt</p>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-black text-[#16452a]">85 Tr VNĐ</p>
                        <p className="text-[10px] font-black text-[#00BFA5] bg-[#00BFA5]/10 px-2 py-1 rounded-md mt-1 inline-block border border-[#00BFA5]/20">+40% So với quý trước</p>
                    </div>
                </div>
                <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={valuationData} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                            {/* Lưới tọa độ 1:1 (Cartesian Grid) - Nét đứt hiện đại */}
                            <CartesianGrid
                                stroke="#e4e4e7"
                                strokeDasharray="4 4"
                                vertical={true}
                                horizontal={true}
                            />

                            {/* Trục hoành (Thời gian) */}
                            <XAxis
                                dataKey="month"
                                axisLine={{ stroke: '#e4e4e7', strokeWidth: 1.5 }}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#71717a', fontWeight: 800 }}
                                dy={10} // Đẩy text xuống 1 chút cho thoáng
                            />

                            {/* Trục tung (Giá trị tiền) */}
                            <YAxis
                                axisLine={{ stroke: '#e4e4e7', strokeWidth: 1.5 }}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#71717a', fontWeight: 800 }}
                                tickFormatter={(value) => `${value}Tr`} // Format thêm chữ Tr
                                dx={-10}
                            />

                            {/* Tooltip khi di chuột */}
                            <Tooltip
                                formatter={(value) => [`${value} Triệu VNĐ`, 'Định giá']}
                                contentStyle={{
                                    borderRadius: '12px',
                                    border: '1px solid #e4e4e7',
                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                    fontWeight: 'bold',
                                    fontSize: '12px'
                                }}
                                cursor={{ stroke: '#00BFA5', strokeWidth: 1.5, strokeDasharray: '4 4' }} // Đường gióng ngang/dọc khi di chuột
                            />

                            {/* Đường Line thẳng tưng (linear) có điểm Node */}
                            <Line
                                type="linear" // Đổi từ monotone (cong) sang linear (thẳng tưng)
                                dataKey="valuation"
                                stroke="#16452a"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#ffffff', stroke: '#16452a', strokeWidth: 2.5 }} // Nút tròn tĩnh
                                activeDot={{ r: 6, fill: '#00BFA5', stroke: '#ffffff', strokeWidth: 2 }} // Nút tròn khi Hover
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Biểu đồ 2: Skill Demand Radar (GIỮ NGUYÊN) */}
            <div className="lg:col-span-4 bg-[#ffffff] border border-[#e4e4e7] rounded-3xl p-8 shadow-sm flex flex-col">
                <div className="mb-4">
                    <h2 className="text-lg font-black text-[#18181b] tracking-tighter flex items-center gap-2">
                        <Target className="w-5 h-5 text-[#16452a]" /> Nhu cầu kỹ năng
                    </h2>
                    <p className="text-xs font-bold text-[#71717a] mt-1">Mức độ dự án cần kỹ năng của bạn</p>
                </div>
                <div className="flex-1 min-h-[220px] -ml-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                            <PolarGrid stroke="#e4e4e7" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#18181b', fontSize: 10, fontWeight: 800 }} />
                            <Radar name="Market Demand" dataKey="A" stroke="#16452a" strokeWidth={2} fill="#16452a" fillOpacity={0.15} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', fontSize: '12px', fontWeight: 'bold' }} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};