export interface DocumentSpace {
    id: string;
    name: string;
    type: 'deck' | 'financial' | 'tech_spec';
    updatedAt: string;
}

export interface ActivityLog {
    id: string;
    timestamp: string;
    investor: string;
    event: string;
    isLive: boolean;
}

export interface SecureLink {
    id: string;
    recipient: string;
    fund: string;
    initial: string;
    views: number;
    completion: string;
    requiresEmail: boolean;
    expiresAt: string;
    isActive: boolean;
}