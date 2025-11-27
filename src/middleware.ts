import { NextResponse, type NextRequest } from 'next/server';
import { decrypt } from '@/lib/session';

const protectedRoutes = ['/admin'];
const publicRoutes = ['/admin/login'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((p) => path.startsWith(p)) && !publicRoutes.some((p) => path.startsWith(p));
  const isPublicRoute = publicRoutes.some((p) => path.startsWith(p));

  const cookie = req.cookies.get('session')?.value;
  const session = await decrypt(cookie || "");
 
  if (isProtectedRoute && !session?.user) {
    return NextResponse.redirect(new URL('/admin/login', req.nextUrl));
  }

  if (isPublicRoute && session?.user && path.startsWith('/admin/login')) {
      return NextResponse.redirect(new URL('/admin', req.nextUrl));
  }
 
  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
