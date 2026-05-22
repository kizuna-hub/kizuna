export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        // Bỏ hết Navbar và LayoutWrapper cũ
        // Chỉ bọc children trong một thẻ div cơ bản với nền trắng ngà zinc-50
        <div className="min-h-screen bg-zinc-50 text-slate-900 selection:bg-[#16452a]/20">
            {children}
        </div>
    )
}