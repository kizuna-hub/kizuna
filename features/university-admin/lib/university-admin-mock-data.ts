import type {
  ReportSection,
  ReportTemplate,
  UniversityVenture,
} from "../types";

export const universityProgram = {
  name: "BK Startup Cohort 2026",
  school: "Đại học Bách Khoa Hà Nội",
  dateRange: "01/01/2026 – 31/12/2026",
  updatedAt: "19/05/2026 09:30",
} as const;

export const universityVentures: UniversityVenture[] = [
  {
    id: "agriconnect",
    name: "AgriConnect",
    description: "Nền tảng kết nối nông dân và hợp tác xã",
    founder: {
      name: "Nguyễn Minh Tuấn",
      subtitle: "K66 – CNTT",
      initials: "MT",
      tone: "bg-amber-100 text-amber-800",
    },
    stage: "Prototype",
    readiness: 48,
    readinessLevel: "Medium",
    blocker: "Thiếu dữ liệu người dùng thật",
    lastActivityDate: "16/05/2026",
    lastActivity: "Cập nhật prototype v2",
    mentor: {
      name: "TS. Lê Hoàng Nam",
      avatar: "/images/mentors/tran-minh-quan.png",
    },
    attention: "Cần hỗ trợ",
    mark: "leaf",
    tone: "bg-emerald-500",
  },
  {
    id: "eduai",
    name: "EduAI",
    description: "Trợ lý học tập cá nhân hóa bằng AI",
    founder: {
      name: "Trần Phương Anh",
      subtitle: "K65 – AI",
      initials: "PA",
      tone: "bg-violet-100 text-violet-800",
    },
    stage: "Idea",
    readiness: 76,
    readinessLevel: "High",
    blocker: "Chưa xác định rõ chân dung khách hàng mục tiêu",
    lastActivityDate: "15/05/2026",
    lastActivity: "Nghiên cứu thị trường",
    mentor: {
      name: "TS. Nguyễn Thu Hà",
      avatar: "/images/mentors/pham-thu-ha.png",
    },
    attention: "Theo dõi",
    mark: "graduation",
    tone: "bg-slate-800",
  },
  {
    id: "saferide",
    name: "SafeRide",
    description: "Giải pháp an toàn cho xe máy thông minh",
    founder: {
      name: "Phạm Đức Huy",
      subtitle: "K64 – ĐTVT",
      initials: "DH",
      tone: "bg-sky-100 text-sky-800",
    },
    stage: "Pilot",
    readiness: 59,
    readinessLevel: "Medium",
    blocker: "Chưa có market commitment",
    lastActivityDate: "14/05/2026",
    lastActivity: "Gặp gỡ nhà đầu tư thiên thần",
    mentor: {
      name: "ThS. Trần Quốc Duy",
      avatar: "/images/mentors/nguyen-hoang-long.png",
    },
    attention: "Cần hỗ trợ",
    mark: "shield",
    tone: "bg-blue-500",
  },
  {
    id: "greenmetric",
    name: "GreenMetric",
    description: "Hệ thống đo lường và tối ưu năng lượng",
    founder: {
      name: "Lê Thảo Nguyên",
      subtitle: "K63 – Môi trường",
      initials: "TN",
      tone: "bg-emerald-100 text-emerald-800",
    },
    stage: "Prototype",
    readiness: 73,
    readinessLevel: "High",
    blocker: "Prototype chưa đạt yêu cầu độ chính xác",
    lastActivityDate: "13/05/2026",
    lastActivity: "Thử nghiệm thiết bị v1.2",
    mentor: {
      name: "PGS.TS. Phạm Anh Tuấn",
      avatar: "/images/mentors/tran-minh-quan.png",
    },
    attention: "Rủi ro cao",
    mark: "sprout",
    tone: "bg-green-600",
  },
  {
    id: "medbuddy",
    name: "MedBuddy",
    description: "Ứng dụng chăm sóc sức khỏe cá nhân",
    founder: {
      name: "Hoàng Linh Chi",
      subtitle: "K64 – Y sinh",
      initials: "LC",
      tone: "bg-rose-100 text-rose-800",
    },
    stage: "Idea",
    readiness: 54,
    readinessLevel: "Medium",
    blocker: "Đội ngũ chưa đủ năng lực về y tế",
    lastActivityDate: "12/05/2026",
    lastActivity: "Hoàn thiện mô hình kinh doanh",
    mentor: {
      name: "TS. Đặng Thị Mai",
      avatar: "/images/mentors/pham-thu-ha.png",
    },
    attention: "Theo dõi",
    mark: "heart",
    tone: "bg-rose-500",
  },
  {
    id: "buildsmart",
    name: "BuildSmart",
    description: "Nền tảng quản lý công trình xây dựng",
    founder: {
      name: "Đỗ Anh Khoa",
      subtitle: "K65 – XD",
      initials: "AK",
      tone: "bg-purple-100 text-purple-800",
    },
    stage: "Prototype",
    readiness: 78,
    readinessLevel: "High",
    blocker: "Tích hợp dữ liệu từ nhiều nguồn",
    lastActivityDate: "11/05/2026",
    lastActivity: "Tích hợp API đối tác",
    mentor: {
      name: "TS. Nguyễn Việt Hùng",
      avatar: "/images/mentors/nguyen-hoang-long.png",
    },
    attention: "Theo dõi",
    mark: "building",
    tone: "bg-violet-600",
  },
  {
    id: "foodmap",
    name: "FoodMap",
    description: "Bản đồ thực phẩm sạch địa phương",
    founder: {
      name: "Vũ Quỳnh Trang",
      subtitle: "K64 – QTKD",
      initials: "QT",
      tone: "bg-orange-100 text-orange-800",
    },
    stage: "Pilot",
    readiness: 62,
    readinessLevel: "Medium",
    blocker: "Tiếp cận người dùng chưa đủ nhanh",
    lastActivityDate: "10/05/2026",
    lastActivity: "Chạy chiến dịch truyền thông",
    mentor: {
      name: "ThS. Nguyễn Thu Trang",
      avatar: "/images/mentors/pham-thu-ha.png",
    },
    attention: "Cần hỗ trợ",
    mark: "map",
    tone: "bg-orange-500",
  },
  {
    id: "airquality",
    name: "AirQuality",
    description: "Thiết bị theo dõi chất lượng không khí IoT",
    founder: {
      name: "Trần Minh Đức",
      subtitle: "K63 – Điện tử",
      initials: "MĐ",
      tone: "bg-cyan-100 text-cyan-800",
    },
    stage: "Launched",
    readiness: 84,
    readinessLevel: "High",
    blocker: "Mở rộng sản xuất và kênh phân phối",
    lastActivityDate: "09/05/2026",
    lastActivity: "Ký kết đối tác phân phối",
    mentor: {
      name: "TS. Lê Văn Thắng",
      avatar: "/images/mentors/tran-minh-quan.png",
    },
    attention: "Đang tốt",
    mark: "air",
    tone: "bg-cyan-600",
  },
];

export const activeVentureTrend = [
  { label: "13/04", value: 16 },
  { label: "20/04", value: 18 },
  { label: "27/04", value: 19 },
  { label: "04/05", value: 22 },
  { label: "11/05", value: 23 },
  { label: "18/05", value: 24 },
];

export const stageMovement = [
  { label: "01/2026", idea: 10, prototype: 4, pilot: 2, launched: 0 },
  { label: "02/2026", idea: 9, prototype: 5, pilot: 3, launched: 1 },
  { label: "03/2026", idea: 8, prototype: 6, pilot: 4, launched: 2 },
  { label: "04/2026", idea: 7, prototype: 7, pilot: 5, launched: 3 },
  { label: "05/2026", idea: 6, prototype: 8, pilot: 6, launched: 4 },
];

export const bottlenecks = [
  { label: "Customer evidence", value: 15 },
  { label: "Market commitment", value: 11 },
  { label: "Prototype learning", value: 9 },
  { label: "Business model clarity", value: 7 },
  { label: "Go-to-market", value: 6 },
];

export const readinessDistribution = [
  { label: "Low", value: 29 },
  { label: "Medium", value: 46 },
  { label: "High", value: 21 },
  { label: "Very High", value: 4 },
];

export const reportSections: ReportSection[] = [
  {
    id: "venture-overview",
    label: "Tổng quan venture",
    description: "Hiệu suất tổng thể và các chỉ số chính",
  },
  {
    id: "stage-movement",
    label: "Dịch chuyển stage",
    description: "Theo dõi sự tiến triển của venture",
  },
  {
    id: "readiness",
    label: "Phân bố readiness",
    description: "Mức độ sẵn sàng của các venture",
  },
  {
    id: "bottlenecks",
    label: "Top bottlenecks",
    description: "Các rào cản lớn nhất đang gặp phải",
  },
  {
    id: "founder-activity",
    label: "Hoạt động founder",
    description: "Mức độ hoạt động của founder",
  },
  {
    id: "mentor-connections",
    label: "Kết nối mentor",
    description: "Hiệu quả kết nối với mentor",
  },
  {
    id: "attention",
    label: "Danh sách cần chú ý",
    description: "Các venture cần theo dõi",
  },
];

export const reportTemplates: ReportTemplate[] = [
  {
    id: "weekly",
    title: "Tổng quan tuần",
    description: "Tổng hợp hoạt động trong tuần",
    cadence: "Cập nhật: Hàng tuần",
    tone: "purple",
  },
  {
    id: "monthly",
    title: "Báo cáo tháng",
    description: "Tổng hợp hiệu suất theo tháng",
    cadence: "Cập nhật: Hàng tháng",
    tone: "green",
  },
  {
    id: "quarterly",
    title: "Báo cáo quý",
    description: "Đánh giá hiệu suất theo quý",
    cadence: "Cập nhật: Hàng quý",
    tone: "orange",
  },
  {
    id: "final",
    title: "Báo cáo cuối kỳ",
    description: "Tổng kết chương trình",
    cadence: "Cập nhật: Theo cohort",
    tone: "blue",
  },
  {
    id: "latest",
    title: "Báo cáo gần nhất",
    description: "BK Startup Cohort 2026",
    cadence: "19/05/2026 09:30",
    tone: "blue",
  },
];

export const agriconnectDetail = {
  readiness: 48,
  readinessTrend: [
    { label: "13/05", value: 48 },
    { label: "14/05", value: 39 },
    { label: "15/05", value: 52 },
    { label: "16/05", value: 43 },
    { label: "17/05", value: 49 },
    { label: "18/05", value: 53 },
    { label: "19/05", value: 48 },
  ],
  blocker:
    "Chưa có bằng chứng rõ ràng về nhu cầu trả tiền thực tế từ khách hàng mục tiêu.",
  flags: [
    { status: "danger", label: "Chưa có Customer evidence đủ mạnh" },
    { status: "danger", label: "Chưa có cam kết thị trường (LOI / Pre-order)" },
    { status: "warning", label: "Chưa thực hiện thử nghiệm với ≥ 5 khách hàng" },
    { status: "success", label: "Mức độ hoạt động tuần gần đây ở mức thấp" },
  ],
  dimensions: [
    { label: "Hiểu vấn đề", description: "Mức độ hiểu rõ vấn đề của khách hàng", score: 72 },
    { label: "Minh chứng khách hàng", description: "Bằng chứng về nhu cầu và hành vi", score: 25 },
    { label: "Cam kết thị trường", description: "Thư quan tâm, LOI, pre-order", score: 18 },
    { label: "Học hỏi qua prototype", description: "Thử nghiệm và học hỏi từ khách hàng", score: 48 },
    { label: "Năng lực đội ngũ", description: "Kỹ năng, kinh nghiệm, bổ sung", score: 62 },
    { label: "Go-to-market", description: "Kênh tiếp cận và chiến lược ban đầu", score: 40 },
  ],
  activities: [
    { title: "Nộp báo cáo tuần 7", detail: "Weekly Report - Week 7.pdf", time: "2 giờ trước" },
    { title: "Cập nhật prototype", detail: "Figma Prototype v2", time: "1 ngày trước" },
    { title: "Phản hồi từ mentor", detail: "Bình luận từ Trần Minh Quân", time: "2 ngày trước" },
    { title: "Tải lên tài liệu", detail: "Customer Interview Summary (10 files)", time: "3 ngày trước" },
  ],
} as const;
