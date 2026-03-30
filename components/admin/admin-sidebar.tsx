'use client';

import {
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { href: '/admin/faculty', icon: Users, label: 'Faculty' },
    { href: '/admin/submissions', icon: FileText, label: 'Submissions' },
    { href: '/admin/mentors', icon: Users, label: 'Mentors' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 h-full flex flex-col border-r bg-background border-border text-foreground">
            {/* Logo */}
            <div className="p-6 border-b border-border">
                <h1 className="text-xl font-bold text-primary">
                    Innovation
                </h1>
                <p className="text-xs mt-1 text-muted-foreground">
                    Admin Dashboard
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const isActive =
                        item.end
                            ? pathname === item.href
                            : pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            <Icon size={20} />
                            <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-border">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-muted-foreground hover:bg-muted hover:text-foreground">
                    <LogOut size={20} />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}
