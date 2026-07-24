import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Briefcase, Globe, Calendar, Mail, Clock, CheckCircle2 } from "lucide-react";
import type { Mentor } from "@/features/mentor/mentor-profile/mentor-profile-screen";

export const MentorHeroSidebar = ({ mentor }: { mentor: Mentor }) => (
    /* 
       CÁC THAY ĐỔI QUAN TRỌNG:
       1. md:w-[350px]: Đặt độ rộng cố định để Sidebar không bị quá nhỏ trên màn hình lớn.
       2. flex-none: Ngăn Flexbox bóp nghẹt cột này khi cột bên phải (biểu đồ) phình to.
       3. sticky top-28: Giữ card luôn hiển thị khi cuộn trang.
       4. self-start: Đảm bảo sticky hoạt động bằng cách không kéo dài thẻ div theo chiều cao cột phải.
    */
    <div className="w-full md:w-[350px] flex-none sticky top-28 z-10 self-start">
        <Card className="border-kizuna-border shadow-md bg-kizuna-canvas">
            <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                    <Avatar className="h-32 w-32 border-4 border-kizuna-primary/10 bg-kizuna-surface">
                        <AvatarImage src={mentor.avatar} alt={mentor.name} />
                        <AvatarFallback>{mentor.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                </div>
                <CardTitle className="text-2xl font-bold text-kizuna-text-main">{mentor.name}</CardTitle>
                <CardDescription className="text-base text-kizuna-text-muted font-medium">
                    {mentor.role} tại <span className="text-kizuna-primary">{mentor.company}</span>
                </CardDescription>
                <div className="flex items-center justify-center gap-1 text-amber-500 mt-2">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="font-bold text-lg">{mentor.rating}</span>
                    <span className="text-kizuna-text-muted text-sm ml-1">({mentor.sessions} phiên)</span>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-0 border-b border-kizuna-border/50 pb-6">
                <div className="flex items-center text-sm text-kizuna-text-main">
                    <MapPin className="mr-3 h-5 w-5 text-kizuna-text-muted" />
                    <span>{mentor.location}</span>
                </div>
                <div className="flex items-center text-sm text-kizuna-text-main">
                    <Briefcase className="mr-3 h-5 w-5 text-kizuna-text-muted" />
                    <span>{mentor.industry}</span>
                </div>
                <div className="flex items-center text-sm text-kizuna-text-main">
                    <Globe className="mr-3 h-5 w-5 text-kizuna-text-muted" />
                    <span>{mentor.languages.join(", ")}</span>
                </div>

                <div className="pt-6 mt-4">
                    <Button className="w-full mb-3 bg-[#16452a] hover:opacity-90 text-white font-bold py-6 shadow-sm">
                        <Calendar className="mr-2 h-5 w-5" /> Đặt lịch hẹn
                    </Button>
                    <Button variant="outline" className="w-full border-kizuna-border hover:bg-kizuna-surface py-6 text-kizuna-text-main font-bold shadow-sm">
                        <Mail className="mr-2 h-5 w-5" /> Nhắn tin
                    </Button>
                </div>
            </CardContent>
        </Card>

        {/* Thẻ phụ: Thông tin Lịch trống */}
        <Card className="mt-6 border-kizuna-border shadow-sm bg-emerald-50/30">
            <CardHeader className="pb-3">
                <CardTitle className="text-[11px] font-bold flex items-center gap-2 text-kizuna-primary uppercase tracking-widest">
                    <Clock className="h-3.5 w-3.5" /> Trạng thái
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center text-sm gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span className="font-bold text-emerald-800">{mentor.availability}</span>
                </div>
                <p className="text-[11px] text-kizuna-text-muted mt-2 italic leading-relaxed">
                    Mentor thường phản hồi các yêu cầu cố vấn trong vòng 48 giờ làm việc.
                </p>
            </CardContent>
        </Card>
    </div>
);
