import DueDiligenceTerminal from '@/components/investor/investor-dashboard/due-diligence-terminal';

interface Props {
    params: { id: string };
}

export default function DDPage({ params }: Props) {
    return <DueDiligenceTerminal dealId={params.id} />;
}

export function generateMetadata({ params }: Props) {
    return {
        title: `Due Diligence — ${params.id} · Kizuna Hub`,
    };
}
