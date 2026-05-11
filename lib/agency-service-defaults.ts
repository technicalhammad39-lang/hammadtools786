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

export function enrichAgencyService<T extends AgencyServiceInput>(service: T): T & AgencyServiceProfile {
  const profile = buildGenericProfile(service);
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

