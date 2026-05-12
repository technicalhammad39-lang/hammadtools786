import type { Metadata } from 'next';
import LegalPageView from '@/components/LegalPageView';
import { createPageMetadata } from '@/lib/seo';
import { getLegalPageContent } from '@/lib/server/legal-pages';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPageContent('terms-and-conditions');
  return createPageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: '/terms',
    keywords: ['hammad tools terms', 'subscription terms Pakistan'],
  });
}

export default async function TermsPage() {
  const page = await getLegalPageContent('terms-and-conditions');
  return <LegalPageView page={{ ...page, path: '/terms' }} variant="terms" />;
}
