import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

const protectedRoutes = ['/dashboard', '/books'];
const authRoutes = ['/login', '/register'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token')?.value;

  // Check if trying to access protected routes
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if trying to access auth routes
  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyToken(token);
    if (!payload) {
      const loginUrl = new URL('/login', req.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.set('token', '', { maxAge: 0 });
      return response;
    }
  }

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && token) {
    const payload = await verifyToken(token);
    if (payload) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/books/:path*', '/login', '/register'],
};
