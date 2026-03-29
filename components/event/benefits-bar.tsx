export function BenefitsBar() {
    const benefits = [
        {
            icon: '✨',
            title: 'AI Pitch Deck Generator',
            description: 'Create professional pitches instantly',
        },
        {
            icon: '🤝',
            title: 'Direct Mentor Matching',
            description: 'Connect with industry experts',
        },
        {
            icon: '🛡️',
            title: 'IP Timestamping',
            description: 'Protect your ideas automatically',
        },
    ]

    return (
        <section className="bg-zinc-900/50 border-y border-orange-500/20 px-4 py-12 md:py-16">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center group hover:bg-zinc-800/30 rounded-lg p-6 transition duration-300"
                        >
                            <div className="text-4xl mb-3 group-hover:scale-110 transition">
                                {benefit.icon}
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-zinc-50 mb-2">
                                {benefit.title}
                            </h3>
                            <p className="text-sm md:text-base text-zinc-400">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
