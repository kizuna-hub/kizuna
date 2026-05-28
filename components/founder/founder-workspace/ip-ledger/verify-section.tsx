import React, { useState, useRef } from 'react';
import { Shield, Search, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const VerifySection = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [verifyState, setVerifyState] = useState<'idle' | 'verifying' | 'done'>('idle');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const simulateVerify = () => {
        setVerifyState('verifying');
        setTimeout(() => setVerifyState('done'), 1800);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
        >
            <div
                className={`bg-white border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all duration-300 relative min-h-[400px] mt-6 ${isDragging ? 'border-[#16452a] shadow-[0_0_15px_rgba(16,44,30,0.1)]' : 'border-zinc-300 hover:border-zinc-400'}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files?.length) simulateVerify(); }}
            >
                <div className="bg-zinc-50 p-5 rounded-full mb-6 border border-zinc-100 shadow-sm">
                    <Shield className="w-12 h-12 text-[#16452a]" />
                </div>

                <h3 className="text-lg font-medium text-zinc-900 mb-2 text-center">Thả tài liệu vào đây để kiểm tra bản quyền trên sổ cái Kizuna Hub</h3>
                <p className="text-zinc-500 text-sm mb-8 text-center max-w-md">Tải lên bản sao để đối chiếu mã băm với bản ghi gốc[cite: 1].</p>

                <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => e.target.files?.length && simulateVerify()} />
                <button onClick={() => fileInputRef.current?.click()} className="bg-white border border-zinc-300 text-zinc-900 font-medium px-6 py-3 rounded-lg hover:bg-zinc-50 transition-colors shadow-sm">
                    Chọn tài liệu để Kiểm tra
                </button>

                <AnimatePresence>
                    {verifyState !== 'idle' && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center border border-zinc-200 z-10 p-8">
                            {verifyState === 'verifying' ? (
                                <div className="flex flex-col items-center">
                                    <Search className="w-10 h-10 text-[#16452a] animate-pulse mb-4" />
                                    <p className="text-[#16452a] font-medium">Đang truy vấn trên SpacetimeDB Ledger...</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center w-full max-w-lg">
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 w-full shadow-sm text-center">
                                        <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                                        <h4 className="text-lg font-semibold text-emerald-800 mb-1">Xác thực Thành công</h4>
                                        <p className="text-emerald-700 text-sm">
                                            ✓ Tài liệu nguyên bản. Thuộc sở hữu của dự án <strong>Kizuna AI</strong> - Ghi nhận ngày: 28/04/2026[cite: 1].
                                        </p>
                                    </div>
                                    <button onClick={() => setVerifyState('idle')} className="mt-6 text-sm text-zinc-500 hover:text-zinc-900 underline underline-offset-4">Kiểm tra tài liệu khác</button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};