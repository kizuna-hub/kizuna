import ProRataSimulator from '@/components/investor/investor-dashboard/pro-rata-simulator';

interface Props {
    params: { id: string };
}

export default function ProRataPage({ params }: Props) {
    return <ProRataSimulator dealId={params.id} />;
}
