import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, unauthorized } from '@/lib/admin';

import { cloudinary } from '@/lib/cloudinary';
import { db } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return unauthorized();

  try {
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.toLowerCase().includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Unsupported content-type. Use multipart/form-data and -F to send a real file.' },
        { status: 415 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file');
    const title = formData.get('title') as string | null;
    const category = (formData.get('category') as string | null) || null;
    const projectId = (formData.get('projectId') as string | null) || null;
    const portfolioId = (formData.get('portfolioId') as string | null) || null;

    // Map section category to Cloudinary folder
    const folderMap: Record<string, string> = {
      Hero: 'utkrisht/hero',
      About: 'utkrisht/about',
      Services: 'utkrisht/services',
      Team: 'utkrisht/team',
      Gallery: 'utkrisht/gallery',
      Projects: 'utkrisht/projects',
      Portfolio: 'utkrisht/portfolio',
      Blog: 'utkrisht/blog',
    };
    const isTopLevel = !!(category && folderMap[category]);
    const baseFolder = isTopLevel
      ? folderMap[category as keyof typeof folderMap]
      : 'utkrisht/gallery';

    // Determine destination folder
    let folder = baseFolder;
    if (projectId) folder = `${folderMap['Projects']}/${projectId}`;
    else if (portfolioId) folder = `${folderMap['Portfolio']}/${portfolioId}`;
    else if (!isTopLevel && category) {
      // Save gallery images in subfolders per category
      folder = `${folderMap['Gallery']}/${slugify(category)}`;
    }

    // Enforce Team limit: max 2 photos
    if (category === 'Team') {
      const count = await db.media.count({
        where: { folder: folderMap['Team'] },
      });
      if (count >= 2) {
        return NextResponse.json(
          { error: 'Team photos limit reached (2).' },
          { status: 400 }
        );
      }
    }

    if (!file || !(file instanceof File)) {
      console.log('[UPLOAD_DEBUG] File validation failed:', { file, isFile: file instanceof File });
      return NextResponse.json({ error: 'No file provided', code: 'NO_FILE' }, { status: 400 });
    }
    if (file.size === 0) {
      return NextResponse.json({ error: 'Empty file upload', code: 'EMPTY_FILE' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File exceeds 10MB limit (${(file.size / 1024 / 1024).toFixed(
            2
          )}MB)`,
        },
        { status: 413 }
      );
    }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

    // Basic Cloudinary configuration validation
    const envCloud = process.env.CLOUDINARY_CLOUD_NAME || '';
    const envKey = process.env.CLOUDINARY_API_KEY || '';
    const envSecret = process.env.CLOUDINARY_API_SECRET || '';
    const tCloud = envCloud.trim();
    const tKey = envKey.trim();
    const tSecret = envSecret.trim();
    // Masked debug log for production diagnostics
    console.info('[CLOUDINARY_ENV]', {
      cloudName_last4: tCloud ? tCloud.slice(-4) : null,
      apiKey_last4: tKey ? tKey.slice(-4) : null,
      haveSecret: Boolean(tSecret),
      hadWhitespace: {
        cloudName: tCloud !== envCloud,
        apiKey: tKey !== envKey,
        apiSecret: tSecret !== envSecret,
      },
    });
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 });
    }

    // Upload with retry on transient upstream/network errors
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const shouldRetry = (e: any) => {
      const http = e?.http_code ?? e?.statusCode ?? e?.status ?? e?.error?.http_code;
      const msg = (e?.message || e?.error?.message || '').toString();
      return (
        http >= 500 ||
        e?.code === 'ECONNRESET' ||
        e?.code === 'ETIMEDOUT' ||
        e?.code === 'EAI_AGAIN' ||
        /upstream|temporarily unavailable|server error|timeout|invalid json response|unexpected token/i.test(msg)
      );
    };
    const uploadOnce = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder, resource_type: 'image', timeout: 60000 },
          (err, result) => {
            if (err) return reject(err);
            resolve(result as any);
          }
        );
        stream.end(buffer);
      });

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

    let media;
    try {
      media = await db.media.create({
        data: {
          publicId: res.public_id,
          url: res.secure_url,
          width: res.width,
          height: res.height,
          format: res.format,
          resourceType: res.resource_type,
          folder: folder,
          bytes: res.bytes,
          title: title || null,
          category: category || null,
        },
      });
    } catch (dbErr) {
      // Try to clean up the uploaded asset if DB save fails
      try { await cloudinary.uploader.destroy(res.public_id); } catch {}
      return NextResponse.json(
        { error: 'Failed to save media metadata.', code: 'DB_ERROR' },
        { status: 500 }
      );
    }

    // Attach to Project or Portfolio if provided
    if (projectId) {
      const project = await db.project.findUnique({ where: { id: projectId } });
      if (!project) {
        try {
          await cloudinary.uploader.destroy(res.public_id);
        } catch {}
        return NextResponse.json(
          { error: 'Invalid projectId' },
          { status: 400 }
        );
      }
      const nextOrder = await db.projectImage.count({ where: { projectId } });
      const projectImage = await db.projectImage.create({
        data: {
          projectId,
          url: media.url,
          mediaId: media.id,
          order: nextOrder,
        },
      });
      return NextResponse.json({ media, projectImage }, { status: 201 });
    }

    if (portfolioId) {
      const pdb: any = db as any;
      const item = await pdb.portfolioItem.findUnique({
        where: { id: portfolioId },
      });
      if (!item) {
        try {
          await cloudinary.uploader.destroy(res.public_id);
        } catch {}
        return NextResponse.json(
          { error: 'Invalid portfolioId' },
          { status: 400 }
        );
      }
      const updated = await pdb.portfolioItem.update({
        where: { id: portfolioId },
        data: { imageUrl: media.url },
      });
      return NextResponse.json(
        { media, portfolioItem: updated },
        { status: 201 }
      );
    }

    return NextResponse.json(media, { status: 201 });
  } catch (err: any) {
    // Normalize Cloudinary error shape
  const http = err?.http_code ?? err?.statusCode ?? err?.status ?? err?.error?.http_code;
    const msg = (err?.message || err?.error?.message || '').toString();
    // Cloudinary sometimes includes request echo in error.message when auth fails; do not log raw message
    const isAuthError =
      http === 401 || http === 403 || /invalid\s*(api[_\s-]?key|signature|credentials)/i.test(msg);
    // Sanitize message to avoid leaking secrets or echoed payload
    const envKey = process.env.CLOUDINARY_API_KEY?.trim();
    const envSecret = process.env.CLOUDINARY_API_SECRET?.trim();
    const sanitize = (s: string) => {
      let out = s;
      const rAll = (str: string, find: string, rep: string) => (find ? str.split(find).join(rep) : str);
      if (envKey) out = rAll(out, envKey, '***');
      if (envSecret) out = rAll(out, envSecret, '***');
      // Mask long digit/word tokens (e.g., api_key numbers, signatures)
      out = out.replace(/([A-Za-z0-9\/+_=]{10,})/g, '***');
      // Trim to a reasonable length
      if (out.length > 300) out = out.slice(0, 300) + '…';
      return out;
    };
    const hint =
      isAuthError
        ? 'CLOUDINARY_AUTH'
        : (http && http >= 500)
        ? 'UPSTREAM'
        : err?.code === 'ENOTFOUND' || err?.code === 'ECONNRESET' || err?.code === 'ETIMEDOUT' || err?.code === 'EAI_AGAIN'
        ? 'NETWORK'
        : /timeout/i.test(msg)
        ? 'TIMEOUT'
        : /rate\s*limit/i.test(msg) || http === 429
        ? 'RATE_LIMIT'
        : 'UNEXPECTED';
    console.error('[UPLOAD_ERROR_DETAIL]', {
      http_code: http,
      code: err?.code,
      name: err?.name,
      kind: hint,
      message: sanitize(msg),
    });
    console.error('[UPLOAD_ERROR] Summary:', {
      code: err?.code,
      http_code: http,
      kind: isAuthError ? 'CLOUDINARY_AUTH' : 'GENERIC',
      stack: err?.stack ? String(err.stack).split('\n').slice(0, 3) : undefined,
    });
    if ((http === 400) && /File size too large/i.test(msg)) {
      return NextResponse.json(
        { error: 'Cloudinary: file too large (limit 10MB on free plan)', code: 'FILE_TOO_LARGE' },
        { status: 413 }
      );
    }
  if (err?.code === 'ENOTFOUND' || err?.code === 'ECONNRESET' || err?.code === 'ETIMEDOUT' || err?.code === 'EAI_AGAIN') {
      const res = NextResponse.json(
        {
      error: 'Network error reaching Cloudinary. Check internet/VPN/DNS and retry.',
      code: 'NETWORK',
        },
        { status: 502 }
      );
      res.headers.set('Retry-After', '10');
      return res;
    }
    if (isAuthError) {
      return NextResponse.json(
        { error: 'Upload failed: Cloudinary credentials rejected. Verify CLOUDINARY_* env vars.', code: 'CLOUDINARY_AUTH' },
        { status: 500 }
      );
    }
    if ((http === 400) && /Invalid image file|Unsupported image format/i.test(msg)) {
      return NextResponse.json(
        { error: 'Invalid or unsupported image file.', code: 'BAD_IMAGE' },
        { status: 400 }
      );
    }
    if (http === 499 || /timeout/i.test(msg)) {
      return NextResponse.json(
        { error: 'Upload timed out. Please retry.', code: 'TIMEOUT' },
        { status: 504 }
      );
    }
    if (http === 429) {
      return NextResponse.json(
        { error: 'Cloudinary rate limit reached. Please wait and retry.', code: 'RATE_LIMIT' },
        { status: 429 }
      );
    }
    if (http && http >= 500) {
      return NextResponse.json(
        { 
          error: /invalid json response|unexpected token|doctype/i.test(msg) 
            ? 'Cloudinary API is returning HTML error pages instead of JSON. Their service is degraded - retry in a few minutes.'
            : 'Cloudinary upstream error. Please retry.', 
          code: 'UPSTREAM' 
        },
        { status: 502 }
      );
    }
    return NextResponse.json(
      { error: 'Upload failed due to an unexpected server error.', code: 'UNEXPECTED', http_code: http ?? 500 },
      { status: 500 }
    );
  }
}
