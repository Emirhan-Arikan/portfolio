import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const pathname = req.nextUrl.pathname;

  // ✅ Allow login page
  if (pathname === "/admin/login") {
    return res;
  }

  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase is not configured, allow access (development mode)
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    return res;
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              res.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { session },
    } = await supabase.auth.getSession();

    // 🔒 Protect admin pages except login
    if (!session && pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  } catch (error) {
    console.error('Middleware error:', error);
    // Allow access if there's an error (development mode)
    return res;
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};