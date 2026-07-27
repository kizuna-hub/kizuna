import type {
  VentureStage,
  VentureStatus,
} from "@/features/venture/core";

export const founderShellVi = {
  brand: "Kizuna Hub",
  globalNavigation: {
    home: "Trang chủ",
    projects: "Dự án",
    programs: "Chương trình",
    opportunities: "Cơ hội",
    library: "Thư viện",
  },
  projectNavigation: {
    overview: "Tổng quan",
    workspace: "AI Workspace",
    cycle: "Chu kỳ hiện tại",
    evidence: "Bằng chứng",
    sessions: "Phiên làm việc",
    outputs: "Kết quả",
    timeline: "Dòng thời gian",
  },
  groups: {
    workspace: "Không gian làm việc",
    more: "Thêm",
    previews: "Xem trước và công cụ",
  },
  notes: {
    later: "Sau",
    preview: "Xem trước",
  },
  navigation: {
    global: "Không gian làm việc Founder",
    project: "Không gian dự án",
    allProjects: "Tất cả dự án",
    open: "Mở điều hướng Founder",
    menu: "Menu",
    title: "Điều hướng Founder",
    description: "Đi tới dự án và các khu vực làm việc.",
    collapse: "Thu gọn thanh bên",
    expand: "Mở rộng thanh bên",
  },
  account: {
    role: "Founder",
  },
  switcher: {
    currentProject: "Dự án hiện tại",
    switchProject: "Chuyển dự án",
    current: "Đang chọn",
    viewAll: "Xem tất cả dự án",
    create: "Tạo dự án",
  },
  stages: {
    idea: "Ý tưởng",
    concept: "Khái niệm",
    prototype: "Nguyên mẫu",
    mvp: "Nguyên mẫu / MVP",
    "functional-demo": "Demo hoạt động",
    pilot: "Pilot / Người dùng sớm",
    "early-users": "Người dùng sớm",
    launched: "Đã ra mắt",
  } satisfies Record<VentureStage, string>,
  statuses: {
    setup: "Đang thiết lập",
    active: "Đang hoạt động",
    paused: "Tạm dừng",
    archived: "Đã lưu trữ",
  } satisfies Record<VentureStatus, string>,
} as const;
