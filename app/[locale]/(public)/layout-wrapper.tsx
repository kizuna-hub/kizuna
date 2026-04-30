'use client'

import { useState } from 'react'
import { LeftSidebar } from "@/components/left-sidebar"
import { RightSidebar } from "@/components/right-sidebar"
import { PanelRightOpen } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(true)

    return (
        <div className="flex w-full pt-16 relative">
            {/* Left Column */}
            <div className="hidden md:block">
                <LeftSidebar />
            </div>

            {/* Center Column */}
            <main className="flex-1 min-w-0 w-full min-h-screen transition-all duration-500 ease-in-out">
                <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8">
                    {children}
                </div>
            </main>

            {/* Right Column */}
            <AnimatePresence initial={false}>
                {isRightSidebarVisible && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 320, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="hidden xl:block shrink-0 sticky top-16 h-[calc(100vh-64px)] overflow-hidden"
                    >
                        <div className="w-80 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            <RightSidebar onClose={() => setIsRightSidebarVisible(false)} />
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Floating Restore Button */}
            <AnimatePresence>
                {!isRightSidebarVisible && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setIsRightSidebarVisible(true)}
                        className="fixed bottom-8 right-8 z-50 p-3 bg-zinc-900 border border-zinc-700 hover:border-orange-500 text-zinc-400 hover:text-orange-500 rounded-full shadow-lg transition-colors"
                        title="Show Widgets"
                    >
                        <PanelRightOpen className="w-5 h-5" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    )
}
