import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, ExternalLink } from "lucide-react";

interface MentorCardProps {
    id: string;
    name: string;
    role: string;
    company: string;
    avatar: string;
    rating: number;
    sessions: number;
    bio: string;
    expertise: string[];
}

export function MentorCard({
    id,
    name,
    role,
    company,
    avatar,
    rating,
    sessions,
    bio,
    expertise,
}: MentorCardProps) {
    return (
        <Card className="flex flex-col w-full h-full aspect-[3/4] p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,107,0,0.15)] hover:border-primary/50 relative bg-gradient-to-br from-zinc-900/50 to-zinc-950 border-zinc-800/80">
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 h-8 w-8 text-muted-foreground hover:text-primary transition-colors duration-300"
            >
                <ExternalLink className="h-4 w-4" />
            </Button>

            <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                    <Avatar className="h-14 w-14 ring-2 ring-zinc-800">
                        <AvatarImage src={avatar} alt={name} />
                        <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0.5 right-0.5 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-zinc-900" />
                </div>
                <div className="flex-1 pr-8">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                        {company}
                    </div>
                    <h3 className="text-lg font-bold text-foreground leading-tight">{name}</h3>
                    <p className="text-sm text-zinc-400 mt-0.5">{role}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <span className="font-medium text-zinc-200">{rating}</span>
                <span className="text-zinc-500 text-sm">• {sessions} sessions</span>
            </div>

            <div className="mb-6 flex-1">
                <p className="text-sm text-zinc-400 line-clamp-4 leading-relaxed">
                    {bio}
                </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                {expertise.map((skill) => (
                    <span
                        key={skill}
                        className="bg-orange-500/10 text-orange-400 border-none rounded-full px-3 py-1 text-xs"
                    >
                        {skill}
                    </span>
                ))}
            </div>

            <Button className="w-full mt-auto bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_15px_rgba(255,107,0,0.3)] transition-all duration-300">
                Book a Session
            </Button>
        </Card>
    );
}
