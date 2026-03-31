import { Navbar } from "@/components/navbar"
import { LeftSidebar } from "@/components/left-sidebar"
import { RightSidebar } from "@/components/right-sidebar"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col">
            <Navbar className="fixed top-0 left-0 right-0 h-16 z-50 border-b border-zinc-800 bg-zinc-950" />
            <div className="flex w-full max-w-[1400px] mx-auto pt-16 relative">
                {/* Left Column */}
                <div className="hidden md:block">
                    <LeftSidebar />
                </div>
                {/* Center Column */}
                <main className="flex-1 min-w-0 w-full min-h-screen">
                    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8">
                        {children}
                    </div>
                </main>
                {/* Right Column */}
                <aside className="hidden xl:block w-80 shrink-0 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <RightSidebar />
                </aside>
            </div>
        </div>
    )
}
