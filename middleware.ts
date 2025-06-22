import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const path = request.nextUrl.pathname;

  // Публичные пути
  if (path === '/' || path.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Проверка аутентификации
  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Проверка токена и роли
  try {
    const decoded = await verifyToken(token);
    
    // Проверка доступа по ролям
    if (path.startsWith('/admin') && decoded.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/citizen', request.url));
    }
    
    if (path.startsWith('/citizen') && decoded.role !== 'CITIZEN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Токен недействителен
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.delete('accessToken');
    return response;
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};