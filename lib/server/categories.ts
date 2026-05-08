import { resolveImageSource } from '@/lib/image-display';
import { adminDb } from '@/lib/server/firebase-admin';
import { toSlugFromTitle } from '@/lib/seo';
import type { Category, ProductItem } from '@/lib/types/domain';

type Dictionary = Record<string, unknown>;

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

export interface ToolCategoryDocument extends Category {
  createdAt: Date | null;
  updatedAt: Date | null;
}

export function normalizeToolCategorySlug(value: string) {
  return toSlugFromTitle(value || '');
}

export function normalizeToolCategoryDocument(input: unknown, id = ''): ToolCategoryDocument {
  const data = asDictionary(input);
  const name = readString(data.name) || 'Uncategorized';
  const slug =
    normalizeToolCategorySlug(readString(data.slug)) ||
    normalizeToolCategorySlug(name) ||
    id;

  return {
    id,
    name,
    slug,
    type: (readString(data.type) as Category['type']) || 'tools',
    iconUrl: readString(data.iconUrl),
    imageUrl: resolveImageSource(data, {
      mediaPaths: ['imageMedia'],
      stringPaths: ['imageUrl'],
    }),
    imageMedia:
      data.imageMedia && typeof data.imageMedia === 'object' && !Array.isArray(data.imageMedia)
        ? (data.imageMedia as Category['imageMedia'])
        : null,
    active: data.active !== false,
    sortOrder: Number(data.sortOrder || 0),
    createdAt: readDate(data.createdAt),
    updatedAt: readDate(data.updatedAt),
  };
}

function sortCategories(categories: ToolCategoryDocument[]) {
  return [...categories].sort((left, right) => {
    const sortDelta = Number(left.sortOrder || 0) - Number(right.sortOrder || 0);
    if (sortDelta !== 0) {
      return sortDelta;
    }
    return left.name.localeCompare(right.name);
  });
}

export async function getPublishedToolCategories(): Promise<ToolCategoryDocument[]> {
  try {
    const snapshot = await adminDb.collection('categories').get();
    const categories = snapshot.docs
      .map((doc) => normalizeToolCategoryDocument(doc.data(), doc.id))
      .filter((category) => category.active !== false && (category.type === 'tools' || category.type === 'both'))
      .filter((category) => Boolean(category.slug));

    return sortCategories(categories);
  } catch (error) {
    console.error('Failed to fetch tool categories:', error);
    return [];
  }
}

export async function getToolCategoryBySlug(slug: string): Promise<ToolCategoryDocument | null> {
  const normalizedSlug = normalizeToolCategorySlug(decodeURIComponent(slug || ''));
  if (!normalizedSlug) {
    return null;
  }

  try {
    const directSnapshot = await adminDb
      .collection('categories')
      .where('slug', '==', normalizedSlug)
      .limit(1)
      .get();

    if (!directSnapshot.empty) {
      const category = normalizeToolCategoryDocument(
        directSnapshot.docs[0].data(),
        directSnapshot.docs[0].id
      );
      if (category.active !== false && (category.type === 'tools' || category.type === 'both')) {
        return category;
      }
    }
  } catch (error) {
    console.error('Failed to fetch tool category by slug:', error);
  }

  const categories = await getPublishedToolCategories();
  return categories.find((category) => category.slug === normalizedSlug) || null;
}

export async function getToolsForCategory(categoryId: string, limitCount = 12): Promise<ProductItem[]> {
  const normalizedCategoryId = String(categoryId || '').trim();
  if (!normalizedCategoryId) {
    return [];
  }

  try {
    const snapshot = await adminDb
      .collection('services')
      .where('categoryId', '==', normalizedCategoryId)
      .limit(Math.max(1, limitCount))
      .get();

    return snapshot.docs
      .map((doc) => ({ id: doc.id, ...(doc.data() as Omit<ProductItem, 'id'>) }))
      .filter((service) => (service.type || 'tools') === 'tools' && service.active !== false);
  } catch (error) {
    console.error('Failed to fetch tools for category:', error);
    return [];
  }
}
