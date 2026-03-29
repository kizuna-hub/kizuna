import { MentorHeader } from '@/components/mentor/mentor-header';
import { KanbanBoard } from '@/components/mentor/kanban-board';

export default function MentorPortalPage() {
    // Sample data for the kanban board
    const mentorData = {
        pendingRequests: [
            {
                id: '1',
                title: 'React Performance Guide',
                stage: 'Beginner',
                aiSummary: 'Sarah wants help optimizing her React component. She&apos;s struggling with unnecessary re-renders in a large dashboard application.',
                timeSlots: ['Wed 2-3pm', 'Thu 4-5pm'],
            },
            {
                id: '2',
                title: 'Node.js API Design',
                stage: 'Intermediate',
                aiSummary: 'Mike is building a REST API and needs guidance on best practices for error handling and authentication.',
                timeSlots: ['Mon 3-4pm'],
            },
        ],
        upcomingSessions: [
            {
                id: '3',
                title: 'TypeScript Deep Dive',
                stage: 'Advanced',
                aiSummary: 'Follow-up session with Emma about advanced type systems and generics. They&apos;re working on a library that needs strict typing.',
                timeSlots: ['Today 4:00pm'],
            },
            {
                id: '4',
                title: 'Portfolio Review',
                stage: 'Beginner',
                aiSummary: 'Alex needs feedback on their portfolio projects. Focus on code quality and project structure.',
                timeSlots: ['Tomorrow 10:00am'],
            },
        ],
        completedSessions: [
            {
                id: '5',
                title: 'Next.js Fundamentals',
                stage: 'Beginner',
                aiSummary: 'Great session! Covered routing, API routes, and server components. Alex now understands the basics well.',
            },
            {
                id: '6',
                title: 'Database Design',
                stage: 'Intermediate',
                aiSummary: 'Discussed normalization and query optimization. Jamie is now confident with database architecture decisions.',
            },
            {
                id: '7',
                title: 'Git Workflow',
                stage: 'Beginner',
                aiSummary: 'Covered branching strategies and collaborative workflows. Team communication improved significantly.',
            },
        ],
    };

    const kanbanColumns = [
        {
            title: 'Pending Requests',
            status: 'pending' as const,
            items: mentorData.pendingRequests,
        },
        {
            title: 'Upcoming Sessions',
            status: 'upcoming' as const,
            items: mentorData.upcomingSessions,
        },
        {
            title: 'Completed Portfolio',
            status: 'completed' as const,
            items: mentorData.completedSessions,
        },
    ];

    return (
        <main className="min-h-screen w-full bg-background text-foreground">
            <MentorHeader />
            <div className="bg-background">
                <KanbanBoard columns={kanbanColumns} />
            </div>
        </main>
    );
}
