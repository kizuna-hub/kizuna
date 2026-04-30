import { LayoutGrid, Server, Zap, Megaphone, Scale, BrainCircuit } from 'lucide-react';

export const categories = [
    { id: 'all', label: 'Tất cả', icon: LayoutGrid },
    { id: 'infrastructure', label: 'Hạ tầng', icon: Server },
    { id: 'productivity', label: 'Hiệu suất', icon: Zap },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
    { id: 'legal', label: 'Pháp lý', icon: Scale },
    { id: 'ai-tools', label: 'Công cụ AI', icon: BrainCircuit },
];

export const FilterBar = ({ activeFilter, setActiveFilter }: { activeFilter: string, setActiveFilter: (id: string) => void }) => (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
        {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeFilter === category.id;
            return (
                <button
                    key={category.id}
                    onClick={() => setActiveFilter(category.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide transition-all ${isActive ? 'bg-kizuna-primary text-white shadow-md' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                        }`}
                >
                    <Icon className="w-3.5 h-3.5" />
                    {category.label}
                </button>
            );
        })}
    </div>
);