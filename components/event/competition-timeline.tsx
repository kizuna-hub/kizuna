export function CompetitionTimeline() {
    const steps = [
        {
            number: 1,
            title: 'Registration',
            description: 'Sign up and submit your initial idea',
            status: 'current',
        },
        {
            number: 2,
            title: 'AI Incubation Phase',
            description: 'Work with mentors and refine your pitch',
            status: 'upcoming',
        },
        {
            number: 3,
            title: 'Semi-Finals',
            description: 'Present to investor panel',
            status: 'upcoming',
        },
        {
            number: 4,
            title: 'Grand Finale',
            description: 'Pitch to the Sharks and win prizes',
            status: 'upcoming',
        },
    ]

    return (
        <section className="bg-zinc-950 px-4 py-20 md:py-32">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-zinc-50">
                    Competition Timeline
                </h2>

                <div className="space-y-8">
                    {steps.map((step, index) => (
                        <div key={step.number} className="relative">
                            {/* Connecting line */}
                            {index !== steps.length - 1 && (
                                <div
                                    className={`absolute left-6 md:left-8 top-20 w-1 h-12 md:h-16 ${step.status === 'current'
                                            ? 'bg-gradient-to-b from-orange-500 to-orange-500/50'
                                            : 'bg-zinc-800'
                                        }`}
                                />
                            )}

                            <div className="flex gap-6 md:gap-8">
                                {/* Timeline Dot */}
                                <div className="relative flex-shrink-0">
                                    <div
                                        className={`w-12 md:w-16 h-12 md:h-16 rounded-full border-2 flex items-center justify-center font-bold text-lg md:text-xl transition ${step.status === 'current'
                                                ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                                                : 'bg-zinc-900/50 border-zinc-700 text-zinc-400'
                                            }`}
                                    >
                                        {step.number}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 pt-2 md:pt-3">
                                    <h3
                                        className={`text-xl md:text-2xl font-bold mb-2 ${step.status === 'current'
                                                ? 'text-orange-400'
                                                : 'text-zinc-200'
                                            }`}
                                    >
                                        {step.title}
                                        {step.status === 'current' && (
                                            <span className="text-sm ml-3 bg-orange-900/30 text-orange-300 px-3 py-1 rounded-full font-medium inline-block">
                                                Current
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-zinc-400 text-base md:text-lg">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
