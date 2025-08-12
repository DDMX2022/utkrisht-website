import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, unauthorized } from '@/lib/admin';

import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return unauthorized();
  const posts = await db.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
    include: { coverImage: true },
  });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return unauthorized();
  const data = await req.json();
  // data may contain: title, status, excerpt, content, coverImageId, externalUrl, authorName
  const post = await db.blogPost.create({ data });
  return NextResponse.json(post, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return unauthorized();
  const data = await req.json();
  const { id, ...rest } = data;
  const post = await db.blogPost.update({ where: { id }, data: rest });
  return NextResponse.json(post);
}

export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return unauthorized();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await db.blogPost.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
