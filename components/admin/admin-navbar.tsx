'use client';

import { Download } from 'lucide-react';

export function AdminNavbar() {
    const handleExport = () => {
        // Mock export functionality
        console.log('Exporting data...');
    };

    return (
        <header
            className="border-b px-6 py-4 flex items-center justify-between"
            style={{
                backgroundColor: 'var(--admin-bg)',
                borderColor: 'var(--admin-border)',
            }}
        >
            <div>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--admin-text)' }}>
                    Faculty Innovation Program
                </h2>
                <p className="text-sm mt-1" style={{ color: '#a1a1a6' }}>
                    Manage submissions and track progress
                </p>
            </div>

            <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg"
                style={{
                    backgroundColor: 'var(--admin-orange)',
                    color: '#000',
                    boxShadow: '0 0 20px rgba(255, 107, 53, 0.3)',
                }}
            >
                <Download size={18} />
                Export
            </button>
        </header>
    );
}
