"use client";
import React, { useState } from 'react';
import { ChevronDown, Lock, Link as LinkIcon, X, Mail, Clock, Copy, CheckCheck } from 'lucide-react';

export default function DataRoomHeader() {
  const [vaultOpen, setVaultOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [duration, setDuration] = useState('7d');
  const [nda, setNda] = useState(true);
  const [generated, setGenerated] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const token = Math.random().toString(36).substring(2, 10).toUpperCase();
    setGenerated(`https://kizuna.app/room/s/?ttl=&nda=${token}`);
  };

  const copy = () => {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const durations = [
    { value: '24h', label: '24 giờ' },
    { value: '7d', label: '7 ngày' },
    { value: '30d', label: '30 ngày' },
    { value: 'inf', label: 'Vô thời hạn' },
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-4 border-b border-hairline mb-6">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading font-black text-2xl text-ink tracking-tight">Secure Data Room</h1>
          <div className="relative mt-2">
            <button
              onClick={() => setVaultOpen(!vaultOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-hairline bg-surface-2 hover:bg-surface-1 transition-colors"
            >
              <div className="p-1 rounded bg-surface-1 text-ink-muted"><Lock className="h-3.5 w-3.5" /></div>
              <span className="font-body font-bold text-sm text-ink">Seed Round Pitch Deck</span>
              <ChevronDown className="h-3.5 w-3.5 text-ink-muted" />
            </button>
            {vaultOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 rounded-xl border border-hairline bg-surface-2 shadow-framer-edge z-10 py-1">
                <div className="px-3 py-2 border-b border-hairline">
                  <span className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">Select Vault</span>
                </div>
                <button className="w-full text-left px-3 py-2 hover:bg-surface-1 flex items-center justify-between group text-ink text-sm font-medium" onClick={() => setVaultOpen(false)}>
                  Seed Round Pitch Deck
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-1 text-ink-muted font-bold">Active</span>
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-surface-1 text-ink-muted text-sm" onClick={() => setVaultOpen(false)}>
                  SpacetimeDB Tech Architecture
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => { setModalOpen(true); setGenerated(''); }}
          className="flex items-center gap-2 bg-ink text-on-primary font-body font-bold rounded-pill px-5 py-2.5 text-sm hover:bg-ink/90 transition-colors shadow-framer-edge"
        >
          <LinkIcon className="h-4 w-4" />
          + Generate Magic Link
        </button>
      </div>

      {/* Magic Link Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-canvas/80 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          {/* Panel */}
          <div className="relative w-full max-w-md bg-surface-1 border border-hairline rounded-xxl shadow-framer-edge p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-ink" />
                <h2 className="font-heading font-bold text-lg text-ink">Generate Magic Link</h2>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-surface-2 text-ink-muted hover:text-ink transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-muted uppercase tracking-widest">Email người nhận</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="investor@fund.com"
                  className="w-full bg-surface-2 border border-hairline rounded-lg pl-9 pr-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent-blue focus:shadow-framer-focus transition-all"
                />
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-muted uppercase tracking-widest">Thời hạn truy cập</label>
              <div className="grid grid-cols-4 gap-2">
                {durations.map(d => (
                  <button
                    key={d.value} onClick={() => setDuration(d.value)}
                    className={"py-2 rounded-lg text-xs font-bold transition-all border " + (duration === d.value ? "bg-ink text-on-primary border-ink" : "bg-surface-2 text-ink-muted border-hairline hover:border-ink hover:text-ink")}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* NDA toggle */}
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-bold text-ink">Yêu cầu ký NDA</span>
                <p className="text-xs text-ink-muted mt-0.5">Chặn truy cập cho đến khi NDA được ký</p>
              </div>
              <button
                onClick={() => setNda(!nda)}
                className={"relative inline-flex h-5 w-9 items-center rounded-full transition-colors " + (nda ? "bg-ink" : "bg-surface-2 border border-hairline")}
              >
                <span className={"inline-block h-3.5 w-3.5 transform rounded-full bg-on-primary transition-transform " + (nda ? "translate-x-[18px]" : "translate-x-1")} />
              </button>
            </label>

            {/* Generated link output */}
            {generated && (
              <div className="flex items-center gap-2 p-3 bg-surface-2 rounded-lg border border-hairline">
                <span className="flex-1 text-xs text-ink-muted font-mono truncate">{generated}</span>
                <button onClick={copy} className="flex items-center gap-1.5 text-xs font-bold text-ink hover:text-accent-blue transition-colors shrink-0">
                  {copied ? <CheckCheck className="h-3.5 w-3.5 text-semantic-success" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 rounded-pill border border-hairline text-ink-muted text-sm font-bold hover:bg-surface-2 transition-colors">
                Hủy
              </button>
              <button
                onClick={generate}
                className="flex-1 py-2.5 rounded-pill bg-ink text-on-primary text-sm font-bold hover:bg-ink/90 transition-colors shadow-framer-edge"
              >
                {generated ? 'Tạo link mới' : 'Tạo Magic Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}