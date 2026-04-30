// Định nghĩa cấu trúc dữ liệu Mentor
interface Mentor {
    id: string;
    name: string;
    role: string;
    company: string;
    location: string;
    avatar: string;
    rating: number;
    sessions: number;
    bio: string;
    expertise: string[];
    targetAudience: string;
    philosophy: string;
    industry: string;
    availability: string;
    languages: string[];
    aiMatch: string;
    projects: {
        name: string;
        logo: string;
        description: string;
        award: string;
        funding: string;
    }[];
}