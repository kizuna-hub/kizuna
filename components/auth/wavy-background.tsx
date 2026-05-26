"use client";

import { motion } from "framer-motion";

export function WavyBackground() {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#07160f]">
            {/* LỚP NHIỄU HẠT (Grain Texture) - Làm cho nền có độ nhám sang trọng */}
            <div
                className="absolute inset-0 z-20 opacity-[0.04] mix-blend-overlay pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* DẢI SÁNG 1: Xanh rêu chéo từ góc trên */}
            <motion.div
                animate={{
                    transform: [
                        "translate(0%, 0%) rotate(0deg) scale(1)",
                        "translate(5%, 10%) rotate(10deg) scale(1.1)",
                        "translate(0%, 0%) rotate(0deg) scale(1)",
                    ],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-[#18422a] opacity-60 blur-[120px]"
            />

            {/* DẢI SÁNG 2: Xanh ngọc chéo từ góc dưới */}
            <motion.div
                animate={{
                    transform: [
                        "translate(0%, 0%) rotate(0deg) scale(1)",
                        "translate(-10%, -5%) rotate(-15deg) scale(1.2)",
                        "translate(0%, 0%) rotate(0deg) scale(1)",
                    ],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[80%] rounded-full bg-[#10301d] opacity-80 blur-[130px]"
            />

            {/* DẢI SÁNG 3: Vệt cắt chéo mờ ở giữa */}
            <motion.div
                animate={{
                    transform: [
                        "translate(-50%, -50%) rotate(-45deg)",
                        "translate(-45%, -55%) rotate(-40deg)",
                        "translate(-50%, -50%) rotate(-45deg)",
                    ],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[50%] left-[50%] w-[120%] h-[30%] bg-gradient-to-r from-transparent via-[#1c4d32] to-transparent opacity-30 blur-[100px]"
            />
        </div>
    );
}