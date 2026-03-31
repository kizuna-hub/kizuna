import { Navbar } from "@/components/navbar"
import { LayoutWrapper } from "./layout-wrapper"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col">
            <Navbar className="fixed top-0 left-0 right-0 h-16 z-50 border-b border-zinc-800 bg-zinc-950" />
            <LayoutWrapper>
                {children}
            </LayoutWrapper>
        </div>
    )
}
