import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/dashboard', '/services/add', '/services/manage', '/ai/assistant', '/profile', '/admin'];

export function proxy(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const isProtected = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

  if (isProtected && !accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (accessToken) {
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const role = payload.role;

      if (request.nextUrl.pathname.startsWith('/admin') && role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
      if ((request.nextUrl.pathname.startsWith('/services/add') || request.nextUrl.pathname.startsWith('/services/manage')) && role !== 'provider') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    } catch {
      // Token decode failed — let the protected layout handle it
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/services/add/:path*', '/services/manage/:path*', '/ai/assistant/:path*', '/profile/:path*', '/admin/:path*'],
};
