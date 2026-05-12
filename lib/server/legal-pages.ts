import {
  type LegalPageKey,
  LEGAL_PAGE_DEFINITIONS,
  normalizeLegalPageContent,
} from '@/lib/legal-pages';
import { adminDb } from '@/lib/server/firebase-admin';

export async function getLegalPageContent(key: LegalPageKey) {
  try {
    const snapshot = await adminDb.collection('site_pages').doc(key).get();
    if (!snapshot.exists) {
      return LEGAL_PAGE_DEFINITIONS[key];
    }
    return normalizeLegalPageContent(key, snapshot.data() || {});
  } catch (error) {
    console.error(`[legal-pages] failed to fetch ${key}`, error);
    return LEGAL_PAGE_DEFINITIONS[key];
  }
}
