"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { authCopy, type AuthMode } from "./auth-config";

export function AuthShowcase({ mode }: { mode: AuthMode }) {
    const pageCopy = authCopy[mode];

    return (
        <div className="relative hidden h-full w-full overflow-hidden bg-primary p-10 lg:flex lg:flex-col lg:justify-between">
            {/* Background Image & Overlay */}
            <motion.div
                aria-hidden="true"
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=85')",
                }}
                animate={{ scale: [1, 1.04, 1], y: [0, -12, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/55 to-background/20" />
            <div className="absolute inset-0 bg-radial-[at_70%_25%] from-accent/30 via-transparent to-transparent" />

            {/* Branding */}
            <Link href="/" className="relative z-10 inline-flex w-fit items-center text-2xl font-bold tracking-tight text-primary-foreground">
                Kizuna Hub <span className="text-accent">.</span>
            </Link>

            {/* Floating Testimonial Card */}
            <motion.div
                className={cn(
                    "relative z-10 max-w-md rounded-3xl border border-primary-foreground/20 bg-card/15 p-8",
                    "text-primary-foreground shadow-2xl backdrop-blur-xl"
                )}
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-primary-foreground/15">
                    <ShieldCheck className="size-6" strokeWidth={1.7} />
                </div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary-foreground/70">
                    {pageCopy.noteTitle}
                </p>
                <blockquote className="mt-5 font-serif text-3xl font-medium leading-tight tracking-tight">
                    &ldquo;{pageCopy.noteBody}&rdquo;
                </blockquote>
                <p className="mt-6 text-sm font-medium text-primary-foreground/75">
                    {pageCopy.noteMeta}
                </p>
            </motion.div>
        </div>
    );
}