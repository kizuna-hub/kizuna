'use client';

import React, { useState } from 'react';
import {
    Inbox, CheckCircle2, X, Clock, ChevronRight,
    Building2, TrendingUp, FileText, MessageSquare,
    Sparkles, ArrowRight, Send, Shield, ExternalLink, CalendarDays,
    Mail, Phone, GraduationCap, Briefcase, Lightbulb, AlertCircle,
    Zap, MapPin, BarChart3, DollarSign,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── TYPES ────────────────────────────────────────────────────────
type RequestStatus = 'pending' | 'accepted' | 'declined' | 'countered';
type RequestUrgency = 'high' | 'medium' | 'low';

interface MentoringRequest {
    id: number;
    startup: string;
    vertical: string;
    location: string;
    stage: string;
    // Founder
    founder: string;
    founderTitle: string;
    founderEmail: string;
    founderPhone: string;
    founderSchool: string;
    founderCompany: string;
    // Match
    matchScore: number;
    // Request
    ask: string;
    equityOffer: string;
    vestingSchedule: string;
    timeCommitment: string;
    status: RequestStatus;
    urgency: RequestUrgency;
    // Pitch
    problem: string;
    situation: string;
    solution: string;
    pitchAbstract: string;
    date: string;
    relativeTime: string;
    // Traction
    metrics: { label: string; value: string; trend?: string; highlight?: boolean }[];
    sparkline: number[]; // 6 monthly revenue bars (relative heights 0–100)
    tags: string[];
    hasDataRoom: boolean;
    aiSummary: string;
}

// ─── MOCK DATA ────────────────────────────────────────────────────
const REQUESTS: MentoringRequest[] = [
    {
        id: 1,
        startup: 'EcoDeliver',
        vertical: 'LogiTech',
        location: 'Hà Nội, Vietnam',
        stage: 'Seed',
        founder: 'Nguyễn Văn Minh',
        founderTitle: 'CEO & Co-founder',
        founderEmail: 'minh@ecodeliver.vn',
        founderPhone: '+84 98 123 4567',
        founderSchool: 'HUST (Bách Khoa HN)',
        founderCompany: 'Ex-Giao Hàng Nhanh',
        matchScore: 94,
        ask: 'Go-to-Market Strategy',
        equityOffer: '0.5%',
        vestingSchedule: '2 năm, cliff 6 tháng',
        timeCommitment: '2h/tháng',
        status: 'pending',
        urgency: 'high',
        problem: 'Ngành logistics chặng cuối tại VN phụ thuộc 95% vào xe máy xăng, phát thải CO₂ cao và chi phí nhiên liệu chiếm 38% COGS — khiến biên lợi nhuận mỏng và khó mở rộng.',
        situation: 'Đã vận hành profitably tại Hà Nội & TP.HCM với đội xe điện 120 chiếc. Có 3 hợp đồng B2B ký với Tiki, Sendo và một chuỗi siêu thị. Đang tăng trưởng +32% MoM, doanh thu $45K/tháng.',
        solution: 'Nền tảng điều phối xe điện theo route AI — giảm chi phí vận hành 40% và phát thải 100% so với fleet xăng truyền thống. Mô hình franchise cho các đối tác city.',
        pitchAbstract: 'EcoDeliver là nền tảng giao hàng chặng cuối sử dụng 100% xe điện, đã có lãi tại 2 thành phố. Cần Mentor giàu kinh nghiệm B2B logistics và đàm phán partnership với các sàn TMĐT lớn.',
        date: '2 Jun 2026',
        relativeTime: '2 giờ trước',
        metrics: [
            { label: 'Doanh thu', value: '$45K/mo', trend: '+32%', highlight: true },
            { label: 'Biên GP', value: '28%', trend: '+5pts' },
            { label: 'Đội ngũ', value: '18 người' },
            { label: 'Đối tác B2B', value: '3 hợp đồng' },
        ],
        sparkline: [28, 35, 40, 38, 42, 45],
        tags: ['Logistics', 'GreenTech', 'B2B', 'Vietnam'],
        hasDataRoom: true,
        aiSummary: 'Phù hợp cao với kinh nghiệm logistics & GTM của bạn. Startup đã có revenue và tìm kiếm strategic guidance, không phải funding. Rủi ro thấp, upside cao.',
    },
    {
        id: 2,
        startup: 'Nexus AI',
        vertical: 'AI SaaS',
        location: 'TP.HCM, Vietnam',
        stage: 'Series A Prep',
        founder: 'Lê Hoàng',
        founderTitle: 'Founder & CTO',
        founderEmail: 'hoang@nexus.ai',
        founderPhone: '+84 90 876 5432',
        founderSchool: 'NUS Singapore (CS)',
        founderCompany: 'Ex-Zalo AI Lab',
        matchScore: 82,
        ask: 'Series A Fundraising',
        equityOffer: '1.0%',
        vestingSchedule: '2 năm, cliff 6 tháng',
        timeCommitment: '4h/tháng',
        status: 'pending',
        urgency: 'medium',
        problem: 'Doanh nghiệp SME mất trung bình 3.2h/ngày cho công việc CSKH lặp đi lặp lại qua chat, email và điện thoại. Chi phí nhân sự chiếm >45% operating costs mà chất lượng phục vụ vẫn không đồng đều.',
        situation: 'MRR $28K với 42 khách hàng SME, NRR 118%, churn < 2%/tháng. Đã tích hợp với Zalo OA, Facebook Messenger và email. Pipeline Series A gồm 4 quỹ đang interest.',
        solution: 'AI Conversational Platform — tự động xử lý 80% ticket CSKH mà không cần nhân viên. Tích hợp nhanh < 2 tuần, model fine-tuned theo từng domain ngành.',
        pitchAbstract: 'Nexus tự động hóa quy trình CSKH bằng AI conversational. Đang chuẩn bị gọi Series A $2M và cần Mentor có mạng lưới quỹ đầu tư. MRR $28K, tăng trưởng ổn định.',
        date: '1 Jun 2026',
        relativeTime: 'Hôm qua',
        metrics: [
            { label: 'MRR', value: '$28K', trend: '+18%', highlight: true },
            { label: 'NRR', value: '118%', trend: '+3pts' },
            { label: 'Khách hàng', value: '42 SME' },
            { label: 'Churn', value: '<2%/mo' },
        ],
        sparkline: [18, 20, 22, 23, 26, 28],
        tags: ['AI', 'SaaS', 'Series A Prep', 'CX Automation'],
        hasDataRoom: true,
        aiSummary: 'Match tốt ở kỹ năng fundraising. Tuy nhiên equity 1% khá cao — có thể negotiate xuống 0.5% với điều khoản vesting. Team kỹ thuật mạnh nhưng thiếu commercial.',
    },
    {
        id: 3,
        startup: 'VRSync',
        vertical: 'PropTech',
        location: 'Đà Nẵng, Vietnam',
        stage: 'Pre-Seed',
        founder: 'Trần Bảo',
        founderTitle: 'Founder',
        founderEmail: 'bao@vrsync.io',
        founderPhone: '+84 91 234 5678',
        founderSchool: 'RMIT Vietnam (IT)',
        founderCompany: 'Freelance 3D / WebGL',
        matchScore: 65,
        ask: 'Tech Architecture Review',
        equityOffer: '0.2%',
        vestingSchedule: '18 tháng, không cliff',
        timeCommitment: '1h/tháng',
        status: 'pending',
        urgency: 'low',
        problem: 'Người mua bất động sản phải đặt cọc hàng chục tỷ mà chưa từng đặt chân vào căn hộ thực tế. 70% quyết định mua hàng dựa trên ảnh render 2D lỗi thời, tỷ lệ hoàn trả/hủy hợp đồng lên đến 23%.',
        situation: 'Beta đang chạy với 2 chủ đầu tư nhỏ tại Đà Nẵng. 150 lượt xem VR tour/tuần, conversion sang đặt cọc 11% (vs. 4% trung bình ngành). Pre-seed, chưa có doanh thu.',
        solution: 'Nền tảng VR Tour cho BĐS — rendering WebGL real-time, không cần cài app, chạy trực tiếp trên browser và mobile. Tích hợp vào CRM của sàn giao dịch BĐS trong < 1 ngày.',
        pitchAbstract: 'Cung cấp tour thực tế ảo cho bất động sản. Cần cố vấn về tối ưu hóa WebGL rendering và hạ tầng cloud. Pre-seed, chưa có doanh thu.',
        date: '30 May 2026',
        relativeTime: '2 ngày trước',
        metrics: [
            { label: 'Stage', value: 'Pre-Seed' },
            { label: 'VR Tours/wk', value: '150 lượt' },
            { label: 'Conversion', value: '11%', highlight: true },
            { label: 'MRR', value: '$0' },
        ],
        sparkline: [0, 0, 5, 8, 10, 11],
        tags: ['VR', 'PropTech', 'Early Stage', 'WebGL'],
        hasDataRoom: false,
        aiSummary: 'Match thấp hơn — PropTech & WebGL nằm ngoài core expertise của bạn. Equity 0.2% là thấp với cam kết technical review. Tuy nhiên nếu có bandwidth, đây là cơ hội học hỏi domain mới.',
    },
];

// ─── STATUS CONFIG ────────────────────────────────────────────────
const STATUS_CFG: Record<RequestStatus, { label: string; dot: string; badge: string }> = {
    pending: { label: 'Chờ phản hồi', dot: 'bg-[#102c1e]', badge: 'bg-[#102c1e]/8 text-[#102c1e] border-[#102c1e]/15' },
    accepted: { label: 'Đã chấp nhận', dot: 'bg-[#a1e2b6]', badge: 'bg-[#a1e2b6]/20 text-[#102c1e] border-[#a1e2b6]/40' },
    declined: { label: 'Đã từ chối', dot: 'bg-slate-300', badge: 'bg-slate-100 text-slate-500 border-slate-200' },
    countered: { label: 'Đã counter', dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-600 border-slate-200' },
};

const URGENCY_CFG: Record<RequestUrgency, { label: string; color: string }> = {
    high: { label: 'Ưu tiên cao', color: 'text-[#102c1e]' },
    medium: { label: 'Trung bình', color: 'text-slate-500' },
    low: { label: 'Thấp', color: 'text-slate-400' },
};

// ─── SCORE RING ───────────────────────────────────────────────────
function ScoreRing({ score, size = 48 }: { score: number; size?: number }) {
    const r = (size / 2) - 5, c = 2 * Math.PI * r;
    const color = score >= 85 ? '#a1e2b6' : score >= 70 ? '#8ab4a0' : '#cbd5e1';
    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90" style={{ width: size, height: size }}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth="4" />
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="4"
                    strokeLinecap="round" strokeDasharray={`${(score / 100) * c} ${c}`}
                    className="transition-all duration-700" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-[11px] font-black text-[#102c1e]">{score}</span>
            </div>
        </div>
    );
}

// ─── MAIN ─────────────────────────────────────────────────────────
export default function MentorInbox() {
    const [selected, setSelected] = useState<MentoringRequest>(REQUESTS[0]);
    const [requests, setRequests] = useState(REQUESTS);
    const [activeFilter, setActiveFilter] = useState<RequestStatus | 'all'>('all');
    const [showCounter, setShowCounter] = useState(false);
    const [counterNote, setCounterNote] = useState('');

    const pending = requests.filter(r => r.status === 'pending').length;

    const handleAction = (id: number, action: RequestStatus) => {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
        // Select next pending
        const next = requests.find(r => r.id !== id && r.status === 'pending');
        if (next) setSelected({ ...next, status: next.id === id ? action : next.status });
    };

    const filtered = activeFilter === 'all' ? requests : requests.filter(r => r.status === activeFilter);

    return (
        <div className="h-screen overflow-hidden bg-[#fafafa] font-sans flex flex-col">

            {/* ── TOP HEADER BAR ── */}
            <header className="shrink-0 px-8 pt-6 pb-4 border-b border-[#102c1e]/8 bg-white">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="font-heading font-black text-[#102c1e] text-2xl tracking-tight">Mentor Inbox</h1>
                            {pending > 0 && (
                                <div className="flex items-center gap-1.5 bg-[#102c1e] text-white px-2.5 py-1 rounded-full">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a1e2b6] opacity-75" />
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#a1e2b6]" />
                                    </span>
                                    <span className="font-sans text-[10px] font-black">{pending} chờ phản hồi</span>
                                </div>
                            )}
                        </div>
                        <p className="font-sans text-slate-500 text-sm">
                            Founder gửi yêu cầu kết nối. AI đã phân tích và sắp xếp theo độ phù hợp hồ sơ của bạn.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {(['all', 'pending', 'accepted', 'declined'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={cn(
                                    'px-3 py-1.5 rounded-xl font-sans text-xs font-bold transition-all',
                                    activeFilter === f
                                        ? 'bg-[#102c1e] text-white shadow-md'
                                        : 'bg-[#fafafa] border border-[#102c1e]/10 text-slate-500 hover:text-[#102c1e] hover:border-[#102c1e]/25'
                                )}
                            >
                                {f === 'all' ? 'Tất cả' : STATUS_CFG[f].label}
                                {f === 'pending' && pending > 0 && (
                                    <span className="ml-1.5 bg-[#a1e2b6]/30 text-[#102c1e] px-1.5 py-0.5 rounded-full text-[9px] font-black">{pending}</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* ── CONTENT: SPLIT PANE ── */}
            <div className="flex flex-1 overflow-hidden">

                {/* LEFT: Request list */}
                <div className="w-[380px] shrink-0 border-r border-[#102c1e]/8 bg-white flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden divide-y divide-[#102c1e]/5">
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                                <Inbox className="w-10 h-10 text-[#102c1e]/20 mb-3" />
                                <p className="font-sans font-bold text-sm text-slate-400">Không có yêu cầu nào</p>
                            </div>
                        ) : (
                            filtered.map(req => {
                                const isSelected = selected.id === req.id;
                                const statusCfg = STATUS_CFG[req.status];
                                return (
                                    <button
                                        key={req.id}
                                        onClick={() => setSelected(req)}
                                        className={cn(
                                            'w-full text-left px-5 py-4 transition-all relative group/card',
                                            isSelected
                                                ? 'bg-[#102c1e]/[0.03]'
                                                : 'hover:bg-slate-50/50'
                                        )}
                                    >
                                        {/* Active left-border indicator */}
                                        {isSelected && (
                                            <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#102c1e] rounded-r-full" />
                                        )}

                                        {/* ── ROW 1: Name + Vertical badge + Match Score ── */}
                                        <div className="flex items-start justify-between gap-2 mb-1.5">
                                            <div className="flex items-center gap-2 min-w-0">
                                                {req.status === 'pending' && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#102c1e] shrink-0 mt-[3px]" />
                                                )}
                                                <span className="font-heading font-black text-[#102c1e] text-base leading-tight truncate">
                                                    {req.startup}
                                                </span>
                                                <span className="font-sans text-[9px] font-bold bg-slate-100 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded-md shrink-0 uppercase tracking-wide">
                                                    {req.vertical}
                                                </span>
                                            </div>
                                            <ScoreRing score={req.matchScore} size={36} />
                                        </div>

                                        {/* ── ROW 2: The Hook — Ask • Equity • Time ── */}
                                        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                                            <span className="font-sans text-xs font-bold text-[#102c1e]">{req.ask}</span>
                                            <span className="text-slate-300 select-none">·</span>
                                            <span className="font-sans text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md">
                                                {req.equityOffer} Equity
                                            </span>
                                            <span className="text-slate-300 select-none">·</span>
                                            <span className="font-sans text-xs text-slate-500 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {req.timeCommitment}
                                            </span>
                                        </div>

                                        {/* ── ROW 3: Pitch Abstract Snippet (2-line clamp) ── */}
                                        <p className="font-sans text-xs text-slate-500 leading-relaxed line-clamp-2 mb-2.5">
                                            {req.pitchAbstract}
                                        </p>

                                        {/* ── ROW 4: Footer — Founder + Time + Status dot ── */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <div className="w-5 h-5 rounded-full bg-[#102c1e] flex items-center justify-center shrink-0">
                                                    <span className="font-sans text-[8px] font-black text-[#a1e2b6]">
                                                        {req.founder.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                                    </span>
                                                </div>
                                                <span className="font-sans text-xs text-slate-500 truncate">{req.founder}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                <span className={cn(
                                                    'inline-flex items-center gap-1 font-sans text-[9px] font-bold px-1.5 py-0.5 rounded-md border',
                                                    statusCfg.badge
                                                )}>
                                                    <span className={cn('w-1 h-1 rounded-full', statusCfg.dot)} />
                                                    {statusCfg.label}
                                                </span>
                                                <span className="font-sans text-[10px] text-slate-400">{req.relativeTime}</span>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* RIGHT: Detail panel */}
                <div className="flex-1 flex flex-col overflow-hidden bg-[#fafafa]">
                    {selected ? (
                        <>
                            {/* Detail header */}
                            <div className="shrink-0 bg-white border-b border-[#102c1e]/8 px-8 py-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        {/* Logo avatar */}
                                        <div className="w-14 h-14 rounded-2xl bg-[#102c1e] flex items-center justify-center font-heading font-black text-2xl text-white shadow-lg">
                                            {selected.startup.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                                                <h2 className="font-heading font-black text-[#102c1e] text-2xl tracking-tight">{selected.startup}</h2>
                                                <span className="font-sans text-[10px] font-bold bg-[#102c1e]/5 border border-[#102c1e]/10 px-2.5 py-1 rounded-full text-[#102c1e]">
                                                    {selected.vertical}
                                                </span>
                                                <span className={cn(
                                                    'font-sans text-[9px] font-bold px-2 py-0.5 rounded-md border',
                                                    STATUS_CFG[selected.status].badge
                                                )}>
                                                    <span className={cn('inline-block w-1.5 h-1.5 rounded-full mr-1', STATUS_CFG[selected.status].dot)} />
                                                    {STATUS_CFG[selected.status].label}
                                                </span>
                                            </div>
                                            <p className="font-sans text-sm text-slate-500">
                                                Bởi <strong className="text-[#102c1e]">{selected.founder}</strong>
                                                <span className="text-slate-300 mx-2">·</span>
                                                {selected.founderTitle}
                                                <span className="text-slate-300 mx-2">·</span>
                                                {selected.date}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions — only for pending */}
                                    {selected.status === 'pending' && !showCounter && (
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                onClick={() => setShowCounter(true)}
                                                className="font-sans text-sm font-bold text-[#102c1e] border border-[#102c1e]/15 px-4 py-2.5 rounded-xl hover:border-[#102c1e]/30 hover:bg-[#102c1e]/5 transition-all flex items-center gap-2"
                                            >
                                                <MessageSquare className="w-4 h-4" /> Counter Offer
                                            </button>
                                            <button
                                                onClick={() => handleAction(selected.id, 'declined')}
                                                className="font-sans text-sm font-bold text-slate-400 border border-slate-200 px-4 py-2.5 rounded-xl hover:bg-slate-50 hover:text-slate-600 transition-all flex items-center gap-2"
                                            >
                                                <X className="w-4 h-4" /> Từ chối
                                            </button>
                                            <button
                                                onClick={() => handleAction(selected.id, 'accepted')}
                                                className="font-sans text-sm font-black text-white bg-[#102c1e] px-5 py-2.5 rounded-xl hover:bg-[#0a1c13] transition-all shadow-md flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
                                            >
                                                <CheckCircle2 className="w-4 h-4 text-[#a1e2b6]" /> Chấp nhận & Ký FAST
                                            </button>
                                        </div>
                                    )}

                                    {selected.status !== 'pending' && (
                                        <div className={cn(
                                            'flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-sans font-bold',
                                            STATUS_CFG[selected.status].badge
                                        )}>
                                            {selected.status === 'accepted' ? <CheckCircle2 className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                            {STATUS_CFG[selected.status].label}
                                        </div>
                                    )}
                                </div>

                                {/* Counter form */}
                                {showCounter && selected.status === 'pending' && (
                                    <div className="mt-5 bg-[#fafafa] border border-[#102c1e]/10 rounded-2xl p-5">
                                        <p className="font-sans font-black text-sm text-[#102c1e] mb-3">💬 Gửi Counter Offer</p>
                                        <textarea
                                            value={counterNote}
                                            onChange={e => setCounterNote(e.target.value)}
                                            placeholder="VD: Tôi đồng ý tham gia với điều kiện equity giảm xuống 0.3% và cam kết 2h/tháng thay vì 4h..."
                                            rows={3}
                                            className="w-full text-sm font-sans text-[#102c1e] bg-white border border-[#102c1e]/10 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-[#102c1e]/30 placeholder:text-slate-300"
                                        />
                                        <div className="flex items-center justify-end gap-2 mt-3">
                                            <button onClick={() => setShowCounter(false)} className="font-sans text-xs font-bold text-slate-400 hover:text-[#102c1e] transition-colors">Hủy</button>
                                            <button
                                                onClick={() => { handleAction(selected.id, 'countered'); setShowCounter(false); }}
                                                className="flex items-center gap-2 bg-[#102c1e] text-white font-sans text-xs font-black px-4 py-2 rounded-xl hover:bg-[#0a1c13] transition-colors"
                                            >
                                                <Send className="w-3.5 h-3.5" /> Gửi Counter
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Detail body */}
                            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden px-8 py-6 space-y-6">

                                {/* AI Analysis banner — prominent */}
                                <div className="relative bg-[#102c1e] rounded-3xl p-6 overflow-hidden">
                                    <div className="absolute inset-0 opacity-10 pointer-events-none"
                                        style={{ backgroundImage: 'radial-gradient(ellipse at 90% -20%, #a1e2b6 0%, transparent 60%)' }} />
                                    <div className="relative flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-[#a1e2b6]/20 border border-[#a1e2b6]/30 flex items-center justify-center shrink-0">
                                            <Sparkles className="w-5 h-5 text-[#a1e2b6]" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <p className="font-sans font-black text-white text-sm">AI Match Analysis</p>
                                                <div className="bg-[#a1e2b6]/15 border border-[#a1e2b6]/25 px-2 py-0.5 rounded-full">
                                                    <span className="font-mono text-[10px] font-black text-[#a1e2b6]">{selected.matchScore}% phù hợp</span>
                                                </div>
                                            </div>
                                            <p className="font-sans text-sm text-white/75 leading-relaxed">{selected.aiSummary}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* ── OFFER TERMS + TRACTION (2-col grid) ── */}
                                <div className="grid grid-cols-2 gap-4">

                                    {/* OFFER TERMS */}
                                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-[#102c1e]/40" />
                                            <p className="font-sans text-xs font-black text-[#102c1e] uppercase tracking-widest">Điều khoản đề xuất</p>
                                        </div>

                                        {/* Equity hero */}
                                        <div className="px-5 pt-5 pb-4 border-b border-dashed border-slate-200">
                                            <p className="font-sans text-[10px] text-slate-400 uppercase tracking-widest mb-1">Đề xuất Equity (FAST)</p>
                                            <div className="flex items-end gap-2">
                                                <span className="font-mono text-4xl font-black text-[#102c1e]">{selected.equityOffer}</span>
                                                <span className="font-sans text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-lg mb-1">
                                                    {selected.vestingSchedule}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="px-5 py-4 space-y-2">
                                            {[
                                                { label: 'Yêu cầu hỗ trợ', value: selected.ask },
                                                { label: 'Cam kết thời gian', value: selected.timeCommitment },
                                            ].map((item) => (
                                                <div key={item.label} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors">
                                                    <span className="font-sans text-sm text-slate-500">{item.label}</span>
                                                    <span className="font-mono text-sm font-bold text-[#102c1e]">{item.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* TRACTION */}
                                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-[#102c1e]/40" />
                                            <p className="font-sans text-xs font-black text-[#102c1e] uppercase tracking-widest">Traction Hiện tại</p>
                                        </div>

                                        {/* Mini sparkline bar chart */}
                                        <div className="px-5 pt-4 pb-3">
                                            <p className="font-sans text-[10px] text-slate-400 uppercase tracking-wide mb-2">Revenue trend (6 mo)</p>
                                            <div className="flex items-end gap-1 h-10">
                                                {selected.sparkline.map((h, i) => (
                                                    <div key={i} className="flex-1 rounded-sm transition-all"
                                                        style={{
                                                            height: `${Math.max(4, h)}%`,
                                                            backgroundColor: i === selected.sparkline.length - 1
                                                                ? '#102c1e'
                                                                : `rgba(16,44,30,${0.15 + i * 0.1})`,
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Metric bento tiles */}
                                        <div className="grid grid-cols-2 gap-2 px-5 pb-5">
                                            {selected.metrics.map((m) => (
                                                <div key={m.label} className={cn(
                                                    'rounded-2xl border px-3 py-3',
                                                    m.highlight
                                                        ? 'bg-[#102c1e]/5 border-[#102c1e]/15'
                                                        : 'bg-slate-50 border-slate-200'
                                                )}>
                                                    <p className="font-sans text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">{m.label}</p>
                                                    <div className="flex items-end gap-1.5">
                                                        <span className="font-mono text-base font-black text-[#102c1e]">{m.value}</span>
                                                        {m.trend && (
                                                            <span className="font-sans text-[10px] font-bold text-emerald-600 mb-0.5">{m.trend}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* ── PITCH CARD: Problem / Situation / Solution ── */}
                                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-[#102c1e]/50" />
                                        <h3 className="font-heading font-black text-[#102c1e] text-lg">Giới thiệu dự án</h3>
                                        <div className="ml-auto flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                            <span className="font-sans text-xs text-slate-400">{selected.location}</span>
                                            <span className="mx-1 text-slate-200">·</span>
                                            <span className="font-sans text-xs font-bold bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md">{selected.stage}</span>
                                        </div>
                                    </div>

                                    {/* 3 sections with coloured left-border */}
                                    <div className="divide-y divide-slate-100">
                                        {/* Problem */}
                                        <div className="flex gap-4 px-6 py-5">
                                            <div className="w-1 rounded-full bg-red-400 shrink-0 self-stretch" />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-6 h-6 rounded-lg bg-red-50 flex items-center justify-center">
                                                        <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                                                    </div>
                                                    <span className="font-sans text-xs font-black text-red-600 uppercase tracking-widest">Vấn đề</span>
                                                </div>
                                                <p className="font-sans text-sm text-slate-700 leading-relaxed">{selected.problem}</p>
                                            </div>
                                        </div>

                                        {/* Situation */}
                                        <div className="flex gap-4 px-6 py-5">
                                            <div className="w-1 rounded-full bg-amber-400 shrink-0 self-stretch" />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center">
                                                        <BarChart3 className="w-3.5 h-3.5 text-amber-500" />
                                                    </div>
                                                    <span className="font-sans text-xs font-black text-amber-600 uppercase tracking-widest">Thực trạng</span>
                                                </div>
                                                <p className="font-sans text-sm text-slate-700 leading-relaxed">{selected.situation}</p>
                                            </div>
                                        </div>

                                        {/* Solution */}
                                        <div className="flex gap-4 px-6 py-5">
                                            <div className="w-1 rounded-full bg-emerald-400 shrink-0 self-stretch" />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                                                        <Lightbulb className="w-3.5 h-3.5 text-emerald-600" />
                                                    </div>
                                                    <span className="font-sans text-xs font-black text-emerald-700 uppercase tracking-widest">Giải pháp</span>
                                                </div>
                                                <p className="font-sans text-sm text-slate-700 leading-relaxed">{selected.solution}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tags footer */}
                                    <div className="flex flex-wrap gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                                        {selected.tags.map(tag => (
                                            <span key={tag} className="font-sans text-[10px] font-bold bg-white border border-slate-200 text-slate-500 px-2.5 py-1 rounded-lg">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* ── FOUNDER CONTACT CARD ── */}
                                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-[#102c1e]/50" />
                                        <h3 className="font-heading font-black text-[#102c1e] text-lg">Thông tin Founder</h3>
                                    </div>
                                    <div className="px-6 py-5">
                                        {/* Avatar + Name row */}
                                        <div className="flex items-center gap-4 mb-5">
                                            <div className="w-14 h-14 rounded-2xl bg-[#102c1e] flex items-center justify-center font-heading font-black text-xl text-[#a1e2b6] shrink-0">
                                                {selected.founder.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                            </div>
                                            <div>
                                                <p className="font-heading font-black text-[#102c1e] text-lg leading-tight">{selected.founder}</p>
                                                <p className="font-sans text-sm text-slate-500 mt-0.5">{selected.founderTitle}</p>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <span className="font-sans text-[10px] font-bold bg-[#102c1e]/5 border border-[#102c1e]/10 text-[#102c1e]/60 px-2 py-0.5 rounded-md">
                                                        {selected.founderCompany}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact grid */}
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { icon: Mail, label: 'Email', value: selected.founderEmail, href: `mailto:${selected.founderEmail}` },
                                                { icon: Phone, label: 'Điện thoại', value: selected.founderPhone, href: `tel:${selected.founderPhone}` },
                                                { icon: GraduationCap, label: 'Học vấn', value: selected.founderSchool, href: undefined },
                                                { icon: Building2, label: 'Kinh nghiệm', value: selected.founderCompany, href: undefined },
                                            ].map(({ icon: Icon, label, value, href }) => (
                                                <div key={label} className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 group hover:border-[#102c1e]/20 transition-colors">
                                                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                                                        <Icon className="w-3.5 h-3.5 text-slate-500" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
                                                        {href ? (
                                                            <a href={href} className="font-sans text-sm font-semibold text-[#102c1e] truncate block hover:underline mt-0.5">
                                                                {value}
                                                            </a>
                                                        ) : (
                                                            <p className="font-sans text-sm font-semibold text-[#102c1e] truncate mt-0.5">{value}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Data Room access */}
                                {selected.hasDataRoom && (
                                    <div className="bg-white rounded-3xl border border-[#102c1e]/8 shadow-sm p-5 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-[#102c1e]/5 border border-[#102c1e]/8 flex items-center justify-center shrink-0">
                                            <Shield className="w-5 h-5 text-[#102c1e]/40" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-sans font-black text-sm text-[#102c1e]">Data Room đính kèm</p>
                                            <p className="font-sans text-xs text-slate-500 mt-0.5">
                                                Pitch deck, Financial model và Cap Table — chỉ mở khi chấp nhận.
                                            </p>
                                        </div>
                                        <button className="flex items-center gap-2 bg-[#102c1e] text-white font-sans font-black text-xs px-4 py-2 rounded-xl hover:bg-[#0a1c13] transition-colors">
                                            <ExternalLink className="w-3.5 h-3.5" /> Xem Data Room
                                        </button>
                                    </div>
                                )}

                                {/* Suggest schedule if accepted */}
                                {selected.status === 'accepted' && (
                                    <div className="bg-[#a1e2b6]/10 border border-[#a1e2b6]/30 rounded-3xl p-5 flex items-center gap-4">
                                        <CalendarDays className="w-8 h-8 text-[#102c1e] shrink-0" />
                                        <div className="flex-1">
                                            <p className="font-sans font-black text-sm text-[#102c1e]">Đặt lịch buổi kick-off</p>
                                            <p className="font-sans text-xs text-slate-600 mt-0.5">Hợp đồng FAST đã được khởi tạo. Đặt lịch buổi đầu tiên với {selected.founder}.</p>
                                        </div>
                                        <button className="flex items-center gap-2 bg-[#102c1e] text-white font-sans font-black text-xs px-4 py-2 rounded-xl hover:bg-[#0a1c13] transition-all shadow-sm whitespace-nowrap">
                                            Đặt lịch <ArrowRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <Inbox className="w-12 h-12 text-[#102c1e]/15 mx-auto mb-3" />
                                <p className="font-sans font-bold text-slate-400">Chọn một yêu cầu để xem chi tiết</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}