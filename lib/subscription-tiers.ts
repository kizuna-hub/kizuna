/**
 * Kizuna Hub — Subscription Tiers Definition
 * Single source of truth cho toàn bộ feature gating
 */

export type UserRole = 'founder' | 'mentor' | 'investor';

// ──────────────────────────────────────────────────────────────
// FOUNDER TIERS
// ──────────────────────────────────────────────────────────────
export type FounderTier = 'starter' | 'pro' | 'scale';

export const FOUNDER_TIERS = {
    starter: {
        id: 'starter',
        name: 'Starter',
        price: 0,
        currency: 'USD',
        period: 'month',
        description: 'Miễn phí mãi mãi. Bắt đầu hành trình khởi nghiệp.',
        badge: null,
        features: {
            // Pitch Deck
            pitchDeckSections: 3,
            aiPolishPerMonth: 3,
            // Data Room
            dataRoomDocuments: 5,
            magicLinks: 1,
            dataRoomAnalytics: false,
            // Cap Table
            capTableShareholders: 5,
            // Metrics
            survivalClock: true,
            metricsExport: false,
            // Connections
            mentorRequests: 1,
            investorVisibility: false,
            // Stakeholder Studio
            stakeholderUpdates: false,
        },
    },
    pro: {
        id: 'pro',
        name: 'Pro',
        price: 29,
        currency: 'USD',
        period: 'month',
        description: 'Đầy đủ công cụ để chuẩn bị gọi vốn nghiêm túc.',
        badge: 'Most Popular',
        features: {
            pitchDeckSections: 12,
            aiPolishPerMonth: 50,
            dataRoomDocuments: 50,
            magicLinks: 10,
            dataRoomAnalytics: true,
            capTableShareholders: 20,
            survivalClock: true,
            metricsExport: true,
            mentorRequests: 5,
            investorVisibility: true,
            stakeholderUpdates: true,
        },
    },
    scale: {
        id: 'scale',
        name: 'Scale',
        price: 99,
        currency: 'USD',
        period: 'month',
        description: 'Không giới hạn. Dành cho startup đã có traction.',
        badge: 'Power User',
        features: {
            pitchDeckSections: -1, // unlimited
            aiPolishPerMonth: -1,
            dataRoomDocuments: -1,
            magicLinks: -1,
            dataRoomAnalytics: true,
            capTableShareholders: -1,
            survivalClock: true,
            metricsExport: true,
            mentorRequests: -1,
            investorVisibility: true,
            stakeholderUpdates: true,
        },
    },
} as const;

// ──────────────────────────────────────────────────────────────
// MENTOR TIERS (Free model — giữ chân bằng reputation)
// ──────────────────────────────────────────────────────────────
export type MentorTier = 'mentor_free' | 'mentor_pro';

export const MENTOR_TIERS = {
    mentor_free: {
        id: 'mentor_free',
        name: 'Mentor Free',
        price: 0,
        description: 'Truy cập đầy đủ. Tạo uy tín, tích lũy deal credit.',
        features: {
            menteeSlots: 5,
            fastContracts: 3,
            warmIntrosPerMonth: 5,
            intelligenceView: true,
            asyncAnnotations: true,
            reputationScore: true,
            dealCredit: true,       // Track warm intro conversions
            vcNetworkBadge: false,  // Unlock at score threshold
            earlyAccessDeals: false,
        },
    },
    mentor_pro: {
        id: 'mentor_pro',
        name: 'Mentor Pro',
        price: 0, // Still free, unlocked by reputation score
        description: 'Mở khoá khi Reputation Score đạt 80+.',
        features: {
            menteeSlots: -1,
            fastContracts: -1,
            warmIntrosPerMonth: -1,
            intelligenceView: true,
            asyncAnnotations: true,
            reputationScore: true,
            dealCredit: true,
            vcNetworkBadge: true,
            earlyAccessDeals: true,
        },
    },
} as const;

// ──────────────────────────────────────────────────────────────
// INVESTOR TIERS
// ──────────────────────────────────────────────────────────────
export type InvestorTier = 'angel' | 'vc_enterprise';

export const INVESTOR_TIERS = {
    angel: {
        id: 'angel',
        name: 'Angel',
        price: 79,
        currency: 'USD',
        period: 'month',
        description: 'Dành cho Angel Investor cá nhân.',
        badge: null,
        features: {
            dealFlowCRM: true,
            aiMatchDeals: 20,        // deals per month
            warmIntroAccess: true,
            dueDiligenceTerminal: true,
            dataRoomUnlock: 5,       // per month
            proRataSimulator: false,
            portfolioTracking: 5,    // portfolio slots
            teamCollaboration: false,
            exportReports: false,
        },
    },
    vc_enterprise: {
        id: 'vc_enterprise',
        name: 'VC Enterprise',
        price: 199,
        currency: 'USD',
        period: 'month',
        description: 'Dành cho Quỹ đầu tư chuyên nghiệp. Full stack.',
        badge: 'Enterprise',
        features: {
            dealFlowCRM: true,
            aiMatchDeals: -1,
            warmIntroAccess: true,
            dueDiligenceTerminal: true,
            dataRoomUnlock: -1,
            proRataSimulator: true,
            portfolioTracking: -1,
            teamCollaboration: true,
            exportReports: true,
        },
    },
} as const;

// ──────────────────────────────────────────────────────────────
// FEATURE GATE HELPERS
// ──────────────────────────────────────────────────────────────

export type AnyTier = FounderTier | MentorTier | InvestorTier;

/**
 * Check if a numeric feature limit allows the action.
 * -1 = unlimited, 0 = blocked, N = limited to N
 */
export function isFeatureAllowed(limit: number | boolean, currentUsage?: number): boolean {
    if (typeof limit === 'boolean') return limit;
    if (limit === -1) return true;  // unlimited
    if (limit === 0) return false;  // blocked
    if (currentUsage === undefined) return true;
    return currentUsage < limit;
}

/**
 * Get display text for a limit value
 */
export function formatLimit(limit: number | boolean): string {
    if (typeof limit === 'boolean') return limit ? '✓' : '✗';
    if (limit === -1) return 'Unlimited';
    if (limit === 0) return 'Not included';
    return `${limit}`;
}

// ──────────────────────────────────────────────────────────────
// UPGRADE PROMPTS — map feature → suggested tier
// ──────────────────────────────────────────────────────────────
export const UPGRADE_PROMPTS: Record<string, {
    title: string;
    description: string;
    targetTier: string;
    role: UserRole;
}> = {
    'investor-visibility': {
        title: 'Xuất hiện trước mắt Investor',
        description: 'Nâng cấp lên Pro để được hiển thị trên Deal Flow CRM của VC/Angel.',
        targetTier: 'pro',
        role: 'founder',
    },
    'data-room-analytics': {
        title: 'Theo dõi hành vi đọc tài liệu',
        description: 'Biết chính xác VC đang đọc slide nào và bao lâu.',
        targetTier: 'pro',
        role: 'founder',
    },
    'pro-rata-simulator': {
        title: 'Pro-Rata Simulator',
        description: 'Giả lập pha loãng cổ phần trước khi ra Term Sheet.',
        targetTier: 'vc_enterprise',
        role: 'investor',
    },
    'team-collaboration': {
        title: 'Cộng tác Team DD',
        description: 'Cho phép Associate/Partner cùng thẩm định một deal.',
        targetTier: 'vc_enterprise',
        role: 'investor',
    },
    'vc-network-badge': {
        title: 'VC Network Badge',
        description: 'Đạt Reputation Score 80+ để nhận VC Network Badge và Early Access Deal.',
        targetTier: 'mentor_pro',
        role: 'mentor',
    },
};
