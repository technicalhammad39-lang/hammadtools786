import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/server/firebase-admin';
import { requireStaff } from '@/lib/server/auth';
import { ApiError, jsonError } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function toISOStringSafe(value: any) {
  if (!value) return null;
  if (typeof value?.toDate === 'function') {
    const date = value.toDate();
    return date instanceof Date && !Number.isNaN(date.getTime()) ? date.toISOString() : null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export async function GET(request: Request) {
  try {
    await requireStaff(request);
    const snapshot = await adminDb
      .collection('project_inquiries')
      .orderBy('createdAt', 'desc')
      .limit(1000)
      .get();

    const inquiries = snapshot.docs.map((doc) => {
      const data = doc.data() as Record<string, any>;
      return {
        id: doc.id,
        name: typeof data.name === 'string' ? data.name : '',
        email: typeof data.email === 'string' ? data.email : '',
        phone: typeof data.phone === 'string' ? data.phone : '',
        company: typeof data.company === 'string' ? data.company : '',
        selectedService: typeof data.selectedService === 'string' ? data.selectedService : '',
        budget: typeof data.budget === 'string' ? data.budget : '',
        message: typeof data.message === 'string' ? data.message : '',
        status: typeof data.status === 'string' ? data.status : 'new',
        source: typeof data.source === 'string' ? data.source : 'services_page',
        pagePath: typeof data.pagePath === 'string' ? data.pagePath : '',
        createdAt: toISOStringSafe(data.createdAt),
        updatedAt: toISOStringSafe(data.updatedAt),
      };
    });

    return NextResponse.json({ success: true, inquiries }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof ApiError) return jsonError(error);
    const message = error instanceof Error ? error.message : String(error || 'Unknown error');
    console.error('[admin-project-inquiries] failed', { message });
    return jsonError(new ApiError(500, `Failed to load project inquiries: ${message}`));
  }
}

