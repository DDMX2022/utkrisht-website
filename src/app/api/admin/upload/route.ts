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
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (file.size === 0) {
      return NextResponse.json({ error: 'Empty file upload' }, { status: 400 });
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
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 });
    }

    const res: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder },
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
      stream.end(buffer);
    });

    const media = await db.media.create({
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
    // Cloudinary sometimes includes request echo in error.message when auth fails; do not log raw message
    const isAuthError =
      typeof err?.message === 'string' && /invalid\s*api_key|api\s*key\s*invalid/i.test(err.message);
    console.error('[UPLOAD_ERROR] Summary:', {
      code: err?.code,
      http_code: err?.http_code,
      kind: isAuthError ? 'CLOUDINARY_AUTH' : 'GENERIC',
      stack: err?.stack ? String(err.stack).split('\n').slice(0, 3) : undefined,
    });
    if (err?.http_code === 400 && /File size too large/i.test(err.message)) {
      return NextResponse.json(
        { error: 'Cloudinary: file too large (limit 10MB on free plan)' },
        { status: 413 }
      );
    }
    if (err?.code === 'ENOTFOUND') {
      const res = NextResponse.json(
        {
          error:
            'DNS error reaching api.cloudinary.com. Check internet/VPN/DNS and retry.',
        },
        { status: 502 }
      );
      res.headers.set('Retry-After', '10');
      return res;
    }
    if (isAuthError) {
      return NextResponse.json(
        { error: 'Upload failed: Cloudinary credentials rejected. Verify CLOUDINARY_* env vars.' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Upload failed due to an unexpected server error.' },
      { status: 500 }
    );
  }
}
