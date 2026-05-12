import type { Metadata } from 'next';
import LegalPageView from '@/components/LegalPageView';
import { createPageMetadata } from '@/lib/seo';
import { getLegalPageContent } from '@/lib/server/legal-pages';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPageContent('privacy-policy');
  return createPageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: page.path,
    keywords: ['hammad tools privacy policy', 'privacy policy subscriptions'],
  });
}

export default async function PrivacyPolicyPage() {
  const page = await getLegalPageContent('privacy-policy');
  return <LegalPageView page={page} variant="privacy" />;
}
