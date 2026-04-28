import { Navbar } from "@/components/navbar"
import { LayoutWrapper } from "./layout-wrapper"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-kizuna-canvas text-kizuna-text-main flex flex-col">
            <Navbar className="fixed top-0 left-0 right-0 h-16 z-50 border-b border-kizuna-border bg-kizuna-surface" />
            <LayoutWrapper>
                {children}
            </LayoutWrapper>
        </div>
    )
}
