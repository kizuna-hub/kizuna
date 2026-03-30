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
    const colorClasses = {
        approved: 'text-primary',
        pending: 'text-muted-foreground',
        rejected: 'text-destructive',
    };
    const Icon = icons[status];

    return (
        <div className={`flex items-center gap-1 ${colorClasses[status]}`}>
            <Icon size={16} />
            <span className="text-xs font-medium capitalize">
                {status}
            </span>
        </div>
    );
}

function ComplianceBadge({ compliance }: { compliance: Submission['compliance'] }) {
    const colorClasses = {
        compliant: 'bg-green-500/15 text-green-500 dark:text-green-400',
        warning: 'bg-primary/15 text-primary',
        violation: 'bg-destructive/15 text-destructive dark:bg-destructive/20 dark:text-destructive-foreground',
    };

    return (
        <span
            className={`px-2 py-1 rounded text-xs font-medium capitalize ${colorClasses[compliance]}`}
        >
            {compliance}
        </span>
    );
}

export function AdminSubmissionsTable() {
    return (
        <div className="rounded-lg border overflow-hidden bg-card border-border">
            <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-card-foreground">
                    Recent Submissions
                </h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Faculty
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Mentor
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Compliance
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Date
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.map((submission, index) => (
                            <tr
                                key={submission.id}
                                className={`border-b border-border transition-colors hover:bg-muted/50 ${index % 2 === 0 ? 'bg-primary/5' : 'bg-transparent'
                                    }`}
                            >
                                <td className="px-6 py-4 text-sm text-foreground">
                                    {submission.title}
                                </td>
                                <td className="px-6 py-4 text-sm text-muted-foreground">
                                    {submission.faculty}
                                </td>
                                <td className="px-6 py-4 text-sm text-muted-foreground">
                                    {submission.mentor}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <StatusBadge status={submission.status} />
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <ComplianceBadge compliance={submission.compliance} />
                                </td>
                                <td className="px-6 py-4 text-sm text-muted-foreground">
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
