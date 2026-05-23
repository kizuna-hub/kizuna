// components/project/data.ts
// Ảnh mạng được mock sẵn cho từng project
const images = [
    "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=300", // p1
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=300", // p2
    "https://images.unsplash.com/photo-1544654803-b69140b285a1?q=80&w=300", // p3
    "https://images.unsplash.com/photo-1542382257-80dedb725088?q=80&w=300", // p4
    "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=300", // r1
    "https://images.unsplash.com/photo-1579373903251-40179929f63f?q=80&w=300", // r2
    "https://images.unsplash.com/photo-1627393100177-b4297e79a5be?q=80&w=300", // r3
    "https://images.unsplash.com/photo-1512314889357-e157c22f938d?q=80&w=300", // r4
    "https://images.unsplash.com/photo-1563212623-b6770f5e1f0e?q=80&w=300", // r5
    "https://images.unsplash.com/photo-1626012678696-6e580a6b16e8?q=80&w=300"  // r6
]

export const projectData = {
    id: "snapmoney",
    name: "SNAPMONEY",
    version: "v1.0.0",
    tagline: "Moments of Autumn Captured in Photos",
    logo: "S",
    color: "bg-amber-400",
    category: "Chi tiêu cá nhân",
    stars: 0,
    reviews: 0,
    comments: 1,
    points: 8,
    maker: {
        name: "Trần Tiến Dũng",
        handle: "@dungchan",
        avatar: "T",
    },
    techStack: ["React", "Next.js", "Tailwind"],
    tags: ["SNAP", "PINEAPPLELOG", "SNAPMONEY", "AI"],
    stats: { views: 42, points: 8 }
};

export const relatedProjectsData = {
    moreFromMaker: [
        { id: "vshort", name: "VSHORT", desc: "Cộng đồng sáng tạo video ngắn hàng đầu Việt Nam.", logo: images[0], claps: 8, comments: 3 },
        { id: "hideseek", name: "HideSeek", desc: "Che giấu tin nhắn Zalo, Instagram, Telegram, Facebook", logo: images[1], claps: 7, comments: 3 },
        { id: "dailymap", name: "DailyMap", desc: "Ứng dụng kết nối cộng đồng bằng các địa điểm check-in thực tế", logo: images[2], claps: 8, comments: 1 },
        { id: "congcu", name: "CongCuTaiAll", desc: "Mở tiện ích, quét và tải về toàn bộ dữ liệu trên kênh", logo: images[3], claps: 6, comments: 1 },
    ],
    relatedProducts: [
        { id: "snapwall", name: "SnapWall", desc: "Nền tảng chia sẻ ảnh thời gian thực", logo: images[4], claps: 28, comments: 1 },
        { id: "dietfit", name: "Dietfit AI", desc: "Ứng dụng dinh dưỡng & theo dõi cân nặng cá nhân hóa cho người...", logo: images[5], claps: 13, comments: 1 },
        { id: "chiation", name: "Chiation.net", desc: "Chia tiền dễ như chia vui", logo: images[6], claps: 7, comments: 3 },
        { id: "scribble", name: "Scribble", desc: "Trợ lý cuộc họp AI ghi âm, phiên âm thời gian thực.", logo: images[7], claps: 7, comments: 2 },
        { id: "freetools", name: "Free Online Tools", desc: "Chuyển đổi video, ảnh và tài liệu miễn phí, cực nhanh, dễ dùng.", logo: images[8], claps: 6, comments: 1 },
        { id: "deron", name: "Deron", desc: "Chiến dịch Điện Biên Phủ trong lĩnh vực Logistics", logo: images[9], claps: 5, comments: 3 },
    ]
};