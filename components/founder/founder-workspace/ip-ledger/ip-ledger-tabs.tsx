import { motion } from 'framer-motion';

interface TabsProps {
    activeTab: 'register' | 'verify';
    setActiveTab: (tab: 'register' | 'verify') => void;
}

export const IPLedgerTabs = ({ activeTab, setActiveTab }: TabsProps) => (
    <div className="flex items-center gap-4 border-b border-zinc-200 pb-px mb-8">
        {(['register', 'verify'] as const).map((tab) => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === tab ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'
                    }`}
            >
                {tab === 'register' ? 'Đăng ký Tài liệu' : 'Xác thực Tài liệu'}
                {activeTab === tab && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#16452a]" />
                )}
            </button>
        ))}
    </div>
);