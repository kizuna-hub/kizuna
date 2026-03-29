'use client';

import { CheckCircle2, Clock, XCircle } from 'lucide-react';

interface Submission {
    id: string;
    title: string;
    faculty: string;
    mentor: string;
    status: 'approved' | 'pending' | 'rejected';
    compliance: 'compliant' | 'warning' | 'violation';
    date: string;
}

const submissions: Submission[] = [
    {
        id: '001',
        title: 'AI-Powered Clinical Diagnosis',
        faculty: 'Health Sciences',
        mentor: 'Dr. Sarah Chen',
        status: 'approved',
        compliance: 'compliant',
        date: '2024-03-15',
    },
    {
        id: '002',
        title: 'Sustainable Energy Solutions',
        faculty: 'Engineering',
        mentor: 'Prof. James Wilson',
        status: 'approved',
        compliance: 'compliant',
        date: '2024-03-12',
    },
    {
        id: '003',
        title: 'Blockchain in Supply Chain',
        faculty: 'Business',
        mentor: 'Dr. Michael Park',
        status: 'pending',
        compliance: 'warning',
        date: '2024-03-10',
    },
    {
        id: '004',
        title: 'Digital Humanities Platform',
        faculty: 'Arts & Sciences',
        mentor: 'Prof. Emma Rodriguez',
        status: 'pending',
        compliance: 'compliant',
        date: '2024-03-08',
    },
    {
        id: '005',
        title: 'IoT Smart Buildings',
        faculty: 'Engineering',
        mentor: 'Dr. Alex Kumar',
        status: 'approved',
        compliance: 'compliant',
        date: '2024-03-05',
    },
    {
        id: '006',
        title: 'Financial Tech Innovation',
        faculty: 'Business',
        mentor: 'Dr. Lisa Zhang',
        status: 'rejected',
        compliance: 'violation',
        date: '2024-03-01',
    },
];

function StatusBadge({ status }: { status: Submission['status'] }) {
    const icons = {
        approved: CheckCircle2,
        pending: Clock,
        rejected: XCircle,
    };
    const colors = {
        approved: 'var(--admin-orange)',
        pending: '#71717a',
        rejected: '#ef4444',
    };
    const Icon = icons[status];

    return (
        <div className="flex items-center gap-1">
            <Icon size={16} style={{ color: colors[status] }} />
            <span
                className="text-xs font-medium capitalize"
                style={{ color: colors[status] }}
            >
                {status}
            </span>
        </div>
    );
}

function ComplianceBadge({ compliance }: { compliance: Submission['compliance'] }) {
    const bgColors = {
        compliant: 'rgba(34, 197, 94, 0.15)',
        warning: 'rgba(251, 146, 60, 0.15)',
        violation: 'rgba(239, 68, 68, 0.15)',
    };
    const textColors = {
        compliant: '#22c55e',
        warning: 'var(--admin-orange)',
        violation: '#ef4444',
    };

    return (
        <span
            className="px-2 py-1 rounded text-xs font-medium capitalize"
            style={{
                backgroundColor: bgColors[compliance],
                color: textColors[compliance],
            }}
        >
            {compliance}
        </span>
    );
}

export function AdminSubmissionsTable() {
    return (
        <div
            className="rounded-lg border overflow-hidden"
            style={{
                backgroundColor: 'var(--admin-card)',
                borderColor: 'var(--admin-border)',
            }}
        >
            <div className="p-6 border-b" style={{ borderColor: 'var(--admin-border)' }}>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--admin-text)' }}>
                    Recent Submissions
                </h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr
                            className="border-b"
                            style={{ borderColor: 'var(--admin-border)' }}
                        >
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#a1a1a6' }}>
                                Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#a1a1a6' }}>
                                Faculty
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#a1a1a6' }}>
                                Mentor
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#a1a1a6' }}>
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#a1a1a6' }}>
                                Compliance
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#a1a1a6' }}>
                                Date
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.map((submission, index) => (
                            <tr
                                key={submission.id}
                                className="border-b hover:bg-opacity-50 transition-colors"
                                style={{
                                    borderColor: 'var(--admin-border)',
                                    backgroundColor: index % 2 === 0 ? 'rgba(255, 107, 53, 0.02)' : 'transparent',
                                }}
                            >
                                <td className="px-6 py-4 text-sm" style={{ color: 'var(--admin-text)' }}>
                                    {submission.title}
                                </td>
                                <td className="px-6 py-4 text-sm" style={{ color: '#a1a1a6' }}>
                                    {submission.faculty}
                                </td>
                                <td className="px-6 py-4 text-sm" style={{ color: '#a1a1a6' }}>
                                    {submission.mentor}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <StatusBadge status={submission.status} />
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <ComplianceBadge compliance={submission.compliance} />
                                </td>
                                <td className="px-6 py-4 text-sm" style={{ color: '#a1a1a6' }}>
                                    {new Date(submission.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
