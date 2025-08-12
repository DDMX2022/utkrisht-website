import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, unauthorized } from '@/lib/admin';
import { db } from '@/lib/db';

const pdb: any = db as any;

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return unauthorized();
  const items = await pdb.portfolioItem.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return unauthorized();
  const data = await req.json();
  const item = await pdb.portfolioItem.create({ data });
  return NextResponse.json(item, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return unauthorized();
  const { id, ...rest } = await req.json();
  const item = await pdb.portfolioItem.update({ where: { id }, data: rest });
  return NextResponse.json(item);
}

export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return unauthorized();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await pdb.portfolioItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
