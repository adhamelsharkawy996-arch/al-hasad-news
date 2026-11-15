import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

const PROTECTED_PAGES = ['/admin/dashboard', '/admin/articles/new', '/admin/categories', '/admin/media'];
const PROTECTED_API = ['/api/admin/data'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin pages (except login)
  if (pathname.startsWith('/admin') && pathname !== '/admin') {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // Protect admin API routes
  if (PROTECTED_API.some(p => pathname.startsWith(p))) {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // Protect write operations on public APIs
  if (['POST', 'PUT', 'DELETE'].includes(request.method)) {
    if (pathname.startsWith('/api/articles') || pathname.startsWith('/api/categories') || pathname.startsWith('/api/images')) {
      const user = await getCurrentUser();
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
  }

  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // No cache for admin
  if (pathname.startsWith('/admin')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
