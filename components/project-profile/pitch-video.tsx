'use client';

interface PitchVideoProps {
    slug: string;
}

export function PitchVideo({ slug }: PitchVideoProps) {
    return (
        <div className="space-y-4 border-b border-zinc-800 pb-12">
            <h2 className="text-2xl font-bold text-zinc-50">Pitch Video</h2>
            <div className="aspect-video bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-xl border border-zinc-800 flex items-center justify-center overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <button className="relative z-10 w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors shadow-lg shadow-orange-600/50">
                    <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
