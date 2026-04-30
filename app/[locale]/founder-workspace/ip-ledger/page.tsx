"use client";

import React, { useState, useRef } from 'react';
import { Shield, Lock, Network, Fingerprint, CheckCircle, Search, Eye, FileArchive, FileText, Copy, Check, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IPLedgerPage() {
  const [activeTab, setActiveTab] = useState<'register' | 'verify'>('register');

  // Registration states
  const [isRegisterDragging, setIsRegisterDragging] = useState(false);
  const [registerState, setRegisterState] = useState<'idle' | 'hashing' | 'done'>('idle');
  const [hashString, setHashString] = useState('');
  const registerInputRef = useRef<HTMLInputElement>(null);

  // Verification states
  const [isVerifyDragging, setIsVerifyDragging] = useState(false);
  const [verifyState, setVerifyState] = useState<'idle' | 'verifying' | 'done'>('idle');
  const verifyInputRef = useRef<HTMLInputElement>(null);

  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

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

  const simulateVerify = () => {
    setVerifyState('verifying');
    setTimeout(() => setVerifyState('done'), 1800);
  };

  // Drag and Drop Handlers for Register
  const onRegisterDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsRegisterDragging(true);
  };
  const onRegisterDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsRegisterDragging(false);
  };
  const onRegisterDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsRegisterDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) simulateHashing();
  };

  // Drag and Drop Handlers for Verify
  const onVerifyDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsVerifyDragging(true);
  };
  const onVerifyDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsVerifyDragging(false);
  };
  const onVerifyDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsVerifyDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) simulateVerify();
  };

  return (
    <div className="px-8 py-8 max-w-6xl mx-auto space-y-8 bg-white min-h-screen">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight mb-2">IP Protection Ledger</h1>
        <p className="text-zinc-500 text-lg max-w-2xl">
          Mã hóa băm và gắn dấu thời gian cho tài liệu. Bảo mật sở hữu trí tuệ của bạn với cơ chế Zero-Knowledge.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-zinc-200 pb-px">
        <button
          onClick={() => setActiveTab('register')}
          className={`px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === 'register' ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
        >
          Đăng ký Tài liệu
          {activeTab === 'register' && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-kizuna-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('verify')}
          className={`px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === 'verify' ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
        >
          Xác thực Tài liệu
          {activeTab === 'verify' && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-kizuna-primary" />
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'register' ? (
          <motion.div
            key="register"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {/* Trust Banner */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 flex items-start gap-3 shadow-sm">
              <Shield className="text-kizuna-primary w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-zinc-900 text-sm">Cơ chế Zero-Knowledge</h3>
                <p className="text-sm text-zinc-500 mt-1">
                  Tệp của bạn không bao giờ rời khỏi trình duyệt (Zero-Knowledge). Chúng tôi chỉ lưu trữ mã băm mã hóa (cryptographic hash) và dấu thời gian trên sổ cái bất biến (immutable ledger).
                </p>
              </div>
            </div>

            {/* Upload Vault */}
            <section>
              <div
                className={`bg-white border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all duration-300 relative ${isRegisterDragging ? 'border-kizuna-primary shadow-[0_0_15px_rgba(16,44,30,0.1)]' : 'border-zinc-300 hover:border-zinc-400'}`}
                onDragOver={onRegisterDragOver}
                onDragLeave={onRegisterDragLeave}
                onDrop={onRegisterDrop}
              >
                <div className="bg-zinc-50 p-5 rounded-full mb-6 border border-zinc-100 shadow-sm">
                  <Fingerprint className="w-12 h-12 text-kizuna-primary" />
                </div>

                <h3 className="text-lg font-medium text-zinc-900 mb-2">
                  Kéo thả Pitch Deck hoặc Tài liệu kỹ thuật vào Vault
                </h3>
                <p className="text-zinc-500 text-sm mb-8 text-center max-w-md">
                  Hỗ trợ PDF, DOCX, MD, và ZIP tối đa 50MB. Nội dung được mã hóa băm cục bộ ngay trên thiết bị.
                </p>

                <input
                  type="file"
                  ref={registerInputRef}
                  onChange={(e) => { if (e.target.files && e.target.files.length > 0) simulateHashing(); }}
                  className="hidden"
                />

                <button
                  onClick={() => registerInputRef.current?.click()}
                  disabled={registerState !== 'idle'}
                  className="bg-kizuna-primary text-white font-medium px-6 py-3 rounded-lg shadow-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0c2217] transition-colors"
                >
                  Chọn tài liệu để Mã hóa
                </button>

                {/* Hashing Simulation UI */}
                <AnimatePresence>
                  {registerState !== 'idle' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center border border-zinc-200 z-10"
                    >
                      {registerState === 'hashing' ? (
                        <div className="flex flex-col items-center">
                          <Network className="w-10 h-10 text-kizuna-primary animate-pulse mb-4" />
                          <p className="text-kizuna-primary font-medium mb-4">Đang tính toán mã băm SHA-256 cục bộ...</p>
                          <div className="font-mono text-xs text-zinc-400 w-80 break-all text-center h-16 opacity-70">
                            {hashString}
                          </div>
                          <p className="text-xs text-zinc-500 mt-4 font-medium flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5" />
                            Tệp của bạn không bao giờ rời khỏi trình duyệt (Zero-Knowledge)
                          </p>
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex flex-col items-center"
                        >
                          <CheckCircle className="w-12 h-12 text-emerald-500 mb-4" />
                          <h4 className="text-lg font-medium text-zinc-900 mb-2">Tạo mã băm Thành công</h4>
                          <div className="bg-zinc-50 border border-zinc-200 rounded px-4 py-2 flex items-center gap-3">
                            <code className="font-mono text-xs text-zinc-900">
                              {hashString.substring(0, 10)}...{hashString.substring(hashString.length - 8)}
                            </code>
                            <button
                              onClick={() => handleCopy(hashString)}
                              className="text-zinc-400 hover:text-zinc-900 transition-colors"
                              title={copiedHash === hashString ? 'Đã sao chép' : 'Sao chép mã'}
                            >
                              {copiedHash === hashString ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                          <button
                            onClick={() => setRegisterState('idle')}
                            className="mt-6 text-sm text-zinc-500 hover:text-zinc-900 underline underline-offset-4"
                          >
                            Đăng ký tài liệu khác
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* Ledger Data Table */}
            <section>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mt-10 mb-4 gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900 mb-1">Lịch sử Tài sản đã Bảo mật</h2>
                  <div className="relative mt-3">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm trong sổ cái..."
                      className="pl-9 pr-4 py-2 border border-zinc-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-kizuna-primary w-64 text-zinc-900"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-zinc-600 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-full shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Đã đồng bộ thời gian thực
                </div>
              </div>

              <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-50 border-b border-zinc-200">
                        <th className="px-6 py-4 text-sm font-medium text-zinc-500">Tên Tài sản</th>
                        <th className="px-6 py-4 text-sm font-medium text-zinc-500">Mã băm mã hóa</th>
                        <th className="px-6 py-4 text-sm font-medium text-zinc-500">Dấu thời gian</th>
                        <th className="px-6 py-4 text-sm font-medium text-zinc-500 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                      {/* Row 1 */}
                      <tr className="hover:bg-zinc-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-zinc-400" />
                            <span className="font-medium text-zinc-900 text-sm">Kizuna_PitchDeck_v2.pdf</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => handleCopy('0x4b2c...9f1a')}>
                            <span className="font-mono text-xs text-zinc-600 bg-zinc-100 px-2 py-1 rounded border border-zinc-200">
                              0x4b2c...9f1a
                            </span>
                            <div className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" title={copiedHash === '0x4b2c...9f1a' ? 'Đã sao chép' : 'Sao chép'}>
                              {copiedHash === '0x4b2c...9f1a' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-500">
                          Apr 28, 2026, 09:12:54 PM
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="inline-flex items-center gap-2 border border-zinc-200 bg-white text-zinc-900 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-zinc-50 transition-colors shadow-sm">
                              <Eye className="w-4 h-4 text-zinc-500" />
                              Xem Chứng chỉ
                            </button>
                            <div className="relative group/menu">
                              <button className="p-1.5 border border-zinc-200 rounded-lg hover:bg-zinc-50 text-zinc-500 transition-colors bg-white shadow-sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                              <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-zinc-200 rounded-lg shadow-lg opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20 overflow-hidden text-left">
                                <button className="w-full text-left px-4 py-2.5 text-sm text-zinc-900 hover:bg-zinc-50 flex items-center gap-2">
                                  🔗 Chia sẻ quyền truy cập (Venture Connect)
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>

                      {/* Row 2 */}
                      <tr className="hover:bg-zinc-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <FileArchive className="w-5 h-5 text-zinc-400" />
                            <span className="font-medium text-zinc-900 text-sm">Core_Algorithm_Source.zip</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => handleCopy('0x8f43...210d')}>
                            <span className="font-mono text-xs text-zinc-600 bg-zinc-100 px-2 py-1 rounded border border-zinc-200">
                              0x8f43...210d
                            </span>
                            <div className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" title={copiedHash === '0x8f43...210d' ? 'Đã sao chép' : 'Sao chép'}>
                              {copiedHash === '0x8f43...210d' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-500">
                          Apr 26, 2026, 02:45:11 PM
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="inline-flex items-center gap-2 border border-zinc-200 bg-white text-zinc-900 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-zinc-50 transition-colors shadow-sm">
                              <Eye className="w-4 h-4 text-zinc-500" />
                              Xem Chứng chỉ
                            </button>
                            <div className="relative group/menu">
                              <button className="p-1.5 border border-zinc-200 rounded-lg hover:bg-zinc-50 text-zinc-500 transition-colors bg-white shadow-sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                              <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-zinc-200 rounded-lg shadow-lg opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20 overflow-hidden text-left">
                                <button className="w-full text-left px-4 py-2.5 text-sm text-zinc-900 hover:bg-zinc-50 flex items-center gap-2">
                                  🔗 Chia sẻ quyền truy cập (Venture Connect)
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="bg-zinc-50 border-t border-zinc-200 px-6 py-3 flex items-center justify-between">
                  <span className="text-sm text-zinc-500">Đang hiển thị 2 tài sản đã bảo mật</span>
                </div>
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="verify"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {/* Verify Section */}
            <div className="bg-white border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all duration-300 relative min-h-[400px] mt-6"
              style={{ borderColor: isVerifyDragging ? '#102c1e' : '#e4e4e7', boxShadow: isVerifyDragging ? '0 0 15px rgba(16,44,30,0.1)' : 'none' }}
              onDragOver={onVerifyDragOver}
              onDragLeave={onVerifyDragLeave}
              onDrop={onVerifyDrop}
            >
              <div className="bg-zinc-50 p-5 rounded-full mb-6 border border-zinc-100 shadow-sm">
                <Shield className="w-12 h-12 text-kizuna-primary" />
              </div>

              <h3 className="text-lg font-medium text-zinc-900 mb-2">
                Thả tài liệu vào đây để kiểm tra bản quyền trên sổ cái Kizuna Hub
              </h3>
              <p className="text-zinc-500 text-sm mb-8 text-center max-w-md">
                Tải lên bản sao để đối chiếu mã băm với bản ghi gốc.
              </p>

              <input
                type="file"
                ref={verifyInputRef}
                onChange={(e) => { if (e.target.files && e.target.files.length > 0) simulateVerify(); }}
                className="hidden"
              />

              <button
                onClick={() => verifyInputRef.current?.click()}
                disabled={verifyState !== 'idle'}
                className="bg-white border border-zinc-300 text-zinc-900 font-medium px-6 py-3 rounded-lg shadow-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 transition-colors"
              >
                Chọn tài liệu để Kiểm tra
              </button>

              {/* Verify Simulation UI */}
              <AnimatePresence>
                {verifyState !== 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center border border-zinc-200 z-10 p-8"
                  >
                    {verifyState === 'verifying' ? (
                      <div className="flex flex-col items-center">
                        <Search className="w-10 h-10 text-kizuna-primary animate-pulse mb-4" />
                        <p className="text-kizuna-primary font-medium mb-4">Đang truy vấn trên SpacetimeDB Ledger...</p>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center w-full max-w-lg"
                      >
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 w-full shadow-sm text-center">
                          <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                          <h4 className="text-lg font-semibold text-emerald-800 mb-1">Xác thực Thành công</h4>
                          <p className="text-emerald-700 text-sm">
                            ✓ Tài liệu nguyên bản. Thuộc sở hữu của dự án <strong>Kizuna AI</strong> - Ghi nhận ngày: 28/04/2026.
                          </p>
                        </div>
                        <button
                          onClick={() => setVerifyState('idle')}
                          className="mt-6 text-sm text-zinc-500 hover:text-zinc-900 underline underline-offset-4"
                        >
                          Kiểm tra tài liệu khác
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
