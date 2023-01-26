import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // console.log('middle', request.url);
}

// Supports both a single string value or an array of matchers
export const config = {
  matcher: ['/chat'],
}