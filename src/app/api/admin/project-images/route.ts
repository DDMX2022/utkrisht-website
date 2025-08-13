import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, unauthorized } from '@/lib/admin';

import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return unauthorized();
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');
  if (!projectId)
    return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
  const images = await db.projectImage.findMany({
    where: { projectId },
    orderBy: { order: 'asc' },
  });
  return NextResponse.json(images);
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return unauthorized();
  const body = await req.json();
  const { projectId, url, mediaId, order = 0 } = body || {};
  if (!projectId || !url)
    return NextResponse.json(
      { error: 'Missing projectId or url' },
      { status: 400 }
    );
  const img = await db.projectImage.create({
    data: { projectId, url, mediaId: mediaId || null, order },
  });
  return NextResponse.json(img, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return unauthorized();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await db.projectImage.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
