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
    path: page.path,
    keywords: ['hammad tools terms', 'subscription terms Pakistan', 'terms and conditions'],
  });
}

export default async function TermsAndConditionsPage() {
  const page = await getLegalPageContent('terms-and-conditions');
  return <LegalPageView page={page} variant="terms" />;
}
