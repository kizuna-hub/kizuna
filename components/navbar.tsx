'use client'

import React, { useState, useTransition } from 'react';
import { Sparkles, Search, Bell, Plus, LayoutDashboard, UserCircle, LogOut, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils'
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';

export function Navbar({ className }: { className?: string }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLanguageSwitch = (newLocale: string) => {
    setIsLangOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <nav className={cn("sticky top-0 z-50 bg-kizuna-surface/90 backdrop-blur-md border-b border-kizuna-border", className)}>
      <div className="flex items-center justify-between h-16 px-6 max-w-screen-2xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-kizuna-primary p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-kizuna-text-main hover:text-kizuna-primary transition-colors">Kizuna Hub</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-kizuna-text-muted" />
            <Input
              placeholder="Khám phá dự án..."
              className="w-full pl-10 pr-12 bg-kizuna-canvas border border-kizuna-border text-kizuna-text-main placeholder:text-kizuna-text-muted rounded-lg shadow-sm"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase font-bold text-kizuna-text-muted bg-kizuna-surface border border-kizuna-border px-1.5 py-0.5 rounded">
              ⌘ K
            </kbd>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Button
            asChild
            className="bg-kizuna-primary text-white rounded-md border-none shadow-none"
          >
            <Link href="/submit-project" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Khởi tạo dự án
            </Link>
          </Button>
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1 p-2 hover:bg-kizuna-border/50 rounded-lg text-kizuna-text-muted transition-colors"
            >
              <Globe className="w-5 h-5" />
              <span className="text-sm font-medium uppercase">{locale}</span>
            </button>
            {isLangOpen && (
              <div className="absolute top-full right-0 mt-1 w-24 bg-white border border-kizuna-border rounded-lg shadow-lg py-1 z-50">
                <button
                  onClick={() => handleLanguageSwitch('en')}
                  disabled={isPending}
                  className={cn("w-full text-left px-4 py-2 text-sm hover:bg-zinc-50 transition-colors", locale === 'en' && "font-bold text-kizuna-primary")}
                >
                  EN
                </button>
                <button
                  onClick={() => handleLanguageSwitch('vi')}
                  disabled={isPending}
                  className={cn("w-full text-left px-4 py-2 text-sm hover:bg-zinc-50 transition-colors", locale === 'vi' && "font-bold text-kizuna-primary")}
                >
                  VI
                </button>
              </div>
            )}
          </div>
          <button className="relative p-2 hover:bg-kizuna-border/50 rounded-lg">
            <Bell className="w-5 h-5 text-kizuna-text-muted" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-kizuna-primary rounded-full" />
          </button>
          <div className="relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="focus:outline-none rounded-full flex items-center">
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-kizuna-border rounded-xl shadow-lg p-2 z-50">
                <Link href="/founder-workspace" className="flex items-center gap-2 p-2 hover:bg-zinc-50 rounded-lg text-kizuna-text-main text-sm font-medium transition-colors">
                  <LayoutDashboard className="w-4 h-4" />
                  Không gian làm việc
                </Link>
                <div className="border-t border-kizuna-border my-1" />
                <button className="w-full flex items-center gap-2 p-2 hover:bg-zinc-50 rounded-lg text-kizuna-text-main text-sm transition-colors text-left">
                  <UserCircle className="w-4 h-4" />
                  Hồ sơ cá nhân
                </button>
                <button className="w-full flex items-center gap-2 p-2 hover:bg-zinc-50 rounded-lg text-kizuna-text-main text-sm transition-colors text-left">
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
