export const mentorProfile = {
    name: 'TS. Lê Minh Trí',
    role: 'Phù thủy SpacetimeDB',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TriLe',
    stats: {
        totalHours: 45,
        totalProjects: 5,
        successDeals: 2,
        reputationScore: 980,
        badges: ['Pioneer Mentor', 'Tech Guru', 'Elite Guide']
    }
};

// Data tính bằng Đơn vị: Triệu VNĐ
export const valuationData = [
    { month: 'T1', valuation: 15 },
    { month: 'T2', valuation: 25 },
    { month: 'T3', valuation: 22 },
    { month: 'T4', valuation: 45 },
    { month: 'T5', valuation: 60 },
    { month: 'T6', valuation: 85 },
];

export const skillData = [
    { subject: 'SpacetimeDB', A: 95, fullMark: 100 },
    { subject: 'RAG / AI', A: 85, fullMark: 100 },
    { subject: 'Next.js', A: 90, fullMark: 100 },
    { subject: 'Flutter', A: 60, fullMark: 100 },
    { subject: 'Web3', A: 80, fullMark: 100 },
    { subject: 'System Design', A: 99, fullMark: 100 },
];

// Leaderboard gọi vốn sinh viên (Max 100 Triệu)
export const fundingLeaderboard = [
    { id: 1, name: 'AniLingo', sector: 'EdTech / AI', funding: 50, max: 80, investor: 'Quỹ BK Fund', investorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BK' },
    { id: 2, name: 'TrendEngine', sector: 'AI / Fashion', funding: 30, max: 50, investor: 'Sun Asterisk', investorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sun' },
    { id: 3, name: 'Kizuna Hub', sector: 'SaaS / Web3', funding: 15, max: 50, investor: 'FPT Ventures', investorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FPT' },
];

export const matchmakingRequests = [
    {
        id: 'req-1',
        projectName: 'DUTCareers',
        logo: '🎓',
        needs: 'Cố vấn kiến trúc hệ thống tuyển dụng chuyên biệt.',
        timeCommitment: '2 giờ/tuần',
        matchScore: 98,
        tags: ['Next.js', 'PostgreSQL'],
        teamInfo: 'Đội ngũ: 2 thành viên - ĐH Bách Khoa ĐN',
        founders: [
            {
                name: 'Nguyễn Tuấn Ngọc',
                role: 'Trưởng nhóm / Fullstack',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ngoc',
                university: 'ĐH Bách Khoa - ĐHĐN (DUT)',
                major: 'Sinh viên năm 3 - Khoa CNTT',
                email: 'tuanngoc.dev@sv.dut.udn.vn',
                phone: '0905.xxx.xxx',
                linkedin: 'linkedin.com/in/tuanngoc-dev',
                github: 'github.com/ngoc-dut'
            },
            {
                name: 'Tá Nhân',
                role: 'Quản lý dự án',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nhan',
                university: 'ĐH Bách Khoa - ĐHĐN (DUT)',
                major: 'Sinh viên năm 3 - Khoa CNTT',
                email: 'tanhan.pm@sv.dut.udn.vn',
                phone: '0935.xxx.xxx',
                linkedin: 'linkedin.com/in/tanhan',
                github: 'github.com/nhan-dut'
            }
        ],
        details: {
            bio: 'Nhóm chúng em nhận thấy sinh viên rất khó tìm việc đúng chuyên ngành ngay từ năm 2, năm 3. DUTCareers được xây dựng để giải quyết bài toán này. Team rất mạnh về code nhưng cần mentor hỗ trợ thiết kế database chịu tải tốt.',
            techStack: 'Next.js, NestJS, PostgreSQL, Redis',
            ask: '30 Triệu VNĐ cho 5% Cổ phần (Chi phí duy trì Server & Mkt)',
            breakEven: 'Đạt 2,000 users hoạt động/tháng'
        }
    },
    {
        id: 'req-2',
        projectName: 'GreenLogistics',
        logo: '🚚',
        needs: 'Tối ưu hóa thuật toán RAG cho dữ liệu vận tải',
        timeCommitment: '1 giờ/tuần',
        matchScore: 92,
        tags: ['RAG', 'Python'],
        teamInfo: 'Đội ngũ: 2 thành viên - Chuyên gia AI',
        founders: [
            { name: 'Trần Vũ Hoàng', role: 'AI Researcher', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hoang' }
        ],
        details: {
            bio: 'Tối ưu hóa bài toán TSP (Traveling Salesperson Problem) bằng AI kết hợp RAG.',
            techStack: 'Python, LangChain, VectorDB',
            ask: '$50,000 cho 10% Cổ phần',
            breakEven: 'Ký được 3 hợp đồng B2B'
        }
    }
];

export const activeMentees = [
    {
        id: 'team-1',
        projectName: 'DUTCareers',
        logo: '🌾',
        founder: 'Nguyễn Tuấn Ngọc',
        roadmapProgress: 65,
        milestones: [
            { label: 'Q1', status: 'done', desc: 'Lên ý tưởng' },
            { label: 'Q2', status: 'done', desc: 'Hoàn thiện Design' },
            { label: 'Q3', status: 'active', desc: 'Ra mắt bản Alpha' },
            { label: 'Q4', status: 'pending', desc: 'Đạt 1K Users' }
        ],
        alerts: 2,
        isHotDeal: true,
        lastMeeting: '2 ngày trước'
    },
    {
        id: 'team-2',
        projectName: 'Unburden',
        logo: '📦',
        founder: 'Trần Vũ Hoàng',
        roadmapProgress: 40,
        milestones: [
            { label: 'Q1', status: 'done', desc: 'Nghiên cứu TT' },
            { label: 'Q2', status: 'active', desc: 'Hoàn thiện UI/UX' },
            { label: 'Q3', status: 'pending', desc: 'Gọi vốn Seed' },
            { label: 'Q4', status: 'pending', desc: 'Chạy Beta' }
        ],
        alerts: 0,
        isHotDeal: false,
        lastMeeting: '1 tuần trước'
    }
];