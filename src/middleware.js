import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('authToken'); // Assuming you set an auth token in cookies

  if (!token) {
    const loginUrl = new URL('/LoginPage', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Define protected routes
export const config = {
  matcher: ['/Dashboard', '/Dashboard/:path*'], // Add protected routes here
};
