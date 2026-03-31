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
    expertise,
}: MentorCardProps) {
    return (
        <Card className="p-6 hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={avatar} alt={name} />
                        <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{name}</h3>
                        <p className="text-sm text-muted-foreground">{role}</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                >
                    <ExternalLink className="h-4 w-4" />
                </Button>
            </div>

            <div className="mb-4">
                <Badge variant="secondary" className="text-xs">
                    {company}
                </Badge>
            </div>

            <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="text-sm font-medium text-foreground">{rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">({sessions} sessions)</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                {expertise.map((skill) => (
                    <Badge
                        key={skill}
                        variant="outline"
                        className="text-xs text-muted-foreground border-muted-foreground/30"
                    >
                        #{skill}
                    </Badge>
                ))}
            </div>

            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Book a Session
            </Button>
        </Card>
    );
}
