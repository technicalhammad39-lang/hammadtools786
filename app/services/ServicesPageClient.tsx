'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Clapperboard,
  Clock,
  Code2,
  Layout,
  Layers3,
  Loader2,
  Megaphone,
  Palette,
  Search,
  SearchCheck,
  ShoppingBag,
  Sparkles,
  Tag,
  Zap,
} from 'lucide-react';
import { db } from '@/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import Link from 'next/link';
import { useSettings } from '@/context/SettingsContext';
import { resolveImageSource } from '@/lib/image-display';
import { toSlugFromTitle } from '@/lib/seo';
import type { StoredFileMetadata } from '@/lib/types/domain';
import UploadedImage from '@/components/UploadedImage';
import {
  mergeAgencyServicesWithDefaults,
  type AgencyServiceProfile,
} from '@/lib/agency-service-defaults';

interface AgencyService extends Partial<AgencyServiceProfile> {
  id: string;
  title?: string;
  slug?: string;
  description?: string;
  thumbnail?: string;
  thumbnailMedia?: StoredFileMetadata | null;
  tags?: string[];
  active?: boolean;
}

function getTitle(service: AgencyService) {
  return (service.title || 'Untitled Service').replace(/\s+/g, ' ').trim();
}

function getServiceSlug(service: AgencyService) {
  return toSlugFromTitle((service.slug || service.title || '').toString()) || service.id;
}

function renderServiceIcon(service: AgencyService, className: string, style: React.CSSProperties) {
  const key = `${service.slug || ''} ${service.title || ''} ${service.category || ''}`.toLowerCase();

  if (key.includes('web') || key.includes('website')) return <Code2 className={className} style={style} />;
  if (key.includes('graphic') || key.includes('brand') || key.includes('logo')) return <Palette className={className} style={style} />;
  if (key.includes('ui') || key.includes('ux') || key.includes('design system')) return <Layers3 className={className} style={style} />;
  if (key.includes('store') || key.includes('ecommerce') || key.includes('shop')) return <ShoppingBag className={className} style={style} />;
  if (key.includes('seo') || key.includes('growth')) return <SearchCheck className={className} style={style} />;
  if (key.includes('social') || key.includes('marketing')) return <Megaphone className={className} style={style} />;
  if (key.includes('video') || key.includes('reels')) return <Clapperboard className={className} style={style} />;
  return <Sparkles className={className} style={style} />;
}

function getInitials(title: string) {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('') || 'HT';
}

export default function AgencyServicesPage() {
  const { settings } = useSettings();
  const [services, setServices] = useState<AgencyService[]>(
    mergeAgencyServicesWithDefaults<AgencyService>([]).map((service) => ({ ...service }))
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let mounted = true;
    async function loadServices() {
      try {
        const snapshot = await getDocs(query(collection(db, 'agency_services'), orderBy('createdAt', 'desc')));
        if (!mounted) {
          return;
        }
        const docs = snapshot.docs
          .map((doc) => ({ id: doc.id, ...(doc.data() as Omit<AgencyService, 'id'>) }))
          .filter((service) => service.active !== false);
        setServices(mergeAgencyServicesWithDefaults<AgencyService>(docs).map((service) => ({ ...service })));
      } catch (error) {
        console.error('Failed to load agency services:', error);
        if (mounted) {
          setServices(mergeAgencyServicesWithDefaults<AgencyService>([]).map((service) => ({ ...service })));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadServices();
    return () => {
      mounted = false;
    };
  }, []);

  function buildWhatsappUrl(serviceTitle: string) {
    const rawPhone = settings.supportPhone || '';
    const phone = rawPhone.replace(/[^0-9]/g, '');
    const message = `Assalam o Alaikum, I want to request: ${serviceTitle}. Please share details and price.`;
    if (phone) {
      return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    }
    if (settings.whatsappUrl) {
      const separator = settings.whatsappUrl.includes('?') ? '&' : '?';
      return `${settings.whatsappUrl}${separator}text=${encodeURIComponent(message)}`;
    }
    return '#';
  }

  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) {
      return services;
    }
    const needle = searchQuery.trim().toLowerCase();
    return services.filter((service) => {
      const haystack = `${service.title || ''} ${service.description || ''} ${(service.tags || []).join(' ')}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [services, searchQuery]);

  return (
    <main className="min-h-screen page-navbar-spacing pb-16 md:pb-24 bg-brand-bg relative overflow-hidden">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute top-64 -left-24 h-80 w-80 rounded-full bg-secondary/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-40 -right-24 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 cyber-grid opacity-[0.08]" />

      <div className="site-container relative z-10">
        <section
          data-gsap-reveal="gsap"
          className="agency-services-hero relative overflow-hidden rounded-[2rem] md:rounded-[3rem] border border-white/10 bg-white/[0.035] px-5 py-8 md:px-10 md:py-12 mb-8 md:mb-12"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,214,0,0.20),transparent_34%),radial-gradient(circle_at_86%_12%,rgba(56,189,248,0.16),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.07),transparent_42%)]" />
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-primary/20 bg-primary/10 blur-sm" />
          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-primary shadow-lg shadow-primary/10">
                <Sparkles className="h-3.5 w-3.5" />
                High-End Digital Agency
              </div>
              <h1 className="mt-5 text-4xl md:text-7xl font-black uppercase tracking-tight text-brand-text leading-[0.95]">
                <span className="font-serif italic text-white normal-case">Premium</span>{' '}
                <span className="internal-gradient">Services</span>
              </h1>
              <p className="mt-5 max-w-3xl text-sm md:text-lg leading-8 text-brand-text/62 font-medium">
                Agency-grade web development, graphic design, UI/UX, SEO, branding, video, and marketing services built with premium visuals, clean strategy, and launch-ready delivery.
              </p>
              <div className="mt-7 grid grid-cols-3 gap-3 max-w-2xl">
                {[
                  ['8+', 'Core Services'],
                  ['24/7', 'Support Flow'],
                  ['Pro', 'Launch Quality'],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-black/25 px-3 py-4 text-center shadow-xl shadow-black/20">
                    <div className="text-xl md:text-3xl font-black text-primary">{value}</div>
                    <div className="mt-1 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-brand-text/42">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.7rem] border border-white/10 bg-black/30 p-4 shadow-2xl shadow-black/35">
              <div className="mb-3 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-brand-text/40">
                <Search className="h-3.5 w-3.5 text-primary" />
                Find Your Service
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search services..."
                className="w-full bg-white/[0.06] border border-white/10 rounded-2xl px-4 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-primary/55"
              />
              <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
                <span className="text-[9px] font-black uppercase tracking-widest text-brand-text/38">Available</span>
                <span className="text-sm font-black text-primary">{filteredServices.length} services</span>
              </div>
            </div>
          </div>
        </section>

        {loading && services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-text/20">Loading services...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-40 glass rounded-[3rem] border border-white/5">
            <Layout className="w-16 h-16 text-brand-text/10 mx-auto mb-6" />
            <h3 className="text-xl font-black uppercase text-brand-text mb-2">No Active Services</h3>
            <p className="text-brand-text/40 text-[10px] font-black uppercase tracking-widest">Add services from admin panel to show them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
            {filteredServices.map((service, index) => {
              const title = getTitle(service);
              const serviceSlug = getServiceSlug(service);
              const serviceHref = `/services/${encodeURIComponent(serviceSlug)}`;
              const thumbnailSrc = resolveImageSource(service, {
                mediaPaths: ['thumbnailMedia'],
                stringPaths: ['thumbnail'],
                placeholder: '/services-card.webp',
              });
              const hasCustomThumbnail = Boolean(thumbnailSrc && thumbnailSrc !== '/services-card.webp');
              const highlights = (service.highlights || []).slice(0, 3);
              const accent = service.accent || '#FFD600';
              const gradient =
                service.gradient ||
                'linear-gradient(135deg, #FFD600 0%, #FF8C2A 48%, #111827 100%)';

              return (
                <div
                  key={service.id}
                  data-gsap-reveal="gsap"
                  className="agency-service-card group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#101010]/86 p-1 shadow-2xl shadow-black/30 backdrop-blur-2xl transition-all duration-500 hover:border-primary/35"
                  style={{
                    transitionDelay: `${Math.min(index * 25, 220)}ms`,
                    '--service-accent': accent,
                    '--service-gradient': gradient,
                  } as React.CSSProperties}
                >
                  <div className="agency-service-card-glow absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[1.55rem] bg-[#0E0E0E]">
                    <Link href={serviceHref} className="absolute inset-0 block" aria-label={`Open ${title}`}>
                      {hasCustomThumbnail ? (
                        <UploadedImage
                          src={thumbnailSrc}
                          fallbackSrc="/services-card.webp"
                          alt={title}
                          className="absolute inset-0 w-full h-full object-cover opacity-75 transition-transform duration-700 group-hover:scale-[1.04]"
                          referrerPolicy="no-referrer"
                        />
                      ) : null}
                      <div className={`agency-generated-visual absolute inset-0 ${hasCustomThumbnail ? 'opacity-0' : ''}`} />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_22%,rgba(255,255,255,0.24),transparent_24%),linear-gradient(to_top,rgba(0,0,0,0.82),rgba(0,0,0,0.10)_58%,rgba(255,255,255,0.08))]" />
                      <div className="absolute right-5 top-5 text-6xl font-black text-white/[0.08] md:text-7xl">
                        {getInitials(title)}
                      </div>
                      <div className="absolute left-5 top-5 grid h-14 w-14 place-items-center rounded-2xl border border-white/18 bg-black/35 shadow-2xl shadow-black/40 backdrop-blur-xl">
                        {renderServiceIcon(service, 'h-7 w-7', { color: accent })}
                      </div>
                      <div className="absolute bottom-5 left-5 right-5">
                        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[8px] font-black uppercase tracking-widest text-white/70 backdrop-blur-xl">
                          <BadgeCheck className="h-3 w-3" style={{ color: accent }} />
                          {service.badge || 'Premium Service'}
                        </div>
                        <h3 className="max-w-[16rem] text-2xl font-black uppercase leading-[0.92] text-white drop-shadow-2xl">
                          {title}
                        </h3>
                      </div>
                    </Link>
                  </div>

                  <div className="relative p-5 md:p-6 flex flex-col flex-1">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[8px] font-black uppercase tracking-widest text-brand-text/48">
                        {service.category || 'Agency'}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-brand-text/38">
                        <Clock className="h-3 w-3" style={{ color: accent }} />
                        {service.delivery || 'Custom'}
                      </span>
                    </div>

                    <Link href={serviceHref} className="block">
                      <h3 className="text-xl md:text-2xl font-black text-brand-text leading-tight mb-3 group-hover:text-primary transition-colors break-words line-clamp-2 min-h-[2.35em]">
                        {title}
                      </h3>
                    </Link>

                    <p className="text-brand-text/48 text-xs md:text-sm font-medium leading-relaxed mb-5 line-clamp-3 min-h-[4.2em]">
                      {service.description || 'Contact us for this service.'}
                    </p>

                    {highlights.length ? (
                      <div className="mb-5 grid gap-2">
                        {highlights.map((highlight) => (
                          <div key={highlight} className="flex items-center gap-2 text-[10px] font-bold text-brand-text/55">
                            <Zap className="h-3.5 w-3.5 shrink-0" style={{ color: accent }} />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {Array.isArray(service.tags) && service.tags.length ? (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {service.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="text-[9px] font-black tracking-widest text-brand-text/45 border border-white/10 bg-white/[0.025] px-2 py-1 rounded-md flex items-center gap-1 break-words">
                            <Tag className="w-3 h-3 text-primary" /> {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-auto flex flex-col gap-4">
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3 h-3 text-brand-text/25" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-brand-text/25">Premium Scope</span>
                        </div>
                        <Link href={serviceHref} className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                          View Details
                        </Link>
                      </div>

                      <button
                        onClick={() => {
                          const url = buildWhatsappUrl(title);
                          if (url && url !== '#') {
                            window.open(url, '_blank', 'noopener,noreferrer');
                          }
                        }}
                        className="w-full bg-primary text-black py-3.5 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-xl group/btn border-b-4 border-secondary"
                      >
                        <span>Request Service</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
