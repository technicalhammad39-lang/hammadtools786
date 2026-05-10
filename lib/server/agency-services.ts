import { resolveImageSource } from '@/lib/image-display';
import { toSlugFromTitle } from '@/lib/seo';
import type { StoredFileMetadata } from '@/lib/types/domain';
import {
  enrichAgencyService,
  mergeAgencyServicesWithDefaults,
  type AgencyServiceProfile,
} from '@/lib/agency-service-defaults';
import { adminDb } from '@/lib/server/firebase-admin';

type Dictionary = Record<string, unknown>;

export interface AgencyServiceDocument extends Partial<AgencyServiceProfile> {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  thumbnailMedia: StoredFileMetadata | null;
  tags: string[];
  shortDescription?: string;
  fullDescription?: string;
  bulletPoints?: string[];
  icon?: string;
  image?: string;
  status?: 'active' | 'inactive';
  active?: boolean;
  featured?: boolean;
  displayOrder?: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

function asDictionary(input: unknown): Dictionary {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {};
  }
  return input as Dictionary;
}

function readString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function readDate(value: unknown): Date | null {
  const candidate =
    (value as { toDate?: () => Date } | null | undefined)?.toDate?.() || value;
  if (!candidate) {
    return null;
  }
  if (candidate instanceof Date) {
    return Number.isNaN(candidate.getTime()) ? null : candidate;
  }
  if (typeof candidate === 'number' || typeof candidate === 'string') {
    const parsed = new Date(candidate);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

function readStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((entry) => readString(entry))
      .filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
  }
  return [];
}

function readBoolean(value: unknown, fallback = false) {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true' || normalized === 'active' || normalized === 'yes') {
      return true;
    }
    if (normalized === 'false' || normalized === 'inactive' || normalized === 'no') {
      return false;
    }
  }
  return fallback;
}

function readNumber(value: unknown) {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
}

function extractMedia(input: Dictionary): StoredFileMetadata | null {
  const candidate = input.thumbnailMedia;
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
    return null;
  }
  return candidate as StoredFileMetadata;
}

export function normalizeAgencyServiceSlug(value: string) {
  return toSlugFromTitle(value || '');
}

export function normalizeAgencyServiceDocument(input: unknown, id = ''): AgencyServiceDocument {
  const data = asDictionary(input);
  const title = (readString(data.title || data.name) || 'Untitled Service').replace(/\s+/g, ' ').trim();
  const slug =
    normalizeAgencyServiceSlug(readString(data.slug)) ||
    normalizeAgencyServiceSlug(title) ||
    id;

  return {
    id,
    title,
    slug,
    description: readString(data.description || data.shortDescription || data.fullDescription),
    thumbnail: resolveImageSource(data, {
      mediaPaths: ['thumbnailMedia'],
      stringPaths: ['thumbnail', 'image'],
    }),
    thumbnailMedia: extractMedia(data),
    tags: readStringArray(data.tags),
    shortDescription: readString(data.shortDescription || data.description),
    fullDescription: readString(data.fullDescription || data.description),
    bulletPoints: readStringArray(data.bulletPoints || data.features),
    icon: readString(data.icon),
    image: resolveImageSource(data, {
      mediaPaths: ['thumbnailMedia'],
      stringPaths: ['image', 'thumbnail'],
    }),
    status: readString(data.status).toLowerCase() === 'inactive' || data.active === false ? 'inactive' : 'active',
    active: readString(data.status).toLowerCase() === 'inactive' || data.active === false ? false : true,
    featured: readBoolean(data.featured),
    displayOrder: readNumber(data.displayOrder ?? data.sortOrder ?? data.orderIndex),
    metaTitle: readString(data.metaTitle),
    metaDescription: readString(data.metaDescription),
    category: readString(data.category),
    badge: readString(data.badge),
    delivery: readString(data.delivery),
    accent: readString(data.accent),
    gradient: readString(data.gradient),
    highlights: readStringArray(data.highlights),
    features: readStringArray(data.features),
    process: readStringArray(data.process),
    deliverables: readStringArray(data.deliverables),
    createdAt: readDate(data.createdAt),
    updatedAt: readDate(data.updatedAt),
  };
}

function sortNewestFirst(services: AgencyServiceDocument[]) {
  return [...services].sort((a, b) => {
    const orderDiff = Number(a.displayOrder ?? 999) - Number(b.displayOrder ?? 999);
    if (orderDiff !== 0) {
      return orderDiff;
    }
    const left = a.updatedAt || a.createdAt;
    const right = b.updatedAt || b.createdAt;
    return (right?.getTime() || 0) - (left?.getTime() || 0);
  });
}

export async function getPublishedAgencyServices(): Promise<AgencyServiceDocument[]> {
  try {
    const snapshot = await adminDb.collection('agency_services').get();
    const services = snapshot.docs
      .filter((doc) => doc.data().active !== false)
      .map((doc) => normalizeAgencyServiceDocument(doc.data(), doc.id))
      .filter((item) => Boolean(item.slug));
    return mergeAgencyServicesWithDefaults(sortNewestFirst(services));
  } catch (error) {
    console.error('Failed to fetch agency services:', error);
    return mergeAgencyServicesWithDefaults([]);
  }
}

export async function getAgencyServiceBySlug(slug: string): Promise<AgencyServiceDocument | null> {
  const normalizedSlug = normalizeAgencyServiceSlug(decodeURIComponent(slug || ''));
  if (!normalizedSlug) {
    return null;
  }

  try {
    const directSnapshot = await adminDb
      .collection('agency_services')
      .where('slug', '==', normalizedSlug)
      .limit(1)
      .get();

    if (!directSnapshot.empty) {
      const entry = normalizeAgencyServiceDocument(
        directSnapshot.docs[0].data(),
        directSnapshot.docs[0].id
      );
      return enrichAgencyService(entry);
    }
  } catch (error) {
    console.error('Failed to fetch agency service by slug:', error);
  }

  const allServices = await getPublishedAgencyServices();
  return allServices.find((service) => service.slug === normalizedSlug) || null;
}
