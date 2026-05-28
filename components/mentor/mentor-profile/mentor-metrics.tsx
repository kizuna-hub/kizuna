import { Card, CardContent } from "@/components/ui/card";
import { Target, Award } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

// 1. Khai báo Type rõ ràng để TypeScript không la làng
interface MentorMetricsProps {
    fundingData: any[]; // Hoặc gõ chuẩn hơn: Array<{ amount: number }> nếu data mày trả về có field amount
    highlightCompany?: string;
}

// 2. Gắn cái Type đó vào Component
export const MentorMetrics = ({
    fundingData,
    highlightCompany = "VNG & Momo"
}: MentorMetricsProps) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Số dự án */}
        <Card className="border-kizuna-border shadow-sm bg-kizuna-canvas">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <div className="h-12 w-12 rounded-xl bg-kizuna-surface flex items-center justify-center mb-4 border border-kizuna-border">
                    <Target className="h-6 w-6 text-kizuna-primary" />
                </div>
                <h3 className="text-3xl font-black text-kizuna-text-main">15+</h3>
                <p className="text-xs font-bold text-kizuna-text-muted mt-1 uppercase tracking-wider">Số dự án đã hỗ trợ</p>
            </CardContent>
        </Card>

        {/* Card 2: Tổng vốn gọi được */}
        <Card className="border-kizuna-border shadow-sm bg-kizuna-canvas relative overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center pb-2">
                <h3 className="text-3xl font-black text-kizuna-text-main">100M+</h3>
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

        {/* Card 3: Doanh nghiệp tiêu biểu (Đã fix lỗi UI) */}
        <Card className="border-kizuna-border shadow-sm bg-kizuna-canvas">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <div className="h-12 w-12 rounded-xl bg-kizuna-surface flex items-center justify-center mb-4 border border-kizuna-border">
                    <Award className="h-6 w-6 text-kizuna-primary" />
                </div>

                <h3 className="text-xl font-black text-kizuna-text-main px-2 text-balance leading-tight">
                    {highlightCompany}
                </h3>

                <p className="text-xs font-bold text-kizuna-text-muted mt-2 uppercase tracking-wider">
                    Doanh nghiệp đã cố vấn
                </p>
            </CardContent>
        </Card>
    </div>
);