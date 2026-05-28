import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, Users, Trophy, DollarSign, Clock } from "lucide-react";

export const MentorDetailTabs = ({ mentor }: { mentor: any }) => (
    <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-kizuna-surface p-1 border border-kizuna-border rounded-xl">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-kizuna-primary data-[state=active]:shadow-sm font-bold text-sm">Tổng quan</TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-white data-[state=active]:text-kizuna-primary data-[state=active]:shadow-sm font-bold text-sm">Dự án tiêu biểu</TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-white data-[state=active]:text-kizuna-primary data-[state=active]:shadow-sm font-bold text-sm">Lịch trống</TabsTrigger>
        </TabsList>

        {/* Tab 1: Tổng quan */}
        <TabsContent value="overview" className="space-y-6 mt-0">
            <Card className="shadow-sm border-kizuna-border bg-kizuna-canvas">
                <CardHeader>
                    <CardTitle className="text-xl text-kizuna-primary font-bold">Về tôi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-kizuna-text-main leading-relaxed text-base">{mentor.bio}</p>
                    <div>
                        <h4 className="font-bold text-kizuna-text-main mb-2 flex items-center gap-2 mt-4">
                            <Lightbulb className="h-4 w-4 text-kizuna-primary" /> Triết lý cố vấn
                        </h4>
                        <p className="text-kizuna-text-muted leading-relaxed text-sm bg-kizuna-surface p-4 rounded-lg border border-kizuna-border italic">
                            "{mentor.philosophy}"
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="shadow-sm border-kizuna-border bg-kizuna-canvas">
                    <CardHeader><CardTitle className="text-lg text-kizuna-primary font-bold">Lĩnh vực quan tâm</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {mentor.expertise.map((skill: string, index: number) => (
                                <Badge key={index} variant="secondary" className="px-3 py-1.5 text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition-colors">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-kizuna-border bg-kizuna-canvas">
                    <CardHeader><CardTitle className="text-lg text-kizuna-primary font-bold">Đối tượng hướng tới</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-100">
                                <Users className="h-4 w-4 text-kizuna-primary" />
                            </div>
                            <p className="text-sm font-medium text-kizuna-text-main leading-relaxed">{mentor.targetAudience}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

        {/* Tab 2: Dự án */}
        <TabsContent value="projects" className="mt-0">
            <Card className="shadow-sm border-kizuna-border bg-kizuna-canvas">
                <CardHeader><CardTitle className="text-xl text-kizuna-primary font-bold">Dự án đã hỗ trợ tiêu biểu</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {mentor.projects.map((proj: any, index: number) => (
                        <div key={index} className="flex gap-4 p-4 rounded-xl border border-kizuna-border bg-kizuna-surface hover:border-kizuna-primary/30 transition-all group">
                            <div className="h-12 w-12 rounded-xl bg-white text-kizuna-primary flex items-center justify-center font-bold text-xl flex-shrink-0 border border-kizuna-border group-hover:shadow-sm">
                                {proj.logo}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-kizuna-text-main text-base">{proj.name}</h4>
                                <p className="text-sm text-kizuna-text-muted mt-1 mb-3">{proj.description}</p>
                                <div className="flex flex-wrap items-center gap-3">
                                    <Badge variant="outline" className="text-[10px] font-bold bg-amber-50 text-amber-700 border-amber-200 uppercase tracking-tighter">
                                        <Trophy className="h-3 w-3 mr-1" /> {proj.award}
                                    </Badge>
                                    <Badge variant="outline" className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border-emerald-200 uppercase tracking-tighter">
                                        <DollarSign className="h-3 w-3 mr-1" /> {proj.funding}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </TabsContent>

        {/* Tab 3: Lịch trống */}
        <TabsContent value="calendar" className="mt-0">
            <Card className="shadow-sm border-kizuna-border bg-kizuna-canvas">
                <CardHeader>
                    <CardTitle className="text-xl text-kizuna-primary font-bold mb-2">Lịch trống trong tuần</CardTitle>
                    <p className="text-sm text-kizuna-text-muted font-medium">Chọn khung giờ phù hợp để đặt lịch Sync 15 phút cùng cố vấn.</p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['Thứ 2 - 14:00', 'Thứ 2 - 14:30', 'Thứ 4 - 09:00', 'Thứ 4 - 10:15', 'Thứ 6 - 15:00', 'Thứ 6 - 16:45'].map((time, idx) => (
                            <Button key={idx} variant="outline" className="w-full border-kizuna-border hover:bg-kizuna-primary hover:text-white text-[11px] font-bold uppercase tracking-tight transition-all py-5">
                                {time}
                            </Button>
                        ))}
                    </div>
                    <div className="mt-6 p-5 bg-kizuna-surface rounded-xl flex items-start gap-4 border border-kizuna-border">
                        <Clock className="h-5 w-5 text-kizuna-text-muted mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-kizuna-text-main">Không tìm thấy khung giờ phù hợp?</p>
                            <p className="text-xs text-kizuna-text-muted mt-1 leading-relaxed">Gửi tin nhắn trực tiếp để đề xuất khung giờ khác. Cố vấn thường linh hoạt sắp xếp cho các dự án tiềm năng.</p>
                            <Button variant="link" className="px-0 h-auto mt-2 text-kizuna-primary font-bold text-xs uppercase tracking-wider">Nhắn tin ngay &rarr;</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    </Tabs>
);