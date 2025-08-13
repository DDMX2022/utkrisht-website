import { NextRequest, NextResponse } from 'next/server';

import { getToken } from 'next-auth/jwt';

export async function requireAdmin(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const role = (token as any)?.role;
  if (!token || (role !== 'ADMIN' && role !== 'SUPERADMIN')) {
    return null;
  }
  return token;
}

export function unauthorized() {
  return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}
