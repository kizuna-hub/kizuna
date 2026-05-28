import React, { useState, useRef } from 'react';
import { Shield, Fingerprint, Network, Lock, CheckCircle, Check, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LedgerHistoryTable } from './ledger-history-table';

interface RegisterProps {
    handleCopy: (hash: string) => void;
    copiedHash: string | null;
}

export const RegisterSection = ({ handleCopy, copiedHash }: RegisterProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const [registerState, setRegisterState] = useState<'idle' | 'hashing' | 'done'>('idle');
    const [hashString, setHashString] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const simulateHashing = () => {
        setRegisterState('hashing');
        const interval = setInterval(() => {
            const chars = '0123456789abcdef';
            let result = '0x';
            for (let i = 0; i < 64; i++) result += chars[Math.floor(Math.random() * chars.length)];
            setHashString(result);
        }, 50);

        setTimeout(() => {
            clearInterval(interval);
            setHashString('0x4b2c9f1a8e3d7b6a5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b');
            setRegisterState('done');
        }, 2000);
    };

    const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const onDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) simulateHashing();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
        >
            {/* Trust Banner */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 flex items-start gap-3 shadow-sm">
                <Shield className="text-[#16452a] w-6 h-6 flex-shrink-0 mt-0.5" />
                <div>
                    <h3 className="font-semibold text-zinc-900 text-sm">Cơ chế Zero-Knowledge</h3>
                    <p className="text-sm text-zinc-500 mt-1">
                        Tệp của bạn không bao giờ rời khỏi trình duyệt. Chúng tôi chỉ lưu trữ mã băm mã hóa và dấu thời gian trên sổ cái bất biến.
                    </p>
                </div>
            </div>

            {/* Upload Vault */}
            <section>
                <div
                    className={`bg-white border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all duration-300 relative ${isDragging ? 'border-[#16452a] shadow-[0_0_15px_rgba(16,44,30,0.1)]' : 'border-zinc-300 hover:border-zinc-400'}`}
                    onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
                >
                    <div className="bg-zinc-50 p-5 rounded-full mb-6 border border-zinc-100 shadow-sm">
                        <Fingerprint className="w-12 h-12 text-[#16452a]" />
                    </div>

                    <h3 className="text-lg font-medium text-zinc-900 mb-2 text-center">Kéo thả Pitch Deck hoặc Tài liệu kỹ thuật vào Vault</h3>
                    <p className="text-zinc-500 text-sm mb-8 text-center max-w-md">Hỗ trợ PDF, DOCX, MD, và ZIP tối đa 50MB. Nội dung được mã hóa băm cục bộ.</p>

                    <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => e.target.files?.length && simulateHashing()} />
                    <button onClick={() => fileInputRef.current?.click()} className="bg-[#16452a] text-white font-medium px-6 py-3 rounded-lg hover:bg-[#0c2217] transition-colors shadow-sm">
                        Chọn tài liệu để Mã hóa
                    </button>

                    <AnimatePresence>
                        {registerState !== 'idle' && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center border border-zinc-200 z-10">
                                {registerState === 'hashing' ? (
                                    <div className="flex flex-col items-center">
                                        <Network className="w-10 h-10 text-[#16452a] animate-pulse mb-4" />
                                        <p className="text-[#16452a] font-medium mb-4">Đang tính toán mã băm SHA-256 cục bộ...</p>
                                        <div className="font-mono text-xs text-zinc-400 w-80 break-all text-center h-16 opacity-70">{hashString}</div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <CheckCircle className="w-12 h-12 text-emerald-500 mb-4" />
                                        <h4 className="text-lg font-medium text-zinc-900 mb-2">Tạo mã băm Thành công</h4>
                                        <div className="bg-zinc-50 border border-zinc-200 rounded px-4 py-2 flex items-center gap-3">
                                            <code className="font-mono text-xs text-zinc-900">{hashString.substring(0, 10)}...{hashString.substring(hashString.length - 8)}</code>
                                            <button onClick={() => handleCopy(hashString)} className="text-zinc-400 hover:text-zinc-900">
                                                {copiedHash === hashString ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        <button onClick={() => setRegisterState('idle')} className="mt-6 text-sm text-zinc-500 hover:text-zinc-900 underline underline-offset-4">Đăng ký tài liệu khác</button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            <LedgerHistoryTable handleCopy={handleCopy} copiedHash={copiedHash} />
        </motion.div>
    );
};