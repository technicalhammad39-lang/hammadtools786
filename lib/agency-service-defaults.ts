export const DIGITAL_SERVICE_CATEGORIES = [
  'Online Presence',
  'Business Automation',
  'Creative Branding',
] as const;

export type DigitalServiceCategory = (typeof DIGITAL_SERVICE_CATEGORIES)[number];

export interface AgencyServiceProfile {
  id: string;
  title: string;
  slug: string;
  category: DigitalServiceCategory | string;
  shortDescription: string;
  fullDescription: string;
  description: string;
  bulletPoints: string[];
  icon: string;
  image?: string;
  thumbnail: string;
  status: 'active' | 'inactive';
  active: boolean;
  featured: boolean;
  displayOrder: number;
  metaTitle: string;
  metaDescription: string;
  tags: string[];
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
  active?: boolean;
};

export function slugifyAgencyService(value: string) {
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

function normalizeStatus(input: AgencyServiceInput): 'active' | 'inactive' {
  const raw = typeof input.status === 'string' ? input.status.toLowerCase().trim() : '';
  if (raw === 'inactive' || input.active === false) {
    return 'inactive';
  }
  return 'active';
}

const defaultProcess = ['Discovery', 'Strategy', 'Design', 'Development', 'Testing', 'Launch & Support'];

export const DEFAULT_AGENCY_SERVICES: AgencyServiceProfile[] = [
  {
    id: 'default-web-development',
    title: 'Web Development',
    slug: 'web-development',
    category: 'Online Presence',
    shortDescription: 'Fast, responsive and SEO-friendly websites built for business growth.',
    fullDescription:
      'We create fast, modern and conversion-focused websites that help your business look professional, communicate clearly and convert more visitors into customers.',
    description: 'Fast, responsive and SEO-friendly websites built for business growth.',
    bulletPoints: ['Business websites', 'Landing pages', 'WordPress websites', 'Custom websites', 'SEO-ready structure'],
    icon: 'code',
    thumbnail: '/services-card.webp',
    status: 'active',
    active: true,
    featured: true,
    displayOrder: 10,
    metaTitle: 'Web Development Services | Hammad Tools',
    metaDescription: 'Fast, responsive and SEO-friendly website development services for business growth.',
    tags: ['Websites', 'Landing Pages', 'SEO'],
    badge: 'Online Presence',
    delivery: '5-10 Days',
    accent: '#FFD600',
    gradient: 'linear-gradient(135deg, #FFD600 0%, #FF8C2A 46%, #4F46E5 100%)',
    highlights: ['Fast performance', 'Mobile-first layout', 'SEO-ready structure', 'Conversion sections'],
    features: ['Business websites', 'Landing pages', 'WordPress websites', 'Custom websites', 'SEO-ready structure'],
    process: defaultProcess,
    deliverables: ['Responsive website', 'SEO-ready pages', 'Contact flow', 'Launch support'],
  },
  {
    id: 'default-app-development',
    title: 'App Development',
    slug: 'app-development',
    category: 'Business Automation',
    shortDescription: 'User-friendly mobile apps with smooth design and scalable backend systems.',
    fullDescription:
      'We build mobile app experiences with clean UX, reliable backend systems and features designed around your customers, staff and business workflow.',
    description: 'User-friendly mobile apps with smooth design and scalable backend systems.',
    bulletPoints: ['Android apps', 'iOS apps', 'Hybrid apps', 'Booking apps', 'Customer portals'],
    icon: 'smartphone',
    thumbnail: '/services-card.webp',
    status: 'active',
    active: true,
    featured: true,
    displayOrder: 20,
    metaTitle: 'App Development Services | Hammad Tools',
    metaDescription: 'Android, iOS and hybrid app development services with scalable backend systems.',
    tags: ['Android', 'iOS', 'Hybrid Apps'],
    badge: 'App Systems',
    delivery: 'Custom Timeline',
    accent: '#38BDF8',
    gradient: 'linear-gradient(135deg, #38BDF8 0%, #4F46E5 52%, #FFD600 100%)',
    highlights: ['Smooth UX', 'Scalable backend', 'Customer portals', 'Booking flows'],
    features: ['Android apps', 'iOS apps', 'Hybrid apps', 'Booking apps', 'Customer portals'],
    process: defaultProcess,
    deliverables: ['Mobile app flow', 'Backend setup', 'User screens', 'Testing support'],
  },
  {
    id: 'default-shopify-store-development',
    title: 'Shopify Store Development',
    slug: 'shopify-store-development',
    category: 'Online Presence',
    shortDescription: 'Professional Shopify stores designed for trust, sales and easy product management.',
    fullDescription:
      'We design and set up Shopify stores that look premium, load fast, make products easy to manage and guide customers smoothly toward checkout.',
    description: 'Professional Shopify stores designed for trust, sales and easy product management.',
    bulletPoints: ['Shopify setup', 'Theme customization', 'Product pages', 'Payment setup', 'Speed optimization'],
    icon: 'shopping-bag',
    thumbnail: '/services-card.webp',
    status: 'active',
    active: true,
    featured: true,
    displayOrder: 30,
    metaTitle: 'Shopify Store Development | Hammad Tools',
    metaDescription: 'Professional Shopify store setup, theme customization, product pages and speed optimization.',
    tags: ['Shopify', 'Ecommerce', 'Store Setup'],
    badge: 'Sales Store',
    delivery: '7-14 Days',
    accent: '#22C55E',
    gradient: 'linear-gradient(135deg, #22C55E 0%, #0EA5E9 48%, #FFD600 100%)',
    highlights: ['Store setup', 'Product pages', 'Payment setup', 'Speed optimization'],
    features: ['Shopify setup', 'Theme customization', 'Product pages', 'Payment setup', 'Speed optimization'],
    process: defaultProcess,
    deliverables: ['Shopify store', 'Product layout', 'Checkout setup', 'Launch checklist'],
  },
  {
    id: 'default-woocommerce-development',
    title: 'WooCommerce Development',
    slug: 'woocommerce-development',
    category: 'Online Presence',
    shortDescription: 'Flexible WooCommerce stores with full control, custom design and smooth checkout.',
    fullDescription:
      'We build WooCommerce stores with custom structure, product management, secure checkout and flexible control for businesses that prefer WordPress commerce.',
    description: 'Flexible WooCommerce stores with full control, custom design and smooth checkout.',
    bulletPoints: ['WooCommerce setup', 'Product listing', 'Cart and checkout', 'Payment integration', 'Order management'],
    icon: 'store',
    thumbnail: '/services-card.webp',
    status: 'active',
    active: true,
    featured: false,
    displayOrder: 40,
    metaTitle: 'WooCommerce Development Services | Hammad Tools',
    metaDescription: 'WooCommerce setup, product listing, cart, checkout, payment integration and order management.',
    tags: ['WooCommerce', 'WordPress', 'Checkout'],
    badge: 'Commerce Flow',
    delivery: '7-14 Days',
    accent: '#A855F7',
    gradient: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 48%, #FFD600 100%)',
    highlights: ['Product listing', 'Smooth checkout', 'Payment integration', 'Order management'],
    features: ['WooCommerce setup', 'Product listing', 'Cart and checkout', 'Payment integration', 'Order management'],
    process: defaultProcess,
    deliverables: ['WooCommerce store', 'Product setup', 'Checkout flow', 'Order management'],
  },
  {
    id: 'default-ai-development',
    title: 'AI Development',
    slug: 'ai-development',
    category: 'Business Automation',
    shortDescription: 'Smart AI-powered tools that automate tasks, improve support and save time.',
    fullDescription:
      'We create AI chatbots, assistants, website widgets and workflow automations that reduce manual work, improve support and speed up business operations.',
    description: 'Smart AI-powered tools that automate tasks, improve support and save time.',
    bulletPoints: ['AI chatbots', 'AI website widgets', 'AI automation', 'AI assistants', 'Business workflows'],
    icon: 'bot',
    thumbnail: '/services-card.webp',
    status: 'active',
    active: true,
    featured: true,
    displayOrder: 50,
    metaTitle: 'AI Development Services | Hammad Tools',
    metaDescription: 'AI chatbots, AI widgets, automation tools, assistants and custom AI business workflows.',
    tags: ['AI Chatbots', 'Automation', 'Assistants'],
    badge: 'AI Automation',
    delivery: 'Custom Timeline',
    accent: '#FACC15',
    gradient: 'linear-gradient(135deg, #FACC15 0%, #F97316 42%, #111827 100%)',
    highlights: ['AI chatbots', 'Workflow automation', 'Support assistants', 'Smart widgets'],
    features: ['AI chatbots', 'AI website widgets', 'AI automation', 'AI assistants', 'Business workflows'],
    process: defaultProcess,
    deliverables: ['AI workflow', 'Chatbot/widget', 'Automation logic', 'Testing support'],
  },
  {
    id: 'default-software-development',
    title: 'Software Development',
    slug: 'software-development',
    category: 'Business Automation',
    shortDescription: 'Custom software built around your real business process and operations.',
    fullDescription:
      'We build business software that fits your actual operations, from CRM and inventory to billing, employee systems and internal dashboards.',
    description: 'Custom software built around your real business process and operations.',
    bulletPoints: ['CRM systems', 'Inventory systems', 'Employee systems', 'Billing systems', 'Admin dashboards'],
    icon: 'dashboard',
    thumbnail: '/services-card.webp',
    status: 'active',
    active: true,
    featured: true,
    displayOrder: 60,
    metaTitle: 'Software Development Services | Hammad Tools',
    metaDescription: 'Custom CRM, inventory, employee, billing and admin dashboard software development.',
    tags: ['CRM', 'Dashboards', 'Operations'],
    badge: 'Business System',
    delivery: 'Custom Timeline',
    accent: '#0EA5E9',
    gradient: 'linear-gradient(135deg, #0EA5E9 0%, #2563EB 46%, #FFD600 100%)',
    highlights: ['CRM systems', 'Inventory systems', 'Billing systems', 'Admin dashboards'],
    features: ['CRM systems', 'Inventory systems', 'Employee systems', 'Billing systems', 'Admin dashboards'],
    process: defaultProcess,
    deliverables: ['Software dashboard', 'Business modules', 'User roles', 'Testing support'],
  },
  {
    id: 'default-saas-development',
    title: 'SaaS Development',
    slug: 'saas-development',
    category: 'Business Automation',
    shortDescription: 'Subscription-based SaaS platforms with dashboards, payments and scalable features.',
    fullDescription:
      'We build SaaS platforms with user accounts, admin panels, subscription plans, payments and analytics so you can launch a scalable digital product.',
    description: 'Subscription-based SaaS platforms with dashboards, payments and scalable features.',
    bulletPoints: ['User accounts', 'Admin panels', 'Subscription plans', 'Stripe/payment integration', 'Analytics dashboard'],
    icon: 'layers',
    thumbnail: '/services-card.webp',
    status: 'active',
    active: true,
    featured: true,
    displayOrder: 70,
    metaTitle: 'SaaS Development Services | Hammad Tools',
    metaDescription: 'SaaS platform development with accounts, admin panels, subscriptions, payments and analytics.',
    tags: ['SaaS', 'Subscriptions', 'Payments'],
    badge: 'Scalable Product',
    delivery: 'Custom Timeline',
    accent: '#14B8A6',
    gradient: 'linear-gradient(135deg, #14B8A6 0%, #0EA5E9 48%, #FFD600 100%)',
    highlights: ['User accounts', 'Subscription plans', 'Payment integration', 'Analytics dashboard'],
    features: ['User accounts', 'Admin panels', 'Subscription plans', 'Stripe/payment integration', 'Analytics dashboard'],
    process: defaultProcess,
    deliverables: ['SaaS platform', 'Admin panel', 'Subscription setup', 'Analytics dashboard'],
  },
  {
    id: 'default-graphic-design',
    title: 'Graphic Design',
    slug: 'graphic-design',
    category: 'Creative Branding',
    shortDescription: 'Creative visuals that make your brand look professional, consistent and memorable.',
    fullDescription:
      'We design social media posts, banners, ads, flyers, business cards and campaign graphics that keep your brand premium and recognizable.',
    description: 'Creative visuals that make your brand look professional, consistent and memorable.',
    bulletPoints: ['Social media posts', 'Banners', 'Ads', 'Flyers', 'Business cards'],
    icon: 'palette',
    thumbnail: '/services-card.webp',
    status: 'active',
    active: true,
    featured: false,
    displayOrder: 80,
    metaTitle: 'Graphic Design Services | Hammad Tools',
    metaDescription: 'Professional social posts, banners, ads, flyers and business card design services.',
    tags: ['Social Posts', 'Banners', 'Ads'],
    badge: 'Creative Design',
    delivery: '2-5 Days',
    accent: '#FF8C2A',
    gradient: 'linear-gradient(135deg, #FF8C2A 0%, #FF3D81 48%, #FFD600 100%)',
    highlights: ['Social posts', 'Banners', 'Ads', 'Business cards'],
    features: ['Social media posts', 'Banners', 'Ads', 'Flyers', 'Business cards'],
    process: defaultProcess,
    deliverables: ['Design assets', 'Web-ready exports', 'Social sizes', 'Revision support'],
  },
  {
    id: 'default-logo-design',
    title: 'Logo Design',
    slug: 'logo-design',
    category: 'Creative Branding',
    shortDescription: 'Unique and professional logos that create a strong first impression.',
    fullDescription:
      'We create minimal, modern and typography-based logos with brand marks and identity kits that give your business a memorable visual foundation.',
    description: 'Unique and professional logos that create a strong first impression.',
    bulletPoints: ['Minimal logos', 'Modern logos', 'Typography logos', 'Brand marks', 'Brand identity kits'],
    icon: 'badge',
    thumbnail: '/services-card.webp',
    status: 'active',
    active: true,
    featured: false,
    displayOrder: 90,
    metaTitle: 'Logo Design Services | Hammad Tools',
    metaDescription: 'Unique minimal, modern, typography and brand mark logo design services.',
    tags: ['Logo', 'Brand Mark', 'Identity Kit'],
    badge: 'Identity System',
    delivery: '3-7 Days',
    accent: '#F43F5E',
    gradient: 'linear-gradient(135deg, #F43F5E 0%, #A855F7 48%, #FFD600 100%)',
    highlights: ['Minimal logos', 'Modern logos', 'Typography logos', 'Brand identity kits'],
    features: ['Minimal logos', 'Modern logos', 'Typography logos', 'Brand marks', 'Brand identity kits'],
    process: defaultProcess,
    deliverables: ['Logo concepts', 'Final logo files', 'Brand marks', 'Identity notes'],
  },
];

const DEFAULT_PROFILE_BY_SLUG = new Map(
  DEFAULT_AGENCY_SERVICES.map((service) => [service.slug, service])
);

function buildGenericProfile(input: AgencyServiceInput): AgencyServiceProfile {
  const title = (input.title || 'Digital Service').replace(/\s+/g, ' ').trim();
  const slug = slugifyAgencyService(input.slug || title) || input.id || 'digital-service';
  const bulletPoints = cleanArray(input.bulletPoints).length
    ? cleanArray(input.bulletPoints)
    : cleanArray(input.features).length
      ? cleanArray(input.features)
      : cleanArray(input.tags).length
        ? cleanArray(input.tags)
        : ['Custom scope', 'Professional execution', 'Quality handover'];
  const shortDescription = input.shortDescription || input.description || 'Professional digital service built around your business goals.';
  const status = normalizeStatus(input);

  return {
    id: input.id || slug,
    title,
    slug,
    category: input.category || 'Online Presence',
    shortDescription,
    fullDescription: input.fullDescription || input.description || shortDescription,
    description: input.description || shortDescription,
    bulletPoints,
    icon: input.icon || 'sparkles',
    image: input.image,
    thumbnail: input.thumbnail || input.image || '/services-card.webp',
    status,
    active: status === 'active',
    featured: Boolean(input.featured),
    displayOrder: Number.isFinite(Number(input.displayOrder)) ? Number(input.displayOrder) : 999,
    metaTitle: input.metaTitle || `${title} | Hammad Tools`,
    metaDescription: input.metaDescription || shortDescription,
    tags: cleanArray(input.tags).length ? cleanArray(input.tags) : bulletPoints.slice(0, 4),
    badge: input.badge || 'Digital Solution',
    delivery: input.delivery || 'Custom Timeline',
    accent: input.accent || '#FFD600',
    gradient: input.gradient || 'linear-gradient(135deg, #FFD600 0%, #FF8C2A 48%, #1F2937 100%)',
    highlights: cleanArray(input.highlights).length ? cleanArray(input.highlights) : bulletPoints.slice(0, 4),
    features: cleanArray(input.features).length ? cleanArray(input.features) : bulletPoints,
    process: cleanArray(input.process).length ? cleanArray(input.process) : defaultProcess,
    deliverables: cleanArray(input.deliverables).length ? cleanArray(input.deliverables) : ['Strategy', 'Design/Build', 'Testing', 'Launch support'],
  };
}

export function getAgencyServiceProfile(input: AgencyServiceInput) {
  const slug = slugifyAgencyService(input.slug || input.title || input.id || '');
  return DEFAULT_PROFILE_BY_SLUG.get(slug) || null;
}

export function enrichAgencyService<T extends AgencyServiceInput>(service: T): T & AgencyServiceProfile {
  const profile = getAgencyServiceProfile(service) || buildGenericProfile(service);
  const serviceTitle = service.title ? service.title.replace(/\s+/g, ' ').trim() : '';
  const status = normalizeStatus(service);
  const bulletPoints = cleanArray(service.bulletPoints).length
    ? cleanArray(service.bulletPoints)
    : cleanArray(service.features).length
      ? cleanArray(service.features)
      : profile.bulletPoints;
  const shortDescription = service.shortDescription || service.description || profile.shortDescription;
  const fullDescription = service.fullDescription || service.description || profile.fullDescription;

  return {
    ...profile,
    ...service,
    id: service.id || profile.id,
    title: serviceTitle || profile.title,
    slug: slugifyAgencyService(service.slug || profile.slug || serviceTitle || profile.title) || profile.slug,
    category: service.category || profile.category,
    shortDescription,
    fullDescription,
    description: service.description || shortDescription,
    bulletPoints,
    icon: service.icon || profile.icon,
    image: service.image || profile.image,
    thumbnail: service.thumbnail || service.image || profile.thumbnail,
    status,
    active: status === 'active',
    featured: service.featured ?? profile.featured,
    displayOrder: Number.isFinite(Number(service.displayOrder)) ? Number(service.displayOrder) : profile.displayOrder,
    metaTitle: service.metaTitle || profile.metaTitle,
    metaDescription: service.metaDescription || profile.metaDescription,
    tags: cleanArray(service.tags).length ? cleanArray(service.tags) : profile.tags,
    badge: service.badge || profile.badge,
    delivery: service.delivery || profile.delivery,
    accent: service.accent || profile.accent,
    gradient: service.gradient || profile.gradient,
    highlights: cleanArray(service.highlights).length ? cleanArray(service.highlights) : profile.highlights,
    features: cleanArray(service.features).length ? cleanArray(service.features) : bulletPoints,
    process: cleanArray(service.process).length ? cleanArray(service.process) : profile.process,
    deliverables: cleanArray(service.deliverables).length ? cleanArray(service.deliverables) : profile.deliverables,
  };
}

export function mergeAgencyServicesWithDefaults<T extends AgencyServiceInput>(
  services: T[]
): Array<T & AgencyServiceProfile> {
  const activeServices = services.filter((service) => normalizeStatus(service) === 'active');
  const enriched = activeServices.map((service) => enrichAgencyService(service));
  const existingSlugs = new Set(enriched.map((service) => slugifyAgencyService(service.slug || service.title)));
  const missingDefaults = DEFAULT_AGENCY_SERVICES
    .filter((service) => !existingSlugs.has(service.slug) && service.status === 'active')
    .map((service) => enrichAgencyService(service as T & AgencyServiceProfile));

  return [...enriched, ...missingDefaults].sort(
    (a, b) => Number(a.displayOrder || 999) - Number(b.displayOrder || 999)
  );
}

