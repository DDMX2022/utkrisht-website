import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, unauthorized } from '@/lib/admin';
import { cloudinary } from '@/lib/cloudinary';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// A tiny 1x1 transparent PNG (85 bytes)
const TINY_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=';

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return unauthorized();

  try {
    const rawCloud = process.env.CLOUDINARY_CLOUD_NAME || '';
    const rawKey = process.env.CLOUDINARY_API_KEY || '';
    const rawSec = process.env.CLOUDINARY_API_SECRET || '';
    const cloud = rawCloud.trim();
    const key = rawKey.trim();
    const sec = rawSec.trim();
    console.info('[CLOUDINARY_ENV_TEST]', {
      cloudName_last4: cloud ? cloud.slice(-4) : null,
      apiKey_last4: key ? key.slice(-4) : null,
      haveSecret: Boolean(sec),
      hadWhitespace: {
        cloudName: cloud !== rawCloud,
        apiKey: key !== rawKey,
        apiSecret: sec !== rawSec,
      },
    });
    if (!cloud || !key || !sec) {
      return NextResponse.json(
        { ok: false, error: 'Cloudinary not configured', code: 'CONFIG' },
        { status: 500 }
      );
    }

    const buffer = Buffer.from(TINY_PNG_BASE64, 'base64');

    const uploadOnce = () =>
      new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'utkrisht/health-check', resource_type: 'image', timeout: 30000 },
          (err, result) => {
            if (err) return reject(err);
            resolve(result as any);
          }
        );
        stream.end(buffer);
      });

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const shouldRetry = (e: any) => {
      const http = e?.http_code ?? e?.statusCode ?? e?.status ?? e?.error?.http_code;
      const msg = (e?.message || e?.error?.message || '').toString();
      return http >= 500 || ['ECONNRESET', 'ETIMEDOUT', 'EAI_AGAIN'].includes(e?.code) || /upstream|server error|timeout|invalid json response|unexpected token/i.test(msg);
    };

    let res: any;
    let lastErr: any;
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        res = await uploadOnce();
        lastErr = undefined;
        break;
      } catch (e: any) {
        lastErr = e;
        if (attempt < 5 && shouldRetry(e)) {
          // Exponential backoff with jitter: 500ms, 1500ms, 3500ms, 7500ms
          const baseDelay = 500 * Math.pow(2, attempt - 1);
          const jitter = Math.random() * 200;
          await sleep(baseDelay + jitter);
          continue;
        }
        throw e;
      }
    }

    // Best-effort cleanup
    try {
      await cloudinary.uploader.destroy(res.public_id);
    } catch {}

    return NextResponse.json(
      {
        ok: true,
        uploaded: {
          publicId: res.public_id,
          width: res.width,
          height: res.height,
          bytes: res.bytes,
          resourceType: res.resource_type,
          folder: res.folder,
        },
        env: {
          cloudName_last4: cloud.slice(-4),
          apiKey_last4: key.slice(-4),
          haveSecret: Boolean(sec),
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    const http = err?.http_code ?? err?.statusCode ?? err?.status ?? err?.error?.http_code;
    const msg = (err?.message || err?.error?.message || '').toString();
    const isAuth = http === 401 || http === 403 || /invalid\s*(api[_\s-]?key|signature|credentials)/i.test(msg);
    const isRate = http === 429;
    const isUp = http && http >= 500;
    const isNet = ['ENOTFOUND', 'ECONNRESET', 'ETIMEDOUT', 'EAI_AGAIN'].includes(err?.code);

    const summary = {
      ok: false,
      code: isAuth
        ? 'CLOUDINARY_AUTH'
        : isRate
        ? 'RATE_LIMIT'
        : isUp
        ? 'UPSTREAM'
        : isNet
        ? 'NETWORK'
        : 'UNEXPECTED',
      http_code: http ?? null,
      hint:
        isAuth
          ? 'Check that the API key/secret belong to this cloud and have Full Access (upload/write). Rotate credentials if unsure.'
          : isNet
          ? 'Network/DNS issue while reaching Cloudinary.'
          : isUp
          ? 'Cloudinary upstream error. Retry later.'
          : isRate
          ? 'Cloudinary rate limit. Wait and retry.'
          : 'Unexpected error.',
    };

    return NextResponse.json(summary, { status: 200 });
  }
}
