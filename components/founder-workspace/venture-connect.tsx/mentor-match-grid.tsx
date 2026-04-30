import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { Link } from '@/i18n/routing';

export const MentorMatchGrid = ({ matches }: { matches: any[] }) => (
    <section className="space-y-6">
        <div className="flex justify-between items-end">
            <h2 className="text-2xl font-medium tracking-tight text-kizuna-text-main">Gợi ý Mentor Phù hợp nhất</h2>
            <button className="text-sm font-medium text-kizuna-text-muted hover:text-kizuna-primary transition-colors">Xem tất cả</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
                <div key={match.id} className="group relative bg-kizuna-canvas/40 backdrop-blur-xl border border-kizuna-border/60 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                    <div className="relative z-10 space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-kizuna-surface flex items-center justify-center border border-kizuna-border shadow-sm shrink-0">
                                    <span className="font-bold text-kizuna-text-muted text-sm">{match.initials}</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-kizuna-text-main line-clamp-1">{match.name}</h4>
                                    <Badge variant="secondary" className="bg-kizuna-primary/10 text-kizuna-primary text-[10px] px-2 py-0 border-transparent mt-1 hover:bg-kizuna-primary/20 transition-colors">
                                        {match.tier}
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex flex-col items-end shrink-0">
                                <span className="text-xl font-light text-kizuna-primary">{match.matchScore}</span>
                                <span className="text-[10px] uppercase tracking-wider text-kizuna-text-muted font-semibold">Phù hợp</span>
                            </div>
                        </div>
                        <p className="text-xs text-kizuna-text-muted line-clamp-1 h-4">{match.role}</p>
                        <div className="flex flex-wrap gap-2">
                            {match.tags.map((tag: string) => (
                                <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-transparent text-kizuna-text-muted border border-kizuna-border cursor-default">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-kizuna-text-muted bg-kizuna-surface p-2 rounded-lg border border-kizuna-border">
                            <Star size={14} className="text-kizuna-primary fill-kizuna-primary/20 shrink-0" />
                            <span className="truncate">{match.socialProof}</span>
                        </div>
                        <div className="pt-4 flex gap-3">
                            <Button asChild variant="outline" className="flex-1 bg-transparent border-kizuna-border text-kizuna-text-main hover:bg-kizuna-surface rounded-xl transition-all">
                                <Link href={`/mentor-profile/${match.id}`}>Xem Hồ Sơ</Link>
                            </Button>
                            <Button className="flex-1 bg-kizuna-primary text-white rounded-xl shadow-md hover:opacity-90 transition-all">
                                Kết nối ngay
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </section>
);