import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'

export function SharksGrid() {
    const sharks = [
        {
            name: 'Pham Minh Tuan',
            title: 'Director at FUNDGO',
            initials: 'PT',
            color: 'bg-orange-600',
        },
        {
            name: 'Nguyen Van Long',
            title: 'CEO at VICO',
            initials: 'NL',
            color: 'bg-blue-600',
        },
        {
            name: 'Tran Thi Huong',
            title: 'Founder at InnovateTech',
            initials: 'TH',
            color: 'bg-purple-600',
        },
        {
            name: 'Le Hoang Minh',
            title: 'Managing Partner at VentureLab',
            initials: 'LH',
            color: 'bg-pink-600',
        },
        {
            name: 'Dang Quoc Vinh',
            title: 'Board Member at StartupHUB',
            initials: 'DQ',
            color: 'bg-cyan-600',
        },
        {
            name: 'Vo Thi Mai',
            title: 'CTO at TechFuture',
            initials: 'VM',
            color: 'bg-yellow-600',
        },
    ]

    return (
        <section className="bg-zinc-900/50 border-y border-orange-500/20 px-4 py-20 md:py-32">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-zinc-50">
                    Pitch to the Best
                </h2>
                <p className="text-center text-zinc-400 mb-16 max-w-2xl mx-auto">
                    Meet the elite panel of investors and mentors ready to support your journey
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sharks.map((shark, index) => (
                        <Card
                            key={index}
                            className="bg-zinc-800/30 border-zinc-700/50 hover:border-orange-500/50 p-6 transition duration-300 hover:shadow-lg hover:shadow-orange-500/10"
                        >
                            <div className="flex flex-col items-center text-center">
                                <Avatar className="w-16 h-16 mb-4 border-2 border-orange-500/50">
                                    <AvatarFallback className={`${shark.color} text-white font-bold text-lg`}>
                                        {shark.initials}
                                    </AvatarFallback>
                                </Avatar>
                                <h3 className="text-lg font-bold text-zinc-50 mb-1">
                                    {shark.name}
                                </h3>
                                <p className="text-sm text-orange-400 font-medium mb-3">
                                    {shark.title}
                                </p>
                                <p className="text-xs text-zinc-500">
                                    Ready to mentor and invest in the next big thing
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
