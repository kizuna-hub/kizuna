'use client';

interface PitchVideoProps {
    slug: string;
}

export function PitchVideo({ slug }: PitchVideoProps) {
    return (
        <div className="space-y-4 border-b border-kizuna-border pb-12">
            <h2 className="text-2xl font-semibold text-kizuna-text-main">Pitch Video</h2>
            <div className="aspect-video bg-zinc-100 rounded-2xl border border-zinc-200 flex items-center justify-center overflow-hidden relative">
                <button className="relative z-10 w-16 h-16 bg-white text-kizuna-primary rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
