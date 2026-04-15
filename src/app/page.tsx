import type { Metadata } from 'next';
import { Calculator } from '@/components/calculator/Calculator';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/constants';
import { formatNIS } from '@/lib/format';
import { computeBurden } from '@/engine/burden';

type Props = {
  searchParams: Promise<{ salary?: string; gender?: string; children?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const salary = params.salary ? parseInt(params.salary, 10) : null;
  const gender = params.gender === 'female' ? 'female' : 'male';
  const children = params.children ? parseInt(params.children, 10) : 0;

  if (salary && salary >= 5000 && salary <= 80000) {
    const burden = computeBurden(salary, gender, children);
    const title = `${formatNIS(burden.combinedMonthly)} בחודש הולכים לחרדים`;
    const description = `מתוך תלוש של ${formatNIS(salary)}, ${formatNIS(burden.combinedMonthly)} בחודש הולכים לחרדים`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [`${SITE_URL}/api/og?salary=${salary}&gender=${gender}&children=${children}`],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [`${SITE_URL}/api/og?salary=${salary}&gender=${gender}&children=${children}`],
      },
    };
  }

  return {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  };
}

export default function Home() {
  return <Calculator />;
}
