import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Users,
  FileText,
  MailPlus,
  CheckCircle2,
  Clock,
  Video,
  Trophy,
  Star,
  ExternalLink
} from "lucide-react"

export default function PioneerWorkspacePage() {
  return (
    <div className="min-h-screen bg-zinc-50 p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#102c1e]">Không gian làm việc của Pioneer Founder</h1>
          <p className="text-zinc-500 mt-2">Thẩm định hồ sơ gọi vốn và tìm kiếm cộng sự xuất sắc từ Bách Khoa.</p>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white border-zinc-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-600">Dự án đang hướng dẫn</CardTitle>
              <Users className="h-4 w-4 text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#102c1e]">4</div>
              <p className="text-xs text-zinc-500 mt-1">2 dự án đang gọi vốn</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-zinc-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-600">Hồ sơ chờ duyệt</CardTitle>
              <FileText className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#102c1e]">12</div>
              <p className="text-xs text-zinc-500 mt-1">Cần thẩm định (Human-in-the-loop)</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-zinc-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-600">Lời mời Co-founder</CardTitle>
              <MailPlus className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#102c1e]">2</div>
              <p className="text-xs text-zinc-500 mt-1">Đã gửi trong tuần này</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Action Area (Left/Main Column) */}
        <div className="lg:col-span-2 space-y-8">

          {/* Section A: Hàng đợi thẩm định (Review Queue) */}
          <Card className="bg-white border-zinc-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-[#102c1e]">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                Hồ sơ cần thẩm định (Human-in-the-loop)
              </CardTitle>
              <CardDescription>
                Sinh viên đã hoàn thành bản nháp qua AI Policy Navigator và cần Pioneer Founder xác thực.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-200 hover:bg-transparent">
                    <TableHead className="text-zinc-600">Tên dự án</TableHead>
                    <TableHead className="text-zinc-600">Giai đoạn</TableHead>
                    <TableHead className="text-zinc-600">Thời gian gửi</TableHead>
                    <TableHead className="text-right text-zinc-600">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-zinc-200 hover:bg-zinc-50">
                    <TableCell className="font-medium text-[#102c1e]">EdTech AI Platform</TableCell>
                    <TableCell><Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">MVP</Badge></TableCell>
                    <TableCell className="text-zinc-500 text-sm">2 giờ trước</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" className="border-zinc-200 text-zinc-700 hover:bg-zinc-100">Xem Pitch Deck</Button>
                      <Button size="sm" className="bg-kizuna-primary text-white">Duyệt nhanh</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-zinc-200 hover:bg-zinc-50">
                    <TableCell className="font-medium text-[#102c1e]">Smart IoT Agri</TableCell>
                    <TableCell><Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200">Ý tưởng</Badge></TableCell>
                    <TableCell className="text-zinc-500 text-sm">5 giờ trước</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" className="border-zinc-200 text-zinc-700 hover:bg-zinc-100">Xem Pitch Deck</Button>
                      <Button size="sm" className="bg-kizuna-primary text-white">Duyệt nhanh</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-zinc-200 hover:bg-zinc-50">
                    <TableCell className="font-medium text-[#102c1e]">Blockchain Identity</TableCell>
                    <TableCell><Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200">Ý tưởng</Badge></TableCell>
                    <TableCell className="text-zinc-500 text-sm">1 ngày trước</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" className="border-zinc-200 text-zinc-700 hover:bg-zinc-100">Xem Pitch Deck</Button>
                      <Button size="sm" className="bg-kizuna-primary text-white">Duyệt nhanh</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Section B: Radar Nhân tài (Talent Deal Flow) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#102c1e] flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Gợi ý Co-founder tiềm năng
              </h2>
              <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-[#102c1e]">Xem tất cả</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1 */}
              <Card className="bg-white border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 flex flex-row items-start gap-4">
                  <Avatar className="h-12 w-12 border border-zinc-200">
                    <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Student" />
                    <AvatarFallback>TA</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <CardTitle className="text-base text-[#102c1e]">Trần Tuấn Anh</CardTitle>
                    <CardDescription className="text-xs">Kỹ sư AI - K25</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="border-zinc-200 text-zinc-600 bg-zinc-50">PyTorch</Badge>
                    <Badge variant="outline" className="border-zinc-200 text-zinc-600 bg-zinc-50">Computer Vision</Badge>
                    <Badge variant="outline" className="border-zinc-200 text-zinc-600 bg-zinc-50">Match Score: 95%</Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-[#102c1e] hover:bg-[#102c1e]/90 text-white gap-2">
                    <MailPlus className="h-4 w-4" />
                    Mời làm Co-founder
                  </Button>
                </CardFooter>
              </Card>

              {/* Card 2 */}
              <Card className="bg-white border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 flex flex-row items-start gap-4">
                  <Avatar className="h-12 w-12 border border-zinc-200">
                    <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Student" />
                    <AvatarFallback>NM</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <CardTitle className="text-base text-[#102c1e]">Nguyễn Thị Mai</CardTitle>
                    <CardDescription className="text-xs">Marketing - K26</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="border-zinc-200 text-zinc-600 bg-zinc-50">Growth Hacking</Badge>
                    <Badge variant="outline" className="border-zinc-200 text-zinc-600 bg-zinc-50">B2B Sales</Badge>
                    <Badge variant="outline" className="border-zinc-200 text-zinc-600 bg-zinc-50">Match Score: 88%</Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-[#102c1e] hover:bg-[#102c1e]/90 text-white gap-2">
                    <MailPlus className="h-4 w-4" />
                    Mời làm Co-founder
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

        </div>

        {/* Right Sidebar (Widgets) */}
        <div className="space-y-6">

          {/* Widget 1: Lịch Cố vấn */}
          <Card className="bg-white border-zinc-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-[#102c1e]">
                <Clock className="h-5 w-5 text-zinc-500" />
                Lịch Cố vấn (Upcoming Sessions)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg border border-zinc-100 bg-zinc-50/50 hover:bg-zinc-50 transition-colors">
                <div className="bg-blue-100 text-blue-700 p-2 rounded-md">
                  <Video className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-[#102c1e]">Review MVP EdTech</p>
                  <p className="text-xs text-zinc-500">Hôm nay, 14:00 - 15:00</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-[#102c1e]">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg border border-zinc-100 bg-zinc-50/50 hover:bg-zinc-50 transition-colors">
                <div className="bg-blue-100 text-blue-700 p-2 rounded-md">
                  <Video className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-[#102c1e]">Định hướng gọi vốn Seed</p>
                  <p className="text-xs text-zinc-500">Ngày mai, 09:00 - 10:00</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-[#102c1e]">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full text-zinc-600 border-zinc-200">
                Xem toàn bộ lịch
              </Button>
            </CardFooter>
          </Card>

          {/* Widget 2: Bảng xếp hạng */}
          <Card className="bg-gradient-to-br from-white to-zinc-50 border-zinc-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-[#102c1e]">
                <Trophy className="h-5 w-5 text-amber-500" />
                Top Pioneer Founders tháng này
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="font-bold text-amber-500 w-4 text-center">1</div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://i.pravatar.cc/150?u=1" />
                    <AvatarFallback>LD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-[#102c1e]">Lê Đức Anh</p>
                    <p className="text-xs text-zinc-500">Đã duyệt 45 hồ sơ</p>
                  </div>
                </div>
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-0">Top 1%</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="font-bold text-zinc-400 w-4 text-center">2</div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://i.pravatar.cc/150?u=2" />
                    <AvatarFallback>PH</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-[#102c1e]">Phạm Hoàng</p>
                    <p className="text-xs text-zinc-500">Đã duyệt 38 hồ sơ</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="font-bold text-amber-700 w-4 text-center">3</div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://i.pravatar.cc/150?u=3" />
                    <AvatarFallback>TH</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-[#102c1e]">Trần Hùng</p>
                    <p className="text-xs text-zinc-500">Đã duyệt 30 hồ sơ</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
