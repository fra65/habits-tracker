
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {

  // Permetti la richiesta
  return NextResponse.next();

}

// Configura le rotte dove applicare il middleware (opzionale)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

// export { auth as middleware } from "@/lib/auth"

