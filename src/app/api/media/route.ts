import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const folder = searchParams.get('folder') || undefined;

    // Build conditions. Treat `folder` as a prefix so it also matches subfolders
    // e.g., folder=utkrisht/gallery matches utkrisht/gallery and utkrisht/gallery/*
    const conditions: any[] = [];

    if (folder) {
      const prefix = folder.endsWith('/') ? folder : folder + '/';
      conditions.push({
        OR: [
          { folder: { equals: folder } },
          { folder: { startsWith: prefix } },
        ],
      });
    }

    if (category) {
      conditions.push({ category });
    }

    const where = conditions.length ? { AND: conditions } : undefined;

    const media = await db.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(media);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load media' }, { status: 500 });
  }
}
