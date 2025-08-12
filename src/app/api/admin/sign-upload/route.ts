import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, unauthorized } from '@/lib/admin';

import { getUploadSignature } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return unauthorized();
  const { folder } = await req.json().catch(() => ({ folder: 'utkrisht' }));
  const sig = getUploadSignature(folder || 'utkrisht');
  return NextResponse.json(sig);
}
