import { NextResponse, NextRequest } from 'next/server';
import { requireAdmin, unauthorized } from '@/lib/admin';
import { cloudinary } from '@/lib/cloudinary';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return unauthorized();

  try {
    const envCloud = process.env.CLOUDINARY_CLOUD_NAME || '';
    const envKey = process.env.CLOUDINARY_API_KEY || '';
    const envSecret = process.env.CLOUDINARY_API_SECRET || '';
    const tCloud = envCloud.trim();
    const tKey = envKey.trim();
    const tSecret = envSecret.trim();
    console.info('[CLOUDINARY_ENV_HEALTH]', {
      cloudName_last4: tCloud ? tCloud.slice(-4) : null,
      apiKey_last4: tKey ? tKey.slice(-4) : null,
      haveSecret: Boolean(tSecret),
      hadWhitespace: {
        cloudName: tCloud !== envCloud,
        apiKey: tKey !== envKey,
        apiSecret: tSecret !== envSecret,
      },
    });

    // Simple credentials check without uploading a file
    // cloudinary.api.ping() should return { status: 'ok' } when creds are valid
    // @ts-ignore types may not include ping
    const res = await (cloudinary as any).api.ping();
    return NextResponse.json(
      {
        ok: true,
        cloud: res?.status === 'ok' ? 'ok' : res,
        env: {
          cloudName_last4: tCloud ? tCloud.slice(-4) : null,
          apiKey_last4: tKey ? tKey.slice(-4) : null,
          haveSecret: Boolean(tSecret),
          hadWhitespace: {
            cloudName: tCloud !== envCloud,
            apiKey: tKey !== envKey,
            apiSecret: tSecret !== envSecret,
          },
        },
      },
      { status: 200 }
    );
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
