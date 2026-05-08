import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ServicesSection from '@/components/ServicesSection';
import { resolveImageSource, toMetadataImageUrl } from '@/lib/image-display';
import {
  TOOL_KEYWORDS,
  createAutoPageMetadata,
  createPageMetadata,
} from '@/lib/seo';
import {
  getPublishedToolCategories,
  getToolCategoryBySlug,
  getToolsForCategory,
} from '@/lib/server/categories';

type PageParams = { slug: string };

export const dynamic = 'force-dynamic';

function getCategoryLabel(name: string) {
  const trimmed = (name || '').trim();
  if (!trimmed) {
    return 'Tools';
  }
  return /\btools?\b/i.test(trimmed) ? trimmed : `${trimmed} Tools`;
}

export async function generateStaticParams() {
  const categories = await getPublishedToolCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getToolCategoryBySlug(slug);

  if (!category) {
    return createPageMetadata({
      title: 'Category Not Found',
      description: 'The requested tool category could not be found on Hammad Tools.',
      path: `/tools/category/${slug}`,
      noIndex: true,
    });
  }

  const categoryLabel = getCategoryLabel(category.name);
  const tools = await getToolsForCategory(category.id, 6);
  const firstToolImage = tools[0]
    ? resolveImageSource(tools[0], {
        mediaPaths: ['imageMedia'],
        stringPaths: ['image', 'thumbnail'],
      })
    : '';
  const metadataImage =
    toMetadataImageUrl(category.imageUrl || firstToolImage) || '/services-card.webp';

  return createAutoPageMetadata({
    title: `${categoryLabel} & Subscriptions`,
    path: `/tools/category/${category.slug}`,
    image: metadataImage,
    shortDescription: `${categoryLabel} premium subscriptions, software, and digital tools.`,
    content: tools.map((tool) => tool.title || tool.name || '').join(', '),
    fallbackDescription: `Browse ${categoryLabel.toLowerCase()}, premium subscriptions, software, and digital products on Hammad Tools with secure checkout and fast delivery in Pakistan.`,
    keywords: [
      ...TOOL_KEYWORDS,
      category.name,
      categoryLabel,
      `${category.name} Pakistan`,
      `${category.name} subscriptions`,
    ],
  });
}

export default async function ToolCategoryPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const category = await getToolCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const categoryLabel = getCategoryLabel(category.name);

  return (
    <main className="min-h-screen page-navbar-spacing pb-20 bg-brand-bg">
      <section className="pt-4 md:pt-6">
        <div className="site-container">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-primary">
              Tool Category
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-black leading-[0.96] text-brand-text">
              <span className="internal-gradient">{categoryLabel}</span>
            </h1>
            <p className="mt-4 text-sm md:text-base leading-relaxed text-brand-text/62">
              Browse {categoryLabel.toLowerCase()}, premium subscriptions, software, and digital tools from
              Hammad Tools with secure checkout and fast delivery in Pakistan.
            </p>
          </div>
        </div>
      </section>
      <ServicesSection initialCategorySlug={category.slug} />
    </main>
  );
}
