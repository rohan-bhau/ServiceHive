import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/dashboard', '/services/add', '/services/manage', '/ai/assistant', '/profile'];

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const isProtected = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

  if (isProtected && !accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/services/add/:path*', '/services/manage/:path*', '/ai/assistant/:path*', '/profile/:path*'],
};
