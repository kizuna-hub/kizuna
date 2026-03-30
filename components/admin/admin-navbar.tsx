'use client';

import { Download } from 'lucide-react';

export function AdminNavbar() {
    const handleExport = () => {
        // Mock export functionality
        console.log('Exporting data...');
    };

    return (
        <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-bold text-foreground">
                    Faculty Innovation Program
                </h2>
                <p className="text-sm mt-1 text-muted-foreground">
                    Manage submissions and track progress
                </p>
            </div>

            <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all shadow-sm hover:opacity-90 bg-primary text-primary-foreground"
            >
                <Download size={18} />
                Export
            </button>
        </header>
    );
}
