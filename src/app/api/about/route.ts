import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get('limit');
    const limit = Math.max(1, Math.min(50, parseInt(limitParam || '1', 10) || 1));

    const items = await db.media.findMany({
      where: {
        OR: [
          { folder: 'utkrisht/about' },
          { AND: [{ folder: null }, { category: 'About' }] },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json(items);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load about media' }, { status: 500 });
  }
}
