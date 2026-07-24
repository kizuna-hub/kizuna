'use client';

import React, { useState } from 'react';
import {
    Folder, FolderOpen, FileText, FileSpreadsheet, ShieldAlert,
    CheckCircle2, ChevronRight, Lock, Unlock, Mail, AlertTriangle,
    Sparkles, Download, Eye, Clock, MoreHorizontal, X, Check,
    TrendingDown, Users, Building2, Cpu, Scale,
    ArrowLeft, RefreshCw, BadgeAlert, CircleCheck, ZoomIn, ZoomOut, Link as LinkIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── TYPES ────────────────────────────────────────────────────────────────────
type FolderId = 'pitch' | 'financial' | 'legal' | 'tech' | 'hr';
type VerifyStatus = 'verified' | 'pending' | 'outdated';

interface Folder {
    id: FolderId;
    label: string;
    icon: React.ElementType;
    fileCount: number;
    verified: number;
    hasIssue?: boolean;
    done?: boolean;
}

interface DataFile {
    id: string;
    name: string;
    type: 'PDF' | 'XLSX' | 'PPT' | 'LINK' | 'DOCX';
    uploaded: string;
    status: VerifyStatus;
    size?: string;
    folder: FolderId;
}

interface RiskCard {
    id: string;
    severity: 'critical' | 'warning' | 'info';
    title: string;
    detail: string;
    source: string;
    fileId?: string; // Link to specific file
    timestamp: string;
    resolved?: boolean;
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const STARTUP = { name: 'SnapMoney', stage: 'Series A', founder: 'Lê Bảo', ask: '$1.2M' };

const FOLDERS: Folder[] = [
    { id: 'pitch', label: 'Pitch & Exec Summary', icon: Building2, fileCount: 4, verified: 4, done: true },
    { id: 'financial', label: 'Financial Models', icon: TrendingDown, fileCount: 6, verified: 4, hasIssue: true },
    { id: 'legal', label: 'Legal & Cap Table', icon: Scale, fileCount: 7, verified: 5, hasIssue: true },
    { id: 'tech', label: 'Tech Architecture', icon: Cpu, fileCount: 3, verified: 2 },
    { id: 'hr', label: 'HR & Team', icon: Users, fileCount: 5, verified: 3 },
];

const FILES: DataFile[] = [
    // ... [GIỮ NGUYÊN MOCK DATA FILES CỦA BẠN]
    // Pitch & Exec
    { id: 'f01', name: 'SnapMoney — Pitch Deck v4.2', type: 'PPT', uploaded: '2d ago', status: 'verified', size: '8.4 MB', folder: 'pitch' },
    { id: 'f02', name: 'Executive Summary Q1 2025', type: 'PDF', uploaded: '3d ago', status: 'verified', size: '1.2 MB', folder: 'pitch' },
    { id: 'f04', name: 'Investor Update — Apr 2025', type: 'PDF', uploaded: '5d ago', status: 'verified', size: '780 KB', folder: 'pitch' },
    // Financial
    { id: 'f05', name: 'Financial Model 2024–2027', type: 'XLSX', uploaded: '1d ago', status: 'verified', size: '2.1 MB', folder: 'financial' },
    { id: 'f07', name: 'Cash Flow Projection', type: 'XLSX', uploaded: '1w ago', status: 'outdated', size: '1.4 MB', folder: 'financial' },
    { id: 'f10', name: 'Burn Rate & Runway Model', type: 'XLSX', uploaded: '2d ago', status: 'pending', size: '890 KB', folder: 'financial' },
    // Legal & Cap Table
    { id: 'f11', name: 'Cap Table (Fully Diluted)', type: 'XLSX', uploaded: '2d ago', status: 'verified', size: '400 KB', folder: 'legal' },
    { id: 'f13', name: 'Shareholder Agreement v3', type: 'PDF', uploaded: '1w ago', status: 'verified', size: '3.4 MB', folder: 'legal' },
    { id: 'f14', name: 'CTO Vesting Schedule', type: 'DOCX', uploaded: '3d ago', status: 'pending', size: '220 KB', folder: 'legal' },
    { id: 'f17', name: 'Employment Contracts (Key)', type: 'PDF', uploaded: '5d ago', status: 'pending', size: '2.2 MB', folder: 'legal' },
    // Tech & HR (Shortened for brevity, use full in prod)
    { id: 'f18', name: 'System Architecture Diagram', type: 'PDF', uploaded: '4d ago', status: 'verified', size: '5.6 MB', folder: 'tech' },
    { id: 'f21', name: 'Org Chart & Team Bios', type: 'PDF', uploaded: '3d ago', status: 'verified', size: '900 KB', folder: 'hr' },
];

const RISK_CARDS: RiskCard[] = [
    {
        id: 'r1', severity: 'critical', title: 'Cap Table Discrepancy', fileId: 'f11',
        detail: 'AI detected a missing vesting schedule for the CTO. The Cap Table shows 8.5% equity allocation but no corresponding vesting agreement was found in the data room.',
        source: 'Cap Table (Fully Diluted) · CTO Vesting Schedule', timestamp: '2 min ago', resolved: false,
    },
    {
        id: 'r2', severity: 'warning', title: 'Burn Rate Anomaly', fileId: 'f10',
        detail: 'Projected 18-month runway in the PDF does not match the Excel Financial Model which shows 11-month runway at current MRR of $38K. Variance: $214K.',
        source: 'Burn Rate & Runway Model · Financial Model 2024–2027', timestamp: '5 min ago', resolved: false,
    },
    {
        id: 'r3', severity: 'warning', title: 'Outdated Cash Flow Projection', fileId: 'f07',
        detail: 'Cash Flow Projection was last updated 1 week ago and predates the April MRR data. The numbers may not reflect the recent 24% MoM growth spike.',
        source: 'Cash Flow Projection', timestamp: '8 min ago', resolved: false,
    },
];

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
    verified: { label: 'Verified', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
    pending: { label: 'Pending Review', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', dot: 'bg-amber-500' },
    outdated: { label: 'Outdated', color: 'text-red-700', bg: 'bg-red-50 border-red-200', dot: 'bg-red-500' },
} satisfies Record<VerifyStatus, { label: string; color: string; bg: string; dot: string }>;

const TYPE_COLORS: Record<string, string> = {
    PDF: 'bg-red-50 text-red-600 border-red-200',
    XLSX: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    PPT: 'bg-orange-50 text-orange-600 border-orange-200',
    LINK: 'bg-blue-50 text-blue-600 border-blue-200',
    DOCX: 'bg-indigo-50 text-indigo-600 border-indigo-200',
};

const FILE_ICON: Record<string, React.ElementType> = {
    PDF: FileText, XLSX: FileSpreadsheet, PPT: FileText, LINK: LinkIcon, DOCX: FileText,
};

const SEVERITY_CONFIG = {
    critical: { label: 'Critical', textColor: 'text-red-700', badgeBg: 'bg-red-100 border-red-300', cardBg: 'bg-red-50/60 border-red-200', iconColor: 'text-red-500', icon: ShieldAlert },
    warning: { label: 'Warning', textColor: 'text-amber-700', badgeBg: 'bg-amber-100 border-amber-300', cardBg: 'bg-amber-50/40 border-amber-200', iconColor: 'text-amber-500', icon: AlertTriangle },
    info: { label: 'Info', textColor: 'text-blue-700', badgeBg: 'bg-blue-100 border-blue-300', cardBg: 'bg-blue-50/40 border-blue-200', iconColor: 'text-blue-500', icon: Sparkles },
} satisfies Record<string, { label: string; textColor: string; badgeBg: string; cardBg: string; iconColor: string; icon: React.ElementType }>;

const DD_COMPLETION = 68;

// ─── PROGRESS BAR ──────────────────────────────────────────────────────────── 
function ProgressBar({ pct }: { pct: number }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="font-sans text-[10px] font-bold text-slate-500 uppercase tracking-widest">DD Completion</span>
                <span className="font-mono text-sm font-black text-[#102c1e]">{pct}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#a1e2b6] rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
            </div>
            <p className="font-sans text-xs text-slate-500">2 items need attention</p>
        </div>
    );
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: VerifyStatus }) {
    const cfg = STATUS_CONFIG[status];
    return (
        <span className={cn(
            'inline-flex items-center gap-1.5 font-sans text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border',
            cfg.bg, cfg.color,
        )}>
            <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
            {cfg.label}
        </span>
    );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function DueDiligenceTerminal() {
    const [activeFolder, setActiveFolder] = useState<FolderId>('legal');
    const [activeDocument, setActiveDocument] = useState<DataFile | null>(null);
    const [risks, setRisks] = useState<RiskCard[]>(RISK_CARDS);

    const visibleFiles = FILES.filter(f => f.folder === activeFolder);
    const activeFolderMeta = FOLDERS.find(f => f.id === activeFolder)!;

    const handleResolve = (id: string) => setRisks(prev => prev.map(r => r.id === id ? { ...r, resolved: true } : r));

    const criticalCount = risks.filter(r => r.severity === 'critical' && !r.resolved).length;
    const warningCount = risks.filter(r => r.severity === 'warning' && !r.resolved).length;

    return (
        <div className="flex h-screen bg-[#fafafa] overflow-hidden font-sans">

            {/* ══════════════════════════════════════════
                LEFT PANE — Index & Folders (w-[22%])
            ══════════════════════════════════════════ */}
            <aside className="w-[22%] min-w-[240px] max-w-[300px] shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
                <div className="px-6 py-6 border-b border-slate-100">
                    <a href="/investor/deal-flow" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#102c1e] transition-colors mb-4 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-sans text-xs font-bold uppercase tracking-widest">Deal Flow</span>
                    </a>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#102c1e] flex items-center justify-center text-xl shrink-0 shadow-md">💸</div>
                        <div className="min-w-0">
                            <p className="font-heading font-black text-[#102c1e] text-lg leading-tight truncate">{STARTUP.name}</p>
                            <span className="inline-block mt-1 font-sans text-[9px] font-black text-[#102c1e] bg-[#a1e2b6]/30 border border-[#a1e2b6]/50 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                {STARTUP.stage}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-5 border-b border-slate-100">
                    <ProgressBar pct={DD_COMPLETION} />
                </div>

                <div className="flex-1 overflow-y-auto px-3 py-4 [&::-webkit-scrollbar]:hidden">
                    <p className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">Folders</p>
                    <div className="space-y-1">
                        {FOLDERS.map(folder => {
                            const isActive = activeFolder === folder.id;
                            const Icon = isActive ? FolderOpen : Folder;
                            const allVerified = folder.verified === folder.fileCount;
                            return (
                                <button
                                    key={folder.id}
                                    onClick={() => { setActiveFolder(folder.id); setActiveDocument(null); }}
                                    className={cn(
                                        'group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left',
                                        isActive ? 'bg-[#102c1e]/5 border border-[#102c1e]/10' : 'hover:bg-slate-50 border border-transparent',
                                    )}
                                >
                                    <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-[#102c1e]' : 'text-slate-400')} />
                                    <span className={cn('font-sans text-sm font-semibold flex-1 truncate', isActive ? 'text-[#102c1e]' : 'text-slate-600 group-hover:text-[#102c1e]')}>
                                        {folder.label}
                                    </span>
                                    {folder.hasIssue && !isActive && <span className="w-2 h-2 rounded-full bg-red-500" />}
                                    {allVerified && !folder.hasIssue && <CheckCircle2 className="w-4 h-4 text-[#a1e2b6]" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-3 px-4 py-3 bg-[#102c1e]/5 rounded-xl border border-[#102c1e]/10">
                        <Lock className="w-4 h-4 text-[#102c1e]/60" />
                        <div className="min-w-0">
                            <p className="font-sans text-xs font-bold text-[#102c1e]">NDA-Protected Vault</p>
                            <p className="font-sans text-[10px] text-slate-500">Founder cannot see your notes</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ══════════════════════════════════════════
                MIDDLE PANE — Document List OR Reader View (w-[48%])
            ══════════════════════════════════════════ */}
            <main className="flex-1 flex flex-col overflow-hidden border-r border-slate-200 min-w-0 bg-white">

                {/* ── STATE 1: DOCUMENT READER ── */}
                {activeDocument ? (
                    <div className="flex flex-col h-full bg-[#f4f5f5]">
                        <div className="shrink-0 flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setActiveDocument(null)} className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                                <div>
                                    <h3 className="font-heading text-lg font-bold text-[#102c1e] leading-none">{activeDocument.name}</h3>
                                    <p className="font-sans text-[10px] text-slate-500 mt-1 uppercase tracking-widest">{activeDocument.folder} · {activeDocument.type}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                                    <button className="p-1.5 hover:bg-white rounded-md text-slate-500"><ZoomOut className="w-4 h-4" /></button>
                                    <span className="font-mono text-xs font-bold px-2 text-slate-600">100%</span>
                                    <button className="p-1.5 hover:bg-white rounded-md text-slate-500"><ZoomIn className="w-4 h-4" /></button>
                                </div>
                                <button className="flex items-center gap-2 bg-[#102c1e] text-white px-4 py-2 rounded-xl font-sans text-xs font-bold hover:bg-[#0a1c13] transition-colors">
                                    <Lock className="w-3.5 h-3.5 text-[#a1e2b6]" /> Request Download
                                </button>
                            </div>
                        </div>

                        {/* Mock PDF Viewer Area */}
                        <div className="flex-1 overflow-y-auto p-8 flex justify-center items-start">
                            <div className="w-full max-w-3xl bg-white min-h-[800px] shadow-lg border border-slate-200 relative p-12">
                                {/* Watermark */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 pointer-events-none">
                                    <span className="text-6xl font-black transform -rotate-45 font-heading text-[#102c1e] uppercase tracking-widest whitespace-nowrap">
                                        CONFIDENTIAL · VIEW ONLY
                                    </span>
                                </div>

                                {/* Mock Content */}
                                <div className="space-y-6 blur-[1px]">
                                    <div className="h-8 bg-slate-200 w-3/4 rounded" />
                                    <div className="h-4 bg-slate-100 w-full rounded" />
                                    <div className="h-4 bg-slate-100 w-full rounded" />
                                    <div className="h-4 bg-slate-100 w-5/6 rounded" />
                                </div>

                                {/* AI Highlight Box linked to Risk Card */}
                                <div className="mt-10 p-4 border-2 border-dashed border-red-400 bg-red-50/50 rounded-lg relative">
                                    <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white shadow-md">
                                        <ShieldAlert className="w-3 h-3" />
                                    </div>
                                    <p className="font-sans text-sm text-[#102c1e] font-medium leading-relaxed">
                                        As per section 4.2, the executive team reserves a pool of <span className="bg-red-200 px-1 font-bold">8.5% equity allocation</span> without defined vesting parameters in the current term sheet...
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ── STATE 2: DOCUMENT LIST VIEW ── */
                    <div className="flex flex-col h-full">
                        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200 px-8 py-5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <span className="font-sans text-xs text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">{STARTUP.name}</span>
                                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                                <div className="flex items-center gap-2">
                                    <span className="font-heading text-xl font-black text-[#102c1e] truncate">{activeFolderMeta.label}</span>
                                    <span className="font-sans text-[10px] font-bold text-slate-400 bg-slate-100 rounded-full px-2.5 py-0.5">{visibleFiles.length} files</span>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 font-sans text-xs font-bold text-[#102c1e] bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl transition-all whitespace-nowrap">
                                <Mail className="w-4 h-4" /> Ask Founder for Document
                            </button>
                        </div>

                        {/* Status Filter Bar */}
                        <div className="flex items-center gap-6 px-8 py-3.5 border-b border-slate-100 bg-[#fafafa]">
                            <div className="flex items-center gap-2 cursor-pointer group">
                                <span className="font-mono text-sm font-black text-emerald-600 group-hover:text-emerald-700">{visibleFiles.filter(f => f.status === 'verified').length}</span>
                                <span className="font-sans text-xs font-semibold text-slate-500 group-hover:text-slate-700">Verified</span>
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer group">
                                <span className="font-mono text-sm font-black text-amber-600 group-hover:text-amber-700">{visibleFiles.filter(f => f.status === 'pending').length}</span>
                                <span className="font-sans text-xs font-semibold text-slate-500 group-hover:text-slate-700">Pending</span>
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer group">
                                <span className="font-mono text-sm font-black text-red-600 group-hover:text-red-700">{visibleFiles.filter(f => f.status === 'outdated').length}</span>
                                <span className="font-sans text-xs font-semibold text-slate-500 group-hover:text-slate-700">Outdated</span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 z-10 bg-white border-b border-slate-200">
                                    <tr>
                                        {['Document Name', 'Type', 'Uploaded', 'Verification Status', ''].map(col => (
                                            <th key={col} className="font-sans text-[10px] font-bold uppercase tracking-widest text-slate-400 px-8 py-4 whitespace-nowrap">
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {visibleFiles.map(file => {
                                        const FileIcon = FILE_ICON[file.type] || FileText;
                                        return (
                                            <tr key={file.id} onClick={() => setActiveDocument(file)} className="group border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                                                <td className="px-8 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
                                                            <FileIcon className="w-5 h-5 text-slate-400" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-sans text-sm font-bold text-[#102c1e] truncate group-hover:text-[#4a7c5f] transition-colors">{file.name}</p>
                                                            {file.size && <p className="font-sans text-[10px] text-slate-400 mt-0.5">{file.size}</p>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-4">
                                                    <span className={cn('font-sans text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border', TYPE_COLORS[file.type] ?? 'bg-slate-50 text-slate-500 border-slate-200')}>
                                                        {file.type}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-4">
                                                    <div className="flex items-center gap-1.5 text-slate-500">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        <span className="font-sans text-xs font-medium">{file.uploaded}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-4"><StatusBadge status={file.status} /></td>
                                                <td className="px-8 py-4 text-right">
                                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                                                        <button className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 text-slate-400 hover:text-[#102c1e] shadow-sm"><Eye className="w-4 h-4" /></button>
                                                        <button className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 text-slate-400 hover:text-[#102c1e] shadow-sm"><Download className="w-4 h-4" /></button>
                                                        <button className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 text-slate-400 hover:text-[#102c1e] shadow-sm"><MoreHorizontal className="w-4 h-4" /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {visibleFiles.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-24 text-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4"><FolderOpen className="w-8 h-8 text-slate-300" /></div>
                                    <p className="font-heading text-lg font-bold text-[#102c1e] mb-1">No documents found</p>
                                    <p className="font-sans text-sm text-slate-500">This folder is currently empty.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* ══════════════════════════════════════════
                RIGHT PANE — AI DD Copilot (w-[30%])
            ══════════════════════════════════════════ */}
            <aside className="w-[30%] min-w-[320px] max-w-[420px] shrink-0 bg-white flex flex-col overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 bg-[#fafafa]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-[#102c1e] flex items-center justify-center shadow-md">
                                <Sparkles className="w-4 h-4 text-[#a1e2b6]" />
                            </div>
                            <h2 className="font-heading font-black text-[#102c1e] text-lg">AI Risk Analysis</h2>
                        </div>
                        <button className="p-2 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"><RefreshCw className="w-4 h-4" /></button>
                    </div>

                    <div className="flex items-center gap-2.5 px-4 py-3 bg-[#a1e2b6]/10 border border-[#a1e2b6]/30 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-[#a1e2b6] animate-pulse" />
                        <span className="font-sans text-xs font-bold text-[#102c1e]">Scanning {FILES.length} documents — Live</span>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 px-6 py-3.5 border-b border-slate-100 bg-white">
                    {criticalCount > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 shadow-sm">
                            <BadgeAlert className="w-3.5 h-3.5 text-red-600" />
                            <span className="font-sans text-[10px] font-black text-red-700">{criticalCount} Critical</span>
                        </div>
                    )}
                    {warningCount > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 shadow-sm">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span className="font-sans text-[10px] font-black text-amber-700">{warningCount} Warning</span>
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 [&::-webkit-scrollbar]:hidden bg-[#fafafa]/50">
                    {/* Render Risks (Lọc rủi ro nếu đang mở Document) */}
                    {risks
                        .filter(risk => !activeDocument || risk.fileId === activeDocument.id)
                        .map(risk => {
                            const cfg = SEVERITY_CONFIG[risk.severity];
                            const SeverityIcon = cfg.icon;

                            if (risk.resolved) return null;

                            return (
                                <div key={risk.id} className={cn('rounded-2xl border p-5 shadow-sm transition-all bg-white', cfg.cardBg)}>
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border', cfg.badgeBg)}>
                                            <SeverityIcon className={cn('w-4 h-4', cfg.iconColor)} />
                                        </div>
                                        <div className="flex-1 min-w-0 pt-0.5">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={cn('font-sans text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border', cfg.badgeBg, cfg.textColor)}>
                                                    {cfg.label}
                                                </span>
                                                <span className="font-sans text-[10px] font-medium text-slate-400">{risk.timestamp}</span>
                                            </div>
                                            <h4 className={cn('font-heading text-base font-bold leading-tight', cfg.textColor)}>{risk.title}</h4>
                                        </div>
                                    </div>

                                    <p className="font-sans text-sm text-slate-600 leading-relaxed mb-4">{risk.detail}</p>

                                    <div className="flex items-center gap-2 mb-5 p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                                        <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                                        <span className="font-sans text-xs font-semibold text-slate-600 truncate">{risk.source}</span>
                                    </div>

                                    <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-2 pt-1 border-t border-slate-100">
                                        <button className={cn(
                                            'flex-1 flex items-center justify-center gap-2 font-sans text-xs font-bold px-4 py-2.5 rounded-xl border transition-all shadow-sm',
                                            risk.severity === 'critical' ? 'bg-red-600 text-white border-red-600 hover:bg-red-700' : 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600',
                                        )}>
                                            <Mail className="w-3.5 h-3.5" /> Clarify
                                        </button>
                                        <button onClick={() => handleResolve(risk.id)} className="flex-1 flex items-center justify-center gap-2 font-sans text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-[#102c1e] hover:bg-slate-50 transition-all shadow-sm">
                                            <Check className="w-3.5 h-3.5" /> Resolve
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                </div>

                <div className="p-6 border-t border-slate-200 bg-white">
                    <button className="w-full flex items-center justify-center gap-2 bg-[#102c1e] text-white font-sans font-bold text-sm py-3 rounded-xl hover:bg-[#0a1c13] transition-colors shadow-md">
                        Export Full Report
                    </button>
                </div>
            </aside>
        </div>
    );
}