import { ProjectDetailsPage } from "@/components/project";
import { FeedNavbar } from "@/components/founder/founder-dashboard/public/feed/feed-navbar";

export default function ProjectPage({ params }: { params: { id: string } }) {
    return (
        <div className="min-h-screen bg-zinc-50">
            {/* Giữ nguyên Navbar từ feed để trải nghiệm liền mạch */}
            {/* Render component tổng hợp đã chia nhỏ */}
            <ProjectDetailsPage />
        </div>
    );
}