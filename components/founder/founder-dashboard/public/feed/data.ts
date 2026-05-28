// --- Dữ liệu cho dải Featured (Chuẩn Unikorn) ---
export const featuredProjects = [
    {
        id: "f1",
        name: "MarketOS",
        desc: "Công cụ tự động hóa Marketing AI cho startup sinh viên.",
        logo: "M",
        color: "bg-blue-600 text-white",
        points: 263
    },
    {
        id: "f2",
        name: "TrendEngine",
        desc: "Hyper-local events and deals platform that hit +5k scans.",
        logo: "T",
        color: "bg-[#16452a] text-white",
        points: 158,
        tag: "Sponsored"
    }
];

// --- Dữ liệu cho Main Feed (Mix với Timeline phong cách Editorial) ---
export const timelineProjects = [
    {
        id: "n1",
        date: "Hôm qua",
        name: "StudySync",
        logo: "S",
        color: "bg-purple-600",
        milestone: "Phát hành phiên bản Beta công khai, tích hợp tính năng Real-time Peer Mentorship.",
        tags: ["EdTech", "Social", "Beta"],
        claps: 189,
        comments: 24
    },
    {
        id: "n2",
        date: "10 Tháng 5",
        name: "CropGuard",
        logo: "C",
        color: "bg-green-600",
        milestone: "Giải pháp ứng dụng IoT + AI trong nông nghiệp. Hoàn thiện mô hình dự báo mầm bệnh với độ chính xác 94%.",
        tags: ["AgriTech", "IoT", "R&D"],
        claps: 156,
        comments: 8
    },
    {
        id: "n3",
        date: "8 Tháng 5",
        name: "VoiceCode",
        logo: "V",
        color: "bg-indigo-600",
        milestone: "IDE lập trình bằng giọng nói nhận Seed Signal từ quỹ BK Ventures với định giá $1.2M.",
        tags: ["DevTools", "AI", "Funding"],
        claps: 312,
        comments: 31
    }
];

// --- Dữ liệu cho Top Mentors ---
export const topMentors = [
    {
        id: "m1",
        name: "Takeru Hishinuma",
        expertise: "AI Architect & System Design",
        company: "TechNova Japan",
        sessions: 124,
        rating: "4.9",
        avatar: "T"
    },
    {
        id: "m2",
        name: "Alex Nguyen",
        expertise: "Go-to-Market & Growth",
        company: "ScaleUp Ventures",
        sessions: 89,
        rating: "5.0",
        avatar: "A"
    },
    {
        id: "m3",
        name: "Sarah Jenkins",
        expertise: "Product UI/UX",
        company: "Creative Studio",
        sessions: 210,
        rating: "4.8",
        avatar: "S"
    }
];

// --- Dữ liệu cho Top Investors ---
export const topInvestors = [
    {
        id: "i1",
        name: "NextGen Ventures",
        type: "VC Fund",
        stage: "Pre-Seed, Seed",
        ticket: "$50K - $200K",
        logo: "N",
        color: "bg-[#0a1c13]"
    },
    {
        id: "i2",
        name: "Alpha Angels",
        type: "Angel Syndicate",
        stage: "Seed",
        ticket: "$10K - $50K",
        logo: "A",
        color: "bg-[#16452a]"
    },
    {
        id: "i3",
        name: "DUT Innovation Fund",
        type: "University Fund",
        stage: "Idea, Pre-Seed",
        ticket: "$5K - $20K",
        logo: "D",
        color: "bg-slate-800"
    }
];