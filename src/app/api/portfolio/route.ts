import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const takeParam = searchParams.get('limit');
    const take = takeParam ? Math.max(1, Math.min(50, parseInt(takeParam, 10) || 0)) : undefined;

    const items = await db.portfolioItem.findMany({
      where: {
        status: 'Published',
        ...(category ? { category } : {}),
      },
      orderBy: { createdAt: 'desc' },
      ...(take ? { take } : {}),
    });

    return NextResponse.json(items);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load portfolio' }, { status: 500 });
  }
}
