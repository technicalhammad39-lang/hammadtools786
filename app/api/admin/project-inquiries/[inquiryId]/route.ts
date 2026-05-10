import { NextResponse } from 'next/server';
import { adminDb, adminFieldValue } from '@/lib/server/firebase-admin';
import { requireStaff } from '@/lib/server/auth';
import { ApiError, jsonError } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteParams = { inquiryId: string };

function cleanStatus(value: unknown) {
  const status = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (status === 'new' || status === 'contacted' || status === 'closed' || status === 'archived') {
    return status;
  }
  return '';
}

export async function PATCH(request: Request, { params }: { params: Promise<RouteParams> }) {
  try {
    await requireStaff(request);
    const { inquiryId } = await params;
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const status = cleanStatus(body.status);
    if (!status) {
      throw new ApiError(400, 'Invalid inquiry status.');
    }

    await adminDb.collection('project_inquiries').doc(inquiryId).set(
      {
        status,
        updatedAt: adminFieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof ApiError) return jsonError(error);
    const message = error instanceof Error ? error.message : String(error || 'Unknown error');
    console.error('[admin-project-inquiry-update] failed', { message });
    return jsonError(new ApiError(500, `Failed to update inquiry: ${message}`));
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<RouteParams> }) {
  try {
    await requireStaff(request);
    const { inquiryId } = await params;
    await adminDb.collection('project_inquiries').doc(inquiryId).delete();
    return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof ApiError) return jsonError(error);
    const message = error instanceof Error ? error.message : String(error || 'Unknown error');
    console.error('[admin-project-inquiry-delete] failed', { message });
    return jsonError(new ApiError(500, `Failed to delete inquiry: ${message}`));
  }
}

