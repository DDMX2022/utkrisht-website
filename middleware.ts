import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PUBLIC_FILE = /(.*)\.(.*)$/;

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Skip static assets and NextAuth endpoints
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/fonts') ||
    pathname.startsWith('/api/auth') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const isAdminPage = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');
  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const role = (token as any)?.role;
  const allowed = token && (role === 'ADMIN' || role === 'SUPERADMIN');

  if (!allowed) {
    if (isAdminApi) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    // Keep original destination so we can go back after login
    if (search) url.search = search;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
