export interface AgencyServiceProfile {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  tags: string[];
  category: string;
  badge: string;
  delivery: string;
  accent: string;
  gradient: string;
  highlights: string[];
  features: string[];
  process: string[];
  deliverables: string[];
}

type AgencyServiceInput = Partial<AgencyServiceProfile> & {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  thumbnail?: string;
  tags?: string[];
};

function slugify(value: string) {
  return (value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function cleanArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((entry) => (typeof entry === 'string' ? entry.trim() : '')).filter(Boolean);
}

export const DEFAULT_AGENCY_SERVICES: AgencyServiceProfile[] = [
  {
    id: 'default-web-development',
    title: 'Website Development',
    slug: 'website-development',
    category: 'Web Development',
    badge: 'Launch Ready',
    delivery: '5-10 Days',
    accent: '#FFD600',
    gradient: 'linear-gradient(135deg, #FFD600 0%, #FF8C2A 46%, #4F46E5 100%)',
    thumbnail: '/services-card.webp',
    description:
      'Premium business websites, landing pages, dashboards, and SEO-ready web apps built with clean UI, fast loading, mobile responsiveness, and production deployment support.',
    tags: ['Next.js', 'Business Website', 'Landing Page', 'SEO Ready'],
    highlights: ['Fast performance', 'Mobile-first layout', 'SEO setup', 'Hostinger deployment'],
    features: [
      'Custom homepage, service pages, contact flow, and conversion sections',
      'Responsive UI for mobile, tablet, and desktop screens',
      'SEO metadata, sitemap-ready structure, and optimized page content',
      'Performance-focused build with compressed assets and clean code',
      'Hostinger-ready deployment guidance and launch support',
      'Admin-friendly content structure where required',
    ],
    process: ['Strategy and page map', 'Premium UI direction', 'Development and QA', 'Launch handover'],
    deliverables: ['Production website', 'Responsive pages', 'SEO basics', 'Deployment support'],
  },
  {
    id: 'default-graphic-design',
    title: 'Graphic Design',
    slug: 'graphic-design',
    category: 'Creative Design',
    badge: 'Brand Assets',
    delivery: '2-5 Days',
    accent: '#FF8C2A',
    gradient: 'linear-gradient(135deg, #FF8C2A 0%, #FF3D81 48%, #FFD600 100%)',
    thumbnail: '/services-card.webp',
    description:
      'Professional posters, social media creatives, thumbnails, banners, ads, and promotional designs crafted for clean branding and stronger visual engagement.',
    tags: ['Social Posts', 'Banners', 'Thumbnails', 'Ads'],
    highlights: ['Modern layouts', 'Brand-matched colors', 'High-res exports', 'Fast revisions'],
    features: [
      'Premium social media posts, story graphics, banners, and thumbnails',
      'Clean composition with brand-matched typography and colors',
      'Campaign-ready creatives for offers, launches, and promotions',
      'Export-ready files for Instagram, Facebook, YouTube, and websites',
      'Consistent visual direction across multiple creative formats',
      'Revision support based on the selected project scope',
    ],
    process: ['Creative brief', 'Style direction', 'Design production', 'Final export'],
    deliverables: ['Design files', 'Web-ready exports', 'Social sizes', 'Revision support'],
  },
  {
    id: 'default-ui-ux-design',
    title: 'UI/UX Design',
    slug: 'ui-ux-design',
    category: 'Product Design',
    badge: 'Premium UX',
    delivery: '4-8 Days',
    accent: '#38BDF8',
    gradient: 'linear-gradient(135deg, #38BDF8 0%, #4F46E5 52%, #FFD600 100%)',
    thumbnail: '/services-card.webp',
    description:
      'High-end app and website interfaces designed with polished layouts, strong hierarchy, smooth user journeys, and conversion-focused screen structures.',
    tags: ['App UI', 'Website UI', 'Wireframes', 'Design System'],
    highlights: ['Conversion flow', 'Design system', 'Clean hierarchy', 'Developer-ready UI'],
    features: [
      'Premium landing page, dashboard, app, and website screen designs',
      'User journey planning with clear page sections and action paths',
      'Modern typography, spacing, component systems, and color direction',
      'Desktop and mobile responsive design planning',
      'Developer-friendly structure with reusable sections and states',
      'Interactive polish recommendations for a premium product feel',
    ],
    process: ['UX audit', 'Wireframe direction', 'Visual design', 'Developer handoff'],
    deliverables: ['Screen designs', 'Component direction', 'Responsive layout', 'UX notes'],
  },
  {
    id: 'default-ecommerce-store',
    title: 'E-commerce Store Setup',
    slug: 'ecommerce-store-setup',
    category: 'Online Store',
    badge: 'Sales System',
    delivery: '7-14 Days',
    accent: '#22C55E',
    gradient: 'linear-gradient(135deg, #22C55E 0%, #0EA5E9 48%, #FFD600 100%)',
    thumbnail: '/services-card.webp',
    description:
      'Complete online store setup with product pages, checkout flow, payment guidance, product presentation, speed basics, and a clean shopping experience.',
    tags: ['Store Setup', 'Products', 'Checkout', 'Sales'],
    highlights: ['Product catalog', 'Checkout flow', 'Mobile store', 'Launch support'],
    features: [
      'Professional store homepage, product catalog, and product detail structure',
      'Clean checkout journey planning for simple customer ordering',
      'Product image and content presentation for better trust',
      'Mobile-friendly storefront layout and speed-focused structure',
      'Basic SEO setup for categories and product pages',
      'Launch support with store flow testing and handover notes',
    ],
    process: ['Store plan', 'Product structure', 'UI setup', 'Checkout testing'],
    deliverables: ['Storefront pages', 'Product layout', 'Checkout flow', 'Launch checklist'],
  },
  {
    id: 'default-seo-growth',
    title: 'SEO & Growth Optimization',
    slug: 'seo-growth-optimization',
    category: 'Growth',
    badge: 'Search Ready',
    delivery: '3-7 Days',
    accent: '#A3E635',
    gradient: 'linear-gradient(135deg, #A3E635 0%, #22C55E 45%, #FFD600 100%)',
    thumbnail: '/services-card.webp',
    description:
      'SEO foundation, keyword mapping, page metadata, content structure, performance checks, and growth recommendations for better discoverability.',
    tags: ['SEO', 'Keywords', 'Meta Tags', 'Growth'],
    highlights: ['Keyword map', 'Meta cleanup', 'Content structure', 'Speed checks'],
    features: [
      'SEO title and description direction for important pages',
      'Keyword mapping for services, tools, blogs, and business pages',
      'Content structure cleanup with proper headings and intent matching',
      'Technical checks for sitemap, robots, image alt text, and page speed',
      'Local and niche keyword recommendations for Pakistan-focused traffic',
      'Action plan for blogs, service pages, and conversion content',
    ],
    process: ['SEO audit', 'Keyword mapping', 'Page optimization', 'Growth roadmap'],
    deliverables: ['SEO plan', 'Meta direction', 'Keyword list', 'Optimization report'],
  },
  {
    id: 'default-social-media-marketing',
    title: 'Social Media Marketing',
    slug: 'social-media-marketing',
    category: 'Marketing',
    badge: 'Campaigns',
    delivery: 'Monthly',
    accent: '#F43F5E',
    gradient: 'linear-gradient(135deg, #F43F5E 0%, #A855F7 48%, #FFD600 100%)',
    thumbnail: '/services-card.webp',
    description:
      'Content planning, campaign creatives, captions, posting direction, and marketing strategy to build stronger brand presence across social platforms.',
    tags: ['Marketing', 'Content Plan', 'Campaigns', 'Captions'],
    highlights: ['Content strategy', 'Creative direction', 'Campaign flow', 'Audience focus'],
    features: [
      'Monthly content direction for brand awareness and lead generation',
      'Creative campaign ideas for offers, launches, and promotions',
      'Caption and hook writing for better engagement',
      'Visual direction for posts, reels covers, stories, and ads',
      'Platform-specific recommendations for Facebook, Instagram, TikTok, and YouTube',
      'Performance improvement suggestions based on goals and audience',
    ],
    process: ['Goal planning', 'Content calendar', 'Creative production', 'Campaign review'],
    deliverables: ['Content plan', 'Creative ideas', 'Caption direction', 'Growth notes'],
  },
  {
    id: 'default-video-editing',
    title: 'Video Editing & Reels',
    slug: 'video-editing-reels',
    category: 'Video Production',
    badge: 'Scroll Stopper',
    delivery: '2-6 Days',
    accent: '#F97316',
    gradient: 'linear-gradient(135deg, #F97316 0%, #EF4444 46%, #FFD600 100%)',
    thumbnail: '/services-card.webp',
    description:
      'Short-form reels, promotional videos, YouTube edits, captions, motion text, clean cuts, and export-ready content for stronger viewer retention.',
    tags: ['Reels', 'YouTube', 'Captions', 'Promos'],
    highlights: ['Clean cuts', 'Caption styling', 'Motion text', 'Export-ready'],
    features: [
      'Reels, shorts, ads, and promotional video editing',
      'Clean trimming, transitions, captions, motion text, and pacing',
      'Brand-matched colors, lower thirds, callouts, and CTA screens',
      'Export settings for Instagram, TikTok, YouTube Shorts, and web',
      'Retention-focused structure for hooks, value, and final CTA',
      'Revision support based on project size and selected scope',
    ],
    process: ['Footage review', 'Edit structure', 'Motion polish', 'Final export'],
    deliverables: ['Edited video', 'Captioned export', 'Platform sizes', 'Revision support'],
  },
  {
    id: 'default-brand-identity',
    title: 'Brand Identity Kit',
    slug: 'brand-identity-kit',
    category: 'Branding',
    badge: 'Identity System',
    delivery: '5-9 Days',
    accent: '#FACC15',
    gradient: 'linear-gradient(135deg, #FACC15 0%, #F97316 42%, #111827 100%)',
    thumbnail: '/services-card.webp',
    description:
      'Logo direction, color palette, typography pairing, social profile assets, and brand rules that give your business a premium, consistent look.',
    tags: ['Logo', 'Colors', 'Typography', 'Brand Kit'],
    highlights: ['Logo direction', 'Color palette', 'Typography', 'Social kit'],
    features: [
      'Brand direction with logo usage, color palette, and type pairing',
      'Premium social profile assets and cover graphics',
      'Consistent visual rules for posts, website sections, and campaigns',
      'Business-ready brand presentation for digital platforms',
      'Export guidance for web, social media, and print-friendly use',
      'Clean handover notes for future design consistency',
    ],
    process: ['Brand discovery', 'Visual direction', 'Asset design', 'Brand handover'],
    deliverables: ['Brand kit', 'Logo direction', 'Social assets', 'Usage notes'],
  },
];

const DEFAULT_PROFILE_BY_SLUG = new Map(
  DEFAULT_AGENCY_SERVICES.map((service) => [service.slug, service])
);

function buildGenericProfile(input: AgencyServiceInput): AgencyServiceProfile {
  const title = (input.title || 'Agency Service').replace(/\s+/g, ' ').trim();
  const slug = slugify(input.slug || title) || input.id || 'agency-service';

  return {
    id: input.id || slug,
    title,
    slug,
    category: input.category || 'Agency Service',
    badge: input.badge || 'Custom Scope',
    delivery: input.delivery || 'Custom Timeline',
    accent: input.accent || '#FFD600',
    gradient:
      input.gradient || 'linear-gradient(135deg, #FFD600 0%, #FF8C2A 48%, #1F2937 100%)',
    thumbnail: input.thumbnail || '/services-card.webp',
    description:
      input.description ||
      'Professional agency service with a custom scope, clean delivery process, and direct support from Hammad Tools.',
    tags: cleanArray(input.tags).length ? cleanArray(input.tags) : ['Premium Service', 'Custom Scope'],
    highlights: cleanArray(input.highlights).length
      ? cleanArray(input.highlights)
      : ['Custom strategy', 'Premium execution', 'Clean delivery', 'Direct support'],
    features: cleanArray(input.features).length
      ? cleanArray(input.features)
      : [
          'Custom scope based on your business goal',
          'Professional execution with clean communication',
          'Mobile and desktop friendly delivery where applicable',
          'Quality checks before final handover',
        ],
    process: cleanArray(input.process).length
      ? cleanArray(input.process)
      : ['Brief review', 'Execution plan', 'Production', 'Final handover'],
    deliverables: cleanArray(input.deliverables).length
      ? cleanArray(input.deliverables)
      : ['Custom deliverables', 'Project support', 'Final handover'],
  };
}

export function getAgencyServiceProfile(input: AgencyServiceInput) {
  const slug = slugify(input.slug || input.title || input.id || '');
  return DEFAULT_PROFILE_BY_SLUG.get(slug) || null;
}

export function enrichAgencyService<T extends AgencyServiceInput>(service: T): T & AgencyServiceProfile {
  const profile = getAgencyServiceProfile(service) || buildGenericProfile(service);
  const tags = cleanArray(service.tags);

  return {
    ...profile,
    ...service,
    id: service.id || profile.id,
    title: service.title || profile.title,
    slug: slugify(service.slug || profile.slug || service.title || profile.title) || profile.slug,
    description: service.description || profile.description,
    thumbnail: service.thumbnail || profile.thumbnail,
    tags: tags.length ? tags : profile.tags,
    category: service.category || profile.category,
    badge: service.badge || profile.badge,
    delivery: service.delivery || profile.delivery,
    accent: service.accent || profile.accent,
    gradient: service.gradient || profile.gradient,
    highlights: cleanArray(service.highlights).length ? cleanArray(service.highlights) : profile.highlights,
    features: cleanArray(service.features).length ? cleanArray(service.features) : profile.features,
    process: cleanArray(service.process).length ? cleanArray(service.process) : profile.process,
    deliverables: cleanArray(service.deliverables).length
      ? cleanArray(service.deliverables)
      : profile.deliverables,
  };
}

export function mergeAgencyServicesWithDefaults<T extends AgencyServiceInput>(
  services: T[]
): Array<T & AgencyServiceProfile> {
  const enriched = services.map((service) => enrichAgencyService(service));
  const existingSlugs = new Set(enriched.map((service) => slugify(service.slug || service.title)));
  const missingDefaults = DEFAULT_AGENCY_SERVICES
    .filter((service) => !existingSlugs.has(service.slug))
    .map((service) => enrichAgencyService(service as T & AgencyServiceProfile));

  return [...enriched, ...missingDefaults];
}
