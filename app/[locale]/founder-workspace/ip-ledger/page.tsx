"use client";

import React, { useState, useRef } from 'react';
import { Shield, UploadCloud, FileText, CheckCircle, Search, Eye, FileArchive } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';

export default function IPLedgerPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadState, setUploadState] = useState<'idle' | 'hashing' | 'done'>('idle');
  const [hashProgress, setHashProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      simulateHashing();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      simulateHashing();
    }
  };

  const simulateHashing = () => {
    setUploadState('hashing');
    setHashProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        clearInterval(interval);
        setHashProgress(100);
        setTimeout(() => setUploadState('done'), 400);
      } else {
        setHashProgress(progress);
      }
    }, 200);
  };

  return (
    <div className="px-8 py-8 max-w-6xl mx-auto space-y-10">

      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-kizuna-text-main tracking-tight mb-2">IP Ledger</h1>
        <p className="text-kizuna-text-muted text-lg max-w-2xl">
          Mã hóa băm và gắn dấu thời gian cho tài liệu. Bảo mật sở hữu trí tuệ của bạn mà không hề để lộ ý tưởng.
        </p>
      </div>

      {/* Trust Banner */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 mb-6 flex items-start gap-3 shadow-sm">
        <Shield className="text-kizuna-primary w-6 h-6 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-kizuna-text-main text-sm">Cơ chế Zero-Knowledge</h3>
          <p className="text-sm text-kizuna-text-muted mt-1">
            Tệp tài liệu của bạn không bao giờ rời khỏi trình duyệt. Chúng tôi chỉ lưu trữ mã băm mã hóa (cryptographic hash) và dấu thời gian trên sổ cái bất biến (immutable ledger).
          </p>
        </div>
      </div>

      {/* Upload Vault */}
      <section>
        <div
          className={`bg-kizuna-canvas border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-colors duration-200 ${isDragging ? 'border-kizuna-primary bg-zinc-50' : 'border-zinc-300 hover:bg-zinc-50'
            }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="bg-zinc-100 p-4 rounded-full mb-6">
            <UploadCloud className="w-10 h-10 text-zinc-400" />
          </div>

          <h3 className="text-lg font-medium text-kizuna-text-main mb-2">
            Kéo thả Pitch Deck hoặc Tài liệu kỹ thuật của bạn vào đây
          </h3>
          <p className="text-kizuna-text-muted text-sm mb-8 text-center max-w-md">
            Hỗ trợ PDF, DOCX, MD, và ZIP tối đa 50MB. Nội dung được mã hóa băm cục bộ ngay trên thiết bị.
          </p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.docx,.md,.zip"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-kizuna-primary text-white font-medium px-6 py-3 rounded-lg shadow-sm focus:outline-none"
          >
            Chọn tài liệu để Mã hóa
          </button>

          {/* Hashing Simulation UI */}
          {uploadState !== 'idle' && (
            <div className="mt-8 w-full max-w-md bg-zinc-50 border border-zinc-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {uploadState === 'done' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-kizuna-primary border-t-transparent rounded-full animate-spin" />
                  )}
                  <span className="text-sm font-medium text-kizuna-text-main">
                    {uploadState === 'hashing' ? 'Đang tạo mã băm SHA-256...' : 'Tạo mã băm Thành công'}
                  </span>
                </div>
                <span className="text-xs font-mono text-kizuna-text-muted">{hashProgress}%</span>
              </div>

              <div className="w-full bg-zinc-200 rounded-full h-2 mb-4 overflow-hidden">
                <div
                  className="bg-kizuna-primary h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${hashProgress}%` }}
                />
              </div>

              {uploadState === 'done' && (
                <div className="bg-zinc-100 rounded p-3 flex items-center justify-between border border-zinc-200">
                  <code className="font-mono text-xs text-kizuna-primary truncate pr-4">
                    8f43b79f...3a9c210d
                  </code>
                  <button className="text-xs font-medium text-kizuna-primary hover:underline whitespace-nowrap">
                    Sao chép mã Hash
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Ledger Data Table */}
      <section>
        <div className="flex items-center justify-between mt-10 mb-4">
          <h2 className="text-xl font-semibold text-kizuna-text-main">Lịch sử Tài sản đã Bảo mật</h2>
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm trong sổ cái..."
              className="pl-9 pr-4 py-2 border border-kizuna-border rounded-lg text-sm bg-kizuna-canvas focus:outline-none focus:ring-1 focus:ring-kizuna-primary w-64 text-kizuna-text-main"
            />
          </div>
        </div>

        <div className="bg-kizuna-canvas border border-kizuna-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-kizuna-surface border-b border-kizuna-border">
                  <th className="px-6 py-4 text-sm font-medium text-kizuna-text-muted">Tên Tài sản</th>
                  <th className="px-6 py-4 text-sm font-medium text-kizuna-text-muted">Mã băm mã hóa</th>
                  <th className="px-6 py-4 text-sm font-medium text-kizuna-text-muted">Dấu thời gian</th>
                  <th className="px-6 py-4 text-sm font-medium text-kizuna-text-muted">Trạng thái</th>
                  <th className="px-6 py-4 text-sm font-medium text-kizuna-text-muted text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-kizuna-border">

                {/* Row 1 */}
                <tr className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-zinc-400" />
                      <span className="font-medium text-kizuna-text-main text-sm">Kizuna_PitchDeck_v2.pdf</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-zinc-500 bg-zinc-100 px-2 py-1 rounded border border-zinc-200">
                      0x4b2c...9f1a
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-kizuna-text-muted">
                    Apr 28, 2026, 09:12:54 PM
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-kizuna-primary border border-emerald-100 px-2 py-1 rounded-md text-xs font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Đã xác thực
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex items-center gap-2 border border-zinc-200 bg-kizuna-canvas text-kizuna-text-main px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-zinc-50 transition-colors shadow-sm">
                      <Eye className="w-4 h-4 text-zinc-500" />
                      Xem Chứng chỉ
                    </button>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileArchive className="w-5 h-5 text-zinc-400" />
                      <span className="font-medium text-kizuna-text-main text-sm">Core_Algorithm_Source.zip</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-zinc-500 bg-zinc-100 px-2 py-1 rounded border border-zinc-200">
                      0x8f43...210d
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-kizuna-text-muted">
                    Apr 26, 2026, 02:45:11 PM
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-kizuna-primary border border-emerald-100 px-2 py-1 rounded-md text-xs font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Đã xác thực
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex items-center gap-2 border border-zinc-200 bg-kizuna-canvas text-kizuna-text-main px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-zinc-50 transition-colors shadow-sm">
                      <Eye className="w-4 h-4 text-zinc-500" />
                      Xem Chứng chỉ
                    </button>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="bg-kizuna-surface border-t border-kizuna-border px-6 py-3 flex items-center justify-between">
            <span className="text-sm text-kizuna-text-muted">Đang hiển thị 2 tài sản đã bảo mật</span>
          </div>
        </div>
      </section>

    </div>
  );
}
