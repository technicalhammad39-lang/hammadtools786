import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clapperboard,
  Code2,
  Layers3,
  Megaphone,
  MessageCircle,
  Palette,
  Rocket,
  SearchCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
  Zap,
} from 'lucide-react';
import UploadedImage from '@/components/UploadedImage';
import {
  buildSeoDescription,
  createAutoPageMetadata,
  createPageMetadata,
  toAbsoluteSiteUrl,
} from '@/lib/seo';
import { toMetadataImageUrl } from '@/lib/image-display';
import { getAgencyServiceBySlug } from '@/lib/server/agency-services';
import { buildServiceWhatsAppUrl, getServicePriceLabel } from '@/lib/service-whatsapp';

type PageParams = { slug: string };

export const dynamic = 'force-dynamic';

function buildFeatureList(service: { title: string; description: string; tags: string[]; features?: string[] }) {
  const fromFeatures = (service.features || []).slice(0, 6);
  const fromTags = service.tags.slice(0, 6);
  const fallback = [
    'Custom project scope',
    'Professional delivery',
    'Secure payment proof flow',
    'Direct support response',
  ];
  const source = fromFeatures.length ? fromFeatures : fromTags.length ? fromTags : fallback;
  return source.map((item) => item.trim()).filter(Boolean);
}

function normalizeDisplayTitle(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function renderServiceIcon(
  slug: string,
  title: string,
  category: string | undefined,
  className: string,
  style: CSSProperties
) {
  const key = `${slug} ${title} ${category}`.toLowerCase();

  if (key.includes('web') || key.includes('website')) return <Code2 className={className} style={style} />;
  if (key.includes('graphic') || key.includes('brand') || key.includes('logo')) return <Palette className={className} style={style} />;
  if (key.includes('ui') || key.includes('ux') || key.includes('design system')) return <Layers3 className={className} style={style} />;
  if (key.includes('store') || key.includes('ecommerce') || key.includes('shop')) return <ShoppingBag className={className} style={style} />;
  if (key.includes('seo') || key.includes('growth')) return <SearchCheck className={className} style={style} />;
  if (key.includes('social') || key.includes('marketing')) return <Megaphone className={className} style={style} />;
  if (key.includes('video') || key.includes('reels')) return <Clapperboard className={className} style={style} />;
  return <Rocket className={className} style={style} />;
}

function getInitials(title: string) {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('') || 'HT';
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getAgencyServiceBySlug(slug);

  if (!service) {
    return createPageMetadata({
      title: 'Service Not Found',
      description: 'The requested service could not be found.',
      path: `/services/${slug}`,
      noIndex: true,
    });
  }

  const serviceTitle = normalizeDisplayTitle(service.title);
  const metadataImage = toMetadataImageUrl(service.thumbnail) || '/services-card.webp';
  return createAutoPageMetadata({
    title: `${serviceTitle} | Hammad Tools Services`,
    path: `/services/${service.slug}`,
    image: metadataImage,
    shortDescription: service.description,
    fallbackDescription: `${serviceTitle} service by Hammad Tools with fast delivery and professional support in Pakistan.`,
    keywords: [
      'hammad tools services',
      serviceTitle,
      `${serviceTitle} Pakistan`,
      ...service.tags,
    ],
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const service = await getAgencyServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const imageSrc = service.thumbnail || '/services-card.webp';
  const serviceTitle = normalizeDisplayTitle(service.title);
  const serviceUrl = toAbsoluteSiteUrl(`/services/${service.slug}`);
  const serviceImage = imageSrc.startsWith('http')
    ? imageSrc
    : toAbsoluteSiteUrl(imageSrc);
  const serviceDescription = buildSeoDescription(
    [service.description],
    `${serviceTitle} service by Hammad Tools.`,
    200
  );
  const features = buildFeatureList({ ...service, title: serviceTitle });
  const highlights = (service.highlights || []).slice(0, 4);
  const processSteps = (service.process || []).slice(0, 4);
  const deliverables = (service.deliverables || []).slice(0, 6);
  const accent = service.accent || '#FFD600';
  const gradient =
    service.gradient || 'linear-gradient(135deg, #FFD600 0%, #FF8C2A 48%, #111827 100%)';
  const hasCustomImage = Boolean(imageSrc && imageSrc !== '/services-card.webp');
  const requestHref = buildServiceWhatsAppUrl(serviceTitle, getServicePriceLabel(service));

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceTitle,
    serviceType: serviceTitle,
    description: serviceDescription,
    image: [serviceImage],
    provider: {
      '@type': 'Organization',
      name: 'Hammad Tools',
      url: toAbsoluteSiteUrl('/'),
    },
    areaServed: 'PK',
    url: serviceUrl,
  };

  return (
    <main
      className="min-h-screen page-navbar-spacing pb-16 md:pb-24 bg-brand-bg relative overflow-hidden"
      style={{
        '--service-accent': accent,
        '--service-gradient': gradient,
      } as CSSProperties}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute top-64 -left-24 h-80 w-80 rounded-full bg-secondary/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 -right-28 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 cyber-grid opacity-[0.07]" />

      <div className="site-container relative z-10">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-black uppercase tracking-widest text-brand-text/60 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back To Services
        </Link>

        <section className="service-detail-hero mt-6 overflow-hidden rounded-[2rem] md:rounded-[3rem] border border-white/10 bg-white/[0.035] p-5 md:p-8 shadow-2xl shadow-black/40">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.92fr)] lg:items-center">
            <div className="relative z-10">
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-primary shadow-lg shadow-primary/10">
                  <Sparkles className="h-3.5 w-3.5" />
                  {service.badge || 'Premium Service'}
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-brand-text/55">
                  <ShieldCheck className="h-3.5 w-3.5" style={{ color: accent }} />
                  {service.delivery || 'Custom Timeline'}
                </div>
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl md:text-7xl font-black text-brand-text leading-[0.94] uppercase tracking-tight">
                {serviceTitle}
              </h1>

              <p className="mt-5 max-w-3xl text-base md:text-lg leading-8 text-brand-text/68 whitespace-pre-wrap">
                {service.description || 'Contact Hammad Tools for service details and a custom quote.'}
              </p>

              {highlights.length ? (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {highlights.map((highlight) => (
                    <div key={highlight} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs font-bold text-brand-text/65">
                      <Zap className="h-4 w-4 shrink-0" style={{ color: accent }} />
                      {highlight}
                    </div>
                  ))}
                </div>
              ) : null}

              {service.tags.length ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-brand-text/70"
                    >
                      <Tag className="w-3 h-3 text-primary" />
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={requestHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-b-4 border-secondary bg-primary px-6 py-4 text-[11px] font-black uppercase tracking-widest text-black transition-transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  <MessageCircle className="w-4 h-4" />
                  Request Service
                </a>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-brand-text/70 hover:border-primary/35 hover:text-primary"
                >
                  Explore Services
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="service-detail-visual relative overflow-hidden rounded-[2rem] border border-white/12 bg-black/40 p-3 shadow-2xl shadow-black/40">
              <div className="relative aspect-[16/11] overflow-hidden rounded-[1.45rem]">
                {hasCustomImage ? (
                  <UploadedImage
                    src={imageSrc}
                    fallbackSrc="/services-card.webp"
                    alt={serviceTitle}
                    className="absolute inset-0 h-full w-full object-cover opacity-80"
                  />
                ) : null}
                <div className={`agency-generated-visual absolute inset-0 ${hasCustomImage ? 'opacity-0' : ''}`} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(255,255,255,0.28),transparent_26%),linear-gradient(to_top,rgba(0,0,0,0.86),rgba(0,0,0,0.08)_58%,rgba(255,255,255,0.08))]" />
                <div className="absolute right-6 top-6 text-7xl md:text-8xl font-black text-white/[0.08]">
                  {getInitials(serviceTitle)}
                </div>
                <div className="absolute left-6 top-6 grid h-16 w-16 place-items-center rounded-2xl border border-white/18 bg-black/35 backdrop-blur-xl">
                  {renderServiceIcon(service.slug, serviceTitle, service.category, 'h-8 w-8', { color: accent })}
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white/70 backdrop-blur-xl">
                    <BadgeCheck className="h-3.5 w-3.5" style={{ color: accent }} />
                    {service.category || 'Agency Service'}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black uppercase leading-[0.92] text-white">
                    {serviceTitle}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 md:mt-12">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-xl md:text-2xl font-black text-brand-text">What you get</h2>
            <span className="hidden sm:block h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature}
                className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-xl shadow-black/20"
              >
                <CheckCircle2 className="mb-3 h-5 w-5" style={{ color: accent }} />
                <div className="text-sm font-black text-brand-text leading-snug">{feature}</div>
              </div>
            ))}
          </div>
        </section>

        {processSteps.length ? (
          <section className="mt-10 md:mt-12 grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="rounded-[2rem] border border-white/10 bg-black/22 p-6 md:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-primary">
                <Rocket className="h-3.5 w-3.5" />
                Delivery Flow
              </div>
              <h2 className="mt-4 text-3xl md:text-4xl font-black uppercase text-brand-text leading-none">
                Premium process. Clean handover.
              </h2>
              <p className="mt-4 text-sm leading-7 text-brand-text/55">
                Every service follows a focused agency workflow: scope clarity, polished production, quality checks, and direct support until handover.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {processSteps.map((step, index) => (
                <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-black text-black">
                    {index + 1}
                  </div>
                  <div className="text-sm font-black text-brand-text">{step}</div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {deliverables.length ? (
          <section className="mt-10 md:mt-12 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 md:p-8">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-xl md:text-2xl font-black text-brand-text">Final deliverables</h2>
              <span className="hidden sm:block h-px flex-1 bg-gradient-to-r from-primary/35 to-transparent" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {deliverables.map((deliverable) => (
                <div key={deliverable} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-bold text-brand-text/65">
                  <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: accent }} />
                  {deliverable}
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
