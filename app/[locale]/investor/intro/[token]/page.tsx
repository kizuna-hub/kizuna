import WarmIntroLanding from '@/components/investor/warm-intro-landing';

interface Props {
    params: { token: string };
}

export default function WarmIntroPage({ params }: Props) {
    return <WarmIntroLanding />;
}

export async function generateMetadata({ params }: Props) {
    return {
        title: `Warm Intro — Kizuna Hub`,
        description: 'Nhà đầu tư được giới thiệu startup tiềm năng từ Mentor bảo chứng.',
        robots: { index: false, follow: false }, // Data Room không được index
    };
}
