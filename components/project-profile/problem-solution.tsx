'use client';

interface ProblemSolutionProps {
    slug: string;
}

export function ProblemSolution({ slug }: ProblemSolutionProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-kizuna-border pb-12">
            <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-kizuna-text-main">The Problem</h3>
                <div className="space-y-3 text-kizuna-text-muted">
                    <p>
                        Founders struggle to connect with experienced mentors and investors early in their journey. Traditional networks are closed, inefficient, and biased toward certain geographies and backgrounds.
                    </p>
                    <p>
                        Most startup discovery platforms lack intelligent matching, making it difficult for founders to find relevant resources that align with their vision and stage.
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-kizuna-text-main">Our Solution</h3>
                <div className="space-y-3 text-kizuna-text-muted">
                    <p>
                        NovaHub uses advanced AI to match founders with curated mentors, investors, and resources. We democratize access to startup networks and create transparent, merit-based connections.
                    </p>
                    <p>
                        Our platform handles matchmaking, communication, progress tracking, and resource discovery—all in one place, with AI-powered personalization.
                    </p>
                </div>
            </div>
        </div>
    );
}
