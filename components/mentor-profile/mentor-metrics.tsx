import { Card, CardContent } from "@/components/ui/card";
import { Target } from "lucide-react";
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export const MentorMetrics = ({ fundingData, successData }: { fundingData: any[], successData: any[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-kizuna-border shadow-sm bg-kizuna-canvas">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <div className="h-12 w-12 rounded-xl bg-kizuna-surface flex items-center justify-center mb-4 border border-kizuna-border">
                    <Target className="h-6 w-6 text-kizuna-primary" />
                </div>
                <h3 className="text-3xl font-black text-kizuna-text-main">15+</h3>
                <p className="text-xs font-bold text-kizuna-text-muted mt-1 uppercase tracking-wider">Số dự án đã hỗ trợ</p>
            </CardContent>
        </Card>

        <Card className="border-kizuna-border shadow-sm bg-kizuna-canvas relative overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center pb-2">
                <h3 className="text-3xl font-black text-kizuna-text-main">$500K+</h3>
                <p className="text-xs font-bold text-kizuna-text-muted mt-1 mb-2 uppercase tracking-wider">Tổng vốn gọi được</p>
                <div className="h-[60px] w-full mt-auto opacity-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={fundingData}>
                            <Area type="monotone" dataKey="amount" stroke="#16452a" fill="#E8F3ED" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>

        <Card className="border-kizuna-border shadow-sm bg-kizuna-canvas">
            <CardContent className="p-6 flex items-center justify-center gap-4">
                <div className="h-[80px] w-[80px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={successData} cx="50%" cy="50%" innerRadius={25} outerRadius={35} paddingAngle={5} dataKey="value" stroke="none">
                                {successData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-black text-kizuna-primary">95%</span>
                    </div>
                </div>
                <div className="text-left">
                    <h3 className="text-lg font-black text-kizuna-text-main uppercase tracking-tighter">Tỷ lệ</h3>
                    <p className="text-xs font-bold text-kizuna-text-muted uppercase">Thành công</p>
                </div>
            </CardContent>
        </Card>
    </div>
);