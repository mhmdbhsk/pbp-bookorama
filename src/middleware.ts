// middleware.ts
import { Role } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest, _next: NextFetchEvent) {
  const { pathname } = request.nextUrl;
  const protectedPaths = ['/admin', '/app'];
  const matchesProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (matchesProtectedPath) {
    const token = await getToken({ req: request });

    if (!token) {
      const url = new URL(`/login`, request.url);
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith('/admin') && (token.role as unknown) !== 'ADMIN') {
      const url = new URL(`/forbidden`, request.url);
      return NextResponse.rewrite(url);
    }

    if (pathname.startsWith('/app') && (token.role as unknown) !== 'CUSTOMER') {
      const url = new URL(`/forbidden`, request.url);
      return NextResponse.rewrite(url);
    }
  }
  return NextResponse.next();
}
