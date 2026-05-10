import { readFile, stat } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

type RouteParams = {
  segments?: string[];
};

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');
const FALLBACK_IMAGE = path.join(PUBLIC_DIR, 'services-card.webp');

const MIME_TYPES: Record<string, string> = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

function resolveUploadPath(segments: string[] = []) {
  if (!segments.length || segments.some((segment) => !segment || segment === '..')) {
    return null;
  }

  const resolved = path.resolve(UPLOADS_DIR, ...segments);
  const uploadsRoot = path.resolve(UPLOADS_DIR);

  if (resolved !== uploadsRoot && resolved.startsWith(`${uploadsRoot}${path.sep}`)) {
    return resolved;
  }

  return null;
}

async function existingFile(filePath: string | null) {
  if (!filePath) {
    return null;
  }

  try {
    const fileStat = await stat(filePath);
    return fileStat.isFile() ? filePath : null;
  } catch {
    return null;
  }
}

function getContentType(filePath: string) {
  return MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
}

async function serveUpload(params: Promise<RouteParams>, includeBody: boolean) {
  const { segments = [] } = await params;
  const requestedPath = resolveUploadPath(segments);
  const filePath = (await existingFile(requestedPath)) || FALLBACK_IMAGE;
  const headers = {
    'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    'Content-Type': getContentType(filePath),
  };

  if (!includeBody) {
    return new NextResponse(null, { status: 200, headers });
  }

  const fileBuffer = await readFile(filePath);
  return new NextResponse(new Uint8Array(fileBuffer), { status: 200, headers });
}

export async function GET(_request: Request, { params }: { params: Promise<RouteParams> }) {
  return serveUpload(params, true);
}

export async function HEAD(_request: Request, { params }: { params: Promise<RouteParams> }) {
  return serveUpload(params, false);
}
