import { NextResponse } from 'next/server';
import { adminDb, adminFieldValue } from '@/lib/server/firebase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

function text(value: unknown, max = 500) {
  return (typeof value === 'string' ? value.trim() : '').slice(0, max);
}

function email(value: unknown) {
  return text(value, 320).toLowerCase();
}

function validateOrigin(request: Request) {
  const origin = (request.headers.get('origin') || '').trim();
  if (!origin || origin === 'null') return true;
  const host = (request.headers.get('x-forwarded-host') || request.headers.get('host') || '').split(',')[0]?.trim() || '';
  if (!host) return true;
  try {
    const originUrl = new URL(origin);
    const originHost = originUrl.host.toLowerCase().replace(/\.$/, '');
    const currentHost = host.toLowerCase().replace(/\.$/, '');
    return originHost === currentHost || originUrl.hostname.endsWith(`.${currentHost.split(':')[0]}`);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    if (!validateOrigin(request)) {
      return NextResponse.json({ success: false, error: 'Request origin is not allowed.' }, { status: 403 });
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const payload = {
      name: text(body.name, 120),
      email: email(body.email),
      phone: text(body.phone, 80),
      company: text(body.company, 140),
      selectedService: text(body.selectedService, 160),
      budget: text(body.budget, 120),
      message: text(body.message, 4000),
      status: 'new',
      source: 'services_page',
      pagePath: text(body.pagePath, 240) || '/services',
      createdAt: adminFieldValue.serverTimestamp(),
      updatedAt: adminFieldValue.serverTimestamp(),
    };

    if (!payload.name) {
      return NextResponse.json({ success: false, error: 'Please enter your name.' }, { status: 400 });
    }
    if (!payload.email || !EMAIL_REGEX.test(payload.email)) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (!payload.phone) {
      return NextResponse.json({ success: false, error: 'Please enter your phone or WhatsApp number.' }, { status: 400 });
    }
    if (!payload.selectedService) {
      return NextResponse.json({ success: false, error: 'Please select a service.' }, { status: 400 });
    }
    if (!payload.message || payload.message.length < 10) {
      return NextResponse.json({ success: false, error: 'Please share a few project details.' }, { status: 400 });
    }

    const ref = await adminDb.collection('project_inquiries').add(payload);

    return NextResponse.json(
      {
        success: true,
        inquiryId: ref.id,
        message: 'Thanks! Your project inquiry has been received. Our team will contact you soon.',
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error || 'Unknown error');
    console.error('[project-inquiries] failed', { message });
    return NextResponse.json(
      { success: false, error: 'Inquiry submission failed. Please try again.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

