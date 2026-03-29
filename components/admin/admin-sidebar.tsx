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
        <aside
            className="w-64 h-full flex flex-col border-r"
            style={{
                backgroundColor: 'var(--admin-bg)',
                borderColor: 'var(--admin-border)',
            }}
        >
            {/* Logo */}
            <div className="p-6 border-b" style={{ borderColor: 'var(--admin-border)' }}>
                <h1
                    className="text-xl font-bold"
                    style={{ color: 'var(--admin-orange)' }}
                >
                    Innovation
                </h1>
                <p className="text-xs mt-1" style={{ color: 'var(--admin-text)' }}>
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
                            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
                            style={{
                                backgroundColor: isActive ? 'var(--admin-orange)' : 'transparent',
                                color: isActive ? '#000' : 'var(--admin-text)',
                            }}
                        >
                            <Icon size={20} />
                            <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t" style={{ borderColor: 'var(--admin-border)' }}>
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:opacity-80"
                    style={{
                        backgroundColor: 'transparent',
                        color: 'var(--admin-text)',
                    }}
                >
                    <LogOut size={20} />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}
