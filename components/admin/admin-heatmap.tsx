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
    if (activity >= 90) return 'bg-primary';
    if (activity >= 70) return 'bg-primary/80';
    if (activity >= 50) return 'bg-primary/60';
    return 'bg-muted-foreground';
}

export function AdminHeatmap() {
    return (
        <div className="rounded-lg p-6 border bg-card border-border">
            <h3 className="text-lg font-semibold mb-6 text-card-foreground">
                Faculty Innovation Activity
            </h3>

            <div className="space-y-4">
                {facultyData.map((item) => (
                    <div key={item.faculty} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground">
                                {item.faculty}
                            </span>
                            <span className="text-xs font-bold text-primary">
                                {item.activity}%
                            </span>
                        </div>
                        <div className="w-full h-8 rounded-lg overflow-hidden bg-muted">
                            <div
                                className={`h-full transition-all duration-500 ${getColorIntensity(item.activity)}`}
                                style={{ width: `${item.activity}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground">
                    Activity levels based on submissions, engagement, and mentor participation
                </p>
            </div>
        </div>
    );
}
