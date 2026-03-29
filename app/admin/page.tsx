import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminNavbar } from '@/components/admin/admin-navbar';
import { AdminKPICards } from '@/components/admin/admin-kpi-cards';
import { AdminHeatmap } from '@/components/admin/admin-heatmap';
import { AdminSubmissionsTable } from '@/components/admin/admin-submissions-table';

export const metadata = {
    title: 'Admin Dashboard | Faculty Innovation Program',
    description: 'Manage submissions and track faculty innovation program progress',
};

export default function AdminPage() {
    return (
        <div className="flex h-screen" style={{ backgroundColor: 'var(--admin-bg)' }}>
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar */}
                <AdminNavbar />

                {/* Content Area */}
                <main className="flex-1 overflow-auto">
                    <div className="p-6 space-y-6">
                        {/* KPI Cards */}
                        <AdminKPICards />

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Heatmap - Takes 1 column */}
                            <div className="lg:col-span-1">
                                <AdminHeatmap />
                            </div>

                            {/* Submissions Table - Takes 2 columns */}
                            <div className="lg:col-span-2">
                                <AdminSubmissionsTable />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
