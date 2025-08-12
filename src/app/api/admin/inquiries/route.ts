import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, unauthorized } from '@/lib/admin';

import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return unauthorized();
  const inquiries = await db.contactInquiry.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(inquiries);
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return unauthorized();
  const { id, status } = await req.json();
  const inquiry = await db.contactInquiry.update({
    where: { id },
    data: { status },
  });
  return NextResponse.json(inquiry);
}

export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return unauthorized();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await db.contactInquiry.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
