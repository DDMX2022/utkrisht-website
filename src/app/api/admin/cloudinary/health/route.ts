import { NextResponse, NextRequest } from 'next/server';
import { requireAdmin, unauthorized } from '@/lib/admin';
import { cloudinary } from '@/lib/cloudinary';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return unauthorized();

  try {
    // Simple credentials check without uploading a file
    // cloudinary.api.ping() should return { status: 'ok' } when creds are valid
    // @ts-ignore types may not include ping
    const res = await (cloudinary as any).api.ping();
    return NextResponse.json({ ok: true, cloud: res?.status === 'ok' ? 'ok' : res }, { status: 200 });
  } catch (err: any) {
    const http = err?.http_code ?? 500;
    const kind = http === 401 || http === 403 ? 'AUTH' : 'GENERIC';
    return NextResponse.json(
      {
        ok: false,
        error:
          kind === 'AUTH'
            ? 'Cloudinary credentials rejected. Verify CLOUDINARY_* env vars.'
            : 'Cloudinary ping failed. Check network and credentials.',
        http_code: http,
      },
      { status: 200 }
    );
  }
}
