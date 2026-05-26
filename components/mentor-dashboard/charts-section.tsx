import {
    LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { valuationData, skillDemandData } from '../../app/[locale]/mentor-dashboard/mock-data';
import { TrendingUp, Target, Flame, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ChartsSection = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Biểu đồ 1: Portfolio Growth (Giữ nguyên đồ thị Line thẳng tưng chuẩn tài chính) */}
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
                            <CartesianGrid stroke="#e4e4e7" strokeDasharray="4 4" vertical={true} horizontal={true} />
                            <XAxis dataKey="month" axisLine={{ stroke: '#e4e4e7', strokeWidth: 1.5 }} tickLine={false} tick={{ fontSize: 10, fill: '#71717a', fontWeight: 800 }} dy={10} />
                            <YAxis axisLine={{ stroke: '#e4e4e7', strokeWidth: 1.5 }} tickLine={false} tick={{ fontSize: 10, fill: '#71717a', fontWeight: 800 }} tickFormatter={(value) => `${value}Tr`} dx={-10} />
                            <Tooltip formatter={(value) => [`${value} Triệu VNĐ`, 'Định giá']} contentStyle={{ borderRadius: '12px', border: '1px solid #e4e4e7', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold', fontSize: '12px' }} cursor={{ stroke: '#00BFA5', strokeWidth: 1.5, strokeDasharray: '4 4' }} />
                            <Line type="linear" dataKey="valuation" stroke="#16452a" strokeWidth={3} dot={{ r: 4, fill: '#ffffff', stroke: '#16452a', strokeWidth: 2.5 }} activeDot={{ r: 6, fill: '#00BFA5', stroke: '#ffffff', strokeWidth: 2 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Biểu đồ 2: Horizontal Skill Match Bar (THIẾT KẾ MỚI THEO HƯỚNG 2) */}
            <div className="lg:col-span-4 bg-[#ffffff] border border-[#e4e4e7] rounded-3xl p-8 shadow-sm flex flex-col relative overflow-hidden">
                {/* Trang trí góc phải */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00BFA5]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                <div className="mb-6 border-b border-[#e4e4e7]/60 pb-5 relative z-10">
                    <h2 className="text-lg font-black text-[#18181b] tracking-tighter flex items-center gap-2">
                        <Target className="w-5 h-5 text-[#16452a]" /> Cơ hội (Skill Match)
                    </h2>
                    <p className="text-xs font-bold text-[#71717a] mt-1.5 leading-relaxed">
                        Số lượng dự án trên hệ thống đang <br /> tìm kiếm kỹ năng chuyên môn của bạn.
                    </p>
                </div>

                {/* Danh sách các thanh Bar */}
                <div className="flex-1 flex flex-col justify-center gap-6 relative z-10">
                    {skillDemandData.map((item) => (
                        <div key={item.id} className="group">
                            <div className="flex justify-between items-end mb-2">
                                <h3 className="text-sm font-black text-[#18181b] flex items-center gap-1.5">
                                    {item.skill}
                                    {item.isHot && <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />}
                                </h3>
                                <span className="text-base font-black text-[#16452a]">
                                    {item.projectCount} <span className="text-[10px] font-bold text-[#71717a] uppercase">Dự án</span>
                                </span>
                            </div>

                            {/* Thanh Progress Bar bọc ngoài */}
                            <div className="w-full h-2.5 bg-[#fafafa] rounded-full overflow-hidden border border-[#e4e4e7]">
                                {/* Lõi Progress Bar màu xanh */}
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ease-out ${item.isHot ? 'bg-gradient-to-r from-[#16452a] to-[#00BFA5]' : 'bg-[#16452a]/60'}`}
                                    style={{ width: `${(item.projectCount / item.maxScale) * 100}%` }}
                                />
                            </div>

                            {/* Insight Subtext */}
                            <p className={`text-[10px] font-bold mt-2 uppercase tracking-widest ${item.isHot ? 'text-[#00BFA5]' : 'text-[#71717a]'}`}>
                                ↳ {item.insight}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Nút xem toàn bộ phễu cơ hội */}
                <Button className="w-full mt-8 bg-[#fafafa] hover:bg-[#e4e4e7] text-[#18181b] font-black text-xs h-11 rounded-xl border border-[#e4e4e7] transition-all flex items-center justify-center gap-2 relative z-10">
                    Xem tất cả 46 cơ hội <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};