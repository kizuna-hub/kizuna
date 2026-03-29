'use client';

interface HeatmapCell {
    faculty: string;
    activity: number; // 0-100
}

const facultyData: HeatmapCell[] = [
    { faculty: 'Engineering', activity: 95 },
    { faculty: 'Business', activity: 78 },
    { faculty: 'Health Sciences', activity: 82 },
    { faculty: 'Arts & Sciences', activity: 65 },
];

function getColorIntensity(activity: number): string {
    if (activity >= 90) return 'var(--admin-orange)';
    if (activity >= 70) return '#ff8555';
    if (activity >= 50) return '#ff9d75';
    return '#3f3f46';
}

export function AdminHeatmap() {
    return (
        <div
            className="rounded-lg p-6 border"
            style={{
                backgroundColor: 'var(--admin-card)',
                borderColor: 'var(--admin-border)',
            }}
        >
            <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--admin-text)' }}>
                Faculty Innovation Activity
            </h3>

            <div className="space-y-4">
                {facultyData.map((item) => (
                    <div key={item.faculty} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium" style={{ color: 'var(--admin-text)' }}>
                                {item.faculty}
                            </span>
                            <span className="text-xs font-bold" style={{ color: 'var(--admin-orange)' }}>
                                {item.activity}%
                            </span>
                        </div>
                        <div
                            className="w-full h-8 rounded-lg overflow-hidden"
                            style={{ backgroundColor: '#27272a' }}
                        >
                            <div
                                className="h-full transition-all duration-500"
                                style={{
                                    width: `${item.activity}%`,
                                    backgroundColor: getColorIntensity(item.activity),
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--admin-border)' }}>
                <p className="text-xs" style={{ color: '#a1a1a6' }}>
                    Activity levels based on submissions, engagement, and mentor participation
                </p>
            </div>
        </div>
    );
}
