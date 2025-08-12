import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get('limit') || '0') || undefined;

    const posts = await db.blogPost.findMany({
      where: { status: 'Published' },
      orderBy: { createdAt: 'desc' },
      include: { coverImage: true, author: true },
      take: limit,
    });

    return NextResponse.json(posts);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load blog posts' }, { status: 500 });
  }
}
