import { NextResponse } from 'next/server';
import { getPublishedAgencyServices } from '@/lib/server/agency-services';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const services = await getPublishedAgencyServices();
    return NextResponse.json(
      {
        success: true,
        services,
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error || 'Unknown error');
    console.error('[digital-services] failed', { message });
    return NextResponse.json(
      {
        success: false,
        services: [],
        error: 'Failed to load digital services.',
      },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

