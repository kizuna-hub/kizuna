export const ReadinessWidget = () => (
    <div className="w-full lg:w-96 bg-kizuna-canvas p-6 rounded-3xl shadow-sm border border-kizuna-border flex items-center gap-6">
        <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-kizuna-surface" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-kizuna-primary" strokeWidth="3" strokeDasharray="85, 100" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" strokeLinecap="round" />
            </svg>
            <span className="absolute text-sm font-semibold text-kizuna-text-main">85%</span>
        </div>
        <div>
            <h3 className="text-sm font-semibold text-kizuna-text-main">Độ hoàn thiện Pitch Deck</h3>
            <p className="text-xs text-kizuna-text-muted mt-1 leading-relaxed">
                Sử dụng <span className="text-kizuna-primary font-medium cursor-pointer hover:underline">AI Policy Navigator</span> để đạt 100% trước khi kết nối Mentor cấp cao.
            </p>
        </div>
    </div>
);