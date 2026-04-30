"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Mail, MapPin, Briefcase, Star, Clock, Globe, CheckCircle2, Sparkles, Trophy, Users, DollarSign, Target, Lightbulb } from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// Mock data to simulate fetching a mentor by id
const MOCK_MENTOR = {
  id: "1",
  name: "Dr. Alex Chen",
  role: "Giám đốc Chiến lược Sản phẩm",
  company: "DNES",
  location: "Đà Nẵng, Việt Nam",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  rating: 4.9,
  sessions: 120,
  bio: "Đam mê giúp đỡ các startup giai đoạn đầu định vị thị trường, đặc biệt trong lĩnh vực AI và SaaS. Tôi có hơn 15 năm kinh nghiệm trong ngành công nghệ và yêu thích làm việc với các nhà sáng lập nhiệt huyết để xây dựng sản phẩm bền vững.",
  expertise: ["#AI", "#SaaS", "#EdTech", "#NQ54"],
  targetAudience: "Dự án giai đoạn Seed có MVP và đội ngũ kỹ thuật in-house.",
  philosophy: "Mentorship không phải là dạy cách làm, mà là đặt đúng câu hỏi để Founder tự nhận ra vấn đề. Tôi đề cao tính minh bạch, kỷ luật và khả năng thực thi nhanh.",
  industry: "AI & Công nghệ",
  availability: "Sẵn sàng cố vấn",
  languages: ["Tiếng Anh", "Tiếng Việt"],
  projects: [
    {
      name: "AutoMKT (SaaS)",
      logo: "A",
      description: "Hệ thống tự động hóa marketing bằng AI cho doanh nghiệp SMEs.",
      award: "Giải Nhất BK Shark 2023",
      funding: "$250K Seed Round"
    },
    {
      name: "EduNova",
      logo: "E",
      description: "Nền tảng học tập thích ứng cá nhân hóa cho học sinh THPT.",
      award: "Top 10 Startup Wheel",
      funding: "$100K Pre-Seed"
    }
  ],
  aiMatch: "Cố vấn có kinh nghiệm sâu rộng về SaaS và AI, rất phù hợp với sản phẩm công nghệ đang trong giai đoạn xây dựng MVP của bạn."
};

const FUNDING_DATA = [
  { month: 'T1', amount: 50 },
  { month: 'T2', amount: 150 },
  { month: 'T3', amount: 200 },
  { month: 'T4', amount: 350 },
  { month: 'T5', amount: 500 },
];

const SUCCESS_RATE_DATA = [
  { name: 'Thành công', value: 95, color: 'hsl(var(--primary))' },
  { name: 'Khác', value: 5, color: 'hsl(var(--muted))' },
];

export default function MentorProfilePage({ params }: { params: Promise<{ locale: string, id: string }> }) {
  const resolvedParams = use(params);
  // In a real app we'd fetch the mentor data using resolvedParams.id
  const mentor = MOCK_MENTOR;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <Link href={`/${resolvedParams.locale}/resources/mentor-hub`} className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách Cố vấn
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left Column: Sticky Sidebar Profile Card */}
        <div className="w-full md:w-1/3 space-y-6 sticky top-24">
          <Card className="border-primary/10 shadow-md">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <Avatar className="h-32 w-32 border-4 border-primary/20 bg-muted">
                  <AvatarImage src={mentor.avatar} alt={mentor.name} />
                  <AvatarFallback>{mentor.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl font-bold text-primary">{mentor.name}</CardTitle>
              <CardDescription className="text-base text-foreground font-medium">
                {mentor.role} tại <span className="text-primary/80">{mentor.company}</span>
              </CardDescription>
              <div className="flex items-center justify-center gap-1 text-amber-500 mt-2">
                <Star className="h-5 w-5 fill-current" />
                <span className="font-semibold text-lg">{mentor.rating}</span>
                <span className="text-muted-foreground text-sm ml-1">({mentor.sessions} phiên)</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="flex items-center text-sm">
                <MapPin className="mr-3 h-5 w-5 text-muted-foreground" />
                <span>{mentor.location}</span>
              </div>
              <div className="flex items-center text-sm">
                <Briefcase className="mr-3 h-5 w-5 text-muted-foreground" />
                <span>{mentor.industry}</span>
              </div>
              <div className="flex items-center text-sm">
                <Globe className="mr-3 h-5 w-5 text-muted-foreground" />
                <span>{mentor.languages.join(", ")}</span>
              </div>

              <div className="pt-6 mt-4 border-t">
                <Button className="w-full mb-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6">
                  <Calendar className="mr-2 h-5 w-5" /> Đặt lịch hẹn
                </Button>
                <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5 py-6">
                  <Mail className="mr-2 h-5 w-5" /> Nhắn tin
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/10 shadow-sm bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> Lịch trống
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="font-medium text-green-700 dark:text-green-400">{mentor.availability}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 italic">
                Thường phản hồi trong vòng 48 giờ.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Main Content */}
        <div className="w-full md:w-2/3 space-y-8">

          {/* AI Match Reason */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="h-24 w-24" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-purple-700 dark:text-purple-400 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" /> AI Đề xuất (Độ phù hợp: 92%)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/90 font-medium relative z-10 leading-relaxed">
                  "{mentor.aiMatch}"
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Metrics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-primary/10 shadow-sm">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">15+</h3>
                <p className="text-sm font-medium text-muted-foreground mt-1">Số dự án đã hỗ trợ</p>
              </CardContent>
            </Card>

            <Card className="border-primary/10 shadow-sm relative overflow-hidden">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center pb-2">
                <h3 className="text-3xl font-bold text-foreground">$500K+</h3>
                <p className="text-sm font-medium text-muted-foreground mt-1 mb-2">Tổng vốn gọi được</p>
                <div className="h-[60px] w-full mt-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={FUNDING_DATA}>
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="amount" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorAmount)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/10 shadow-sm">
              <CardContent className="p-6 flex items-center justify-center gap-4">
                <div className="h-[80px] w-[80px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={SUCCESS_RATE_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={35}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {SUCCESS_RATE_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold">95%</span>
                  </div>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-foreground">Tỷ lệ</h3>
                  <p className="text-sm font-medium text-muted-foreground">Thành công</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Navigation Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/60 p-1">
              <TabsTrigger value="overview" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">Tổng quan</TabsTrigger>
              <TabsTrigger value="projects" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">Dự án tiêu biểu</TabsTrigger>
              <TabsTrigger value="calendar" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">Lịch trống</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-0">
              <Card className="shadow-sm border-primary/10">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Về tôi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {mentor.bio}
                  </p>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2 mt-4">
                      <Lightbulb className="h-4 w-4 text-primary" /> Triết lý cố vấn
                    </h4>
                    <p className="text-muted-foreground leading-relaxed text-sm bg-primary/5 p-4 rounded-lg border border-primary/10">
                      "{mentor.philosophy}"
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="shadow-sm border-primary/10">
                  <CardHeader>
                    <CardTitle className="text-lg text-primary">Lĩnh vực quan tâm</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {mentor.expertise.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1.5 text-sm bg-primary/10 text-primary hover:bg-primary/20 border-0 transition-colors">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-primary/10">
                  <CardHeader>
                    <CardTitle className="text-lg text-primary">Đối tượng hướng tới</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-sm font-medium text-foreground/80 leading-relaxed">
                        {mentor.targetAudience}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="projects" className="mt-0">
              <Card className="shadow-sm border-primary/10">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Dự án đã hỗ trợ tiêu biểu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mentor.projects.map((proj, index) => (
                    <div key={index} className="flex gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl flex-shrink-0">
                        {proj.logo}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{proj.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1 mb-3">{proj.description}</p>
                        <div className="flex flex-wrap items-center gap-3">
                          <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800">
                            <Trophy className="h-3 w-3 mr-1" /> {proj.award}
                          </Badge>
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800">
                            <DollarSign className="h-3 w-3 mr-1" /> {proj.funding}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calendar" className="mt-0">
              <Card className="shadow-sm border-primary/10">
                <CardHeader>
                  <CardTitle className="text-xl text-primary mb-2">Lịch trống trong tuần</CardTitle>
                  <CardDescription>Chọn khung giờ phù hợp để đặt lịch Sync 15 phút</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Thứ 2 - 14:00', 'Thứ 2 - 14:30', 'Thứ 4 - 09:00', 'Thứ 4 - 10:15', 'Thứ 6 - 15:00', 'Thứ 6 - 16:45'].map((time, idx) => (
                      <Button key={idx} variant="outline" className="w-full border-primary/20 hover:bg-primary hover:text-primary-foreground text-sm font-medium transition-all">
                        {time}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-muted/60 rounded-xl flex items-start gap-3 border border-border">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Bạn không tìm thấy khung giờ phù hợp?</p>
                      <p className="text-xs text-muted-foreground mt-1">Gửi tin nhắn trực tiếp để đề xuất khung giờ khác. Cố vấn thường linh hoạt sắp xếp cho các dự án tiềm năng.</p>
                      <Button variant="link" className="px-0 h-auto mt-2 text-primary">Nhắn tin ngay &rarr;</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </div>
  );
}